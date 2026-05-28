# wax

The public Rust API of the Wax library. This is the crate downstream users
depend on. It provides **offline** Hive protocol features — building, parsing,
validating, serializing, and signing transactions and operations, plus asset /
manabar / key math — with an ergonomic, object-safe trait surface over the raw
[`wax_core`](../wax_core) bridge.

For **online** features (talking to a Hive node, broadcasting), see
[`wax_chain`](../wax_chain).

## Responsibility

- Expose a stable, idiomatic Rust API and hide the unsafe `wax_core` FFI types
  behind trait objects (`Box<dyn Transaction>`, `Box<dyn Operation>`, ...).
- Build transactions from protobuf, API-form JSON, proto-form JSON, or legacy
  JSON; push operations and high-level operation builders.
- Produce signing digests and transaction ids (HF26 and legacy), serialize to
  binary / API / legacy forms, and expose a binary "view" AST.
- Compute required authorities, collect/minimize signing keys, and run
  signing + memo encryption/decryption through a pluggable wallet abstraction.
- Offer asset conversions (HIVE/HBD/VESTS, HP, collateral, interest, APR),
  manabar calculations, account-name validation, and key derivation helpers.

## API

Entry point:

```rust
use wax::create_wax_foundation;

let foundation = create_wax_foundation(None);          // default options
let tx = foundation.create_transaction_with_tapos(block_id, "+1m")?;
```

Core exports (from the crate root):

| Item | Description |
|------|-------------|
| `create_wax_foundation` | Factory returning a `Box<dyn WaxFoundation>`. |
| `WaxFoundation` | The offline API surface: asset math, manabar math, key derivation, transaction/operation factories, witness-prop serialization, impacted-accounts, private-key leak scanning, config, … |
| `Transaction` | Object-safe transaction: push ops/builders, sign, set expiration, digests/ids, binary & API serialization, authority/signing-key queries, memo encrypt/decrypt. |
| `Operation` | Object-safe single operation: proto access, validation, impacted accounts. |
| `OperationBuilder` | Finalizes high-level builders into `proto::Operation`s. |
| `SignatureProvider` | Pluggable wallet: digest signing and memo data encrypt/decrypt. |
| `AuthorityDataProvider` | Supplies account authorities / witness keys for signing-key collection. |
| `Manabar`, `ManabarData` | Manabar value/percentage results. |
| `WaxOptions` | Foundation construction options (e.g. chain id). |
| `WaxError` | Crate-wide error enum (asset, authority, validation, FFI, … variants). |
| `proto` | Re-export of `wax_core::proto` protobuf types. |
| `transaction_to_canonical_json` | Re-export of the canonical-JSON serializer. |

Modules:

| Module | Contents |
|--------|----------|
| `models` | Public data types: `basic` (account-name/key/hex aliases), `asset` (`NaiAsset`, `AssetAmount`, `AssetName`, conversions), `authority` (`Authorities`, `RequiredAuthorities`, `AccountAuthorityInfo`), `enums`. |
| `result` | Result/DTO types returned by the foundation: `Assets`, `ChainConfig`, `JsonPrice`, `RefBlockData`, `BrainKeyData`, `BinaryViewOutputData`, `MinimizeRequiredSignaturesData`, `WitnessSetPropertiesProps`, … |
| `complex_operations` | High-level operation builders: comments (`BlogPostOperation`, `ReplyOperation`), `DefineRecurrentTransferOperation`, `UpdateProposalOperation`, `WitnessSetPropertiesOperation`, … |
| `hive_apps_operations` | App-layer (`custom_json`) operation builders: `community`, `follow`, `rc` (`ResourceCreditsOperation`), and the `HiveAppsOperation` factory base. |
| `constants` | Chain ids (`MAINNET_CHAIN_ID`, `DEFAULT_CHAIN_ID`), `HIVE_TIME_FORMAT`, percent precision. |

## Building & testing

```bash
cargo build -p wax    # builds wax_core (CMake) on first run
cargo test  -p wax
```

See the workspace [README](../README.md) for prerequisites and the Docker build.
