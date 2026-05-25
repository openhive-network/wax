use wax_core::{RustTransaction, proto};

use crate::WaxError;
use crate::internal::models::manabar_data::ManabarData;
use crate::models::asset::{AssetAmount, AssetName, NaiAsset, NaiAssetConvertible};
use crate::models::basic::{AccountName, Hex, HiveDateTime, PublicKey, SigDigest, Signature};
use crate::result::{
    Assets, BinaryViewOutputData, BrainKeyData, ChainConfig, HiveAssetData, JsonPrice,
    PrivateKeyData, RefBlockData,
    WitnessSetPropertiesProps,
};
use std::collections::HashMap;

pub trait WaxFoundation {
    /// Chain id this foundation was constructed with. Matches TS
    /// `IWaxBaseInterface.chainId`.
    fn chain_id(&self) -> &str;

    /// Hive address prefix (typically `"STM"` for mainnet). Derived from
    /// [`Self::config`] via the `HIVE_ADDRESS_PREFIX` key.
    fn address_prefix(&self) -> Result<String, WaxError>;

    /// Full hived protocol config for this chain — the map returned by
    /// `hive::protocol::get_config`. Result is cached per foundation instance.
    fn config(&self) -> Result<ChainConfig, WaxError>;

    /// Bundled crate version (`CARGO_PKG_VERSION`). Mirrors TS `getVersion()`,
    /// which returns the npm package version.
    fn get_version(&self) -> &'static str;

    /// Derive a new foundation that shares this one's runtime state but uses
    /// the given chain id. Mirrors TS `extendConfig({ chainId })`.
    fn extend_config(&self, chain_id: &str) -> Box<dyn WaxFoundation>;

    /// Zero-amount NaiAsset templates for HIVE / HBD / VESTS. Mirrors TS
    /// `IWaxBaseInterface.ASSETS`. Result is cached per foundation instance.
    fn assets(&self) -> Result<Assets, WaxError>;

    fn hive_coins(&self, amount: AssetAmount) -> Result<NaiAsset, WaxError>;
    fn hbd_coins(&self, amount: AssetAmount) -> Result<NaiAsset, WaxError>;
    fn vests_coins(&self, amount: AssetAmount) -> Result<NaiAsset, WaxError>;

    fn hive_satoshis(&self, amount: i64) -> Result<NaiAsset, WaxError>;
    fn hbd_satoshis(&self, amount: i64) -> Result<NaiAsset, WaxError>;
    fn vests_satoshis(&self, amount: i64) -> Result<NaiAsset, WaxError>;

    fn hbd_to_hive(
        &self,
        hbd: &NaiAsset,
        base: &NaiAsset,
        quote: &NaiAsset,
    ) -> Result<NaiAsset, WaxError>;

    fn hive_to_hbd(
        &self,
        amount: &NaiAsset,
        base: &NaiAsset,
        quote: &NaiAsset,
    ) -> Result<NaiAsset, WaxError>;

    fn vests_to_hp(
        &self,
        vests: &NaiAsset,
        total_vesting_fund_hive: &NaiAsset,
        total_vesting_shares: &NaiAsset,
    ) -> Result<NaiAsset, WaxError>;

    fn hp_to_vests(
        &self,
        hive: &NaiAsset,
        total_vesting_fund_hive: &NaiAsset,
        total_vesting_shares: &NaiAsset,
    ) -> Result<NaiAsset, WaxError>;

    fn calculate_account_hp(
        &self,
        vests: NaiAssetConvertible,
        total_vesting_fund_hive: NaiAssetConvertible,
        total_vesting_shares: NaiAssetConvertible,
    ) -> Result<NaiAsset, WaxError>;

    fn calculate_witness_votes_hp(
        &self,
        votes: NaiAssetConvertible,
        total_vesting_fund_hive: NaiAssetConvertible,
        total_vesting_shares: NaiAssetConvertible,
    ) -> Result<NaiAsset, WaxError>;

    fn estimate_hive_collateral(
        &self,
        current_median_history: &JsonPrice,
        current_min_history: &JsonPrice,
        hbd_amount_to_get: &NaiAsset,
    ) -> Result<NaiAsset, WaxError>;

    fn estimate_hbd_interest(
        &self,
        hbd_seconds: u128,
        head_block_time: u32,
        hbd: &NaiAsset,
        hbd_seconds_last_update: u32,
        hbd_interest_rate: u16,
    ) -> Result<NaiAsset, WaxError>;

    fn calculate_hp_apr(
        &self,
        head_block_num: u32,
        vesting_reward_percent: u16,
        virtual_supply: &NaiAsset,
        total_vesting_fund_hive: &NaiAsset,
    ) -> Result<String, WaxError>;

    fn create_asset_with_required_symbol(
        &self,
        required_symbol: AssetName,
        asset: NaiAssetConvertible,
    ) -> Result<NaiAsset, WaxError>;

    fn get_asset(&self, asset: &NaiAsset) -> Result<HiveAssetData, WaxError>;

    fn calculate_current_manabar_value(
        &self,
        head_block_time: HiveDateTime,
        max_mana: i64,
        current_mana: i64,
        last_update_time: u32,
    ) -> Result<ManabarData, WaxError>;

    fn calculate_manabar_full_regeneration_time(
        &self,
        head_block_time: HiveDateTime,
        max_mana: i64,
        current_mana: i64,
        last_update_time: u32,
    ) -> Result<u64, WaxError>;

    fn is_valid_account_name(&self, name: &str) -> bool;

