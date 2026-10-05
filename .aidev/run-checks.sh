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
# (wax_mock_tests, localhost:8000).
OFFLINE_PROJECTS=(
    wax_utils
    wax_non_encrypted_operations
    wax_encrypted_operations
    wax_operation_factories
    wax_regression_tests
    wax_mock_tests
    wax_testsuite_protocol_benchmarks
    wax_hive_assertion
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

wasm_build() {
    local build_dir=ts/wasm/build_wasm
    # A build dir configured by the former git fallback keeps its
    # CMAKE_PROJECT_INCLUDE_BEFORE (a file no longer present) in the cache.
    if [ -f "$build_dir/.aidev-git-mode" ]; then rm -rf "$build_dir"; fi
    # Direct execution (`1 <repo root>`): we are already inside the emsdk image.
    # No compiler cache: the slot has no sccache redis.
    WAX_DISABLE_COMPILER_CACHE=1 bash ts/wasm/build_wasm_wax.sh 1 "$root" \
        && test -s ts/wasm/lib/build_wasm/wax.common.wasm
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
