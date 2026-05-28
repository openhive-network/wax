# Wax

Provides Hive Protocol features to Rust.

## Workspace layout

| Crate | Purpose |
|-------|---------|
| `wax` | Public Rust API (`create_wax_foundation`, …). What downstream users depend on. |
| `wax_core` | C++ bridge to `hive/libraries/{protocol,fc}` via [`cxx`](https://cxx.rs). Compiles the C++ side through CMake. |
| `proto_builder` | Generates Rust types from the protobuf definitions in `hive/libraries/protocol/proto/`. |

## Prerequisites

The `hive` git submodule must be initialized — `wax_core` builds C++ source from `../hive` and `proto_builder` reads `.proto` files from there:

```bash
git submodule update --init --recursive
```

System packages required by the C++ build (Boost, OpenSSL, CMake, a C++17 compiler, protobuf compiler). On a fresh machine, the simplest path is to use the prebuilt container described in [Building inside Docker](#building-inside-docker).

Rust toolchain: stable (edition 2024 is used).

## Building

From `rust/`:

```bash
./build.sh           # debug build inside docker
./build.sh release   # release build inside docker
```

`build.sh` builds the `wax-rust-builder` image from [`docker/wax-rust-builder.dockerfile`](docker/wax-rust-builder.dockerfile) (Rocky 8 / pypa CI base image with Rust + C++ deps), mounts the repository, and runs the build inside the container. Artifacts land under `rust/target/docker/<profile>/` on the host. See [`docker/README.md`](docker/README.md) for details (image internals, build-args, why `target/docker/` is separate from `target/`).

Inside the container the script runs, in order:

```bash
cargo run -p proto_builder              # regenerate proto-derived Rust sources
cargo build [--release] -p wax_core     # build C++ bridge (invokes CMake)
cargo build [--release] -p wax          # build the public crate
```

### Iterating without docker

If the C++ build dependencies (Boost ≥ 1.74, OpenSSL, CMake, C++17 compiler, `protoc`) and a stable Rust toolchain are installed on the host, just invoke `cargo` directly from `rust/`:

```bash
cargo run -p proto_builder
cargo build -p wax_core
cargo build -p wax
```

Output goes to the standard `rust/target/<profile>/`. `wax` builds incrementally without re-running `proto_builder` or rebuilding `wax_core` if their inputs are unchanged.

## Tests

```bash
cargo test -p wax_core
cargo test -p wax
```
