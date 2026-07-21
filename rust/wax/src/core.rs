//! Core bindings to the C++ hived protocol layer.
//!
//! This module wraps the C++ hived protocol code through a cxx bridge and
//! exposes the generated protobuf types ([`proto`]) alongside thin Rust
//! wrappers ([`RustTransaction`], [`RustOperation`], [`RustAsset`]) and the
//! dynamically-typed [`RustManagedObject`] used to shuttle values across the
//! bridge.

/// Generated Hive protocol buffer types and their `serde` implementations.
pub mod proto {
    #![allow(clippy::all)]
    include!(concat!(
        env!("CARGO_MANIFEST_DIR"),
        "/proto/hive.protocol.buffers.rs"
    ));
    // serde::Serialize/Deserialize impls for the prost types above. Emitted
    // into OUT_DIR by `pbjson-build` from this crate's build script, right
    // after the prost output.
    include!(concat!(
        env!("CARGO_MANIFEST_DIR"),
        "/proto/hive.protocol.buffers.serde.rs"
    ));
}

mod asset;
mod authority_provider;
mod managed_object;
mod operation;
mod transaction;

pub use asset::RustAsset;
pub use authority_provider::{AuthorityProvider, RustAuthorityProvider};
pub use managed_object::{RustManagedObject, descriptor_pool};
pub use operation::RustOperation;
pub use transaction::{
    EncryptionIndex, RustTransaction, transaction_to_canonical_json,
};

use authority_provider::{rap_get_authorities, rap_get_witness_public_key};
use managed_object::{
    rmo_array_length, rmo_as_bool, rmo_as_i8, rmo_as_i16, rmo_as_i32,
    rmo_as_i64, rmo_as_string, rmo_as_u8, rmo_as_u16, rmo_as_u32, rmo_as_u64,
    rmo_clone, rmo_del_field, rmo_from_json_str, rmo_get_field, rmo_get_index,
    rmo_is_optional_field_present, rmo_is_string, rmo_is_undefined,
    rmo_map_keys, rmo_new_object, rmo_oneof_variant, rmo_set_field,
    rmo_set_field_obj_key, rmo_to_json_string,
};

/// The cxx bridge to the C++ hived protocol layer: the shared data structures
/// exchanged with C++ and the `cpp_*` protocol entry points.
#[cxx::bridge(namespace = "cpp")]
pub mod ffi {
    /// Represents a single authority entry — an account or key name with its
    /// signing weight.
    pub struct RustAuthEntry {
        pub name: String,
        pub weight: u32,
    }

    /// Represents an authority: a weight threshold together with its account
    /// and key entries.
    pub struct RustWaxAuthority {
        pub weight_threshold: u32,
        pub account_auths: Vec<RustAuthEntry>,
        pub key_auths: Vec<RustAuthEntry>,
    }

    /// Represents the accounts and authorities required to sign a transaction,
    /// grouped by role.
    pub struct RustRequiredAuthorities {
        pub posting_accounts: Vec<String>,
        pub active_accounts: Vec<String>,
        pub owner_accounts: Vec<String>,
        pub other_authorities: Vec<RustWaxAuthority>,
    }

    /// Represents the owner, active and posting authorities of an account.
    pub struct RustWaxAuthorities {
        pub owner: RustWaxAuthority,
        pub active: RustWaxAuthority,
        pub posting: RustWaxAuthority,
    }

    /// Represents an account paired with its three role authorities.
    pub struct RustAccountAuthorities {
        pub account: String,
        pub authorities: RustWaxAuthorities,
    }

    /// Represents an asset as the flat amount/precision/nai triple exchanged
    /// with C++.
    pub struct RustJsonAsset {
        pub amount: String,
        pub precision: u32,
        pub nai: String,
    }

    /// Represents a price as a base/quote pair of [`RustJsonAsset`]s.
    pub struct RustJsonPrice {
        pub base: RustJsonAsset,
        pub quote: RustJsonAsset,
    }

