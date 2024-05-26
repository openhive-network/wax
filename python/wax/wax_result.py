from __future__ import annotations

from dataclasses import dataclass
from enum import IntEnum

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
