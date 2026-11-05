#!/usr/bin/env bash
# The `select` of the rust and python suites in .aidev/project.yaml: whether the
# change can affect what the suite builds and tests. AIDEV runs it on the host,
# in the checkout, before the suite starts.
#
#   .aidev/select-suite.sh rust|python
#
# Exits 0 (run the suite) when a changed path is one the suite reads, or when the
# change cannot be enumerated; exits 77 (skip it) when no changed path is, and
# says why on its last line. The changed paths are AIDEV_CHANGED_FILES_FILE when
# it can be read here, else what `git diff` and `git ls-files --others` report
# against AIDEV_BASE_REF (or AIDEV_IMPLEMENT_BASE_SHA). A run with neither, such
# as a canary, runs the suite. See "Which changes run the rust and python suites" in
# .aidev/README.md.
set -uo pipefail
cd "$(dirname "$0")/.."

suite="${1:?usage: $0 rust|python}"

# Path prefixes (a trailing slash) and exact paths each suite reads. Both read
# the image and its declaration, the C++ of core/ and the hive submodule (its
# protocol library, fc and the .proto sources they generate code from).
COMMON_PATHS=(
    .aidev/project.yaml
    .aidev/runtime/
    .aidev/select-suite.sh
    .aidev/junit-helpers.sh
    .gitmodules
    hive
    hive/
    core/
)
RUST_PATHS=(
    rust/
    .aidev/run-rust.sh
)
# python/wax/tests/run_tests.sh and the test-tools hived-handle tests start the
# API replay server of ts/wasm/__tests__/assets after a `pnpm install` of the ts
# workspace, so they read its manifests and lock file too.
PYTHON_PATHS=(
    python/
    examples/python/
    .aidev/run-python.sh
    .aidev/pnpm-deps.sh
    ts/wasm/__tests__/assets/
    ts/package.json
    ts/pnpm-lock.yaml
    ts/pnpm-workspace.yaml
    ts/.npmrc
    ts/tsconfig.json
    ts/npm-common-config
    ts/npm-common-config/
)

case "$suite" in
    rust) paths=("${COMMON_PATHS[@]}" "${RUST_PATHS[@]}") ;;
    python) paths=("${COMMON_PATHS[@]}" "${PYTHON_PATHS[@]}") ;;
    *) echo "unknown suite $suite; expected rust or python" >&2; exit 2 ;;
esac

changed_files() {
    if [ -n "${AIDEV_CHANGED_FILES_FILE:-}" ] && [ -r "$AIDEV_CHANGED_FILES_FILE" ]; then
        sed 's/^D\t//' "$AIDEV_CHANGED_FILES_FILE"
        return
    fi
    local base="${AIDEV_BASE_REF:-${AIDEV_IMPLEMENT_BASE_SHA:-}}"
    [ -n "$base" ] || return 1
    # Against the working tree, so a run by hand sees uncommitted edits too.
    git diff --no-renames --name-only "$base" && git ls-files --others --exclude-standard
}

reads() {
    local file="$1" p
    # A workspace member's manifest is part of the ts install the python suite runs.
    [ "$suite" = python ] && [[ "$file" == ts/*package.json ]] && return 0
    for p in "${paths[@]}"; do
        if [[ "$p" == */ ]]; then
            [[ "$file" == "$p"* ]] && return 0
        else
            [ "$file" = "$p" ] && return 0
        fi
    done
    return 1
}

if ! files="$(changed_files)"; then
    echo "no changed-file list or base revision; running the $suite suite"
    exit 0
fi
while IFS= read -r file; do
    [ -n "$file" ] || continue
    if reads "$file"; then
        echo "$file is read by the $suite suite; running it"
        exit 0
    fi
done <<< "$files"
echo "not affected: no changed path is read by the $suite suite (.aidev/select-suite.sh)"
exit 77
