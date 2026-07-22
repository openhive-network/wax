#!/bin/bash
set -e

# Fetches the packaged hiveio-beekeeper crate (a `cargo package` tarball that
# ships the prelinked native bundle at lib/libbeekeeper_native.a, so no C++
# toolchain, Boost or beekeeper submodules are needed) from the beekeeper
# project's GitLab generic package registry and extracts it to
# crates/hiveio-beekeeper — the path wax's dev-dependency points at.
#
# Beekeeper is used by the wax test suite only; it is never part of the
# published wax crate. Cargo still resolves path dev-dependencies on every
# invocation (build/test/package/publish), so this script must run before any
# cargo command in rust/wax.
#
# By default the newest published package is resolved from the registry on
# every run; set BEEKEEPER_VERSION in the environment to pin a specific build,
# e.g. BEEKEEPER_VERSION=1.2.3-xyz ./fetch_beekeeper.sh
#
# Idempotent: exits immediately when the already-extracted crate matches the
# resolved version. When the registry is unreachable and a complete crate is
# already installed, that copy is kept (with a warning) so offline builds keep
# working.

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

BEEKEEPER_PROJECT_API_URL="${BEEKEEPER_PROJECT_API_URL:-https://gitlab.syncad.com/api/v4/projects/hive%2Fbeekeeper}"

CRATE_NAME="hiveio-beekeeper"
DEST_DIR="${SCRIPT_DIR}/crates/${CRATE_NAME}"

installed_version() {
  grep -m1 '^version' "${DEST_DIR}/Cargo.toml" 2>/dev/null \
    | sed -E 's/version = "(.*)"/\1/'
}

crate_installed() {
  [ -n "$(installed_version)" ] && [ -f "${DEST_DIR}/lib/libbeekeeper_native.a" ]
}

# Resolves the newest published package version from the registry. Versions
# embed a build timestamp, so created_at order and version order agree.
latest_version() {
  curl --fail --silent --show-error --location \
    "${BEEKEEPER_PROJECT_API_URL}/packages?package_name=${CRATE_NAME}&package_type=generic&order_by=created_at&sort=desc&per_page=1" \
    | grep -o '"version":"[^"]*"' | head -1 | cut -d'"' -f4
}

if [ -z "${BEEKEEPER_VERSION:-}" ]; then
  if ! BEEKEEPER_VERSION="$(latest_version)" || [ -z "${BEEKEEPER_VERSION}" ]; then
    if crate_installed; then
      echo "warning: could not query ${BEEKEEPER_PROJECT_API_URL} for the latest ${CRATE_NAME}; keeping installed $(installed_version)" >&2
      exit 0
    fi
    echo "Failed to resolve the latest ${CRATE_NAME} version from ${BEEKEEPER_PROJECT_API_URL}" >&2
    echo "Set BEEKEEPER_VERSION explicitly to skip the registry query." >&2
    exit 1
  fi
  echo "Latest published ${CRATE_NAME} version: ${BEEKEEPER_VERSION}"
fi

CRATE_FILE="${CRATE_NAME}-${BEEKEEPER_VERSION}.crate"
CRATE_URL="${BEEKEEPER_PROJECT_API_URL}/packages/generic/${CRATE_NAME}/${BEEKEEPER_VERSION}/${CRATE_FILE}"

# The bundle check guards against a previously interrupted install: a version
# match alone would skip re-extraction forever while beekeeper's build.rs
# keeps failing on the missing prebuilt bundle.
if [ "$(installed_version)" = "${BEEKEEPER_VERSION}" ] \
  && [ -f "${DEST_DIR}/lib/libbeekeeper_native.a" ]; then
  echo "${CRATE_NAME} ${BEEKEEPER_VERSION} already present at ${DEST_DIR}"
  exit 0
fi

# The registry is public, so no token is sent: a JOB-TOKEN from a project
# missing on beekeeper's job-token allowlist would turn a request that
# succeeds anonymously into a 404.
WORK_DIR=$(mktemp -d)
STAGING="${DEST_DIR}.tmp-$$"
trap 'rm -rf "${WORK_DIR}" "${STAGING}"' EXIT

echo "Downloading ${CRATE_URL}..."
curl --fail --silent --show-error --location \
  --output "${WORK_DIR}/${CRATE_FILE}" "${CRATE_URL}"

# A .crate is a gzipped tarball with a single <name>-<version>/ top directory.
tar -xzf "${WORK_DIR}/${CRATE_FILE}" -C "${WORK_DIR}"
EXTRACTED="${WORK_DIR}/${CRATE_NAME}-${BEEKEEPER_VERSION}"
if [ ! -f "${EXTRACTED}/Cargo.toml" ] || [ ! -f "${EXTRACTED}/lib/libbeekeeper_native.a" ]; then
  echo "Unexpected ${CRATE_FILE} layout: missing Cargo.toml or lib/libbeekeeper_native.a" >&2
  exit 1
fi

if [ -e "${DEST_DIR}/.git" ]; then
  echo "${DEST_DIR} looks like a git checkout (stale beekeeper submodule?); refusing to overwrite." >&2
  echo "Remove it manually and re-run this script." >&2
  exit 1
fi

# Stage next to the destination, then rename: a plain mv from the (often
# tmpfs) work dir degrades to copy+delete across filesystems, which an
# interruption can leave half-done.
mkdir -p "$(dirname "${DEST_DIR}")"
rm -rf "${STAGING}"
cp -a "${EXTRACTED}" "${STAGING}"
rm -rf "${DEST_DIR}"
mv "${STAGING}" "${DEST_DIR}"

echo "Installed ${CRATE_NAME} ${BEEKEEPER_VERSION} at ${DEST_DIR}"
