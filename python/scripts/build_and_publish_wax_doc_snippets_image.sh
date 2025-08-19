#! /bin/bash

set -xeuo pipefail

BASE_IMAGE=$1
COMMIT_SHA=$2
REGISTRY=registry.gitlab.syncad.com/hive/wax/

SCRIPT_DIR="$(dirname "$(realpath "$0")")"
PROJECT_DIR="$(realpath "${SCRIPT_DIR}/..")"

export DOCKER_BUILDKIT=1
docker version
docker buildx version


docker buildx build --no-cache --progress=plain \
  --push \
  --build-arg BASE_IMAGE="$BASE_IMAGE" \
  -t "${REGISTRY}wax-python-runtime-codespaces:${COMMIT_SHA}" \
  -f "${SCRIPT_DIR}/Dockerfile.doc_snippets" \
  "${PROJECT_DIR}"
