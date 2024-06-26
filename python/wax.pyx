# distutils: language = c++
from functools import wraps

from libcpp.set cimport set as cppset
from cython.operator cimport dereference, preincrement

from wax cimport error_code, json_asset, result, protocol, proto_protocol
from .wax_result import python_result, python_error_code, python_json_asset, python_ref_block_data, python_required_authority_collection, python_encrypted_memo, python_private_key_data, python_brain_key_data

def return_python_result(foo):
    @wraps(foo)
    def wrapper(*args, **kwargs):
        try:
            value, content, exception_message = foo(*args, **kwargs)
            return python_result(status=python_error_code(value), result=content, exception_message=exception_message)
        except Exception as ex:
            return python_result(status=python_error_code.fail, result=b'', exception_message=str(ex))
    return wrapper

def return_python_json_asset(foo):
    @wraps(foo)
    def wrapper(*args, **kwargs):
        amount, precision, nai = foo(*args, **kwargs)
        return python_json_asset(
            amount=amount,
            precision=precision,
            nai=nai
        )

    return wrapper

def return_python_ref_block_data(foo):
    @wraps(foo)
    def wrapper(*args, **kwargs):
        ref_block_num, ref_block_prefix = foo(*args, **kwargs)
        return python_ref_block_data(
            ref_block_num=ref_block_num & 0xffff, # convert to unsigned
            ref_block_prefix=ref_block_prefix & 0xffffffff # convert to unsigned
        )

    return wrapper

@return_python_result
def validate_operation(operation: bytes) -> python_result:
    cdef protocol obj
    response = obj.cpp_validate_operation(operation)
    return response.value, response.content, response.exception_message

@return_python_result
def validate_transaction(transaction: bytes) -> python_result:
    cdef protocol obj
    response = obj.cpp_validate_transaction(transaction)
    return response.value, response.content, response.exception_message

@return_python_result
def calculate_transaction_id(transaction: bytes) -> python_result:
    cdef protocol obj
    response = obj.cpp_calculate_transaction_id(transaction)
    return response.value, response.content, response.exception_message

@return_python_result
def calculate_legacy_transaction_id(transaction: bytes) -> python_result:
    cdef protocol obj
    response = obj.cpp_calculate_legacy_transaction_id(transaction)
    return response.value, response.content, response.exception_message

@return_python_result
def calculate_sig_digest(transaction: bytes, chain_id: bytes) -> python_result:
    cdef protocol obj
    response = obj.cpp_calculate_sig_digest(transaction, chain_id)
    return response.value, response.content, response.exception_message

@return_python_result
def calculate_legacy_sig_digest(transaction: bytes, chain_id: bytes) -> python_result:
    cdef protocol obj
    response = obj.cpp_calculate_legacy_sig_digest(transaction, chain_id)
    return response.value, response.content, response.exception_message

@return_python_result
def get_public_key_from_signature(digest: bytes, signature: bytes) -> python_result:
    cdef protocol obj
    response = obj.cpp_get_public_key_from_signature(digest, signature)
    return response.value, response.content, response.exception_message

@return_python_result
def serialize_transaction(transaction: bytes) -> python_result:
    cdef protocol obj
    response = obj.cpp_serialize_transaction(transaction)
    return response.value, response.content, response.exception_message

@return_python_result
def deserialize_transaction(transaction: bytes)  -> python_result:
    cdef protocol obj
    response = obj.cpp_deserialize_transaction(transaction)
    return response.value, response.content, response.exception_message

@return_python_result
def generate_private_key() -> python_result:
    cdef protocol obj
    response =  obj.cpp_generate_private_key()
    return response.value, response.content, response.exception_message

def generate_password_based_private_key(account: string, role: string, password: string) -> python_private_key_data:
    cdef protocol obj
    pkd = obj.cpp_generate_private_key(account, role, password)
    return python_private_key_data(pkd.wif_private_key, pkd.associated_public_key)

def suggest_brain_key() -> python_brain_key_data:
    cdef protocol obj
    bki = obj.cpp_suggest_brain_key()
    return python_brain_key_data(bki.brain_key, bki.wif_private_key, bki.associated_public_key)

@return_python_result
def calculate_public_key(wif: bytes) -> python_result:
    cdef protocol obj
    response = obj.cpp_calculate_public_key(wif)
    return response.value, response.content, response.exception_message

