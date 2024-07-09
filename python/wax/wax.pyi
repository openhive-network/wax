from __future__ import annotations

from .wax_result import python_encrypted_memo, python_json_asset, python_result, python_ref_block_data, python_required_authority_collection, python_private_key_data, python_brain_key_data, python_witness_set_properties_data

def validate_operation(operation: bytes) -> python_result: ...
def validate_transaction(transaction: bytes) -> python_result: ...
def calculate_transaction_id(transaction: bytes) -> python_result: ...
def calculate_legacy_transaction_id(transaction: bytes) -> python_result: ...
def calculate_sig_digest(transaction: bytes, chain_id: bytes) -> python_result: ...
def serialize_transaction(transaction: bytes) -> python_result: ...
def calculate_public_key(wif: bytes) -> python_result: ...
def generate_private_key() -> python_result: ...
def generate_password_based_private_key(account: string, role: string, password: string) -> python_private_key_data: ...
def suggest_brain_key() -> python_brain_key_data: ...
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
def calculate_hbd_to_hive(
    hbd: python_json_asset,
    base: python_json_asset,
    quote: python_json_asset
) -> python_json_asset: ...
def calculate_vests_to_hp(
    vests: python_json_asset,
    total_vesting_fund_hive: python_json_asset,
    total_vesting_shares: python_json_asset
) -> python_json_asset: ...
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
) -> python_json_asset: ...
def calculate_witness_votes_hp(
    votes: int,
    total_vesting_fund_hive: python_json_asset,
    total_vesting_shares: python_json_asset
) -> python_json_asset: ...
def calculate_inflation_rate_for_block(
    block_num: int
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
def proto_to_legacy_api(operation_or_tx: bytes) -> python_result: ...
def api_to_proto(operation_or_tx: bytes) -> python_result: ...
def get_transaction_required_authorities( transaction: bytes ) -> python_required_authority_collection: ...
def encode_encrypted_memo(encrypted_content: bytes, main_encryption_key: bytes, other_encryption_key: bytes = b'') -> string: ...
def decode_encrypted_memo(encoded_memo: bytes) -> python_encrypted_memo: ...
def verify_exception_handling( throw_type: int ) -> None: ...
def serialize_witness_set_properties(input_properties: python_witness_set_properties_data): dict[bytes, bytes]
def deserialize_witness_set_properties(serialized_properties: dict[bytes, bytes]): python_witness_set_properties_data
