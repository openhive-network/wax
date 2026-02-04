#!/bin/bash

set -xeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
WAX_PROJECT_DIR="$(dirname "$SCRIPT_DIR")/.."

API_GENERATION_DIR="${WAX_PROJECT_DIR}/hive/libraries/plugins/apis/api_generation"
PYTHON_DIR="${WAX_PROJECT_DIR}/python"

HIVE_REGISTRY_URL="https://gitlab.syncad.com/api/v4/groups/136/-/packages/pypi/simple"

if [ ! -d "${PYTHON_DIR}/.build" ]; then
    ${PYTHON_DIR}/scripts/build_wax.sh
fi

cd "${PYTHON_DIR}"
export WAX_SKIP_BUILD=true

poetry run pip install --index-url $HIVE_REGISTRY_URL --extra-index-url https://pypi.org/simple ${API_GENERATION_DIR}/database_api/dist/*.whl
poetry run pip install --index-url $HIVE_REGISTRY_URL --extra-index-url https://pypi.org/simple ${API_GENERATION_DIR}/network_broadcast_api/dist/*.whl
poetry run pip install --index-url $HIVE_REGISTRY_URL --extra-index-url https://pypi.org/simple ${API_GENERATION_DIR}/rc_api/dist/*.whl
poetry install
