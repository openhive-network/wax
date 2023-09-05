#!/usr/bin/env sh

SCRIPTPATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
PROJECT_DIR="${SCRIPTPATH}/.."

PUBLISH_TOKEN="${1}"
# @hive
SCOPE="${2:-@hiveio}"
# gitlab.syncad.com/api/v4/projects/419/packages/npm/
REGISTRY_URL="${3:-registry.npmjs.org/}"

git config --global --add safe.directory '*'

git fetch --tags

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
TAG=$(git describe --abbrev=0 --tags | grep -Eo '[0-9]+\.[0-9]+\.[0-9]+(-.+)?')
SHORT_HASH=$(git rev-parse --short HEAD)

NEW_VERSION=""

if [ "$CURRENT_BRANCH" = "master" ]; then
  NEW_VERSION="${TAG}"
elif [ "$CURRENT_BRANCH" = "develop" ]; then
  NEW_VERSION="${TAG}-stable.${SHORT_HASH}"
else
  NEW_VERSION="${TAG}-dev.${SHORT_HASH}"
fi

echo> "${PROJECT_DIR}/.npmrc"

if [ "$REGISTRY_URL" != "registry.npmjs.org/" ]; then
  echo "${SCOPE}:registry=https://${REGISTRY_URL}" >> "${PROJECT_DIR}/.npmrc"
fi

echo "//${REGISTRY_URL}:_authToken=\"${PUBLISH_TOKEN}\"" >> "${PROJECT_DIR}/.npmrc"

jq ".name = \"${SCOPE}/wax\" | .version = \"$NEW_VERSION\"" "${PROJECT_DIR}/package.json.template" > "${PROJECT_DIR}/package.json"
