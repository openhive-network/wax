#!/usr/bin/env bash
# AIDEV's Python suites: CI's build_wheel and its Python test jobs (test_wax_protobuf_python,
# test_helpy, test_tools_unit_tests, test_tools_hived_handle, test_wax_protobuf_python_pattern,
# test_wax_protobuf_python_examples) on one of CI's Python versions and, with --pre-commit,
# its pre_commit_checks, with --network none, in the test runtime image
# (.aidev/runtime/Dockerfile), which carries static Boost, the dependencies, build
# requirements, pytest, pre-commit hook environments and pnpm store those would download.
#
#   .aidev/run-python.sh <suite> [--python 3.12|3.14] [--pre-commit]
#
# Writes test-results/aidev-<suite>/python-junit.xml: a `build` case, the protobuf pattern
# and visitor example cases, one case per test of each pytest group (its own junit), the
# tests in NO_RECORDING_TESTS as skipped and, with --pre-commit, one case per hook. On 3.12
# (the default) the names are as they always were; on another version every case and
# testsuite carries it (`build (3.14)`, `test_reblog (3.14)`, `wax-3.14`). Tracked files the build or a hook
# rewrites (the regenerated protos, ...) are put back as they were before the run and new
# untracked files are removed. See .aidev/README.md.
set -uo pipefail
cd "$(dirname "$0")/.."
root="$PWD"

usage() { echo "usage: $0 <suite> [--python 3.12|3.14] [--pre-commit]" >&2; exit 2; }
suite="${1:-}"
[ -n "$suite" ] && [[ "$suite" != -* ]] || usage
shift
python_version=3.12 pre_commit=0
while [ $# -gt 0 ]; do
    case "$1" in
        --python) [ $# -ge 2 ] || usage; python_version="$2"; shift 2 ;;
        --pre-commit) pre_commit=1; shift ;;
        *) usage ;;
    esac
done
case "$python_version" in 3.12|3.14) ;; *) usage ;; esac
if [ "$pre_commit" = 1 ] && [ "$python_version" != 3.14 ]; then
    echo "--pre-commit needs --python 3.14: CI's pre_commit_checks runs on Python 3.14" >&2
    exit 2
fi
# 3.12's case and testsuite names and its venvs' predate the other versions and stay
# as they are.
case_tag="" suite_tag="" venv_tag=""
if [ "$python_version" != 3.12 ]; then
    case_tag=" ($python_version)" suite_tag="-$python_version" venv_tag="-$python_version"
fi
steps_suite="python$suite_tag"

BAKED="${WAX_AIDEV:-/opt/wax-aidev}"
PRE_COMMIT_CONFIG=python/.pre-commit-config.yaml
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
    printf 'case\tcheckout snapshot%s\tfail\t0\tcannot snapshot the tracked files with git, so the build would not be undone\t%s\n' \
        "$case_tag" "$logs/snapshot.log" >> "$cases"
    junit_write_cases "$junit" "$steps_suite" "$cases"
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
# What CI sets for its Python 3.14 jobs.
[ "$python_version" = 3.12 ] || export PYO3_USE_ABI3_FORWARD_COMPATIBILITY=1
# The wheel's C++ (python/wax/CMakeLists.txt) compiles through sccache when a
# compiler cache answers near enough, else uncached.
# shellcheck source=compiler-cache.sh
source .aidev/compiler-cache.sh "$out/sccache.tsv" >&2

# Runs CMD with the image's venv NAME (wax, test-tools or pre-commit) for this Python
# version active.
in_venv() {
    local venv="$BAKED/venv-$1$venv_tag"; shift
    (source "$venv/bin/activate" && "$@")
}

# The C++, Cython and setuptools build trees in python/wax are built for one Python
# version. The other version's trees wait in python/wax/.cache/aidev-build/<version>
# (ignored by git, as the trees are) while this one builds, so each version's build stays
# incremental when both suites run in one checkout. The configure stamp (below) is kept
# per version with its trees. Trees with no record of their version are removed. Runs in
# python/wax.
BUILD_TREES=(.build build .cython_build cpp_python_bridge.cpp)
VERSION_STAMP=.build/aidev-python-version CONFIGURED_STAMP=.build/aidev-configured-for
use_build_trees() {
    local parked=.cache/aidev-build built="" t
    if [ -f "$VERSION_STAMP" ]; then
        built="$(cat "$VERSION_STAMP")"
    elif [ -f "$CONFIGURED_STAMP" ]; then
        # Trees built before they recorded their version: their Python's include
        # directory (include/python3.X) names it.
        built="$(grep -o 'include/python3\.[0-9]*' "$CONFIGURED_STAMP" | sed 's|^include/python||')"
    fi
    [ "$built" = "$python_version" ] && return 0
    if [ -n "$built" ]; then
        rm -rf "${parked:?}/$built" && mkdir -p "$parked/$built" || return 1
        for t in "${BUILD_TREES[@]}"; do
            [ ! -e "$t" ] || mv "$t" "$parked/$built/" || return 1
        done
    else
        rm -rf "${BUILD_TREES[@]}" || return 1
    fi
    if [ -d "$parked/$python_version" ]; then
        for t in "${BUILD_TREES[@]}"; do
            [ ! -e "$parked/$python_version/$t" ] || mv "$parked/$python_version/$t" . || return 1
        done
        rm -rf "${parked:?}/$python_version"
    fi
}

