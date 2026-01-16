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
    print(*args)  # noqa: T201

def useDebugBuild() -> bool:
    return os.getenv("WAX_DEBUG") is not None and os.getenv("WAX_DEBUG") != "0"

def get_python_abi_tag() -> str:
    """Get the Python ABI tag for the shared library name (e.g., '312' or '314')."""
    return f"{sys.version_info.major}{sys.version_info.minor}"

log("Build file loaded...")


class CustomBuild(build_ext):
    _python_abi = get_python_abi_tag()
    output_binary_name = f"cpp_python_bridge.cpython-{_python_abi}d-x86_64-linux-gnu.so" if useDebugBuild() else f"cpp_python_bridge.cpython-{_python_abi}-x86_64-linux-gnu.so"
    root_dir = Path(__file__).parent.absolute()
    package_dir = root_dir / "wax"
    wax_package_shared_lib = package_dir / output_binary_name
    cpp_build_dir = root_dir / ".build"
    logs_dir = cpp_build_dir / "logs"
    build_dir = root_dir / "build"
    build_info = package_dir / "info.json"

    def __configure_project(self, cmake_command: str, ninja_command: str | None, make_command: str | None) -> str:
        configure_args = [
            "-GNinja",
            # Avoid caching python path from temporary venv directory (See `PYTHON_EXECUTABLE:FILEPATH` in CMakeCache.txt)
            "--fresh",
            # Allow CMake 3.27+ to work with older cmake_minimum_required versions in hive submodule
            "-DCMAKE_POLICY_VERSION_MINIMUM=3.5",
            # Enable *_ROOT variables for find_package (CMP0074 for lowercase, CMP0144 for uppercase)
            "-DCMAKE_POLICY_DEFAULT_CMP0074=NEW",
            "-DCMAKE_POLICY_DEFAULT_CMP0144=NEW",
        ]
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

        assert "WAX_BOOST_ROOT" in os.environ, "Invalid build environment - consider using preconfigured wax/ci-base-image"
        boost_root = os.getenv("WAX_BOOST_ROOT")
        configure_args.append("-DBOOST_ROOT={}".format(boost_root))
        configure_args.append("-DBOOST_INCLUDEDIR={}/include".format(boost_root))
        # Add Boost include to CXX flags for fc_core OBJECT library compilation
        configure_args.append("-DCMAKE_CXX_FLAGS=-I{}/include".format(boost_root))

        if "WAX_OPENSSL_ROOT" in os.environ:
            openssl_root = os.getenv("WAX_OPENSSL_ROOT")
            configure_args.append("-DOPENSSL_ROOT_DIR={}".format(openssl_root))
            configure_args.append("-DOPENSSL_INCLUDE_DIR={}/include".format(openssl_root))

        if "WAX_ZLIB_ROOT" in os.environ:
            configure_args.append("-DZLIB_ROOT={}".format(os.getenv("WAX_ZLIB_ROOT")))

        if "WAX_BZIP2_ROOT" in os.environ:
            configure_args.append("-DBZIP2_ROOT={}".format(os.getenv("WAX_BZIP2_ROOT")))

        # Set Python include directory for manylinux builds
        python_include = sysconfig.get_path('include')
        if python_include:
            configure_args.append("-DPYTHON_INCLUDE_DIR={}".format(python_include))

        self.cpp_build_dir.mkdir(exist_ok=True)
        log(f"build will be performed in: {self.cpp_build_dir}")
        self.logs_dir.mkdir(exist_ok=True)
        log(f"all build logs will be saved to: {self.logs_dir.as_posix()}")
        with (self.logs_dir / "cmake_stdout.log").open("w") as stdout, (self.logs_dir / "cmake_stderr.log").open(
            "w"
        ) as stderr:
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
        with (self.logs_dir / "build_stdout.log").open("w") as stdout, (self.logs_dir / "build_stderr.log").open(
            "w"
        ) as stderr:
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
            build_command = self.__configure_project(cmake, ninja, make)
            self.__build_project(build_command)
        self.__copy_binary_to_package_dir()
        self.__remove_corrupted_binary()


def build(setup_kwargs: dict[str, Any]) -> None:
    log("Build with Cython")

    setup_kwargs.update(
        {
            "ext_modules": cythonize(
                [
                    Extension(
                        "cpp_python_bridge", ["cpp_python_bridge.pyx"],
                        include_dirs=['.', './..', './../hive/libraries/protocol/include'],
                        language="c++",
                    ),  # There has to be at least one extension, instead CustomBuild.run won't be called
                ],
                compiler_directives={'always_allow_keywords': True, 'language_level': "3str", 'c_string_type': "bytes", 'c_string_encoding':"utf-8", 'emit_code_comments': True},
                gdb_debug=useDebugBuild()
            ),
            "cmdclass": {"build_ext": CustomBuild},
        }
    )
