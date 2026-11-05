#!/bin/bash
#
# bump_hive_submodule.sh - Update hive submodule and sync hiveio-api version
#
# Usage:
#   ./bump_hive_submodule.sh <ref>                     # bump submodule + sync lock + commit
#   ./bump_hive_submodule.sh --skip-submodule-update    # sync lock to current submodule + commit
#
# Arguments:
#   ref                       Git ref to checkout in hive submodule (commit SHA, branch, tag)
#   --skip-submodule-update   Skip submodule checkout, sync hiveio-api to current submodule state
#
# Steps:
#   1. (unless --skip-submodule-update) Fetch and checkout <ref> in hive submodule
#   2. Determine the version of hiveio-api released by hive develop for the submodule commit
#   3. Check that the registry has that release - fail when it has only the merge-request-branch (.dev) build
#   4. Update pyproject.toml + poetry.lock of wax and test-tools with the new version
#   5. Commit changes

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
WAX_PROJECT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
WAX_ROOT_DIR="$(cd "${WAX_PROJECT_DIR}/../.." && pwd)"
HIVE_SUBMODULE_DIR="${WAX_ROOT_DIR}/hive"
TEST_TOOLS_PROJECT_DIR="${WAX_ROOT_DIR}/python/test_tools"
GENERATED_PACKAGE_DIR="${HIVE_SUBMODULE_DIR}/libraries/plugins/apis/api_generation/python_api_package"

REGISTRY_URL="${HIVE_PYPI_INDEX:-https://gitlab.syncad.com/api/v4/groups/136/-/packages/pypi/simple}"

log_info()    { echo -e "\e[1;34m$*\e[0m"; }
log_success() { echo -e "\e[1;32m$*\e[0m"; }
log_error()   { echo -e "\e[1;31m$*\e[0m" >&2; }

# --- Parse args ---

SKIP_SUBMODULE_UPDATE=false
REF=""

