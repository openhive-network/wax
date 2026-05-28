# proto_builder

Generates the Rust types for the Hive protocol from the canonical protobuf
definitions in the `hive` submodule. It is a **build-time binary**, not a
library — nothing depends on it at compile time; it is run by hand (or by
`build.sh`) to regenerate committed sources.

## Responsibility

- Read every `*.proto` under `hive/libraries/protocol/proto/`.
- Run [`prost-build`](https://docs.rs/prost-build) to emit prost message types.
- Run [`pbjson-build`](https://docs.rs/pbjson-build) to emit
  `serde::Serialize`/`Deserialize` impls for those types, so proto messages can
  be JSON-encoded/decoded directly via `serde_json` instead of going through
  `prost-reflect` at runtime.
- Write the results into `rust/protobuf_patterns/` (a sibling of the crates),
  where they are committed and consumed by [`wax_core`](../wax_core).

Generated outputs:

| File | Produced by | Purpose |
|------|-------------|---------|
| `hive.protocol.buffers.rs` | prost-build | prost message/enum types |
| `hive.protocol.buffers.serde.rs` | pbjson-build | serde impls for the types above |
| `hive.protocol.buffers.bin` | prost-build | file-descriptor set (drives pbjson + reflection) |

## Building

```bash
cargo run -p proto_builder    # regenerate sources into rust/protobuf_patterns/
```

It takes no arguments; paths are derived relative to `CARGO_MANIFEST_DIR`. The
`hive` submodule must be initialized first (`git submodule update --init
--recursive`), and `protoc` must be on `PATH` (required by `prost-build`).

Re-run it whenever the upstream `.proto` definitions change, then commit the
regenerated files in `protobuf_patterns/`.
