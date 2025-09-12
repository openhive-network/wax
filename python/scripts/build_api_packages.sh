#!/bin/bash

set -xeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
WAX_PROJECT_DIR="$(dirname "$SCRIPT_DIR")/.."
APIS_DIR="${WAX_PROJECT_DIR}/hive/libraries/plugins/apis"
API_GENERATION_DIR="${APIS_DIR}/api_generation"

cd "${API_GENERATION_DIR}/api_generation"
poetry install

cd "${API_GENERATION_DIR}"
npm install @apidevtools/json-schema-ref-parser@14.2.1 json-schema-merge-allof@0.8.1  # Install dependencies for flatten_swagger.js
node "${API_GENERATION_DIR}/flatten_swagger.js" "${APIS_DIR}/documentation/openapi.json" > "${APIS_DIR}/documentation/openapi_flattened.json"

"${API_GENERATION_DIR}/generate_api_packages.sh" database_api network_broadcast_api

poetry -C "${API_GENERATION_DIR}/database_api" build --format wheel
poetry -C "${API_GENERATION_DIR}/network_broadcast_api" build --format wheel

DATABASE_API_WHEEL_BUILD_VERSION=$(poetry -C "${API_GENERATION_DIR}/database_api" version -s)
NETWORK_BROADCAST_API_WHEEL_BUILD_VERSION=$(poetry -C "${API_GENERATION_DIR}/network_broadcast_api" version -s)

echo "DATABASE_API_WHEEL_BUILD_VERSION=${DATABASE_API_WHEEL_BUILD_VERSION}" >> "${SCRIPT_DIR}/../../build_wheel.env"
echo "NETWORK_BROADCAST_API_WHEEL_BUILD_VERSION=${NETWORK_BROADCAST_API_WHEEL_BUILD_VERSION}" >> "${SCRIPT_DIR}/../../build_wheel.env"

echo "Clean up generated flattened openapi_flattened.json."
rm -f "${APIS_DIR}/documentation/openapi_flattened.json"
