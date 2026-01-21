#!/bin/bash

# Build wax wheel using manylinux_2_28 image for maximum compatibility
# Usage: ./build_wax_manylinux.sh <python_version>
# Example: ./build_wax_manylinux.sh 3.12
#          ./build_wax_manylinux.sh 3.14

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
WAX_DIR="$(cd "${SCRIPT_DIR}/../.." && pwd)"
PROJECT_DIR="${WAX_DIR}/python"

PYTHON_VERSION=${1:-3.14}
DIRECT_EXECUTION=${2:-0}
WAX_DEBUG=${3:-${WAX_DEBUG:-0}}

# Validate Python version
if [[ "${PYTHON_VERSION}" != "3.12" && "${PYTHON_VERSION}" != "3.14" ]]; then
    echo "Error: Python version must be 3.12 or 3.14"
    echo "Usage: $0 <3.12|3.14>"
    exit 1
fi

IMAGE_NAME="wax-manylinux:py${PYTHON_VERSION}-test"

if [ ${DIRECT_EXECUTION} -eq 0 ]; then
    echo "=========================================="
    echo "Building wax wheel for Python ${PYTHON_VERSION}"
    echo "Using manylinux_2_28 image: ${IMAGE_NAME}"
    echo "=========================================="

    # Check if image exists, if not build it
    if ! docker image inspect "${IMAGE_NAME}" > /dev/null 2>&1; then
        echo "Image ${IMAGE_NAME} not found. Building it first..."
        docker buildx build --progress=plain --target=wax-manylinux \
            --build-arg PYTHON_VERSION=${PYTHON_VERSION} \
            -t ${IMAGE_NAME} \
            -f "${PROJECT_DIR}/docker/Dockerfile.manylinux" "${WAX_DIR}"
    fi

    # Get host user/group IDs for proper file permissions
    USER_ID=$(id -u)
    GROUP_ID=$(id -g)

    # Run build inside container with matching user permissions
    # We run as root initially to create user, then switch to that user for the build
    docker run --rm \
        -v "${WAX_DIR}":"${WAX_DIR}" \
        -e WAX_DEBUG="${WAX_DEBUG}" \
        -e WAX_BOOST_ROOT=/wax_boost_root/ \
        -e HOST_USER_ID="${USER_ID}" \
        -e HOST_GROUP_ID="${GROUP_ID}" \
        -e PYTHON_VERSION="${PYTHON_VERSION}" \
        -e WAX_DIR="${WAX_DIR}" \
        -w "${WAX_DIR}" \
        --user root \
        ${IMAGE_NAME} \
        bash -c '
            # Create user with same UID/GID as host user
            groupadd -g ${HOST_GROUP_ID} hostgroup 2>/dev/null || true
            useradd -m -s /bin/bash -u ${HOST_USER_ID} -g ${HOST_GROUP_ID} builduser 2>/dev/null || true

            # Determine Python path based on version
            PYTHON_TAG="cp${PYTHON_VERSION//./}"
            PYTHON_BIN="/opt/python/${PYTHON_TAG}-${PYTHON_TAG}/bin"

            # Run the build as builduser with proper PATH and environment variables
            # Static libraries (OpenSSL, bzip2) are installed in /usr/local where cmake finds them automatically
            # Poetry is available via /usr/local/bin symlink (home dir is now traversable)
            # BOOST_ROOT is read by hive/libraries/fc/CMakeLists.txt to find Boost
            # OPENSSL_ROOT_DIR helps cmake FindOpenSSL to find our static OpenSSL
            su builduser -c "export PATH=${PYTHON_BIN}:/usr/local/bin:\${PATH} && \
                export WAX_BOOST_ROOT=/wax_boost_root/ && \
                export BOOST_ROOT=/wax_boost_root/ && \
                export OPENSSL_ROOT_DIR=/usr/local && \
                ${WAX_DIR}/python/scripts/build_wax_manylinux.sh ${PYTHON_VERSION} 1 ${WAX_DEBUG}"
        '

    echo "=========================================="
    echo "Build complete! Wheel available in:"
    echo "${PROJECT_DIR}/dist/"
    ls -la "${PROJECT_DIR}/dist/"
    echo "=========================================="

