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
    registry.gitlab.syncad.com/hive/common-ci-configuration/emsdk:3.1.62-1@sha256:98b3062135cc4e31b9efc8343e2b8c0c66b25efad18c5b7255237797ebdad286 \
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
