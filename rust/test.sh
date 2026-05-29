#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
WAX_DIR="$(dirname "$SCRIPT_DIR")"

if [ "${1:-}" = "--in-container" ]; then
  shift
  cd "${SCRIPT_DIR}"

  # Separate target dir so the container's cmake caches don't collide with host
  # builds (matches build.sh).
  export CARGO_TARGET_DIR="${SCRIPT_DIR}/target/docker"

  # Point beekeeper_rust's build.rs at the prebuilt fc archives so it can bundle
  # and isolate them. The C++ side must already be built under
  # crates/beekeeper/build (run crates/beekeeper/.../beekeeper_rust/build.sh if
  # the libs below are missing).
  BK="${SCRIPT_DIR}/crates/beekeeper"
  BUILD="${BK}/build"
  FCB="$(find "${BUILD}" -name libfc_crypto_bridge.a -print -quit)"
  FC="$(find "${BUILD}" -name libfc.a -print -quit)"
  SECP="$(find "${BUILD}" -name libsecp256k1.a -print -quit)"
  if [ -z "${FCB}" ] || [ -z "${FC}" ] || [ -z "${SECP}" ]; then
    echo "ERROR: beekeeper C++ libs not found under ${BUILD}." >&2
    echo "Build them first: ${BK}/programs/beekeeper/beekeeper_rust/build.sh" >&2
    exit 1
  fi

  export BEEKEEPER_FC_CRYPTO_BRIDGE_LIB_DIR="$(dirname "${FCB}")"
  export BEEKEEPER_FC_CRYPTO_BRIDGE_INCLUDE_DIR="${BK}/programs/beekeeper/fc_crypto_bridge/include"
  export BEEKEEPER_FC_LINK_FLAGS="-L$(dirname "${FC}") -lfc -L$(dirname "${SECP}") -lsecp256k1 -lboost_chrono -lboost_context -lboost_coroutine -lboost_date_time -lboost_filesystem -lboost_system -lboost_thread -lssl -lcrypto -lz -lbz2 -lpthread -lrt -ldl"

  # Default to the offline `detailed` suite; forward any args to cargo test.
  if [ "$#" -eq 0 ]; then
    exec cargo test -p wax --test detailed
  else
    exec cargo test "$@"
  fi
else
  COMMIT_HASH=$(git -C "${SCRIPT_DIR}" rev-parse --short HEAD)
  IMAGE_BASE_NAME="wax-rust-builder"
  IMAGE_NAME="${IMAGE_BASE_NAME}:${COMMIT_HASH}"

  # Fall back to the stable devcontainer tag if no image matches this commit
  # (e.g. you committed since the last build.sh run).
  if ! docker image inspect "${IMAGE_NAME}" >/dev/null 2>&1; then
    IMAGE_NAME="${IMAGE_BASE_NAME}:devcontainer"
  fi

  echo "Running tests inside ${IMAGE_NAME}..."
  docker run --rm \
    -v "${WAX_DIR}":"${WAX_DIR}" \
    -w "${SCRIPT_DIR}" \
    "${IMAGE_NAME}" \
    bash "${SCRIPT_DIR}/test.sh" --in-container "$@"
fi
