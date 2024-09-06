# -*- coding: utf-8 -*-
# distutils: language = c++

from typing import Callable
from functools import wraps

from libcpp.string cimport string as cppstring
from libcpp.set cimport set as cppset
from libcpp.map cimport map as cppmap
from libcpp.vector cimport vector
from libcpp.optional cimport optional
from libc.stdint cimport uint16_t, uint32_t, int32_t

import cython
from cython.operator cimport dereference, preincrement

from wax cimport error_code, json_asset, json_price, result, protocol, proto_protocol
from .wax_result import (
    python_result,
    python_error_code,
    python_json_asset,
    python_ref_block_data,
    python_required_authority_collection,
    python_encrypted_memo,
    python_private_key_data,
    python_brain_key_data,
    python_witness_set_properties_data,
    python_price,
    python_authority,
    python_authorities,
)

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

def operation_get_impacted_accounts(operation: bytes) -> vector[string]:
    cdef protocol obj
    return obj.cpp_operation_get_impacted_accounts(operation)

def transaction_get_impacted_accounts(transaction: bytes) -> vector[string]:
    cdef protocol obj
    return obj.cpp_transaction_get_impacted_accounts(transaction)

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
def calculate_hive_to_hbd(amount: python_json_asset, base: python_json_asset, quote: python_json_asset ) -> python_json_asset:
    cdef protocol obj
    cdef json_asset _amount = json_asset(amount.amount, amount.precision, amount.nai)
    cdef json_asset _base = json_asset(base.amount, base.precision, base.nai)
    cdef json_asset _quote = json_asset(quote.amount, quote.precision, quote.nai)
    response = obj.cpp_hive_to_hbd(_amount, _base, _quote)
    return response.amount, response.precision, response.nai

@return_python_json_asset
def calculate_vests_to_hp(vests: python_json_asset, total_vesting_fund_hive: python_json_asset, total_vesting_shares: python_json_asset) -> python_json_asset:
    cdef protocol obj
    cdef json_asset _vests = json_asset(vests.amount, vests.precision, vests.nai)
    cdef json_asset _total_vesting_fund_hive = json_asset(total_vesting_fund_hive.amount, total_vesting_fund_hive.precision, total_vesting_fund_hive.nai)
    cdef json_asset _total_vesting_shares = json_asset(total_vesting_shares.amount, total_vesting_shares.precision, total_vesting_shares.nai)
    response = obj.cpp_vests_to_hp(_vests, _total_vesting_fund_hive, _total_vesting_shares)
    return response.amount, response.precision, response.nai

@return_python_json_asset
def calculate_hp_to_vests(hive: python_json_asset, total_vesting_fund_hive: python_json_asset, total_vesting_shares: python_json_asset) -> python_json_asset:
    cdef protocol obj
    cdef json_asset _hive = json_asset(hive.amount, hive.precision, hive.nai)
    cdef json_asset _total_vesting_fund_hive = json_asset(total_vesting_fund_hive.amount, total_vesting_fund_hive.precision, total_vesting_fund_hive.nai)
    cdef json_asset _total_vesting_shares = json_asset(total_vesting_shares.amount, total_vesting_shares.precision, total_vesting_shares.nai)
    response = obj.cpp_hp_to_vests(_hive, _total_vesting_fund_hive, _total_vesting_shares)
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

@return_python_json_asset
def estimate_hive_collateral(current_median_history: python_price, current_min_history: python_price, hbd_amount_to_get: python_json_asset ) -> python_json_asset:
    cdef protocol obj

    cdef json_asset _current_median_history_base = json_asset(current_median_history.base.amount, current_median_history.base.precision, current_median_history.base.nai)
    cdef json_asset _current_median_history_quote = json_asset(current_median_history.quote.amount, current_median_history.quote.precision, current_median_history.quote.nai)

    cdef json_asset _current_min_history_base = json_asset(current_min_history.base.amount, current_min_history.base.precision, current_min_history.base.nai)
    cdef json_asset _current_min_history_quote = json_asset(current_min_history.quote.amount, current_min_history.quote.precision, current_min_history.quote.nai)

    cdef json_price _current_median_history
    _current_median_history.base = _current_median_history_base
    _current_median_history.quote = _current_median_history_quote

    cdef json_price _current_min_history
    _current_min_history.base = _current_min_history_base
    _current_min_history.quote = _current_min_history_quote

    cdef json_asset _hbd_amount_to_get = json_asset(hbd_amount_to_get.amount, hbd_amount_to_get.precision, hbd_amount_to_get.nai)

    response = obj.cpp_estimate_hive_collateral(_current_median_history, _current_min_history, _hbd_amount_to_get)
    return response.amount, response.precision, response.nai

def operation_get_impacted_accounts(operation: bytes) -> vector[string]:
    cdef proto_protocol obj
    return obj.cpp_operation_get_impacted_accounts(operation)

