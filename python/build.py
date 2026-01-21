from __future__ import annotations

import json
import os
import shutil
import subprocess
import sys
import sysconfig
from datetime import datetime
from pathlib import Path
from typing import Any

from Cython.Build import cythonize  # type: ignore
from setuptools.command.build_ext import build_ext
from setuptools.extension import Extension


def log(*args: Any) -> None:
    # Write to both stderr and a log file for debugging
    msg = " ".join(str(a) for a in args)
    print(msg, file=sys.stderr, flush=True)  # noqa: T201
    # Also append to a build log file (in .build/logs/ which is included in artifacts)
    log_file = Path(__file__).parent / ".build" / "logs" / "build_py.log"
    log_file.parent.mkdir(parents=True, exist_ok=True)
    with open(log_file, "a") as f:
        f.write(msg + "\n")


def useDebugBuild() -> bool:
    return os.getenv("WAX_DEBUG") is not None and os.getenv("WAX_DEBUG") != "0"


def get_python_abi_tag() -> str:
    """Get the Python ABI tag for the shared library name (e.g., '312' or '314')."""
    return f"{sys.version_info.major}{sys.version_info.minor}"


# Module short names (without cython_modules_ prefix)
CYTHON_MODULE_NAMES = [
    "common",
    "handles",
    "validation",
    "crypto",
    "assets",
    "transactions",
    "operations",
    "proto",
    "witness",
    "memo",
    "authority",
    "testing",
]

# Module dependency graph for cimport tracking
# If A cimports B, then change in B.pxd must trigger rebuild of A
# Keys are short names, values are .pxd files (relative to root_dir)
MODULE_DEPENDENCIES: dict[str, list[str]] = {
    "common": ["cpp_python_bridge.pxd", "exception.pxd"],
    "handles": ["cython_modules_common.pxd", "cpp_python_bridge.pxd"],
    "validation": ["cython_modules_common.pxd", "cython_modules_handles.pxd"],
    "crypto": ["cython_modules_common.pxd"],
    "assets": ["cython_modules_common.pxd"],
    "transactions": ["cython_modules_common.pxd", "cython_modules_handles.pxd"],
    "operations": ["cython_modules_common.pxd", "cython_modules_handles.pxd"],
    "proto": [
        "cython_modules_common.pxd",
        "cython_modules_handles.pxd",
        "cython_modules_validation.pxd",
        "cython_modules_transactions.pxd",
    ],
    "witness": ["cython_modules_common.pxd"],
    "memo": ["cython_modules_common.pxd"],
    "authority": ["cython_modules_common.pxd", "cython_modules_handles.pxd"],
    "testing": ["cython_modules_common.pxd"],
}


def should_regenerate_cython(root_dir: Path) -> bool:
    """Check if Cython transpilation is needed for the main facade module."""
    pyx_file = root_dir / "cpp_python_bridge.pyx"
    cpp_file = root_dir / "cpp_python_bridge.cpp"

    if not cpp_file.exists():
        log("Cython cache miss: generated cpp file does not exist")
        return True

    cpp_mtime = cpp_file.stat().st_mtime

    # Check .pyx and its dependencies
    deps = [
        pyx_file,
        root_dir / "cpp_python_bridge.pxd",
        root_dir / "exception.pxd",
        root_dir / "cpython_interface.hpp",
        root_dir / "py_object_ptr.hpp",
        root_dir / "python_managed_object.hpp",
    ]
    for dep in deps:
        if dep.exists() and dep.stat().st_mtime > cpp_mtime:
            log(f"Cython cache miss: {dep.name} is newer than generated cpp file")
            return True

    log("Cython cache hit: using existing generated cpp file")
    return False


def should_regenerate_module(root_dir: Path, module_name: str) -> bool:
    """Check if Cython transpilation is needed for a specific sub-module.

    Files are now in root_dir with cython_modules_ prefix.
    """
    cython_build_dir = root_dir / ".cython_build"
    full_module_name = f"cython_modules_{module_name}"

    pyx_file = root_dir / f"{full_module_name}.pyx"
    pxd_file = root_dir / f"{full_module_name}.pxd"
    cpp_file = cython_build_dir / f"{full_module_name}.cpp"

    if not cpp_file.exists():
        log(f"Cython cache miss [{module_name}]: generated cpp file does not exist")
        return True

    cpp_mtime = cpp_file.stat().st_mtime

    # Check .pyx file
    if pyx_file.exists() and pyx_file.stat().st_mtime > cpp_mtime:
        log(f"Cython cache miss [{module_name}]: {pyx_file.name} is newer than generated cpp")
        return True

    # Check own .pxd file if exists
    if pxd_file.exists() and pxd_file.stat().st_mtime > cpp_mtime:
        log(f"Cython cache miss [{module_name}]: {pxd_file.name} is newer than generated cpp")
        return True

    # Check _decorators.pxi
    decorators_file = root_dir / "_decorators.pxi"
    if decorators_file.exists() and decorators_file.stat().st_mtime > cpp_mtime:
        log(f"Cython cache miss [{module_name}]: _decorators.pxi is newer than generated cpp")
        return True

    # Check all dependencies from MODULE_DEPENDENCIES
    deps = MODULE_DEPENDENCIES.get(module_name, [])
    for dep_path in deps:
        dep_file = root_dir / dep_path
        if dep_file.exists() and dep_file.stat().st_mtime > cpp_mtime:
            log(f"Cython cache miss [{module_name}]: dependency {dep_file.name} is newer than generated cpp")
            return True

    log(f"Cython cache hit [{module_name}]: using existing generated cpp file")
    return False


