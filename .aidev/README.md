# wax under AIDEV

AIDEV verifies changes to wax through the slots in `project.yaml`, integrates them into
`aidev/integration`, and people merge that into `develop` through merge requests (as in
hive/denser). GitLab CI doesn't run for AIDEV branches; see `.gitlab-ci.yml` `workflow:`.

Only the TypeScript package (`ts/`, `@hiveio/wax`) is bound. The Python (`python/`) and
Rust (`rust/`) packages are verified by CI only.

## Suites

`.aidev/run-checks.sh <suite> <step>...` runs the named steps and writes
`test-results/aidev-<suite>/junit.xml`, one test case per step with the step's log tail
as the failure body. `tests` adds `playwright-junit.xml` beside it, one case per test.
A step after a failed one is reported as skipped.

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

### What `tests` leaves out

Suites run with `--network none`. These parts of CI's `test_wax_wasm` matrix call
`api.hive.blog` and are not run: the projects `wax_testsuite`, `healthchecker_tests`,
`wax_custom_chain_online_tx` and `wax_testsuite_custom_chain_options`, and the seven tests in
`NETWORK_TESTS` (account-authority builders that read accounts from the chain, and two
mock tests whose requests the mock server proxies upstream). `wax_hive_assertion` is
not in CI's matrix and is not run either. On 2026-10-03 the bound set was 158 tests.

Also not run: the npm examples (`test_wax_wasm_examples`, they `pnpm install` from the
network), the signature-extension example, and the npm-pack file listing.

### hive's fc and git

hive's `libraries/fc` reads its revision at configure time and stops when it finds no
HEAD. It does not ask git for this. It resolves the `gitdir:` of `hive/libraries/fc/.git`
as a path relative to that directory and reads `<gitdir>/HEAD` itself. A workflow
container's git metadata can be unreadable that way (no gitdirs mounted, or link files
with absolute gitdirs, ai/aidev#14661) even when `git` itself works. So `wasm` runs fc's
own `get_git_head_revision` first, and when that finds no hash it configures with
`.aidev/cmake/git-fallback.cmake` (revision `000…0`, timestamp 0). The junit then
carries the property `fc-git-revision: fallback`.

## The test runtime image (`runtime/`)

The suites run in a container with `--network none` and your uid. The image is the emsdk
image CI's `npm_projects` template uses (`EMSCRIPTEN_IMAGE` at the
`hive/common-ci-configuration` ref `.gitlab-ci.yml` includes): emscripten 5.0.2, cmake,
ninja, protoc, Boost for wasm, Node 22.21.1, pnpm 10.0.0 and Playwright's chromium. It
adds a pnpm store filled with `pnpm fetch`; `pnpm-deps.sh` installs `ts/node_modules`
offline from it.

When `ts/pnpm-lock.yaml`, `ts/pnpm-workspace.yaml` or `ts/.npmrc` (both links into the
`ts/npm-common-config` submodule), `packageManager` or `runtime/Dockerfile` change, or the
common-ci-configuration ref moves to a new emsdk image, rebuild and re-pin **in the same
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
