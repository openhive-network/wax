#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")/../python"

WAX_DIR="${PROJECT_DIR}/../"

DIRECT_EXECUTION=${1:-0}

if [ ${DIRECT_EXECUTION} -eq 0 ]; then
COMMIT_HASH=$(git rev-parse --short HEAD)
IMAGE_BASE_NAME="wax-python-builder"
IMAGE_NAME="${IMAGE_BASE_NAME}:"${COMMIT_HASH}

USER_NAME=user
USER_ID=$(id -u)
GROUP_ID=$(id -g)

echo ${PROJECT_DIR}

echo "Create wax python builder."
docker build \
       -f ${PROJECT_DIR}/docker/wax-python-builder.dockerfile \
       --build-arg USER_NAME=${USER_NAME} \
       --build-arg USER_ID=${USER_ID} \
       --build-arg GROUP_ID=${GROUP_ID} \
     -t ${IMAGE_NAME} \
     -t ${IMAGE_BASE_NAME}:devcontainer \
     ${PROJECT_DIR}/../

docker run --rm -v "${WAX_DIR}":"${WAX_DIR}" -w "${WAX_DIR}" ${IMAGE_NAME} bash -c "${WAX_DIR}/python/scripts/build_wax.sh 1"

else
#  echo "Cleaning up."
#  DIRS=("dist" "build" ".build")

#  for directory in "${DIRS[@]}"; do
#      dir_path="${PROJECT_DIR}/${directory}"
#      
#      if [ -d "$dir_path" ]; then
#          echo "Removing '$dir_path'."
#          rm -rf "$dir_path"
#      fi
#      
#      mkdir -v "$dir_path"
#  done

  export WAX_DEBUG=1

  export POETRY_VIRTUALENVS_PATH="${PROJECT_DIR}/poetry-venv-root"

  cd ${PROJECT_DIR}/wax
  echo "Create proto files."
  ${PROJECT_DIR}/scripts/compile_proto.sh

  echo "Build wax wheel package."
  poetry -C ${PROJECT_DIR} build --format wheel

  echo "List dist directory: ${PROJECT_DIR}/dist"
  ls -lA ${PROJECT_DIR}/dist
fi
