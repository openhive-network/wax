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

SHORT_HASH=$(git rev-parse --short HEAD)
CURRENT_BRANCH_IMPL=$(git branch -r --contains "${SHORT_HASH}")
if [ "${CURRENT_BRANCH_IMPL}" = "" ]; then
  CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
else
  CURRENT_BRANCH="${CURRENT_BRANCH_IMPL#*/}"
fi
TAG=$(git tag --sort=taggerdate | grep -Eo '[0-9]+\.[0-9]+\.[0-9]+(-.+)?' | tail -1)

echo "Preparing npm packge for ${CURRENT_BRANCH}@${TAG} (#${SHORT_HASH})"

if [ "${TAG}" = "" ]; then
  echo "Could not find a valid tag name for branch"
  exit 1
fi

<<<<<<< HEAD
DIST_TAG=""
=======
PACKAGE_NAME=wax
>>>>>>> 9d54ad7 (Fix npm publishing conflicts)
NEW_VERSION=""

if [ "$CURRENT_BRANCH" = "master" ]; then
  DIST_TAG="latest"
  NEW_VERSION="${TAG}"
elif [ "$CURRENT_BRANCH" = "develop" ]; then
  DIST_TAG="stable"
  NEW_VERSION="${TAG}-stable.${SHORT_HASH}"
else
<<<<<<< HEAD
  DIST_TAG="dev"
=======
  PACKAGE_NAME=wax-dev
>>>>>>> 9d54ad7 (Fix npm publishing conflicts)
  NEW_VERSION="${TAG}-${SHORT_HASH}"
fi

echo> "${PROJECT_DIR}/.npmrc"

if [ "$REGISTRY_URL" != "registry.npmjs.org/" ]; then
  echo "${SCOPE}:registry=https://${REGISTRY_URL}" >> "${PROJECT_DIR}/.npmrc"
fi

echo "//${REGISTRY_URL}:_authToken=\"${PUBLISH_TOKEN}\"" >> "${PROJECT_DIR}/.npmrc"

<<<<<<< HEAD
jq ".name = \"${SCOPE}/wax\" | .version = \"$NEW_VERSION\" | .publishConfig.registry = \"https://${REGISTRY_URL}\" | .publishConfig.tag = \"${DIST_TAG}\"" "${PROJECT_DIR}/package.json.template" > "${PROJECT_DIR}/package.json"

# Display detailed publish config data
jq -r '.name + "@" + .version + " (" + .publishConfig.tag + ") " + .publishConfig.registry' "package.json"
=======
jq ".name = \"${SCOPE}/${PACKAGE_NAME}\" | .version = \"$NEW_VERSION\"" "${PROJECT_DIR}/package.json.template" > "${PROJECT_DIR}/package.json"
>>>>>>> 9d54ad7 (Fix npm publishing conflicts)
