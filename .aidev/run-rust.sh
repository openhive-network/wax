#!/usr/bin/env bash
# AIDEV's Rust suite: CI's build_rust + test_rust (`rust/build.sh --in-container
# release`, then the `detailed` integration tests) with --network none, in the
# wax-rust-aidev-tests image (rust/docker/wax-rust-aidev-tests.dockerfile), which
# carries the crates and the hiveio-beekeeper crate those would download.
#
#   .aidev/run-rust.sh <suite>
#
# Writes test-results/aidev-<suite>/rust-junit.xml: a `build` case, one case per
# test, and the tests in LIVE_CHAIN_TESTS as skipped. Tracked files the build
# rewrites (the regenerated proto sources, the beekeeper version pin) are put
# back as they were before the run. See .aidev/README.md.
set -uo pipefail
cd "$(dirname "$0")/.."
root="$PWD"

suite="${1:?usage: $0 <suite>}"

BAKED=/opt/wax-aidev

# `detailed` tests that need a live chain, full test paths matched with
# --exact. The others answer their chain calls from recorded fixtures
# (rust/wax/tests/detailed/recorded_node.rs).
LIVE_CHAIN_TESTS=(
    custom_chain_online_tx::create_account_and_transfer_to_it_in_one_transaction  # checks a fresh account name against the live mirrornet; reports a skip when it is unreachable
)

# Tracked paths the build rewrites: proto_builder regenerates the proto sources,
# fetch_beekeeper.sh re-pins the beekeeper version, cargo may touch the locks.
RESTORED_PATHS=(
    rust/wax/proto
    rust/signers/beekeeper/Cargo.toml
    rust/Cargo.lock
    rust/proto_builder/Cargo.lock
)

out="$root/test-results/aidev-$suite"
junit="$out/rust-junit.xml"
logs="$out/rust"
mkdir -p "$out"
rm -rf "$junit" "$logs"; mkdir -p "$logs"
cases="$logs/cases.tsv"; : > "$cases"

source .aidev/junit-helpers.sh

if ! (cd rust && sha256sum --check --status "$BAKED/cargo-lock.sha256"); then
    {
        echo "The lock files differ from the ones the test image fetched crates for:"
        echo "image ($BAKED/cargo-lock.sha256):"; cat "$BAKED/cargo-lock.sha256"
        echo "checkout:"; (cd rust && sha256sum Cargo.lock proto_builder/Cargo.lock)
    } > "$logs/stale.log" 2>&1
    cat "$logs/stale.log" >&2
    printf 'case\timage freshness\tfail\t0\ttest image is stale for this Cargo.lock — rebuild wax-rust-aidev-tests\t%s\n' \
        "$logs/stale.log" >> "$cases"
    junit_write_cases "$junit" rust "$cases"
    exit 1
fi

backup="$(mktemp -d)"
tar -cf "$backup/tracked.tar" "${RESTORED_PATHS[@]}"
restore() {
    tar -xf "$backup/tracked.tar"
    rm -rf "$backup"
}
trap restore EXIT

export CARGO_HOME="$BAKED/cargo-home" CARGO_NET_OFFLINE=true
BEEKEEPER_VERSION="$(sed -n 's/^version = "\(.*\)"$/\1/p' "$BAKED/beekeeper/Cargo.toml" | head -1)"
export BEEKEEPER_VERSION
rm -rf rust/crates/hiveio-beekeeper
mkdir -p rust/crates && cp -a "$BAKED/beekeeper" rust/crates/hiveio-beekeeper
# The suite may run as a uid with no passwd entry (HOME=/), and git refuses a
# bind-mounted checkout owned by another uid.
[ -w "${HOME:-/}" ] || export HOME="$backup"
export GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0=safe.directory GIT_CONFIG_VALUE_0='*'