log("Build file loaded...")


class CustomBuild(build_ext):
    _python_abi = get_python_abi_tag()
    output_binary_name = (
        f"cpp_python_bridge.cpython-{_python_abi}d-x86_64-linux-gnu.so"
        if useDebugBuild()
        else f"cpp_python_bridge.cpython-{_python_abi}-x86_64-linux-gnu.so"
    )
    root_dir = Path(__file__).parent.absolute()
    package_dir = root_dir / "wax"
    wax_package_shared_lib = package_dir / output_binary_name
    cpp_build_dir = root_dir / ".build"
    logs_dir = cpp_build_dir / "logs"
    build_dir = root_dir / "build"
    build_info = package_dir / "info.json"
    cython_build_dir = root_dir / ".cython_build"

    def __configure_project(self, cmake_command: str, ninja_command: str | None, make_command: str | None) -> str:
        configure_args = ["-GNinja"]
        if useDebugBuild():
            configure_args.append("-DCMAKE_BUILD_TYPE=Debug")
        else:
            configure_args.append("-DCMAKE_BUILD_TYPE=Release")
        build_command = ninja_command
        if build_command is None:
            assert make_command is not None, "cannot find neither ninja nor make"
            log(f"cannot find ninja, using {make_command} instead")
            build_command = make_command
            configure_args = []

        if "BUILD_HIVE_TESTNET" in os.environ:
            configure_args.append("-DBUILD_HIVE_TESTNET=ON")

        # Force CMake to use the same Python interpreter that's running this script
        if sys.executable:
            configure_args.append(f"-DPYTHON_EXECUTABLE={sys.executable}")

        # Help CMake find Python headers (needed for manylinux images where headers are at non-standard paths)
        python_include = sysconfig.get_config_var("INCLUDEPY")
        if python_include:
            configure_args.append(f"-DPYTHON_INCLUDE_DIR={python_include}")

        assert "WAX_BOOST_ROOT" in os.environ, (
            "Invalid build environment - consider using preconfigured wax/ci-base-image"
        )
        configure_args.append("-DBOOST_ROOT={}".format(os.getenv("WAX_BOOST_ROOT")))

        self.cpp_build_dir.mkdir(exist_ok=True)
        log(f"build will be performed in: {self.cpp_build_dir}")
        self.logs_dir.mkdir(exist_ok=True)
        log(f"all build logs will be saved to: {self.logs_dir.as_posix()}")
        with (
            (self.logs_dir / "cmake_stdout.log").open("w") as stdout,
            (self.logs_dir / "cmake_stderr.log").open("w") as stderr,
        ):
            log(f"configuring with {cmake_command}")
            subprocess.run(
                [
                    cmake_command,
                    "-S",
                    self.root_dir.as_posix(),
                    "-B",
                    self.cpp_build_dir.as_posix(),
                    *configure_args,
                ],
                stdout=stdout,
                stderr=stderr,
            ).check_returncode()
            log("configuration succeed")
            return build_command

    def __build_project(self, build_command: str) -> None:
        with (
            (self.logs_dir / "build_stdout.log").open("w") as stdout,
            (self.logs_dir / "build_stderr.log").open("w") as stderr,
        ):
            log(f"building with {build_command}")
            subprocess.run(
                [build_command, "-j", f"{os.cpu_count()}"],
                stdout=stdout,
                stderr=stderr,
                cwd=self.cpp_build_dir,
            ).check_returncode()
            log("build succeeded")

    def __discover_binaries(self) -> tuple[str, str | None, str | None]:
        cmake = shutil.which("cmake")
        assert cmake is not None, "cannot find cmake"
        ninja = shutil.which("ninja")
        make = shutil.which("make")
        assert ninja is not None or make is not None, "cannot find any build program"
        return cmake, ninja, make

    def __should_reconfigure_cmake(self) -> bool:
        """Check if CMake reconfiguration is needed based on CMakeLists.txt modification times."""
        cmake_cache = self.cpp_build_dir / "CMakeCache.txt"
        if not cmake_cache.exists():
            log("CMake cache miss: CMakeCache.txt does not exist")
            return True

        cache_mtime = cmake_cache.stat().st_mtime
        key_files = [
            self.root_dir / "CMakeLists.txt",
            self.root_dir.parent / "hive" / "libraries" / "protocol" / "CMakeLists.txt",
            self.root_dir.parent / "hive" / "libraries" / "fc" / "CMakeLists.txt",
        ]

        for f in key_files:
            if f.exists() and f.stat().st_mtime > cache_mtime:
                log(f"CMake cache miss: {f.relative_to(self.root_dir.parent)} is newer than CMakeCache.txt")
                return True

        log("CMake cache hit: skipping reconfiguration")
        return False

    @classmethod
    def __git_revision_from_repo_dir(cls, repo: Path) -> str:
        git_directory = repo / ".git"
        head: str = (git_directory / "HEAD").read_text().split(" ")[-1].strip("\n")
        if (branch_ref := (git_directory / head)).exists():
            head = branch_ref.read_text()
        return head  # noqa: RET504

    @classmethod
    def generate_build_info(cls) -> None:
        with cls.build_info.open() as file:
            json.dump(
                {
                    "build_time": datetime.now(),
                    "clive_rev": cls.__git_revision_from_repo_dir(cls.root_dir.parent),
                    "hive_rev": cls.__git_revision_from_repo_dir(cls.root_dir.parent / "hive"),
                },
                file,
            )

    def __copy_binary_to_package_dir(self) -> None:
        def __copy_file(src: Path, dst: Path) -> None:
            log(f"copying from {src} to {dst}")
            shutil.copyfile(src, dst)

        output_binary = self.cpp_build_dir / self.output_binary_name
        assert output_binary.exists(), f"cannot find {output_binary}"
        __copy_file(output_binary, self.wax_package_shared_lib)
        for sub_build_dir in self.build_dir.glob("lib*"):
            destination = sub_build_dir / "wax"
            if destination.exists():
                __copy_file(output_binary, destination / self.output_binary_name)

    def __create_module_aliases(self) -> None:
        """Create hard links (or copies) for all sub-modules in the same directory as the main .so.

        Hard links are used because:
        1. They are included in wheel packages (unlike symlinks which are skipped)
        2. They share the same inode, so no extra disk space is used
        3. They work across all platforms
        """
        log("Creating module aliases (hard links)...")
        log(f"  Main .so location: {self.wax_package_shared_lib}")
        log(f"  Main .so exists: {self.wax_package_shared_lib.exists()}")
        log(f"  Package dir: {self.package_dir}")
        log(f"  Build dir: {self.build_dir}")

        for module_name in CYTHON_MODULE_NAMES:
            # Alias name: cython_modules_<name>.cpython-<abi>-x86_64-linux-gnu.so
            alias_name = f"cython_modules_{module_name}.cpython-{self._python_abi}"
            if useDebugBuild():
                alias_name += "d"
            alias_name += "-x86_64-linux-gnu.so"

            alias_path = self.package_dir / alias_name

            # Remove existing file if it exists
            if alias_path.exists() or alias_path.is_symlink():
                alias_path.unlink()

            # Create hard link (preferred) or fall back to copy
            try:
                os.link(self.wax_package_shared_lib, alias_path)
                log(f"  Created hard link: {alias_name}")
            except OSError as e:
                # Fall back to file copy if hard links don't work (e.g., cross-filesystem)
                log(f"  Hard link failed for {alias_name}, falling back to copy: {e}")
                shutil.copyfile(self.wax_package_shared_lib, alias_path)

        # Also create aliases in build/lib* directories if they exist (for wheel packaging)
        log(f"  Looking for build/lib* directories in: {self.build_dir}")
        build_lib_dirs = list(self.build_dir.glob("lib*"))
        log(f"  Found build/lib* directories: {build_lib_dirs}")
        for sub_build_dir in build_lib_dirs:
            destination_dir = sub_build_dir / "wax"
            log(f"  Checking destination_dir: {destination_dir}, exists: {destination_dir.exists()}")
            if destination_dir.exists():
                main_so = destination_dir / self.output_binary_name
                log(f"  Main .so in build/lib: {main_so}, exists: {main_so.exists()}")
                if not main_so.exists():
                    continue
                for module_name in CYTHON_MODULE_NAMES:
                    alias_name = f"cython_modules_{module_name}.cpython-{self._python_abi}"
                    if useDebugBuild():
                        alias_name += "d"
                    alias_name += "-x86_64-linux-gnu.so"

                    alias_path = destination_dir / alias_name

                    if alias_path.exists() or alias_path.is_symlink():
                        alias_path.unlink()

                    try:
                        os.link(main_so, alias_path)
                        log(f"    Created hard link in build/lib: {alias_name}")
                    except OSError:
                        shutil.copyfile(main_so, alias_path)
                        log(f"    Created copy in build/lib: {alias_name}")

        # List all .so files in package_dir and build/lib* for verification
        log(f"  Final .so files in {self.package_dir}:")
        for so_file in self.package_dir.glob("*.so"):
            log(f"    {so_file.name}")
        for sub_build_dir in self.build_dir.glob("lib*"):
            destination_dir = sub_build_dir / "wax"
            if destination_dir.exists():
                log(f"  Final .so files in {destination_dir}:")
                for so_file in destination_dir.glob("*.so"):
                    log(f"    {so_file.name}")

    def __remove_corrupted_binary(self) -> None:
        corrupted_in_build = self.build_dir.glob("lib*/*.so")
        corrupted_in_root = self.root_dir.glob("*.so")
        for file in [*corrupted_in_build, *corrupted_in_root]:
            log(f"removing {file} with size {file.stat().st_size}")
            file.unlink()

    def run(self) -> None:
        super().run()
        if "WAX_SKIP_BUILD" not in os.environ:
            cmake, ninja, make = self.__discover_binaries()
            if self.__should_reconfigure_cmake():
                build_command = self.__configure_project(cmake, ninja, make)
            else:
                build_command = ninja if ninja else make
            self.__build_project(build_command)
        self.__copy_binary_to_package_dir()
        self.__create_module_aliases()
        self.__remove_corrupted_binary()


