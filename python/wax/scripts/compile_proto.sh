
#!/bin/bash
set -e

SCRIPTPATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
PROJECT_DIR="${SCRIPTPATH}/.."
WAX_DIR="${PROJECT_DIR}/../.."
PROTO_DIR="${WAX_DIR}/hive/libraries/protocol/proto"

OUTPUT_DIR="${PROJECT_DIR}/wax/_private/proto"
INIT_FILE_PATH="${OUTPUT_DIR}/__init__.py"

if [ -d "${OUTPUT_DIR}" ]; then
  rm -rf "${OUTPUT_DIR}"
fi

mkdir -vp "${OUTPUT_DIR}"

echo "Regenerate poetry.lock if needed..."
poetry -C ${PROJECT_DIR} lock --no-update 2>/dev/null || poetry -C ${PROJECT_DIR} lock

echo "Install proto-generation dependencies."
poetry -C ${PROJECT_DIR} install --no-root --only dev,static-analysis

GLOBIGNORE="${PROTO_DIR}/block.proto"

poetry -C ${PROJECT_DIR} run python3 -m grpc_tools.protoc \
--python_out="${OUTPUT_DIR}"  \
--mypy_out="${OUTPUT_DIR}" \
--mypy_grpc_out="${OUTPUT_DIR}" \
--grpc_python_out="${OUTPUT_DIR}" \
--proto_path="${PROTO_DIR}" \
-I="${PROTO_DIR}" "${PROTO_DIR}"/*.proto

echo "Files generated into the '${OUTPUT_DIR}' folder."

echo "Create __init__.py file for proper imports."
PYTHON_IMPORT_CODE="import sys
from pathlib import Path

sys.path.append(str(Path(__file__).parent.absolute()))"
echo "${PYTHON_IMPORT_CODE}" > "${INIT_FILE_PATH}"

echo "File ${INIT_FILE_PATH} has been created."
