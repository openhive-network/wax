# Building wax (Rust) in Docker

This directory contains the container recipe used by [`rust/build.sh`](../build.sh) to build the `hiveio-wax` package against the canonical CI environment, without installing C++ dependencies on the host.

## Files

- [`wax-rust-builder.dockerfile`](wax-rust-builder.dockerfile) — image definition. Based on the wax CI base image (`registry.gitlab.syncad.com/hive/wax/ci-base-image:pypa_2_28-13`) which ships prebuilt Boost, OpenSSL, CMake and gcc-toolset-14. Adds `protobuf-compiler`, a stable Rust toolchain and a non-root user whose UID/GID match the host.

## Usage

From `rust/`:

```bash
./build.sh           # debug build inside docker
./build.sh release   # release build inside docker
```

`build.sh` builds the `wax-rust-builder` image, mounts the wax workspace, and runs the build inside the container as a user whose UID/GID match the host so generated files stay owned by you.

Artifacts land under `rust/wax/target/docker/<profile>/` on the host (see [Why a separate target dir](#why-a-separate-target-dir)).

### Profile selection

| Argument | Profile |
|----------|---------|
| _(none)_ | `debug` |
| `debug`  | `debug` |
| `release`| `release` |

`WAX_PROFILE=debug ./build.sh` also works.

### Build steps

Inside the container, `build.sh` runs the full pipeline:

1. [`../fetch_beekeeper.sh`](../fetch_beekeeper.sh) — downloads the `hiveio-beekeeper` test dependency into `rust/crates/hiveio-beekeeper`; cargo resolves that path dev-dependency on every invocation, tests or not.
2. `cargo build` in `rust/proto_builder/` — regenerates the committed proto-derived sources under `rust/wax/proto/` from `hive/libraries/protocol/proto/`.
3. [`../wax/prelink_bundle.sh`](../wax/prelink_bundle.sh) — builds the C++ side from the `hive` submodule and installs the self-contained native bundle at `rust/wax/lib/libwax_native.a`.
4. `cargo build [--release]` in `rust/wax/` — the regular Rust build, linking the bundle.

The `hive` submodule must be initialized — `git submodule update --init --recursive`.

## Why a separate target dir

The C++ side of `wax` is built through CMake (via the [`cmake` build-script crate](https://docs.rs/cmake)). CMake bakes absolute library paths into `CMakeCache.txt` — e.g. `/usr/lib/x86_64-linux-gnu/libreadline.a` on a Debian host vs `/usr/lib64/libreadline.a` on the Rocky-based CI image. If host and container builds share the same target directory, whichever ran first poisons the cache for the other.

`build.sh` sets `CARGO_TARGET_DIR=rust/wax/target/docker` inside the container so:

- `rust/wax/target/` stays reserved for native host `cargo` invocations
- `rust/wax/target/docker/` is reserved for containerized builds
- both can coexist; no `cargo clean` needed when switching

## Building without Docker

If the C++ build dependencies (Boost ≥ 1.74, OpenSSL, CMake ≥ 3.16, a C++17 compiler) and a stable Rust toolchain are installed on the host:

```bash
cd rust/wax
./prelink_bundle.sh   # builds the C++ side and installs lib/libwax_native.a
cargo build           # links the bundle
```

The prelink step is needed once per checkout and again after C++ / `hive` submodule changes. Output goes to the standard `rust/wax/target/<profile>/`. (`protoc` is only needed when regenerating the committed proto sources via `rust/proto_builder`.)

## Image internals

The dockerfile:

- inherits `WAX_BOOST_ROOT=/wax_boost_root/` (set by the base image, points at the prebuilt Boost 1.83 install) and re-exports it as `BOOST_ROOT` so CMake's `find_package(Boost)` finds it
- installs `protobuf-compiler` (required by `prost-build` in `proto_builder`, which regenerates the committed proto sources)
- installs Rust via rustup with the `RUST_TOOLCHAIN` build-arg (default: `stable`)
- creates a `user` account with build-arg `USER_ID` / `GROUP_ID` so files written through the bind mount are owned by the host user

Build-args (with defaults):

| Arg | Default | Purpose |
|-----|---------|---------|
| `USER_NAME` | `user` | non-root user inside the container |
| `USER_ID` | `1000` | UID of that user (set to host UID for bind-mount ownership) |
| `GROUP_ID` | `1000` | GID of that user |
| `RUST_TOOLCHAIN` | `stable` | toolchain passed to `rustup` |

The image is tagged twice: `wax-rust-builder:<commit-hash>` (for the build itself) and `wax-rust-builder:devcontainer` (for use as a [VS Code dev container](https://code.visualstudio.com/docs/devcontainers/containers)).