# build_wax.sh 1 without its network calls: the protos as compile_proto.sh generates them
# (without its `poetry lock` and `poetry install`), and the wheel the way it builds it,
# with the dependencies and build requirements the image installed. The wheel goes into
# both venvs, with wax-local-tools and test-tools from the checkout. The package's *.so
# are the last build's, maybe of the other version, and the wheel would include them.
# It runs as a step's condition, where `set -e` has no effect: every command is checked.
build_wheel() {
    cd python/wax || return 1
    use_build_trees || return 1
    # The C++ build directory stays between runs, and its CMake cache keeps the checkout
    # path, the Python and the compiler launcher (sccache or none, CMake reads it only
    # when it creates the build directory) it was configured with; a rebuilt image can
    # carry another Python, a checkout can be mounted elsewhere, and the cache can be
    # unreachable. It is reused only for the same, and setuptools' build/ (the extension
    # modules the wheel packs) goes with it.
    local configured_for
    configured_for="$PWD $(python3 -c 'import sysconfig; print(sysconfig.get_config_var("INCLUDEPY"))') launcher=${CMAKE_CXX_COMPILER_LAUNCHER:-none}" || return 1
    if [ -d .build ] && [ "$(cat "$CONFIGURED_STAMP" 2>/dev/null)" != "$configured_for" ]; then
        echo "python/wax/.build was not configured for $configured_for; configuring it again" >&2
        rm -rf .build build || return 1
    fi
    mkdir -p .build && echo "$python_version" > "$VERSION_STAMP" || return 1
    rm -rf setup.py dist wax/_private/proto wax/*.so && mkdir -p wax/_private/proto || return 1
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
    printf '%s\n' "$configured_for" > "$CONFIGURED_STAMP" || return 1
    local wheel=(dist/*.whl)
    [ -f "${wheel[0]}" ] || { echo "pip wheel left no wheel in python/wax/dist" >&2; return 1; }
    local wax="$BAKED/venv-wax$venv_tag/bin/python3" test_tools="$BAKED/venv-test-tools$venv_tag/bin/python3"
    "$wax" -m pip install --no-deps --force-reinstall "${wheel[@]}" &&
        "$test_tools" -m pip install --no-deps --force-reinstall "${wheel[@]}" &&
        "$wax" -m pip install --no-deps --no-build-isolation -e tests/wax-local-tools &&
        "$test_tools" -m pip install --no-deps --no-build-isolation -e ../test_tools
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
        printf 'case\t%s%s\tskip\t0\tthe build failed\n' "$s" "$case_tag" >> "$cases"
    done
    # CI's pre_commit_checks environment holds the wheel (mypy-test-tools resolves wax
    # from it), so without one the hooks cannot run as CI runs them.
    [ "$pre_commit" = 0 ] ||
        printf 'case\tpre-commit\tskip\t0\tthe build failed, and the pre-commit environment needs its wheel\n' >> "$cases"
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

# CI's pre_commit_checks environment: the pre-commit venv holds wax's dependencies (with
# its static-analysis group) and test-tools' without hiveio-wax; this adds the wheel just
# built, wax-local-tools from the checkout (wax's `poetry install` puts that path
# dependency in editable) and test-tools --no-deps, and checks that every hook environment
# is in the image's PRE_COMMIT_HOME (offline, a missing one fails here).
pre_commit_environment() {
    local wheel=(python/wax/dist/*.whl)
    python3 -m pip install --no-deps --force-reinstall "${wheel[@]}" &&
        python3 -m pip install --no-deps --no-build-isolation -e python/wax/tests/wax-local-tools &&
        python3 -m pip install --no-deps --no-build-isolation -e python/test_tools &&
        pre-commit install-hooks --config "$PRE_COMMIT_CONFIG"
}

# The ids of the config's hooks, in its order, each once.
pre_commit_hook_ids() {
    python3 -c '
import sys, yaml
ids = []
for repo in yaml.safe_load(open(sys.argv[1]))["repos"]:
    for hook in repo["hooks"]:
        if hook["id"] not in ids:
            ids.append(hook["id"])
print("\n".join(ids))
' "$PRE_COMMIT_CONFIG"
}

# The changes to python/ since snapshot SNAP (a copy of its tracked files and, in
# SNAP.untracked, the list of its untracked ones), as a unified diff.
tree_diff() {
    local snap="$1" f
    # -m also lists a tracked file deleted before the snapshot, which the snapshot lacks.
    git ls-files -z -m -- python | while IFS= read -r -d '' f; do
        if [ ! -e "$snap/$f" ]; then
            [ -e "$f" ] && diff -u --label /dev/null --label "b/$f" /dev/null "$f"
        elif [ ! -e "$f" ]; then
            diff -u --label "a/$f" --label /dev/null "$snap/$f" /dev/null
        elif ! cmp -s "$snap/$f" "$f"; then
            diff -u --label "a/$f" --label "b/$f" "$snap/$f" "$f"
        fi
    done
    git ls-files -z --others --exclude-standard -- python \
        | grep -zvxF -f <(tr '\0' '\n' < "$snap.untracked") \
        | while IFS= read -r -d '' f; do
            diff -u --label /dev/null --label "b/$f" /dev/null "$f"
        done
}

# CI's pre_commit_checks: `pre-commit run --config python/.pre-commit-config.yaml
# --all-files` from the repository root, in the pre-commit venv. Each hook id runs on its
# own, in the config's order, so a hook's case can carry the diff of what it rewrote;
# what a hook rewrites stays for the next one, as in one run, and the restore on exit
# undoes it. Writes $logs/pre-commit-junit.xml: one case per hook, a failure's body its
# output and diff.
pre_commit_checks() {
    local dir="$logs/pre-commit" pc_cases="$logs/pre-commit/cases.tsv" rc=0 t0 n=0 id status
    mkdir -p "$dir"; : > "$pc_cases"
    # mypy and ruff would put their caches in the checkout.
    export MYPY_CACHE_DIR="$backup/mypy-cache" RUFF_CACHE_DIR="$backup/ruff-cache"
    t0=$SECONDS
    if ! in_venv pre-commit pre_commit_environment > "$dir/environment.log" 2>&1 < /dev/null; then
        tail -40 "$dir/environment.log" >&2
        printf 'case\tpre-commit environment\tfail\t%s\tpre-commit cannot start: its environment or a hook environment is missing\t%s\n' \
            "$((SECONDS - t0))" "$dir/environment.log" >> "$pc_cases"
        junit_write_cases "$logs/pre-commit-junit.xml" pre-commit "$pc_cases"
        return 1
    fi
    local ids
    if ! ids="$(in_venv pre-commit pre_commit_hook_ids 2> "$dir/hook-ids.log")" || [ -z "$ids" ]; then
        printf 'case\tpre-commit hooks\tfail\t0\tcannot read the hook ids of %s\t%s\n' \
            "$PRE_COMMIT_CONFIG" "$dir/hook-ids.log" >> "$pc_cases"
        junit_write_cases "$logs/pre-commit-junit.xml" pre-commit "$pc_cases"
        return 1
    fi

    local snap="$backup/pre-commit-snapshot" log hook_lines line name result note case_log
    while IFS= read -r id; do
        n=$((n + 1))
        log="$dir/$n-$id.log"
        rm -rf "$snap"; mkdir -p "$snap"
        git ls-files -z -- python | tar --null -T - -cf - 2> /dev/null | tar -xf - -C "$snap"
        git ls-files -z --others --exclude-standard -- python > "$snap.untracked"
        t0=$SECONDS
        status=0
        in_venv pre-commit pre-commit run --config "$PRE_COMMIT_CONFIG" --all-files --color never "$id" \
            > "$log" 2>&1 < /dev/null || status=$?
        tree_diff "$snap" > "$dir/$n-$id.diff"
        # A hook's line: its name, dots, then `Passed`, `Failed` or `(<why>)Skipped`.
        hook_lines="$(grep -E '^.+[.]{3,}(\([^)]*\))?(Passed|Failed|Skipped)$' "$log")"
        if [ -z "$hook_lines" ]; then
            rc=1
            tail -40 "$log" >&2
            printf 'case\t%s\tfail\t%s\tpre-commit could not run hook %s (exit %s)\t%s\n' \
                "$id" "$((SECONDS - t0))" "$id" "$status" "$log" >> "$pc_cases"
            continue
        fi
        while IFS= read -r line; do
            result="${line##*.}"
            name="${line%%...*}"
            note=""
            [[ "$result" =~ ^\((.*)\)(Skipped)$ ]] && { note="${BASH_REMATCH[1]}"; result=Skipped; }
            case "$result" in
                Passed) printf 'case\t%s: %s\tpass\t%s\t\n' "$id" "$name" "$((SECONDS - t0))" >> "$pc_cases" ;;
                Skipped) printf 'case\t%s: %s\tskip\t0\t%s\n' "$id" "$name" "${note:-skipped}" >> "$pc_cases" ;;
                *)
                    rc=1
                    case_log="$dir/$n-$id.case.log"
                    {
                        cat "$log"
                        if [ -s "$dir/$n-$id.diff" ]; then
                            echo; echo "What the hook changed ($(wc -l < "$dir/$n-$id.diff") diff lines, all in $dir/$n-$id.diff):"
                            head -40 "$dir/$n-$id.diff"
                        fi
                    } > "$case_log"
                    tail -40 "$case_log" >&2
                    note="$id failed"
                    grep -q '^- files were modified by this hook' "$log" && note="$id failed: it modified files"
                    printf 'case\t%s: %s\tfail\t%s\t%s\t%s\n' "$id" "$name" "$((SECONDS - t0))" "$note" "$case_log" >> "$pc_cases"
                    ;;
            esac
        done <<< "$hook_lines"
        if [ "$status" -ne 0 ] && ! grep -qE 'Failed$' <<< "$hook_lines"; then
            rc=1
            printf 'case\t%s\tfail\t0\tpre-commit exited %s with no failed hook\t%s\n' "$id" "$status" "$log" >> "$pc_cases"
        fi
    done <<< "$ids"
    rm -rf "$snap" "$snap.untracked"
    junit_write_cases "$logs/pre-commit-junit.xml" pre-commit "$pc_cases"
    return "$rc"
}

python_tests() {
    local rc=0 name venv dir entry group
    if ! step_case "build$case_tag" wax "$logs/build.log" build_wheel; then
        steps_skipped_after_build
        junit_write_cases "$logs/steps-junit.xml" "$steps_suite" "$cases"
        cp "$logs/steps-junit.xml" "$junit"
        return 1
    fi

    step_case "protobuf pattern$case_tag" wax "$logs/protobuf-pattern.log" \
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
            printf 'case\t%s%s\tskip\t0\tno recorded API response (NO_RECORDING_TESTS)\n' \
                "$entry" "$case_tag" >> "$cases"
        else
            rc=1
            printf 'case\t%s%s\tfail\t0\tNO_RECORDING_TESTS names no test; update .aidev/run-python.sh\t%s\n' \
                "$entry" "$case_tag" "$logs/no-recording-$i.log" >> "$cases"
        fi
    done

    # proxy-mock-server.sh runs `pnpm install --frozen-lockfile` in ts/; have node_modules
    # current first, from the image's store, as the TS suite does.
    step_case "ts dependencies$case_tag" wax "$logs/ts-dependencies.log" \
        bash -c 'cd ts && source ../.aidev/pnpm-deps.sh' || rc=1

    local merged=() status
    for g in "${PYTEST_GROUPS[@]}"; do
        read -r name venv dir <<< "$g"
        local j="$logs/$name-junit.xml" log="$logs/$name.log"
        status=0
        in_venv "$venv" bash -c "$(group_command "$name" "$j") ${deselect[$name]:-}" > "$log" 2>&1 < /dev/null || status=$?
        tail -3 "$log" >&2
        # AIDEV's test id is classname and name only, so the version goes into the name.
        [ -z "$case_tag" ] || junit_tag_cases "$j" "$case_tag"
        if [ "$status" -ne 0 ]; then
            rc=1
            junit_add_unreported_failure "$j" "$name$suite_tag" "$name tests$case_tag" "$log" "$status"
        fi
        merged+=("$name$suite_tag=$j")
    done
    for f in python/wax/mock-server.log python/test_tools/mock-server.log; do
        [ -f "$f" ] && mv "$f" "$logs/$(basename "$(dirname "$f")")-mock-server.log"
    done

    step_case "visitor example$case_tag" wax "$logs/visitor-example.log" bash examples/python/run_example.sh || rc=1

    if [ "$pre_commit" = 1 ]; then
        pre_commit_checks || rc=1
        merged+=("pre-commit=$logs/pre-commit-junit.xml")
    fi

    junit_write_cases "$logs/steps-junit.xml" "$steps_suite" "$cases"
    junit_merge "$junit" "$steps_suite=$logs/steps-junit.xml" "${merged[@]}"
    return "$rc"
}

run_with_junit_fallback "$junit" "$steps_suite" python_tests
