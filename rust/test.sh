#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
WAX_DIR="$(dirname "$SCRIPT_DIR")"

WAX_PROFILE=${WAX_PROFILE:-debug}
DIRECT_EXECUTION=0
CARGO_ARGS=()

for arg in "$@"; do
  case "$arg" in
    release|debug) WAX_PROFILE="$arg" ;;
    --in-container) DIRECT_EXECUTION=1 ;;
    *) CARGO_ARGS+=("$arg") ;;
  esac
done

CARGO_FLAGS=""
if [ "${WAX_PROFILE}" = "release" ]; then
  CARGO_FLAGS="--release"
fi

if [ "${DIRECT_EXECUTION}" -eq 1 ]; then
  cd "${SCRIPT_DIR}"/wax

  export CARGO_TARGET_DIR="${SCRIPT_DIR}/wax/target/docker"

  # The hiveio-beekeeper test dependency comes packaged from the beekeeper
  # project's GitLab generic package registry, prebuilt native bundle
  # included — no beekeeper C++ build, no beekeeper submodules. Cargo resolves
  # the path dev-dependency on every invocation, so fetch first. Idempotent.
  "${SCRIPT_DIR}/fetch_beekeeper.sh"

  # Default to the offline `detailed` suite; forward any args to cargo test.
  if [ "${#CARGO_ARGS[@]}" -eq 0 ]; then
    exec cargo test ${CARGO_FLAGS} --test detailed
  else
    exec cargo test ${CARGO_FLAGS} "${CARGO_ARGS[@]}"
  fi
else
  COMMIT_HASH=$(git -C "${SCRIPT_DIR}" rev-parse --short HEAD)
  IMAGE_BASE_NAME="wax-rust-builder"
  IMAGE_NAME="${IMAGE_BASE_NAME}:${COMMIT_HASH}"

  if ! docker image inspect "${IMAGE_NAME}" >/dev/null 2>&1; then
    IMAGE_NAME="${IMAGE_BASE_NAME}:devcontainer"
  fi

  echo "Running tests inside ${IMAGE_NAME}..."
  # The repo is bind-mounted from the host, so its files are owned by the host
  # uid; git inside the container would otherwise reject it as "dubious
  # ownership". '*' also covers the hive submodule's nested tree.
  docker run --rm \
    -v "${WAX_DIR}":"${WAX_DIR}" \
    -w "${SCRIPT_DIR}" \
    "${IMAGE_NAME}" \
    bash -c 'git config --global --add safe.directory "*"; exec bash "$@"' \
      _ "${SCRIPT_DIR}/test.sh" --in-container "${WAX_PROFILE}" "${CARGO_ARGS[@]}"
fi
