use wax_core::{RustTransaction, proto};

use crate::WaxError;
use crate::internal::models::manabar_data::ManabarData;
use crate::models::asset::{AssetName, NaiAsset, NaiAssetConvertible};
use crate::models::basic::{Hex, HiveDateTime};
use crate::result::{HiveAssetData, JsonAsset, JsonPrice, RefBlockData};

pub trait WaxFoundation {
    fn hive(&self, amount: i64) -> Result<JsonAsset, WaxError>;
    fn hbd(&self, amount: i64) -> Result<JsonAsset, WaxError>;
    fn vests(&self, amount: i64) -> Result<JsonAsset, WaxError>;

    fn hbd_to_hive(
        &self,
        hbd: &JsonAsset,
        base: &JsonAsset,
        quote: &JsonAsset,
    ) -> Result<JsonAsset, WaxError>;

    fn hive_to_hbd(
        &self,
        amount: &JsonAsset,
        base: &JsonAsset,
        quote: &JsonAsset,
    ) -> Result<JsonAsset, WaxError>;

    fn vests_to_hp(
        &self,
        vests: &JsonAsset,
        total_vesting_fund_hive: &JsonAsset,
        total_vesting_shares: &JsonAsset,
    ) -> Result<JsonAsset, WaxError>;

    fn hp_to_vests(
        &self,
        hive: &JsonAsset,
        total_vesting_fund_hive: &JsonAsset,
        total_vesting_shares: &JsonAsset,
    ) -> Result<JsonAsset, WaxError>;

    fn estimate_hive_collateral(
        &self,
        current_median_history: &JsonPrice,
        current_min_history: &JsonPrice,
        hbd_amount_to_get: &JsonAsset,
    ) -> Result<JsonAsset, WaxError>;

    fn estimate_hbd_interest(
        &self,
        hbd_seconds: u128,
        head_block_time: u32,
        hbd: &JsonAsset,
        hbd_seconds_last_update: u32,
        hbd_interest_rate: u16,
    ) -> Result<JsonAsset, WaxError>;

    fn calculate_hp_apr(
        &self,
        head_block_num: u32,
        vesting_reward_percent: u16,
        virtual_supply: &JsonAsset,
        total_vesting_fund_hive: &JsonAsset,
    ) -> Result<String, WaxError>;

    fn create_asset_with_required_symbol(
        &self,
        required_symbol: AssetName,
        asset: NaiAssetConvertible,
    ) -> Result<NaiAsset, WaxError>;

    fn get_asset(&self, asset: &JsonAsset) -> Result<HiveAssetData, WaxError>;

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

    fn deserialize_transaction(&self, hex: &Hex) -> Result<String, WaxError>;
    // TODO: probably remove this
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
