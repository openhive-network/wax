---
hide:
  - navigation
  - toc
---

Wax is a Python library designed for interacting with the Hive blockchain. It provides a Python interface to core Hive
protocol functionalities, implemented primarily in C++ for performance and accuracy, accessed via a Cython bridge. This
library allows developers to create, manipulate, sign, and validate Hive transactions and operations, perform
cryptographic tasks, manage assets, and interact with Hive nodes.

One of the biggest advantages of wax is full code completion support (like IntelliSense). The library is very
well-documented and allows for easy configuration with exposed option classes. These classes are passed to factory
functions, and wax is configured to interact with the node of the user's choice.

Key features include:

- Transaction creation, validation, serialization, and signing.
- Interface for interacting with a Hive node (via `IHiveChainInterface`).
- Support for both standard Hive JSON format and Protobuf format for operations/transactions.
- Asset creation (HIVE, HBD, VESTS) and conversion utilities.
- Cryptographic functions: key generation, public key derivation, signature verification.
- Manabar and HP calculation helpers.

## Table Of Contents

Quickly find what you're looking for depending on
your use case by looking at the different pages.

1. [Tutorial](tutorial.md)
2. [How-To Guides](how-to-guides.md)
3. [Reference](reference.md)
