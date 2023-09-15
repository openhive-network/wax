#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

COMMIT_HASH=$(git rev-parse --short HEAD)
IMAGE_NAME="wax-python-builder:"${COMMIT_HASH}

USER_NAME=user
USER_ID=$(id -u)
GROUP_ID=$(id -g)
WORKDIR=/home/${USER_NAME}

echo "Cleaning up."
if [ -d "${PROJECT_DIR}/dist" ] ; then
    echo "Removing '${PROJECT_DIR}/dist'."
    rm -rf "${PROJECT_DIR}/dist"
fi

if [ -d "${PROJECT_DIR}/build" ] ; then
    echo "Removing '${PROJECT_DIR}/build'."
    rm -rf "${PROJECT_DIR}/build"
fi

if [ -d "${PROJECT_DIR}/.build" ] ; then 
    echo "Removing '${PROJECT_DIR}/.build'."
    rm -rf "${PROJECT_DIR}/.build"
fi

echo "Create wax python builder."
docker build \
       -f ${PROJECT_DIR}/docker/wax-python-builder.dockerfile \
     --build-arg USER_NAME=${USER_NAME} \
     --build-arg USER_ID=${USER_ID}  \
     --build-arg GROUP_ID=${GROUP_ID} \
     -t ${IMAGE_NAME} \
     ${PROJECT_DIR}

echo "Create proto files."
docker run -v ${PROJECT_DIR}:${WORKDIR}/wax ${IMAGE_NAME} bash -c "${WORKDIR}/wax/scripts/compile_proto_python.sh"

echo "Build wax wheel package."
docker run -v ${PROJECT_DIR}:${WORKDIR}/wax ${IMAGE_NAME} poetry -C ${WORKDIR}/wax build

echo "List dist directory."
ls ${PROJECT_DIR}/dist