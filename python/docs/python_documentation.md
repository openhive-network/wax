---
title: Wax Python - Documentation
---

# Wax Python Library Documentation

Wax is a Python library designed for interacting with the Hive blockchain. It provides a Python interface to core Hive protocol functionalities, implemented primarily in C++ for performance and accuracy, accessed via a Cython bridge. This library allows developers to create, manipulate, sign, and validate Hive transactions and operations, perform cryptographic tasks, manage assets, and interact with Hive nodes.

## Table of Contents

1.  [Introduction](#introduction)
2.  [Installation](#installation)
3.  [Core Concepts](#core-concepts)
    - [Foundation Interface (`IWaxBaseInterface`)](#foundation-interface-iwaxbaseinterface)
    - [Chain Interface (`IHiveChainInterface`)](#chain-interface-ihivechaininterface)
    - [Transaction Interface (`ITransaction`)](#transaction-interface-itransaction)
4.  [Basic Usage](#basic-usage)
    - [Initializing Wax](#initializing-wax)
    - [Configuration](#configuration)
5.  [Transaction Handling](#transaction-handling)
    - [Creating Transactions](#creating-transactions)
    - [Adding Operations](#adding-operations)
    - [Validation](#validation)
    - [Signing](#signing)
    - [Broadcasting (using HiveChainInterface)](#broadcasting-using-hivechaininterface)
    - [Getting Transaction Info](#getting-transaction-info)
    - [Serialization & Deserialization](#serialization--deserialization)
6.  [Asset Management](#asset-management)
    - [Asset Types](#asset-types)
    - [Creating Assets](#creating-assets)
    - [Asset Conversions](#asset-conversions)
    - [HP Calculations](#hp-calculations)
    - [Estimating Collateral](#estimating-collateral)
7.  [Key Management](#key-management)
    - [Generating Keys](#generating-keys)
    - [Deriving Public Keys](#deriving-public-keys)
    - [Working with Signatures](#working-with-signatures)
8.  [Operations](#operations)
    - [Working with Operations](#working-with-operations)
    - [Getting Impacted Accounts](#getting-impacted-accounts)
    - [Operation Validation](#operation-validation)
    - [Format Conversion (API vs Proto)](#format-conversion-api-vs-proto)
9.  [Utilities](#utilities)
    - [Account Name Validation](#account-name-validation)
    - [Manabar Calculations](#manabar-calculations)
    - [TAPOS Data](#tapos-data)
    - [Inflation Rate](#inflation-rate)
    - [HP APR Calculation](#hp-apr-calculation)
    - [Required Authorities](#required-authorities)
    - [Encrypted Memos](#encrypted-memos)
    - [Witness Properties](#witness-properties)
    - [Minimize Signatures](#minimize-signatures)
    - [Security Checks](#security-checks)
10. [Data Models](#data-models)
11. [Exception Handling](#exception-handling)
12. [Testing Helpers (`wax.helpy`)](#testing-helpers-waxhelpy)
13. [Advanced Topics](#advanced-topics)
    - [Operation Visitor Pattern](#operation-visitor-pattern)

## Introduction

Wax leverages a C++ core library (likely interacting directly with Hive's protocol definitions) and exposes its functionality to Python through Cython. This approach aims to provide both the performance benefits of C++ and the ease of use of Python for Hive blockchain interactions.
Key features include:

- Transaction creation, validation, serialization, and signing.
- Support for both standard Hive JSON format and Protobuf format for operations/transactions.
- Asset creation (HIVE, HBD, VESTS) and conversion utilities.
- Cryptographic functions: key generation, public key derivation, signature verification.
- Manabar and HP calculation helpers.
- Interface for interacting with a Hive node (via `IHiveChainInterface`).

## Installation

_(Inferred from build files)_
The library uses CMake, Cython, and Poetry for its build process. Installation typically involves:

1.  **Prerequisites:**
    - CMake (version 3.22.1 or higher)
    - A C++17 compliant compiler (like GCC or Clang)
    - Python (version 3.12 specified) and `pip`
    - Ninja build system (recommended) or Make
    - Boost libraries (specifically requires `WAX_BOOST_ROOT` environment variable to be set, often managed via a Docker environment like `wax/ci-base-image`).
    - Hive source code (specifically the `libraries/protocol`, `libraries/fc`, `libraries/schema` components) located relative to the Wax source.
2.  **Building:**
    - The build is typically managed by the `build.py` script, invoked via `poetry build`.
    - This script first runs Cython to generate the C++ bridge code (`cpp_python_bridge.cpp`).
    - Then, it uses CMake to configure and build the C++ extension module (`cpp_python_bridge.cpython-*.so`).
    - Finally, it packages the Python code and the compiled C++ module into a wheel.
3.  **Installation:**
    _ Install the generated wheel file using pip: `pip install wax-_.whl`
**Note:** Due to the complex build requirements, using the provided Docker images (`Dockerfile.ci`, `wax-python-builder.dockerfile`) is highly recommended for building and potentially running applications using Wax.

## Core Concepts

### Foundation Interface (`IWaxBaseInterface`)

This is the fundamental interface providing core functionalities that _do not_ require a live connection to a Hive node. It includes transaction creation, signing logic (when provided with keys), asset manipulation, cryptographic functions, and validation.

```python
from wax import create_wax_foundation, WaxOptions
# Use default mainnet chain ID
wax_foundation = create_wax_foundation()
# Use a specific chain ID (e.g., for testnet)
options = WaxOptions(chain_id="18dcf0a285365fc58b71f18b77bce336") # Example testnet ID
wax_foundation_testnet = create_wax_foundation(options)
print(f"Using chain ID: {wax_foundation.chain_id}")
```

### Chain Interface (`IHiveChainInterface`)

This interface inherits from `IWaxBaseInterface` and adds functionalities that _require_ interaction with a Hive API node. This includes fetching dynamic global properties, broadcasting transactions, and retrieving account information.

```python
from wax import create_hive_chain, WaxChainOptions
from beekeepy.interfaces import HttpUrl
# Connect to the default mainnet node
hive_chain = create_hive_chain()
# Connect to a specific node and chain ID
options = WaxChainOptions(
    endpoint_url=HttpUrl("https://api.hive.blog"),
    chain_id="beeab0de..." # Mainnet chain ID
)
hive_chain_mainnet = create_hive_chain(options)
# Change endpoint later
hive_chain.endpoint_url = "https://another.api.node"
```

### Transaction Interface (`ITransaction`)

Represents a Hive transaction. It allows adding operations, signing, validation, and serialization.

```python
# Obtain a transaction object
tx = wax_foundation.create_transaction_with_tapos("block_id_hex")
# or
tx = await hive_chain.create_transaction() # Fetches TAPOS data from node
# Add operations...
# Sign...
# Validate...
# Serialize...
```

## Basic Usage

### Initializing Wax

Use the factory functions:

```python
from wax import create_wax_foundation, create_hive_chain
# For offline operations (signing, validation, serialization)
wax = create_wax_foundation()
# For online operations (broadcasting, fetching data)
hive = create_hive_chain(endpoint_url="https://api.hive.blog")
```

### Configuration

You can specify the `chain_id` when creating instances:

```python
from wax import WaxOptions, WaxChainOptions
# For offline
options = WaxOptions(chain_id="your_chain_id_hex")
wax_custom = create_wax_foundation(options)
# For online
chain_options = WaxChainOptions(chain_id="your_chain_id_hex", endpoint_url="your_node_url")
hive_custom = create_hive_chain(chain_options)
```

The `chain_id` is crucial for correct signature generation and validation.

## Transaction Handling

### Creating Transactions

1.  **With TAPOS Block ID (Offline):** If you know a recent block ID.
    ```python
    # tapos_block_id should be a recent block ID string (hex)
    tx = wax.create_transaction_with_tapos(tapos_block_id="04c1c7a5...")
    ```
2.  **From Node (Online):** Fetches the latest head block information automatically. Requires `IHiveChainInterface`.
    ```python
    tx = await hive.create_transaction()
    ```
3.  **From Existing Proto Data:**
    ```python
    from wax.proto.transaction import transaction as proto_transaction
    # Assuming existing_proto_tx is a populated proto_transaction object
    tx = wax.create_transaction_from_proto(existing_proto_tx)
    ```
4.  **From Existing API JSON Data:**
    ```python
    json_string = '{"ref_block_num": ..., "operations": [...], ...}'
    tx = wax.create_transaction_from_json(json_string)
    ```

### Adding Operations

Operations must be added in the Protobuf format defined in `wax.proto.operations`.

```python
from wax.proto.operations import vote, operation
tx = wax.create_transaction_with_tapos("block_id_hex")
vote_op = vote(
    voter="alice",
    author="bob",
    permlink="my-post",
    weight=10000 # 100% upvote
)
# Wrap the specific operation type in the generic 'operation' message
tx.push_operation(operation(vote=vote_op))
```

### Validation

Ensures the transaction structure is valid according to Hive rules.

```python
try:
    tx.validate()
    print("Transaction is valid.")
except WaxValidationFailedError as e:
    print(f"Transaction validation failed: {e}")
```

### Signing

Signing requires an unlocked `beekeepy` wallet instance and the public key corresponding to the private key needed for signing.

```python
from beekeepy import AsyncBeekeeper # Or SyncBeekeeper
async def sign_transaction(tx: ITransaction, private_key_wif: str, public_key_str: str):
    async with await AsyncBeekeeper.factory() as beekeeper:
        async with await beekeeper.create_session() as session:
            # Create or open and unlock the wallet
            wallet = await session.create_wallet(name="my_wallet", password="pwd")
            await wallet.import_key(private_key=private_key_wif)
            try:
                signature = await tx.sign(wallet, public_key_str)
                print(f"Signed successfully: {signature}")
            except Exception as e:
                print(f"Signing failed: {e}")
            finally:
                await wallet.lock() # Good practice
# Example usage:
# asyncio.run(sign_transaction(tx, "5...", "STM..."))
```

You can also add signatures manually if they were generated elsewhere:

```python
tx.add_signature("existing_signature_hex")
```

### Broadcasting (using `IHiveChainInterface`)

Sends the signed transaction to the connected Hive node.

```python
try:
    await hive.broadcast(tx)
    print("Transaction broadcasted successfully.")
except Exception as e:
    print(f"Broadcast failed: {e}")
```

### Getting Transaction Info

```python
# Transaction ID (hash)
tx_id = tx.id
print(f"Transaction ID: {tx_id}")
# Signature Digest (data that gets signed)
digest = tx.sig_digest
print(f"Signature Digest: {digest}")
# Public keys used for signing (calculated from signatures)
signing_keys = tx.signature_keys
print(f"Signing Keys: {signing_keys}")
# Check if signed
print(f"Is Signed: {tx.is_signed}")
# Get impacted accounts
accounts = tx.impacted_accounts
print(f"Impacted Accounts: {accounts}")
# Get required authorities
auths = tx.required_authorities
print(f"Posting: {auths.posting_accounts}")
print(f"Active: {auths.active_accounts}")
print(f"Owner: {auths.owner_accounts}")
print(f"Other: {auths.other_authorities}")
```

### Serialization & Deserialization

Wax provides functions for converting between different transaction formats.

- **Between Python object and formats:**
  ```python
  # Get Protobuf JSON string
  proto_json_str = tx.to_string()
  # Get API JSON string
  api_json_str = tx.to_api()
  # Get API dict
  api_dict = tx.to_dict()
  # Get binary hex representation (HF26)
  binary_hex = tx.to_binary_form()
  ```
- **Standalone functions:**
  ```python
  # API JSON string -> Binary Hex
  binary_result = wax.serialize_transaction(api_json_str.encode())
  if binary_result.status == wax.python_error_code.ok:
      binary_hex = binary_result.result.decode()
  # Binary Hex -> API JSON string
  api_result = wax.deserialize_transaction(binary_hex.encode())
  if api_result.status == wax.python_error_code.ok:
      api_json_str = api_result.result.decode()
  # Proto JSON string -> Binary Hex
  proto_binary_result = wax.serialize_proto_transaction(proto_json_str.encode())
  if proto_binary_result.status == wax.python_error_code.ok:
      proto_binary_hex = proto_binary_result.result.decode()
  # Binary Hex -> Proto JSON string
  proto_result = wax.deserialize_proto_transaction(proto_binary_hex.encode())
  if proto_result.status == wax.python_error_code.ok:
      proto_json_str = proto_result.result.decode()
  ```

## Asset Management

### Asset Types

Wax provides factories for the three main Hive assets:

- `wax.hive`: For HIVE tokens.
- `wax.hbd`: For Hive Backed Dollars (HBD).
- `wax.vests`: For Vesting Shares (representing Hive Power).

### Creating Assets

Each factory has two methods:

1.  `.coins(amount)`: Creates an asset from a float or string representing the standard coin amount (e.g., `10.5` HIVE). Handles precision automatically.
2.  `.satoshis(amount)`: Creates an asset from an integer representing the smallest unit (satoshis). Does not handle precision scaling.

```python
# Examples
hive_1 = wax.hive.coins(12.345)    # Creates 12.345 HIVE
hive_2 = wax.hive.satoshis(12345)  # Creates 12.345 HIVE
hbd_1 = wax.hbd.coins(5.50)       # Creates 5.500 HBD
hbd_2 = wax.hbd.satoshis(5500)    # Creates 5.500 HBD
vests_1 = wax.vests.coins(1000.0) # Creates 1000.000000 VESTS
vests_2 = wax.vests.satoshis(1000000000) # Creates 1000.000000 VESTS
# Resulting assets are NaiAsset objects (protobuf representation)
print(hive_1.amount, hive_1.precision, hive_1.nai)
```

### Asset Conversions

```python
# Assuming dgpo contains dynamic global properties from the node
dgpo = await hive.api.database.get_dynamic_global_properties()
total_vesting_fund = dgpo.total_vesting_fund_hive
total_vesting_shares = dgpo.total_vesting_shares
# Convert VESTS to HP (which is represented as HIVE)
vests_amount = wax.vests.coins(1000)
hp_amount = wax.vests_to_hp(vests_amount, total_vesting_fund, total_vesting_shares)
print(f"{vests_amount.amount} VESTS is equal to {hp_amount.amount} HP")
# Convert HP (HIVE) to VESTS
# Note: Function name might be `calculate_hp_to_vests` in cpp_python_bridge.pyi
# vests_amount_back = wax.calculate_hp_to_vests(hp_amount, total_vesting_fund, total_vesting_shares)
# Assuming feed_history contains price feed data
feed_history = await hive.api.database.get_feed_history()
current_median_history = feed_history.current_median_history
# Convert HBD to HIVE using median price feed
hbd_amount = wax.hbd.coins(10)
hive_equivalent = wax.hbd_to_hive(
    hbd=hbd_amount,
    base=current_median_history.base,
    quote=current_median_history.quote
)
# Convert HIVE to HBD using median price feed
hive_amount = wax.hive.coins(20)
hbd_equivalent = wax.hive_to_hbd(
    hive=hive_amount,
    base=current_median_history.base,
    quote=current_median_history.quote
)
```

### HP Calculations

```python
# Calculate account HP
account_hp = wax.calculate_account_hp(
    vests=account_vests,  # NaiAsset
    total_vesting_fund_hive=total_vesting_fund, # NaiAsset
    total_vesting_shares=total_vesting_shares  # NaiAsset
)
# Calculate witness votes in HP
witness_votes_hp = wax.calculate_witness_votes_hp(
    number=witness_votes_in_vests, # integer
    total_vesting_fund_hive=total_vesting_fund, # NaiAsset
    total_vesting_shares=total_vesting_shares  # NaiAsset
)
```

### Estimating Collateral

Used for `collateralized_convert` operations.

```python
# Fetch feed history
feed_history = await hive.api.database.get_feed_history()
median_price = feed_history.current_median_history
# Note: Finding the minimum price might require iterating through price_history
# Assuming min_price is found or constructed
hbd_to_get = wax.hbd.coins(50)
estimated_collateral = wax.estimate_hive_collateral(
    current_median_history_base=median_price.base,
    current_median_history_quote=median_price.quote,
    current_min_history_base=min_price.base,     # Needs calculation/lookup
    current_min_history_quote=min_price.quote,  # Needs calculation/lookup
    hbd_amount_to_get=hbd_to_get
)
print(f"Estimated HIVE collateral needed: {estimated_collateral}")
```

## Key Management

### Generating Keys

```python
# Suggest a brain key (16 words + derived keys)
brain_key_info = wax.suggest_brain_key()
print(f"Brain Key: {brain_key_info.brain_key}")
print(f"WIF Private Key: {brain_key_info.wif_private_key}")
print(f"Public Key: {brain_key_info.associated_public_key}")
# Generate a random private key
key_result = wax.generate_private_key()
if key_result.status == wax.python_error_code.ok:
    wif_private_key = key_result.result.decode()
    print(f"Generated WIF: {wif_private_key}")
# Derive private key from password
key_info = wax.get_private_key_from_password(
    account="testuser",
    role="active", # or "posting", "owner", "memo"
    password="veryStrongPassword123"
)
print(f"Derived WIF: {key_info.wif_private_key}")
print(f"Associated Public Key: {key_info.associated_public_key}")
```

### Deriving Public Keys

```python
wif_private_key = "5..." # A valid WIF private key
pub_key_result = wax.calculate_public_key(wif_private_key.encode())
if pub_key_result.status == wax.python_error_code.ok:
    public_key = pub_key_result.result.decode()
    print(f"Public key: {public_key}")
else:
    print(f"Error calculating public key: {pub_key_result.exception_message.decode()}")
```

### Working with Signatures

```python
# Assume tx is a signed ITransaction object
# Assume sig_digest and signature are hex strings
try:
    public_key = wax.get_public_key_from_signature(
        sig_digest=sig_digest.encode(),
        signature=signature.encode()
    )
    print(f"Signature corresponds to public key: {public_key}")
except WaxValidationFailedError as e:
    print(f"Could not get public key from signature: {e}")
```

## Operations

Wax supports operations in both the traditional Hive API JSON format and the Protobuf format. Operations are added to transactions using `tx.push_operation()`.

### Working with Operations

- **Proto Format (Recommended):** Import the specific operation type from `wax.proto.operations` and instantiate it.
  ```python
  from wax.proto.operations import vote, operation
  vote_op = vote(voter="alice", author="bob", permlink="post", weight=10000)
  tx.push_operation(operation(vote=vote_op))
  ```
- **API JSON Format (String or Dict):**
  ```python
  # As dict
  vote_dict = {
      "type": "vote_operation",
      "value": {
          "voter": "alice", "author": "bob", "permlink": "post", "weight": 10000
      }
  }
  tx.push_operation(vote_dict) # Note: This pushes the dict directly
  # As JSON string
  vote_json = '{"type": "vote_operation", "value": {"voter": "carol", ...}}'
  tx.push_operation(vote_json) # Note: This pushes the string directly
  ```
  _Caution:_ When using API JSON format directly with `push_operation`, Wax internally converts it to Protobuf. Ensure the format is exactly correct.

### Getting Impacted Accounts

```python
from wax.proto.operations import transfer, operation
transfer_op = transfer(from_account="alice", to_account="bob", amount=wax.hive.coins(1), memo="")
op_wrapper = operation(transfer=transfer_op)
# Get accounts impacted by a single operation
impacted = wax.get_operation_impacted_accounts(op_wrapper) # Pass the wrapped operation
# impacted will be ['alice', 'bob']
# Get accounts impacted by all operations in a transaction
all_impacted = tx.impacted_accounts
```

### Operation Validation

You can validate individual operations before adding them to a transaction.

```python
from wax.proto.operations import vote, operation
vote_op = vote(...)
op_wrapper = operation(vote=vote_op)
# Validate a proto operation
try:
    # Convert proto object to JSON string for validation function
    proto_json = MessageToJson(op_wrapper)
    result = wax.validate_proto_operation(proto_json.encode())
    print("Proto operation is valid.")
except WaxValidationFailedError as e:
    print(f"Proto operation invalid: {e}")
# Validate an API format operation
api_op_json = '{"type": "vote_operation", "value": ...}'
try:
    result = wax.validate_operation(api_op_json.encode())
    print("API operation is valid.")
except WaxValidationFailedError as e:
    print(f"API operation invalid: {e}")
```

### Format Conversion (API vs Proto)

Wax provides functions to convert between the standard Hive API operation/transaction format and the Protobuf format used internally.

```python
# API JSON string -> Proto JSON string
api_json_str = '{"type": "vote_operation", "value": {...}}'
proto_result = wax.api_to_proto(api_json_str.encode())
if proto_result.status == wax.python_error_code.ok:
    proto_json_str = proto_result.result.decode()
# Proto JSON string -> API JSON string
api_result = wax.proto_to_api(proto_json_str.encode())
if api_result.status == wax.python_error_code.ok:
    api_json_str_converted = api_result.result.decode()
# Proto JSON string -> Legacy API JSON string
legacy_api_result = wax.proto_to_legacy_api(proto_json_str.encode())
if legacy_api_result.status == wax.python_error_code.ok:
    legacy_api_json_str = legacy_api_result.result.decode()
```

## Utilities

### Account Name Validation

```python
if wax.is_valid_account_name("a-valid-name"):
    print("Valid")
else:
    print("Invalid")
```

### Manabar Calculations

See [Manabar Calculations Section](#manabar-calculations).

### TAPOS Data

Get `ref_block_num` and `ref_block_prefix` from a block ID.

```python
block_id_hex = "04c1c7a5..."
tapos_info = wax.get_tapos_data(block_id_hex.encode())
print(f"Ref Block Num: {tapos_info.ref_block_num}")
print(f"Ref Block Prefix: {tapos_info.ref_block_prefix}")
```

### Inflation Rate

Calculate the inflation rate for a given block number.

```python
block_num = 80000000
rate_result = wax.calculate_inflation_rate_for_block(block_num)
if rate_result.status == wax.python_error_code.ok:
    # Rate is returned as basis points (e.g., "974" for 9.74%)
    inflation_basis_points = rate_result.result.decode()
    print(f"Inflation rate at block {block_num}: {inflation_basis_points} bps")
```

### HP APR Calculation

Calculate the approximate Annual Percentage Rate for holding Hive Power.

```python
# Assume dgpo is fetched dynamic global properties
# Assume chain_props is fetched chain properties
dgpo = await hive.api.database.get_dynamic_global_properties()
chain_props = await hive.api.condenser.get_chain_properties() # Or database_api
hp_apr = wax.calculate_hp_apr(
    head_block_num=dgpo.head_block_number,
    vesting_reward_percent=chain_props.vesting_reward_percent,
    virtual_supply=dgpo.virtual_supply,
    total_vesting_fund_hive=dgpo.total_vesting_fund_hive
)
print(f"Estimated HP APR: {hp_apr}%") # Returns a Decimal
```

### Required Authorities

Determine the required authorities (posting, active, owner, other) for a transaction.

```python
tx_json_str = tx.to_api() # Transaction must be in API format
required_auths = wax.get_transaction_required_authorities(tx_json_str.encode())
print(f"Required Posting: {required_auths.posting_accounts}")
print(f"Required Active: {required_auths.active_accounts}")
print(f"Required Owner: {required_auths.owner_accounts}")
print(f"Required Other: {required_auths.other_authorities}")
```

### Encrypted Memos

Encode and decode memos encrypted using Hive's standard memo encryption.

```python
from_pubkey = "STM..."
to_pubkey = "STM..."
message = "Secret message"
# Assume encryption_key is the private key corresponding to from_pubkey
# Assume decryption_key is the private key corresponding to to_pubkey
# Encrypt (requires private key for 'from', public key for 'to')
# Note: The actual encryption likely needs to happen outside Wax currently.
# This function *formats* an already encrypted message.
encrypted_content_hex = "..." # Result of external encryption
encoded_memo = wax.encode_encrypted_memo(
    encrypted_content=encrypted_content_hex.encode(),
    main_encryption_key=from_pubkey.encode(),
    other_encryption_key=to_pubkey.encode()
)
print(f"Encoded Memo: {encoded_memo.decode()}") # Starts with '#'
# Decode (requires public key for 'from', private key for 'to')
# Note: The actual decryption likely needs to happen outside Wax currently.
# This function *extracts* the parts of an encoded memo.
decoded_info = wax.decode_encrypted_memo(encoded_memo)
print(f"From Key: {decoded_info.main_encryption_key.decode()}")
print(f"To Key: {decoded_info.other_encryption_key.decode()}")
print(f"Encrypted Content: {decoded_info.encrypted_content.decode()}") # Still needs decryption
```

### Witness Properties

Serialize and deserialize witness properties, typically used in `witness_set_properties_operation`.

```python
from wax.wax_result import python_witness_set_properties_data, python_price, python_json_asset
props_data = python_witness_set_properties_data(
    key=b"STM...", # Current block signing key
    new_signing_key=b"STM...", # New block signing key (optional)
    url=b"https://witness.url",
    hbd_exchange_rate=python_price(
        base=python_json_asset(amount=b"100", precision=3, nai=b"@@000000013"),
        quote=python_json_asset(amount=b"950", precision=3, nai=b"@@000000021")
    )
    # ... other properties
)
# Serialize to the format needed for the operation's 'props' field
serialized_props = wax.serialize_witness_set_properties(props_data)
# serialized_props is a dict[bytes, bytes] like {b"url": b"...", b"key": b"..."}
# Deserialize back (less common use case)
deserialized_data = wax.deserialize_witness_set_properties(serialized_props)
```

### Minimize Signatures

Optimizes the list of required signatures for a transaction, removing redundant ones based on Hive's authority rules.

```python
from wax import minimize_required_signatures, python_minimize_required_signatures_data
from tests.utils.refs import ACCOUNT_AUTHS # Example authorities map
# Assume `signed_tx_json` is a JSON string of a transaction *with* signatures
# Assume `available_public_keys_bytes` is a list[bytes] of available keys
# Callback to get witness signing key (if needed for operation)
def get_witness_key(account_name: bytes) -> bytes:
    # Implement logic to fetch witness key if needed, otherwise return b""
    print(f"Fetching key for witness: {account_name.decode()}")
    return b"" # Placeholder
minimize_data = python_minimize_required_signatures_data(
    chain_id=wax.chain_id.encode(),
    available_keys=available_public_keys_bytes,
    authorities_map=ACCOUNT_AUTHS, # Pre-fetched authorities for relevant accounts
    get_witness_key=get_witness_key
)
minimal_keys = wax.minimize_required_signatures(
    signed_transaction=signed_tx_json.encode(),
    minimize_required_signatures_data=minimize_data
)
print(f"Minimal required keys: {[k.decode() for k in minimal_keys]}")
```

### Security Checks

```python
# Check if a memo potentially contains a private key
memo_text = "Check this: 5J..."
try:
    # Need account authorities and memo key for context
    wax.check_memo_for_private_keys(
        memo=memo_text.encode(),
        account="account_name".encode(),
        auths=account_authorities_object, # python_authorities object
        memo_key="STM...".encode(), # Account's memo public key
        imported_keys=[...] # List of other public keys to check against
    )
    print("Memo seems safe.")
except RuntimeError as e:
    print(f"Potential private key leak detected: {e}")
```

## Data Models

Wax uses several data classes and type aliases defined in `wax.models` and `wax.wax_result`. Key models include:

- **Assets:** `NaiAsset`, `AssetInfo`, `AssetFactory`, `python_json_asset`
- **Authorities:** `WaxAuthority`, `WaxAuthorities`, `WaxAccountAuthorityInfo`, `ITransactionRequiredAuthorities`, `python_authority`, `python_authorities`
- **Basic Types:** `AccountName`, `ChainId`, `Hex`, `PublicKey`, `SigDigest`, `Signature`, `TransactionId`
- **Keys:** `IBrainKeyData`, `IPrivateKeyData`, `python_private_key_data`, `python_brain_key_data`
- **Operations:** `Operation`, `WaxMetaOperation` (See `wax.proto.operations` for specifics)
- **Transactions:** `ITransaction`, `IOnlineTransaction`, `ProtoTransaction`, `JsonTransaction`
- **Results:** `python_result`, `python_error_code`
- **Other:** `ChainReferenceData`, `IManabarData`, `python_ref_block_data`, `python_encrypted_memo`, `python_price`, `python_witness_set_properties_data`, `python_minimize_required_signatures_data`
  Refer to the respective modules and the `interfaces.py` file for detailed definitions.

## Exception Handling

Wax defines custom exceptions in `wax.exceptions`:

- `WaxError`: Base class for all Wax exceptions.
- `AssetError`: Base for asset-related issues.
  - `InvalidAssetAmountError`
  - `UnknownAssetTypeError`
  - `UnknownAssetNaiError`
  - `CannotCreateAssetError`
- `DecimalConversionError`: Base for decimal conversion issues.
  - `DecimalConversionNotANumberError`
  - `DecimalConversionNegativePrecisionError`
- `WaxValidationFailedError`: Generic validation failure.
  - `InvalidAccountNameError`
  - `InvalidOperationFormatError`
  - `InvalidEndpointUrlFormatError`
- `AccountNotFoundError`: Account not found on the blockchain.
- `WaxImportProtoBeforeCompileError`: Protobuf files haven't been compiled.
  Catch specific exceptions for fine-grained error handling or `WaxError` for general Wax issues. `WaxValidationFailedError` often wraps underlying C++ exceptions.

```python
from wax.exceptions import WaxValidationFailedError, InvalidAccountNameError
try:
    # Some wax operation
    pass
except InvalidAccountNameError as e:
    print(f"Invalid account name used: {e.account}")
except WaxValidationFailedError as e:
    print(f"Wax validation failed: {e.reason}")
except WaxError as e:
    print(f"A Wax error occurred: {e}")
```

## Testing Helpers (`wax.helpy`)

The `wax.helpy` package provides tools primarily intended for testing applications that use Wax, especially for interacting with Hive nodes in controlled environments.

- **`Hived` / `AsyncHived`:** Handles for interacting synchronously or asynchronously with a `hived` node instance. They provide access to the full range of Hive APIs.
- **API Modules:** Submodules within `wax.helpy._handles.hived.api` provide typed interfaces for specific Hive APIs (e.g., `database_api`, `network_broadcast_api`).
- **Time Utilities (`wax.helpy.Time`)**: Advanced time manipulation and waiting functions useful for test scenarios (e.g., `wait_for_block_with_number`, `sync_wait_for`, `async_wait_for`).
- **Asset Helpers (`wax.helpy.Asset`)**: Includes `Hf26Asset` and `LegacyAsset` classes with helper methods for creating and comparing assets in tests.
  Example (`AsyncHived`):

```python
from wax.helpy import AsyncHived
from beekeepy import Settings
from beekeepy.interfaces import HttpUrl
async def check_block_num():
    async with AsyncHived(settings=Settings(http_endpoint=HttpUrl("https://api.hive.blog")) as node:
        dgpo = await node.api.database.get_dynamic_global_properties()
        print(f"Head block number: {dgpo.head_block_number}")
# asyncio.run(check_block_num())
```

## Advanced Topics

### Operation Visitor Pattern

For processing transactions containing various operation types, Wax provides a visitor pattern.

1.  **Inherit `OperationVisitor`:** Create a class inheriting from `wax.wax_visitor.OperationVisitor`.
2.  **Override Methods:** Override the specific `visit_<operation_type>` methods you need to handle. Methods for operations you don't override will simply do nothing (`pass`).

```python
from wax.wax_visitor import OperationVisitor
from wax.proto.operations import vote, transfer, operation # Import specific types
class MyTxProcessor(OperationVisitor):
    def __init__(self):
        self.votes = []
        self.transfers = []
    def vote(self, op: vote): # Use specific type hint
        print(f"Found vote: {op.voter} -> {op.author}")
        self.votes.append(op)
    def transfer(self, op: transfer): # Use specific type hint
        print(f"Found transfer: {op.from_account} -> {op.to_account}")
        self.transfers.append(op)
# Assume `tx` is an ITransaction object
processor = MyTxProcessor()
for op_wrapper in tx.transaction.operations: # Iterate through the wrapped operations
    processor.accept(op_wrapper) # Pass the wrapper to accept
print(f"Processed {len(processor.votes)} votes and {len(processor.transfers)} transfers.")
```

If you need to ensure _all_ operation types are explicitly handled, inherit from `AbstractOperationVisitor` instead. This will raise a `TypeError` on instantiation if any visitor methods are missing.