if [[ $# -eq 1 && "$1" == "--skip-submodule-update" ]]; then
    SKIP_SUBMODULE_UPDATE=true
elif [[ $# -eq 1 ]]; then
    REF="$1"
else
    echo "Usage: $(basename "$0") <ref>"
    echo "       $(basename "$0") --skip-submodule-update"
    exit 1
fi

if [[ ! -d "${HIVE_SUBMODULE_DIR}/.git" ]] && [[ ! -f "${HIVE_SUBMODULE_DIR}/.git" ]]; then
    log_error "Hive submodule not found. Run: git submodule update --init hive"
    exit 1
fi

# --- Step 1: Update hive submodule ---

if [[ "${SKIP_SUBMODULE_UPDATE}" == false ]]; then
    log_info "Fetching and checking out: ${REF}"
    git -C "${HIVE_SUBMODULE_DIR}" fetch origin
    git -C "${HIVE_SUBMODULE_DIR}" checkout "${REF}"
fi
# A checked out branch would override CI_COMMIT_REF_NAME, which chooses the kind of version below
git -C "${HIVE_SUBMODULE_DIR}" checkout -q --detach

HIVE_COMMIT=$(git -C "${HIVE_SUBMODULE_DIR}" rev-parse --short HEAD)
log_success "Hive submodule at: ${HIVE_COMMIT}"

# --- Step 2: Determine hiveio-api version ---

log_info "Determining hiveio-api version..."
if ! POETRY_OUTPUT=$(poetry -C "${GENERATED_PACKAGE_DIR}" install --dry-run 2>&1); then
    log_error "poetry install --dry-run failed:"
    echo "${POETRY_OUTPUT}" >&2
    exit 1
fi

# The version of a detached commit follows CI_COMMIT_REF_NAME: the pipeline of hive develop publishes the stable
# .post build of the commit, a pipeline of a merge request branch the .dev build of the same code. Only the .post
# build is admitted by the releases depending on hiveio-api (e.g. hiveio-beekeepy), whatever branch runs this script.
hiveio_api_version() {
    CI_COMMIT_REF_NAME="$1" poetry -C "${GENERATED_PACKAGE_DIR}" version -s
}
HIVEIO_API_VERSION=$(hiveio_api_version develop)
BRANCH_BUILD_VERSION=$(hiveio_api_version merge-request-branch)

if [[ "${HIVEIO_API_VERSION}" == "0.0.0" ]]; then
    log_error "poetry-dynamic-versioning returned 0.0.0 — plugin not active"
    exit 1
fi

if [[ "${HIVEIO_API_VERSION}" == *"+dirty"* ]]; then
    log_error "Submodule has uncommitted changes (version: ${HIVEIO_API_VERSION})"
    exit 1
fi

log_info "hiveio-api version: ${HIVEIO_API_VERSION}"

# --- Check if update is needed ---

CURRENT_PIN=$(grep -oP '^hiveio-api = \{version = "\K[^"]+' "${WAX_PROJECT_DIR}/pyproject.toml" 2>/dev/null || echo "")
if [[ "${CURRENT_PIN}" == "${HIVEIO_API_VERSION}" ]]; then
    log_success "hiveio-api already at ${HIVEIO_API_VERSION}, nothing to do"
    exit 0
fi

# --- Step 3: Check the release in the registry ---

DOWNLOAD_DIR=$(mktemp -d)
trap 'rm -rf "${DOWNLOAD_DIR}"' EXIT

is_published() {
    pip download "hiveio-api==$1" \
        --index-url "${REGISTRY_URL}" \
        --no-deps --only-binary=:all: \
        --dest "${DOWNLOAD_DIR}" \
        --trusted-host gitlab.syncad.com >/dev/null 2>&1
}

if is_published "${HIVEIO_API_VERSION}"; then
    log_success "hiveio-api ${HIVEIO_API_VERSION} is released by hive develop"
elif [[ "${BRANCH_BUILD_VERSION}" != "${HIVEIO_API_VERSION}" ]] && is_published "${BRANCH_BUILD_VERSION}"; then
    log_error "Only the merge request branch build hiveio-api ${BRANCH_BUILD_VERSION} is published for hive ${HIVE_COMMIT}," \
        "not the build of hive develop (${HIVEIO_API_VERSION}) - the .dev build is not admitted by the releases" \
        "depending on hiveio-api. Point the hive submodule at a commit of hive develop whose pipeline published hiveio-api."
    exit 1
else
    log_error "hiveio-api ${HIVEIO_API_VERSION} is not published in ${REGISTRY_URL} -" \
        "run the pipeline of hive develop for ${HIVE_COMMIT} first"
    exit 1
fi

# --- Step 4: Update pyproject.toml + lock ---

pin_hiveio_api() {  # $1: pyproject.toml, $2: sed expression replacing the version
    sed -i -E "$2" "$1"
    if ! grep -qF "${HIVEIO_API_VERSION}" <(grep '^hiveio-api = ' "$1"); then
        log_error "Failed to update the hiveio-api pin in $1 to ${HIVEIO_API_VERSION}:"
        grep "^hiveio-api" "$1" || echo "(not found)"
        exit 1
    fi
}

pin_hiveio_api "${WAX_PROJECT_DIR}/pyproject.toml" \
    "s|^(hiveio-api = \{version = \")[^\"]+|\1${HIVEIO_API_VERSION}|"
pin_hiveio_api "${TEST_TOOLS_PROJECT_DIR}/pyproject.toml" \
    "s|^(hiveio-api = \{version = \">=)[^,\"]+|\1${HIVEIO_API_VERSION}|"

PYTHON_KEYRING_BACKEND=keyring.backends.null.Keyring poetry -C "${WAX_PROJECT_DIR}" lock
PYTHON_KEYRING_BACKEND=keyring.backends.null.Keyring poetry -C "${TEST_TOOLS_PROJECT_DIR}" lock

# --- Step 5: Commit ---

cd "${WAX_ROOT_DIR}"

FILES_TO_ADD=(python/wax/pyproject.toml python/wax/poetry.lock python/test_tools/pyproject.toml python/test_tools/poetry.lock)
if [[ "${SKIP_SUBMODULE_UPDATE}" == false ]]; then
    FILES_TO_ADD+=(hive)
fi

git add "${FILES_TO_ADD[@]}"

if git diff --cached --quiet; then
    log_success "No changes to commit"
else
    git commit -m "Bump hive submodule to ${HIVE_COMMIT} (hiveio-api ${HIVEIO_API_VERSION})"
    log_success "Done: hive=${HIVE_COMMIT}, hiveio-api=${HIVEIO_API_VERSION}"
fi
