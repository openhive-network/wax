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

docker run --rm -v "${WAX_DIR}":"${WAX_DIR}" -e WAX_DEBUG=${WAX_DEBUG:-0} -e PYTHON_VERSION=${PYTHON_VERSION:-3} -w "${WAX_DIR}" ${IMAGE_NAME} bash -c "${WAX_DIR}/python/scripts/build_wax.sh 1"

else
  export POETRY_VIRTUALENVS_PATH="${PROJECT_DIR}/poetry-venv-root"

  # Tell poetry to use the current Python (from activated virtualenv)
  # This ensures the wheel is built for the correct Python version
  # Use "system" to respect the Python from the activated venv set up by CI
  cd ${PROJECT_DIR}
  poetry env use system
  echo "Poetry using Python: $(poetry run python --version)"

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

  # Check if API packages already exist (from CI artifacts or previous build)
  # Skip cleanup and generation if they exist - this allows Python 3.14 builds to use
  # pre-built packages from the hiveio_api_package CI job
  if [ -f "${SCRIPT_DIR}/../../build_wheel.env" ] && \
     [ -d "${API_PACKAGES_GEN_DIR}/hiveio_api" ]; then
    echo "API packages already exist (from artifacts). Skipping cleanup and generation."
  else
    # Clean up old API packages before regenerating
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


  add_api_dependency() {
    local api_package_name=$1
    local api_wheel_version=$2

    local published_name="${api_package_name//_/-}"
    echo "Published name: ${published_name}"

    if poetry add --dry-run "${published_name}@${api_wheel_version}" --source gitlab-api-packages > /dev/null 2>&1; then
      echo "Using ${published_name} from registry."
      poetry add "${published_name}@${api_wheel_version}" --source gitlab-api-packages
    else
      # Try to use pre-built wheel from artifacts first (preserves correct version)
      local wheel_dir="../hive/libraries/plugins/apis/api_generation/${api_package_name}/dist"
      local wheel_file=$(ls "${wheel_dir}/"*.whl 2>/dev/null | head -1)
      if [ -n "${wheel_file}" ]; then
        echo "${published_name} not found in registry, installing from local wheel."
        poetry add "${wheel_file}"
      else
        echo "${published_name} not found in registry, installing from source."
        poetry add "../hive/libraries/plugins/apis/api_generation/${api_package_name}"
      fi
    fi
  }

  add_api_dependency "hiveio_api" "${HIVEIO_API_WHEEL_BUILD_VERSION}"

  if [ -d "${PROJECT_DIR}/dist" ]; then
    echo "Found existing dist directory, removing it."
    rm -rf "${PROJECT_DIR}/dist"
  fi

  echo "Build wax wheel package."
  # Use pip wheel --no-build-isolation to build with the active virtualenv's Python.
  # Poetry's build isolation always uses Python 3.14 (ci-base-image default), ignoring the virtualenv.
  python3 -m pip install --quiet poetry-core "cython==3.0.12" "setuptools>=67.8.0" "poetry-dynamic-versioning>=0.22.0"
  cd ${PROJECT_DIR}
  python3 -m pip wheel --no-deps --no-build-isolation -w dist .

  # Deduplicate wheel to reduce size (removes duplicate .so files)
  echo "Deduplicating wheel package..."
  WHEEL_FILE=$(ls ${PROJECT_DIR}/dist/*.whl | head -1)
  python3 ${SCRIPT_DIR}/repack_wheel.py "${WHEEL_FILE}"
  rm "${WHEEL_FILE}"
  mv "${WHEEL_FILE%.whl}.dedup.whl" "${WHEEL_FILE}"

  echo "List dist directory: ${PROJECT_DIR}/dist"
  ls -lA ${PROJECT_DIR}/dist

  mv ${PROJECT_DIR}/.poetry_backup/pyproject.toml ${PROJECT_DIR}/pyproject.toml
  mv ${PROJECT_DIR}/.poetry_backup/poetry.lock ${PROJECT_DIR}/poetry.lock
  rm -rf "${PROJECT_DIR}/.poetry_backup"
fi
