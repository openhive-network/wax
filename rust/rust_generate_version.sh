#!/usr/bin/env bash

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

#PROJECT_NAME="${2:?Missing arg #2 pointing a project name}"

COMMIT_REF_PROTECTED="${1:-}"

COMMIT_TAG="${2:-}"

if [ "$COMMIT_REF_PROTECTED" == "true" ]; then
    if [ -n "$COMMIT_TAG" ]; then
        DIST_TAG="latest"
    else
        DIST_TAG="stable"
    fi
else
    DIST_TAG="dev"
fi

git config --global --add safe.directory '*'

git fetch --tags --quiet

TAG=$(git for-each-ref --sort=-creatordate --format '%(refname:lstrip=2)' refs/tags | grep -Eo '[0-9]+\.[0-9]+\.[0-9]+(-.+)?' | head -1)
TAG_TIME=$(TZ=UTC0 git show -s --date='format-local:%Y%m%d%H%M%S' --format=%cd)

echo $TAG
echo $TAG_TIME

if [ "${TAG}" = "" ]; then
  echo "Could not find a valid tag name for branch"
  exit 1
fi

if [ "${DIST_TAG}" = "latest" ]; then
    NEW_VERSION=$TAG
elif [ "${DIST_TAG}" = "stable" ]; then
    NEW_VERSION="${TAG}-stable.${TAG_TIME}"
else
    NEW_VERSION="${TAG}-${TAG_TIME}"
fi

echo $NEW_VERSION

cd "$SCRIPT_DIR/wax"

cargo set-version ${NEW_VERSION}

grep '^version' Cargo.toml