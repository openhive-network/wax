from __future__ import annotations

from dataclasses import dataclass
from enum import IntEnum

def compare_any_string(s0:bytes|str, s1:bytes|str) -> bool:
  if isinstance(s0, bytes):
    s0 = s0.decode('utf-8')

  if isinstance(s1, bytes):
    s1 = s1.decode('utf-8')

  return s0 == s1

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

    def __eq__(self, other):
      return self.precision == other.precision and compare_any_string(self.amount, other.amount) and compare_any_string(self.nai, other.nai)

@dataclass
class python_price:
    base: python_json_asset
    quote: python_json_asset

@dataclass
class python_ref_block_data:  # noqa: N801
    ref_block_num: int
    ref_block_prefix: int

@dataclass
class python_required_authority_collection:  # noqa: N801
    posting_accounts: set[string]
    active_accounts: set[string]
    owner_accounts: set[string]
    other_authorities: list[wax_authority]

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
    # Witness key to match the current witness key. Obligatory
    key: bytes
    # New witness key to set
    new_signing_key: bytes|None=None
    # HIVE maximum account creation fee
    account_creation_fee: python_json_asset|None=None
    # New witness URL to set
    url: bytes|None = None
    # HBD to HIVE ratio proposed by the witness
    hbd_exchange_rate: python_price|None=None
    # This witnesses vote for the maximum_block_size which is used by the network to tune rate limiting and capacity
    maximum_block_size: int|None=None
    # Rate of interest for holding HBD (in BPS - basis points)
    hbd_interest_rate: int|None=None
    # How many free accounts should be created per elected witness block. Scaled so that HIVE_ACCOUNT_SUBSIDY_PRECISION represents one account.
    account_subsidy_budget: int|None=None
    # What fraction of the "stockpiled" free accounts "expire" per elected witness block. Scaled so that 1 << HIVE_RD_DECAY_DENOM_SHIFT represents 100% of accounts expiring.
    account_subsidy_decay: int|None=None

@dataclass
class python_authority:
    weight_threshold: int
    account_auths: dict[bytes, int]
    key_auths: dict[bytes, int]

@dataclass
class python_authorities:
    active: python_authority
    owner: python_authority
    posting: python_authority
