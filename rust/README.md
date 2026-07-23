# Wax

Provides Hive Protocol features to Rust.

## Features

- Create and manipulate Hive transactions
- Sign transactions using pluggable signature providers (e.g. [Beekeeper](https://gitlab.syncad.com/hive/beekeeper))
- Broadcast transactions to the Hive network
- Extendable typed JSON-RPC and REST API surfaces via the `#[hive_api]` attribute
- Request/response interceptors around every chain HTTP call
- Asset (HIVE / HBD / VESTS) conversions, key derivation and manabar math
- High-level operation builders (blog posts / replies, recurrent transfers, witness properties, hive-apps `custom_json`s, …)

## Crates

| Path | Crate | Purpose |
|------|-------|---------|
| [`wax/`](wax/README.md) | `hiveio-wax` | The library itself: offline transaction building, signing and validation (`create_wax_foundation`) plus the online chain layer (`create_hive_chain`). |
| `wax_macros/` | `hiveio-wax-macros` | Proc-macro companion providing `#[hive_api]`. Re-exported by `hiveio-wax` — don't depend on it directly. |
| [`signers/beekeeper/`](signers/beekeeper/README.md) | `hiveio-wax-signers-beekeeper` | Bridges a Beekeeper wallet to wax's `SignatureProvider` trait. |
| [`docker/`](docker/README.md) | — | Container recipe for building against the canonical CI environment. |

The crate names are reserved on crates.io but not yet published — depend on
the packages by path (or git) for now. `crates/hiveio-beekeeper/` is a
gitignored copy of the packaged `hiveio-beekeeper` crate used only by the test
suites (see [Prerequisites](#prerequisites)).

## Getting started

### Prerequisites

The `hive` git submodule must be initialized — the native part of `wax` is
built from `../hive`:

```bash
git submodule update --init --recursive
```

The `hiveio-beekeeper` test dependency is downloaded, not a submodule:

```bash
./fetch_beekeeper.sh
```

Cargo resolves this path dev-dependency on **every** cargo command (including
plain `cargo build`), so run the fetch once per checkout — `build.sh` and
`test.sh` do it automatically. By default it resolves and installs the newest
package published in the beekeeper registry (set `BEEKEEPER_VERSION` to pin a
specific build); idempotent, and if the registry is unreachable an
already-installed copy is kept. The crate ships a prebuilt
x86_64-unknown-linux-gnu bundle, so host flows on other targets fail at link
time.

### Building

From `rust/`:

```bash
./build.sh           # debug build inside docker
./build.sh release   # release build inside docker
```

`build.sh` builds the `wax-rust-builder` image, mounts the repository and runs
the whole build pipeline inside the container; artifacts land under
`rust/wax/target/docker/<profile>/` on the host. On a fresh machine this is
the simplest path — no C++ dependencies needed on the host. See
[`docker/README.md`](docker/README.md) for details.

To iterate directly on the host instead, install the C++ build dependencies
(Boost ≥ 1.74, OpenSSL, CMake, a C++17 compiler) and a stable Rust toolchain
(edition 2024), then from `rust/wax/`:

```bash
./prelink_bundle.sh   # builds the C++ side and installs lib/libwax_native.a
cargo build           # links the bundle; no C++ rebuild
```

The prelink step is needed once per checkout and again after C++ / `hive`
submodule changes; every plain `cargo` command just links the installed
bundle. See [`wax/README.md`](wax/README.md) for how the build is put
together (protobuf generation, the prelinked native bundle).

### Basic usage

```rust
use wax::prelude::*;

fn main() -> Result<(), WaxError> {
    let wax = create_wax_foundation(None);

    // Creates a representation of 5 HIVE coins in NAI form
    println!("{:?}", wax.hive_coins(5)?);

    Ok(())
}
```

## Examples

### Create a transaction from API data

```rust
use wax::prelude::*;

let wax = create_wax_foundation(None);

let tx = wax.create_transaction_from_json(r#"{
  "ref_block_num": 19260,
  "ref_block_prefix": 2140466769,
  "expiration": "2016-09-15T19:47:33",
  "operations": [ {
    "value": {
      "voter": "taoteh1221",
      "author": "ozchartart",
      "permlink": "usdsteem-btc-daily-poloniex-bittrex-technical-analysis-market-report-update-46-glass-half-full-but-the-bottle-s-left-empty-sept",
      "weight": 10000
    },
    "type": "vote_operation"
  } ],
  "extensions": []
}"#)?;

println!("{}", tx.id()?); // "8e78947614be92e77f7db82237e523bdbd7a907b"
```

### Add hive apps operations to a transaction

```rust
use wax::hive_apps_operations::HiveAppsOperation;
use wax::hive_apps_operations::follow::FollowOperation;
use wax::prelude::*;

let wax = create_wax_foundation(None);

let mut tx = wax.create_transaction_with_tapos(
    "04c507a8c7fe5be96be64ce7c86855e1806cbde3",
    "2023-11-09T21:51:27",
)?;

let follow = FollowOperation::new()
    .follow_blog("initminer", vec!["gtg".into()])?
    .authorize(vec!["initminer".into()], vec![])?;
tx.push_complex_operation(&wax, follow)?;

println!("{}", tx.to_api()?); // Print the transaction in the API form
```

### Create, sign and broadcast a transaction

```rust
use beekeeper::{api::BeekeeperApi, options::BeekeeperOptions};
use wax::prelude::*;
use wax_signers_beekeeper::prelude::*;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let chain = create_hive_chain(None)?;

    // Initialize the wallet
    let bk = BeekeeperApi::new(BeekeeperOptions::new("./storage").in_memory(true));
    let session = bk.create_session()?;
    let mut wallet = session.create_wallet("w0", "password")?.wallet;
    let public_key = wallet.import_key("5JkFnXrLM2ap9t3AmAxBJvQHF7xSKtnTrCTginQCkhzU5S7ecPT")?;

    // Create a transaction anchored to the current head block
    let mut tx = chain.create_transaction(None).await?;

    // Add operations and validate
    tx.push_operation(chain.create_operation(Value::VoteOperation(Vote {
        voter: "otom".into(),
        author: "c0ff33a".into(),
        permlink: "ewxhnjbj".into(),
        weight: 2200,
    })));
    tx.validate()?;

    // Sign the transaction
    let provider = BeekeeperSignatureProvider::new(wallet);
    tx.sign(&provider, &public_key)?;

    // Broadcast (an online transaction additionally runs its on-chain
    // verification first)
    chain.broadcast(&tx).await?;

    Ok(())
}
```

### Calculate user manabar regeneration time

```rust
use wax::prelude::*;

let chain = create_hive_chain(None)?;

let mana_time = chain
    .calculate_manabar_full_regeneration_time_for_account("initminer", EManabarType::Upvote)
    .await?;

println!("{mana_time}"); // Hive timestamp
```

### Extend the API surface and call custom endpoints

The `#[hive_api]` attribute turns an idiomatic trait declaration into a typed
API surface for `chain.extend()` — the Rust analog of TS `extend<YourApi>()`:

```rust
use wax::prelude::*;

/// Condenser plugin surface not shipped in the default API set.
#[hive_api]
pub trait CondenserApi {
    /// Returns the number of accounts on the chain.
    async fn get_account_count(params: Vec<String>) -> u64;
}

let chain = create_hive_chain(None)?;
let api = chain.extend::<CondenserApi>();

let count = api.get_account_count(vec![]).await?;
```

With `#[hive_api(rest)]` the trait declares a REST surface for
`chain.extend_rest()` instead; `{placeholders}` in the verb attribute's path
template are substituted from the params at call time:

```rust
use wax::api::{ApiBlock, GetBlockRequest};
use wax::prelude::*;

#[hive_api(rest, namespace = "hafah_api")]
pub trait HafahApi {
    /// Fetches a block by number; `{block_num}` is filled from `params`.
    #[get("/hafah-api/blocks/{block_num}")]
    async fn get_block(params: GetBlockRequest) -> ApiBlock;
}

let chain = create_hive_chain(None)?;
let api = chain.extend_rest::<HafahApi>();

let block = api.get_block(GetBlockRequest { block_num: 5_000_000 }).await?;
```

See the `#[hive_api]` docs (`wax::hive_api`) for composing namespaces into
structs, the default surface (`chain.api()`), per-namespace endpoint overrides
and health-checker probes.

### Intercept API requests and responses

The online chain layer supports an optional request/response callback pair
(the Rust port of the TS `requestInterceptor` / `responseInterceptor` pair
installed via `chain.withProxy`), run around every HTTP request the chain
makes — JSON-RPC, REST, and health-check probes alike. Typical uses:
auth-header injection, logging/metrics, request tagging and decoded-response
transformation:

```rust
use wax::{HiveChainOptions, create_hive_chain};

let chain = create_hive_chain(
    HiveChainOptions::default()
        .with_request_interceptor(|mut data| {
            // `extra_headers` is a Rust extension: TS interceptors cannot
            // add arbitrary headers (only modeled fields).
            data.options
                .extra_headers
                .push(("authorization".into(), "Bearer s3cr3t".into()));
            println!(
                "[wax] {:?} {} {}",
                data.caller, data.options.method, data.options.endpoint
            );

            Ok(data.options)
        })
        .with_response_interceptor(|data, request| {
            println!("[wax] {:?} <- status {:?}", request.caller, data.status);

            Ok(data)
        }),
)?;
```

Sharing state with a callback is the usual `Arc` clone-and-`move` dance; the
`wax::capture!` macro does exactly that expansion:

```rust
use std::sync::{Arc, Mutex};

use wax::capture;

let seen = Arc::new(Mutex::new(None));

let options = HiveChainOptions::default().with_request_interceptor(
    capture!([seen] |data| {
        *seen.lock().unwrap() = data.options.wax_api_caller.clone();

        Ok(data.options)
    }),
);
```

Callbacks are sync and observe/transform only — a callback returning `Err`
fails the call with `RequestError::Interceptor`. See the
`wax/src/chain/interceptor.rs` module docs for the full TS mapping and design
notes.

## Signers

Transaction signing goes through wax's `SignatureProvider` trait, so wallets
plug in as separate crates:

- [`hiveio-wax-signers-beekeeper`](signers/beekeeper/README.md) — Beekeeper
  wallet integration (encrypted key storage, digest signing, memo
  encryption/decryption)

## Tests

From `rust/`:

```bash
./test.sh            # runs the offline `detailed` suite inside docker
./test.sh --test transaction   # forward any cargo test args
```

Or directly on the host (after [building](#building)), from `rust/wax/`:

```bash
cargo test --test detailed   # offline TS-parity suite
cargo test                   # all suites — live_api hits public Hive nodes
```

## License

MIT — see [LICENSE.md](../LICENSE.md).
