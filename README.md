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

All of the required TypeScript-related information is available in the [npm.ts.md](npm.ts.md) file

### Publishing a NPM package

Predefined package.json file has specified some dedicated placeholders to be replaced with actual informations before building a final form of a package and publishing it.
To replace such placeholders with actual values please use `script/bump_npm_version.sh`.

Warning: Commiting a package.json file without such placeholder definitions is disallowed. See scripts/precommit_hook.sh for placeholder verification details.

## Testing

### Python Testing

Run [examples](examples/python/README.md):

```bash
python3 ./examples/python/visitor_example.py
```

## License

See license in the [LICENSE.md](LICENSE.md) file
