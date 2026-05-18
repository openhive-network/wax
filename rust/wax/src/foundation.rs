use crate::WaxError;
use crate::models::basic::Hex;
use crate::result::{JsonAsset, JsonPrice, RefBlockData};

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

    fn is_valid_account_name(&self, name: &str) -> bool;

    fn deserialize_transaction(&self, hex: &Hex) -> Result<String, WaxError>;
    // TODO: probably remove this
    fn legacy_transaction_to_json(&self, legacy_json: &str) -> Result<String, WaxError>;

    fn get_tapos_data(&self, block_id: &str) -> Result<RefBlockData, WaxError>;
}
