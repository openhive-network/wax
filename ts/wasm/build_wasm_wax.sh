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

  # Emscripten still uses redundant createRequire for legacy CJS support - remove it so we have proper bundlers support
  # Emscripten 5.x uses "node:module" prefix, 4.x used "module"
  sed -i "s#var require = createRequire(import.meta.url);##g" "${EXECUTION_PATH}/ts/wasm/lib/build_wasm/wax.node.js"
  sed -i "s#const {createRequire} = await import(\"module\");##g" "${EXECUTION_PATH}/ts/wasm/lib/build_wasm/wax.node.js"
  sed -i "s#const {createRequire} = await import(\"node:module\");##g" "${EXECUTION_PATH}/ts/wasm/lib/build_wasm/wax.node.js"

  # Replace requires with our await import-s (Emscripten 5.x uses node: prefix)
  sed -i "s#require(\"fs\");#(await import(\"fs\"))#g" "${EXECUTION_PATH}/ts/wasm/lib/build_wasm/wax.node.js"
  sed -i "s#require(\"node:fs\");#(await import(\"node:fs\"))#g" "${EXECUTION_PATH}/ts/wasm/lib/build_wasm/wax.node.js"
  sed -i "s#require(\"path\")#(await import(\"path\"))#g" "${EXECUTION_PATH}/ts/wasm/lib/build_wasm/wax.node.js"
  sed -i "s#require(\"node:path\")#(await import(\"node:path\"))#g" "${EXECUTION_PATH}/ts/wasm/lib/build_wasm/wax.node.js"
  sed -i "s#require(\"url\")#(await import(\"url\"))#g" "${EXECUTION_PATH}/ts/wasm/lib/build_wasm/wax.node.js"
  sed -i "s#require(\"node:url\")#(await import(\"node:url\"))#g" "${EXECUTION_PATH}/ts/wasm/lib/build_wasm/wax.node.js"

  # Remove Node.js "crypto" module import, as we already have crypto API support in Node.js 19+
  sed -i "s#var nodeCrypto = require(\"crypto\");##g" "${EXECUTION_PATH}/ts/wasm/lib/build_wasm/wax.node.js"
  sed -i "s#var nodeCrypto = require(\"node:crypto\");##g" "${EXECUTION_PATH}/ts/wasm/lib/build_wasm/wax.node.js"
  sed -i "s#return view => nodeCrypto.randomFillSync(view);##g" "${EXECUTION_PATH}/ts/wasm/lib/build_wasm/wax.node.js"
}

if [ ${DIRECT_EXECUTION} -eq 0 ]; then
  echo "Performing a docker run"
  docker run \
    -it --rm \
    -v "${PROJECT_DIR}/":"${EXECUTION_PATH}" \
    -u $(id -u):$(id -g) \
    registry.gitlab.syncad.com/hive/common-ci-configuration/emsdk:5.0.2-3@sha256:77d9f1994382bae6fdd01f44e8b1af3b0396651b1c4dbc8a50ed60d596bc73b3 \
    /bin/bash "${EXECUTION_PATH}/ts/wasm/build_wasm_wax.sh" 1 "${EXECUTION_PATH}"
else
  echo "Performing a build"
  cd "${EXECUTION_PATH}"
  build
fi