def build(setup_kwargs: dict[str, Any]) -> None:
    log("Build with Cython")

    root_dir = Path(__file__).parent.absolute()
    cython_build_dir = root_dir / ".cython_build"

    # Ensure .cython_build directory exists
    cython_build_dir.mkdir(exist_ok=True)

    # Include directories for all extensions
    include_dirs = [".", "./..", "./../hive/libraries/protocol/include"]

    # Compiler directives for all extensions
    compiler_directives = {
        "always_allow_keywords": True,
        "language_level": "3str",
        "c_string_type": "bytes",
        "c_string_encoding": "utf-8",
        "emit_code_comments": True,
    }

    # Process main facade module (cpp_python_bridge.pyx)
    # Note: We only add the main extension to ext_modules.
    # Sub-modules are transpiled to .cpp but compiled by CMake into the main .so
    if should_regenerate_cython(root_dir):
        log("Running Cython transpilation for cpp_python_bridge...")
        ext_modules = cythonize(
            [
                Extension(
                    "cpp_python_bridge",
                    ["cpp_python_bridge.pyx"],
                    include_dirs=include_dirs,
                    language="c++",
                ),
            ],
            compiler_directives=compiler_directives,
            include_path=["."],
            gdb_debug=useDebugBuild(),
        )
    else:
        log("Skipping Cython transpilation for cpp_python_bridge, using cached cpp file")
        ext_modules = [
            Extension(
                "cpp_python_bridge",
                ["cpp_python_bridge.cpp"],
                include_dirs=include_dirs,
                language="c++",
            )
        ]

    # Process each sub-module - transpile only, do NOT add to ext_modules
    # CMake will compile these .cpp files into the main .so
    # Files are now in root_dir with cython_modules_ prefix
    for module_name in CYTHON_MODULE_NAMES:
        full_module_name = f"cython_modules_{module_name}"
        pyx_file = root_dir / f"{full_module_name}.pyx"

        if not pyx_file.exists():
            log(f"Warning: {pyx_file} does not exist, skipping")
            continue

        if should_regenerate_module(root_dir, module_name):
            log(f"Running Cython transpilation for {module_name}...")
            # Transpile .pyx to .cpp only - don't add to ext_modules
            # Source file is now in root_dir with full name
            cythonize(
                [
                    Extension(
                        full_module_name,
                        [f"{full_module_name}.pyx"],
                        include_dirs=include_dirs,
                        language="c++",
                    ),
                ],
                compiler_directives=compiler_directives,
                include_path=["."],
                gdb_debug=useDebugBuild(),
                build_dir=str(cython_build_dir),
            )
        else:
            log(f"Skipping Cython transpilation for {module_name}, using cached cpp file")

    setup_kwargs.update(
        {
            "ext_modules": ext_modules,
            "cmdclass": {"build_ext": CustomBuild},
        }
    )
