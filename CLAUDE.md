# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Wax is a library providing Hive blockchain protocol features to both Python and TypeScript/JavaScript. It wraps C++ hived source code via:
- **Python**: Cython bindings compiled to native `.so` modules
- **TypeScript**: WebAssembly (WASM) compiled from C++ via Emscripten

The `hive` submodule contains the core blockchain C++ code and protocol definitions (protobuf).

## Build Commands

### TypeScript

```bash
# Install dependencies (from ts/ directory)
pnpm install

# Build WASM and TypeScript
pnpm run build

# Build tests only
pnpm run build:test

# Run tests (uses Playwright)
pnpm run test

# Run specific test project
pnpm run test -- --project=wax_testsuite

# Run examples
pnpm run examples

# Run benchmarks
pnpm run benchmark
```

### Python

```bash
# Build wheel (from repo root, requires CI base image or prepared environment)
./python/scripts/build_wax.sh

# Install for development
./python/scripts/install_wax.sh

# Run tests (starts mock server, runs pytest)
./python/tests/run_tests.sh

# Run examples
./examples/python/run_example.sh

# Lint (from python/ directory)
poetry run ruff check .
poetry run mypy .
```

## Project Structure

```
wax/
├── ts/                          # TypeScript package (@hiveio/wax)
│   ├── wasm/
│   │   ├── lib/                 # Source code
│   │   │   ├── detailed/        # Core implementation
│   │   │   │   ├── base.ts      # createWaxFoundation() impl
│   │   │   │   ├── chain.ts     # createHiveChain() impl
│   │   │   │   ├── api/         # API type definitions
│   │   │   │   ├── formatters/  # Output formatting
│   │   │   │   └── complex_operations/  # High-level operation builders
│   │   │   └── index.ts         # WASM loading and exports
│   │   ├── __tests__/           # Playwright test files
│   │   └── build_wasm/          # Generated WASM artifacts
│   ├── packages/                # Extension packages (signers-*)
│   └── playwright.config.ts     # Test configuration with multiple projects
├── python/                      # Python package (hiveio-wax)
│   ├── wax/
│   │   ├── __init__.py          # Public API exports
│   │   ├── wax_factory.py       # create_wax_foundation(), create_hive_chain()
│   │   ├── cpp_python_bridge.pyx  # Cython bindings
│   │   ├── _private/            # Internal implementation
│   │   │   ├── proto/           # Generated protobuf files
│   │   │   └── api/             # API caller implementation
│   │   ├── helpy/               # Helper utilities
│   │   └── complex_operations/  # High-level operation builders
│   ├── tests/                   # pytest tests
│   └── scripts/                 # Build scripts
├── hive/                        # Git submodule - Hive blockchain source
│   └── libraries/protocol/proto/  # Protocol buffer definitions
└── examples/                    # Usage examples for both languages
```

## Architecture

### Entry Points

**TypeScript:**
- `createWaxFoundation()` - Offline operations (transaction building, signing, validation)
- `createHiveChain()` - Online operations (API calls, broadcasting)

**Python:**
- `create_wax_foundation()` - Offline operations
- `create_hive_chain()` - Online operations with endpoint

### Key Concepts

1. **Transactions**: Built with `pushOperation()`, signed with wallet integration
2. **Operations**: Protocol buffer messages representing blockchain actions
3. **Formatters**: Template literal formatting via `waxify` for output
4. **Signers**: Pluggable signing providers (beekeeper, keychain, metamask, peakvault)
5. **API Extensions**: Extend base API with custom endpoints via `extend()` / `extendRest()`

### Proto Generation

Protocol buffers from `hive/libraries/protocol/proto/` are compiled to:
- TypeScript: `ts/wasm/lib/proto/` via `ts-proto`
- Python: `python/wax/_private/proto/` via `grpcio-tools`

Pattern files in `ts/protobuf_patterns/` and `python/protobuf_patterns/` track expected generated output.

## CI/CD

GitLab CI pipeline stages: build → static_code_analysis → test → deploy

Key jobs:
- `wax_wasm_proto_tsc_generation`: Builds TypeScript WASM package
- `build_wheel`: Builds Python wheel
- `test_wax_wasm`: Runs TypeScript tests (parallel matrix of test projects)
- `test_wax_protobuf_python`: Runs Python tests

## Development Notes

- Python requires Python 3.14+ (check `python = ">=3.14,<4"` in pyproject.toml)
- TypeScript requires Node.js 20.11+ or 21.2+
- Tests use mock server for API calls (see `ts/wasm/__tests__/assets/proxy-mock-server.ts`)
- Devcontainer available at `.devcontainer/devcontainer.json`
- once updating common-ci-configuration submodule both: ts/npm-common-config and gitlab-ci.yml include must be adjusted
- all CI jobs are considered to be passing. Marking them as allow_failure is not allowed

Codebase is splitted into few parts:
- core subdirectory holding common c++ part for both: python and Typescript implementations. This part is tightly integrated to hive submodule and is mostly using libraries/protocol and libraries/fc. Avoid scanning deeper subdirectories during analysis of wax codebase
- python subdirectory holding python implementation
- ts subdirectory holding Typescript implementation. One important principles of TS version is minimal size of finally produced NPM package.
