# @hiveio/wax-signers-hbauth

Wax signer library extending transaction signing possibilities by a 3rd party Web-only extension - hb-auth

## Example usage

```ts
import { createHiveChain } from "@hiveio/wax";
import HBAuthProvider from "@hiveio/wax-signers-hb-auth";

const chain = await createHiveChain();

const provider = HBAuthProvider.for(hbAuthClient, "gtg", "posting");

// Create a transaction using the Wax Hive chain instance
const tx = await chain.createTransaction();

// Perform some operations, e.g. push the vote operation:
tx.pushOperation({
  vote: {
    voter: "alice",
    author: "bob",
    permlink: "example-post",
    weight: 10000
  }
});

// Wait for the keychain to sign the transaction
await tx.sign(provider);

// broadcast the transaction
await chain.broadcast(tx);
```

## License

See license in [LICENSE.md](LICENSE.md) file
