#!/usr/bin/env sh
set -e

SCRIPTPATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
PROJECT_DIR="${SCRIPTPATH}/.."
PROTO_DIR="${PROJECT_DIR}/hive/libraries/protocol/proto"

OUTPUT_DIR="${PROJECT_DIR}/wasm/lib/proto"

if [ -d "${OUTPUT_DIR}" ]; then
  rm -r "${OUTPUT_DIR}"
fi

mkdir -p "${OUTPUT_DIR}"

protoc --plugin="${PROJECT_DIR}/node_modules/.bin/protoc-gen-ts_proto" \
  --ts_proto_opt=snakeToCamel=false \
  --ts_proto_opt=useOptional=all \
  --ts_proto_opt=esModuleInterop=true \
  --ts_proto_opt=forceLong=string \
  --ts_proto_opt=initializeFieldsAsUndefined=false \
  --ts_proto_out="${OUTPUT_DIR}" \
  --ts_proto_opt=importSuffix=.js \
  -I="${PROTO_DIR}" "$PROTO_DIR"/*.proto

echo "Files generated into the '${OUTPUT_DIR}' folder."
