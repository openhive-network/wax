#!/bin/bash

set -xeuo pipefail

# Build wax wheel in manylinux environment
# Usage: build_wax_manylinux.sh <python_version>
# Example: build_wax_manylinux.sh 3.12

PYTHON_VERSION=${1:-3.14}
PYTHON_VERSION_NODOT=${PYTHON_VERSION//./}

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="${SCRIPT_DIR}/.."

# Mark the mounted directory as safe for Git operations
# This is needed because the volume is mounted from a different user
git config --global --add safe.directory /wax
git config --global --add safe.directory /wax/hive

echo "Building wax wheel for Python ${PYTHON_VERSION}"

# Select Python interpreter - check manylinux paths first, then fall back to system python
MANYLINUX_PYTHON_PATH="/opt/python/cp${PYTHON_VERSION_NODOT}-cp${PYTHON_VERSION_NODOT}/bin"
if [ -d "${MANYLINUX_PYTHON_PATH}" ]; then
    echo "Using manylinux Python from ${MANYLINUX_PYTHON_PATH}"
    export PATH="${MANYLINUX_PYTHON_PATH}:${PATH}"
    PYTHON_BIN="${MANYLINUX_PYTHON_PATH}/python"
else
    echo "Manylinux Python path not found, using system Python"
    PYTHON_BIN="python3"
fi

echo "Using Python: $(which ${PYTHON_BIN})"
${PYTHON_BIN} --version

# Install build dependencies
echo "Installing build dependencies..."
${PYTHON_BIN} -m pip install --upgrade pip
${PYTHON_BIN} -m pip install poetry cython setuptools poetry-dynamic-versioning

# Set up Boost - check if WAX_BOOST_ROOT is set, otherwise try to find it
if [ -z "${WAX_BOOST_ROOT:-}" ]; then
    # Try common locations (including manylinux image location)
    for dir in /wax_boost_root /usr/local/boost /opt/boost /usr/include/boost; do
        if [ -d "$dir" ]; then
            export WAX_BOOST_ROOT="$dir"
            break
        fi
    done
fi

if [ -z "${WAX_BOOST_ROOT:-}" ]; then
    echo "WAX_BOOST_ROOT not set and Boost not found in common locations"
    echo "Please set WAX_BOOST_ROOT environment variable"
    exit 1
fi
echo "Using Boost from: ${WAX_BOOST_ROOT}"

# Set unique virtualenv path per Python version to avoid conflicts
export POETRY_VIRTUALENVS_PATH="${PROJECT_DIR}/poetry-venv-root-py${PYTHON_VERSION_NODOT}"

# Call the main build script
echo "Invoking build_wax.sh..."
${SCRIPT_DIR}/build_wax.sh 1

DIST_DIR="${PROJECT_DIR}/dist"
echo "Build complete for Python ${PYTHON_VERSION}"
ls -la ${DIST_DIR}/
