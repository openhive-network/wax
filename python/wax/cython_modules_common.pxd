# -*- coding: utf-8 -*-
# Common declarations shared across all Cython modules
# This file re-exports types from cpp_python_bridge.pxd and exception.pxd

# Re-export C++ types from cpp_python_bridge.pxd
from cpp_python_bridge cimport (
    protocol,
    json_asset,
    json_price,
    result,
    error_code,
    binary_data,
    binary_data_node,
    required_authority_collection,
    hive_transaction_handle,
    hive_operation_handle,
    hive_exception_data,
    wax_authority,
    wax_authorities,
    witness_set_properties_data,
    witness_set_properties_serialized,
    minimize_required_signatures_data_t,
    crypto_memo,
    private_key_data,
    brain_key_data,
    ref_block_data,
    wax_authorities_map_t,
    retrieve_authorities_t,
    get_witness_key_t,
)

# Re-export exception handling from exception.pxd
from exception cimport exception_ptr, wrapped_exception_ptr_from_exception

# Declare cdef functions that other modules need to cimport
# NOTE: raise_appropriate_wax_exception is now in _decorators.pxi (included by each module)
cdef object convert_binary_data_node_to_python(binary_data_node node)
