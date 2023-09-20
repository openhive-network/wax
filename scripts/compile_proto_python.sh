
#!/usr/bin/env sh
set -e

SCRIPTPATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
PROJECT_DIR="${SCRIPTPATH}/.."
PROTO_DIR="${PROJECT_DIR}/hive/libraries/protocol/proto"

OUTPUT_DIR="${PROJECT_DIR}/wax/proto"
INIT_FILE_PATH="${OUTPUT_DIR}/__init__.py"

if [ -d "${OUTPUT_DIR}" ]; then
  rm -rf "${OUTPUT_DIR}"
fi

mkdir -p "${OUTPUT_DIR}"

poetry -C ${PROJECT_DIR} protoc --python_out="${OUTPUT_DIR}" --mypy_out="${OUTPUT_DIR}" --proto_path="${PROTO_DIR}" 

echo "Files generated into the '${OUTPUT_DIR}' folder."

echo "Create __init__.py file for proper imports."
PYTHON_IMPORT_CODE="import sys
from pathlib import Path

sys.path.append(str(Path(__file__).parent.absolute()))"
echo "${PYTHON_IMPORT_CODE}" > "${INIT_FILE_PATH}"

echo "File ${INIT_FILE_PATH} has been created."