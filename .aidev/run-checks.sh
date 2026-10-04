#!/usr/bin/env bash
# The checks AIDEV's verification slots run (.aidev/project.yaml), as junit: each
# named step is a test case in test-results/aidev-<suite>/junit.xml (its log tail
# the failure body), and the Playwright step adds one case per test in
# test-results/aidev-<suite>/playwright-junit.xml.
#
#   .aidev/run-checks.sh <suite> <step>...
#
# Steps, in the order the TypeScript package builds (each needs the ones before it):
#   proto        ts/scripts/compile_proto_ts.sh: ts-proto from hive/libraries/protocol/proto
#   wasm         ts/wasm/build_wasm_wax.sh: the C++ core and hive protocol compiled to
#                WebAssembly with emscripten (cmake + ninja), installed into
#                ts/wasm/lib/build_wasm. Incremental when ts/wasm/build_wasm survives.
#   tsc          tsc of ts/wasm/lib (package.json `build`, after the wasm part)
#   bundle       package.json `postbuild`: rollup, terser, size-limit (the 3420 kB limit)
#   proto-pattern  generated protobuf output equals ts/protobuf_patterns/proto
#                (CI's test_wax_wasm_proto_pattern, without its npm-pack listing)
#   build-tests  package.json `build:test`: the beekeeper signer and the test sources
#   tests        Playwright, the projects in OFFLINE_PROJECTS below
#
# Suites run with --network none. The Playwright projects that call api.hive.blog
# (wax_testsuite, healthchecker_tests, wax_custom_chain_online_tx, ...) can't run
# there, so `tests` runs only the projects that need no network, less the tests
# in them that do (NETWORK_TESTS); see .aidev/README.md.
set -uo pipefail
cd "$(dirname "$0")/.."
root="$PWD"

suite="${1:?usage: $0 <suite> <step>...}"; shift
out="$root/test-results/aidev-$suite"
rm -rf "$out"; mkdir -p "$out"
cases="$out/cases.tsv"; : > "$cases"

source .aidev/junit-helpers.sh
# shellcheck source=pnpm-deps.sh
if ! (cd ts && source ../.aidev/pnpm-deps.sh) > "$out/install.log" 2>&1; then
    tail -40 "$out/install.log" >&2
    printf 'case\tinstall\tfail\t0\tpnpm install --offline failed\t%s\n' "$out/install.log" >> "$cases"
    junit_write_cases "$out/junit.xml" "$suite" "$cases"
    exit 1
fi

# The Playwright projects CI runs (test_wax_wasm's matrix) whose tests need no
# network: they call the wasm module itself or the local mock server
# (wax_mock_tests, localhost:8000). wax_hive_assertion is not in CI's matrix and
# is not run here either.
OFFLINE_PROJECTS=(
    wax_utils
    wax_non_encrypted_operations
    wax_encrypted_operations
    wax_operation_factories
    wax_regression_tests
    wax_mock_tests
    wax_testsuite_protocol_benchmarks
)
# Tests in those projects that still reach api.hive.blog: the account-authority
# builders read accounts from the chain, and the mock server proxies requests it
# has no recording for. Title fragments, joined into --grep-invert.
NETWORK_TESTS=(
    "create simple account authority update operation"
    "remove owner key for initminer"
    "replace initminer owner key"
    "authority trace with mock data with delegated authority where 2 accounts"
    "authority trace with mock data for 5 signatures where one of the public keys"
)

status=0
failed=0
step() {
    local name="$1"; shift
    local log="$out/$name.log" t0=$SECONDS rc=0
    if [ "$failed" -ne 0 ]; then
        printf 'case\t%s\tskip\t0\tan earlier step failed\n' "$name" >> "$cases"
        return
    fi
    echo "== $name" >&2
    "$@" > "$log" 2>&1 < /dev/null || rc=$?
    if [ "$rc" -eq 0 ]; then
        printf 'case\t%s\tpass\t%s\t\n' "$name" "$((SECONDS - t0))" >> "$cases"
    else
        status=1; failed=1; tail -40 "$log" >&2
        printf 'case\t%s\tfail\t%s\texit %s\t%s\n' "$name" "$((SECONDS - t0))" "$rc" "$log" >> "$cases"
    fi
}

