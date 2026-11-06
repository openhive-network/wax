#!/usr/bin/env bash
# AIDEV's Python suite: CI's build_wheel and its Python test jobs (test_wax_protobuf_python,
# test_helpy, test_tools_unit_tests, test_tools_hived_handle, test_wax_protobuf_python_pattern,
# test_wax_protobuf_python_examples) on Python 3.12 with --network none, in the
# test runtime image (.aidev/runtime/Dockerfile), which carries static Boost, the
# dependencies, build requirements, pytest and pnpm store those would download.
#
#   .aidev/run-python.sh <suite>
#
# Writes test-results/aidev-<suite>/python-junit.xml: a `build` case, the protobuf pattern
# and visitor example cases, one case per test of each pytest group (its own junit), and the
# tests in NO_RECORDING_TESTS as skipped. Tracked files the build rewrites (the regenerated
# protos, ...) are put back as they were before the run and new untracked files are removed.
# See .aidev/README.md.
set -uo pipefail
cd "$(dirname "$0")/.."
root="$PWD"

suite="${1:?usage: $0 <suite>}"

BAKED="${WAX_AIDEV:-/opt/wax-aidev}"
PROTO_DIR=hive/libraries/protocol/proto

# Tests that fail only because the API replay server has no recording for a request
# they make (HTTP 501), as repository-relative pytest node ids, one per line with the
# reason beside it. They are passed to their group as --deselect and reported as
# skipped; an entry that no longer names a test fails the run.
NO_RECORDING_TESTS=(
)

out="$root/test-results/aidev-$suite"
junit="$out/python-junit.xml"
logs="$out/python"
mkdir -p "$out"
rm -rf "$junit" "$logs"; mkdir -p "$logs"
cases="$logs/cases.tsv"; : > "$cases"

source .aidev/junit-helpers.sh

# The suite may run as a uid with no passwd entry, and git refuses a bind-mounted
# checkout owned by another uid.
export GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0=safe.directory GIT_CONFIG_VALUE_0='*'

# Put the checkout back on exit: the content of every tracked file under python/ and
# examples/python/ (uncommitted edits included), tracked files that were deleted stay
# deleted, and untracked files the run created are removed (ignored ones, like the
# build directories, stay for the next build).
backup="$(mktemp -d)"
git ls-files -z --deleted > "$backup/deleted" &&
    git ls-files -z --others --exclude-standard > "$backup/untracked" &&
    git ls-files -z -- python examples/python \
        | grep -zvxF -f <(tr '\0' '\n' < "$backup/deleted") \
        | tar --null -T - -cf "$backup/tracked.tar" 2> "$logs/snapshot.log" || {
    cat "$logs/snapshot.log" >&2
    printf 'case\tcheckout snapshot\tfail\t0\tcannot snapshot the tracked files with git, so the build would not be undone\t%s\n' \
        "$logs/snapshot.log" >> "$cases"
    junit_write_cases "$junit" python "$cases"
    rm -rf "$backup"
    exit 1
}
restore() {
    tar -xf "$backup/tracked.tar"
    xargs -0 -r rm -f < "$backup/deleted"
    git ls-files -z --others --exclude-standard \
        | grep -zvxF -f <(tr '\0' '\n' < "$backup/untracked") \
        | grep -zv '^test-results/' \
        | xargs -0 -r rm -f
    rm -rf "$backup"
}
trap restore EXIT

[ -w "${HOME:-/}" ] || export HOME="$backup"
# Everything is installed in the image's venvs; pip and pnpm must not look for more.
export PIP_NO_INDEX=1 PIP_DISABLE_PIP_VERSION_CHECK=1 npm_config_offline=true \
    PYTHON_KEYRING_BACKEND=keyring.backends.null.Keyring
# hive's fc reaches Boost headers through the default include path, where CI's
# ci-base-image has them; the image's static Boost (WAX_BOOST_ROOT) is put there for
# this suite only, as the wasm build of the ts suite must find emscripten's Boost.
export CPLUS_INCLUDE_PATH="${WAX_BOOST_ROOT:?the test image sets WAX_BOOST_ROOT}/include${CPLUS_INCLUDE_PATH:+:$CPLUS_INCLUDE_PATH}"
# poetry-dynamic-versioning reads git tags, which a checkout may not have.
export POETRY_DYNAMIC_VERSIONING_BYPASS=0.0.0+aidev
# The wheel's C++ (python/wax/CMakeLists.txt) compiles through sccache when its
# Redis answers, else uncached.
# shellcheck source=compiler-cache.sh
source .aidev/compiler-cache.sh >&2

