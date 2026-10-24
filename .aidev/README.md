# wax under AIDEV

AIDEV verifies changes to wax through the slots in `project.yaml`, integrates them into
`aidev/integration`, and people merge that into `develop` through merge requests (as in
hive/denser). GitLab CI doesn't run for AIDEV branches; see `.gitlab-ci.yml` `workflow:`.

Only the TypeScript package (`ts/`, `@hiveio/wax`) is bound. The Rust package (`rust/`)
has a suite, `run-rust.sh` (see [The Rust suite](#the-rust-suite-run-rustsh)), that no slot
binds yet. The Python package (`python/`) is verified by CI only.

## Suites

`.aidev/run-checks.sh <suite> <step>... [<project>...]` runs the named steps and writes
`test-results/aidev-<suite>/junit.xml`, one test case per step with the step's log tail
as the failure body. `tests` adds `playwright-junit.xml` beside it, one case per test.
A step after a failed one is reported as skipped.

A `<project>` is a name in `OFFLINE_PROJECTS`. Naming any restricts `tests` to those
Playwright projects; naming none runs them all. The other steps run whenever they are
listed, because every test needs them. An argument that is neither a step nor an offline
project exits 2 before anything runs.

| Step | What | CI job it mirrors |
|---|---|---|
| `proto` | `ts/scripts/compile_proto_ts.sh` (ts-proto from `hive/libraries/protocol/proto`) | `wax_wasm_proto_tsc_generation` (`prebuild`) |
| `wasm` | `ts/wasm/build_wasm_wax.sh`: emscripten build of `core/` and hive's protocol, about a minute from scratch, incremental while `ts/wasm/build_wasm` survives | `wax_wasm_proto_tsc_generation` (`build`) |
| `tsc` | `tsc` of `ts/wasm/lib` | `wax_wasm_proto_tsc_generation` (`build`) |
| `bundle` | rollup, terser, `size-limit` (3420 kB), through `pnpm exec` as CI's build leaves `npm_package_*` unset | `wax_wasm_proto_tsc_generation` (`postbuild`) |
| `proto-pattern` | generated protobuf output equals `ts/protobuf_patterns/proto` | `test_wax_wasm_proto_pattern`, without its npm-pack listing |
| `build-tests` | `pnpm run build:test` | `wax_wasm_build_tests` |
| `tests` | Playwright, the projects in `OFFLINE_PROJECTS` less `NETWORK_TESTS` | `test_wax_wasm` |

| Slot | Steps |
|---|---|
| quick, baseline, coverage | proto wasm tsc bundle build-tests tests |
| full, canary | proto wasm tsc bundle proto-pattern build-tests tests |
| static | proto wasm tsc proto-pattern |
| system | proto wasm tsc bundle |

`verification.quick` lists the nine offline projects as its `targets` (the approved
scope), in `OFFLINE_PROJECTS` order. AIDEV appends them to `args`, so quick runs the
same work as without them.

### Test selection (`selector.py`, `observe`)

`selection.quick` binds `.aidev/selector.py:select`. For each change it proposes which
of quick's targets the change needs. In `observe` AIDEV only records the proposal
(`proposed_targets`, `degenerate`, `unrecognised`) and quick still runs every target.
Moving to `enforce` is a separate change, made with the observe evidence and its own
`on_empty` decision. The selector is a path table walked by testbed-runner's `path_map`
(longest prefix wins):

| Changed path | Proposal |
|---|---|
| `ts/wasm/__tests__/detailed/<name>.ts` | the offline project whose `testMatch` in `ts/playwright.config.ts` matches `<name>.js` (`utils.ts` → `wax_utils`, `mock_base.ts` → `wax_mock_tests`); nothing when none does, as the online projects alone run it |
| anything else under `ts/`, `core/`, `hive`, `.aidev/`, `.gitlab-ci.yml`, `.gitmodules` | all nine, `degenerate`: most tests run against the whole bundle through the `wasmTest` fixture, so a library change cannot be narrowed by imports |
| `python/`, `rust/`, `examples/`, `.md` files outside `ts/` | nothing, `irrelevant`: no slot builds them |
| any other path | nothing, `unrecognised` |

Before proposing anything, `stale_rules()` checks the table against the checkout: each
prefix must exist, and each approved target must be a project with a `testMatch` in
`ts/playwright.config.ts`. If any check fails, the selector proposes the whole scope and
names what failed. With no approved scope at all it proposes nothing but marks the
proposal `degenerate`. When you add, remove or rename an offline project, change
`OFFLINE_PROJECTS` and `verification.quick.targets` together.

`tests/test_selector.py` holds the selector's tests. Run them with an interpreter that has
aidev's `testbed_runner`; no slot runs them. To see what a diff proposes, run
`aidev test explain --diff <ref>`.

### What `tests` leaves out

Suites run with `--network none`. These parts of CI's `test_wax_wasm` matrix call
`api.hive.blog` and are not run: the projects `wax_testsuite`, `healthchecker_tests`,
`wax_custom_chain_online_tx` and `wax_testsuite_custom_chain_options`, and the seven tests in
`NETWORK_TESTS` (account-authority builders that read accounts from the chain, and two
mock tests whose requests the mock server proxies upstream). On 2026-10-03 the bound set
was 158 tests.

Also not run: the npm examples (`test_wax_wasm_examples`, they `pnpm install` from the
network), the signature-extension example, and the npm-pack file listing.

## The Rust suite (`run-rust.sh`)

`.aidev/run-rust.sh <suite>` runs CI's `build_rust` and `test_rust` offline:
`rust/build.sh --in-container release`, then `rust/test.sh --in-container release --test
detailed`. It writes `test-results/aidev-<suite>/rust-junit.xml` with a `build` case, one
case per test (a failure's captured output as its body) and the tests in
`LIVE_CHAIN_TESTS` as skipped cases; logs go to `test-results/aidev-<suite>/rust/`.

- `LIVE_CHAIN_TESTS` lists, one per line with its reason, the `detailed` tests that call
  `api.hive.blog` and fail under `--network none`: `custom_chain_online_tx` and the
  `complex_operations` `account_authority_update_*` tests (#182). They are skipped with
  `--exact --skip`, and an entry that no longer names a test fails the run. Find new ones
  by running the suite and reading the failures. On 2026-10-16: 353 passed, 18 skipped
  plus one `#[ignore]`d test.
- The build regenerates `rust/wax/proto` (proto_builder is cleaned first, so every run
  regenerates it as a fresh CI clone does) and `fetch_beekeeper.sh` re-pins
  `rust/signers/beekeeper/Cargo.toml`. The script snapshots those paths and the lock
  files before the build and puts them back on exit, so the checkout is as it was,
  uncommitted edits included.

### The image (`rust/docker/wax-rust-aidev-tests.dockerfile`)

The suite runs in `registry.gitlab.syncad.com/hive/wax/wax-rust-aidev-tests`:
wax-rust-builder (`WAX_RUST_BUILDER_IMAGE`) plus what the build would download.

| Path | What |
|---|---|
| `/opt/wax-aidev/cargo-home` | `CARGO_HOME` with every crate `rust/Cargo.lock` and `rust/proto_builder/Cargo.lock` pin (`cargo fetch --locked`), writable by any uid |
| `/opt/wax-aidev/beekeeper` | the `hiveio-beekeeper` crate at the version `rust/Cargo.lock` pins, as `fetch_beekeeper.sh` unpacks it; the script copies it to `rust/crates/hiveio-beekeeper` and sets `BEEKEEPER_VERSION` to it |
| `/opt/wax-aidev/cargo-lock.sha256` | `sha256sum` of the two lock files |

When either lock file differs from `cargo-lock.sha256`, the script writes one failing case,
"test image is stale for this Cargo.lock — rebuild wax-rust-aidev-tests", and exits 1
before building anything. Then rebuild the image: the CI job
`build_wax_rust_aidev_tests_image` runs on its own when the dockerfile or a lock file
changes (manual otherwise), pushes `wax-rust-aidev-tests:${WAX_RUST_AIDEV_TESTS_IMAGE_TAG}`
and ends its log with `Pushed …/wax-rust-aidev-tests@sha256:<digest>`. Bind that digest
where the suite is bound. Bump the tag's `-aidevN` suffix when the dockerfile changes.

To build and run it locally (build context `rust/`, submodules checked out recursively):

```bash
docker buildx build --load -t wax-rust-aidev-tests:local \
  -f rust/docker/wax-rust-aidev-tests.dockerfile rust
docker run --rm --network none --user "$(id -u):$(id -g)" \
  -v "$PWD":/work -w /work wax-rust-aidev-tests:local .aidev/run-rust.sh full
```

fc's CMake reads the git HEAD of `hive/libraries/fc`, so in a git worktree or a checkout
with submodule gitfiles the git directories they point to must be mounted too, as AIDEV
does.

## The test runtime image (`runtime/`)

The suites run in a container with `--network none` and your uid. The image is the emsdk
image CI's `npm_projects` template uses (`EMSCRIPTEN_IMAGE_TAG`, which `.gitlab-ci.yml`
sets over the `hive/common-ci-configuration` template's pin): emscripten 5.0.2, cmake,
ninja, protoc, Boost for wasm, Node 24.21.0, pnpm 10.0.0 and Playwright's chromium. It
adds a pnpm store filled with `pnpm fetch`; `pnpm-deps.sh` installs `ts/node_modules`
offline from it.

When `ts/pnpm-lock.yaml`, `ts/pnpm-workspace.yaml` or `ts/.npmrc` (both links into the
`ts/npm-common-config` submodule), `packageManager` or `runtime/Dockerfile` change, or
`EMSCRIPTEN_IMAGE_TAG` moves to a new emsdk image, rebuild and re-pin **in the same
commit**:

```bash
.aidev/runtime/build.sh --push   # registry digest if aidev-<input hash> exists, else build + push
# put the printed repo@sha256:<digest> into project.yaml environment.image
```

Run a suite by hand the same way AIDEV does (submodules checked out recursively):

```bash
docker run --rm --network none --user "$(id -u):$(id -g)" \
  -v "$PWD":/work -w /work <environment.image> .aidev/run-checks.sh quick proto wasm tsc bundle build-tests tests
```
