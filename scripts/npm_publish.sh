#!/usr/bin/env sh

git config --global --add safe.directory '*'

git fetch --tags

SHORT_HASH=$(git rev-parse --short HEAD)
CURRENT_BRANCH_IMPL=$(git branch -r --contains "${SHORT_HASH}")
if [ "${CURRENT_BRANCH_IMPL}" = "" ]; then
  CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
else
  CURRENT_BRANCH="${CURRENT_BRANCH_IMPL#*/}"
fi

NAME=$(jq -r '.name' package.json)
TAG=$(jq -r '.version' package.json)

if [ "${TAG}" = "" ]; then
  echo "Could not find a valid tag name for branch"
  exit 1
fi

NEW_VERSION=""

if [ "$CURRENT_BRANCH" = "master" ]; then
  NEW_VERSION="latest"
elif [ "$CURRENT_BRANCH" = "develop" ]; then
  NEW_VERSION="stable"
else
  NEW_VERSION="dev"
fi

# Check if package with given version has been already published
npm view "${NAME}@${TAG}" version

if [ $? -eq 0 ]; then
  echo "Package already published"
else
  echo "Publishing ${NAME}@${TAG} to tag ${NEW_VERSION}"
  # We are going to repack the tarball as there are registry-dependent data in each job for package.json
  npm publish --access=public --tag "${NEW_VERSION}"
fi
