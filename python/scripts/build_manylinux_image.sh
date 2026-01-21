#!/bin/bash

set -xeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="${SCRIPT_DIR}/../../"

REGISTRY=${1:-registry.gitlab.syncad.com/hive/wax/}
PYTHON_VERSION=${2:-3.14}

IMAGE_TAG=":manylinux2014-py${PYTHON_VERSION}-1"

export DOCKER_BUILDKIT=1

docker buildx build --no-cache --progress=plain --target=wax-manylinux \
  --build-arg PYTHON_VERSION=${PYTHON_VERSION} \
  -t ${REGISTRY}wax-manylinux${IMAGE_TAG} \
  -f "${SCRIPT_DIR}/../docker/Dockerfile.manylinux" "${PROJECT_DIR}"

echo "Built image: ${REGISTRY}wax-manylinux${IMAGE_TAG}"
echo ""
echo "To push: docker push ${REGISTRY}wax-manylinux${IMAGE_TAG}"
