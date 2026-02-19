# -*- coding: utf-8 -*-
# distutils: language = c++
# Asset-related functions - HIVE, HBD, VESTS, conversions, manabar, HP, APR

from libc.stdint cimport uint16_t, uint32_t, uint64_t

from cython_modules_common cimport protocol, json_asset, json_price
from cython_modules_common import encode_str
from wax.wax_result import (
    python_result,
    python_json_asset,
    python_ref_block_data,
    python_price,
)

# Include shared decorators (these are def functions, cannot be cimported)
include "_decorators.pxi"


cdef json_asset encode_json_asset(object asset):
    """Convert python_json_asset to C++ json_asset, encoding strings as bytes for C++."""
    return json_asset(encode_str(asset.amount), asset.precision, encode_str(asset.nai))


@wax_error_boundary
@return_python_json_asset
def general_asset(asset_num: long, amount: long) -> python_json_asset:
    """Create a general asset with given NAI and amount."""
    cdef protocol obj
    response = obj.cpp_general_asset(asset_num, amount)
    return response.amount, response.precision, response.nai


@wax_error_boundary
@return_python_json_asset
def hive(amount: int) -> python_json_asset:
    """Create a HIVE asset."""
    cdef protocol obj
    response = obj.cpp_hive(amount)
    return response.amount, response.precision, response.nai


@wax_error_boundary
@return_python_json_asset
def hbd(amount: int) -> python_json_asset:
    """Create an HBD asset."""
    cdef protocol obj
    response = obj.cpp_hbd(amount)
    return response.amount, response.precision, response.nai


@wax_error_boundary
@return_python_json_asset
def vests(amount: int) -> python_json_asset:
    """Create a VESTS asset."""
    cdef protocol obj
    response = obj.cpp_vests(amount)
    return response.amount, response.precision, response.nai


@wax_error_boundary
@return_python_ref_block_data
def get_tapos_data(block_id: str) -> python_ref_block_data:
    """Get TAPOS (Transaction as Proof of Stake) data from a block ID."""
    cdef protocol obj
    response = obj.cpp_get_tapos_data(encode_str(block_id))
    return response.ref_block_num, response.ref_block_prefix


@wax_error_boundary
def calculate_manabar_full_regeneration_time(now: int, max_mana: int, current_mana: int, last_update_time: int) -> python_result:
    """Calculate when manabar will be fully regenerated."""
    cdef protocol obj
    response = obj.cpp_calculate_manabar_full_regeneration_time(now, max_mana, current_mana, last_update_time)
    return response


@wax_error_boundary
def calculate_current_manabar_value(now: int, max_mana: int, current_mana: int, last_update_time: int) -> python_result:
    """Calculate the current manabar value."""
    cdef protocol obj
    response = obj.cpp_calculate_current_manabar_value(now, max_mana, current_mana, last_update_time)
    return response


@wax_error_boundary
def calculate_hp_apr(
    head_block_num: int,
    vesting_reward_percent: int,
    virtual_supply: python_json_asset,
    total_vesting_fund_hive: python_json_asset
) -> python_result:
    """Calculate HP APR (Annual Percentage Rate)."""
    cdef protocol obj
    cdef json_asset _virtual_supply = encode_json_asset(virtual_supply)
    cdef json_asset _total_vesting_fund_hive = encode_json_asset(total_vesting_fund_hive)
    response = obj.cpp_calculate_hp_apr(head_block_num, vesting_reward_percent, _virtual_supply, _total_vesting_fund_hive)
    return response


@wax_error_boundary
@return_python_json_asset
def calculate_hbd_to_hive(hbd: python_json_asset, base: python_json_asset, quote: python_json_asset) -> python_json_asset:
    """Convert HBD to HIVE using given price."""
    cdef protocol obj
    cdef json_asset _hbd = encode_json_asset(hbd)
    cdef json_asset _base = encode_json_asset(base)
    cdef json_asset _quote = encode_json_asset(quote)
    response = obj.cpp_hbd_to_hive(_hbd, _base, _quote)
    return response.amount, response.precision, response.nai


@wax_error_boundary
@return_python_json_asset
def calculate_hive_to_hbd(amount: python_json_asset, base: python_json_asset, quote: python_json_asset) -> python_json_asset:
    """Convert HIVE to HBD using given price."""
    cdef protocol obj
    cdef json_asset _amount = encode_json_asset(amount)
    cdef json_asset _base = encode_json_asset(base)
    cdef json_asset _quote = encode_json_asset(quote)
    response = obj.cpp_hive_to_hbd(_amount, _base, _quote)
    return response.amount, response.precision, response.nai


