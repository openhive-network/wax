# wax

The Rust API of the Wax library. This is the package downstream users depend
on. It provides:

- **Offline** Hive protocol features — building, parsing, validating,
  serializing, and signing transactions and operations, plus asset / manabar /
  key math — with an ergonomic, object-safe trait surface.
- **Online** chain-bound features — endpoint management, JSON-RPC transport,
  and chain-dependent transaction checks.
- An internal **core bridge** to the Hive C++ protocol code
  (`hive/libraries/{protocol,fc}`) via [`cxx`](https://cxx.rs), compiled
  through CMake by the build script, together with the protobuf types
  generated from `hive/libraries/protocol/proto/`.

> **Status:** the online surface is being defined first; some operations are
> stubbed with `todo!` pending implementation. Expect the API to grow
> (`broadcast`, further online helpers) in later phases.

## Responsibility

- Expose a stable, idiomatic Rust API and hide the unsafe FFI types behind
  concrete wrapper types (`WaxFoundation`, `HiveChain`, `Transaction`,
  `OnlineTransaction`, `Operation`, ...).
- Build transactions from protobuf, API-form JSON, proto-form JSON, or legacy
  JSON; push operations and high-level operation builders.
- Produce signing digests and transaction ids (HF26 and legacy), serialize to
  binary / API / legacy forms, and expose a binary "view" AST.
- Compute required authorities, collect/minimize signing keys, and run
  signing + memo encryption/decryption through a pluggable wallet abstraction.
- Offer asset conversions (HIVE/HBD/VESTS, HP, collateral, interest, APR),
  manabar calculations, account-name validation, and key derivation helpers.
- Layer chain-bound behavior on top of `WaxFoundation` via the `HiveChain`
  trait (which has `WaxFoundation` as a supertrait, so a chain can be used
  anywhere a foundation is expected); manage JSON-RPC and REST endpoint URLs
  at runtime; carry a pooled `reqwest` HTTP client; provide chain-dependent
  transaction checks via `OnlineTransaction` (private-key leak detection,
  account existence checks, authority-verification trace generation).

## API

Entry points:

```rust
use wax::{create_wax_foundation, create_hive_chain, WaxChainOptions};

// Offline: transaction building, signing, validation.
let foundation = create_wax_foundation(None);           // default options
let tx = foundation.create_transaction_with_tapos(block_id, "+1m")?;

// Online: chain-bound operations.
let chain = create_hive_chain(WaxChainOptions::default())?;
chain.set_endpoint_url("https://api.hive.blog")?;
```

Offline exports (from the crate root):

| Item | Description |
|------|-------------|
| `create_wax_foundation` | Factory returning a `WaxFoundation`. |
| `WaxFoundation` | The offline API surface: asset math, manabar math, key derivation, transaction/operation factories, witness-prop serialization, impacted-accounts, private-key leak scanning, config, … |
| `Transaction` | Concrete offline transaction: push ops/builders (`&mut self`), sign, set expiration, digests/ids, binary & API serialization, authority/signing-key queries, memo encrypt/decrypt. |
| `Operation` | Single operation: proto access, validation, impacted accounts. |
| `OperationBuilder` | Finalizes high-level builders into `proto::Operation`s. |
| `SignatureProvider` | Pluggable wallet: digest signing and memo data encrypt/decrypt. |
| `AuthorityDataProvider` | Supplies account authorities / witness keys for signing-key collection. |
| `Manabar`, `ManabarData` | Manabar value/percentage results. |
| `WaxOptions` | Foundation construction options (e.g. chain id). |
| `WaxError` | Error enum (asset, authority, validation, FFI, … variants). |
| `proto` | Generated protobuf types (`proto::Transaction`, `proto::Operation`, `proto::Asset`, …) plus their serde impls. |
| `transaction_to_canonical_json` | Canonical-JSON serialization of a transaction. |

Online exports (from the crate root):

| Item | Description |
|------|-------------|
| `create_hive_chain` | Factory returning a `HiveChain`. Synchronous (unlike the async TS `createHiveChain`). |
| `HiveChain` | Online API surface; derefs to `WaxFoundation`. JSON-RPC and REST endpoint get/set, transport handles, the default typed API surface (`api`), the `extend` / `extend_rest` typed-API constructors and the `create_transaction` online-transaction factory. |
| `OnlineTransaction` | `Transaction` composed with a chain binding, returned by `create_transaction`. Mirrors the full offline surface and adds the chain-dependent checks: `perform_on_chain_verification` (private-key leak detection, account existence), `generate_authority_verification_trace`. |
| `WaxChainOptions` | Construction options: `chain_id`, `api_endpoint`, `rest_api_endpoint`, `api_timeout_ms`, optional caller tag. |
| `WaxChainError` | Error enum: HTTP, JSON-RPC envelope, deserialization, endpoint-parse, and wrapped `WaxError`. |
| Authority-trace types | `AuthorityTrace`, `AuthorityPathTraceData`, `AuthorityPathEntry`, `AuthorityTraceSignatureInfo`, `AuthorityEntryProcessingStatus`, `ProcessedEntry`, `AuthorityRole` — the structured output of authority verification. |
| Healthchecker types | `HiveEndpoint`, `EndpointInfo`, `ChainApiType`, `HealthCheckerError`, … — endpoint health tracking. |

Modules:

| Module | Contents |
|--------|----------|
| `models` | Public data types: `basic` (account-name/key/hex aliases), `asset` (`NaiAsset`, `AssetAmount`, `AssetName`, conversions), `authority` (`Authorities`, `RequiredAuthorities`, `AccountAuthorityInfo`), `enums`. |
| `result` | Result/DTO types returned by the foundation: `Assets`, `ChainConfig`, `JsonPrice`, `RefBlockData`, `BrainKeyData`, `BinaryViewOutputData`, `MinimizeRequiredSignaturesData`, `WitnessSetPropertiesProps`, … |
| `complex_operations` | High-level operation builders: comments (`BlogPostOperation`, `ReplyOperation`), `DefineRecurrentTransferOperation`, `UpdateProposalOperation`, `WitnessSetPropertiesOperation`, … |
| `hive_apps_operations` | App-layer (`custom_json`) operation builders: `community`, `follow`, `rc` (`ResourceCreditsOperation`), and the `HiveAppsOperation` factory base. |
| `constants` | Chain ids (`MAINNET_CHAIN_ID`, `DEFAULT_CHAIN_ID`), `HIVE_TIME_FORMAT`, percent precision. |

## Internal structure

| Module | Contents |
|--------|----------|
| `base` (private) | The offline API implementation: `WaxFoundation`, transaction/operation wrappers, `models`, `result`, `complex_operations`, `hive_apps_operations`, `constants`. Its public items are re-exported at the crate root. |
| `core` (`#[doc(hidden)]`) | The low-level C++ bridge: the `cxx::bridge` in `src/core.rs` declares the shared structs and the `rust_protocol` C++ handle whose methods implement transaction/operation serialization, signing digests, asset math, manabar math, key derivation, witness-prop packing, authority tracing, etc. Wrappers: `RustTransaction`, `RustOperation`, `RustAsset`, `RustManagedObject`, `AuthorityProvider`/`RustAuthorityProvider`, `descriptor_pool`. Hidden from docs; exercised directly by the `tests/core_*.rs` suites. |
| `chain` (private) | The online layer implementation: endpoint healthchecker, JSON-RPC client, `HiveChain`. Its public types are re-exported at the crate root. |

The build script (`build.rs`) does three things:

1. **Protobuf codegen** — compiles `hive/libraries/protocol/proto/*.proto`
   with `prost-build` (types + `FileDescriptorSet`) and `pbjson-build` (serde
   impls) into `OUT_DIR`, where `src/core.rs` pulls them in via `include!`.
   Requires `protoc` on the PATH.
2. **C++ build** — invokes CMake (`CMakeLists.txt`) to compile the hived
   protocol + fc libraries and links the resulting archives. It honors
   `OPENSSL_ROOT_DIR`, `OPENSSL_INCLUDE_DIR`, and `BOOST_ROOT` for locating
   system dependencies.
3. **cxx bridge** — generates and compiles the FFI glue
   (`src/core/cpp/rust_protocol.cpp`, headers under `inc/`).

## Building & testing

```bash
cargo build -p wax    # protobuf codegen + CMake C++ build on first run
cargo test  -p wax
```

See the workspace [README](../README.md) and [docker/README.md](../docker/README.md)
for prerequisites and the recommended containerized build.
