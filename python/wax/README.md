# Wax (Python)

Provides Hive Protocol features to Python.

[![PyPI version](https://img.shields.io/pypi/v/hiveio-wax.svg)](https://pypi.org/project/hiveio-wax/)
[![CI](https://gitlab.syncad.com/hive/wax/badges/develop/pipeline.svg)](https://gitlab.syncad.com/hive/wax/-/pipelines)

---

## Features

- Create and manipulate Hive transactions
- Sign and broadcast transactions to the Hive network
- Extendable JSON-RPC and REST API interfaces
- Asset helpers (HIVE, HBD, VESTS) and conversion utilities
- Cryptographic helpers: keys, signatures, memos
- Manabar and HP calculation helpers
- Full IntelliSense / type-checker support

---

## High-level documentation

Versioned high-level documentation with snippets:

- [https://doc.openhive.network/wax/](https://doc.openhive.network/wax/)

Latest (usually not yet released) documentation:

- [https://hive.pages.syncad.com/wax-doc](https://hive.pages.syncad.com/wax-doc)

For building bots and automation on Hive (WAX + Beekeeper + WorkerBee):

- [Building agents on developers.hive.io](https://developers.hive.io/quickstart/#quickstart-building-agents)

TypeScript consumers should use [`@hiveio/wax`](https://www.npmjs.com/package/@hiveio/wax) — see the [npm README](https://gitlab.syncad.com/hive/wax/-/blob/develop/ts/README.md).

---

## Getting started

### Requirements

- Python 3.12+

### Installation

Install from [PyPI](https://pypi.org/project/hiveio-wax/):

```bash
pip install hiveio-wax
```

Development builds are published to the Hive GitLab package registry. To prefer those, use an extra index URL:

```bash
pip install --extra-index-url https://gitlab.syncad.com/api/v4/groups/136/-/packages/pypi/simple hiveio-wax
```

### Basic usage

```python
from wax import create_wax_foundation

wax = create_wax_foundation()

# Representation of 5 HIVE in NAI format
print(wax.hive.coins(5))
```

Create a chain-bound client and a transaction:

```python
from wax import WaxChainOptions, create_hive_chain

chain = create_hive_chain(WaxChainOptions(endpoint_url="https://api.hive.blog"))
# tx = await chain.create_transaction()
```

More examples live in the repository under [`examples/python`](https://gitlab.syncad.com/hive/wax/-/tree/develop/examples/python).

---

## License

See [LICENSE.md](https://gitlab.syncad.com/hive/wax/-/blob/develop/LICENSE.md).