    fn calculate_public_key(&self, wif_private_key: &str) -> Result<String, WaxError>;

    /// Recover the WIF-format public key that produced `signature` for the
    /// given transaction `sig_digest`. Mirrors TS `getPublicKeyFromSignature`
    /// and Python `base_api.get_public_key_from_signature`.
    fn get_public_key_from_signature(
        &self,
        sig_digest: &SigDigest,
        signature: &Signature,
    ) -> Result<PublicKey, WaxError>;

    fn suggest_brain_key(&self) -> Result<BrainKeyData, WaxError>;

    fn get_private_key_from_password(
        &self,
        account: &str,
        role: &str,
        password: &str,
    ) -> Result<PrivateKeyData, WaxError>;

    fn convert_raw_private_key_to_wif(&self, raw_private_key: &Hex) -> Result<String, WaxError>;

    fn convert_raw_public_key_to_wif(&self, raw_public_key: &Hex) -> Result<String, WaxError>;

    fn deserialize_transaction(&self, hex: &Hex) -> Result<String, WaxError>;

    /// Convert a transaction from Hive API-form JSON into its HF26 binary
    /// (hex) form. Mirrors TS `convertTransactionToBinaryForm`.
    ///
    /// Pass `strip_to_unsigned = true` to drop the signatures container before
    /// serialization — useful when computing an external transaction hash.
    fn convert_transaction_to_binary_form(
        &self,
        transaction: &serde_json::Value,
        strip_to_unsigned: bool,
    ) -> Result<Hex, WaxError>;

    /// Convert a transaction from HF26 binary (hex) form back into a Hive
    /// API-form JSON object. Mirrors TS `convertTransactionFromBinaryForm`.
    ///
    /// Unlike [`Self::deserialize_transaction`] (which returns the raw JSON
    /// string), this returns a parsed [`serde_json::Value`] for structured
    /// access by callers.
    fn convert_transaction_from_binary_form(
        &self,
        hex: &Hex,
    ) -> Result<serde_json::Value, WaxError>;

    fn legacy_transaction_to_json(&self, legacy_json: &str) -> Result<String, WaxError>;

    /// Build a [`RustTransaction`] from a legacy-form JSON transaction. Mirrors
    /// TS `createTransactionFromLegacyJson` and Python's
    /// `create_transaction_from_legacy_json`: rewrites the legacy payload to
    /// HF26/API JSON via [`Self::legacy_transaction_to_json`] and then parses
    /// it with [`Self::create_transaction_from_json`].
    fn create_transaction_from_legacy_json(
        &self,
        legacy_json: &str,
    ) -> Result<RustTransaction, WaxError>;

    fn get_tapos_data(&self, block_id: &str) -> Result<RefBlockData, WaxError>;

    fn create_transaction_from_proto(
        &self,
        transaction: proto::Transaction,
    ) -> Result<RustTransaction, WaxError>;

    fn create_transaction_from_json(&self, json: &str) -> Result<RustTransaction, WaxError>;

    fn create_transaction_with_tapos(
        &self,
        tapos_block_id: &str,
        expiration: &str,
    ) -> Result<RustTransaction, WaxError>;

    /// Build a transaction from chain reference data: a tapos block id, plus
    /// optional head-block time and expiration spec. Mirrors TS
    /// `createTransactionWithChainReferenceData`.
    ///
    /// `expiration` accepts either an absolute Hive timestamp
    /// (`"2026-05-15T12:00:00"`) or a `+N[s|m|h]` relative offset (unitless
    /// suffix is treated as seconds). When `None`, defaults to `"+1m"` —
    /// matching the TS default.
    ///
    /// `head_block_time` is only used as the reference for relative offsets on
    /// **non-default** chains (testnet/mirrornet). On mainnet it is ignored in
    /// favor of the local clock, so transaction expiration doesn't depend on
    /// API-node time accuracy.
    fn create_transaction_with_chain_reference_data(
        &self,
        tapos_block_id: &str,
        head_block_time: Option<HiveDateTime>,
        expiration: Option<&str>,
    ) -> Result<RustTransaction, WaxError>;

    /// Accounts whose state would be affected by `operation`. Mirrors TS
    /// `operationGetImpactedAccounts` and Python's equivalent on the base API.
    /// The order of the returned list matches the C++ producer; callers that
    /// need deduplication should collect into a set themselves.
    fn operation_get_impacted_accounts(
        &self,
        operation: &proto::Operation,
    ) -> Result<Vec<AccountName>, WaxError>;

    /// Binary view of `operation`: the wire-form hex plus a parsed AST
    /// annotating each byte range with its field name and type. Mirrors TS
    /// `operationBinaryViewMetadata` (TS defaults `use_hf26_serialization` to
    /// `true`; Rust requires the flag explicitly).
    fn operation_binary_view_metadata(
        &self,
        operation: &proto::Operation,
        use_hf26_serialization: bool,
    ) -> Result<BinaryViewOutputData, WaxError>;

    /// Serialize witness-update props into the `name → hex(packed bytes)` map
    /// that `witness_set_properties_operation.props` expects on the wire.
    ///
    /// Mirrors the TS `serializeWitnessProps` and Python `serialize_witness_props`
    /// base-API helpers. Optional fields on `props` that are `None` are simply
    /// omitted from the output, matching the C++ behaviour.
    fn serialize_witness_props(
        &self,
        props: &WitnessSetPropertiesProps,
    ) -> Result<HashMap<String, String>, WaxError>;
}
