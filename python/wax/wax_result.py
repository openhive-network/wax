from __future__ import annotations

from dataclasses import dataclass
from enum import IntEnum
from typing import TypeAlias, Optional

class python_error_code(IntEnum):  # noqa: N801
    fail = 0
    ok = 1


@dataclass
class python_result:  # noqa: N801
    status: python_error_code
    result: bytes
    exception_message: bytes


@dataclass
class python_json_asset:  # noqa: N801
    amount: bytes
    precision: int
    nai: bytes

@dataclass
class python_ref_block_data:  # noqa: N801
    ref_block_num: int
    ref_block_prefix: int

@dataclass
class python_required_authority_collection:  # noqa: N801
    posting_accounts: set[string]
    active_accounts: set[string]
    owner_accounts: set[string]

@dataclass
class python_encrypted_memo:
    # base58 string pointing the public key identifying the first private-key to perform encryption
    main_encryption_key: string
    # base58 string pointing the public key identifying the other private-key being being (also) decrypt data buffer
    other_encryption_key: string
    # base58 encoded encrypted content
    encrypted_content: string

@dataclass
class python_private_key_data:
    wif_private_key: string
    # base58 string pointing the public key associated to the private key specified above
    associated_public_key: string

@dataclass
class python_brain_key_data:
    # a string containing space separated list of N words generated as a brain key (atm 16)
    brain_key: string
    # first private key derived from above specified brain key
    wif_private_key: string
    # base58 string pointing the public key associated to the private key specified above
    associated_public_key: string

@dataclass
class python_witness_set_properties_data:
    key: string
    new_signing_key: Optional[string]
    account_creation_fee: Optional[string]
    url: Optional[string]
    hbd_exchange_rate: Optional[string]
    maximum_block_size: Optional[string]
    hbd_interest_rate: Optional[string]
    account_subsidy_budget: Optional[string]
    account_subsidy_decay: Optional[string]

python_witness_set_properties_serialized: TypeAlias = dict[string, string]