@wax_error_boundary
@return_python_json_asset
def calculate_vests_to_hp(vests: python_json_asset, total_vesting_fund_hive: python_json_asset, total_vesting_shares: python_json_asset) -> python_json_asset:
    """Convert VESTS to HP (Hive Power)."""
    cdef protocol obj
    cdef json_asset _vests = encode_json_asset(vests)
    cdef json_asset _total_vesting_fund_hive = encode_json_asset(total_vesting_fund_hive)
    cdef json_asset _total_vesting_shares = encode_json_asset(total_vesting_shares)
    response = obj.cpp_vests_to_hp(_vests, _total_vesting_fund_hive, _total_vesting_shares)
    return response.amount, response.precision, response.nai


@wax_error_boundary
@return_python_json_asset
def calculate_hp_to_vests(hive: python_json_asset, total_vesting_fund_hive: python_json_asset, total_vesting_shares: python_json_asset) -> python_json_asset:
    """Convert HP (Hive Power) to VESTS."""
    cdef protocol obj
    cdef json_asset _hive = encode_json_asset(hive)
    cdef json_asset _total_vesting_fund_hive = encode_json_asset(total_vesting_fund_hive)
    cdef json_asset _total_vesting_shares = encode_json_asset(total_vesting_shares)
    response = obj.cpp_hp_to_vests(_hive, _total_vesting_fund_hive, _total_vesting_shares)
    return response.amount, response.precision, response.nai


@wax_error_boundary
def calculate_account_hp(vests: python_json_asset, total_vesting_fund_hive: python_json_asset, total_vesting_shares: python_json_asset) -> python_json_asset:
    """Calculate account HP from VESTS."""
    response = calculate_vests_to_hp(vests, total_vesting_fund_hive, total_vesting_shares)
    return response


@wax_error_boundary
def calculate_witness_votes_hp(votes: int, total_vesting_fund_hive: python_json_asset, total_vesting_shares: python_json_asset) -> python_json_asset:
    """Calculate witness votes in HP."""
    _vests: python_json_asset = vests(votes)
    response = calculate_vests_to_hp(_vests, total_vesting_fund_hive, total_vesting_shares)
    return response


@wax_error_boundary
def calculate_inflation_rate_for_block(block_num: int) -> python_result:
    """Calculate inflation rate for a given block number."""
    cdef protocol obj
    response = obj.cpp_calculate_inflation_rate_for_block(block_num)
    return response


@wax_error_boundary
@return_python_json_asset
def estimate_hive_collateral(current_median_history: python_price, current_min_history: python_price, hbd_amount_to_get: python_json_asset) -> python_json_asset:
    """Estimate HIVE collateral required for HBD conversion."""
    cdef protocol obj

    cdef json_asset _current_median_history_base = encode_json_asset(current_median_history.base)
    cdef json_asset _current_median_history_quote = encode_json_asset(current_median_history.quote)

    cdef json_asset _current_min_history_base = encode_json_asset(current_min_history.base)
    cdef json_asset _current_min_history_quote = encode_json_asset(current_min_history.quote)

    cdef json_price _current_median_history
    _current_median_history.base = _current_median_history_base
    _current_median_history.quote = _current_median_history_quote

    cdef json_price _current_min_history
    _current_min_history.base = _current_min_history_base
    _current_min_history.quote = _current_min_history_quote

    cdef json_asset _hbd_amount_to_get = encode_json_asset(hbd_amount_to_get)

    response = obj.cpp_estimate_hive_collateral(_current_median_history, _current_min_history, _hbd_amount_to_get)
    return response.amount, response.precision, response.nai


@wax_error_boundary
@return_python_json_asset
def evaluate_hbd_interest(hbd_seconds: int, head_block_time: int, hbd: python_json_asset, hbd_seconds_last_update: int, hbd_interest_rate: int) -> python_json_asset:
    """Evaluate HBD interest earned."""
    cdef protocol obj

    cdef json_asset _hbd = encode_json_asset(hbd)
    cdef uint64_t hbd_seconds_low = hbd_seconds & 0xFFFFFFFF_FFFFFFFF
    cdef uint64_t hbd_seconds_high = hbd_seconds >> 64

    response = obj.cpp_evaluate_hbd_interest(hbd_seconds_low, hbd_seconds_high, head_block_time, _hbd, hbd_seconds_last_update, hbd_interest_rate)
    return response.amount, response.precision, response.nai
