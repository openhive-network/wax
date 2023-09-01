#!/usr/bin/env sh

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

jq ".version = \"$NEW_VERSION\"" "${CI_PROJECT_DIR}/package.json.template" > "${CI_PROJECT_DIR}/package.json"
