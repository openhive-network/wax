# wax

The Rust API of the Wax library. This is the package downstream users depend
on. It provides:

- **Offline** Hive protocol features — building, parsing, validating,
  serializing, and signing transactions and operations, plus asset / manabar /
  key math — with an ergonomic, object-safe trait surface.
- **Online** chain-bound features — endpoint management, JSON-RPC/REST
  transport, typed API extension, broadcasting, and chain-dependent
  transaction checks.
- An internal **core bridge** to the Hive C++ protocol code
  (`hive/libraries/{protocol,fc}`) via [`cxx`](https://cxx.rs), shipped as a
  prelinked native bundle (`lib/libwax_native.a`), together with the protobuf
  types generated from `hive/libraries/protocol/proto/` (committed under
  `proto/`).

> **Status:** the crate mirrors the TS `@hiveio/wax` package and is still
> converging on full parity (e.g. the TS `waxify` formatters are not ported
> yet). The crates.io name is reserved; the crate is not published yet.

## API

Entry points:

```rust
use wax::{create_wax_foundation, create_hive_chain};

// Offline: transaction building, signing, validation.
let foundation = create_wax_foundation(None);           // default options
let tx = foundation.create_transaction_with_tapos(
    "04c507a8c7fe5be96be64ce7c86855e1806cbde3",
    "2023-11-09T21:51:27",
)?;

// Online: chain-bound operations.
let chain = create_hive_chain(None)?;                   // default options
chain.set_endpoint_url("https://api.hive.blog")?;
```

The most common items can be imported at once through `wax::prelude::*`. See
the [workspace README](../README.md) for usage examples (signing,
broadcasting, API extension, interceptors), and `cargo doc --open` for the
full API reference.

## Building & testing

From this directory:

```bash
./prelink_bundle.sh          # once per checkout, and after C++ / hive changes
cargo build                  # links the bundle; no C++ rebuild
cargo test --test detailed   # offline TS-parity suite
cargo test                   # all suites — live_api hits public Hive nodes
```

The prelink step needs the C++ build dependencies (Boost ≥ 1.74, OpenSSL,
CMake, a C++17 compiler) and the initialized `hive` submodule: it builds the
C++ side from source and installs the self-contained native bundle at
`lib/libwax_native.a`, which every plain `cargo` command — and the published
crate — links instead of compiling C++.

The proto-derived sources are committed under `proto/`; after a change to
`hive/libraries/protocol/proto/`, regenerate them with `cargo build` in
[`../proto_builder`](../proto_builder) (requires `protoc` on the PATH).

The beekeeper test dependency must be fetched first
(`../fetch_beekeeper.sh`, done automatically by the wrapper scripts). See
the workspace [README](../README.md) and
[docker/README.md](../docker/README.md) for prerequisites and the
recommended containerized build.
