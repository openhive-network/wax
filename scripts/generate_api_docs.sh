#!/bin/bash

set -e

SCRIPTPATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
PROJECT_DIR="${SCRIPTPATH}/.."

# When using TypeScript 4.4.4, we are restricted to a specific typedoc and typedoc-plugin-markdown versions
# https://typedoc.org/guides/installation/#requirements
pushd "${PROJECT_DIR}"
mkdir -vp build
pnpm exec typedoc --plugin typedoc-plugin-markdown --theme markdown --excludeInternal --hideBreadcrumbs --hideInPageTOC --out wasm/dist/docs wasm/lib/web.ts
mv wasm/dist/docs/modules.md wasm/dist/docs/_modules.md
rm wasm/dist/docs/README.md
pnpm exec concat-md --decrease-title-levels wasm/dist/docs > api.md
popd
