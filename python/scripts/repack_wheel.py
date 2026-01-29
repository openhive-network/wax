#!/usr/bin/env python3
"""
repack_wheel.py - Repack wheel with deduplication of identical .so files.

Creates a deduplicated wheel with _symlinks.json manifest and injects
a restore hook into the package __init__.py that creates symlinks at import time.

Usage:
    python repack_wheel.py <wheel_file> [output_file]

Example:
    python repack_wheel.py dist/hiveio_wax-1.0.0-cp312-cp312-linux_x86_64.whl
"""

import hashlib
import json
import re
import sys
import tempfile
import zipfile
from pathlib import Path


def file_hash(path: Path) -> str:
    """Calculate SHA256 hash of a file."""
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(8192), b""):
            h.update(chunk)
    return h.hexdigest()


def record_hash(path: Path) -> str:
    """Calculate hash in RECORD format (sha256, base64, no padding)."""
    import base64

    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(8192), b""):
            h.update(chunk)
    return "sha256=" + base64.urlsafe_b64encode(h.digest()).rstrip(b"=").decode("ascii")


# Code to inject into __init__.py for restoring symlinks at import time
SYMLINK_RESTORE_CODE = '''
# === Auto-generated symlink restoration code ===
def _restore_symlinks():
    """Restore symlinks from _symlinks.json manifest (runs once at first import)."""
    import json
    import os
    from pathlib import Path

    pkg_dir = Path(__file__).parent
    manifest = pkg_dir / "_symlinks.json"
    marker = pkg_dir / "._symlinks_restored"

    # Skip if already restored or no manifest
    if marker.exists() or not manifest.exists():
        return

    try:
        with open(manifest) as f:
            links = json.load(f)

        for target_rel, source_rel in links.items():
            target = pkg_dir / target_rel.split("/", 1)[-1]  # Remove "wax/" prefix
            source_name = source_rel.split("/")[-1]  # Just the filename for relative symlink

            if not target.exists() and not target.is_symlink():
                try:
                    os.symlink(source_name, target)
                except OSError:
                    # Fall back to copy if symlinks not supported (e.g., Windows without privileges)
                    import shutil

                    source = pkg_dir / source_name
                    if source.exists():
                        shutil.copy2(source, target)

        # Create marker to avoid re-running
        marker.touch()
    except Exception:
        pass  # Silently fail - modules might still work via main .so


_restore_symlinks()
del _restore_symlinks
# === End symlink restoration code ===

'''


