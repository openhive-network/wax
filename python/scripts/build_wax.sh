#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")/../python"

WAX_DIR="${PROJECT_DIR}/.."
HIVE_SUBMODULE_DIR="${WAX_DIR}/hive"


DIRECT_EXECUTION=${1:-0}
WAX_DEBUG=${2:-${WAX_DEBUG:-0}}

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

docker run --rm -v "${WAX_DIR}":"${WAX_DIR}" -e WAX_DEBUG=${WAX_DEBUG:-0} -w "${WAX_DIR}" ${IMAGE_NAME} bash -c "${WAX_DIR}/python/scripts/build_wax.sh 1"

else
  export POETRY_VIRTUALENVS_PATH="${PROJECT_DIR}/poetry-venv-root"

  rm -rf ${PROJECT_DIR}/setup.py

  cd ${PROJECT_DIR}/wax
  echo "Create proto files."
  ${PROJECT_DIR}/scripts/compile_proto.sh

  if [ ! -f "${SCRIPT_DIR}/../../build_wheel.env" ]; then
      ${PROJECT_DIR}/scripts/build_api_packages.sh
  fi

  set -o allexport
  source "${SCRIPT_DIR}/../../build_wheel.env"
  set +o allexport

  mkdir -p ${PROJECT_DIR}/.poetry_backup
  cp ${PROJECT_DIR}/pyproject.toml ${PROJECT_DIR}/.poetry_backup
  cp ${PROJECT_DIR}/poetry.lock ${PROJECT_DIR}/.poetry_backup

  poetry add database_api@${WHEEL_BUILD_VERSION} --source gitlab-api-packages
  poetry add network_broadcast_api@${WHEEL_BUILD_VERSION} --source gitlab-api-packages

  echo "Build wax wheel package."
  poetry -C ${PROJECT_DIR} build --format wheel

  echo "List dist directory: ${PROJECT_DIR}/dist"
  ls -lA ${PROJECT_DIR}/dist

  mv ${PROJECT_DIR}/.poetry_backup/pyproject.toml ${PROJECT_DIR}/pyproject.toml
  mv ${PROJECT_DIR}/.poetry_backup/poetry.lock ${PROJECT_DIR}/poetry.lock
  rm -rf "${PROJECT_DIR}/.poetry_backup"
fi
