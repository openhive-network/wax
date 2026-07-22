# hiveio-wax-signers-beekeeper

Wax signer library extending transaction signing possibilities by
[Beekeeper](https://gitlab.syncad.com/hive/beekeeper), the Hive wallet
component — the Rust counterpart of the TS `@hiveio/wax-signers-beekeeper`
package.

Bridges a Beekeeper `UnlockedWallet` to wax's `SignatureProvider` trait, so a
Beekeeper-managed key can sign transaction digests and encrypt/decrypt memo
data.

## Example usage

```rust
use beekeeper::{api::BeekeeperApi, options::BeekeeperOptions};
use wax::prelude::*;
use wax_signers_beekeeper::BeekeeperSignatureProvider;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let chain = create_hive_chain(None)?;

    // Open a Beekeeper wallet and import the signing key
    let bk = BeekeeperApi::new(BeekeeperOptions::new("./storage"));
    let session = bk.create_session()?;
    let mut wallet = session.create_wallet("my-wallet", "password")?.wallet;
    let public_key = wallet.import_key("5J...wif...")?;

    // Create a transaction using the Wax Hive chain instance
    let mut tx = chain.create_transaction(None).await?;

    // Perform some operations, e.g. push the vote operation:
    tx.push_operation(chain.create_operation(Value::VoteOperation(Vote {
        voter: "alice".into(),
        author: "bob".into(),
        permlink: "example-post".into(),
        weight: 10000,
    })));

    // Sign the transaction with the wallet-backed provider
    let provider = BeekeeperSignatureProvider::new(wallet);
    tx.sign(&provider, &public_key)?;

    // Broadcast the transaction
    chain.broadcast(&tx).await?;

    Ok(())
}
```

The provider also implements the memo encryption/decryption half of
`SignatureProvider`: the wallet produces the inner ciphertext and the wax
crypto-memo codec wraps/unwraps the final memo payload, mirroring the TS
`createSigner` behavior.

## Dependencies

The `hiveio-beekeeper` crate is consumed as a path dependency, extracted into
`rust/crates/hiveio-beekeeper` by [`fetch_beekeeper.sh`](../../fetch_beekeeper.sh)
(run it once before any cargo command in the workspace). It ships a prebuilt
Linux x86_64 native bundle — no beekeeper C++ is built here.

## License

MIT — see [LICENSE.md](../../../LICENSE.md).