# hive's fc reads its git revision at configure time. In a workflow container
# its git metadata may not be readable the way fc reads it, so when fc's lookup
# finds no HEAD (fc_git_head_readable) the configure loads .aidev/cmake/git-fallback.cmake
# (through a `cmake` shim on PATH), which answers with a placeholder revision.
# A marker in the build dir records which way it was configured; switching
# rebuilds from scratch, because CMAKE_PROJECT_INCLUDE_BEFORE stays in the cache.
# Ask fc's own GetGitRevisionDescription.cmake whether it finds a HEAD hash, not
# git: fc resolves the `gitdir:` of hive/libraries/fc/.git as a path relative to
# that directory and reads <gitdir>/HEAD itself. When the container gets git
# metadata as link files with absolute gitdirs (ai/aidev#14661), `git rev-parse`
# succeeds but fc's lookup still finds nothing and the configure stops with
# "Git HEAD file not found".
fc_git_head_readable() {
    local probe rc=0
    probe="$(mktemp -d)"
    printf '%s\n' \
        "include(\"$root/hive/libraries/fc/GitVersionGen/GetGitRevisionDescription.cmake\")" \
        "get_git_head_revision(\"$root/hive/libraries/fc\" refspec hash)" \
        'if(NOT hash OR hash MATCHES "NOTFOUND")' \
        '  message(FATAL_ERROR "fc finds no git HEAD")' \
        'endif()' > "$probe/probe.cmake"
    (cd "$probe" && /usr/bin/cmake -P probe.cmake) > /dev/null 2>&1 || rc=1
    rm -rf "$probe"
    return "$rc"
}

wasm_build() {
    local build_dir=ts/wasm/build_wasm mode=git shim=""
    if ! fc_git_head_readable; then
        mode=fallback
        shim="$(mktemp -d)"
        printf '#!/bin/sh\nfor a in "$@"; do case "$a" in --install|--build|-E|-P) exec /usr/bin/cmake "$@" ;; esac; done\nexec /usr/bin/cmake -DCMAKE_PROJECT_INCLUDE_BEFORE=%s "$@"\n' \
            "$root/.aidev/cmake/git-fallback.cmake" > "$shim/cmake"
        chmod +x "$shim/cmake"
        echo "fc finds no git HEAD in hive/libraries/fc: configuring with .aidev/cmake/git-fallback.cmake" >&2
        printf 'property\tfc-git-revision\tfallback (no git in the container)\n' >> "$cases"
    fi
    if [ -d "$build_dir" ] && [ "$(cat "$build_dir/.aidev-git-mode" 2>/dev/null)" != "$mode" ]; then
        rm -rf "$build_dir"
    fi
    mkdir -p "$build_dir" && echo "$mode" > "$build_dir/.aidev-git-mode"
    # Direct execution (`1 <repo root>`): we are already inside the emsdk image.
    # No compiler cache: the slot has no sccache redis.
    local rc=0
    PATH="${shim:+$shim:}$PATH" AIDEV_FC_GIT_REVISION=0000000000000000000000000000000000000000 AIDEV_FC_GIT_TIMESTAMP=0 \
        WAX_DISABLE_COMPILER_CACHE=1 bash ts/wasm/build_wasm_wax.sh 1 "$root" || rc=$?
    [ -n "$shim" ] && rm -rf "$shim"
    [ "$rc" -eq 0 ] && test -s ts/wasm/lib/build_wasm/wax.common.wasm
}

# package.json `postbuild`, through `pnpm exec` rather than `pnpm run`: CI's
# build leaves npm_package_name/version unset when rollup inlines them, and the
# tests expect that ("app": "undefined/undefined" in complex_operations).
bundle() (
    cd ts && pnpm exec rollup -c && pnpm exec tsx ./npm-common-config/ts-common/terser.ts && pnpm exec size-limit
)

proto_pattern() {
    diff --brief --recursive --no-ignore-file-name-case --no-dereference \
        ts/protobuf_patterns/proto ts/wasm/dist/lib/proto
}

playwright_tests() {
    local rc=0 args=()
    for p in "${OFFLINE_PROJECTS[@]}"; do args+=("--project=$p"); done
    local invert; invert="$(IFS='|'; echo "${NETWORK_TESTS[*]}")"
    args+=(--grep-invert "$invert")
    rm -f ts/results.xml ts/results.json
    (cd ts && pnpm run pretest && unset CI && pnpm exec playwright test --workers 4 "${args[@]}") || rc=$?
    if [ -s ts/results.xml ]; then
        cp ts/results.xml "$out/playwright-junit.xml"
        [ "$rc" -ne 0 ] && junit_add_unreported_failure "$out/playwright-junit.xml" playwright "playwright run" "$out/tests.log" "$rc"
    fi
    return "$rc"
}

for s in "$@"; do
    case "$s" in
        proto) step proto bash -c 'cd ts && rm -rf wasm/dist && ./scripts/compile_proto_ts.sh' ;;
        wasm) step wasm wasm_build ;;
        tsc) step tsc bash -c 'cd ts && pnpm exec tsc' ;;
        bundle) step bundle bundle ;;
        proto-pattern) step proto-pattern proto_pattern ;;
        build-tests) step build-tests bash -c 'cd ts && pnpm run build:test' ;;
        tests) step tests playwright_tests ;;
        *) echo "unknown step: $s" >&2; exit 2 ;;
    esac
done
junit_write_cases "$out/junit.xml" "$suite" "$cases"
exit "$status"
