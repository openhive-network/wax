#!/usr/bin/env bash
# The checks AIDEV's verification slots run (.aidev/project.yaml), as junit: each
# named step is a test case in test-results/aidev-<suite>/junit.xml (its log tail
# the failure body), and the Playwright step adds one case per test in
# test-results/aidev-<suite>/playwright-junit.xml.
#
#   .aidev/run-checks.sh <suite> <step>... [<project>...]
#
# A <project> is a name in OFFLINE_PROJECTS or UNMAPPED_OFFLINE_PROJECTS: naming
# any restricts the `tests` step to those projects (quick names the targets of
# verification.quick in project.yaml, OFFLINE_PROJECTS); naming none runs both
# lists. Any other argument exits 2 before anything runs.
#
# Steps, in the order the TypeScript package builds (each needs the ones before it):
#   proto        ts/scripts/compile_proto_ts.sh: ts-proto from hive/libraries/protocol/proto
#   wasm         ts/wasm/build_wasm_wax.sh: the C++ core and hive protocol compiled to
#                WebAssembly with emscripten (cmake + ninja), installed into
#                ts/wasm/lib/build_wasm. Incremental when ts/wasm/build_wasm survives.
#   tsc          tsc of ts/wasm/lib (package.json `build`, after the wasm part)
#   bundle       package.json `postbuild`: rollup, terser, size-limit (the 3420 kB limit)
#   npm-pack     the file list of `pnpm pack` equals ts/protobuf_patterns/npm-pack.out
#                (the npm-pack listing of CI's test_wax_wasm_proto_pattern)
#   proto-pattern  generated protobuf output equals ts/protobuf_patterns/proto
#                (the proto diff of CI's test_wax_wasm_proto_pattern)
#   build-tests  package.json `build:test`: the beekeeper signer and the test sources
#   tests        Playwright, the projects in OFFLINE_PROJECTS and UNMAPPED_OFFLINE_PROJECTS
#                below (or the named ones)
# and one step that needs none of them and skips none after it when it fails:
#   include-refs each submodule in INCLUDE_REFS committed at the `ref:` of its
#                project's `include:` in .gitlab-ci.yml, one case per submodule
#                (CI's verify_include_refs)
#
# Suites reach nothing but the stack's sccache relay (.aidev/compiler-cache.sh),
# as offline as --network none otherwise. The Playwright projects get the responses of
# api.hive.blog recorded (ts/wasm/__tests__/assets/mock/recordings), except
# healthchecker_tests, which calls the live node; `tests` runs the projects listed
# below; see .aidev/README.md.
set -uo pipefail
cd "$(dirname "$0")/.."
root="$PWD"

suite="${1:?usage: $0 <suite> <step>... [<project>...]}"; shift

# The Playwright projects CI runs (test_wax_wasm's matrix) that have a testMatch
# (.aidev/selector.py maps test modules to projects by it): they call the wasm
# module itself, the local mock server (wax_mock_tests, localhost:8000) or the API
# replay server. This list is quick's approved scope.
OFFLINE_PROJECTS=(
    wax_utils
    wax_non_encrypted_operations
    wax_encrypted_operations
    wax_operation_factories
    wax_regression_tests
    wax_mock_tests
    wax_testsuite_protocol_benchmarks
    wax_hive_assertion
    wax_signers_csp
    wax_custom_chain_online_tx
    wax_testsuite_custom_chain_options
)
# Offline projects CI runs too that the selector cannot map, so they are not in
# quick's scope: wax_testsuite runs every index.spec* file and has no testMatch.
UNMAPPED_OFFLINE_PROJECTS=(
    wax_testsuite
)
# VERIFY_REFS of verify_include_refs in .gitlab-ci.yml: <submodule>:<included project>.
INCLUDE_REFS=(
    hive:hive/hive
    ts/npm-common-config:hive/common-ci-configuration
)

