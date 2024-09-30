# -*- coding: utf-8 -*-

# tag: cpp17

from libcpp.string cimport string
from libcpp.pair cimport pair
from libcpp.vector cimport vector
from libcpp.set cimport set as cppset
from libcpp.map cimport map as cppmap
from libcpp.optional cimport optional as cpp_optional
from libc.stdint cimport uint16_t, uint32_t, int32_t

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

    cdef cppclass json_price:
        json_price() except +

        json_asset base
        json_asset quote

    cdef cppclass ref_block_data:
        ref_block_data() noexcept

        uint16_t ref_block_num
        uint32_t ref_block_prefix

    cdef cppclass required_authority_collection:
         required_authority_collection() except +
         ctypedef cppset[string] account_set
         ctypedef vector[wax_authority] authority_vector

         account_set posting_accounts
         account_set active_accounts
         account_set owner_accounts
         authority_vector other_authorities

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

    cdef cppclass brain_key_data:
        brain_key_data() except +

        # String containing a space-separated list of N (atm 16) words generated by suggest_brain_key function
        string brain_key
        # First private key derived from brain key
        string wif_private_key
        # The public key associated to private key above (starts with HIVE_ADDRESS_PREFIX)
        string associated_public_key

    cpdef cppclass witness_set_properties_data:
        witness_set_properties_data() except +

        string key
        # New witness key to set
        cpp_optional[string] new_signing_key
        # HIVE maximum account creation fee
        cpp_optional[json_asset]  account_creation_fee
        # New witness URL to set
        cpp_optional[string] url
        # HBD to HIVE ratio proposed by the witness
        cpp_optional[json_price]       hbd_exchange_rate
        # This witnesses vote for the maximum_block_size which is used by the network to tune rate limiting and capacity
        cpp_optional[uint32_t]    maximum_block_size
        # Rate of interest for holding HBD (in BPS - basis points)
        cpp_optional[uint16_t]    hbd_interest_rate
        # How many free accounts should be created per elected witness block. Scaled so that HIVE_ACCOUNT_SUBSIDY_PRECISION represents one account.
        cpp_optional[int32_t]     account_subsidy_budget
        # What fraction of the "stockpiled" free accounts "expire" per elected witness block. Scaled so that 1 << HIVE_RD_DECAY_DENOM_SHIFT represents 100% of accounts expiring.
        cpp_optional[uint32_t]    account_subsidy_decay

    cdef cppclass wax_authority:
        wax_authority() except +

        ctypedef cppmap[string, uint16_t] authority_map

        uint32_t      weight_threshold
        authority_map account_auths
        authority_map key_auths

    cdef cppclass wax_authorities:
        wax_authorities() except +

        wax_authority active
        wax_authority owner
        wax_authority posting

    ctypedef cppmap[string, string] witness_set_properties_serialized

    ctypedef cppmap[string, wax_authorities] (*retrieve_authorities_t)(vector[string], void* ) except +

    cdef cppclass protocol:
        vector[string] cpp_operation_get_impacted_accounts( string operation ) except +
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
        brain_key_data cpp_suggest_brain_key() except +
        result cpp_get_public_key_from_signature( string digest, string signature )
        result cpp_calculate_manabar_full_regeneration_time( int now, long max_mana, long current_mana, int last_update_time )
        result cpp_calculate_current_manabar_value( int now, long max_mana, long current_mana, int last_update_time )
        json_asset cpp_general_asset( uint32_t asset_num, long amount )
        json_asset cpp_hive( long amount )
        json_asset cpp_hbd( long amount )
        json_asset cpp_vests( long amount )
        ref_block_data cpp_get_tapos_data( string block_id )
        result cpp_calculate_hp_apr( uint32_t head_block_num, uint16_t vesting_reward_percent, json_asset virtual_supply, json_asset total_vesting_fund_hive )
        json_asset cpp_hbd_to_hive( json_asset hbd, json_asset base, json_asset quote) except +
        json_asset cpp_hive_to_hbd( json_asset amount, json_asset base, json_asset quote) except +
        json_asset cpp_vests_to_hp( json_asset vests, json_asset total_vesting_fund_hive, json_asset total_vesting_shares ) except +
        json_asset cpp_hp_to_vests( json_asset hive, json_asset total_vesting_fund_hive, json_asset total_vesting_shares ) except +
        result cpp_calculate_inflation_rate_for_block( uint32_t block_num )
        required_authority_collection cpp_collect_transaction_required_authorities( string transaction ) except +
        json_asset cpp_estimate_hive_collateral( json_price current_median_history, json_price current_min_history, json_asset hbd_amount_to_get ) except +

        crypto_memo cpp_crypto_memo_from_string(string encrypted) except +
        string cpp_crypto_memo_dump_string(crypto_memo value) except +

        witness_set_properties_serialized cpp_serialize_witness_set_properties(witness_set_properties_data value) except +
        witness_set_properties_data cpp_deserialize_witness_set_properties(witness_set_properties_serialized value) except +

        vector[string] cpp_collect_signing_keys( string transaction, retrieve_authorities_t retrieve_authorities, void* retrieve_authorities_user_data ) except +

        void cpp_throws(int type) except +

    cdef cppclass proto_protocol:
        vector[string] cpp_operation_get_impacted_accounts( string operation ) except +
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
