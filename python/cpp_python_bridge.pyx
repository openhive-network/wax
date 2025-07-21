# -*- coding: utf-8 -*-
# distutils: language = c++

from dataclasses import dataclass
from typing import Callable
from functools import wraps

from libcpp cimport bool
from libcpp.string cimport string as cppstring
from libcpp.set cimport set as cppset
from libcpp.map cimport map as cppmap
from libcpp.vector cimport vector
from libcpp.optional cimport optional, make_optional
from libcpp.utility cimport move
from libc.stdint cimport uint16_t, uint32_t, int32_t

import cython
from cython.operator cimport dereference, preincrement

from cpp_python_bridge cimport IAccountAuthorityProvider, json_asset, json_price, protocol, binary_data, binary_data_node, required_authority_collection, hive_transaction_handle, hive_operation_handle
from .wax_result import (
    python_json_asset,
    python_ref_block_data,
    python_required_authority_collection,
    python_encrypted_memo,
    python_private_key_data,
    python_binary_data,
    python_binary_data_node,
    python_authority_verification_trace,
    python_path_entry,
    python_brain_key_data,
    python_witness_set_properties_data,
    python_price,
    python_authority,
    python_authorities,
    python_minimize_required_signatures_data,
)

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

def calculate_public_key(wif: bytes) -> bytes:
    cdef protocol obj
    response = obj.cpp_calculate_public_key(wif)
    return response

def generate_private_key() -> bytes:
    cdef protocol obj
    response =  obj.cpp_generate_private_key()
    return response

def generate_password_based_private_key(account: string, role: string, password: string) -> python_private_key_data:
    cdef protocol obj
    pkd = obj.cpp_generate_private_key(account, role, password)
    return python_private_key_data(pkd.wif_private_key, pkd.associated_public_key)

def convert_raw_private_key_to_wif(hex_data: string) -> bytes:
    cdef protocol obj
    response =  obj.cpp_convert_raw_private_key_to_wif(hex_data)
    return response

def convert_raw_public_key_to_wif(hex_data: string) -> bytes:
    cdef protocol obj
    response =  obj.cpp_convert_raw_public_key_to_wif(hex_data)
    return response

def suggest_brain_key() -> python_brain_key_data:
    cdef protocol obj
    bki = obj.cpp_suggest_brain_key()
    return python_brain_key_data(bki.brain_key, bki.wif_private_key, bki.associated_public_key)

def get_hive_protocol_config(chain_id: bytes) -> dict[bytes, bytes]:
    cdef protocol obj
    return obj.cpp_get_hive_protocol_config(chain_id)

def get_public_key_from_signature(digest: bytes, signature: bytes) -> bytes:
    cdef protocol obj
    response = obj.cpp_get_public_key_from_signature(digest, signature)
    return response

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

def asset_value(value: python_json_asset) -> bytes:
    cdef protocol obj
    cdef json_asset _value = json_asset(value.amount, value.precision, value.nai)
    response =  obj.cpp_asset_value(_value)
    return response

def asset_symbol(value: python_json_asset) -> bytes:
    cdef protocol obj
    cdef json_asset _value = json_asset(value.amount, value.precision, value.nai)
    response =  obj.cpp_asset_symbol(_value)
    return response

def verify_exception_handling(throw_type: int) -> None:
    cdef protocol obj
    obj.cpp_throws(throw_type)

