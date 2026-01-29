#!/bin/bash
set -e

SCRIPTPATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
PROJECT_DIR="${SCRIPTPATH}/.."

REPO_URL="${1:?Missing repository url}"
REVISION_INFO="${2:?Missing argument pointing git revision}"
OUTPUT_DIR="${3:-${PROJECT_DIR}/docs-output/ts}"

pushd "${PROJECT_DIR}"

mkdir -vp "${OUTPUT_DIR}"

# Generate HTML documentation (default theme, no markdown plugins)
# Note: pnpm --dir ts sets working directory to ts/, so paths are relative to ts/
pnpm --dir ts exec typedoc \
  --includeVersion \
  --sourceLinkTemplate "${REPO_URL}/blob/{gitRevision}/{path}#L{line}" \
  --gitRevision "${REVISION_INFO}" \
  --readme README.md \
  --tsconfig tsconfig.json \
  --name "@hiveio/wax" \
  --out "${OUTPUT_DIR}" \
  wasm/lib/index.ts

popd
