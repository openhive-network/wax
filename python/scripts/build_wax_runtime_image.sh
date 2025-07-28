#! /bin/bash

set -xeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="${SCRIPT_DIR}/../../"

REGISTRY=${1:-registry.gitlab.syncad.com/hive/wax/}

IMAGE_TAG=:ubuntu24.04-1

export DOCKER_BUILDKIT=1

docker buildx build --progress=plain --target=devcontainer \
  -t ${REGISTRY}wax-python-runtime${IMAGE_TAG} \
  -f "${SCRIPT_DIR}/../docker/wax-python-runtime.dockerfile" "${PROJECT_DIR}" \
  --push
