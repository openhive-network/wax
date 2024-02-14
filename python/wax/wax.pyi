from __future__ import annotations

from .wax_result import python_json_asset, python_result, python_ref_block_data

def validate_operation(operation: bytes) -> python_result: ...
def validate_transaction(transaction: bytes) -> python_result: ...
def calculate_transaction_id(transaction: bytes) -> python_result: ...
def calculate_legacy_transaction_id(transaction: bytes) -> python_result: ...
def calculate_sig_digest(transaction: bytes, chain_id: bytes) -> python_result: ...
def serialize_transaction(transaction: bytes) -> python_result: ...
def calculate_public_key(wif: bytes) -> python_result: ...
def generate_private_key() -> python_result: ...
def calculate_manabar_full_regeneration_time(
    now: int, max_mana: int, current_mana: int, last_update_time: int
) -> python_result: ...
def calculate_current_manabar_value(
    now: int, max_mana: int, current_mana: int, last_update_time: int
) -> python_result: ...
def general_asset(asset_num: int, amount: int) -> python_json_asset: ...
def hive(amount: int) -> python_json_asset: ...
def hbd(amount: int) -> python_json_asset: ...
def vests(amount: int) -> python_json_asset: ...
def get_tapos_data(block_id: bytes) -> python_ref_block_data: ...
def calculate_hp_apr(
    head_block_num: int,
    vesting_reward_percent: int,
    virtual_supply: python_json_asset,
    total_vesting_fund_hive: python_json_asset
) -> python_result: ...
def calculate_account_hp(
    vests: python_json_asset,
    total_vesting_fund_hive: python_json_asset,
    total_vesting_shares: python_json_asset
) -> python_result: ...
def calculate_witness_votes_hp(
    votes: int,
    total_vesting_fund_hive: python_json_asset,
    total_vesting_shares: python_json_asset
) -> python_result: ...
def validate_proto_operation(operation: bytes) -> python_result: ...
def validate_proto_transaction(transaction: bytes) -> python_result: ...
def calculate_proto_transaction_id(transaction: bytes) -> python_result: ...
def calculate_proto_legacy_transaction_id(transaction: bytes) -> python_result: ...
def calculate_proto_sig_digest(
    transaction: bytes, chain_id: bytes
) -> python_result: ...
def serialize_proto_transaction(transaction: bytes) -> python_result: ...
def proto_to_api(operation_or_tx: bytes) -> python_result: ...
def api_to_proto(operation_or_tx: bytes) -> python_result: ...