def repack_wheel_deduplicated(wheel_path: Path, output_path: Path | None = None) -> Path:
    """Repack a wheel with deduplication and install-time symlink restoration."""
    if output_path is None:
        output_path = wheel_path.with_name(wheel_path.name.replace(".whl", ".dedup.whl"))

    with tempfile.TemporaryDirectory() as tmpdir:
        tmpdir = Path(tmpdir)
        extract_dir = tmpdir / "wheel_contents"

        # Extract wheel
        print(f"  Extracting {wheel_path.name}...")
        with zipfile.ZipFile(wheel_path, "r") as zf:
            zf.extractall(extract_dir)

        # Find package directory (e.g., "wax")
        dist_info = next(extract_dir.glob("*.dist-info"))
        top_level_file = dist_info / "top_level.txt"
        if top_level_file.exists():
            pkg_name = top_level_file.read_text().strip().split()[0]
        else:
            # Guess from directory structure
            pkg_name = next(d.name for d in extract_dir.iterdir() if d.is_dir() and not d.name.endswith(".dist-info"))

        pkg_dir = extract_dir / pkg_name
        print(f"  Package directory: {pkg_name}")

        # Find all .so files and calculate hashes
        so_files: dict[Path, str] = {}
        for so_file in pkg_dir.rglob("*.so"):
            so_files[so_file] = file_hash(so_file)

        print(f"  Found {len(so_files)} .so files")

        # Group by hash to find duplicates
        hash_to_files: dict[str, list[Path]] = {}
        for path, h in so_files.items():
            hash_to_files.setdefault(h, []).append(path)

        # Find duplicates
        duplicates_found = sum(1 for paths in hash_to_files.values() if len(paths) > 1)
        if duplicates_found == 0:
            print("  No duplicates found, nothing to deduplicate")
            # Just copy the original
            import shutil

            shutil.copy2(wheel_path, output_path)
            return output_path

        # Create symlinks manifest and remove duplicates
        symlinks: dict[str, str] = {}  # target_relative -> source_relative
        total_saved = 0

        for h, paths in hash_to_files.items():
            if len(paths) > 1:
                # Sort to ensure deterministic source selection
                paths.sort(key=lambda p: p.name)
                source = paths[0]
                source_rel = source.relative_to(extract_dir).as_posix()
                file_size = source.stat().st_size

                for dup in paths[1:]:
                    dup_rel = dup.relative_to(extract_dir).as_posix()
                    symlinks[dup_rel] = source_rel
                    dup.unlink()
                    total_saved += file_size
                    print(f"    Deduplicated: {dup.name} -> {source.name}")

        print(f"  Removed {len(symlinks)} duplicate files")

        # Write symlinks manifest to package directory
        manifest_path = pkg_dir / "_symlinks.json"
        with open(manifest_path, "w") as f:
            json.dump(symlinks, f, indent=2)
        print(f"  Created _symlinks.json ({len(symlinks)} entries)")

        # Inject restoration code into __init__.py
        init_path = pkg_dir / "__init__.py"
        if init_path.exists():
            init_content = init_path.read_text()
            # Check if already injected
            if "_restore_symlinks" not in init_content:
                # Inject after all __future__ imports (they must be at the beginning)
                lines = init_content.split("\n")
                insert_pos = 0
                in_docstring = False
                docstring_char = None

                for i, line in enumerate(lines):
                    stripped = line.strip()

                    # Track docstrings
                    if not in_docstring:
                        if stripped.startswith('"""') or stripped.startswith("'''"):
                            docstring_char = stripped[:3]
                            # Check if docstring ends on same line
                            if stripped.count(docstring_char) >= 2:
                                insert_pos = i + 1
                            else:
                                in_docstring = True
                                insert_pos = i + 1
                            continue
                    else:
                        if docstring_char in stripped:
                            in_docstring = False
                            insert_pos = i + 1
                        continue

                    # Skip comments and encoding declarations
                    if stripped.startswith("#"):
                        insert_pos = i + 1
                        continue

                    # Skip empty lines at the beginning
                    if not stripped:
                        insert_pos = i + 1
                        continue

                    # Keep __future__ imports at the top
                    if stripped.startswith("from __future__"):
                        insert_pos = i + 1
                        continue

                    # Found first non-future import or code - insert here
                    break

                lines.insert(insert_pos, SYMLINK_RESTORE_CODE)
                init_path.write_text("\n".join(lines))
                print("  Injected symlink restoration hook into __init__.py")

        # Update RECORD file
        record_path = dist_info / "RECORD"
        deleted_files = set(symlinks.keys())
        new_records = []

        with open(record_path) as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                parts = line.split(",")
                if parts[0] not in deleted_files:
                    # Keep existing entry unless it's a file we modified
                    if parts[0] == f"{pkg_name}/__init__.py":
                        # Recalculate hash for modified __init__.py
                        h = record_hash(init_path)
                        size = init_path.stat().st_size
                        new_records.append(f"{parts[0]},{h},{size}")
                    elif parts[0] != f"{dist_info.name}/RECORD":
                        new_records.append(line)

        # Add manifest to RECORD
        manifest_rel = f"{pkg_name}/_symlinks.json"
        h = record_hash(manifest_path)
        size = manifest_path.stat().st_size
        new_records.append(f"{manifest_rel},{h},{size}")

        # RECORD itself has no hash
        new_records.append(f"{dist_info.name}/RECORD,,")

        with open(record_path, "w") as f:
            f.write("\n".join(new_records) + "\n")

        # Repack wheel (with compression)
        print("  Repacking wheel...")
        with zipfile.ZipFile(output_path, "w", compression=zipfile.ZIP_DEFLATED) as zf:
            for file in sorted(extract_dir.rglob("*")):
                if file.is_file():
                    arcname = file.relative_to(extract_dir).as_posix()
                    zf.write(file, arcname)

        # Print size comparison
        original_size = wheel_path.stat().st_size
        new_size = output_path.stat().st_size
        savings = original_size - new_size

        print(f"\n  Original size: {original_size / 1024 / 1024:.2f} MB")
        print(f"  New size:      {new_size / 1024 / 1024:.2f} MB")
        print(f"  Savings:       {savings / 1024 / 1024:.2f} MB ({100 * savings / original_size:.1f}%)")

    return output_path


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(f"Usage: {sys.argv[0]} <wheel_file> [output_file]")
        print("\nExample:")
        print(f"  {sys.argv[0]} dist/hiveio_wax-1.0.0-cp312-cp312-linux_x86_64.whl")
        sys.exit(1)

    wheel_path = Path(sys.argv[1])
    if not wheel_path.exists():
        print(f"Error: {wheel_path} not found")
        sys.exit(1)

    output_path = Path(sys.argv[2]) if len(sys.argv) > 2 else None

    print(f"Repacking {wheel_path.name} with deduplication...")
    result = repack_wheel_deduplicated(wheel_path, output_path)
    print(f"\nCreated: {result}")
