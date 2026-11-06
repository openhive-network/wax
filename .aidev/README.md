# wax under AIDEV

AIDEV verifies changes to wax through the slots in `project.yaml`, integrates them into
`aidev/integration`, and people merge that into `develop` through merge requests (as in
hive/denser). GitLab CI doesn't run for AIDEV branches; see `.gitlab-ci.yml` `workflow:`.

The TypeScript package (`ts/`, `@hiveio/wax`) is bound in every slot. The Rust package
(`rust/`) and the Python packages (`python/`: `hiveio-wax` and `hiveio-test-tools`) are
bound in full, baseline and canary as blocking, change-scoped suites, `run-rust.sh` and
`run-python.sh` (see [The Rust suite](#the-rust-suite-run-rustsh),
[The Python suite](#the-python-suite-run-pythonsh) and
[Which changes run them](#which-changes-run-the-rust-and-python-suites-select-suitesh)).
Every suite runs in one image that AIDEV builds itself (see
[The test runtime image](#the-test-runtime-image-runtime)).

## Suites

`.aidev/run-checks.sh <suite> <step>... [<project>...]` runs the named steps and writes
`test-results/aidev-<suite>/junit.xml`, one test case per step with the step's log tail
as the failure body. `tests` adds `playwright-junit.xml` beside it, one case per test.
A step after a failed one is reported as skipped.

A `<project>` is a name in `OFFLINE_PROJECTS` or `UNMAPPED_OFFLINE_PROJECTS`. Naming any
restricts `tests` to those Playwright projects; naming none runs both lists. The other
steps run whenever they are listed, because every test needs them. An argument that is
neither a step nor an offline project exits 2 before anything runs.

| Step | What | CI job it mirrors |
|---|---|---|
| `proto` | `ts/scripts/compile_proto_ts.sh` (ts-proto from `hive/libraries/protocol/proto`) | `wax_wasm_proto_tsc_generation` (`prebuild`) |
| `wasm` | `ts/wasm/build_wasm_wax.sh`: emscripten build of `core/` and hive's protocol, about a minute from scratch, incremental while `ts/wasm/build_wasm` survives | `wax_wasm_proto_tsc_generation` (`build`) |
| `tsc` | `tsc` of `ts/wasm/lib` | `wax_wasm_proto_tsc_generation` (`build`) |
| `bundle` | rollup, terser, `size-limit` (3420 kB), through `pnpm exec` as CI's build leaves `npm_package_*` unset | `wax_wasm_proto_tsc_generation` (`postbuild`) |
| `proto-pattern` | generated protobuf output equals `ts/protobuf_patterns/proto` | `test_wax_wasm_proto_pattern`, without its npm-pack listing |
| `build-tests` | `pnpm run build:test` | `wax_wasm_build_tests` |
| `tests` | Playwright, the projects in `OFFLINE_PROJECTS` and `UNMAPPED_OFFLINE_PROJECTS` (or the named ones) | `test_wax_wasm` |

| Slot | Suite `ts` (`run-checks.sh <slot>`, blocking) | Suite `rust` (`run-rust.sh <slot>-rust`, blocking) | Suite `python` (`run-python.sh <slot>-python`, blocking) |
|---|---|---|---|
| quick | proto wasm tsc bundle build-tests tests, the eleven `OFFLINE_PROJECTS` | — | — |
| baseline | proto wasm tsc bundle build-tests tests | `detailed` tests, change-scoped | wheel, pytest suites, pattern, example, change-scoped |
| full, canary | proto wasm tsc bundle proto-pattern build-tests tests | `detailed` tests, change-scoped | wheel, pytest suites, pattern, example, change-scoped |
| coverage | proto wasm tsc bundle build-tests tests | — | — |
| static | proto wasm tsc proto-pattern | — | — |
| system | proto wasm tsc bundle | — | — |

A slot with a single binding names no suites; full, baseline and canary list `ts`,
`rust` and `python` under `suites:`. The `rust` and `python` suites' labels are
`<slot>-rust` and `<slot>-python`, so their results go to `test-results/aidev-<slot>-rust/`
and `test-results/aidev-<slot>-python/`, never to the `ts` suite's
`test-results/aidev-<slot>/`, which `run-checks.sh` clears when it starts.

All three suites block: a failure in any of them that runs fails the slot. The `rust`
and `python` suites run only for a change that can affect them (next section); a
TypeScript-only change runs `ts` alone. A workflow runs the bindings approved on
`aidev/integration`, so if the `rust` or `python` suite fails on pull hosts for an
environmental reason, the recovery is a direct commit to `aidev/integration` that gives
that suite `mode: advisory` again.

### Which changes run the rust and python suites (`select-suite.sh`)

Each `rust` and `python` suite of full, baseline and canary declares
`select: [".aidev/select-suite.sh", "<suite>"]`. AIDEV runs it on the host before the
suite starts: exit 0 runs the suite, exit 77 skips it (recorded as skipped with the
script's last line as the reason, neither a pass nor a failure; `ts` still has to pass).
Any other exit, or a selector that cannot start, runs the suite. The script reads the
changed paths from `AIDEV_CHANGED_FILES_FILE` when the host can read it, else from
`git diff` and untracked files against `AIDEV_BASE_REF` (or `AIDEV_IMPLEMENT_BASE_SHA`).
With neither (a canary, a run by hand outside a workflow) or when git cannot answer,
the suite runs. A path is matched exactly or, for an entry ending in `/`, by prefix:

| Suite | Changed paths that run it | Why |
|---|---|---|
| both | `.aidev/project.yaml`, `.aidev/runtime/`, `.aidev/select-suite.sh`, `.aidev/junit-helpers.sh` | the binding, the image and the junit writer the suite runs with |
| both | `.aidev/compiler-cache.sh`, `ts/scripts/sccache_redis_probe.sh` | whether and how the native builds compile through sccache |
| both | `hive` (the submodule), `hive/`, `.gitmodules`, `core/` | the native builds compile `core/` and hive's protocol library and fc, and generate code from `hive/libraries/protocol/proto` (proto_builder, `grpc_tools.protoc`); `python/wax/poetry.lock` pins hiveio-api from the submodule |
| `rust` | `rust/`, `.aidev/run-rust.sh` | `rust/build.sh`, `rust/test.sh` and the crates they build |
| `python` | `python/`, `examples/python/`, `.aidev/run-python.sh`, `.aidev/pnpm-deps.sh` | the wheel, the pytest suites and the visitor example |
| `python` | `ts/wasm/__tests__/assets/`, `ts/package.json`, every other `ts/**package.json`, `ts/pnpm-lock.yaml`, `ts/pnpm-workspace.yaml`, `ts/.npmrc`, `ts/tsconfig.json`, `ts/npm-common-config` | the wax and hived-handle pytest groups start the API replay server (`proxy-mock-server.sh`) from these assets and recordings after a `pnpm install --frozen-lockfile` of the ts workspace |

Nothing else of `ts/`, `examples/` other than `examples/python/`, docs or CI files runs
either suite. When a build script of either suite starts reading a new path outside
these, add it to `select-suite.sh` and to this table.

`verification.quick` lists the eleven offline projects as its `targets` (the approved
scope), in `OFFLINE_PROJECTS` order. AIDEV appends them to `args`, so quick runs exactly
those eleven. The slots that name no project also run `UNMAPPED_OFFLINE_PROJECTS`
(`wax_testsuite`), which is not in the approved scope.

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
| `python/`, `rust/`, `examples/`, `.md` files outside `ts/` | nothing, `irrelevant`: no quick target builds them (the `rust` and `python` suites of full, baseline and canary do) |
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

Suites reach nothing but the compiler cache relay (see [The compiler cache](#the-compiler-cache)).
The Playwright tests get the responses of the public
nodes (`api.hive.blog`, the mirrornet, ...) from the API replay server, which serves the
recordings in `ts/wasm/__tests__/assets/mock/recordings` (see "Tests and the public API
nodes" in `ts/README.md`). `wax_testsuite` (the `index.spec*` files: `detailed/base`,
`protocol`, `hive_base`, `hive_chain`, ... and the two custom-chain specs under its mainnet
config) runs in every slot that names no project, but not in quick: it has no `testMatch`
for the selector to map, so it is kept out of quick's approved scope. Not run anywhere:
`healthchecker_tests`, which checks a live node (CI's advisory `test_wax_wasm_live_api`).

Also not run: the npm examples (`test_wax_wasm_examples`, they `pnpm install` from the
network), the signature-extension example, and the npm-pack file listing.

## The Rust suite (`run-rust.sh`)

Bound as the `rust` suite of full, baseline and canary (`run-rust.sh <slot>-rust`,
blocking, change-scoped, `timeout: 1200`): when it runs, a failure fails the slot as one
in `ts` does, so a change under `rust/` must pass it.

`.aidev/run-rust.sh <suite>` runs CI's `build_rust` and `test_rust` offline:
`rust/build.sh --in-container release`, then `rust/test.sh --in-container release --test
detailed`. It writes `test-results/aidev-<suite>/rust-junit.xml` with a `build` case, one
case per test (a failure's captured output as its body) and the tests in
`LIVE_CHAIN_TESTS` as skipped cases; logs go to `test-results/aidev-<suite>/rust/`.

- `LIVE_CHAIN_TESTS` lists, one per line with its reason, the `detailed` tests that need a
  live chain: `custom_chain_online_tx::create_account_and_transfer_to_it_in_one_transaction`,
  which checks a fresh account against the public mirrornet and, when the mirrornet
  cannot be reached, prints a `mirrornet unreachable` skip and passes. The other
  network tests (#182) answer their read-only calls from recorded fixtures (#201,
  `rust/wax/tests/detailed/recorded_node.rs`). Listed tests are skipped with `--exact
  --skip`, and an entry that no longer names a test fails the run. Find new ones by
  running the suite and reading the failures. On 2026-10-25: 371 passed, 1 skipped plus
  one `#[ignore]`d test.
- The build regenerates `rust/wax/proto` (proto_builder is cleaned first, so every run
  regenerates it as a fresh CI clone does) and `fetch_beekeeper.sh` re-pins
  `rust/signers/beekeeper/Cargo.toml`. The script snapshots those paths and the lock
  files before the build and puts them back on exit, so the checkout is as it was,
  uncommitted edits included.

What the image carries for it: rustup's stable toolchain (`/opt/rust`), static Boost
(`WAX_BOOST_ROOT`, which the script passes to the build as `BOOST_ROOT`), and under
`/opt/wax-aidev` the `CARGO_HOME` with every crate `rust/Cargo.lock` and
`rust/proto_builder/Cargo.lock` pin (`cargo fetch --locked`, writable by any uid) and the
`hiveio-beekeeper` crate at the version `rust/Cargo.lock` pins, as `fetch_beekeeper.sh`
unpacks it; the script copies it to `rust/crates/hiveio-beekeeper` and sets
`BEEKEEPER_VERSION` to it. A lock file change rebuilds the image (see below), so there is
nothing to re-pin.

To run it locally, build the image (see below) and run, with submodules checked out
recursively:

```bash
docker run --rm --network none --user "$(id -u):$(id -g)" \
  -v "$PWD":/work -w /work wax-aidev-tests:local .aidev/run-rust.sh full-rust
```

fc's CMake reads the git HEAD of `hive/libraries/fc`, so in a git worktree or a checkout
with submodule gitfiles the git directories they point to must be mounted too, as AIDEV
does.

## The Python suite (`run-python.sh`)

Bound as the `python` suite of full, baseline and canary (`run-python.sh <slot>-python`,
blocking, change-scoped, `timeout: 1200`): when it runs, a failure fails the slot as one
in `ts` does, so a change under `python/` must pass it.

`.aidev/run-python.sh <suite>` runs, offline and on Python 3.12 (CI also runs 3.14), what
CI's Python jobs run, against the checkout:

| Case | What | CI job it mirrors |
|---|---|---|
| `build` | `build_wax.sh 1` without its network calls: the protos with `grpc_tools.protoc` as `compile_proto.sh` calls it (without its `poetry lock` and `poetry install`), then `pip wheel --no-deps --no-build-isolation`; the wheel is installed into both of the image's venvs, with `wax-local-tools` and `python/test_tools` editable. The version is `0.0.0+aidev` (`POETRY_DYNAMIC_VERSIONING_BYPASS`), as a checkout may have no tags | `build_wheel` |
| `protobuf pattern` | `diff` of the generated `python/wax/wax/_private/proto` against `python/wax/protobuf_patterns` | `test_wax_protobuf_python_pattern` |
| `ts dependencies` | `pnpm-deps.sh`, so the `pnpm install --frozen-lockfile` of `proxy-mock-server.sh` finds `ts/node_modules` current | — |
| `wax` | `python/wax/tests/run_tests.sh`: pytest behind the API replay server (`proxy-mock-server.sh`, `replay`) | `test_wax_protobuf_python` |
| `helpy` | pytest in `python/wax/tests/helpy_test` | `test_helpy` |
| `test-tools-unit` | pytest `-m "not requires_hived_executables"` of `python/test_tools/tests/unit_tests`, against the wheel just built (CI takes it from the registry) | `test_tools_unit_tests` |
| `test-tools-hived-handle` | `python/test_tools/tests/hived_handle_tests/run_tests.sh`, behind the replay server | `test_tools_hived_handle` |
| `visitor example` | `examples/python/run_example.sh` | `test_wax_protobuf_python_examples` |

It writes `test-results/aidev-<suite>/python-junit.xml`: a testsuite `python` with the
step cases above, then each pytest group's own junit as a testsuite named after the
group. A failing step's log tail is its failure body; after a failed build the other
steps are skipped cases. Logs, the per-group junit files and the replay servers' logs go
to `test-results/aidev-<suite>/python/`. It exits non-zero when any case failed. On
2026-11-05: wax 1121 passed and 8 skipped, helpy 99, test-tools unit 110 and hived-handle
8 passed.

- `NO_RECORDING_TESTS` lists, one per line with its reason, the tests that fail only
  because the replay server has no recording for a request they make (HTTP 501), as
  repository-relative node ids. Each is passed to its group as `--deselect` and reported
  as a skipped case, and an entry that no longer names a test fails the run. It is empty:
  every test passes against the recordings.
- `compile_proto.sh` regenerates the tracked `python/wax/wax/_private/proto`, and the
  build writes `dist/` and other untracked files. The script snapshots the tracked files
  under `python/` and `examples/python/` before the build and puts them back on exit,
  uncommitted edits included, and removes the untracked files the run created (ignored
  ones, like the C++ and Cython build directories, stay, so the next build is
  incremental): `git status --porcelain` after a run is what it was before.

What the image carries for it: static Boost (`WAX_BOOST_ROOT`) and the static OpenSSL,
zlib and bzip2 that `python/wax/CMakeLists.txt` links from `/usr/local/lib`, Poetry
with poetry-dynamic-versioning in its own environment (so the `requires-plugins` of the
`poetry run` in the CI scripts are satisfied offline), the pnpm store the replay server's
`pnpm install` takes from, and under `/opt/wax-aidev`:

| Path | What |
|---|---|
| `venv-wax` | Python 3.12 venv with `poetry install --no-root` of `python/wax/poetry.lock`, the `[build-system].requires` and pytest, pytest-asyncio and pytest-xdist at common-ci-configuration's python-test-tools constraints |
| `venv-test-tools` | the same for `python/test_tools/poetry.lock`, with `hiveio-wax` removed from it as CI's `.test_tools_test_env` does |

The Python is python-build-standalone's latest CPython 3.12 (`python3.12`, installed by
uv), not the base's Ubuntu 3.12.3, whose `typing.get_type_hints` cannot resolve
hiveio-api's PEP 695 generics. The native build uses the base's gcc (Ubuntu 24.04), where
CI's `build_wheel` uses the manylinux_2_28 `ci-base-image`; the Rust build differs from
CI's wax-rust-builder the same way. The static Boost is on `CPLUS_INCLUDE_PATH` for both
suites only (CI's image has Boost headers on the default include path; the ts suite's
wasm build must not see them). A lock file change, including the `hiveio-api` pin a hive
submodule bump moves (`sync_hiveio_api`), rebuilds the image (see below).

To run it locally (submodules checked out recursively; in a git worktree mount the git
directory the `.git` file points to as well):

```bash
docker run --rm --network none --user "$(id -u):$(id -g)" \
  -v "$PWD":/work -w /work wax-aidev-tests:local .aidev/run-python.sh full-python
```

## The compiler cache

Almost all of a suite's time is compiling the C++ of `core/` and hive (the wasm build in
`ts`, natively through cargo in `rust` and through the wheel in `python`) and the Rust
crates. The suites share CI's sccache Redis (`SCCACHE_REDIS` in `.gitlab-ci.yml`), as
hive's checks do:

- `project.yaml`'s `sandbox` starts a one-service stack for every slot,
  `sccache-relay.compose.yml`: a socat relay from `sccache:6379` to CI's Redis. The suite
  container joins the stack's `default` network, which is `internal`, so it reaches the
  relay and nothing else; only the relay is also on a network with a route out.
- every suite sources `compiler-cache.sh`, which sets `SCCACHE_REDIS` to the relay
  (`WAX_SCCACHE_REDIS` overrides it) and sources `ts/scripts/sccache_redis_probe.sh`, the
  probe CI's build jobs source. It PINGs Redis through the relay (a TCP connect would not
  do: socat accepts it even when Redis is down, and sccache 0.8.1 then fails every
  compile). When Redis answers, the wasm build gets sccache as its CMake launcher
  (`ts/wasm/src/CMakeLists.txt`), cargo `RUSTC_WRAPPER=sccache` with
  `CARGO_INCREMENTAL=0` (cc-rs wraps the cxx bridge with it, and `rust/wax/build.rs` passes
  it to the CMake build of hive and `core/` as the compiler launcher), and new CMake build
  trees `CMAKE_<LANG>_COMPILER_LAUNCHER=sccache` (python/wax's). When it does not, the
  probe prints one `WARNING: sccache redis ... unreachable - building without compiler
  cache` line and every build runs uncached and cold: the cache never fails a suite.
- the cache is used only from a host near the Redis: `compiler-cache.sh` times a PING
  through the relay and, over 10 ms, prints one `WARNING: ... too far for a cache hit to
  beat compiling` line and builds uncached. From a host in another data centre (40 ms)
  a cached object reads at about 1 MB/s, and a warm rust suite took 427 s against 178 s
  uncached; from one 0.8 ms away (about 90 MB/s) it took 49 s against 118 s. A Redis per
  region is what would let the far hosts hit.
- a host whose Docker address pools hand out a subnet holding Redis' address (on
  steem-18 a compose network got `192.168.48.0/20`, and `192.168.50.109` is in it) loses
  its route to Redis, the host included, while that network exists; the suites then
  build cold. The cure is the daemon's `default-address-pools`, not this profile.
- sccache keys include absolute paths. Every slot mounts the checkout at `/work`, so the
  suites hit each other's entries on any host; CI builds under a runner-specific
  `/builds/...` path, so they do not share entries with CI.
- the logs end with `sccache --show-stats`: `wasm.log` (ts), `rust/build.log` and the
  suite's output (rust), `python/build.log` (python).

A run by hand with `--network none` builds cold. To use the cache, start the relay on a
network and run the suite on it:

```bash
docker network create --internal wax-checks
docker run -d --rm --name wax-sccache --network bridge alpine/socat:1.8.0.3 \
    TCP-LISTEN:6379,fork,reuseaddr TCP:192.168.50.109:6379
docker network connect --alias sccache wax-checks wax-sccache
docker run --rm --network wax-checks --user "$(id -u):$(id -g)" \
  -v "$PWD":/work -w /work wax-aidev-tests:local .aidev/run-rust.sh full-rust
```

## The test runtime image (`runtime/`)

Every suite runs in one container with your uid, on the stack's internal network (see
[The compiler cache](#the-compiler-cache)), in the image
AIDEV builds from `runtime/Dockerfile` (`environment.build` in `project.yaml`). Its base
is **followed** (`environment.base`, `follow: true`): the emsdk image CI's
`npm_projects` template uses, `EMSCRIPTEN_IMAGE_TAG` of `hive/common-ci-configuration`
in the `ts/npm-common-config` submodule (emscripten, cmake, ninja, protoc, Boost for
wasm, gcc, ccc's Node, pnpm and Playwright's chromium). wax-rust-builder and wax's
`ci-base-image` carry more of the native toolchains, but they are manylinux_2_28
(glibc 2.28) images that emscripten's and Playwright's Ubuntu builds do not run on, and
the `ts` suite runs in every slot: on the emsdk base it runs exactly as in CI, and the
native toolchains are what the Dockerfile adds:

| What | For |
|---|---|
| a pnpm store filled with `pnpm fetch` of `ts/pnpm-lock.yaml`, and the `packageManager` pnpm through corepack; `pnpm-deps.sh` installs `ts/node_modules` offline from it | `ts`, and the replay server of `python` |
| static Boost built by `python/wax/scripts/prepare_boost.sh` as CI's `ci-base-image` builds it (`/wax_boost_root`, `WAX_BOOST_ROOT`), static OpenSSL, zlib and bzip2 | `rust`, `python` |
| rustup's stable toolchain, the crates of both `Cargo.lock` files, the `hiveio-beekeeper` crate | `rust` |
| CPython 3.12 (python-build-standalone), Poetry and the two Python venvs | `python` |

Before a slot runs, AIDEV asks the registry which digest the base tag names and digests
the Dockerfile and every `environment.inputs` file (lock files, the manifests and
scripts the Dockerfile reads, `runtime/Dockerfile.dockerignore`). A build of that pair
already on the host is reused; otherwise AIDEV builds and pushes it, and the slot's
runtime line reads `… built|reused on followed base <tag>@sha256:…`. So a change to
`ts/pnpm-lock.yaml`, `rust/Cargo.lock`, a `poetry.lock` or the Dockerfile needs no hand
rebuild and no re-pin: the first run on each host after it pays the build (Boost and the
toolchains come from the docker layer cache once a host has built them). A failed build
refuses the slot as `no-environment`, naming the error. `environment.image` is only the
seed pin AIDEV requires beside a followed base (the base's digest when it was adopted);
it never has to move.

The build context is the checkout narrowed by `runtime/Dockerfile.dockerignore` to the
files the Dockerfile copies. When the Dockerfile starts copying a file, add it there,
and to `environment.inputs` when its content decides what is baked, or a change to it
would reuse a build made without it.

The suite scripts do not check the image against the checkout's lock files: the build
key is those files, so the image always matches them. An image that does not (a hand
run in an old image) shows up as an offline install or fetch failure naming the missing
package.

The base tag is a declaration of its own: a common-ci-configuration bump that moves
`EMSCRIPTEN_IMAGE_TAG` (as on a ccc Node bump) has to move `environment.base.image` to
the new tag in the same commit, and the seed `environment.image` to its digest; a change
to `base` or `build` is a protected change that waits for approval.

Build the image and run a suite by hand the same way AIDEV does (submodules checked out
recursively):

```bash
docker build --build-arg BASE_IMAGE=registry.gitlab.syncad.com/hive/common-ci-configuration/emsdk:5.0.2-10 \
  -f .aidev/runtime/Dockerfile -t wax-aidev-tests:local .
docker run --rm --network none --user "$(id -u):$(id -g)" \
  -v "$PWD":/work -w /work wax-aidev-tests:local .aidev/run-checks.sh quick proto wasm tsc bundle build-tests tests
```
