use wax_core::{RustTransaction, proto};

use crate::WaxError;
use crate::internal::models::manabar_data::ManabarData;
use crate::models::asset::{AssetAmount, AssetName, NaiAsset, NaiAssetConvertible};
use crate::models::basic::{Hex, HiveDateTime};
use crate::result::{
    Assets, BrainKeyData, ChainConfig, HiveAssetData, JsonPrice, PrivateKeyData, RefBlockData,
};

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

    fn legacy_transaction_to_json(&self, legacy_json: &str) -> Result<String, WaxError>;

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
}
