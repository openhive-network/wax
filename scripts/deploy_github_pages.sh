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

# Create project directory structure: project/{version}/{subdir}/ with ts and python subdirs
DOCS_BASE="${PROJECT_SUBDIR}/${VERSION}/${GITHUB_DOCS_SUBDIR}"
mkdir -p "${DOCS_BASE}/ts"
mkdir -p "${DOCS_BASE}/python"

# Copy documentation - all under subdir/
echo "Copying extra docs from ${EXTRA_DOCS_DIR} to ${DOCS_BASE}/"
cp -r "${EXTRA_DOCS_DIR}/." "${DOCS_BASE}/"

echo "Copying TypeScript docs from ${TS_DOCS_DIR} to ${DOCS_BASE}/ts/"
cp -r "${TS_DOCS_DIR}/." "${DOCS_BASE}/ts/"

echo "Copying Python docs from ${PY_DOCS_DIR} to ${DOCS_BASE}/python/"
cp -r "${PY_DOCS_DIR}/." "${DOCS_BASE}/python/"

# Clean up any unexpected directories in version folder (only keep manual and wiki)
VERSION_PATH="${PROJECT_SUBDIR}/${VERSION}"
for d in "${VERSION_PATH}"/*/; do
  if [ -d "$d" ]; then
    dir_name=$(basename "$d")
    if [ "$dir_name" != "manual" ] && [ "$dir_name" != "wiki" ]; then
      echo "Removing unexpected directory: ${d}"
      rm -rf "$d"
    fi
  fi
done

# Generate directory listing index pages
generate_index_page() {
  local dir="$1"
  local title="$2"
  shift 2
  local subdirs=("$@")

  cat > "${dir}/index.html" << 'HEADER'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>__TITLE__</title>
  <style>
    :root {
      --bg-color: #0d1117;
      --card-bg: #161b22;
      --text-color: #c9d1d9;
      --text-muted: #8b949e;
      --accent-color: #58a6ff;
      --border-color: #30363d;
    }
    @media (prefers-color-scheme: light) {
      :root {
        --bg-color: #ffffff;
        --card-bg: #f6f8fa;
        --text-color: #24292f;
        --text-muted: #57606a;
        --accent-color: #0969da;
        --border-color: #d0d7de;
      }
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
      background: var(--bg-color);
      color: var(--text-color);
      line-height: 1.6;
      min-height: 100vh;
    }
    .container { max-width: 700px; margin: 0 auto; padding: 2rem; }
    header {
      text-align: center;
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid var(--border-color);
    }
    h1 { font-size: 1.8rem; margin-bottom: 0.5rem; }
    .subtitle { color: var(--text-muted); font-size: 1rem; }
    .dir-list { display: flex; flex-direction: column; gap: 0.75rem; }
    .dir-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 1.25rem;
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      text-decoration: none;
      color: var(--text-color);
      transition: border-color 0.2s, background 0.2s;
    }
    .dir-item:hover {
      border-color: var(--accent-color);
      background: var(--bg-color);
    }
    .dir-icon {
      width: 20px;
      height: 20px;
      color: var(--accent-color);
    }
    .dir-name { font-weight: 500; }
    .breadcrumb {
      margin-bottom: 1.5rem;
      color: var(--text-muted);
      font-size: 0.9rem;
    }
    .breadcrumb a { color: var(--accent-color); text-decoration: none; }
    .breadcrumb a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>__TITLE__</h1>
      <p class="subtitle">Select a subdirectory</p>
    </header>
    <main>
      <div class="dir-list">
HEADER

  # Replace title placeholder
  sed -i "s/__TITLE__/${title}/g" "${dir}/index.html"

  # Add directory links
  local folder_icon='<svg class="dir-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>'

  for subdir in "${subdirs[@]}"; do
    cat >> "${dir}/index.html" << ITEM
        <a href="${subdir}/" class="dir-item">
          ${folder_icon}
          <span class="dir-name">${subdir}/</span>
        </a>
ITEM
  done

  cat >> "${dir}/index.html" << 'FOOTER'
      </div>
    </main>
  </div>
</body>
</html>
FOOTER
}

# Generate index.html for version directory (lists all existing subdirs)
echo "Generating index page for ${PROJECT_SUBDIR}/${VERSION}/"
# Find all subdirectories in the version directory
VERSION_DIR="${PROJECT_SUBDIR}/${VERSION}"
EXISTING_SUBDIRS=()
for d in "${VERSION_DIR}"/*/; do
  if [ -d "$d" ]; then
    subdir_name=$(basename "$d")
    EXISTING_SUBDIRS+=("$subdir_name")
  fi
done
echo "Found subdirectories: ${EXISTING_SUBDIRS[*]}"
generate_index_page "${VERSION_DIR}" "${PROJECT_SUBDIR} ${VERSION}" "${EXISTING_SUBDIRS[@]}"

# Generate index.html for docs subdir (lists ts and python)
echo "Generating index page for ${DOCS_BASE}/"
generate_index_page "${DOCS_BASE}" "${PROJECT_SUBDIR} ${VERSION} - ${GITHUB_DOCS_SUBDIR}" "ts" "python"

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
echo "  Version list: ${BASE_URL}/"
echo "  Version page: ${BASE_URL}/${VERSION}/"
echo "  ${GITHUB_DOCS_SUBDIR^}: ${BASE_URL}/${VERSION}/${GITHUB_DOCS_SUBDIR}/"
echo "  TypeScript: ${BASE_URL}/${VERSION}/${GITHUB_DOCS_SUBDIR}/ts/"
echo "  Python: ${BASE_URL}/${VERSION}/${GITHUB_DOCS_SUBDIR}/python/"
