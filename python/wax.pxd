from libcpp.string cimport string
from libcpp.set cimport set as cppset
from libc.stdint cimport uint16_t, uint32_t

cdef extern from "cpython_interface.hpp" namespace "cpp":
    cdef enum error_code:
        fail = 0
        ok = 1

    cdef cppclass result:
        result() except +

        error_code value
        string content
        string exception_message

    cdef cppclass json_asset:
        json_asset() except +
        json_asset( string _amount, int _precision, string _nai ) except +

        string amount
        int precision
        string nai

    cdef cppclass ref_block_data:
        ref_block_data() noexcept

        uint16_t ref_block_num
        uint32_t ref_block_prefix

    cdef cppclass required_authority_collection:
         required_authority_collection() except +
         ctypedef cppset[string] account_set

         account_set posting_accounts
         account_set active_accounts
         account_set owner_accounts

    cdef cppclass crypto_memo:
         crypto_memo() except +

         # base58 encoded public key, used for encryption (encryption is performed by matching private key)
         string _from

         # base58 encoded public key, used for encryption (additionally allows decryption by using matching private key)
         string to

         # base58 encoded encrypted content
         string content

    cdef cppclass private_key_data:
        private_key_data() except +

        string wif_private_key
        string associated_public_key


    cdef cppclass protocol:
        result cpp_validate_operation( string operation )
        result cpp_validate_transaction( string transaction )
        result cpp_calculate_transaction_id( string transaction )
        result cpp_calculate_legacy_transaction_id( string transaction )
        result cpp_calculate_sig_digest( string transaction, string chain_id )
        result cpp_calculate_legacy_sig_digest( string transaction, string chain_id )
        result cpp_serialize_transaction( string transaction )
        result cpp_deserialize_transaction( string transaction )
        result cpp_calculate_public_key( string wif )
        result cpp_generate_private_key()
        private_key_data cpp_generate_private_key(string account, string role, string password) except +
        private_key_data cpp_suggest_brain_key() except +
        result cpp_get_public_key_from_signature( string digest, string signature )
        result cpp_calculate_manabar_full_regeneration_time( int now, long max_mana, long current_mana, int last_update_time )
        result cpp_calculate_current_manabar_value( int now, long max_mana, long current_mana, int last_update_time )
        json_asset cpp_general_asset( uint32_t asset_num, long amount )
        json_asset cpp_hive( long amount )
        json_asset cpp_hbd( long amount )
        json_asset cpp_vests( long amount )
        ref_block_data cpp_get_tapos_data( string block_id )
        result cpp_calculate_hp_apr( uint32_t head_block_num, uint16_t vesting_reward_percent, json_asset virtual_supply, json_asset total_vesting_fund_hive )
        json_asset cpp_hbd_to_hive( json_asset hbd, json_asset base, json_asset quote)
        json_asset cpp_vests_to_hp( json_asset vests, json_asset total_vesting_fund_hive, json_asset total_vesting_shares )
        result cpp_calculate_inflation_rate_for_block( uint32_t block_num )
        required_authority_collection cpp_collect_transaction_required_authorities( string transaction ) except +

        crypto_memo cpp_crypto_memo_from_string(string encrypted) except +
        string cpp_crypto_memo_dump_string(crypto_memo value) except +

        void cpp_throws(int type) except +

    cdef cppclass proto_protocol:
        result cpp_validate_operation( string operation )
        result cpp_validate_transaction( string transaction )
        result cpp_calculate_transaction_id( string transaction )
        result cpp_calculate_legacy_transaction_id( string transaction )
        result cpp_calculate_sig_digest( string transaction, string chain_id )
        result cpp_calculate_legacy_sig_digest( string transaction, string chain_id )
        result cpp_serialize_transaction( string transaction )
        result cpp_deserialize_transaction( string transaction )
        result cpp_proto_to_api( string operation_or_tx )
        result cpp_proto_to_legacy_api( string operation_or_tx )
        result cpp_api_to_proto( string operation_or_tx )
