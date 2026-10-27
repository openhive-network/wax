#!/usr/bin/env bash
# Build (and with --push, publish) the test runtime image of .aidev/runtime/Dockerfile
# and print the digest-pinned reference to put in .aidev/project.yaml's
# `environment.image`. See .aidev/README.md.
#
# The base is the emsdk image common-ci-configuration's npm_projects template
# names (EMSCRIPTEN_IMAGE_TAG in the ts/npm-common-config submodule), resolved to
# its registry digest. The tag is `aidev-<hash>`, the hash of the image inputs
# (that digest, the Dockerfile, `packageManager` from ts/package.json, ts/pnpm-lock.yaml, and the workspace
# file and .npmrc that ts/ links from the npm-common-config submodule); the
# registry cleanup policy keeps `aidev-*` tags. When <repository>:aidev-<hash> is
# already in the registry nothing is built: the script prints that image's digest.
#
#   .aidev/runtime/build.sh           # registry digest, or build locally and print the local tag
#   .aidev/runtime/build.sh --push    # registry digest, or build + push and print repo@sha256:<digest>
#   .aidev/runtime/build.sh --tag     # print the input-hash tag only (needs the registry for the emsdk digest)
set -euo pipefail

cd "$(dirname "$0")/../.."

REPOSITORY="${AIDEV_RUNTIME_REPOSITORY:-registry.gitlab.syncad.com/hive/wax/aidev-tests}"

# ts/pnpm-workspace.yaml and ts/.npmrc are symlinks into the submodule; read through them.
[ -e ts/pnpm-workspace.yaml ] || { echo "ts/npm-common-config is not checked out: git submodule update --init ts/npm-common-config" >&2; exit 1; }

# Digest of an image reference in the registry, empty when it doesn't exist.
registry_digest() {
    docker buildx imagetools inspect "$1" --format '{{json .Manifest}}' 2>/dev/null \
        | grep -o '"digest": *"sha256:[0-9a-f]*"' | head -1 | grep -o 'sha256:[0-9a-f]*' || true
}

EMSDK_REPOSITORY=registry.gitlab.syncad.com/hive/common-ci-configuration/emsdk
emsdk_tag="$(sed -n 's/^  EMSCRIPTEN_IMAGE_TAG: "\(.*\)"$/\1/p' ts/npm-common-config/templates/npm_projects.gitlab-ci.yml)"
[ -n "$emsdk_tag" ] || { echo "no EMSCRIPTEN_IMAGE_TAG in ts/npm-common-config/templates/npm_projects.gitlab-ci.yml" >&2; exit 1; }
emsdk_digest="$(registry_digest "$EMSDK_REPOSITORY:$emsdk_tag")"
[ -n "$emsdk_digest" ] || { echo "$EMSDK_REPOSITORY:$emsdk_tag is not in the registry" >&2; exit 1; }
EMSCRIPTEN_IMAGE="$EMSDK_REPOSITORY@$emsdk_digest"

# `pnpm fetch` reads only the lockfile, the workspace file and .npmrc; of
# package.json the image uses `packageManager` alone, so its other fields
# (scripts, versions) don't make a new image.
input_hash() {
    {
        echo "$EMSCRIPTEN_IMAGE"
        sha256sum .aidev/runtime/Dockerfile
        cat ts/pnpm-lock.yaml ts/pnpm-workspace.yaml ts/.npmrc | sha256sum
        grep '"packageManager"' ts/package.json
    } | sha256sum | cut -c1-16
}
TAG="aidev-$(input_hash)"

case "${1:-}" in
    --tag) echo "$TAG"; exit 0 ;;
    ""|--push) ;;
    *) echo "usage: $0 [--push|--tag]" >&2; exit 2 ;;
esac

digest="$(registry_digest "$REPOSITORY:$TAG")"
if [ -n "$digest" ]; then
    echo "$REPOSITORY:$TAG exists in the registry; not building" >&2
    echo "$REPOSITORY@$digest"
    exit 0
fi
echo "$REPOSITORY:$TAG is not in the registry; building it" >&2

# Only the files the Dockerfile copies (dereferenced): ts/ holds node_modules.
context="$(mktemp -d)"
trap 'rm -rf "$context"' EXIT
cp -L ts/package.json ts/pnpm-lock.yaml ts/pnpm-workspace.yaml ts/.npmrc "$context/"

# No --pull: the FROM is digest-pinned, so a local copy is the same image.
# No provenance, so the pushed digest is a plain image manifest.
build=(docker buildx build --provenance=false --build-arg EMSCRIPTEN_IMAGE="$EMSCRIPTEN_IMAGE" \
    -f .aidev/runtime/Dockerfile -t "$REPOSITORY:$TAG")
if [ "${1:-}" != "--push" ]; then
    "${build[@]}" --load "$context" >&2
    echo "$REPOSITORY:$TAG"
    exit 0
fi

"${build[@]}" --push --metadata-file "$context/metadata.json" "$context" >&2
digest="$(grep -o '"containerimage.digest": *"sha256:[0-9a-f]*"' "$context/metadata.json" | grep -o 'sha256:[0-9a-f]*')"
echo "$REPOSITORY@${digest:?no digest in buildx metadata}"
