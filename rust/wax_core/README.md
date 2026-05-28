# wax_core

The low-level bridge between Rust and the Hive C++ protocol code. It compiles
the C++ side of `hive/libraries/{protocol,fc}` through CMake and exposes it to
Rust over a [`cxx`](https://cxx.rs) FFI bridge, alongside the generated protobuf
types.

Most users should depend on [`wax`](../wax) (the ergonomic public API) rather
than this crate directly. `wax_core` is the raw layer `wax` is built on.

## Responsibility

- **Build the C++ side.** `build.rs` invokes CMake (`CMakeLists.txt`) to compile
  the hived protocol + fc libraries and links the resulting archives. It honors
  `OPENSSL_ROOT_DIR`, `OPENSSL_INCLUDE_DIR`, and `BOOST_ROOT` for locating
  system dependencies.
- **Expose protocol primitives over FFI.** The `cxx::bridge` in `src/lib.rs`
  declares the shared structs and the `rust_protocol` C++ handle whose methods
  implement transaction/operation serialization, signing digests, asset math,
  manabar math, key derivation, witness-prop packing, authority tracing, etc.
- **Carry the generated proto types.** The `proto` module includes the
  prost + serde sources emitted by [`proto_builder`](../proto_builder) from
  `rust/protobuf_patterns/`.

## API

Re-exported from the crate root:

| Item | Description |
|------|-------------|
| `proto` | Module of generated protobuf types (`proto::Transaction`, `proto::Operation`, `proto::Asset`, `proto::Authority`, …) plus their serde impls. |
| `RustTransaction` | Owned wrapper around a C++ `hive_transaction_handle`. |
| `RustOperation` | Owned wrapper around a C++ `hive_operation_handle`. |
| `RustAsset` | Asset value/symbol helper over the C++ side. |
| `RustManagedObject` | Bridge object used to move structured data across the FFI (proto- or JSON-backed). |
| `AuthorityProvider` / `RustAuthorityProvider` | Trait + adapter for supplying account authorities to C++ (used by signing-key collection and authority tracing). |
| `transaction_to_canonical_json` | Canonical-JSON serialization of a transaction. |
| `EncryptionIndex` | Marker for memo/operation encryption ranges. |
| `descriptor_pool` | Proto descriptor pool used for reflection. |
| `ffi::*` | The raw cxx bridge: `rust_protocol`, `new_rust_protocol`, the `hive_*_handle` types, and the shared structs (`RustJsonAsset`, `RustBinaryData`, `RustRequiredAuthorities`, `RustAuthVerificationTrace`, `RustWitnessSetPropertiesData`, …). |

## Building & testing

```bash
cargo build -p wax_core    # runs CMake; needs Boost, OpenSSL, CMake, a C++17 compiler
cargo test  -p wax_core
```

See the workspace [README](../README.md) and [docker/README.md](../docker/README.md)
for the full toolchain and the recommended containerized build.
