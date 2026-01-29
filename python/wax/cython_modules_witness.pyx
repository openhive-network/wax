# -*- coding: utf-8 -*-
# distutils: language = c++
# Witness-related functions - witness set properties serialization/deserialization

from libcpp.string cimport string as cppstring
from libcpp.optional cimport optional
from libc.stdint cimport uint16_t, uint32_t, int32_t

from cython_modules_common cimport protocol, json_asset, json_price, witness_set_properties_data, witness_set_properties_serialized
from cython_modules_common import encode_str, decode_bytes
from wax.wax_result import python_witness_set_properties_data, python_json_asset, python_price


def serialize_witness_set_properties(input_props: python_witness_set_properties_data) -> dict[str, str]:
    """Serialize witness set properties to binary format."""
    cdef protocol obj
    cdef witness_set_properties_data _props_to_serialize
    _props_to_serialize.key = encode_str(input_props.key)
    cdef optional[cppstring] str_opt
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
        c_str = encode_str(input_props.new_signing_key)
        str_opt = c_str
        _props_to_serialize.new_signing_key = str_opt

    if input_props.account_creation_fee is not None:
        _base = json_asset(encode_str(input_props.account_creation_fee.amount),
            input_props.account_creation_fee.precision,
            encode_str(input_props.account_creation_fee.nai)
        )
        _props_to_serialize.account_creation_fee = _base

    if input_props.url is not None:
        c_str = encode_str(input_props.url)
        str_opt = c_str
        _props_to_serialize.url = str_opt

    if input_props.hbd_exchange_rate is not None:
        _base = json_asset(encode_str(input_props.hbd_exchange_rate.base.amount),
            input_props.hbd_exchange_rate.base.precision,
            encode_str(input_props.hbd_exchange_rate.base.nai))

        _quote = json_asset(encode_str(input_props.hbd_exchange_rate.quote.amount),
            input_props.hbd_exchange_rate.quote.precision,
            encode_str(input_props.hbd_exchange_rate.quote.nai))

        _price_helper.base = _base
        _price_helper.quote = _quote

        _price_opt = _price_helper
        _props_to_serialize.hbd_exchange_rate = _price_opt

    if input_props.maximum_block_size is not None:
        _uint_helper = int(input_props.maximum_block_size)
        _uint_opt = _uint_helper
        _props_to_serialize.maximum_block_size = _uint_opt

    if input_props.hbd_interest_rate is not None:
        _rate_helper = input_props.hbd_interest_rate
        _rate_opt = _rate_helper
        _props_to_serialize.hbd_interest_rate = _rate_opt

    if input_props.account_subsidy_budget is not None:
        _subsidy_budget = int(input_props.account_subsidy_budget)
        subsidy_budget = _subsidy_budget
        _props_to_serialize.account_subsidy_budget = subsidy_budget

    if input_props.account_subsidy_decay is not None:
        _uint_helper = int(input_props.account_subsidy_decay)
        _uint_opt = _uint_helper
        _props_to_serialize.account_subsidy_decay = _uint_opt

    serialized_properties = obj.cpp_serialize_witness_set_properties(_props_to_serialize)
    # Convert C++ map to Python dict, then decode keys and values from bytes to str
    return {decode_bytes(k): decode_bytes(v) for k, v in dict(serialized_properties).items()}


def deserialize_witness_set_properties(serialized_properties: dict[str, str]) -> python_witness_set_properties_data:
    """Deserialize binary witness set properties to structured format."""
    cdef protocol obj
    cdef witness_set_properties_serialized _serialized_props

    for prop, value in serialized_properties.items():
        _serialized_props[encode_str(prop)] = encode_str(value)

    deserialized_props = obj.cpp_deserialize_witness_set_properties(_serialized_props)

    ret_val = python_witness_set_properties_data(key=decode_bytes(deserialized_props.key))

    if deserialized_props.new_signing_key.has_value():
        ret_val.new_signing_key = decode_bytes(deserialized_props.new_signing_key.value())

    if deserialized_props.account_creation_fee.has_value():
        ret_val.account_creation_fee = python_json_asset(
            decode_bytes(deserialized_props.account_creation_fee.value().amount),
            deserialized_props.account_creation_fee.value().precision,
            decode_bytes(deserialized_props.account_creation_fee.value().nai)
        )

    if deserialized_props.url.has_value():
        ret_val.url = decode_bytes(deserialized_props.url.value())

    if deserialized_props.hbd_exchange_rate.has_value():
        _source = deserialized_props.hbd_exchange_rate.value()
        _base = python_json_asset(decode_bytes(_source.base.amount),
            _source.base.precision,
            decode_bytes(_source.base.nai))

        _quote = python_json_asset(decode_bytes(_source.quote.amount),
            _source.quote.precision,
            decode_bytes(_source.quote.nai))

        ret_val.hbd_exchange_rate = python_price(base=_base, quote=_quote)

    if deserialized_props.maximum_block_size.has_value():
        ret_val.maximum_block_size = int(deserialized_props.maximum_block_size.value())

    if deserialized_props.hbd_interest_rate.has_value():
        ret_val.hbd_interest_rate = int(deserialized_props.hbd_interest_rate.value())

    if deserialized_props.account_subsidy_budget.has_value():
        ret_val.account_subsidy_budget = int(deserialized_props.account_subsidy_budget.value())

    if deserialized_props.account_subsidy_decay.has_value():
        ret_val.account_subsidy_decay = int(deserialized_props.account_subsidy_decay.value())

    return ret_val
