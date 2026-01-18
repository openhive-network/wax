#! /bin/bash

set -xeuo pipefail

BASE_IMAGE=$1
COMMIT_SHA=$2
WAX_VERSION=${3:-${CI_COMMIT_TAG:-}}
REGISTRY=registry.gitlab.syncad.com/hive/wax/

if [ -z "$WAX_VERSION" ]; then
  echo "ERROR: WAX_VERSION must be provided as 3rd argument or CI_COMMIT_TAG must be set"
  exit 1
fi

SCRIPT_DIR="$(dirname "$(realpath "$0")")"
PROJECT_DIR="$(realpath "${SCRIPT_DIR}/..")"

export DOCKER_BUILDKIT=1
docker version
docker buildx version


docker buildx build --no-cache --progress=plain \
  --push \
  --build-arg BASE_IMAGE="$BASE_IMAGE" \
  --build-arg WAX_VERSION="$WAX_VERSION" \
  -t "${REGISTRY}wax-python-runtime-codespaces:${COMMIT_SHA}" \
  -f "${SCRIPT_DIR}/Dockerfile.doc_snippets" \
  "${PROJECT_DIR}"
