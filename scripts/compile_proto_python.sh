
#!/usr/bin/env sh
set -e

SCRIPTPATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
PROJECT_DIR="${SCRIPTPATH}/.."
PROTO_DIR="${PROJECT_DIR}/hive/libraries/protocol/proto"

OUTPUT_DIR="${PROJECT_DIR}/wasm/lib/proto/python"

if [ -d "${OUTPUT_DIR}" ]; then
  rm -r "${OUTPUT_DIR}"
fi

mkdir -p "${OUTPUT_DIR}"

python3 -m grpc_tools.protoc --python_out="${OUTPUT_DIR}" --mypy_out="${OUTPUT_DIR}" -I="${PROTO_DIR}" "$PROTO_DIR"/*.proto

echo "Files generated into the '${OUTPUT_DIR}' folder."
