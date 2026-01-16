# -*- coding: utf-8 -*-
# Validation function declarations for use by other Cython modules

from libcpp.string cimport string
from libcpp.vector cimport vector

from cython_modules_handles cimport WaxTransactionHandle, WaxOperationHandle

# Declare cdef functions for internal use by other modules (via cimport)
cdef vector[string] _op_impacted_accounts(WaxOperationHandle wax_op)
cdef void _op_validate(WaxOperationHandle wax_op)
cdef vector[string] _tx_impacted_accounts(WaxTransactionHandle wax_tx)
cdef void _tx_validate(WaxTransactionHandle wax_tx)
cdef bytes _tx_id(WaxTransactionHandle wax_tx, bint use_hf26_serialization)
cdef bytes _tx_sig_digest(WaxTransactionHandle wax_tx, bytes chain_id, bint use_hf26_serialization)