def decode_encrypted_memo(encoded_memo: bytes) -> python_encrypted_memo:
    cdef protocol obj
    decoded = obj.cpp_crypto_memo_from_string(encoded_memo)
    return python_encrypted_memo(
      main_encryption_key=decoded._from,
      other_encryption_key = decoded.to,
      encrypted_content = decoded.content
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

def check_memo_for_private_keys(memo: bytes, account: bytes, auths: python_authorities, memo_key: bytes, imported_keys: list[bytes]) -> None:
    cdef protocol obj
    cdef wax_authorities wax_auths = python_authorities_to_wax_authorities(auths)
    obj.cpp_check_memo_for_private_keys(memo, account, wax_auths, memo_key, imported_keys)

def calculate_manabar_full_regeneration_time(now: int, max_mana: int, current_mana: int, last_update_time: int) -> int:
    cdef protocol obj
    response = obj.cpp_calculate_manabar_full_regeneration_time( now, max_mana, current_mana, last_update_time )
    return response

def calculate_current_manabar_value(now: int, max_mana: int, current_mana: int, last_update_time: int) -> int:
    cdef protocol obj
    response = obj.cpp_calculate_current_manabar_value( now, max_mana, current_mana, last_update_time )
    return response

@return_python_ref_block_data
def get_tapos_data(block_id: bytes) -> python_ref_block_data:
    cdef protocol obj
    response = obj.cpp_get_tapos_data(block_id)
    return response.ref_block_num, response.ref_block_prefix

def calculate_hp_apr(
    head_block_num: int,
    vesting_reward_percent: int,
    virtual_supply: python_json_asset,
    total_vesting_fund_hive: python_json_asset
) -> bytes:
    cdef protocol obj
    cdef json_asset _virtual_supply = json_asset(virtual_supply.amount, virtual_supply.precision, virtual_supply.nai)
    cdef json_asset _total_vesting_fund_hive = json_asset(total_vesting_fund_hive.amount, total_vesting_fund_hive.precision, total_vesting_fund_hive.nai)
    response = obj.cpp_calculate_hp_apr(head_block_num, vesting_reward_percent, _virtual_supply, _total_vesting_fund_hive)
    return response

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

def calculate_inflation_rate_for_block(block_num: int) -> int:
    cdef protocol obj
    response = obj.cpp_calculate_inflation_rate_for_block(block_num)
    return response

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

def is_valid_account_name(account_name: bytes) -> bool:
    cdef protocol obj
    return obj.cpp_is_valid_account_name(account_name)

cdef class PyIAccountAuthorityProvider(IAccountAuthorityProvider):
    cdef object getAuthority_func
    cdef object getWitnessPublicKey_func

    def __cinit__(self, object getAuthority_func, object getWitnessPublicKey_func):
        self.getAuthority_func = getAuthority_func
        self.getWitnessPublicKey_func = getWitnessPublicKey_func

    cdef optional[string] getAuthority(self, string name, string role):
        cdef object result = self.getAuthority_func(name.encode(), role.encode())
        return optional[string]() if result is None else make_optional[string](result)

    cdef optional[string] getWitnessPublicKey(self, string name, string role):
        cdef object result = self.getWitnessPublicKey_func(name.encode(), role.encode())
        return optional[string]() if result is None else make_optional[string](result)

def pylist_to_cppvector_str(lst: list[str]) -> vector[string]:
    cdef vector[string] cpp_vec
    cdef str item
    for item in lst:
        cpp_vec.push_back(string(item))  # convert Python str -> C++ string
    return cpp_vec

def pylist_to_cppvector_wax_authority(lst: list[wax_authority]) -> vector[wax_authority]:
    cdef vector[wax_authority] cpp_vec
    cdef wax_authority item
    for item in lst:
        cpp_vec.push_back(python_authority_to_wax_authority(item))  # convert Python wax_authority -> C++ wax_authority
    return cpp_vec

cdef object convert_path_entry_to_python(path_entry node):
    """Recursively convert C++ path_entry to Python python_path_entry."""
    cdef list children = []

    # Recursively convert all children
    for child in node.visited_entries:
        children.append(convert_path_entry_to_python(child))

    # Create and return the Python object
    return python_path_entry(
        processed_entry=node.processed_entry,
        processed_role=node.processed_role,
        recursion_depth=node.recursion_depth,
        treshold=node.treshold,
        weight=node.weight,
        flags=node.flags,
        visited_entries=children
    )

def trace_authority_verification(
    required_authorities: python_required_authority_collection,
    decoded_signature_public_keys: list[bytes],
    get_authority: Callable[[bytes, bytes], bytes | None],
    get_witness_public_key: Callable[[bytes], bytes | None]
) -> authority_verification_trace:
    cdef protocol obj
    cdef PyIAccountAuthorityProvider cb = IAccountAuthorityProvider(get_authority, get_witness_public_key)
    cdef required_authority_collection wax_required_authorities
    wax_required_authorities.posting_accounts = pylist_to_cppvector_str(required_authorities.posting_accounts)
    wax_required_authorities.active_accounts = pylist_to_cppvector_str(required_authorities.active_accounts)
    wax_required_authorities.owner_accounts = pylist_to_cppvector_str(required_authorities.owner_accounts)
    wax_required_authorities.other_authorities = pylist_to_cppvector_wax_authority(required_authorities.other_authorities)
    cdef authority_verification_trace data = obj.cpp_trace_authority_verification(
        wax_required_authorities,
        decoded_signature_public_keys,
        cb
    )
    cdef list root = []
    for node in data.root:
        root.append(convert_path_entry_to_python(node))
    cdef list final_authority_path = []
    for node in data.final_authority_path:
        final_authority_path.append(convert_path_entry_to_python(node))

    return python_authority_verification_trace(
        root=root,
        final_authority_path=final_authority_path,
        verification_status=verification_status
    )

    convert_path_entry_to_python

def get_default_comment_options_operation() -> bytes:
    cdef protocol obj
    response = obj.cpp_get_default_comment_options_operation()
    return response

def deserialize_transaction(transaction_data: bytes) -> WaxTransactionHandle:
    cdef protocol obj
    cdef hive_transaction_handle hTx = obj.cpp_deserialize_transaction(transaction_data)
    # Wrap the C++ python_transaction pointer in the Python WaxTransactionHandle class.
    cdef WaxTransactionHandle wax_tx = WaxTransactionHandle.__new__(WaxTransactionHandle)
    wax_tx.hTx = move(hTx)
    return wax_tx

def deserialize_operation(operation_data: bytes) -> WaxOperationHandle:
    cdef protocol obj
    cdef hive_operation_handle hOp = obj.cpp_deserialize_operation(operation_data)
    # Wrap the C++ operation pointer in the Python WaxOperationHandle class.
    cdef WaxOperationHandle wax_op = WaxOperationHandle.__new__(WaxOperationHandle)
    wax_op.hOp = move(hOp)
    return wax_op

cdef object convert_binary_data_node_to_python(binary_data_node node):
    """Recursively convert C++ binary_data_node to Python python_binary_data_node."""
    cdef list children = []

    # Recursively convert all children
    for child in node.children:
        children.append(convert_binary_data_node_to_python(child))

    # Create and return the Python object
    return python_binary_data_node(
        key=node.key,
        type=node.type,
        offset=node.offset,
        size=node.size,
        value=node.value,
        length=node.length,
        children=children
    )

def op_impacted_accounts(wax_op: WaxOperationHandle) -> vector[string]:
    cdef protocol obj
    # Call the C++ method to get the impacted accounts for the operation.
    return obj.cpp_op_impacted_accounts(wax_op.hOp)

def op_to_binary(wax_op: WaxOperationHandle, use_hf26_serialization: bool = True) -> bytes:
    cdef protocol obj
    # Call the C++ method to convert the operation to binary format.
    return obj.cpp_op_to_binary(wax_op.hOp, use_hf26_serialization)

def op_binary(wax_op: WaxOperationHandle, use_hf26_serialization: bool = True) -> python_binary_data:
    cdef protocol obj
    # Call the C++ method to get the binary data of the operation.
    cdef binary_data data = obj.cpp_op_binary(wax_op.hOp, use_hf26_serialization)
    # Convert the C++ binary_data to a Python binary_data.
    cdef list offsets = []
    for node in data.offsets:
        offsets.append(convert_binary_data_node_to_python(node))
    # Wrap the C++ binary_data in a Python python_binary_data class.
    return python_binary_data(
        binary=data.binary,
        offsets=offsets
    )

def op_validate(wax_op: WaxOperationHandle) -> None:
    cdef protocol obj
    # Call the C++ method to validate the operation.
    obj.cpp_op_validate(wax_op.hOp)

def op_required_authorities(wax_op: WaxOperationHandle) -> python_required_authority_collection:
    cdef protocol obj
    # Call the C++ method to get the required authorities for the operation.
    cdef required_authority_collection collection = obj.cpp_op_required_authorities(wax_op.hOp)

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

def tx_add_operation(wax_tx: WaxTransactionHandle, wax_op: WaxOperationHandle) -> None:
    cdef protocol obj
    # Call the C++ method to add the operation to the transaction.
    obj.cpp_tx_add_operation(wax_tx.hTx, wax_op.hOp)

def tx_add_signature(wax_tx: WaxTransactionHandle, signature: bytes) -> None:
    cdef protocol obj
    # Call the C++ method to add the signature to the transaction.
    obj.cpp_tx_add_signature(wax_tx.hTx, signature)

def tx_set_expiration(wax_tx: WaxTransactionHandle, expiration: bytes) -> None:
    cdef protocol obj
    # Call the C++ method to set the expiration for the transaction.
    obj.cpp_tx_set_expiration(wax_tx.hTx, expiration)

def tx_to_legacy_json(wax_tx: WaxTransactionHandle) -> bytes:
    cdef protocol obj
    # Call the C++ method to convert the transaction to legacy JSON format.
    return obj.cpp_tx_to_legacy_json(wax_tx.hTx)

def tx_to_binary(wax_tx: WaxTransactionHandle, use_hf26_serialization: bool = True, strip_to_unsigned_transaction: bool = False) -> bytes:
    cdef protocol obj
    # Call the C++ method to convert the transaction to binary format.
    return obj.cpp_tx_to_binary(wax_tx.hTx, use_hf26_serialization, strip_to_unsigned_transaction)

def tx_to_json(wax_tx: WaxTransactionHandle) -> bytes:
    cdef protocol obj
    # Call the C++ method to convert the transaction to JSON format.
    return obj.cpp_tx_to_json(wax_tx.hTx)

def tx_id(wax_tx: WaxTransactionHandle, use_hf26_serialization: bool = True) -> bytes:
    cdef protocol obj
    # Call the C++ method to get the transaction ID.
    return obj.cpp_tx_id(wax_tx.hTx, use_hf26_serialization)

def tx_binary(wax_tx: WaxTransactionHandle, use_hf26_serialization: bool = True, strip_to_unsigned_transaction: bool = False) -> python_binary_data:
    cdef protocol obj
    # Call the C++ method to get the binary data of the transaction.
    cdef binary_data data = obj.cpp_tx_binary(wax_tx.hTx, use_hf26_serialization, strip_to_unsigned_transaction)
    # Convert the C++ binary_data to a Python binary_data.
    cdef list offsets = []
    for node in data.offsets:
        offsets.append(convert_binary_data_node_to_python(node))
    # Wrap the C++ binary_data in a Python python_binary_data class.
    return python_binary_data(
        binary=data.binary,
        offsets=offsets
    )

def tx_required_authorities(wax_tx: WaxTransactionHandle) -> python_required_authority_collection:
    cdef protocol obj
    # Call the C++ method to get the required authorities for the transaction.
    cdef required_authority_collection collection = obj.cpp_tx_required_authorities(wax_tx.hTx)

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

def tx_impacted_accounts(wax_tx: WaxTransactionHandle) -> vector[string]:
    cdef protocol obj
    # Call the C++ method to get the impacted accounts for the transaction.
    return obj.cpp_tx_impacted_accounts(wax_tx.hTx)

def tx_signature_keys(wax_tx: WaxTransactionHandle, chain_id: bytes, use_hf26_serialization: bool = True) -> vector[string]:
    cdef protocol obj
    # Call the C++ method to get the signature keys for the transaction.
    return obj.cpp_tx_signature_keys(wax_tx.hTx, chain_id, use_hf26_serialization)

def tx_sig_digest(wax_tx: WaxTransactionHandle, chain_id: bytes, use_hf26_serialization: bool = True) -> bytes:
    cdef protocol obj
    # Call the C++ method to get the signature digest for the transaction.
    return obj.cpp_tx_sig_digest(wax_tx.hTx, chain_id, use_hf26_serialization)

def tx_validate(wax_tx: WaxTransactionHandle) -> None:
    cdef protocol obj
    # Call the C++ method to validate the transaction.
    obj.cpp_tx_validate(wax_tx.hTx)

# ============================================================================

def tx_proto_to_api( tx: object ) -> None:
    cdef protocol obj
    # Call the C++ method to convert the transaction from proto to API format.
    obj.cpp_tx_proto_to_api( tx )

def tx_api_to_proto( object transaction ) -> None:
    cdef protocol obj
    # Call the C++ method to convert the transaction from API to proto format.
    obj.cpp_tx_api_to_proto( transaction )

cdef class WaxTransactionHandle:
  cdef hive_transaction_handle hTx

cdef class WaxOperationHandle:
  cdef hive_operation_handle hOp

def create_wax_transaction(tx: object, is_protobuf: bool) -> WaxTransactionHandle:
    cdef protocol obj
    # Call the C++ method which returns a transaction pointer.
    cdef hive_transaction_handle hTx = obj.cpp_create_transaction_handle( tx, is_protobuf )
    # Wrap the C++ python_transaction pointer in the Python WaxTransactionHandle class.
    cdef WaxTransactionHandle wax_tx = WaxTransactionHandle.__new__(WaxTransactionHandle)
    wax_tx.hTx = move(hTx)
    return wax_tx

def create_wax_operation(op: object, is_protobuf: bool) -> WaxOperationHandle:
    cdef protocol obj
    # Call the C++ method which returns an operation pointer.
    cdef hive_operation_handle hOp = obj.cpp_create_operation_handle( op, is_protobuf )
    # Wrap the C++ operation pointer in the Python WaxOperationHandle class.
    cdef WaxOperationHandle wax_op = WaxOperationHandle.__new__(WaxOperationHandle)
    wax_op.hOp = move(hOp)
    return wax_op

# ============================================================================

def calculate_account_hp(vests: python_json_asset, total_vesting_fund_hive: python_json_asset, total_vesting_shares: python_json_asset) -> python_json_asset:
    response = calculate_vests_to_hp(vests, total_vesting_fund_hive, total_vesting_shares)
    return response

def calculate_witness_votes_hp(votes: int, total_vesting_fund_hive: python_json_asset, total_vesting_shares: python_json_asset) -> python_json_asset:
    cdef protocol obj
    _vests: python_json_asset = vests(votes)
    response = calculate_vests_to_hp(_vests, total_vesting_fund_hive, total_vesting_shares)
    return response

def python_authority_to_wax_authority(python_wax_authority auth_obj) -> wax_authority:
    cdef wax_authority auth
    auth.weight_threshold = auth_obj.weight_threshold
    auth.key_auths = auth_obj.key_auths
    auth.account_auths = auth_obj.account_auths
    return auth