# proto_builder's build script only reruns when hive's .proto files change, and
# `restore` puts the previous sources back on exit: regenerate them as a fresh
# CI clone does, so every run tests the same sources.
(cd rust/proto_builder && CARGO_TARGET_DIR="$root/rust/wax/target/docker" cargo clean --quiet -p proto_builder)

t0=$SECONDS
if ! bash rust/build.sh --in-container release > "$logs/build.log" 2>&1 < /dev/null; then
    tail -40 "$logs/build.log" >&2
    printf 'case\tbuild\tfail\t%s\trust/build.sh --in-container release failed\t%s\n' \
        "$((SECONDS - t0))" "$logs/build.log" >> "$cases"
    junit_write_cases "$junit" rust "$cases"
    exit 1
fi
printf 'case\tbuild\tpass\t%s\t\n' "$((SECONDS - t0))" >> "$cases"

# Appends a case per test in libtest's output LOG to CASES, the failing ones
# with their captured output under DIR as the failure body.
libtest_cases() {
    LOG="$1" CASES="$2" DIR="$3" node -e '
const fs = require("fs");
const path = require("path");
const { LOG, CASES, DIR } = process.env;
const lines = fs.readFileSync(LOG, "utf8").replace(/\x1b\[[0-9;]*[A-Za-z]/g, "").split("\n");
const outputs = {};
let current = null;
for (const line of lines) {
  const header = line.match(/^---- (\S+) stdout ----$/);
  if (header) { current = header[1]; outputs[current] = []; continue; }
  if (current && /^(failures:|successes:)$/.test(line)) { current = null; continue; }
  if (current) outputs[current].push(line);
}
const rows = [];
for (const line of lines) {
  const m = line.match(/^test (\S+) \.\.\. (ok|FAILED|ignored)\b/);
  if (!m) continue;
  const [, name, result] = m;
  if (result === "ok") rows.push(["case", name, "pass", 0, ""]);
  else if (result === "ignored") rows.push(["case", name, "skip", 0, "#[ignore]"]);
  else {
    const log = path.join(DIR, `${rows.length}.log`);
    fs.writeFileSync(log, (outputs[name] || ["(no captured output)"]).join("\n"));
    rows.push(["case", name, "fail", 0, "test failed", log]);
  }
}
fs.appendFileSync(CASES, rows.map((r) => r.join("\t") + "\n").join(""));
' < /dev/null
}

rust_tests() {
    local rc=0 args=(--exact)
    for t in "${LIVE_CHAIN_TESTS[@]}"; do args+=(--skip "$t"); done
    (cd rust && bash test.sh --in-container release --test detailed -- "${args[@]}") \
        > "$logs/tests.log" 2>&1 < /dev/null || rc=$?
    mkdir -p "$logs/failures"
    libtest_cases "$logs/tests.log" "$cases" "$logs/failures" || return 1
    # A renamed or removed test would otherwise leave an entry that skips nothing.
    (cd rust && bash test.sh --in-container release --test detailed -- --list --format terse) \
        > "$logs/list.log" 2>&1 < /dev/null || rc=1
    for t in "${LIVE_CHAIN_TESTS[@]}"; do
        if grep -qxF "$t: test" "$logs/list.log"; then
            printf 'case\t%s\tskip\t0\tneeds a live chain (LIVE_CHAIN_TESTS)\n' "$t" >> "$cases"
        else
            rc=1
            printf 'case\t%s\tfail\t0\tLIVE_CHAIN_TESTS names no test in detailed; update .aidev/run-rust.sh\t%s\n' \
                "$t" "$logs/list.log" >> "$cases"
        fi
    done
    junit_write_cases "$junit" rust "$cases"
    [ "$rc" -ne 0 ] && junit_add_unreported_failure "$junit" rust "cargo test" "$logs/tests.log" "$rc"
    grep -E '^test result:' "$logs/tests.log" >&2
    return "$rc"
}

run_with_junit_fallback "$junit" rust rust_tests
