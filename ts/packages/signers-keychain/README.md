# @hiveio/wax-signers-keychain

Wax signer library extending transaction signing possibilities by a 3rd party Web-only extension - Keychain

## Prerequisites

- Configured [@hiveio/wax](https://www.npmjs.com/package/@hiveio/wax) library. Wax Keychain signer is an extension the base Wax library, extending its signing possibilities by using 3rd party wallet
- Configured [Keychain browser extension](https://hive-keychain.com/) with imported keys

## Example usage

```ts
import { createHiveChain } from "@hiveio/wax";
import KeychainProvider from "@hiveio/wax-signers-keychain";

const chain = await createHiveChain();

const provider = KeychainProvider.for("myaccount", "active");

// Create a transaction using the Wax Hive chain instance
const tx = await chain.createTransaction();

// Perform some operations, e.g. push the vote operation:
tx.pushOperation({
  vote_operation: {
    voter: "alice",
    author: "bob",
    permlink: "example-post",
    weight: 10000
  }
});

// Wait for the keychain to sign the transaction
await provider.signTransaction(tx);

// broadcast the transaction
await chain.broadcast(tx);
```

## License

See license in [LICENSE.md](LICENSE.md) file