@return_python_result
def calculate_manabar_full_regeneration_time(now: int, max_mana: int, current_mana: int, last_update_time: int) -> python_result:
    cdef protocol obj
    response = obj.cpp_calculate_manabar_full_regeneration_time( now, max_mana, current_mana, last_update_time )
    return response.value, response.content, response.exception_message

@return_python_result
def calculate_current_manabar_value(now: int, max_mana: int, current_mana: int, last_update_time: int) -> python_result:
    cdef protocol obj
    response = obj.cpp_calculate_current_manabar_value( now, max_mana, current_mana, last_update_time )
    return response.value, response.content, response.exception_message

@return_python_json_asset
def general_asset(asset_num: int, amount: int) -> python_json_asset:
    cdef protocol obj
    response = obj.cpp_general_asset(asset_num, amount)
    return response.amount, response.precision, response.nai

@return_python_json_asset
def hive(amount: int) -> python_json_asset:
    cdef protocol obj
    response = obj.cpp_hive(amount)
    return response.amount, response.precision, response.nai

@return_python_json_asset
def hbd(amount: int) -> python_json_asset:
    cdef protocol obj
    response = obj.cpp_hbd(amount)
    return response.amount, response.precision, response.nai

@return_python_json_asset
def vests(amount: int) -> python_json_asset:
    cdef protocol obj
    response = obj.cpp_vests(amount)
    return response.amount, response.precision, response.nai

@return_python_ref_block_data
def get_tapos_data(block_id: bytes) -> python_ref_block_data:
    cdef protocol obj
    response = obj.cpp_get_tapos_data(block_id)
    return response.ref_block_num, response.ref_block_prefix

@return_python_result
def calculate_hp_apr(
    head_block_num: int,
    vesting_reward_percent: int,
    virtual_supply: python_json_asset,
    total_vesting_fund_hive: python_json_asset
) -> python_result:
    cdef protocol obj
    cdef json_asset _virtual_supply = json_asset(virtual_supply.amount, virtual_supply.precision, virtual_supply.nai)
    cdef json_asset _total_vesting_fund_hive = json_asset(total_vesting_fund_hive.amount, total_vesting_fund_hive.precision, total_vesting_fund_hive.nai)
    response = obj.cpp_calculate_hp_apr(head_block_num, vesting_reward_percent, _virtual_supply, _total_vesting_fund_hive)
    return response.value, response.content, response.exception_message

@return_python_json_asset
def calculate_hbd_to_hive(hbd: python_json_asset, base: python_json_asset, quote: python_json_asset ) -> python_json_asset:
    cdef protocol obj
    cdef json_asset _hbd = json_asset(hbd.amount, hbd.precision, hbd.nai)
    cdef json_asset _base = json_asset(base.amount, base.precision, base.nai)
    cdef json_asset _quote = json_asset(quote.amount, quote.precision, quote.nai)
    response = obj.cpp_hbd_to_hive(_hbd, _base, _quote)
    return response.amount, response.precision, response.nai

@return_python_json_asset
def calculate_vests_to_hp(vests: python_json_asset, total_vesting_fund_hive: python_json_asset, total_vesting_shares: python_json_asset) -> python_json_asset:
    cdef protocol obj
    cdef json_asset _vests = json_asset(vests.amount, vests.precision, vests.nai)
    cdef json_asset _total_vesting_fund_hive = json_asset(total_vesting_fund_hive.amount, total_vesting_fund_hive.precision, total_vesting_fund_hive.nai)
    cdef json_asset _total_vesting_shares = json_asset(total_vesting_shares.amount, total_vesting_shares.precision, total_vesting_shares.nai)
    response = obj.cpp_vests_to_hp(_vests, _total_vesting_fund_hive, _total_vesting_shares)
    return response.amount, response.precision, response.nai

def calculate_account_hp(vests: python_json_asset, total_vesting_fund_hive: python_json_asset, total_vesting_shares: python_json_asset) -> python_json_asset:
    response = calculate_vests_to_hp(vests, total_vesting_fund_hive, total_vesting_shares)
    return response

def calculate_witness_votes_hp(votes: int, total_vesting_fund_hive: python_json_asset, total_vesting_shares: python_json_asset) -> python_json_asset:
    cdef protocol obj
    _vests: python_json_asset = vests(votes) 
    response = calculate_vests_to_hp(_vests, total_vesting_fund_hive, total_vesting_shares)
    return response

