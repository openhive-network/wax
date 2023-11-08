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

```js
import { createWaxFoundation } from '@hiveio/wax';

const wax = await createWaxFoundation();

const transaction = wax.TransactionBuilder.fromApi('...');
console.log(transaction.id);
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

Then run tests:

```bash
npm run test
```

And examples:

```bash
npm run examples
```

## License

See license in the [LICENSE.md](https://gitlab.syncad.com/hive/wax/-/blob/${CommitSHA}/LICENSE.md) file
