# wax

Provides Hive Protocol features to JavaScript

## Install

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/).

Before installing, [download and install Node.js](https://nodejs.org/en/download/).
Node.js 12 or higher is required.

Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```bash
npm install @hiveio/wax
```

## Usage

#### Simple wax foundation usage

```js
import { createWaxFoundation } from '@hiveio/wax';

const wax = await createWaxFoundation();

const transaction = wax.TransactionBuilder.fromApi(`{
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
}`);
console.info(transaction.id); // "8e78947614be92e77f7db82237e523bdbd7a907b"
```

#### Use hive chain interface to create a signed transaction

```js
import { createHiveChain } from '@hiveio/wax';
import beekeeperFactory from '@hiveio/beekeeper';
const bk = await beekeeperFactory();
const chain = await createHiveChain();

// Initialize the wallet
const session = bk.createSession("salt");
const { wallet } = await session.createWallet("w0");
await wallet.importKey('5JkFnXrLM2ap9t3AmAxBJvQHF7xSKtnTrCTginQCkhzU5S7ecPT');

// Create transaction
const tx = await chain.getTransactionBuilder();

// Add operations and validate
tx.push({
  vote: {
    voter: "otom",
    author: "c0ff33a",
    permlink: "ewxhnjbj",
    weight: 2200
  }
}).validate();

// Build and sign the transaction object
const stx = tx.build(wallet, "5RqVBAVNp5ufMCetQtvLGLJo7unX9nyCBMMrTXRWQ9i1Zzzizh");

console.info(chain.waxify`${stx}`);
```

#### Use hive chain interface and custom formatters to output data in specified format

```ts
import { createHiveChain, IFormatFunctionArguments, WaxFormattable } from '@hiveio/wax';
const chain = await createHiveChain();

const data = {
  myCustomProp: 12542
};

class MyFormatters { // Define custom formatters class
  @WaxFormattable() // Match this method as `myCustomProp` custom formatter
  myCustomProp({ source }: IFormatFunctionArguments<typeof data>) {
    return source.myCustomProp.toString();
  }
}

const formatter = chain.formatter.extend(MyFormatters); // Creates and returns new extended formatter object

console.info(formatter.waxify`${data}`); // Print formatted data
```

#### Use hive TransactionBuilder interface with custom hive apps operations

```ts
import { createWaxFoundation, FollowOperationBuilder } from '@hiveio/wax';

const wax = await createWaxFoundation();

const tx = new wax.TransactionBuilder('04c507a8c7fe5be96be64ce7c86855e1806cbde3', '2023-11-09T21:51:27');

tx.push(new FollowOperationBuilder().followBlog("initminer", "gtg").authorize("intiminer").build());

console.info(tx.toApi()); // Print the transaction in the API form
```

#### Use hive chain interface to create a transaction and broadcast it using network_broadcast_api

```js
import { createHiveChain, BroadcastTransactionRequest } from '@hiveio/wax';
import beekeeperFactory from '@hiveio/beekeeper';
const bk = await beekeeperFactory();
const chain = await createHiveChain();

// Initialize the wallet
const session = bk.createSession("salt");
const { wallet } = await session.createWallet("w0");
await wallet.importKey('5JkFnXrLM2ap9t3AmAxBJvQHF7xSKtnTrCTginQCkhzU5S7ecPT');

const tx = new chain.TransactionBuilder("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

// Add operations
tx.push({
  vote: {
    voter: "otom",
    author: "c0ff33a",
    permlink: "ewxhnjbj",
    weight: 2200
  }
}).build(wallet, "5RqVBAVNp5ufMCetQtvLGLJo7unX9nyCBMMrTXRWQ9i1Zzzizh");

const request = new BroadcastTransactionRequest(tx);

// Transmit
await chain.api.network_broadcast_api.broadcast_transaction(request);
```

#### Calculate user manabar regeneration time

```ts
import { createHiveChain } from '@hiveio/wax';
const chain = await createHiveChain();

const manaTime = await chain.calculateManabarFullRegenerationTimeForAccount("initminer");

console.info(manaTime); // Date
```

#### Advanced usage - extend hive chain interface and call custom API endpoints

```ts
import { createHiveChain, TWaxExtended } from '@hiveio/wax';
const chain = await createHiveChain();

class MyRequest {
  method!: string;
}
class MyResponse {
  args!: {};
  ret!: [];
}

const MyData = {
  jsonrpc: {
    get_signature: {
      params: MyRequest,
      result: MyResponse
    }
  }
};

const extended: TWaxExtended<typeof MyData> = chain.extend(MyData);

const result = await extended.api.jsonrpc.get_signature({ method: "jsonrpc.get_methods" });

console.info(result); // { args: {}, ret: [] }
```

## API

See API definition in [api.md](https://gitlab.syncad.com/hive/wax/-/blob/${CommitSHA}/api.md)

## Support and tests

Tested on the latest Chromium (v117)

[Automated CI test](https://gitlab.syncad.com/hive/wax/-/pipelines) runs are available.

To run the tests on your own, clone the Wax repo and install the dependencies and then compile the project:

```bash
./wasm/build_wasm_wax.sh
sudo npm install -g pnpm
pnpm install
```

Compile source:

```bash
npm run build
```

Then build and run tests:

```bash
npm run build:test
npm run test
```

And examples:

```bash
npm run examples
```

## License

See license in the [LICENSE.md](https://gitlab.syncad.com/hive/wax/-/blob/${CommitSHA}/LICENSE.md) file
