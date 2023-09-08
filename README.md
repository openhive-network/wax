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
sh scripts/scripts/compile_proto_ts.sh
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

Run examples:

```bash
npm run examples
```

## License