@return_python_result
def calculate_inflation_rate_for_block(
    block_num: int
) -> python_result:
    cdef protocol obj
    response = obj.cpp_calculate_inflation_rate_for_block(block_num)
    return response.value, response.content, response.exception_message

@return_python_result
def validate_proto_operation(operation: bytes) -> python_result:
    cdef proto_protocol obj
    response = obj.cpp_validate_operation(operation)
    return response.value, response.content, response.exception_message

@return_python_result
def validate_proto_transaction(transaction: bytes) -> python_result:
  cdef proto_protocol obj
  response = obj.cpp_validate_transaction( transaction )
  return response.value, response.content, response.exception_message

@return_python_result
def calculate_proto_transaction_id(transaction: bytes) -> python_result:
  cdef proto_protocol obj
  response = obj.cpp_calculate_transaction_id( transaction )
  return response.value, response.content, response.exception_message

@return_python_result
def calculate_proto_legacy_transaction_id(transaction: bytes) -> python_result:
  cdef proto_protocol obj
  response = obj.cpp_calculate_legacy_transaction_id( transaction )
  return response.value, response.content, response.exception_message

@return_python_result
def calculate_proto_sig_digest(transaction: bytes, chain_id: bytes) -> python_result:
  cdef proto_protocol obj
  response = obj.cpp_calculate_sig_digest( transaction, chain_id )
  return response.value, response.content, response.exception_message

@return_python_result
def calculate_proto_legacy_sig_digest(transaction: bytes, chain_id: bytes) -> python_result:
  cdef proto_protocol obj
  response = obj.cpp_calculate_legacy_sig_digest( transaction, chain_id )
  return response.value, response.content, response.exception_message

@return_python_result
def serialize_proto_transaction(transaction: bytes) -> python_result:
  cdef proto_protocol obj
  response = obj.cpp_serialize_transaction( transaction )
  return response.value, response.content, response.exception_message

@return_python_result
def deserialize_proto_transaction(transaction: bytes)  -> python_result:
    cdef proto_protocol obj
    response = obj.cpp_deserialize_transaction(transaction)
    return response.value, response.content, response.exception_message

@return_python_result
def proto_to_api(operation_or_tx: bytes) -> python_result:
  cdef proto_protocol obj
  response = obj.cpp_proto_to_api( operation_or_tx )
  return response.value, response.content, response.exception_message

@return_python_result
def proto_to_legacy_api(operation_or_tx: bytes) -> python_result:
  cdef proto_protocol obj
  response = obj.cpp_proto_to_legacy_api( operation_or_tx )
  return response.value, response.content, response.exception_message

@return_python_result
def api_to_proto(operation_or_tx: bytes) -> python_result:
  cdef proto_protocol obj
  response = obj.cpp_api_to_proto( operation_or_tx )
  return response.value, response.content, response.exception_message

def get_transaction_required_authorities( transaction: bytes ) -> python_required_authority_collection:
    cdef protocol obj
    cdef required_authority_collection collection = obj.cpp_collect_transaction_required_authorities(transaction)

    op = set(collection.posting_accounts)
    oa = set(collection.active_accounts)
    oo = set(collection.owner_accounts)

    return python_required_authority_collection(
      posting_accounts=op,
      active_accounts=oa,
      owner_accounts=oo
    )

def encode_encrypted_memo(encrypted_content: string, main_encryption_key: string, other_encryption_key: string = b'') -> string:
    cdef protocol obj
    cdef crypto_memo data_to_encode
    data_to_encode._from = main_encryption_key
    if other_encryption_key == '':
      other_encryption_key = main_encryption_key

    data_to_encode.to = other_encryption_key
    data_to_encode.content = encrypted_content
    encoded_memo = obj.cpp_crypto_memo_dump_string(data_to_encode)
    return encoded_memo

def decode_encrypted_memo(encoded_memo: string) -> python_encrypted_memo:
    cdef protocol obj
    decoded = obj.cpp_crypto_memo_from_string(encoded_memo)
    return python_encrypted_memo(
      main_encryption_key=decoded._from,
      other_encryption_key = decoded.to,
      encrypted_content = decoded.content
    )

def verify_exception_handling(throw_type: int) -> None:
    cdef protocol obj
    obj.cpp_throws(throw_type)
