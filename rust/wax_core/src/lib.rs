pub mod proto {
    #![allow(clippy::all)]
    include!("../../protobuf_patterns/hive.protocol.buffers.rs");
}

mod asset;
mod authority_provider;
mod managed_object;
mod operation;
mod transaction;

pub use asset::RustAsset;
pub use authority_provider::{AuthorityProvider, RustAuthorityProvider};
pub use managed_object::{descriptor_pool, RustManagedObject};
pub use operation::RustOperation;
pub use transaction::{transaction_to_canonical_json, RustTransaction};

use authority_provider::{rap_get_authorities, rap_get_witness_public_key};
use managed_object::{
    rmo_array_length, rmo_as_bool, rmo_as_i16, rmo_as_i32, rmo_as_i64, rmo_as_i8, rmo_as_string,
    rmo_as_u16, rmo_as_u32, rmo_as_u64, rmo_as_u8, rmo_clone, rmo_get_field, rmo_get_index,
    rmo_is_optional_field_present, rmo_is_string, rmo_is_undefined, rmo_map_keys,
    rmo_oneof_variant,
};

#[cxx::bridge(namespace = "cpp")]
pub mod ffi {
    pub struct RustAuthEntry {
        pub name: String,
        pub weight: u32,
    }

    pub struct RustWaxAuthority {
        pub weight_threshold: u32,
        pub account_auths: Vec<RustAuthEntry>,
        pub key_auths: Vec<RustAuthEntry>,
    }

    pub struct RustRequiredAuthorities {
        pub posting_accounts: Vec<String>,
        pub active_accounts: Vec<String>,
        pub owner_accounts: Vec<String>,
        pub other_authorities: Vec<RustWaxAuthority>,
    }

    pub struct RustWaxAuthorities {
        pub owner: RustWaxAuthority,
        pub active: RustWaxAuthority,
        pub posting: RustWaxAuthority,
    }

    pub struct RustAccountAuthorities {
        pub account: String,
        pub authorities: RustWaxAuthorities,
    }

    pub struct RustJsonAsset {
        pub amount: String,
        pub precision: u32,
        pub nai: String,
    }

    pub struct RustJsonPrice {
        pub base: RustJsonAsset,
        pub quote: RustJsonAsset,
    }

    pub struct RustRefBlockData {
        pub ref_block_num: u16,
        pub ref_block_prefix: u32,
    }

    pub struct RustMinimizeRequiredSignaturesData {
        pub chain_id: String,
        pub available_keys: Vec<String>,
        pub authorities: Vec<RustAccountAuthorities>,
        pub max_recursion: u32,
        pub has_max_recursion: bool,
        pub max_membership: u32,
        pub has_max_membership: bool,
        pub max_account_auths: u32,
        pub has_max_account_auths: bool,
        pub allow_strict_and_mixed_authorities: bool,
    }

    pub struct RustAuthPathNode {
        pub processed_entry: String,
        pub processed_role: String,
        pub recursion_depth: u32,
        pub threshold: u32,
        pub weight: u32,
        pub flags: u32,
        pub visited_indices: Vec<u32>,
    }

    pub struct RustAuthVerificationTrace {
        pub nodes: Vec<RustAuthPathNode>,
        pub root_indices: Vec<u32>,
        pub final_authority_path_indices: Vec<u32>,
        pub verification_status: u32,
    }

    extern "Rust" {
        type RustManagedObject;
        type RustAuthorityProvider;

        fn rap_get_authorities(
            provider: &RustAuthorityProvider,
            accounts: Vec<String>,
        ) -> Vec<RustAccountAuthorities>;
        fn rap_get_witness_public_key(provider: &RustAuthorityProvider, witness: String)
            -> String;
    }

