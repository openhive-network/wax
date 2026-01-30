#!/bin/bash
set -e

# Deploy documentation to GitHub Pages repository
#
# Usage: deploy_github_pages.sh <version> <ts_docs_dir> <py_docs_dir> <extra_docs_dir> <github_docs_subdir> <github_repo> <github_token> <project_subdir>
#
# Arguments:
#   version             - Version name (e.g., "develop", "v1.0.0")
#   ts_docs_dir         - Directory containing TypeScript HTML docs
#   py_docs_dir         - Directory containing Python mkdocs output
#   extra_docs_dir      - Directory containing additional docs (e.g., wiki markdown)
#   github_docs_subdir  - Target subdirectory name for extra docs (e.g., "wiki")
#   github_repo         - GitHub repository (e.g., "openhive-network/hive-doc")
#   github_token        - GitHub token with repo write access
#   project_subdir      - Subdirectory in hive-doc for this project (e.g., "wax")

SCRIPTPATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

VERSION="${1:?Missing version argument}"
TS_DOCS_DIR="${2:?Missing TypeScript docs directory}"
PY_DOCS_DIR="${3:?Missing Python docs directory}"
EXTRA_DOCS_DIR="${4:?Missing extra docs directory}"
GITHUB_DOCS_SUBDIR="${5:?Missing GitHub docs subdirectory}"
GITHUB_REPO="${6:?Missing GitHub repository}"
GITHUB_TOKEN="${7:?Missing GitHub token}"
PROJECT_SUBDIR="${8:?Missing project subdirectory}"
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

# Create project directory structure: wax/{version}/wiki/ with ts and python subdirs
WIKI_BASE="${PROJECT_SUBDIR}/${VERSION}/${GITHUB_DOCS_SUBDIR}"
mkdir -p "${WIKI_BASE}/ts"
mkdir -p "${WIKI_BASE}/python"

# Copy documentation - all under wiki/
echo "Copying wiki docs from ${EXTRA_DOCS_DIR} to ${WIKI_BASE}/"
cp -r "${EXTRA_DOCS_DIR}/." "${WIKI_BASE}/"

echo "Copying TypeScript docs from ${TS_DOCS_DIR} to ${WIKI_BASE}/ts/"
cp -r "${TS_DOCS_DIR}/." "${WIKI_BASE}/ts/"

echo "Copying Python docs from ${PY_DOCS_DIR} to ${WIKI_BASE}/python/"
cp -r "${PY_DOCS_DIR}/." "${WIKI_BASE}/python/"

# Update versions.json for this project
VERSIONS_FILE="${PROJECT_SUBDIR}/versions.json"
python3 << EOF
import json
import re
from pathlib import Path

versions_file = Path("${VERSIONS_FILE}")
version = "${VERSION}"

def semver_key(v):
    """Sort key: develop first, then semver descending."""
    if v == "develop":
        return (0, [])
    # Extract version numbers, strip leading 'v'
    match = re.match(r'v?(\d+)\.(\d+)\.(\d+)', v)
    if match:
        return (1, [-int(match.group(1)), -int(match.group(2)), -int(match.group(3))])
    return (2, [v])

if versions_file.exists():
    data = json.loads(versions_file.read_text())
else:
    data = {"versions": []}

if version not in data["versions"]:
    data["versions"].append(version)

data["versions"] = sorted(data["versions"], key=semver_key)
versions_file.write_text(json.dumps(data, indent=2))
EOF

echo "Updated versions.json:"
cat "${VERSIONS_FILE}"

# Copy project landing page from template
cp "${SCRIPTPATH}/doc-index-template.html" "${PROJECT_SUBDIR}/index.html"

# Add .nojekyll to prevent Jekyll processing
touch .nojekyll

# Commit and push
git config user.email "ci@syncad.com"
git config user.name "GitLab CI"

# Extract GitHub org/user from repo for URL
GITHUB_ORG="${GITHUB_REPO%%/*}"
BASE_URL="https://${GITHUB_ORG}.github.io/${GITHUB_REPO#*/}/${PROJECT_SUBDIR}"

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

echo "=== Documentation available at: ==="
echo "  Wiki: ${BASE_URL}/${VERSION}/${GITHUB_DOCS_SUBDIR}/"
echo "  TypeScript: ${BASE_URL}/${VERSION}/${GITHUB_DOCS_SUBDIR}/ts/"
echo "  Python: ${BASE_URL}/${VERSION}/${GITHUB_DOCS_SUBDIR}/python/"
