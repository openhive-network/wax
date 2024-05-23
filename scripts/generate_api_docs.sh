#!/bin/bash
set -e

SCRIPTPATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
PROJECT_DIR="${SCRIPTPATH}/.."

REPO_URL="${1:?Missing repository url}"
REVISION_INFO="${2:?Missing argument pointing git revision}"

OUTPUT_DIR=wasm/dist/docs
INPUT_FILE=wasm/lib/web.ts

# When using TypeScript, we are restricted to a specific typedoc and typedoc-plugin-markdown versions
# https://typedoc.org/guides/installation/#requirements
pushd "${PROJECT_DIR}"

mkdir -vp "${OUTPUT_DIR}"

pnpm exec typedoc --includeVersion \
  --sourceLinkTemplate "${REPO_URL}/-/blob/{gitRevision}/{path}#L{line}" \
  --gitRevision "${REVISION_INFO}" \
  --readme npm.ts.md \
  --plugin typedoc-plugin-markdown \
  --plugin typedoc-gitlab-wiki-theme \
  --tsconfig tsconfig.json \
  --out "${OUTPUT_DIR}" \
  "${INPUT_FILE}"

popd