def transaction_get_impacted_accounts(transaction: bytes) -> vector[string]:
    cdef proto_protocol obj
    return obj.cpp_transaction_get_impacted_accounts(transaction)

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
    other_auths = []
    for auth in collection.other_authorities:
      other_auths.append(python_authority(
        weight_threshold = auth.weight_threshold,
        key_auths = auth.key_auths,
        account_auths = auth.account_auths
      ))

    return python_required_authority_collection(
      posting_accounts=op,
      active_accounts=oa,
      owner_accounts=oo,
      other_authorities=other_auths,
    )

def encode_encrypted_memo(encrypted_content: bytes, main_encryption_key: bytes, other_encryption_key: bytes = b'') -> bytes:
    cdef protocol obj
    cdef crypto_memo data_to_encode
    data_to_encode._from = main_encryption_key
    if other_encryption_key == b'':
      other_encryption_key = main_encryption_key

    data_to_encode.to = other_encryption_key
    data_to_encode.content = encrypted_content
    encoded_memo = obj.cpp_crypto_memo_dump_string(data_to_encode)
    return encoded_memo

def decode_encrypted_memo(encoded_memo: bytes) -> python_encrypted_memo:
    cdef protocol obj
    decoded = obj.cpp_crypto_memo_from_string(encoded_memo)
    return python_encrypted_memo(
      main_encryption_key=decoded._from,
      other_encryption_key = decoded.to,
      encrypted_content = decoded.content
    )

def serialize_witness_set_properties(input_props: python_witness_set_properties_data) -> dict[bytes, bytes]:
    cdef protocol obj
    cdef witness_set_properties_data _props_to_serialize
    _props_to_serialize.key = input_props.key
    cdef optional[string] str_opt
    cdef cppstring c_str

    cdef uint16_t _rate_helper
    cdef optional[uint16_t] _rate_opt

    cdef int32_t _subsidy_budget
    cdef optional[int32_t] subsidy_budget
    cdef uint32_t _uint_helper
    cdef optional[uint32_t] _uint_opt

    cdef json_asset _base
    cdef json_asset _quote
    cdef json_price _price_helper
    cdef optional[json_price] _price_opt

    if input_props.new_signing_key is not None:
      if isinstance(input_props.new_signing_key, str):
        byte_string = input_props.new_signing_key.encode('utf-8')
      else:
        byte_string = input_props.new_signing_key

      c_str = byte_string
      str_opt=c_str
      _props_to_serialize.new_signing_key=str_opt

    if input_props.account_creation_fee is not None:
      _base = json_asset(input_props.account_creation_fee.amount,
        input_props.account_creation_fee.precision,
        input_props.account_creation_fee.nai
        )
      _props_to_serialize.account_creation_fee=_base

    if input_props.url is not None:
      if isinstance(input_props.url, str):
        byte_string = input_props.url.encode('utf-8')
      else:
        byte_string = input_props.url

      c_str = byte_string
      str_opt=c_str
      _props_to_serialize.url=str_opt

    if input_props.hbd_exchange_rate is not None:
      _base = json_asset(input_props.hbd_exchange_rate.base.amount,
        input_props.hbd_exchange_rate.base.precision,
        input_props.hbd_exchange_rate.base.nai)

      _quote = json_asset(input_props.hbd_exchange_rate.quote.amount,
        input_props.hbd_exchange_rate.quote.precision,
        input_props.hbd_exchange_rate.quote.nai)

      _price_helper.base=_base
      _price_helper.quote=_quote

      _price_opt = _price_helper
      _props_to_serialize.hbd_exchange_rate=_price_opt 

    if input_props.maximum_block_size is not None:
      _uint_helper=int(input_props.maximum_block_size)
      _uint_opt=_uint_helper
      _props_to_serialize.maximum_block_size=_uint_opt

    if input_props.hbd_interest_rate is not None:
      _rate_helper=input_props.hbd_interest_rate
      _rate_opt=_rate_helper
      _props_to_serialize.hbd_interest_rate=_rate_opt

    if input_props.account_subsidy_budget is not None:
      _subsidy_budget=int(input_props.account_subsidy_budget)
      subsidy_budget = _subsidy_budget
      _props_to_serialize.account_subsidy_budget=subsidy_budget

    if input_props.account_subsidy_decay is not None:
      _uint_helper=int(input_props.account_subsidy_decay)
      _uint_opt=_uint_helper
      _props_to_serialize.account_subsidy_decay=_uint_opt

    serialized_properties = obj.cpp_serialize_witness_set_properties(_props_to_serialize)
    return serialized_properties

