#!/bin/bash

set -xe

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")/../python"

WAX_DIR="${PROJECT_DIR}/.."
HIVE_SUBMODULE_DIR="${WAX_DIR}/hive"
API_PACKAGES_GEN_DIR="${HIVE_SUBMODULE_DIR}/libraries/plugins/apis/api_generation"


DIRECT_EXECUTION=${1:-0}
WAX_DEBUG=${2:-${WAX_DEBUG:-0}}

if [ ${DIRECT_EXECUTION} -eq 0 ]; then
COMMIT_HASH=$(git rev-parse --short HEAD)
IMAGE_BASE_NAME="wax-python-builder"
IMAGE_NAME="${IMAGE_BASE_NAME}:"${COMMIT_HASH}

USER_NAME=user
USER_ID=$(id -u)
GROUP_ID=$(id -g)

echo ${PROJECT_DIR}

echo "Create wax python builder."
docker build \
       -f ${PROJECT_DIR}/docker/wax-python-builder.dockerfile \
       --build-arg USER_NAME=${USER_NAME} \
       --build-arg USER_ID=${USER_ID} \
       --build-arg GROUP_ID=${GROUP_ID} \
       ${DOCKER_BUILD_FLAGS:-} \
     -t ${IMAGE_NAME} \
     -t ${IMAGE_BASE_NAME}:devcontainer \
     ${PROJECT_DIR}/../

docker run --rm -v "${WAX_DIR}":"${WAX_DIR}" -e WAX_DEBUG=${WAX_DEBUG:-0} -w "${WAX_DIR}" ${IMAGE_NAME} bash -c "${WAX_DIR}/python/scripts/build_wax.sh 1"

