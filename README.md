# wax

An extension module to call hived cpp source code from Python and JavaScript.

## Building

You need to install protobuf compiler first:

```bash
apt install protobuf-compiler
```

### Python Building

In order to build wax python package, one need to simply type from root project directory:

```bash
./scripts/build_wax_python.sh
```

This script will generate wheel file which will be saved in ./dist directory.

It is recomended to create python virtual env, and install wax package it there, for example:

```bash
python3 -m venv venv
source ./venv/bin/activate
```

Now in order to install wax module to python, one need to type.

```bash
python3 -m pip install ./dist/CREATED-WAX-WHEEL.whl (for example wax-0.0.0-cp310-cp310-manylinux_2_35_x86_64.whl)
```

### TypeScript Building

Generate `package.json`:

```bash
sh scripts/bump_npm_version.sh
```

Install dependencies:

(Remember that our project requires Node.js version >= 12. You can install it using your distribution binaries, compile from source or use [nvm](https://github.com/nvm-sh/nvm?tab=readme-ov-file#install--update-script))

```bash
npm i -g pnpm
pnpm install
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

### Python Testing

Run [examples](examples/python/README.md):

```bash
python3 ./examples/python/visitor_example.py
```

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
sh scripts/bump_npm_version.sh && pnpm install && ./wasm/build_wasm_wax.sh && npm run build && npm run test && npm run examples
```

## License
