from libcpp.string cimport string

cdef extern from "cpython_interface.hpp" namespace "cpp":
    cdef enum error_code:
        fail = 0
        ok = 1

    cdef cppclass result:
        result() except +

        error_code value
        string content
        string exception_message

    cdef cppclass protocol:
        result cpp_validate_operation( string operation )
        result cpp_validate_transaction( string transaction )
        result cpp_calculate_transaction_id( string transaction )
        result cpp_calculate_sig_digest( string transaction, string chain_id )
        result cpp_serialize_transaction( string transaction )
        result cpp_calculate_public_key( string wif )
        result cpp_generate_private_key()
        result cpp_calculate_manabar_full_regeneration_time( int now, long max_mana, long current_mana, int last_update_time )
        result cpp_calculate_current_manabar_value( int now, long max_mana, long current_mana, int last_update_time )
