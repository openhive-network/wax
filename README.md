# wax

An extension module to call hived cpp source code from Python and JavaScript.

## Building

You need to install protobuf compiler first:

```bash
apt install protobuf-compiler
```

### TypeScript Building

Generate `package.json`:

```bash
sh scripts/bump_npm_version.sh
```

Install dependencies:

```bash
npm i -g yarn
yarn install
```

Build WASM wax:

```bash
cd wasm && ./build_wasm_wax.sh
```

Build TypeScript files:

```bash
npm run build
```

## Testing

### TypeScript Testing

Run tests:

```bash
npm run test
```

Run [examples](examples/ts/README.md):

```bash
npm run examples
```

#### TypeScript oneliner

(pre-release documentation)

```bash
# Cleanup
rm -rf examples/ts/node_modules examples/ts/package-lock.json node_modules/ build_wasm wasm/dist wasm/lib/proto .npmrc package.json

# Run oneliner all-tester
sh scripts/bump_npm_version.sh && yarn install && pushd wasm && ./build_wasm_wax.sh; popd && npm run build && npm run test && npm run examples
```

## License