else
  export POETRY_VIRTUALENVS_PATH="${PROJECT_DIR}/poetry-venv-root"

  rm -rf ${PROJECT_DIR}/setup.py

  # Build hived binaries (enabled by default, set BUILD_HIVED_BINARIES=0 to disable)
  BUILD_HIVED_BINARIES="${BUILD_HIVED_BINARIES:-1}"

  if [ "${BUILD_HIVED_BINARIES}" -eq 1 ]; then
    echo "=== Building hived binaries ==="
    HIVE_BUILD_DIR="${HIVE_SUBMODULE_DIR}/build_wax"
    HIVE_BINARIES_OUTPUT_DIR="${PROJECT_DIR}/build"

    mkdir -p "${HIVE_BUILD_DIR}"
    mkdir -p "${HIVE_BINARIES_OUTPUT_DIR}"

    pushd "${HIVE_BUILD_DIR}"

    # Configure cmake with custom-built dependencies
    # Set CMP0074 to NEW so cmake uses *_ROOT variables
    # Use static linking for libstdc++ and libgcc to minimize runtime dependencies
    # Note: -DBOOST_ERROR_CODE_HEADER_ONLY=1 is needed because boost::system is
    # header-only in Boost 1.74+
    # Set BOOST_LIBRARYDIR to help cmake find the boost libraries
    export BOOST_LIBRARYDIR="${WAX_BOOST_ROOT}/lib"

    cmake -DCMAKE_BUILD_TYPE=Release \
          -DCMAKE_POLICY_VERSION_MINIMUM=3.5 \
          -DCMAKE_POLICY_DEFAULT_CMP0074=NEW \
          -DCMAKE_CXX_FLAGS="-DBOOST_ERROR_CODE_HEADER_ONLY=1" \
          -DCMAKE_EXE_LINKER_FLAGS="-static-libgcc -static-libstdc++ -L${WAX_BOOST_ROOT}/lib -L${WAX_ICU_ROOT}/lib ${WAX_BOOST_ROOT}/lib/libboost_filesystem.a" \
          -DBOOST_ROOT="${WAX_BOOST_ROOT}" \
          -DBOOST_LIBRARYDIR="${WAX_BOOST_ROOT}/lib" \
          -DBoost_NO_SYSTEM_PATHS=ON \
          -DBoost_USE_STATIC_LIBS=ON \
          -DBoost_FILESYSTEM_LIBRARY="${WAX_BOOST_ROOT}/lib/libboost_filesystem.a" \
          -DOPENSSL_ROOT_DIR="${WAX_OPENSSL_ROOT}" \
          -DOPENSSL_INCLUDE_DIR="${WAX_OPENSSL_ROOT}/include" \
          -DOPENSSL_CRYPTO_LIBRARY="${WAX_OPENSSL_ROOT}/lib64/libcrypto.a" \
          -DOPENSSL_SSL_LIBRARY="${WAX_OPENSSL_ROOT}/lib64/libssl.a" \
          -DOPENSSL_USE_STATIC_LIBS=ON \
          -DZLIB_ROOT="${WAX_ZLIB_ROOT}" \
          -DZLIB_LIBRARY="${WAX_ZLIB_ROOT}/lib/libz.a" \
          -DZLIB_INCLUDE_DIR="${WAX_ZLIB_ROOT}/include" \
          -DBZIP2_ROOT="${WAX_BZIP2_ROOT}" \
          -DBZIP2_INCLUDE_DIR="${WAX_BZIP2_ROOT}/include" \
          -DBZIP2_LIBRARIES="${WAX_BZIP2_ROOT}/lib/libbz2.a" \
          -DReadline_ROOT_DIR="${WAX_READLINE_ROOT}" \
          -DReadline_INCLUDE_DIR="${WAX_READLINE_ROOT}/include" \
          -DReadline_LIBRARIES="${WAX_READLINE_ROOT}/lib/libreadline.a;${WAX_NCURSES_ROOT}/lib/libncursesw.a;${WAX_NCURSES_ROOT}/lib/libtinfow.a" \
          -DReadline_USE_STATIC_LIBS=ON \
          -DTinfo_LIBRARY="${WAX_NCURSES_ROOT}/lib/libtinfow.a" \
          -DCURSES_NEED_NCURSES=TRUE \
          -DCURSES_INCLUDE_PATH="${WAX_NCURSES_ROOT}/include" \
          -DCURSES_LIBRARY="${WAX_NCURSES_ROOT}/lib/libncursesw.a;${WAX_NCURSES_ROOT}/lib/libtinfow.a" \
          -DCURSES_NCURSES_LIBRARY="${WAX_NCURSES_ROOT}/lib/libncursesw.a" \
          -DCURSES_CURSES_LIBRARY="${WAX_NCURSES_ROOT}/lib/libncursesw.a" \
          -DNcurses_LIBRARY="${WAX_NCURSES_ROOT}/lib/libncursesw.a" \
          -GNinja \
          "${HIVE_SUBMODULE_DIR}"

    # Build targets (beekeeper is not in this hive version's programs/CMakeLists.txt)
    # Limit to 4 threads to avoid memory issues
    HIVE_TARGETS="hived cli_wallet block_log_util get_dev_key"
    echo "Building targets: ${HIVE_TARGETS}"
    ninja -j4 ${HIVE_TARGETS}

    popd

    # Copy binaries to output directory
    echo "Copying hived binaries to ${HIVE_BINARIES_OUTPUT_DIR}"
    cp "${HIVE_BUILD_DIR}/programs/hived/hived" "${HIVE_BINARIES_OUTPUT_DIR}/"
    cp "${HIVE_BUILD_DIR}/programs/cli_wallet/cli_wallet" "${HIVE_BINARIES_OUTPUT_DIR}/"
    cp "${HIVE_BUILD_DIR}/programs/util/block_log_util" "${HIVE_BINARIES_OUTPUT_DIR}/"
    cp "${HIVE_BUILD_DIR}/programs/util/get_dev_key" "${HIVE_BINARIES_OUTPUT_DIR}/"

    echo "Hived binaries built and copied to ${HIVE_BINARIES_OUTPUT_DIR}:"
    ls -la "${HIVE_BINARIES_OUTPUT_DIR}"
  else
    echo "=== Skipping hived binaries build (set BUILD_HIVED_BINARIES=1 to enable) ==="
  fi

  cleanup_old_api_package() {
    local api_package_name=$1

    if [ -d "${API_PACKAGES_GEN_DIR}/${api_package_name}" ]; then
      echo "Found old ${api_package_name} package. Removing it."
      rm -rf "${API_PACKAGES_GEN_DIR:?}/${api_package_name}"
    fi
  }

  # Check if unified hiveio_api package already exists (from CI artifacts or previous build)
  # Skip cleanup and generation if it exists - this allows Python 3.14 builds to use
  # pre-built packages from the Python 3.12 api_generation job
  # NOTE: API packages must be generated BEFORE compile_proto.sh because
  # compile_proto.sh runs poetry install which needs the API package paths to exist
  if [ -f "${SCRIPT_DIR}/../../build_wheel.env" ] && \
     [ -d "${API_PACKAGES_GEN_DIR}/hiveio_api" ]; then
    echo "hiveio_api package already exists (from artifacts). Skipping cleanup and generation."
  else
    # Clean up old hiveio_api package before regenerating
    cleanup_old_api_package "hiveio_api"

    if [ -f "${SCRIPT_DIR}/../../build_wheel.env" ]; then
      echo "Found old build_wheel.env. Removing it."
      rm -rf "${SCRIPT_DIR}/../../build_wheel.env"
    fi

    echo "Build API packages."
    ${PROJECT_DIR}/scripts/build_api_packages.sh
  fi

  cd ${PROJECT_DIR}/wax
  echo "Create proto files."
  ${PROJECT_DIR}/scripts/compile_proto.sh


  mkdir -p ${PROJECT_DIR}/.poetry_backup
  cp ${PROJECT_DIR}/pyproject.toml ${PROJECT_DIR}/.poetry_backup
  cp ${PROJECT_DIR}/poetry.lock ${PROJECT_DIR}/.poetry_backup

  set -o allexport
  source "${SCRIPT_DIR}/../../build_wheel.env"
  set +o allexport


  # Add the unified hiveio_api package as a dependency
  # First try from registry, then fall back to local source
  if poetry add --dry-run "hiveio-api@${HIVEIO_API_WHEEL_BUILD_VERSION}" --source gitlab-api-packages > /dev/null 2>&1; then
    echo "Using hiveio-api from registry."
    poetry add "hiveio-api@${HIVEIO_API_WHEEL_BUILD_VERSION}" --source gitlab-api-packages
  else
    echo "hiveio-api not found in registry, using local source."
    poetry add "../hive/libraries/plugins/apis/api_generation/hiveio_api"
  fi

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
