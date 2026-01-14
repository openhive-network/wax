#!/bin/bash

set -e

# Build wax wheel in manylinux environment
# Usage: build_wax_manylinux.sh <python_version>
# Example: build_wax_manylinux.sh 3.12

PYTHON_VERSION=${1:-3.14}
PYTHON_VERSION_NODOT=${PYTHON_VERSION//./}

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="${SCRIPT_DIR}/.."

echo "Building wax wheel for Python ${PYTHON_VERSION}"

# Set up Python path for manylinux image
PYTHON_BIN="/opt/python/cp${PYTHON_VERSION_NODOT}-cp${PYTHON_VERSION_NODOT}/bin"
if [ ! -d "${PYTHON_BIN}" ]; then
    echo "Python ${PYTHON_VERSION} not found at ${PYTHON_BIN}"
    echo "Available Python versions:"
    ls -la /opt/python/
    exit 1
fi

export PATH="${PYTHON_BIN}:${PATH}"
echo "Using Python: $(which python3)"
python3 --version

# Install build dependencies
echo "Installing build dependencies..."
python3 -m pip install --upgrade pip
python3 -m pip install poetry cython setuptools poetry-dynamic-versioning auditwheel

# Set up Boost - check if WAX_BOOST_ROOT is set, otherwise try to find it
if [ -z "${WAX_BOOST_ROOT}" ]; then
    # Try common locations
    for dir in /usr/local/boost /opt/boost /usr/include/boost; do
        if [ -d "$dir" ]; then
            export WAX_BOOST_ROOT="$dir"
            break
        fi
    done
fi

if [ -z "${WAX_BOOST_ROOT}" ]; then
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

# Repair wheel with auditwheel for manylinux compatibility
DIST_DIR="${PROJECT_DIR}/dist"
echo "Repairing wheel with auditwheel..."
WHEEL_FILE=$(ls ${DIST_DIR}/*.whl 2>/dev/null | grep -v manylinux | head -1)
if [ -n "${WHEEL_FILE}" ]; then
    auditwheel repair "${WHEEL_FILE}" -w "${DIST_DIR}" --plat manylinux_2_39_x86_64 || {
        echo "auditwheel repair failed, wheel may already be compatible"
    }
    # Remove non-manylinux wheel if repair succeeded
    REPAIRED=$(ls ${DIST_DIR}/*manylinux*.whl 2>/dev/null | head -1)
    if [ -n "${REPAIRED}" ] && [ "${REPAIRED}" != "${WHEEL_FILE}" ]; then
        rm -f "${WHEEL_FILE}"
    fi
fi

echo "Build complete for Python ${PYTHON_VERSION}"
ls -la ${DIST_DIR}/
