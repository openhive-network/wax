import beekeeperFactory, { IBeekeeperUnlockedWallet } from '@hiveio/beekeeper';
import { createWaxFoundation } from '@hiveio/wax';
import BeekeeperSigner from '../dist';
import assert from 'node:assert/strict';

const beekeeper = await beekeeperFactory();

const session = beekeeper.createSession('my.salt');

let wallet1: IBeekeeperUnlockedWallet, wallet2: IBeekeeperUnlockedWallet;
if (session.hasWallet('w0')) {
  wallet1 = await session.openWallet('w0').unlock('password');
  wallet2 = await session.openWallet('w1').unlock('password');
} else {
  ({ wallet: wallet1 } = await session.createWallet('w0', 'password'));
  ({ wallet: wallet2 } = await session.createWallet('w1', 'password'));
}

const publicKey1 = await wallet1.importKey(
  '5JkFnXrLM2ap9t3AmAxBJvQHF7xSKtnTrCTginQCkhzU5S7ecPT'
);
const publicKey2 = await wallet2.importKey(
  '5KGKYWMXReJewfj5M29APNMqGEu173DzvHv5TeJAg9SkjUeQV78'
);

const waxBase = await createWaxFoundation();

const signer1 = BeekeeperSigner.for(waxBase, wallet1, publicKey1);
const signer2 = BeekeeperSigner.for(waxBase, wallet2, publicKey2);

const tx = waxBase.createTransactionFromJson({
  ref_block_num: 34559,
  ref_block_prefix: 1271006404,
  expiration: "2021-12-13T11:31:33",
  operations: [
    {
      type: "vote_operation",
      value: {
        voter: "otom",
        author: "c0ff33a",
        permlink: "ewxhnjbj",
        weight: 2200
      }
    }
  ],
  extensions: [],
  signatures: []
});

await signer1.signTransaction(tx);

assert.deepEqual(tx.transaction.signatures, [
  '1f936a9963b3b065e25d40d69fb93cff077e539e7e2eb383537717589830f9a4a949882a448e5ba7c48c5b016caed7260d75f6cf8a8f3adba506b7c2f3a54cba7e'
]);

const message = "This is a control message";

const encrypted = await signer1.encryptData(message, publicKey2);

const decryptedBySender1 = await signer1.decryptData(encrypted);

const decrypted = await signer2.decryptData(encrypted);

assert.equal(decryptedBySender1, message);
assert.equal(decrypted, message);

console.log("All tests passed!");
