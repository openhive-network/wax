# Wax

Provides Hive Protocol features to Rust.

## Workspace layout

| Crate | Purpose |
|-------|---------|
| `wax` | Public Rust API (`create_wax_foundation`, …). What downstream users depend on. |
| `wax_core` | C++ bridge to `hive/libraries/{protocol,fc}` via [`cxx`](https://cxx.rs). Compiles the C++ side through CMake. |
| `proto-builder` | Generates Rust types from the protobuf definitions in `hive/libraries/protocol/proto/`. |

## Prerequisites

The `hive` git submodule must be initialized — `wax_core` builds C++ source from `../hive` and `proto_builder` reads `.proto` files from there:

```bash
git submodule update --init --recursive
```

System packages required by the C++ build (Boost, OpenSSL, CMake, a C++17 compiler, protobuf compiler). On a fresh machine, the simplest path is to use the prebuilt container described in [Building inside Docker](#building-inside-docker).

Rust toolchain: stable (edition 2024 is used).

## Building locally

From `rust/`:

```bash
./build.sh           # debug build
./build.sh release   # release build (passes --release to cargo build)
```

which runs, in order:

```bash
cargo run -p proto-builder              # regenerate proto-derived Rust sources
cargo build [--release] -p wax_core     # build C++ bridge (invokes CMake)
cargo build [--release] -p wax          # build the public crate
```

Run them individually when iterating — `wax` builds incrementally without re-running `proto-builder` or rebuilding `wax_core` if their inputs are unchanged.

## Building inside Docker

To build against the canonical CI environment (Rocky 8 / pypa base image) without installing C++ deps on the host:

```bash
./wax_core/scripts/build_wax.sh
```

This builds the `wax-rust-builder` image from `wax_core/docker/wax-rust-builder.dockerfile`, mounts the repository, and runs the build inside the container. Artifacts land under `rust/target/release/` on the host. Override the profile with `WAX_PROFILE=debug ./wax_core/scripts/build_wax.sh`.

## Tests

```bash
cargo test -p wax_core
cargo test -p wax
```