    /// Represents the TaPoS reference-block data (`ref_block_num` and
    /// `ref_block_prefix`).
    pub struct RustRefBlockData {
        pub ref_block_num: u16,
        pub ref_block_prefix: u32,
    }

    /// Represents the input to `cpp_minimize_required_signatures`. The `has_*`
    /// companion booleans stand in for the optional limits the cxx bridge
    /// cannot express; when `has_X` is `false`, field `X` is ignored.
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

    /// Represents one `cpp::binary_data_node` in flattened form. The recursive
    /// tree is linearized into a `Vec<RustBinaryDataNode>` and each parent
    /// stores the indices of its children, so the structure is
    /// cxx-bridge-compatible.
    pub struct RustBinaryDataNode {
        pub key: String,
        // "scalar" | "array" | "object" (mirrors cpp::binary_data_node::type).
        pub node_type: String,
        pub offset: u32,
        pub size: u32,
        pub value: String,
        pub length: u32,
        pub child_indices: Vec<u32>,
    }

    /// Represents the flattened binary serialization of a value: the hex
    /// `binary` plus the linearized node tree describing its structure.
    pub struct RustBinaryData {
        pub binary: String,
        pub nodes: Vec<RustBinaryDataNode>,
        pub root_indices: Vec<u32>,
    }

    /// Represents one node visited while tracing authority verification — the
    /// processed entry/role with its recursion depth, threshold and weights.
    pub struct RustAuthPathNode {
        pub processed_entry: String,
        pub processed_role: String,
        pub recursion_depth: u32,
        pub threshold: u32,
        pub weight: u32,
        pub flags: u32,
        pub visited_indices: Vec<u32>,
    }

    /// Represents the full trace of an authority-verification run: the visited
    /// nodes, the final satisfying path and the overall verification status.
    pub struct RustAuthVerificationTrace {
        pub nodes: Vec<RustAuthPathNode>,
        pub root_indices: Vec<u32>,
        pub final_authority_path_indices: Vec<u32>,
        pub verification_status: u32,
    }

    /// Represents a generated brain key with its derived WIF private key and
    /// associated public key.
    pub struct RustBrainKeyData {
        pub brain_key: String,
        pub wif_private_key: String,
        pub associated_public_key: String,
    }

    /// Represents a private key as its WIF form paired with the associated
    /// public key.
    pub struct RustPrivateKeyData {
        pub wif_private_key: String,
        pub associated_public_key: String,
    }

    /// Represents one entry in the chain-config map returned by
    /// `cpp_get_hive_protocol_config`. cxx-bridge cannot express
    /// `std::map<String, String>` directly, so the map is surfaced as a flat
    /// Vec of key/value pairs.
    pub struct RustConfigEntry {
        pub key: String,
        pub value: String,
    }

    /// Represents one serialized witness-property entry — a name and the
    /// hex-encoded packed binary that hived expects on the wire. cxx-bridge
    /// cannot express `std::map<String, String>` directly, so the serializer
    /// output is surfaced as a flat Vec for the same reason as
    /// `RustConfigEntry`.
    pub struct RustWitnessPropEntry {
        pub key: String,
        pub value: String,
    }

    /// Represents the input to `cpp_serialize_witness_set_properties`. Mirrors
    /// C++ `witness_set_properties_data` but with `has_*` companion booleans
    /// instead of `std::optional` (the cxx bridge does not support Option /
    /// optional on shared structs). When `has_X` is `false`, field `X` is
    /// ignored by the C++ side.
    pub struct RustWitnessSetPropertiesData {
        pub key: String,

        pub new_signing_key: String,
        pub has_new_signing_key: bool,

        pub account_creation_fee: RustJsonAsset,
        pub has_account_creation_fee: bool,

        pub url: String,
        pub has_url: bool,

