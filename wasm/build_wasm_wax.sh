#! /bin/bash

set -xeuo pipefail

SCRIPTPATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
PROJECT_DIR="${SCRIPTPATH}/.."

DIRECT_EXECUTION_DEFAULT=0
EXECUTION_PATH_DEFAULT="/src/"

# Check for usage inside dev container providing all tools (emscripten image)
if [ $# -eq 0 ]; then
  EXECUTOR=$(whoami)
  if [ "${EXECUTOR}" = "emscripten" ]; then
    DIRECT_EXECUTION_DEFAULT=1
    EXECUTION_PATH_DEFAULT="${PROJECT_DIR}"
  fi
fi

DIRECT_EXECUTION=${1:-${DIRECT_EXECUTION_DEFAULT}}
EXECUTION_PATH=${2:-"${EXECUTION_PATH_DEFAULT}"}

if [ ${DIRECT_EXECUTION} -eq 0 ]; then
  echo "Performing a docker run"
  docker run \
    -it --rm \
    -v "${PROJECT_DIR}/":"${EXECUTION_PATH}" \
    -u $(id -u):$(id -g) \
    registry.gitlab.syncad.com/hive/common-ci-configuration/emsdk:3.1.56-2@sha256:a3f8e851b0e6f141663cbebca2c5d9e80b0793deb8f62f7340f826df492e1b27 \
    /bin/bash "${EXECUTION_PATH}/wasm/build_wasm_wax.sh" 1 "${EXECUTION_PATH}"
else
  echo "Performing a build"
  cd "${EXECUTION_PATH}"
  BUILD_DIR="${EXECUTION_PATH}/wasm/build_wasm"
  mkdir -vp "${BUILD_DIR}"
  cd "${BUILD_DIR}"

  #-DBoost_DEBUG=TRUE -DBoost_VERBOSE=TRUE -DCMAKE_STATIC_LIBRARY_SUFFIX=".a;.bc"
  cmake \
    -DBoost_NO_WARN_NEW_VERSIONS=1 \
    -DBoost_USE_STATIC_RUNTIME=ON \
    -DCMAKE_TOOLCHAIN_FILE=/emsdk/upstream/emscripten/cmake/Modules/Platform/Emscripten.cmake -DCMAKE_BUILD_TYPE=Release -G "Ninja" \
    -S "${EXECUTION_PATH}/wasm/src" -B "${BUILD_DIR}" 2>&1 | tee -i "${BUILD_DIR}/cmake.log"
  ninja -v -j8 2>&1 | tee -i "${BUILD_DIR}/build.log"

  cmake --install "${BUILD_DIR}" --component wax_wasm_common_runtime --prefix "${EXECUTION_PATH}/wasm/lib/build_wasm"
  cmake --install "${BUILD_DIR}" --component wax_wasm_common_dts --prefix "${EXECUTION_PATH}/wasm/lib/build_wasm"

  cmake --install "${BUILD_DIR}" --component wax_wasm_common_runtime --prefix "${EXECUTION_PATH}/wasm/dist/lib/build_wasm"
  cmake --install "${BUILD_DIR}" --component wax_wasm_common_dts --prefix "${EXECUTION_PATH}/wasm/dist/lib/build_wasm"

fi
