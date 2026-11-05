#!/usr/bin/env bash
# Build (and with --push, publish) the image AIDEV's Python suite (.aidev/run-python.sh)
# runs in, python/wax/docker/wax-python-aidev-tests.dockerfile, and print the reference
# to bind as the `image:` of the `python` suites in .aidev/project.yaml. See .aidev/README.md.
#
# The base is CI_BASE_IMAGE (its tag from .gitlab-ci.yml), resolved to its registry digest.
# The tag is `aidev-<hash>`, the hash of that digest, the dockerfile and the build context
# (the lock files and pyproject.toml files the dependencies are installed from, the ts/ pnpm
# inputs, common-ci-configuration's python-test-tools constraints script, and
# `.aidev/run-python.sh --inputs`, which the image records); the registry
# cleanup policy keeps `aidev-*` tags. When <repository>:aidev-<hash> is already in the
# registry nothing is built: the script prints that image's digest.
#
#   python/wax/scripts/build_wax_python_aidev_tests_image.sh          # registry digest, or build locally and print the local tag
#   python/wax/scripts/build_wax_python_aidev_tests_image.sh --push   # registry digest, or build + push and print repo@sha256:<digest>
#   python/wax/scripts/build_wax_python_aidev_tests_image.sh --tag    # print the input-hash tag only
set -euo pipefail

cd "$(dirname "$0")/../../.."

REPOSITORY="${WAX_PYTHON_AIDEV_TESTS_REPOSITORY:-registry.gitlab.syncad.com/hive/wax/wax-python-aidev-tests}"
DOCKERFILE=python/wax/docker/wax-python-aidev-tests.dockerfile

case "${1:-}" in
    ""|--push|--tag) ;;
    *) echo "usage: $0 [--push|--tag]" >&2; exit 2 ;;
esac

# ts/pnpm-workspace.yaml, ts/.npmrc and the constraints script are in the submodule.
[ -e ts/pnpm-workspace.yaml ] || { echo "ts/npm-common-config is not checked out: git submodule update --init ts/npm-common-config" >&2; exit 1; }

# Digest of an image reference in the registry, empty when it doesn't exist.
registry_digest() {
    docker buildx imagetools inspect "$1" --format '{{json .Manifest}}' 2>/dev/null \
        | grep -o '"digest": *"sha256:[0-9a-f]*"' | head -1 | grep -o 'sha256:[0-9a-f]*' || true
}

BASE_REPOSITORY=registry.gitlab.syncad.com/hive/wax/ci-base-image
base_tag="$(sed -n 's/^  CI_BASE_IMAGE_TAG: "\([^"]*\)".*/\1/p' .gitlab-ci.yml)"
[ -n "$base_tag" ] || { echo "no CI_BASE_IMAGE_TAG in .gitlab-ci.yml" >&2; exit 1; }
base_digest="$(registry_digest "$BASE_REPOSITORY:$base_tag")"
[ -n "$base_digest" ] || { echo "$BASE_REPOSITORY:$base_tag is not in the registry" >&2; exit 1; }
CI_BASE_IMAGE="$BASE_REPOSITORY@$base_digest"

# The build context: the files the dockerfile reads, dereferenced, under their repository
# paths (ts/ and python/ hold node_modules and build trees, so not the checkout itself).
context="$(mktemp -d)"
metadata="$(mktemp)"
trap 'rm -rf "$context" "$metadata"' EXIT
mkdir -p "$context/python/wax/tests" "$context/python/test_tools" "$context/ts" "$context/ccc"
cp python/wax/pyproject.toml python/wax/poetry.lock "$context/python/wax/"
git ls-files -z python/wax/tests/wax-local-tools | xargs -0 cp --parents -t "$context"
cp python/test_tools/pyproject.toml python/test_tools/poetry.lock python/test_tools/readme.md "$context/python/test_tools/"
cp -L ts/package.json ts/pnpm-lock.yaml ts/pnpm-workspace.yaml ts/.npmrc "$context/ts/"
cp ts/npm-common-config/scripts/python/python-test-tools-constraints.py \
    ts/npm-common-config/scripts/python/registry_auth.py "$context/ccc/"
.aidev/run-python.sh --inputs > "$context/inputs"

input_hash() {
    {
        echo "$CI_BASE_IMAGE"
        sha256sum "$DOCKERFILE"
        (cd "$context" && find . -type f -print0 | sort -z | xargs -0 sha256sum)
    } | sha256sum | cut -c1-16
}
TAG="aidev-$(input_hash)"
[ "${1:-}" = "--tag" ] && { echo "$TAG"; exit 0; }

digest="$(registry_digest "$REPOSITORY:$TAG")"
if [ -n "$digest" ]; then
    echo "$REPOSITORY:$TAG exists in the registry; not building" >&2
    echo "$REPOSITORY@$digest"
    exit 0
fi
echo "$REPOSITORY:$TAG is not in the registry; building it" >&2

# No --pull: the FROM is digest-pinned, so a local copy is the same image.
# No provenance, so the pushed digest is a plain image manifest.
build=(docker buildx build --provenance=false --build-arg CI_BASE_IMAGE="$CI_BASE_IMAGE" \
    -f "$DOCKERFILE" -t "$REPOSITORY:$TAG")
if [ "${1:-}" != "--push" ]; then
    "${build[@]}" --load "$context" >&2
    echo "$REPOSITORY:$TAG"
    exit 0
fi

"${build[@]}" --push --metadata-file "$metadata" "$context" >&2
digest="$(grep -o '"containerimage.digest": *"sha256:[0-9a-f]*"' "$metadata" | grep -o 'sha256:[0-9a-f]*')"
echo "Pushed $REPOSITORY@${digest:?no digest in buildx metadata}" >&2
echo "$REPOSITORY@$digest"
