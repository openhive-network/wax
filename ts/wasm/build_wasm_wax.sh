#! /bin/bash

set -xeuo pipefail

SCRIPTPATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
PROJECT_DIR="${SCRIPTPATH}/../.."

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

build() {
  BUILD_DIR="${EXECUTION_PATH}/ts/wasm/build_wasm"
  mkdir -vp "${BUILD_DIR}"
  cd "${BUILD_DIR}"

  #-DBoost_DEBUG=TRUE -DBoost_VERBOSE=TRUE -DCMAKE_STATIC_LIBRARY_SUFFIX=".a;.bc"
  cmake \
    -DBoost_NO_WARN_NEW_VERSIONS=1 \
    -DBoost_USE_STATIC_RUNTIME=ON \
    -DCMAKE_TOOLCHAIN_FILE=/emsdk/upstream/emscripten/cmake/Modules/Platform/Emscripten.cmake -DCMAKE_BUILD_TYPE=Release -G "Ninja" \
    -S "${EXECUTION_PATH}/ts/wasm/src" -B "${BUILD_DIR}" 2>&1 | tee -i "${BUILD_DIR}/cmake.log"
  ninja -v -j8 2>&1 | tee -i "${BUILD_DIR}/build.log"

  cmake --install "${BUILD_DIR}" --component wax_config_ts --prefix "${EXECUTION_PATH}/ts/wasm/lib/build_wasm"

  cmake --install "${BUILD_DIR}" --component wasm_runtime_components --prefix "${EXECUTION_PATH}/ts/wasm/lib/build_wasm"

  # Patched emscripten (vogel76-emsdk) no longer emits createRequire/require() in EXPORT_ES6 mode.
  # Verify the output is clean — fail the build if any require() slipped through.
  if grep -qE 'createRequire|[^a-zA-Z_]require\(' "${EXECUTION_PATH}/ts/wasm/lib/build_wasm/wax.node.js"; then
    echo "ERROR: wax.node.js still contains require() calls — patched emscripten should have eliminated them."
    grep -n 'createRequire\|require(' "${EXECUTION_PATH}/ts/wasm/lib/build_wasm/wax.node.js"
    exit 1
  fi
}

if [ ${DIRECT_EXECUTION} -eq 0 ]; then
  echo "Performing a docker run"
  docker run \
    -it --rm \
    -v "${PROJECT_DIR}/":"${EXECUTION_PATH}" \
    -u $(id -u):$(id -g) \
    registry.gitlab.syncad.com/hive/common-ci-configuration/emsdk:4.0.22-4@sha256:510d4a02e67c6ac27fb1b19bf3e17f220851711b9e60169a004fa7ab6e054a4d \
    /bin/bash "${EXECUTION_PATH}/ts/wasm/build_wasm_wax.sh" 1 "${EXECUTION_PATH}"
else
  echo "Performing a build"
  cd "${EXECUTION_PATH}"
  build
fi
