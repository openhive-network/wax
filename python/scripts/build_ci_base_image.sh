#! /bin/bash

set -xeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="${SCRIPT_DIR}/../../"

REGISTRY=${1:-registry.gitlab.syncad.com/hive/wax/}
CI_IMAGE_TAG=:ubuntu22.04-3
BASE_IMAGE=registry.gitlab.syncad.com/hive/hive/ci-base-image:ubuntu22.04-13

export DOCKER_BUILDKIT=1

docker buildx build --no-cache --progress=plain --target=ci-base-image \
  --push --build-arg BASE_IMAGE=$BASE_IMAGE \
  -t ${REGISTRY}ci-base-image${CI_IMAGE_TAG} \
  -f "${SCRIPT_DIR}/../docker/Dockerfile.ci" "${PROJECT_DIR}"
