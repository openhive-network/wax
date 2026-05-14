#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

WAX_DIR="${PROJECT_DIR}/../.."

DIRECT_EXECUTION=${1:-0}
WAX_PROFILE=${2:-${WAX_PROFILE:-release}}

if [ ${DIRECT_EXECUTION} -eq 0 ]; then
  COMMIT_HASH=$(git rev-parse --short HEAD)
  IMAGE_BASE_NAME="wax-rust-builder"
  IMAGE_NAME="${IMAGE_BASE_NAME}:${COMMIT_HASH}"

  USER_NAME=user
  USER_ID=$(id -u)
  GROUP_ID=$(id -g)

  echo "Create wax rust builder."
  docker build \
       -f "${PROJECT_DIR}/docker/wax-rust-builder.dockerfile" \
       --build-arg USER_NAME=${USER_NAME} \
       --build-arg USER_ID=${USER_ID} \
       --build-arg GROUP_ID=${GROUP_ID} \
     -t "${IMAGE_NAME}" \
     -t "${IMAGE_BASE_NAME}:devcontainer" \
     "${PROJECT_DIR}/../"

  docker run --rm \
    -v "${WAX_DIR}":"${WAX_DIR}" \
    -e WAX_PROFILE="${WAX_PROFILE}" \
    -w "${WAX_DIR}" \
    "${IMAGE_NAME}" \
    bash -c "${PROJECT_DIR}/scripts/build_wax.sh 1 ${WAX_PROFILE}"
else
  cd "${WAX_DIR}/rust"

  CARGO_FLAGS=""
  if [ "${WAX_PROFILE}" = "release" ]; then
    CARGO_FLAGS="--release"
  fi

  cargo build ${CARGO_FLAGS} -p wax_core

  echo "Built artifacts under ${WAX_DIR}/rust/target/${WAX_PROFILE}/"
fi
