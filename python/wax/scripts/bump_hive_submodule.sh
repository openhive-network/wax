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
#   2. Determine hiveio-api version from the submodule's git state
#   3. Download hiveio-api from registry (or build locally if not available)
#   4. Update pyproject.toml + poetry.lock with the new version
#   5. Commit changes

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
WAX_PROJECT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
WAX_ROOT_DIR="$(cd "${WAX_PROJECT_DIR}/../.." && pwd)"
HIVE_SUBMODULE_DIR="${WAX_ROOT_DIR}/hive"
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

HIVE_COMMIT=$(git -C "${HIVE_SUBMODULE_DIR}" rev-parse --short HEAD)
log_success "Hive submodule at: ${HIVE_COMMIT}"

# --- Step 2: Determine hiveio-api version ---

log_info "Determining hiveio-api version..."
if ! POETRY_OUTPUT=$(poetry -C "${GENERATED_PACKAGE_DIR}" install --dry-run 2>&1); then
    log_error "poetry install --dry-run failed:"
    echo "${POETRY_OUTPUT}" >&2
    exit 1
fi
HIVEIO_API_VERSION=$(poetry -C "${GENERATED_PACKAGE_DIR}" version -s)

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

CURRENT_PIN=$(grep -oP 'hiveio-api = "==\K[^"]+' "${WAX_PROJECT_DIR}/pyproject.toml" 2>/dev/null || echo "")
if [[ "${CURRENT_PIN}" == "${HIVEIO_API_VERSION}" ]]; then
    log_success "hiveio-api already at ${HIVEIO_API_VERSION}, nothing to do"
    exit 0
fi

# --- Step 3: Get wheel (registry first, build as fallback) ---

WHEEL_DIR="${GENERATED_PACKAGE_DIR}/dist"
mkdir -p "${WHEEL_DIR}"

if pip download "hiveio-api==${HIVEIO_API_VERSION}" \
    --index-url "${REGISTRY_URL}" \
    --no-deps --only-binary=:all: \
    --dest "${WHEEL_DIR}" \
    --trusted-host gitlab.syncad.com 2>/dev/null; then
    log_success "Downloaded from registry"
else
    log_info "Not in registry, building locally..."
    rm -rf "${WHEEL_DIR}"

    "${HIVE_SUBMODULE_DIR}/scripts/ci-helpers/hiveio_api_package.sh" \
        --hive-project-root="${HIVE_SUBMODULE_DIR}" \
        --apis="database_api network_broadcast_api rc_api" \
        --flatten-openapi \
        --skip-deploy --skip-tests --skip-registry-check
fi

# --- Step 4: Update pyproject.toml + lock ---

cd "${WAX_PROJECT_DIR}"

WHEEL_FILE=$(ls "${WHEEL_DIR}/"*.whl 2>/dev/null | head -1)

if [[ -z "${WHEEL_FILE}" ]]; then
    log_error "No wheel found in ${WHEEL_DIR}"
    exit 1
fi

# Use poetry add with the wheel — updates both pyproject.toml and poetry.lock atomically
# This works even if the version is not yet in registry (uses local wheel)
PYTHON_KEYRING_BACKEND=keyring.backends.null.Keyring \
    poetry add "${WHEEL_FILE}"

# poetry add changes constraint format; restore exact pin style
sed -i "s|^hiveio-api = .*|hiveio-api = \"==${HIVEIO_API_VERSION}\"  # pinned: must match the version built from the hived submodule|" \
    pyproject.toml

# Verify sed actually replaced the line
if ! grep -q "hiveio-api = \"==${HIVEIO_API_VERSION}\"" pyproject.toml; then
    log_error "Failed to update hiveio-api pin in pyproject.toml"
    log_error "Expected: hiveio-api = \"==${HIVEIO_API_VERSION}\""
    log_error "Current content:"
    grep "hiveio-api" pyproject.toml || echo "(not found)"
    exit 1
fi

# Re-lock to match restored constraint (wheel is already in cache from poetry add)
PYTHON_KEYRING_BACKEND=keyring.backends.null.Keyring poetry lock

# --- Step 5: Commit ---

cd "${WAX_ROOT_DIR}"

FILES_TO_ADD=(python/wax/pyproject.toml python/wax/poetry.lock)
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
