#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")/../python"

WAX_DIR="${PROJECT_DIR}/.."
HIVE_SUBMODULE_DIR="${WAX_DIR}/hive"
API_PACKAGES_GEN_DIR="${HIVE_SUBMODULE_DIR}/libraries/plugins/apis/api_generation"


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

  cleanup_old_api_package() {
    local api_package_name=$1

    if [ -d "${API_PACKAGES_GEN_DIR}/${api_package_name}" ]; then
      echo "Found old ${api_package_name} package. Removing it."
      rm -rf "${API_PACKAGES_GEN_DIR:?}/${api_package_name}"
    fi
  }

  # Check if unified hiveio_api package already exists (from CI artifacts or previous build)
  # Skip cleanup and generation if it exists - this allows Python 3.14 builds to use
  # pre-built packages from the Python 3.12 api_generation job
  if [ -f "${SCRIPT_DIR}/../../build_wheel.env" ] && \
     [ -d "${API_PACKAGES_GEN_DIR}/hiveio_api" ]; then
    echo "hiveio_api package already exists (from artifacts). Skipping cleanup and generation."
  else
    # Clean up old hiveio_api package before regenerating
    cleanup_old_api_package "hiveio_api"

    if [ -f "${SCRIPT_DIR}/../../build_wheel.env" ]; then
      echo "Found old build_wheel.env. Removing it."
      rm -rf "${SCRIPT_DIR}/../../build_wheel.env"
    fi

    echo "Build API packages."
    ${PROJECT_DIR}/scripts/build_api_packages.sh
  fi


  mkdir -p ${PROJECT_DIR}/.poetry_backup
  cp ${PROJECT_DIR}/pyproject.toml ${PROJECT_DIR}/.poetry_backup
  cp ${PROJECT_DIR}/poetry.lock ${PROJECT_DIR}/.poetry_backup

  set -o allexport
  source "${SCRIPT_DIR}/../../build_wheel.env"
  set +o allexport


  # Add the unified hiveio_api package as a dependency
  # First try from registry, then fall back to local source
  if poetry add --dry-run "hiveio-api@${HIVEIO_API_WHEEL_BUILD_VERSION}" --source gitlab-api-packages > /dev/null 2>&1; then
    echo "Using hiveio-api from registry."
    poetry add "hiveio-api@${HIVEIO_API_WHEEL_BUILD_VERSION}" --source gitlab-api-packages
  else
    echo "hiveio-api not found in registry, using local source."
    poetry add "../hive/libraries/plugins/apis/api_generation/hiveio_api"
  fi

  if [ -d "${PROJECT_DIR}/dist" ]; then
    echo "Found existing dist directory, removing it."
    rm -rf "${PROJECT_DIR}/dist"
  fi

  echo "Build wax wheel package."
  poetry -C ${PROJECT_DIR} build --format wheel

  echo "List dist directory: ${PROJECT_DIR}/dist"
  ls -lA ${PROJECT_DIR}/dist

  mv ${PROJECT_DIR}/.poetry_backup/pyproject.toml ${PROJECT_DIR}/pyproject.toml
  mv ${PROJECT_DIR}/.poetry_backup/poetry.lock ${PROJECT_DIR}/poetry.lock
  rm -rf "${PROJECT_DIR}/.poetry_backup"
fi
