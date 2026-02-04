# wax

An extension module to call hived cpp source code from Python and JavaScript.

## Building

You need to install protobuf compiler first:

```bash
apt install protobuf-compiler
```

### Python building and instaling

First, we need to have installed `poetry`. To do that, simply type:

```bash
curl -sSL https://install.python-poetry.org | python3 - --version 2.1.3
```

#### Building

Wax uses dedicated version of boost library (it is statically built to reduce Python packages dependencies). Please use a CI base image defined here: https://gitlab.syncad.com/hive/wax/-/blob/develop/python/docker/Dockerfile.ci?ref_type=heads as your build environment.
Prebuilt image can be also retrieved from Gitlab container registry: https://gitlab.syncad.com/hive/wax/container_registry/556

In order to build wax python package, one need to simply type from root project directory:

```bash
./python/wax/scripts/build_wax.sh
```

This script will generate wheel file using virtual environment of poetry  which will be saved in ./dist directory.

#### Instaling

It is recomended to create python virtual env, and install wax package it there, for example:

```bash
python3 -m venv venv
source ./venv/bin/activate
```

### Installation using pip

Before installing the wax module to python, set env variables to the following value:

```bash
export FIRST_INDEX="https://gitlab.syncad.com/api/v4/projects/362/packages/pypi/simple" SECOND_INDEX="https://gitlab.syncad.com/api/v4/projects/434/packages/pypi/simple" THIRD_INDEX="https://gitlab.syncad.com/api/v4/projects/198/packages/pypi/simple"
```

Now in order to install wax module to python, one need to type.

```bash
python3 -m pip install --index-url $FIRST_INDEX --extra-index-url $SECOND_INDEX --extra-index-url $THIRD_INDEX ./dist/CREATED-WAX-WHEEL.whl (for example wax-0.0.0-cp310-cp310-manylinux_2_35_x86_64.whl)
```

### Developer Installation using dedicated bash script

First, you need to export the `WAX_SKIP_BUILD` variable to `true` in order to skip building the package. 
If you did not build the package yet, you can skip this step - script will build the package for you.
```bash
export WAX_SKIP_BUILD=true
```

Then, you can install the package using dedicated script. 
Please remember about creating a virtual environment first, as described above.
```bash
./python/wax/scripts/install_wax.sh
```


You can always take prebuilt PyPI package also pushed to Gitlab package registry - here is for example some `develop` related version: `0.0.3a2.dev131+bb99c4e`:
https://gitlab.syncad.com/hive/wax/-/packages/3474

Packages produced for Git protected tags will be versioned according to tag names.

#### Debugging

https://cython.readthedocs.io/en/latest/src/userguide/debugging.html#configuring-the-debugger

create venv (choose debug version of Python interpreter) e.g (assuming pwd is wax/python subdirectory containing pyproject/toml file):

```bash
poetry -C . env use python3.12d
```

then install project dependencies:

```bash
poetry -C . install --no-root
```

Build package in place:
```
WAX_DEBUG=1 python3.12d setup.py build_ext --inplace
```

Run test under debugger:
```
cygdb . -- --args python3.12d ./test_pure_tx.py
```


### TypeScript Building

All of the required TypeScript-related information is available in the [npm.ts.md](npm.ts.md) file

## Testing

### Python Testing

For more info about examples, please check [examples](examples/python/README.md).

In order to run examples, just type:

```bash
./examples/python/run_example.sh 
```

## License

See license in the [LICENSE.md](LICENSE.md) file