def deserialize_witness_set_properties(serialized_properties: dict[bytes, bytes]) -> python_witness_set_properties_data:
    cdef protocol obj
    cdef witness_set_properties_serialized _serialized_props

    for prop, value in serialized_properties.items():
      _serialized_props[prop] = value

    deserialized_props = obj.cpp_deserialize_witness_set_properties(_serialized_props)

    ret_val=python_witness_set_properties_data(key=deserialized_props.key)

    if deserialized_props.new_signing_key.has_value():
      ret_val.new_signing_key = bytes(deserialized_props.new_signing_key.value())

    if deserialized_props.account_creation_fee.has_value():
      ret_val.account_creation_fee = python_json_asset(deserialized_props.account_creation_fee.value().amount,
        deserialized_props.account_creation_fee.value().precision,
        deserialized_props.account_creation_fee.value().nai
        )

    if deserialized_props.url.has_value():
      ret_val.url = bytes(deserialized_props.url.value())

    if deserialized_props.hbd_exchange_rate.has_value():
      _source=deserialized_props.hbd_exchange_rate.value()
      _base = python_json_asset(_source.base.amount,
        _source.base.precision,
        _source.base.nai)

      _quote = python_json_asset(_source.quote.amount,
        _source.quote.precision,
        _source.quote.nai)

      ret_val.hbd_exchange_rate=python_price(base=_base, quote=_quote)

    if deserialized_props.maximum_block_size.has_value():
      ret_val.maximum_block_size=int(deserialized_props.maximum_block_size.value())

    if deserialized_props.hbd_interest_rate.has_value():
      ret_val.hbd_interest_rate=int(deserialized_props.hbd_interest_rate.value())

    if deserialized_props.account_subsidy_budget.has_value():
      ret_val.account_subsidy_budget=int(deserialized_props.account_subsidy_budget.value())

    if deserialized_props.account_subsidy_decay.has_value():
      ret_val.account_subsidy_decay=int(deserialized_props.account_subsidy_decay.value())

    return ret_val

cdef wax_authority python_authority_to_wax_authority(object auth_obj):
    auth = wax_authority()
    auth.weight_threshold = auth_obj.weight_threshold
    auth.key_auths = auth_obj.key_auths
    auth.account_auths = auth_obj.account_auths
    return auth

cdef wax_authorities python_authorities_to_wax_authorities(object auths_obj):
    auths = wax_authorities()
    auths.active = python_authority_to_wax_authority(auths_obj.active)
    auths.owner = python_authority_to_wax_authority(auths_obj.owner)
    auths.posting = python_authority_to_wax_authority(auths_obj.posting)
    return auths

cdef cppmap[cppstring, wax_authorities] retrieve_authorities_cb(vector[cppstring] account_names, void* retrieve_authorities_fn):
    cdef object obj = (<object>retrieve_authorities_fn)(account_names)
    cdef cppmap[cppstring, wax_authorities] result
    for k, v in obj.items():
        auths = python_authorities_to_wax_authorities(v)
        result[k] = auths
    return result

def collect_signing_keys(transaction: bytes, retrieve_authorities: Callable[[list[bytes]], dict[bytes, python_authorities]]) -> list[bytes]:
    cdef protocol obj
    return obj.cpp_collect_signing_keys(transaction, retrieve_authorities_cb, <void*>(retrieve_authorities))

def check_memo_for_private_keys(memo: bytes, account: bytes, auths: python_authorities, memo_key: bytes, imported_keys: list[bytes]) -> None:
    cdef protocol obj
    cdef wax_authorities wax_auths = python_authorities_to_wax_authorities(auths)
    obj.cpp_check_memo_for_private_keys(memo, account, wax_auths, memo_key, imported_keys)

cdef cppstring get_witness_key_cb(cppstring account_name, void* get_witness_key_fn):
    cdef result = (<object>get_witness_key_fn)(account_name)
    return result

def minimize_required_signatures(
    signed_transaction: bytes,
    minimize_required_signatures_data: python_minimize_required_signatures_data,
) -> list[bytes]:
    cdef protocol obj
    cdef minimize_required_signatures_data_t wax_minimize_required_signatures_data
    cdef uint32_t _uint_helper

    wax_minimize_required_signatures_data.chain_id = minimize_required_signatures_data.chain_id
    wax_minimize_required_signatures_data.available_keys = minimize_required_signatures_data.available_keys
    for k, v in minimize_required_signatures_data.authorities_map.items():
        auths = python_authorities_to_wax_authorities(v)
        wax_minimize_required_signatures_data.authorities_map[k] = auths
    wax_minimize_required_signatures_data.get_witness_key_cb = get_witness_key_cb
    wax_minimize_required_signatures_data.get_witness_key_fn = <void*>minimize_required_signatures_data.get_witness_key
    if minimize_required_signatures_data.max_recursion is not None:
        _uint_helper = int(minimize_required_signatures_data.max_recursion)
        wax_minimize_required_signatures_data.max_recursion = _uint_helper
    if minimize_required_signatures_data.max_membership is not None:
        _uint_helper = int(minimize_required_signatures_data.max_membership)
        wax_minimize_required_signatures_data.max_membership = _uint_helper
    if minimize_required_signatures_data.max_account_auths is not None:
        _uint_helper = int(minimize_required_signatures_data.max_account_auths)
        wax_minimize_required_signatures_data.max_account_auths = _uint_helper
    return obj.cpp_minimize_required_signatures(signed_transaction, wax_minimize_required_signatures_data)

def verify_exception_handling(throw_type: int) -> None:
    cdef protocol obj
    obj.cpp_throws(throw_type)
