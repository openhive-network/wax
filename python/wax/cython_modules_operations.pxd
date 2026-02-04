# -*- coding: utf-8 -*-
# Operation function declarations for use by other Cython modules

from cython_modules_handles cimport WaxTransactionHandle

from wax.wax_result import python_required_authority_collection

# Note: We can't use cdef for functions returning Python objects like python_required_authority_collection
# So tx_required_authorities remains as def function