    extern "Rust" {
        fn rmo_clone(obj: &RustManagedObject) -> Box<RustManagedObject>;
        fn rmo_get_field(obj: &RustManagedObject, key: &str) -> Box<RustManagedObject>;
        fn rmo_get_index(obj: &RustManagedObject, idx: usize) -> Box<RustManagedObject>;
        fn rmo_array_length(obj: &RustManagedObject) -> usize;
        fn rmo_is_undefined(obj: &RustManagedObject) -> bool;
        fn rmo_is_string(obj: &RustManagedObject) -> bool;
        fn rmo_is_optional_field_present(obj: &RustManagedObject, name: &str) -> bool;
        fn rmo_oneof_variant(obj: &RustManagedObject) -> String;
        fn rmo_map_keys(obj: &RustManagedObject) -> Vec<String>;

        fn rmo_as_string(obj: &RustManagedObject) -> String;
        fn rmo_as_bool(obj: &RustManagedObject) -> bool;
        fn rmo_as_i64(obj: &RustManagedObject) -> i64;
        fn rmo_as_i32(obj: &RustManagedObject) -> i32;
        fn rmo_as_i16(obj: &RustManagedObject) -> i16;
        fn rmo_as_i8(obj: &RustManagedObject) -> i8;
        fn rmo_as_u64(obj: &RustManagedObject) -> u64;
        fn rmo_as_u32(obj: &RustManagedObject) -> u32;
        fn rmo_as_u16(obj: &RustManagedObject) -> u16;
        fn rmo_as_u8(obj: &RustManagedObject) -> u8;
    }

