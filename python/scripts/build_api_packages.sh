#!/bin/bash

set -xeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
WAX_PROJECT_DIR="$(dirname "$SCRIPT_DIR")/.."
API_GENERATION_DIR="${WAX_PROJECT_DIR}/hive/libraries/plugins/apis/api_generation"

cd "${API_GENERATION_DIR}/api_generation"
poetry install
${API_GENERATION_DIR}/generate_api_packages.sh database_api network_broadcast_api

poetry -C "${API_GENERATION_DIR}/database_api" build --format wheel
poetry -C "${API_GENERATION_DIR}/network_broadcast_api" build --format wheel

WHEEL_BUILD_VERSION=$(poetry -C "${API_GENERATION_DIR}/database_api" version -s)

echo "WHEEL_BUILD_VERSION=${WHEEL_BUILD_VERSION}" > "${SCRIPT_DIR}/../../build_wheel.env"
