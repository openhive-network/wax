#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
WAX_DIR="$(dirname "$SCRIPT_DIR")"

WAX_PROFILE=${WAX_PROFILE:-debug}
DIRECT_EXECUTION=0

for arg in "$@"; do
  case "$arg" in
    release|debug) WAX_PROFILE="$arg" ;;
    --in-container) DIRECT_EXECUTION=1 ;;
    *) echo "Unknown argument: $arg" >&2; exit 1 ;;
  esac
done

CARGO_FLAGS=""
if [ "${WAX_PROFILE}" = "release" ]; then
  CARGO_FLAGS="--release"
fi

if [ "${DIRECT_EXECUTION}" -eq 0 ]; then
  COMMIT_HASH=$(git -C "${SCRIPT_DIR}" rev-parse --short HEAD)
  IMAGE_BASE_NAME="wax-rust-builder"
  IMAGE_NAME="${IMAGE_BASE_NAME}:${COMMIT_HASH}"

  USER_NAME=user
  USER_ID=$(id -u)
  GROUP_ID=$(id -g)

  echo "Building ${IMAGE_NAME} image..."
  docker build \
       -f "${SCRIPT_DIR}/docker/wax-rust-builder.dockerfile" \
       --build-arg USER_NAME=${USER_NAME} \
       --build-arg USER_ID=${USER_ID} \
       --build-arg GROUP_ID=${GROUP_ID} \
     -t "${IMAGE_NAME}" \
     -t "${IMAGE_BASE_NAME}:devcontainer" \
     "${SCRIPT_DIR}/docker"

  echo "Running ${WAX_PROFILE} build inside ${IMAGE_NAME}..."
  # `exec bash` after the build keeps an interactive shell as PID 1, so the
  # container stays open (even if the build fails) instead of exiting. `-it`
  # gives it a TTY; `--rm` cleans it up once you exit the shell.
  docker run --rm -it \
    -v "${WAX_DIR}":"${WAX_DIR}" \
    -w "${SCRIPT_DIR}" \
    "${IMAGE_NAME}" \
    bash -c "bash '${SCRIPT_DIR}/build.sh' --in-container ${WAX_PROFILE}; exec bash"
else
  cd "${SCRIPT_DIR}"

  # Keep container-built artifacts in a separate target dir so they don't
  # share cmake caches (with absolute paths baked in) with host builds.
  export CARGO_TARGET_DIR="${SCRIPT_DIR}/target/docker"

  cargo build ${CARGO_FLAGS} -p wax

  echo "Built artifacts under ${CARGO_TARGET_DIR}/${WAX_PROFILE}/"
fi
