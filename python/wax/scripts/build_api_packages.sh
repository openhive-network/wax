#!/bin/bash

set -xeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
WAX_PROJECT_DIR="$(dirname "$SCRIPT_DIR")/../.."
APIS_DIR="${WAX_PROJECT_DIR}/hive/libraries/plugins/apis"
API_GENERATION_DIR="${APIS_DIR}/api_generation"
HIVEIO_API_DIR="${API_GENERATION_DIR}/hiveio_api"

cd "${API_GENERATION_DIR}/api_generation"
poetry install

cd "${API_GENERATION_DIR}"
npm install @apidevtools/json-schema-ref-parser@14.2.1 json-schema-merge-allof@0.8.1  # Install dependencies for flatten_swagger.js
node "${API_GENERATION_DIR}/flatten_swagger.js" "${APIS_DIR}/documentation/openapi.json" > "${APIS_DIR}/documentation/openapi_flattened.json"

# Generate the unified hiveio_api package with all required APIs
"${API_GENERATION_DIR}/generate_api_packages.sh" database_api network_broadcast_api rc_api

# Build the unified hiveio_api wheel
HIVEIO_API_DIR="${API_GENERATION_DIR}/hiveio_api"
poetry -C "${HIVEIO_API_DIR}" build --format wheel

# Workaround: installs plugins from [tool.poetry.requires-plugins] without installing project dependencies.
# See: https://github.com/python-poetry/poetry/issues/9990#issuecomment-2737176168
poetry -C "${HIVEIO_API_DIR}" install --dry-run
HIVEIO_API_WHEEL_BUILD_VERSION=$(poetry -C "${HIVEIO_API_DIR}" version -s)

echo "HIVEIO_API_WHEEL_BUILD_VERSION=${HIVEIO_API_WHEEL_BUILD_VERSION}" >> "${WAX_PROJECT_DIR}/build_wheel.env"

echo "Clean up generated flattened openapi_flattened.json."
rm -f "${APIS_DIR}/documentation/openapi_flattened.json"