# Runs CMD with the image's venv NAME (wax or test-tools) active.
in_venv() {
    local venv="$BAKED/venv-$1"; shift
    (source "$venv/bin/activate" && "$@")
}

# build_wax.sh 1 without its network calls: the protos as compile_proto.sh generates them
# (without its `poetry lock` and `poetry install`), and the wheel the way it builds it,
# with the dependencies and build requirements the image installed. The wheel goes into
# both venvs, with wax-local-tools and test-tools from the checkout.
# It runs as a step's condition, where `set -e` has no effect: every command is checked.
build_wheel() {
    cd python/wax || return 1
    # The C++ build directory stays between runs, and its CMake cache keeps the checkout
    # path, the Python and the compiler launcher (sccache or none, CMake reads it only
    # when it creates the build directory) it was configured with; a rebuilt image can
    # carry another Python, a checkout can be mounted elsewhere, and the cache can be
    # unreachable. It is reused only for the same, and setuptools' build/ (the extension
    # modules the wheel packs) goes with it.
    local stamp=.build/aidev-configured-for configured_for
    configured_for="$PWD $(python3 -c 'import sysconfig; print(sysconfig.get_config_var("INCLUDEPY"))') launcher=${CMAKE_CXX_COMPILER_LAUNCHER:-none}" || return 1
    if [ -d .build ] && [ "$(cat "$stamp" 2>/dev/null)" != "$configured_for" ]; then
        echo "python/wax/.build was not configured for $configured_for; configuring it again" >&2
        rm -rf .build build || return 1
    fi
    rm -rf setup.py dist wax/_private/proto && mkdir -p wax/_private/proto || return 1
    local protos=()
    for p in "$root/$PROTO_DIR"/*.proto; do
        [ "$p" = "$root/$PROTO_DIR/block.proto" ] || protos+=("$p")
    done
    python3 -m grpc_tools.protoc \
        --python_out=wax/_private/proto --mypy_out=wax/_private/proto \
        --mypy_grpc_out=wax/_private/proto --grpc_python_out=wax/_private/proto \
        --proto_path="$root/$PROTO_DIR" -I="$root/$PROTO_DIR" "${protos[@]}" || return 1
    printf '%s\n' "import sys" "from pathlib import Path" "" \
        "sys.path.append(str(Path(__file__).parent.absolute()))" > wax/_private/proto/__init__.py || return 1
    local rc=0
    python3 -m pip wheel --no-deps --no-build-isolation -w dist . || rc=$?
    compiler_cache_stats
    [ "$rc" -eq 0 ] || return "$rc"
    printf '%s\n' "$configured_for" > "$stamp" || return 1
    local wheel=(dist/*.whl)
    [ -f "${wheel[0]}" ] || { echo "pip wheel left no wheel in python/wax/dist" >&2; return 1; }
    "$BAKED/venv-wax/bin/python3" -m pip install --no-deps --force-reinstall "${wheel[@]}" &&
        "$BAKED/venv-test-tools/bin/python3" -m pip install --no-deps --force-reinstall "${wheel[@]}" &&
        "$BAKED/venv-wax/bin/python3" -m pip install --no-deps --no-build-isolation -e tests/wax-local-tools &&
        "$BAKED/venv-test-tools/bin/python3" -m pip install --no-deps --no-build-isolation -e ../test_tools
}

# Pytest groups: name, venv, the directory of its tests (its node ids are relative to
# the rootdir, python/wax or python/test_tools). A group's command is the CI job's.
PYTEST_GROUPS=(
    "wax wax python/wax/tests"
    "helpy wax python/wax/tests/helpy_test"
    "test-tools-unit test-tools python/test_tools/tests/unit_tests"
    "test-tools-hived-handle test-tools python/test_tools/tests/hived_handle_tests"
)
group_command() {
    local j="$2"
    case "$1" in
        wax) echo bash python/wax/tests/run_tests.sh "--junitxml=$j" ;;
        helpy) echo cd python/wax/tests/helpy_test "&&" python3 -m pytest -n auto --durations 0 "--junitxml=$j" ;;
        test-tools-unit) echo python3 -m pytest -n auto -m "'not requires_hived_executables'" \
            python/test_tools/tests/unit_tests "--junitxml=$j" ;;
        test-tools-hived-handle) echo bash python/test_tools/tests/hived_handle_tests/run_tests.sh "--junitxml=$j" ;;
    esac
}

# The group of a NO_RECORDING_TESTS entry: the one whose test directory is the longest
# prefix of it.
group_of() {
    local best="" best_len=0 name venv dir
    for g in "${PYTEST_GROUPS[@]}"; do
        read -r name venv dir <<< "$g"
        if [[ "$1" == "$dir/"* ]] && [ "${#dir}" -gt "$best_len" ]; then best="$name"; best_len=${#dir}; fi
    done
    echo "$best"
}

steps_skipped_after_build() {
    local name venv dir steps=("protobuf pattern" "ts dependencies")
    for g in "${PYTEST_GROUPS[@]}"; do
        read -r name venv dir <<< "$g"
        steps+=("$name tests")
    done
    for s in "${steps[@]}" "visitor example"; do
        printf 'case\t%s\tskip\t0\tthe build failed\n' "$s" >> "$cases"
    done
}

# Runs step NAME (CMD in venv VENV), logging to LOG, as a case.
step_case() {
    local name="$1" venv="$2" log="$3"; shift 3
    local t0=$SECONDS
    if in_venv "$venv" "$@" > "$log" 2>&1 < /dev/null; then
        printf 'case\t%s\tpass\t%s\t\n' "$name" "$((SECONDS - t0))" >> "$cases"
    else
        tail -40 "$log" >&2
        printf 'case\t%s\tfail\t%s\t%s failed\t%s\n' "$name" "$((SECONDS - t0))" "$name" "$log" >> "$cases"
        return 1
    fi
}

python_tests() {
    local rc=0 name venv dir entry group
    if ! step_case build wax "$logs/build.log" build_wheel; then
        steps_skipped_after_build
        junit_write_cases "$logs/steps-junit.xml" python "$cases"
        cp "$logs/steps-junit.xml" "$junit"
        return 1
    fi

    step_case "protobuf pattern" wax "$logs/protobuf-pattern.log" \
        diff --brief --recursive --color=never --no-ignore-file-name-case --no-dereference \
        python/wax/protobuf_patterns/ python/wax/wax/_private/proto/ || rc=1

    # A renamed or removed test would otherwise leave an entry that deselects nothing.
    declare -A deselect=()
    local i=0 rootdir
    for entry in "${NO_RECORDING_TESTS[@]}"; do
        group="$(group_of "$entry")"
        venv=wax rootdir=python/wax
        [[ "$group" == test-tools-* ]] && venv=test-tools rootdir=python/test_tools
        i=$((i + 1))
        if [ -n "$group" ] && in_venv "$venv" python3 -m pytest --collect-only -q "$entry" \
                > "$logs/no-recording-$i.log" 2>&1 < /dev/null; then
            deselect[$group]+=" --deselect=${entry#"$rootdir"/}"
            printf 'case\t%s\tskip\t0\tno recorded API response (NO_RECORDING_TESTS)\n' "$entry" >> "$cases"
        else
            rc=1
            printf 'case\t%s\tfail\t0\tNO_RECORDING_TESTS names no test; update .aidev/run-python.sh\t%s\n' \
                "$entry" "$logs/no-recording-$i.log" >> "$cases"
        fi
    done

    # proxy-mock-server.sh runs `pnpm install --frozen-lockfile` in ts/; have node_modules
    # current first, from the image's store, as the TS suite does.
    step_case "ts dependencies" wax "$logs/ts-dependencies.log" \
        bash -c 'cd ts && source ../.aidev/pnpm-deps.sh' || rc=1

    local merged=() status
    for g in "${PYTEST_GROUPS[@]}"; do
        read -r name venv dir <<< "$g"
        local j="$logs/$name-junit.xml" log="$logs/$name.log"
        status=0
        in_venv "$venv" bash -c "$(group_command "$name" "$j") ${deselect[$name]:-}" > "$log" 2>&1 < /dev/null || status=$?
        tail -3 "$log" >&2
        if [ "$status" -ne 0 ]; then
            rc=1
            junit_add_unreported_failure "$j" "$name" "$name tests" "$log" "$status"
        fi
        merged+=("$name=$j")
    done
    for f in python/wax/mock-server.log python/test_tools/mock-server.log; do
        [ -f "$f" ] && mv "$f" "$logs/$(basename "$(dirname "$f")")-mock-server.log"
    done

    step_case "visitor example" wax "$logs/visitor-example.log" bash examples/python/run_example.sh || rc=1

    junit_write_cases "$logs/steps-junit.xml" python "$cases"
    junit_merge "$junit" "python=$logs/steps-junit.xml" "${merged[@]}"
    return "$rc"
}

run_with_junit_fallback "$junit" python python_tests