    unsafe extern "C++" {
        include!("rust_protocol.hpp");
        include!("rust_managed_object.hpp");

        #[namespace = "cpp"]
        type rust_protocol;
        #[namespace = "cpp"]
        type hive_transaction_handle;
        #[namespace = "cpp"]
        type hive_operation_handle;

        fn new_rust_protocol() -> UniquePtr<rust_protocol>;

        fn cpp_create_operation_handle(
            self: &rust_protocol,
            obj: Box<RustManagedObject>,
        ) -> Result<UniquePtr<hive_operation_handle>>;

        fn cpp_create_transaction_handle(
            self: &rust_protocol,
            obj: Box<RustManagedObject>,
        ) -> Result<UniquePtr<hive_transaction_handle>>;

        fn cpp_tx_add_operation(
            self: &rust_protocol,
            tx: Pin<&mut hive_transaction_handle>,
            op: &hive_operation_handle,
        ) -> Result<()>;

        fn cpp_tx_add_signature(
            self: &rust_protocol,
            tx: Pin<&mut hive_transaction_handle>,
            signature: &str,
        ) -> Result<()>;

        fn cpp_tx_validate(
            self: &rust_protocol,
            tx: &hive_transaction_handle,
        ) -> Result<()>;

        fn cpp_tx_sig_digest(
            self: &rust_protocol,
            tx: &hive_transaction_handle,
            chain_id: &str,
        ) -> Result<String>;

        fn cpp_tx_legacy_sig_digest(
            self: &rust_protocol,
            tx: &hive_transaction_handle,
            chain_id: &str,
        ) -> Result<String>;

        fn cpp_tx_id(
            self: &rust_protocol,
            tx: &hive_transaction_handle,
        ) -> Result<String>;

        fn cpp_tx_legacy_id(
            self: &rust_protocol,
            tx: &hive_transaction_handle,
        ) -> Result<String>;

        fn cpp_tx_to_binary(
            self: &rust_protocol,
            tx: &hive_transaction_handle,
            strip_to_unsigned_transaction: bool,
        ) -> Result<String>;

        fn cpp_tx_signature_keys(
            self: &rust_protocol,
            tx: &hive_transaction_handle,
            chain_id: &str,
        ) -> Result<Vec<String>>;

        fn cpp_tx_legacy_signature_keys(
            self: &rust_protocol,
            tx: &hive_transaction_handle,
            chain_id: &str,
        ) -> Result<Vec<String>>;

        fn cpp_tx_to_json(
            self: &rust_protocol,
            tx: &hive_transaction_handle,
        ) -> Result<String>;

        fn cpp_tx_to_legacy_json(
            self: &rust_protocol,
            tx: &hive_transaction_handle,
        ) -> Result<String>;

        fn cpp_tx_impacted_accounts(
            self: &rust_protocol,
            tx: &hive_transaction_handle,
        ) -> Result<Vec<String>>;

        fn cpp_tx_required_authorities(
            self: &rust_protocol,
            tx: &hive_transaction_handle,
        ) -> Result<RustRequiredAuthorities>;

        fn cpp_tx_collect_signing_keys(
            self: &rust_protocol,
            tx: &hive_transaction_handle,
            provider: &RustAuthorityProvider,
        ) -> Result<Vec<String>>;

        fn cpp_hive(self: &rust_protocol, amount: i64) -> Result<RustJsonAsset>;
        fn cpp_hbd(self: &rust_protocol, amount: i64) -> Result<RustJsonAsset>;
        fn cpp_vests(self: &rust_protocol, amount: i64) -> Result<RustJsonAsset>;

        fn cpp_hbd_to_hive(
            self: &rust_protocol,
            hbd: &RustJsonAsset,
            base: &RustJsonAsset,
            quote: &RustJsonAsset,
        ) -> Result<RustJsonAsset>;

        fn cpp_hive_to_hbd(
            self: &rust_protocol,
            amount: &RustJsonAsset,
            base: &RustJsonAsset,
            quote: &RustJsonAsset,
        ) -> Result<RustJsonAsset>;

        fn cpp_vests_to_hp(
            self: &rust_protocol,
            vests: &RustJsonAsset,
            total_vesting_fund_hive: &RustJsonAsset,
            total_vesting_shares: &RustJsonAsset,
        ) -> Result<RustJsonAsset>;

        fn cpp_hp_to_vests(
            self: &rust_protocol,
            hive: &RustJsonAsset,
            total_vesting_fund_hive: &RustJsonAsset,
            total_vesting_shares: &RustJsonAsset,
        ) -> Result<RustJsonAsset>;

        fn cpp_estimate_hive_collateral(
            self: &rust_protocol,
            current_median_history: &RustJsonPrice,
            current_min_history: &RustJsonPrice,
            hbd_amount_to_get: &RustJsonAsset,
        ) -> Result<RustJsonAsset>;

        fn cpp_estimate_hbd_interest(
            self: &rust_protocol,
            hbd_seconds_low: u64,
            hbd_seconds_high: u64,
            head_block_time: u32,
            hbd: &RustJsonAsset,
            hbd_seconds_last_update: u32,
            hbd_interest_rate: u16,
        ) -> Result<RustJsonAsset>;

        fn cpp_calculate_hp_apr(
            self: &rust_protocol,
            head_block_num: u32,
            vesting_reward_percent: u16,
            virtual_supply: &RustJsonAsset,
            total_vesting_fund_hive: &RustJsonAsset,
        ) -> Result<String>;

        fn cpp_asset_value(self: &rust_protocol, asset: &RustJsonAsset) -> Result<String>;
        fn cpp_asset_symbol(self: &rust_protocol, asset: &RustJsonAsset) -> Result<String>;

        fn cpp_calculate_current_manabar_value(
            self: &rust_protocol,
            now: i32,
            max_mana: i64,
            current_mana: i64,
            last_update_time: u32,
        ) -> Result<i64>;

        fn cpp_calculate_manabar_full_regeneration_time(
            self: &rust_protocol,
            now: i32,
            max_mana: i64,
            current_mana: i64,
            last_update_time: u32,
        ) -> Result<u64>;

        fn cpp_is_valid_account_name(self: &rust_protocol, name: &str) -> bool;

        fn cpp_deserialize_transaction(
            self: &rust_protocol,
            hex: &str,
        ) -> Result<UniquePtr<hive_transaction_handle>>;

        fn cpp_legacy_tx_to_json(self: &rust_protocol, tx_str: &str) -> Result<String>;

        fn cpp_tx_set_expiration(
            self: &rust_protocol,
            tx: Pin<&mut hive_transaction_handle>,
            expiration: &str,
        ) -> Result<()>;

        fn cpp_get_tapos_data(self: &rust_protocol, block_id: &str) -> Result<RustRefBlockData>;

        fn cpp_minimize_required_signatures(
            self: &rust_protocol,
            tx: &hive_transaction_handle,
            data: &RustMinimizeRequiredSignaturesData,
            provider: &RustAuthorityProvider,
        ) -> Result<Vec<String>>;

        fn cpp_trace_authority_verification(
            self: &rust_protocol,
            required_authorities: &RustRequiredAuthorities,
            decoded_signature_public_keys: &Vec<String>,
            provider: &RustAuthorityProvider,
        ) -> Result<RustAuthVerificationTrace>;
    }
}

pub use ffi::{
    hive_operation_handle, hive_transaction_handle, new_rust_protocol, rust_protocol,
    RustAuthPathNode, RustAuthVerificationTrace, RustJsonAsset, RustJsonPrice,
    RustMinimizeRequiredSignaturesData, RustRefBlockData,
};
