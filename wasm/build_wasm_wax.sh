#! /bin/bash

SCRIPTPATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
PROJECT_DIR="${SCRIPTPATH}/.."

set -xeuo pipefail


# Check for usage inside dev container providing all tools (emscripten image)
EXECUTOR=$(whoami)
if [ "${EXECUTOR}" = "emscripten" ]; then
  DIRECT_EXECUTION_DEFAULT=1
  EXECUTION_PATH_DEFAULT="${PROJECT_DIR}"
else
  DIRECT_EXECUTION_DEFAULT=0
  EXECUTION_PATH_DEFAULT="/src/"
fi

DIRECT_EXECUTION=${1:-${DIRECT_EXECUTION_DEFAULT}}
EXECUTION_PATH=${2:-"${EXECUTION_PATH_DEFAULT}"}

if [ ${DIRECT_EXECUTION} -eq 0 ]; then
  echo "Performing a docker run"
  docker run \
    -it --rm \
    -v "${PROJECT_DIR}/":"${EXECUTION_PATH}" \
    -u $(id -u):$(id -g) \
    registry.gitlab.syncad.com/hive/common-ci-configuration/emsdk:3.1.43 \
    /bin/bash "${EXECUTION_PATH}/wasm/build_wasm_wax.sh" 1 "${EXECUTION_PATH}"
else
  echo "Performing a build"
  cd "${EXECUTION_PATH}"
  BUILD_DIR="${EXECUTION_PATH}/build_wasm"
  mkdir -vp "${BUILD_DIR}"
  cd "${BUILD_DIR}"

  #-DBoost_DEBUG=TRUE -DBoost_VERBOSE=TRUE -DCMAKE_STATIC_LIBRARY_SUFFIX=".a;.bc"
  cmake \
    -DBoost_NO_WARN_NEW_VERSIONS=1 \
    -DBoost_USE_STATIC_RUNTIME=ON \
    -DCMAKE_TOOLCHAIN_FILE=/emsdk/upstream/emscripten/cmake/Modules/Platform/Emscripten.cmake -DCMAKE_BUILD_TYPE=Release -G "Unix Makefiles" \
    -S "${EXECUTION_PATH}/wasm/src" -B "${BUILD_DIR}"
  make -j8
fi
