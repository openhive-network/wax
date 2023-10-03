#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

DOCKER_IMAGE_REPO_NAME="registry.gitlab.syncad.com/hive/wax"
DOCKER_IMAGE_BASE_NAME="ci-base-image"
DOCKER_IMAGE_VERSION="ubuntu22.04-1"

DOCKER_IMAGE_NAME="${DOCKER_IMAGE_REPO_NAME}/${DOCKER_IMAGE_BASE_NAME}:${DOCKER_IMAGE_VERSION}"

docker build \
       -f ${PROJECT_DIR}/docker/wax-ci-base-image.dockerfile \
     -t ${DOCKER_IMAGE_NAME} \
     ${PROJECT_DIR}