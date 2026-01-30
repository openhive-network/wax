#!/bin/bash
set -e

# Deploy documentation to GitHub Pages repository
#
# Usage: deploy_github_pages.sh <version> <ts_docs_dir> <py_docs_dir> <wiki_docs_dir> <github_repo> <github_token> <project_subdir>
#
# Arguments:
#   version        - Version name (e.g., "develop", "v1.0.0")
#   ts_docs_dir    - Directory containing TypeScript HTML docs
#   py_docs_dir    - Directory containing Python mkdocs output
#   wiki_docs_dir  - Directory containing wiki documentation
#   github_repo    - GitHub repository (e.g., "openhive-network/hive-doc")
#   github_token   - GitHub token with repo write access
#   project_subdir - Subdirectory in hive-doc for this project (e.g., "wax")

SCRIPTPATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

VERSION="${1:?Missing version argument}"
TS_DOCS_DIR="${2:?Missing TypeScript docs directory}"
PY_DOCS_DIR="${3:?Missing Python docs directory}"
WIKI_DOCS_DIR="${4:?Missing wiki docs directory}"
GITHUB_REPO="${5:?Missing GitHub repository}"
GITHUB_TOKEN="${6:?Missing GitHub token}"
PROJECT_SUBDIR="${7:?Missing project subdirectory}"
WORK_DIR=$(mktemp -d)
GITHUB_PAGES_BRANCH="main"

cleanup() {
  rm -rf "${WORK_DIR}"
}
trap cleanup EXIT

echo "=== Deploying ${PROJECT_SUBDIR} docs version ${VERSION} to ${GITHUB_REPO} ==="

# Clone the GitHub Pages repository
cd "${WORK_DIR}"
git clone --depth 1 --branch "${GITHUB_PAGES_BRANCH}" \
  "https://x-access-token:${GITHUB_TOKEN}@github.com/${GITHUB_REPO}.git" repo 2>/dev/null || {
  echo "Branch ${GITHUB_PAGES_BRANCH} doesn't exist, creating new repository structure"
  mkdir repo
  cd repo
  git init
  git checkout -b "${GITHUB_PAGES_BRANCH}"
  cd ..
}

cd repo

# Create project directory structure
mkdir -p "${PROJECT_SUBDIR}/${VERSION}"

# Copy documentation
echo "Copying TypeScript docs from ${TS_DOCS_DIR}"
cp -r "${TS_DOCS_DIR}" "${PROJECT_SUBDIR}/${VERSION}/ts"

echo "Copying Python docs from ${PY_DOCS_DIR}"
cp -r "${PY_DOCS_DIR}" "${PROJECT_SUBDIR}/${VERSION}/py"

echo "Copying wiki docs from ${WIKI_DOCS_DIR}"
cp -r "${WIKI_DOCS_DIR}" "${PROJECT_SUBDIR}/${VERSION}/wiki"

# Update versions.json for this project
VERSIONS_FILE="${PROJECT_SUBDIR}/versions.json"
if [[ -f "${VERSIONS_FILE}" ]]; then
  # Add version if not present, sort: develop first, then semver descending
  jq --arg v "${VERSION}" '
    .versions |= ([$v] + . | unique |
      sort_by(
        if . == "develop" then "0"
        else (. | ltrimstr("v") | split(".") | map(tonumber? // 0 | . + 1000) | map(tostring) | join("."))
        end
      ) |
      [.[] | select(. == "develop")] + [.[] | select(. != "develop")] |
      reverse |
      if .[0] == "develop" then [.[0]] + (.[1:] | reverse) else reverse end
    )
  ' "${VERSIONS_FILE}" > "${VERSIONS_FILE}.tmp"
  mv "${VERSIONS_FILE}.tmp" "${VERSIONS_FILE}"
else
  echo "{\"versions\":[\"${VERSION}\"]}" > "${VERSIONS_FILE}"
fi

echo "Updated versions.json:"
cat "${VERSIONS_FILE}"

# Copy project landing page from template
cp "${SCRIPTPATH}/doc-index-template.html" "${PROJECT_SUBDIR}/index.html"

# Add .nojekyll to prevent Jekyll processing
touch .nojekyll

# Commit and push
git config user.email "ci@syncad.com"
git config user.name "GitLab CI"

git add -A
if git diff --staged --quiet; then
  echo "No changes to deploy"
else
  git commit -m "Deploy ${PROJECT_SUBDIR} docs ${VERSION}

Automated deployment from GitLab CI
Source: https://gitlab.syncad.com/hive/wax"

  git push "https://x-access-token:${GITHUB_TOKEN}@github.com/${GITHUB_REPO}.git" "${GITHUB_PAGES_BRANCH}"
  echo "=== Successfully deployed ${PROJECT_SUBDIR} ${VERSION} ==="
fi
