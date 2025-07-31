#!/bin/bash

set -xeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
WAX_PROJECT_DIR="$(dirname "$SCRIPT_DIR")/.."

API_GENERATION_DIR="${WAX_PROJECT_DIR}/hive/libraries/plugins/apis/api_generation"
PYTHON_DIR="${WAX_PROJECT_DIR}/python"

SCHEMAS_REGISTRY_URL="https://gitlab.syncad.com/api/v4/projects/362/packages/pypi/simple"
BEEKEEPY_REGISTRY_URL="https://gitlab.syncad.com/api/v4/projects/434/packages/pypi/simple"

if [ ! -d "${PYTHON_DIR}/.build" ]; then
    ${PYTHON_DIR}/scripts/build_wax.sh
fi

cd "${PYTHON_DIR}"
export WAX_SKIP_BUILD=true

poetry run pip install --index-url $SCHEMAS_REGISTRY_URL --extra-index-url $BEEKEEPY_REGISTRY_URL ${API_GENERATION_DIR}/database_api/dist/*.whl
poetry run pip install --index-url $SCHEMAS_REGISTRY_URL --extra-index-url $BEEKEEPY_REGISTRY_URL ${API_GENERATION_DIR}/network_broadcast_api/dist/*.whl
poetry install
