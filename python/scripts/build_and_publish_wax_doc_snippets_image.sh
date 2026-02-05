#! /bin/bash

set -xeuo pipefail

COMMIT_SHA=$1
WAX_VERSION=$2
REGISTRY=registry.gitlab.syncad.com/hive/wax/

if [ -z "$COMMIT_SHA" ]; then
  echo "ERROR: COMMIT_SHA must be provided as 1st argument"
  exit 1
fi

if [ -z "$WAX_VERSION" ]; then
  echo "ERROR: WAX_VERSION must be provided as 2nd argument"
  exit 1
fi

SCRIPT_DIR="$(dirname "$(realpath "$0")")"
PROJECT_DIR="$(realpath "${SCRIPT_DIR}/..")"

export DOCKER_BUILDKIT=1
docker version
docker buildx version


docker buildx build --no-cache --progress=plain \
  --push \
  --build-arg WAX_VERSION="$WAX_VERSION" \
  -t "${REGISTRY}wax-python-runtime-codespaces:${COMMIT_SHA}" \
  -t "${REGISTRY}wax-python-runtime-codespaces:${WAX_VERSION}" \
  -f "${SCRIPT_DIR}/Dockerfile.doc_snippets" \
  "${PROJECT_DIR}"
