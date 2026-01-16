#!/bin/bash

set -xeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
WAX_PROJECT_DIR="$(dirname "$SCRIPT_DIR")/.."
APIS_DIR="${WAX_PROJECT_DIR}/hive/libraries/plugins/apis"
API_GENERATION_DIR="${APIS_DIR}/api_generation"
HIVEIO_API_DIR="${API_GENERATION_DIR}/hiveio_api"

cd "${API_GENERATION_DIR}/api_generation"
# Use Python 3.12 for api_generation (datamodel_code_generator doesn't support Python 3.14 yet)
# Create and activate venv with Python 3.12, then tell poetry to use system Python (the active venv)
rm -rf .venv
/opt/python/cp312-cp312/bin/python -m venv .venv
source .venv/bin/activate
poetry env use system
poetry install

cd "${API_GENERATION_DIR}"
npm install @apidevtools/json-schema-ref-parser@14.2.1 json-schema-merge-allof@0.8.1  # Install dependencies for flatten_swagger.js
node "${API_GENERATION_DIR}/flatten_swagger.js" "${APIS_DIR}/documentation/openapi.json" > "${APIS_DIR}/documentation/openapi_flattened.json"

# Generate the unified hiveio_api package with the required APIs
"${API_GENERATION_DIR}/generate_api_packages.sh" database_api network_broadcast_api rc_api

# Build the unified hiveio_api package
poetry -C "${HIVEIO_API_DIR}" build --format wheel

HIVEIO_API_WHEEL_BUILD_VERSION=$(poetry -C "${HIVEIO_API_DIR}" version -s)

echo "HIVEIO_API_WHEEL_BUILD_VERSION=${HIVEIO_API_WHEEL_BUILD_VERSION}" >> "${SCRIPT_DIR}/../../build_wheel.env"

echo "Clean up generated flattened openapi_flattened.json."
rm -f "${APIS_DIR}/documentation/openapi_flattened.json"

deactivate