else
    # === DIRECT EXECUTION MODE (inside container) ===

    HIVE_SUBMODULE_DIR="${WAX_DIR}/hive"
    API_PACKAGES_GEN_DIR="${HIVE_SUBMODULE_DIR}/libraries/plugins/apis/api_generation"

    export POETRY_VIRTUALENVS_PATH="${PROJECT_DIR}/poetry-venv-root-manylinux-py${PYTHON_VERSION}"

    rm -rf ${PROJECT_DIR}/setup.py

    cd ${PROJECT_DIR}/wax
    echo "Create proto files."
    ${PROJECT_DIR}/scripts/compile_proto.sh

    cleanup_old_api_package() {
        local api_package_name=$1

        if [ -d "${API_PACKAGES_GEN_DIR}/${api_package_name}" ]; then
            echo "Found old ${api_package_name} package. Removing it."
            rm -rf "${API_PACKAGES_GEN_DIR:?}/${api_package_name}"
        fi
    }

    # Check if API packages already exist (from CI artifacts or previous build)
    if [ -f "${SCRIPT_DIR}/../../build_wheel.env" ] && \
       [ -d "${API_PACKAGES_GEN_DIR}/hiveio_api" ]; then
        echo "API packages already exist (from artifacts). Skipping cleanup and generation."
    else
        cleanup_old_api_package "hiveio_api"

        if [ -f "${SCRIPT_DIR}/../../build_wheel.env" ]; then
            echo "Found old build_wheel.env. Removing it."
            rm -rf "${SCRIPT_DIR}/../../build_wheel.env"
        fi

        echo "Build API packages."
        ${PROJECT_DIR}/scripts/build_api_packages.sh
    fi

    mkdir -p ${PROJECT_DIR}/.poetry_backup
    cp ${PROJECT_DIR}/pyproject.toml ${PROJECT_DIR}/.poetry_backup
    cp ${PROJECT_DIR}/poetry.lock ${PROJECT_DIR}/.poetry_backup

    set -o allexport
    source "${SCRIPT_DIR}/../../build_wheel.env"
    set +o allexport

    add_api_dependency() {
        local api_package_name=$1
        local api_wheel_version=$2

        local published_name="${api_package_name//_/-}"
        echo "Published name: ${published_name}"

        if poetry add --dry-run "${published_name}@${api_wheel_version}" --source gitlab-api-packages > /dev/null 2>&1; then
            echo "Using ${published_name} from registry."
            poetry add "${published_name}@${api_wheel_version}" --source gitlab-api-packages
        else
            echo "${published_name} not found in registry, using local source."
            poetry add "../hive/libraries/plugins/apis/api_generation/${api_package_name}"
        fi
    }

    add_api_dependency "hiveio_api" "${HIVEIO_API_WHEEL_BUILD_VERSION}"

    if [ -d "${PROJECT_DIR}/dist" ]; then
        echo "Found existing dist directory, removing it."
        rm -rf "${PROJECT_DIR}/dist"
    fi

    echo "Build wax wheel package."
    poetry -C ${PROJECT_DIR} build --format wheel

    echo "List dist directory: ${PROJECT_DIR}/dist"
    ls -lA ${PROJECT_DIR}/dist

    mv ${PROJECT_DIR}/.poetry_backup/pyproject.toml ${PROJECT_DIR}/pyproject.toml
    mv ${PROJECT_DIR}/.poetry_backup/poetry.lock ${PROJECT_DIR}/poetry.lock
    rm -rf "${PROJECT_DIR}/.poetry_backup"
fi
