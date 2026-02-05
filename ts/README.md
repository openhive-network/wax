# Wax

Provides Hive Protocol features to JavaScript

[![npm version](https://badge.fury.io/js/%40hiveio%2Fwax.svg)](https://badge.fury.io/js/%40hiveio%2Fwax)
[![CI](https://gitlab.syncad.com/hive/wax/badges/develop/pipeline.svg)](https://gitlab.syncad.com/hive/wax/-/pipelines)

---

## ✨ Features

- Create and manipulate Hive transactions
- Sign transactions using various signing providers
- Broadcast transactions to the Hive network
- Extendable API and REST API interfaces
- Custom formatters for data output
- Calculate user manabar regeneration time
- Compatible with various frameworks and bundlers

---

## 📖 High-level Documentation

You can find the high-level documentation with snippets for this library at [https://doc.openhive.network/wax/](https://doc.openhive.network/wax/)

where you can choose a version matching to this package.

Latest, usualy not yet released/developer version of documenatation can be found at [https://hive.pages.syncad.com/wax-doc](https://hive.pages.syncad.com/wax-doc)

## 🚀 Getting Started

### Installation

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/).

Before installing, [download and install Node.js](https://nodejs.org/en/download/).
Node.js 20.11 or higher is required.

Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

If you want to use development versions of our packages, set `@hiveio` scope to use our GitLab registry:

```bash
echo @hiveio:registry=https://gitlab.syncad.com/api/v4/groups/136/-/packages/npm/ >> .npmrc
npm install @hiveio/wax
```

### Basic usage

```ts
import { createWaxFoundation } from '@hiveio/wax';

const wax = await createWaxFoundation();

// Creates a representation of 5 HIVE coins in NAI format
console.log(wax.hiveCoins(5));
```

## 🏗️ Frameworks support

We currently support multiple environments / bundlers / frameworks, such as:

- [Node.js](https://nodejs.org/), see [our examples](https://gitlab.syncad.com/hive/wax/-/tree/develop/examples/ts/node-app)
- [Next.js](https://nextjs.org/) + [Webpack](https://webpack.js.org/), see [our examples](https://gitlab.syncad.com/hive/wax/-/tree/develop/examples/ts/nextjs-app)
- [Rollup](https://rollupjs.org/) - You may require to add plugin for proper WASM file dependency copying - [@web/rollup-plugin-import-meta-assets](https://www.npmjs.com/package/@web/rollup-plugin-import-meta-assets), see [example project using WASM in Workers](https://gitlab.syncad.com/hive/hb-auth)
- [React](https://react.dev/) + [Vite](https://vite.dev/), see [our examples](https://gitlab.syncad.com/hive/wax/-/tree/develop/examples/ts/react-vite)
- [Nuxt](https://nuxt.com/) ([Vite](https://vite.dev/)), see [our examples](https://gitlab.syncad.com/hive/wax/-/tree/develop/examples/ts/nuxt-app)
- [Vue](https://vuejs.org/) + [Vite](https://vite.dev/), see [our examples](https://gitlab.syncad.com/hive/wax/-/tree/develop/examples/ts/vue-vite)
- [Vue.js](https://vuejs.org/) + [Webpack](https://webpack.js.org/), see [our examples](https://gitlab.syncad.com/hive/wax/-/tree/develop/examples/ts/vue-webpack)
- [Parcel](https://parceljs.org/), see [our examples](https://gitlab.syncad.com/hive/wax/-/tree/develop/examples/ts/html). Parcel will probably require [`Buffer` polyfill](https://www.npmjs.com/package/buffer) installation
- Web "Vanilla JS" (you have to provide sourcemap in order to properly resolve our imports, simirarly as in [our tests](./wasm/__tests__/assets/test.html)) (**not recommended**)

Imports will automatically resolve to either "web" or "node.js" version based on your execution environment, which is helpful in SSR scenarios.

You can also force the usage of specific Wax version by providing proper import alias as mentioned above.

## 🧩 Extensions

### Signers

You can use various signers to sign transactions and encode/decode buffers.

Their exact usage examples and documentation can be found in their respective packages and the [high-level documentation](#-high-level-documentation):

- [`@hiveio/signers-beekeeper`](https://npmjs.com/package/@hiveio/wax-signers-beekeeper) - Beekeeper in-browser wallet integration
- [`@hiveio/signers-hb-auth`](https://npmjs.com/package/@hiveio/wax-signers-hb-auth) - Hb-auth service worker signer integration
- [`@hiveio/signers-metamask`](https://npmjs.com/package/@hiveio/wax-signers-metamask) - MetaMask Hive Wallet integration
- [`@hiveio/signers-keychain`](https://npmjs.com/package/@hiveio/wax-signers-keychain) - Keychain Web3 wallet browser extension integration
- [`@hiveio/signers-peakvault`](https://npmjs.com/package/@hiveio/wax-signers-peakvault) - PeakVault Web3 wallet browser extension integration

### API definitions

Having all the API definitions in the main package would bloat the package size significantly and would cause a headache to maintain with every API change.

That's why we have split the API definitions into separate packages, so you can install only the ones you need. You can also extend the API definitions by yourself or generate the new ones using our [API definition generator](https://npmjs.com/package/@hiveio/wax-spec-generator) according to your needs. All of this is explained in the [high-level documentation](#-high-level-documentation).

Currently available API definitions:

- [`@hiveio/wax-api-jsonrpc`](https://npmjs.com/package/@hiveio/wax-api-jsonrpc) - Full JSON-RPC API hived node definitions
- [`@hiveio/wax-api-hafbe`](https://npmjs.com/package/@hiveio/wax-api-hafbe) - Full Block Explorer REST API definitions
- [`@hiveio/wax-api-reputation-tracker`](https://npmjs.com/package/@hiveio/wax-api-reputation-tracker) - Full Reputation Tracker REST API definitions
- [`@hiveio/wax-api-balance-tracker`](https://npmjs.com/package/@hiveio/wax-api-balance-tracker) - Full Balance Tracker REST API definitions
- [`@hiveio/wax-api-hafah`](https://npmjs.com/package/@hiveio/wax-api-hafah) - Full Account History REST API definitions

---

## 📚 Examples

### Wax foundation

#### Create a Transaction instance from api data

```js
import { createWaxFoundation } from '@hiveio/wax';

const wax = await createWaxFoundation();

const transaction = wax.createTransactionFromJson(`{
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

#### Add custom hive apps operations to the Transaction

```ts
import { createWaxFoundation, FollowOperation } from '@hiveio/wax';

const wax = await createWaxFoundation();

const tx = wax.createTransactionWithTaPoS('04c507a8c7fe5be96be64ce7c86855e1806cbde3', '2023-11-09T21:51:27');

tx.pushOperation(new FollowOperation().followBlog("initminer", "gtg").authorize("intiminer"));

console.info(tx.toApi()); // Print the transaction in the API form
```

### Wax chain interface

#### Create a signed transaction

```js
import { createHiveChain } from '@hiveio/wax';
import beekeeperFactory from '@hiveio/beekeeper';
const bk = await beekeeperFactory();
const chain = await createHiveChain();

// Initialize the wallet
const session = bk.createSession("salt");
const { wallet } = await session.createWallet("w0");
const publicKey = await wallet.importKey('5JkFnXrLM2ap9t3AmAxBJvQHF7xSKtnTrCTginQCkhzU5S7ecPT');

// Create transaction
const tx = await chain.createTransaction();

// Add operations and validate
tx.pushOperation({
  vote: {
    voter: "otom",
    author: "c0ff33a",
    permlink: "ewxhnjbj",
    weight: 2200
  }
}).validate();

// Build and sign the transaction object
const stx = tx.sign(wallet, publicKey);
// show preformatted signed transaction
console.info(chain.waxify`${stx}`);
```

#### Create a transaction and broadcast it using network_broadcast_api

```js
import { createHiveChain } from '@hiveio/wax';
import beekeeperFactory from '@hiveio/beekeeper';
const bk = await beekeeperFactory();
const chain = await createHiveChain();

// Initialize the wallet
const session = bk.createSession("salt");
const { wallet } = await session.createWallet("w0");
const publicKey = await wallet.importKey('5JkFnXrLM2ap9t3AmAxBJvQHF7xSKtnTrCTginQCkhzU5S7ecPT');

// Create transaction
const tx = await chain.createTransaction();

// Add operations
tx.pushOperation({
  vote: {
    voter: "otom",
    author: "c0ff33a",
    permlink: "ewxhnjbj",
    weight: 2200
  }
}).sign(wallet, publicKey);

// Broadcast
await chain.broadcast(tx);
```

#### Use custom formatters to output data in specified format

```ts
import { createHiveChain, IWaxBaseInterface, IFormatFunctionArguments, WaxFormattable } from '@hiveio/wax';
const chain = await createHiveChain();

const data = {
  myCustomProp: 12542
};

class MyFormatters { // Define custom formatters class
  // This line is optional, you can omit providing the constructor and default contstructor will be used instead
  // It is to show that you can gain access to the wax interface easily inside the formatters
  public constructor( private readonly wax: IWaxBaseInterface ) {}

  @WaxFormattable() // Match this method as `myCustomProp` custom formatter
  public myCustomProp({ source }: IFormatFunctionArguments<typeof data>): string | void {
    if(Math.random() > 0.5) // Happy debugging :)
      return; // No replacement will take place here - that's reason why return type is defined as string and void union

    console.info(`You are using wax version: ${this.wax.getVersion()}`);

    return source.myCustomProp.toString(); // return string
  }
}

const formatter = chain.formatter.extend(MyFormatters); // Creates and returns new extended formatter object

console.info(formatter.waxify`${data}`); // Print formatted data
```

#### Calculate user manabar regeneration time

```ts
import { createHiveChain } from '@hiveio/wax';
const chain = await createHiveChain();

const manaTime = await chain.calculateManabarFullRegenerationTimeForAccount("initminer");

console.info(manaTime); // Date
```

#### Extend API interface using interfaces only and call custom endpoints

In this example we will extend the base Wax endpoints without creating any validators.
The goal is to extend the API interface using TypeScript interfaces-only in order to also use the [transaction_status_api.find_transaction](https://developers.hive.io/apidefinitions/#transaction_status_api.find_transaction) API:

```ts
import { createHiveChain, TWaxApiRequest, TWaxExtended } from '@hiveio/wax';
const chain = await createHiveChain();

// https://developers.hive.io/apidefinitions/#transaction_status_api.find_transaction-parameter_json
// Create a request interface without validators - this will be the input from the end user
interface IFindTransactionRequest {
  transaction_id: string;
  expiration: string;
}

// https://developers.hive.io/apidefinitions/#transaction_status_api.find_transaction-expected_response_json
// Create a response interface without validators - this will be the output from the remote API
interface IFindTransactionResponse {
  status: 'unknown' | string;
}

// Create the proper API structure
type TExtendedApi = {
  transaction_status_api: { // API
    find_transaction: TWaxApiRequest<IFindTransactionRequest, IFindTransactionResponse> // Method
  }
};

const extended = chain.extend<TExtendedApi>();

// Call the transaction_status_api API using our extended interface
const result = await extended.api.transaction_status_api.find_transaction({
  transaction_id: "0000000000000000000000000000000000000000",
  expiration: "2016-03-24T18:00:21"
});

console.info(result); // { status: 'unknown' }
```

#### Extend REST API interface using interfaces only and call custom endpoints

In this example we will extend the REST API Wax endpoints without creating any validators.
The goal is to extend the REST API interface using TypeScript interfaces-only in order to also use the [hafah_endpoints.get_transaction](https://api.syncad.com/?urls.primaryName=HAfAH#/Transactions/hafah_endpoints.get_transaction) API:

```ts
import { createHiveChain, TWaxRestExtended } from '@hiveio/wax';
const chain = await createHiveChain();

interface ITransactionByIdRequest {
  transactionId: string;
}

// Create the proper API structure
type TExtendedRestApi = {
  'hafah-api': {
    transactions: {
      byId: {
        params: TransactionByIdRequest;
        result: number; // we can use standard `number` type now, as it can be passed as value in this context
      }
    }
  }
};

const extended: TWaxRestExtended<TExtendedRestApi> = chain.extendRest({
  'hafah-api': {
    transactions: {
      byId: {
        urlPath: "{transactionId}" // We have to pass urlPath as value here
      }
    }
  }
});

// Call the REST API using our extended interface
const result = await await extended.restApi['hafah-api'].transactions.byId({ transactionId: "954f6de36e6715d128fa8eb5a053fc254b05ded0" });

console.info(result); // URL response from "https://api.syncad.com/hafah-api/transactions/954f6de36e6715d128fa8eb5a053fc254b05ded0"
```

## 📖 API Reference

See official API documentation at [official WIKI](https://doc.openhive.network/wax/) where you can choose a version and next wiki documentation to browse.

See latest, not yet released API documentation at [project WIKI](${GEN_DOC_URL})

## 🛠️ Development and Testing

### Publishing an NPM package

Predefined package.json file has specified some dedicated placeholders to be replaced with actual informations before building a final form of a package and publishing it.
Best to use CI build procedure to build package, which replace such placeholders with actual values [`see npm_generate_version.sh`](https://gitlab.syncad.com/hive/common-ci-configuration/-/blob/develop/scripts/bash/npm-helpers/npm_generate_version.sh).

You will also need this file to specify the scope for bumping the `@hiveio` developer versions of our packages

Warning: Commiting a package.json file without such placeholder definitions is disallowed. See [`scripts/precommit_hook.sh`](scripts/precommit_hook.sh) for placeholder verification details.

### Support and tests

Tested on the latest Chromium

[Automated CI test](https://gitlab.syncad.com/hive/wax/-/pipelines) runs are available.

To run the tests on your own, clone the wax repo and install the dependencies and then compile the project:

You should perform any development-related work in our devcontainers defined by the [.devcontainer](.devcontainer/devcontainer.json) file.
If you do not wish to use docker, then you will have to install project dependencies on your own:
`protobuf-compiler`, `docker.io`, `npm`, `pnpm`, `nodejs`, `jq`

After successfully setting up your environment, remember to clone the submodule and install library dependencies:

```bash
git submodule update --init --progress --depth=1 # Clone HIVE repository containing proto definitions
pnpm install
```

Then compile the source:

```bash
pnpm run build
```

Build and run tests:

```bash
pnpm run build:test
pnpm run test
```

And examples:

```bash
pnpm run examples
```

---

## 📄 License

See license in the [LICENSE.md](https://gitlab.syncad.com/hive/wax/-/blob/develop/LICENSE.md) file
