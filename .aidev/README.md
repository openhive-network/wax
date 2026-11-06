# wax under AIDEV

AIDEV verifies changes to wax through the slots in `project.yaml`, integrates them into
`aidev/integration`, and people merge that into `develop` through merge requests (as in
hive/denser). GitLab CI doesn't run for AIDEV branches; see `.gitlab-ci.yml` `workflow:`.

The TypeScript package (`ts/`, `@hiveio/wax`) is bound in every slot. The Rust package
(`rust/`) and the Python packages (`python/`: `hiveio-wax` and `hiveio-test-tools`) are
bound in full, baseline and canary as blocking, change-scoped suites, `run-rust.sh` and
`run-python.sh` on Python 3.12 and, as the `python314` suite, on Python 3.14 with CI's
pre-commit hooks (see [The Rust suite](#the-rust-suite-run-rustsh),
[The Python suite](#the-python-suite-run-pythonsh),
[The python314 suite](#the-python314-suite-run-pythonsh---python-314---pre-commit) and
[Which changes run them](#which-changes-run-the-rust-and-python-suites-select-suitesh)).
Every suite runs in one image that AIDEV builds itself (see
[The test runtime image](#the-test-runtime-image-runtime)).

## Suites

`.aidev/run-checks.sh <suite> <step>... [<project>...]` runs the named steps and writes
`test-results/aidev-<suite>/junit.xml`, one test case per step with the step's log tail
as the failure body. `tests` adds `playwright-junit.xml` beside it, one case per test.
A step after a failed one is reported as skipped, except after `include-refs`, which no
step needs.

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
| `npm-pack` | the file list of the packed package equals `ts/protobuf_patterns/npm-pack.out` (`diff -u`, so the files that differ are in the failure). Packed with `pnpm pack`, which CI's `npm_pack_package.sh` runs: its `npm_build_package.sh` fetches git tags to set the version first, which needs the network and changes no file of the package | `test_wax_wasm_proto_pattern` (the npm-pack listing) |
| `proto-pattern` | generated protobuf output equals `ts/protobuf_patterns/proto` | `test_wax_wasm_proto_pattern` (the proto diff) |
| `build-tests` | `pnpm run build:test` | `wax_wasm_build_tests` |
| `tests` | Playwright, the projects in `OFFLINE_PROJECTS` and `UNMAPPED_OFFLINE_PROJECTS` (or the named ones) | `test_wax_wasm` |
| `include-refs` | each submodule of `INCLUDE_REFS` (`hive` against `hive/hive`, `ts/npm-common-config` against `hive/common-ci-configuration`) is committed at the `ref:` of that project's `include:` in `.gitlab-ci.yml`, one case per submodule (`include-ref <path>`) naming both commits. Reads the gitlink and `.gitlab-ci.yml` of `HEAD` (not the submodule's checkout), and the ref on the line after `project:`, as ccc's `verify_submodule_ref.sh` does. Needs no other step: a failure skips none after it | `verify_include_refs` |

| Slot | Suite `ts` (`run-checks.sh <slot>`, blocking) | Suite `rust` (`run-rust.sh <slot>-rust`, blocking) | Suite `python` (`run-python.sh <slot>-python`, blocking) | Suite `python314` (`run-python.sh <slot>-python314 --python 3.14 --pre-commit`, blocking) |
|---|---|---|---|---|
| quick | proto wasm tsc bundle build-tests tests, the eleven `OFFLINE_PROJECTS` | — | — | — |
| baseline | include-refs proto wasm tsc bundle npm-pack build-tests tests | `detailed` tests, change-scoped | wheel, pytest suites, pattern, example on 3.12, change-scoped | the same on 3.14, then the pre-commit hooks, change-scoped |
| full, canary | include-refs proto wasm tsc bundle npm-pack proto-pattern build-tests tests | `detailed` tests, change-scoped | wheel, pytest suites, pattern, example on 3.12, change-scoped | the same on 3.14, then the pre-commit hooks, change-scoped |
| coverage | proto wasm tsc bundle build-tests tests | — | — | — |
| static | proto wasm tsc proto-pattern | — | — | — |
| system | proto wasm tsc bundle | — | — | — |

A slot with a single binding names no suites; full, baseline and canary list `ts`,
`rust`, `python` and `python314` under `suites:`, in that order. The other suites'
labels are `<slot>-rust`, `<slot>-python` and `<slot>-python314`, so their results go
to `test-results/aidev-<slot>-rust/`, `test-results/aidev-<slot>-python/` and
`test-results/aidev-<slot>-python314/`, never to the `ts` suite's
`test-results/aidev-<slot>/`, which `run-checks.sh` clears when it starts.

All four suites block: a failure in any of them that runs fails the slot. The `rust`,
`python` and `python314` suites run only for a change that can affect them (next
section); a TypeScript-only change runs `ts` alone. A workflow runs the bindings
approved on `aidev/integration`, so if the `rust`, `python` or `python314` suite fails
on pull hosts for an environmental reason, the recovery is a direct commit to
`aidev/integration` that gives that suite alone `mode: advisory` (for `python314`, its
three bindings only; `python` keeps blocking).

### Which changes run the rust and python suites (`select-suite.sh`)

Each `rust`, `python` and `python314` suite of full, baseline and canary declares
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
| `python`, `python314` | `python/`, `examples/python/`, `.aidev/run-python.sh`, `.aidev/pnpm-deps.sh` | the wheel, the pytest suites and the visitor example; `python/.pre-commit-config.yaml` and every file its `files` filter lets the hooks check are under `python/` |
| `python`, `python314` | `ts/wasm/__tests__/assets/`, `ts/package.json`, every other `ts/**package.json`, `ts/pnpm-lock.yaml`, `ts/pnpm-workspace.yaml`, `ts/.npmrc`, `ts/tsconfig.json`, `ts/npm-common-config` | the wax and hived-handle pytest groups start the API replay server (`proxy-mock-server.sh`) from these assets and recordings after a `pnpm install --frozen-lockfile` of the ts workspace |

Nothing else of `ts/`, `examples/` other than `examples/python/`, docs or CI files runs
any of them. When a build script of one of them starts reading a new path outside
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
network) and the signature-extension example.

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

`.aidev/run-python.sh <suite>` runs, offline and on Python 3.12 (3.14 is the `python314`
suite, below), what CI's Python jobs run, against the checkout:

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
- The build trees in `python/wax` (`.build`, `build`, `.cython_build`,
  `cpp_python_bridge.cpp`) are built for one Python version and record it
  (`.build/aidev-python-version`). Before a build, the other version's trees are moved to
  the git-ignored `python/wax/.cache/aidev-build/<version>` and this version's are taken
  back, so `python` and `python314` stay incremental when they alternate in one checkout.
  Within a version, `.build/aidev-configured-for` (checkout path, Python include
  directory, compiler launcher) still decides whether the CMake tree is reused.

What the image carries for it: static Boost (`WAX_BOOST_ROOT`) and the static OpenSSL,
zlib and bzip2 that `python/wax/CMakeLists.txt` links from `/usr/local/lib`, Poetry
with poetry-dynamic-versioning in its own environment (so the `requires-plugins` of the
`poetry run` in the CI scripts are satisfied offline), the pnpm store the replay server's
`pnpm install` takes from, and under `/opt/wax-aidev`:

| Path | What |
|---|---|
| `venv-wax` | Python 3.12 venv with `poetry install --no-root` of `python/wax/poetry.lock`, the `[build-system].requires` and pytest, pytest-asyncio and pytest-xdist at common-ci-configuration's python-test-tools constraints |
| `venv-test-tools` | the same for `python/test_tools/poetry.lock`, with `hiveio-wax` removed from it as CI's `.test_tools_test_env` does |
| `venv-wax-3.14`, `venv-test-tools-3.14` | the same two on Python 3.14, for `python314` |
| `venv-pre-commit-3.14` | `pre_commit_checks`' environment on 3.14, for `python314`: `poetry install --no-root` of both lock files into one venv (wax's with its `static-analysis` group: mypy, ruff, pre-commit; test-tools' without `hiveio-wax`), test-tools' `[build-system].requires` and pytest at the same constraints |
| `pre-commit-home` | `PRE_COMMIT_HOME`: the hook environments of `python/.pre-commit-config.yaml`'s remote repositories (pre-commit-hooks, poetry, codespell, detect-missing-init), installed at build time with `pre-commit install-hooks` in a temporary git repository and writable by any uid |

The Pythons are python-build-standalone's latest CPython 3.12 and 3.14 (`python3.12`,
`python3.14`, installed by uv), not the base's Ubuntu 3.12.3, whose `typing.get_type_hints` cannot resolve
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

## The python314 suite (`run-python.sh --python 3.14 --pre-commit`)

Bound as the `python314` suite of full, baseline and canary, after `python`
(`run-python.sh <slot>-python314 --python 3.14 --pre-commit`, blocking, change-scoped by
`select-suite.sh python314` with the `python` suite's paths, `timeout: 1200`). It is the
`python` suite's script, not a copy: `--python 3.14` runs the same steps on Python 3.14,
as CI's `.python_test_matrix` does, and `--pre-commit` (accepted with 3.14 only, as CI
runs `pre_commit_checks` on 3.14; anything else is a usage error, exit 2) adds CI's
pre-commit hooks. It has its own timeout and verdict, so the `python` suite's results
and history are as they were.

- **Python 3.14.** The protos and the pattern check, then the wheel built with
  `python3.14` and `PYO3_USE_ABI3_FORWARD_COMPATIBILITY=1` (what CI sets) through the
  compiler cache, installed into `venv-wax-3.14` and `venv-test-tools-3.14`, then the
  four pytest groups and the visitor example there. The step cases carry the version
  (`build (3.14)`, `protobuf pattern (3.14)`, ...), the steps' testsuite is
  `python-3.14` and the groups' are `wax-3.14`, `helpy-3.14`, `test-tools-unit-3.14`
  and `test-tools-hived-handle-3.14`. AIDEV identifies a case by its classname and
  name only, not its testsuite, so every pytest case's name ends in ` (3.14)` too
  (`test_reblog (3.14)`, `test_x[a] (3.14)`), added to each group's junit before the
  merge (`junit_tag_cases`), while its classname stays as pytest wrote it and still
  names the test file. No case collides with one of the `python` suite's. The id
  `tests/.../test_follow_operation.py::test_reblog (3.14)` is not a node id pytest can
  run; AIDEV records this command suite's cases but never re-runs them by node id.
  After a failed build the other steps are skipped cases.
- **pre-commit.** `pre-commit run --config python/.pre-commit-config.yaml --all-files`
  from the repository root, as `pre_commit_checks` runs it, in `venv-pre-commit-3.14`
  plus the cp314 wheel just built, `wax-local-tools` (editable, as wax's `poetry
  install` has it) and `python/test_tools` `--no-deps`. That environment needs the
  wheel (`mypy-test-tools` type-checks against it), so after a failed build the step is
  one skipped `pre-commit` case. A `pre-commit environment` case fails, with
  pre-commit's output, when that environment or a hook environment cannot be prepared
  (offline, a hook environment missing from the image's `PRE_COMMIT_HOME` fails there).
  Otherwise each hook id runs on its own, in the config's order, and every hook it
  reports is a case of the testsuite `pre-commit` named `<id>: <name>`: Passed is a
  pass, Skipped (`no files to check`, from the config's `files` filter) a skipped case,
  Failed a failure whose body is the hook's output and, when the hook rewrote files
  (ruff `--fix`, ruff-format, pretty-format-json `--autofix`, trailing-whitespace,
  end-of-file-fixer, detect-missing-init `--create`), the diff of what it changed. A
  rewrite stays for the next hook, as in CI's single run. A hook that pre-commit cannot
  run at all is a failing case with pre-commit's output. mypy's and ruff's caches go to
  the run's temporary directory; the restore puts back what the hooks rewrote and
  removes what they created, so `git status --porcelain` afterwards is what it was
  before. On CI's develop pipeline 185080: 12 hooks passed, `check-yaml` and the three
  `poetry-lock` hooks skipped (`no files to check`).

It writes `test-results/aidev-<slot>-python314/python-junit.xml` and its logs under
`test-results/aidev-<slot>-python314/python/` (the hooks' under `python/pre-commit/`:
each hook's output and diff), and exits non-zero when any case failed.

To run it locally (as above):

```bash
docker run --rm --network none --user "$(id -u):$(id -g)" \
  -v "$PWD":/work -w /work wax-aidev-tests:local \
  .aidev/run-python.sh full-python314 --python 3.14 --pre-commit
```

A changed hook `rev` in `python/.pre-commit-config.yaml` rebuilds the image (it is an
`environment.inputs` file). If the suite fails on pull hosts for an environmental
reason, the recovery is a direct commit to `aidev/integration` that sets `mode:
advisory` on the three `python314` suites only.

## The compiler cache

Almost all of a suite's time is compiling the C++ of `core/` and hive (the wasm build in
`ts`, natively through cargo in `rust` and through the wheel in `python`) and the Rust
crates. The suites use the host's site sccache cache when AIDEV hands one over, else CI's
sccache Redis (`SCCACHE_REDIS` in `.gitlab-ci.yml`), as hive's checks do:

- AIDEV hands every slot one backend, in the suite's environment and in the stack's
  compose environment: `AIDEV_SCCACHE_WEBDAV_ENDPOINT` (a disk-backed WebDAV cache,
  `http://steem-9.syncad.com:8090/` for the Jefferson hosts, `session24.pl` for Poland)
  or `AIDEV_SCCACHE_REDIS*` (CI's Redis, for the Alleghany hosts). See aidev's
  `docs/operations/sccache-cache.md`.
- `project.yaml`'s `sandbox` starts a one-service stack for every slot,
  `sccache-relay.compose.yml`: a socat relay from `sccache:6379` to CI's Redis and, when
  the compose environment has `AIDEV_SCCACHE_WEBDAV_ENDPOINT`, from `sccache:8090` to that
  endpoint's `host:port`. The suite container joins the stack's `default` network, which
  is `internal`, so it reaches the relay and nothing else; only the relay is also on a
  network with a route out.
- every suite sources `compiler-cache.sh`. With `AIDEV_SCCACHE_WEBDAV_ENDPOINT` set, it
  times `HEAD /healthz` on a warm connection (the fastest of three) to the endpoint, then
  through `http://sccache:8090/`, and uses the first that answers 200 within the gate below:
  `SCCACHE_WEBDAV_ENDPOINT` is that address, `SCCACHE_WEBDAV_KEY_PREFIX` is `wax` and
  `SCCACHE_REDIS` is unset. Otherwise it sets `SCCACHE_REDIS` to the relay
  (`WAX_SCCACHE_REDIS` overrides it). Either way it then sources
  `ts/scripts/sccache_redis_probe.sh`, the probe CI's build jobs source. It PINGs Redis
  when that is the backend (a TCP connect would not do: socat accepts it even when Redis
  is down, and sccache then fails every compile). When a cache answers, the wasm build
  gets sccache as its CMake launcher (`ts/wasm/src/CMakeLists.txt`), cargo
  `RUSTC_WRAPPER=sccache` with `CARGO_INCREMENTAL=0` (cc-rs wraps the cxx bridge with it,
  and `rust/wax/build.rs` passes it to the CMake build of hive and `core/` as the compiler
  launcher), and new CMake build trees `CMAKE_<LANG>_COMPILER_LAUNCHER=sccache`
  (python/wax's). When it does not, the probe prints one `WARNING: sccache redis ...
  unreachable - building without compiler cache` line and every build runs uncached and
  cold: the cache never fails a suite.
- a cache is used only from a host near it: a request's round trip after the connection
  is up (the second PING, the fastest warm `HEAD`) must be at most 10 ms. Over that,
  `compiler-cache.sh` prints one `WARNING: ... too far for a cache hit to beat compiling`
  line and moves on (WebDAV to Redis, Redis to uncached). From a host in another data
  centre (40 ms) a cached object reads at about 1 MB/s, and a warm rust suite took 427 s
  against 178 s uncached; from one 0.8 ms away (about 90 MB/s) it took 49 s against
  118 s.
- the image's sccache is 0.10 (`runtime/Dockerfile`). The emsdk base's 0.8.1 stats each
  key with `PROPFIND` before reading it, the site caches answer every `PROPFIND` as a
  collection, and 0.8.1 then reads nothing: it never hits a WebDAV cache.
- each suite records the backend it chose in `test-results/aidev-<suite>/sccache.tsv`,
  one tab-separated line: the backend (`webdav`, `redis` or `none`), the cache it names,
  and how it was reached or why none was used. E.g. `webdav`,
  `http://steem-9.syncad.com:8090/`, `through http://sccache:8090/, 0 ms`; or `none`, an
  empty field, `redis://sccache:6379 answers in 41 ms, over 10 ms; building cold`.
- a host whose Docker address pools hand out a subnet holding Redis' address (on
  steem-18 a compose network got `192.168.48.0/20`, and `192.168.50.109` is in it) loses
  its route to Redis, the host included, while that network exists; the suites then
  build cold. The cure is the daemon's `default-address-pools`, not this profile.
- sccache keys include absolute paths. Every slot mounts the checkout at `/work`, so the
  suites hit each other's entries on any host of a site; CI builds under a
  runner-specific `/builds/...` path, so they do not share entries with CI.
- the logs end with `sccache --show-stats` (its `Cache location` names the backend):
  `wasm.log` (ts), `rust/build.log` and the suite's output (rust), `python/build.log`
  (python).

A run by hand with `--network none` builds cold. To use a site's WebDAV cache, run the
suite on a network with a route to it and pass the endpoint:

```bash
docker run --rm --network bridge --user "$(id -u):$(id -g)" \
  -e AIDEV_SCCACHE_WEBDAV_ENDPOINT=http://steem-9.syncad.com:8090/ \
  -v "$PWD":/work -w /work wax-aidev-tests:local .aidev/run-rust.sh full-rust
```

To use CI's Redis, start the relay on a network and run the suite on it:

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
| CPython 3.14 (python-build-standalone), the two 3.14 venvs, the pre-commit venv and the hook environments of `python/.pre-commit-config.yaml` (`PRE_COMMIT_HOME`) | `python314` |

Before a slot runs, AIDEV asks the registry which digest the base tag names and digests
the Dockerfile and every `environment.inputs` file (lock files, the manifests and
scripts the Dockerfile reads, `python/.pre-commit-config.yaml` whose hook environments
it installs, `runtime/Dockerfile.dockerignore`). A build of that pair
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
