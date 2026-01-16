# -*- coding: utf-8 -*-
# Transaction function declarations for use by other Cython modules

from cython_modules_handles cimport WaxTransactionHandle

# Declare cdef functions for internal use by other modules (via cimport)
cdef bytes _tx_to_binary(WaxTransactionHandle wax_tx, bint use_hf26_serialization, bint strip_to_unsigned_transaction)
cdef bytes _tx_to_json(WaxTransactionHandle wax_tx)
cdef bytes _tx_to_legacy_json(WaxTransactionHandle wax_tx)