steps=()
projects=()
for a in "$@"; do
    case "$a" in
        include-refs|proto|wasm|tsc|bundle|npm-pack|proto-pattern|build-tests|tests) steps+=("$a") ;;
        *)
            known=0
            for p in "${OFFLINE_PROJECTS[@]}" "${UNMAPPED_OFFLINE_PROJECTS[@]}"; do [ "$a" = "$p" ] && known=1; done
            if [ "$known" -eq 0 ]; then
                echo "unknown step or offline Playwright project: $a" >&2; exit 2
            fi
            projects+=("$a") ;;
    esac
done
[ "${#projects[@]}" -eq 0 ] && projects=("${OFFLINE_PROJECTS[@]}" "${UNMAPPED_OFFLINE_PROJECTS[@]}")

out="$root/test-results/aidev-$suite"
rm -rf "$out"; mkdir -p "$out"
cases="$out/cases.tsv"; : > "$cases"

source .aidev/junit-helpers.sh
# shellcheck source=compiler-cache.sh
source .aidev/compiler-cache.sh "$out/sccache.tsv" >&2
# shellcheck source=pnpm-deps.sh
if ! (cd ts && source ../.aidev/pnpm-deps.sh) > "$out/install.log" 2>&1; then
    tail -40 "$out/install.log" >&2
    printf 'case\tinstall\tfail\t0\tpnpm install --offline failed\t%s\n' "$out/install.log" >> "$cases"
    junit_write_cases "$out/junit.xml" "$suite" "$cases"
    exit 1
fi

status=0
failed=0
# record <name> <rc> <t0> <log> [<message>]: the case of a check that started at
# SECONDS=<t0> and exited <rc>; a failure fails the suite.
record() {
    local name="$1" rc="$2" t0="$3" log="$4" message="${5:-exit $2}"
    if [ "$rc" -eq 0 ]; then
        printf 'case\t%s\tpass\t%s\t\n' "$name" "$((SECONDS - t0))" >> "$cases"
    else
        status=1; tail -40 "$log" >&2
        printf 'case\t%s\tfail\t%s\t%s\t%s\n' "$name" "$((SECONDS - t0))" "$message" "$log" >> "$cases"
    fi
}
step() {
    local name="$1"; shift
    local log="$out/$name.log" t0=$SECONDS rc=0
    if [ "$failed" -ne 0 ]; then
        printf 'case\t%s\tskip\t0\tan earlier step failed\n' "$name" >> "$cases"
        return
    fi
    echo "== $name" >&2
    "$@" > "$log" 2>&1 < /dev/null || rc=$?
    record "$name" "$rc" "$t0" "$log"
    [ "$rc" -eq 0 ] || failed=1
}

# CI's verify_include_refs runs ccc's verify_submodule_ref.sh, which reads the
# submodule's checked-out HEAD. This reads the gitlink and .gitlab-ci.yml of the
# commit under test instead, so a stale submodule checkout cannot hide a moved
# gitlink; the ref is the line after `project: ...<project>`, as that script reads it.
include_refs() {
    local pair path project log t0 gitlink ref rc
    local git=(env GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0=safe.directory GIT_CONFIG_VALUE_0='*' git)
    for pair in "${INCLUDE_REFS[@]}"; do
        path="${pair%%:*}" project="${pair#*:}" t0=$SECONDS rc=0
        log="$out/include-ref-${path//\//-}.log"
        echo "== include-ref $path" >&2
        gitlink="$("${git[@]}" ls-tree HEAD -- "$path" 2> "$log" | awk '$2 == "commit" { print $3 }')"
        ref="$("${git[@]}" show HEAD:.gitlab-ci.yml 2>> "$log" \
            | awk -v p="$project" 'found { sub(/.*ref:/, ""); gsub(/[ \047"]/, ""); print; exit } index($0, "project:") && index($0, p) { found = 1 }')"
        {
            echo "Submodule commit ($path in HEAD):              ${gitlink:-(none)}"
            echo "Include ref ($project in .gitlab-ci.yml): ${ref:-(none)}"
        } >> "$log"
        [ -n "$gitlink" ] && [ "$gitlink" = "$ref" ] || rc=1
        record "include-ref $path" "$rc" "$t0" "$log" \
            "$path is at ${gitlink:-(no gitlink)}, the $project include ref is ${ref:-(not found)}"
    done
}

