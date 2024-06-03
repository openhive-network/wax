# wax

Provides Hive Protocol features to JavaScript

## Install

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/).

Before installing, [download and install Node.js](https://nodejs.org/en/download/).
Node.js 18 or higher is required.

Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

If you want to use development versions of our packages, set `@hiveio` scope to use our GitLab registry:

```bash
echo @hiveio:registry=https://gitlab.syncad.com/api/v4/packages/npm/ >> .npmrc
npm install @hiveio/wax
```

## Usage

Wax is designed to work in web environment by default, so remember to use:

```ts
import '@hiveio/wax/node';
```

import when you intend to work in the Node.js environment.

You may need to set `moduleResolution` to `Bundler` in your `tsconfig.json` in order to respect the `exports` fields in our `package.json` file

### Wax foundation

#### Create a TransactionBuilder instance from api data

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

#### Add custom hive apps operations to the TransactionBuilder

```ts
import { createWaxFoundation, FollowOperationBuilder } from '@hiveio/wax';

const wax = await createWaxFoundation();

const tx = new wax.TransactionBuilder('04c507a8c7fe5be96be64ce7c86855e1806cbde3', '2023-11-09T21:51:27');

tx.push(new FollowOperationBuilder().followBlog("initminer", "gtg").authorize("intiminer").store());

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
const stx = tx.build(wallet, publicKey);

console.info(chain.waxify`${stx}`);
```

#### Create a transaction and broadcast it using network_broadcast_api

```js
import { createHiveChain, BroadcastTransactionRequest } from '@hiveio/wax';
import beekeeperFactory from '@hiveio/beekeeper';
const bk = await beekeeperFactory();
const chain = await createHiveChain();

// Initialize the wallet
const session = bk.createSession("salt");
const { wallet } = await session.createWallet("w0");
const publicKey = await wallet.importKey('5JkFnXrLM2ap9t3AmAxBJvQHF7xSKtnTrCTginQCkhzU5S7ecPT');

const tx = new chain.TransactionBuilder("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

// Add operations
tx.push({
  vote: {
    voter: "otom",
    author: "c0ff33a",
    permlink: "ewxhnjbj",
    weight: 2200
  }
}).build(wallet, publicKey);

const request = new BroadcastTransactionRequest(tx);

// Transmit
await chain.api.network_broadcast_api.broadcast_transaction(request);
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

#### Extend API interface and call custom endpoints

In this example we will extend the base Wax endpoints and create our classes with validators
in order to use the [transaction_status_api.find_transaction](https://developers.hive.io/apidefinitions/#transaction_status_api.find_transaction) API:

```ts
import { IsHexadecimal, IsDateString, IsString } from 'class-validator';
import { createHiveChain, TWaxExtended } from '@hiveio/wax';
const chain = await createHiveChain();

// https://developers.hive.io/apidefinitions/#transaction_status_api.find_transaction-parameter_json
// Create a request class with validators that will require a valid input from the end user
class FindTransactionRequest {
  @IsHexadecimal()
  public transaction_id!: string;

  @IsDateString()
  public expiration!: string;
}

// https://developers.hive.io/apidefinitions/#transaction_status_api.find_transaction-expected_response_json
// Create a response class with validators that will require a valid output from the remote API
class FindTransactionResponse {
  @IsString()
  public status!: 'unknown' | string;
}

// Create the proper API structure
const ExtendedApi = {
  transaction_status_api: { // API
    find_transaction: { // Method
      params: FindTransactionRequest, // params is our request
      result: FindTransactionResponse // result is out response
    }
  }
};

const extended: TWaxExtended<typeof ExtendedApi> = chain.extend(ExtendedApi);

// Call the transaction_status_api API using our extended interface
const result = await extended.api.transaction_status_api.find_transaction({
  transaction_id: "0000000000000000000000000000000000000000",
  expiration: "2016-03-24T18:00:21"
});

console.info(result); // { status: 'unknown' }
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

## API

See API documentation at [project WIKI](${GEN_DOC_URL})

## Publishing an NPM package

Predefined package.json file has specified some dedicated placeholders to be replaced with actual informations before building a final form of a package and publishing it.
Best to use CI build procedure to build package, which replace such placeholders with actual values [`see npm_generate_version.sh`](https://gitlab.syncad.com/hive/common-ci-configuration/-/blob/develop/scripts/bash/npm-helpers/npm_generate_version.sh?ref_type=heads).

You will also need this file to specify the scope for bumping the `@hiveio` developer versions of our packages

Warning: Commiting a package.json file without such placeholder definitions is disallowed. See [`scripts/precommit_hook.sh`](scripts/precommit_hook.sh) for placeholder verification details.

## Support and tests

Tested on the latest Chromium

[Automated CI test](https://gitlab.syncad.com/hive/wax/-/pipelines) runs are available.

To run the tests on your own, clone the wax repo and install the dependencies and then compile the project:

You should perform any development-related work in our devcontainers available in the [.devcontainer](.devcontainer) directory.
If you do not wish to use docker, then you will have to install project dependencies on your own:
`protobuf-compiler`, `docker.io`, `npm`, `pnpm`, `nodejs`, `jq`

After successfully setting up your environment, remember to clone the submodule and install library dependencies:

```bash
git submodule update --init --progress --depth=1 # Clone HIVE repository containing proto definitions
pnpm install
```

Then compile the source:

```bash
npm run build
```

Build and run tests:

```bash
npm run build:test
npm run test
```

And examples:

```bash
npm run examples
```

## License

See license in the [LICENSE.md](https://gitlab.syncad.com/hive/wax/-/blob/develop/LICENSE.md?ref_type=heads) file
