#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

DIRECT_EXECUTION=${1:-0}

if [ ${DIRECT_EXECUTION} -eq 0 ]; then
COMMIT_HASH=$(git rev-parse --short HEAD)
IMAGE_NAME="wax-python-builder:"${COMMIT_HASH}

USER_NAME=user
USER_ID=$(id -u)
GROUP_ID=$(id -g)
WORKDIR=/home/${USER_NAME}

echo "Create wax python builder."
docker build \
       -f ${PROJECT_DIR}/docker/wax-python-builder.dockerfile \
       --build-arg USER_NAME=${USER_NAME} \
       --build-arg USER_ID=${USER_ID} \
       --build-arg GROUP_ID=${GROUP_ID} \
     -t ${IMAGE_NAME} \
     ${PROJECT_DIR}

docker run -v ${PROJECT_DIR}:${WORKDIR}/wax ${IMAGE_NAME} bash -c "${WORKDIR}/wax/scripts/build_wax_python.sh 1"

else
  echo "Cleaning up."
  DIRS=("dist" "build" ".build")

  for directory in "${DIRS[@]}"; do
      dir_path="${PROJECT_DIR}/${directory}"
      
      if [ -d "$dir_path" ]; then
          echo "Removing '$dir_path'."
          rm -rf "$dir_path"
      fi
      
      mkdir "$dir_path"
  done

  echo "Install poetry dependencies."
  poetry -C ${PROJECT_DIR} install --no-root

  cd ${PROJECT_DIR}/wax
  echo "Create proto files."
  ${PROJECT_DIR}/scripts/compile_proto_python.sh

  echo "Build wax wheel package."
  poetry -C ${PROJECT_DIR} build

  echo "List dist directory."
  ls ${PROJECT_DIR}/dist
fi