        pub hbd_exchange_rate: RustJsonPrice,
        pub has_hbd_exchange_rate: bool,

        pub maximum_block_size: u32,
        pub has_maximum_block_size: bool,

        pub hbd_interest_rate: u16,
        pub has_hbd_interest_rate: bool,

        pub account_subsidy_budget: i32,
        pub has_account_subsidy_budget: bool,

        pub account_subsidy_decay: u32,
        pub has_account_subsidy_decay: bool,
    }

    /// Represents a decoded `crypto-memo`: the two base58 public keys it was
    /// encrypted for and the inner base58 encrypted content. Mirrors C++
    /// `crypto_memo`. `from`/`to` carry the `STM` address prefix (as TS passes
    /// them straight through from the encryption keys).
    pub struct RustCryptoMemo {
        pub from: String,
        pub to: String,
        pub content: String,
    }

    extern "Rust" {
        type RustManagedObject;
        type RustAuthorityProvider;

        fn rap_get_authorities(
            provider: &RustAuthorityProvider,
            accounts: Vec<String>,
        ) -> Vec<RustAccountAuthorities>;
        fn rap_get_witness_public_key(
            provider: &RustAuthorityProvider,
            witness: String,
        ) -> String;
    }

    extern "Rust" {
        fn rmo_clone(obj: &RustManagedObject) -> Box<RustManagedObject>;
        fn rmo_get_field(
            obj: &RustManagedObject,
            key: &str,
        ) -> Box<RustManagedObject>;
        fn rmo_get_index(
            obj: &RustManagedObject,
            idx: usize,
        ) -> Box<RustManagedObject>;
        fn rmo_array_length(obj: &RustManagedObject) -> usize;
        fn rmo_is_undefined(obj: &RustManagedObject) -> bool;
        fn rmo_is_string(obj: &RustManagedObject) -> bool;
        fn rmo_is_optional_field_present(
            obj: &RustManagedObject,
            name: &str,
        ) -> bool;
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

        // JSON-backed mode (used by cpp_tx_api_to_proto_json).
        fn rmo_new_object() -> Box<RustManagedObject>;
        fn rmo_from_json_str(json: &str) -> Result<Box<RustManagedObject>>;
        fn rmo_to_json_string(obj: &RustManagedObject) -> Result<String>;
        fn rmo_set_field(
            obj: &RustManagedObject,
            key: &str,
            value: &RustManagedObject,
        );
        fn rmo_set_field_obj_key(
            obj: &RustManagedObject,
            key: &RustManagedObject,
            value: &RustManagedObject,
        );
        fn rmo_del_field(obj: &RustManagedObject, key: &str);
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
            is_protobuf: bool,
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

        fn cpp_op_validate(
            self: &rust_protocol,
            op: &hive_operation_handle,
        ) -> Result<()>;

        fn cpp_op_impacted_accounts(
            self: &rust_protocol,
            op: &hive_operation_handle,
        ) -> Result<Vec<String>>;

        fn cpp_op_binary(
            self: &rust_protocol,
            op: &hive_operation_handle,
            use_hf26_serialization: bool,
        ) -> Result<RustBinaryData>;

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

        fn cpp_tx_binary_view(
            self: &rust_protocol,
            tx: &hive_transaction_handle,
            use_hf26_serialization: bool,
            strip_to_unsigned_transaction: bool,
        ) -> Result<RustBinaryData>;

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

        fn cpp_hive(self: &rust_protocol, amount: i64)
        -> Result<RustJsonAsset>;
        fn cpp_hbd(self: &rust_protocol, amount: i64) -> Result<RustJsonAsset>;
        fn cpp_vests(
            self: &rust_protocol,
            amount: i64,
        ) -> Result<RustJsonAsset>;

        fn cpp_general_asset(
            self: &rust_protocol,
            asset_num: u32,
            amount: i64,
        ) -> Result<RustJsonAsset>;

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

        fn cpp_calculate_inflation_rate_for_block(
            self: &rust_protocol,
            block_num: u32,
        ) -> Result<i64>;

        fn cpp_asset_value(
            self: &rust_protocol,
            asset: &RustJsonAsset,
        ) -> Result<String>;
        fn cpp_asset_symbol(
            self: &rust_protocol,
            asset: &RustJsonAsset,
        ) -> Result<String>;

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

        fn cpp_calculate_public_key(
            self: &rust_protocol,
            wif: &str,
        ) -> Result<String>;

        fn cpp_get_public_key_from_signature(
            self: &rust_protocol,
            digest: &str,
            signature: &str,
        ) -> Result<String>;

        fn cpp_suggest_brain_key(
            self: &rust_protocol,
        ) -> Result<RustBrainKeyData>;

        fn cpp_get_private_key_from_password(
            self: &rust_protocol,
            account: &str,
            role: &str,
            password: &str,
        ) -> Result<RustPrivateKeyData>;

        fn cpp_generate_private_key(self: &rust_protocol) -> Result<String>;

        fn cpp_convert_raw_private_key_to_wif(
            self: &rust_protocol,
            hex_data: &str,
        ) -> Result<String>;

        fn cpp_convert_raw_public_key_to_wif(
            self: &rust_protocol,
            hex_data: &str,
        ) -> Result<String>;

        fn cpp_convert_wif_public_key_to_raw(
            self: &rust_protocol,
            wif_public_key: &str,
        ) -> Result<String>;

        fn cpp_deserialize_transaction(
            self: &rust_protocol,
            hex: &str,
        ) -> Result<UniquePtr<hive_transaction_handle>>;

        fn cpp_legacy_tx_to_json(
            self: &rust_protocol,
            tx_str: &str,
        ) -> Result<String>;

        fn cpp_tx_api_to_proto_json(
            self: &rust_protocol,
            api_json: &str,
        ) -> Result<String>;

        fn cpp_tx_set_expiration(
            self: &rust_protocol,
            tx: Pin<&mut hive_transaction_handle>,
            expiration: &str,
        ) -> Result<()>;

        fn cpp_get_tapos_data(
            self: &rust_protocol,
            block_id: &str,
        ) -> Result<RustRefBlockData>;

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

        fn cpp_get_hive_protocol_config(
            self: &rust_protocol,
            chain_id: &str,
        ) -> Result<Vec<RustConfigEntry>>;

        fn cpp_serialize_witness_set_properties(
            self: &rust_protocol,
            data: &RustWitnessSetPropertiesData,
        ) -> Result<Vec<RustWitnessPropEntry>>;

        fn cpp_deserialize_witness_set_properties(
            self: &rust_protocol,
            serialized: &Vec<RustWitnessPropEntry>,
        ) -> Result<RustWitnessSetPropertiesData>;

        fn cpp_check_memo_for_private_keys(
            self: &rust_protocol,
            content: &str,
            account: &str,
            authorities: &RustWaxAuthorities,
            memo_key: &str,
            other_keys: &Vec<String>,
        ) -> Result<()>;

        fn cpp_crypto_memo_dump_string(
            self: &rust_protocol,
            value: &RustCryptoMemo,
        ) -> Result<String>;

        fn cpp_crypto_memo_from_string(
            self: &rust_protocol,
            value: &str,
        ) -> Result<RustCryptoMemo>;
    }
}

pub use ffi::{
    RustAuthPathNode, RustAuthVerificationTrace, RustBinaryData,
    RustBinaryDataNode, RustConfigEntry, RustJsonAsset, RustJsonPrice,
    RustMinimizeRequiredSignaturesData, RustRefBlockData, RustWitnessPropEntry,
    RustWitnessSetPropertiesData, hive_operation_handle,
    hive_transaction_handle, new_rust_protocol, rust_protocol,
};