wasm_build() {
    local build_dir=ts/wasm/build_wasm
    # A build dir configured by the former git fallback keeps its
    # CMAKE_PROJECT_INCLUDE_BEFORE (a file no longer present) in the cache.
    if [ -f "$build_dir/.aidev-git-mode" ]; then rm -rf "$build_dir"; fi
    # Direct execution (`1 <repo root>`): we are already inside the emsdk image.
    # ts/wasm/src/CMakeLists.txt launches the compiles through sccache unless
    # compiler-cache.sh found no cache (WAX_DISABLE_COMPILER_CACHE).
    local rc=0
    bash ts/wasm/build_wasm_wax.sh 1 "$root" && test -s ts/wasm/lib/build_wasm/wax.common.wasm || rc=$?
    compiler_cache_stats
    return "$rc"
}

# package.json `postbuild`, through `pnpm exec` rather than `pnpm run`: CI's
# build leaves npm_package_name/version unset when rollup inlines them, and the
# tests expect that ("app": "undefined/undefined" in complex_operations).
bundle() (
    cd ts && pnpm exec rollup -c && pnpm exec tsx ./npm-common-config/ts-common/terser.ts && pnpm exec size-limit
)

# CI packs with ccc's npm_build_package.sh, which first fetches git tags to set the
# version (network) and then runs `pnpm pack` (npm_pack_package.sh): the same pnpm
# on the same tree lists the same files, so pack with it directly.
npm_pack() {
    local dest="$out/npm-pack"
    rm -rf "$dest"; mkdir -p "$dest"
    (cd ts && pnpm pack --pack-destination "$dest") || return
    tar -tf "$dest"/*.tgz > "$dest/npm-pack.gen" || return
    diff -u --label ts/protobuf_patterns/npm-pack.out --label 'pnpm pack' \
        ts/protobuf_patterns/npm-pack.out "$dest/npm-pack.gen"
}

proto_pattern() {
    diff --brief --recursive --no-ignore-file-name-case --no-dereference \
        ts/protobuf_patterns/proto ts/wasm/dist/lib/proto
}

playwright_tests() {
    local rc=0 args=()
    for p in "${projects[@]}"; do args+=("--project=$p"); done
    rm -f ts/results.xml ts/results.json
    (cd ts && pnpm run pretest && unset CI && pnpm exec playwright test --workers 4 "${args[@]}") || rc=$?
    if [ -s ts/results.xml ]; then
        cp ts/results.xml "$out/playwright-junit.xml"
        [ "$rc" -ne 0 ] && junit_add_unreported_failure "$out/playwright-junit.xml" playwright "playwright run" "$out/tests.log" "$rc"
    fi
    return "$rc"
}

for s in "${steps[@]}"; do
    case "$s" in
        include-refs) include_refs ;;
        proto) step proto bash -c 'cd ts && rm -rf wasm/dist && ./scripts/compile_proto_ts.sh' ;;
        wasm) step wasm wasm_build ;;
        tsc) step tsc bash -c 'cd ts && pnpm exec tsc' ;;
        bundle) step bundle bundle ;;
        npm-pack) step npm-pack npm_pack ;;
        proto-pattern) step proto-pattern proto_pattern ;;
        build-tests) step build-tests bash -c 'cd ts && pnpm run build:test' ;;
        tests) step tests playwright_tests ;;
    esac
done
junit_write_cases "$out/junit.xml" "$suite" "$cases"
exit "$status"
