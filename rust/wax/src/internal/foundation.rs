use wax_core::ffi::{RustJsonAsset, RustJsonPrice};

use crate::WaxError;
use crate::foundation::WaxFoundation;
use crate::internal::models::manabar_data::ManabarData;
use crate::internal::protocol::rust_protocol;
use crate::models::asset::{Asset, AssetName, NaiAsset, NaiAssetConvertible};
use crate::models::basic::{Hex, HiveDateTime};
use crate::options::WaxOptions;
use crate::result::{HiveAssetData, JsonAsset, JsonPrice, RefBlockData};

pub(crate) struct WaxFoundationApi {
    #[allow(dead_code)]
    options: WaxOptions,
}

impl WaxFoundationApi {
    pub(crate) fn new(options: WaxOptions) -> Self {
        Self { options }
    }
}

impl WaxFoundation for WaxFoundationApi {
    fn hive(&self, amount: i64) -> Result<JsonAsset, WaxError> {
        rust_protocol()
            .cpp_hive(amount)
            .map(to_json_asset)
            .map_err(WaxError::from)
    }

    fn hbd(&self, amount: i64) -> Result<JsonAsset, WaxError> {
        rust_protocol()
            .cpp_hbd(amount)
            .map(to_json_asset)
            .map_err(WaxError::from)
    }

    fn vests(&self, amount: i64) -> Result<JsonAsset, WaxError> {
        rust_protocol()
            .cpp_vests(amount)
            .map(to_json_asset)
            .map_err(WaxError::from)
    }

    fn hbd_to_hive(
        &self,
        hbd: &JsonAsset,
        base: &JsonAsset,
        quote: &JsonAsset,
    ) -> Result<JsonAsset, WaxError> {
        rust_protocol()
            .cpp_hbd_to_hive(
                &from_json_asset(hbd),
                &from_json_asset(base),
                &from_json_asset(quote),
            )
            .map(to_json_asset)
            .map_err(WaxError::from)
    }

    fn hive_to_hbd(
        &self,
        amount: &JsonAsset,
        base: &JsonAsset,
        quote: &JsonAsset,
    ) -> Result<JsonAsset, WaxError> {
        rust_protocol()
            .cpp_hive_to_hbd(
                &from_json_asset(amount),
                &from_json_asset(base),
                &from_json_asset(quote),
            )
            .map(to_json_asset)
            .map_err(WaxError::from)
    }

    fn vests_to_hp(
        &self,
        vests: &JsonAsset,
        total_vesting_fund_hive: &JsonAsset,
        total_vesting_shares: &JsonAsset,
    ) -> Result<JsonAsset, WaxError> {
        rust_protocol()
            .cpp_vests_to_hp(
                &from_json_asset(vests),
                &from_json_asset(total_vesting_fund_hive),
                &from_json_asset(total_vesting_shares),
            )
            .map(to_json_asset)
            .map_err(WaxError::from)
    }

    fn hp_to_vests(
        &self,
        hive: &JsonAsset,
        total_vesting_fund_hive: &JsonAsset,
        total_vesting_shares: &JsonAsset,
    ) -> Result<JsonAsset, WaxError> {
        rust_protocol()
            .cpp_hp_to_vests(
                &from_json_asset(hive),
                &from_json_asset(total_vesting_fund_hive),
                &from_json_asset(total_vesting_shares),
            )
            .map(to_json_asset)
            .map_err(WaxError::from)
    }

    fn estimate_hive_collateral(
        &self,
        current_median_history: &JsonPrice,
        current_min_history: &JsonPrice,
        hbd_amount_to_get: &JsonAsset,
    ) -> Result<JsonAsset, WaxError> {
        rust_protocol()
            .cpp_estimate_hive_collateral(
                &from_json_price(current_median_history),
                &from_json_price(current_min_history),
                &from_json_asset(hbd_amount_to_get),
            )
            .map(to_json_asset)
            .map_err(WaxError::from)
    }

    fn estimate_hbd_interest(
        &self,
        hbd_seconds: u128,
        head_block_time: u32,
        hbd: &JsonAsset,
        hbd_seconds_last_update: u32,
        hbd_interest_rate: u16,
    ) -> Result<JsonAsset, WaxError> {
        let hbd_seconds_low = hbd_seconds as u64;
        let hbd_seconds_high = (hbd_seconds >> 64) as u64;
        rust_protocol()
            .cpp_estimate_hbd_interest(
                hbd_seconds_low,
                hbd_seconds_high,
                head_block_time,
                &from_json_asset(hbd),
                hbd_seconds_last_update,
                hbd_interest_rate,
            )
            .map(to_json_asset)
            .map_err(WaxError::from)
    }

    fn calculate_hp_apr(
        &self,
        head_block_num: u32,
        vesting_reward_percent: u16,
        virtual_supply: &JsonAsset,
        total_vesting_fund_hive: &JsonAsset,
    ) -> Result<String, WaxError> {
        rust_protocol()
            .cpp_calculate_hp_apr(
                head_block_num,
                vesting_reward_percent,
                &from_json_asset(virtual_supply),
                &from_json_asset(total_vesting_fund_hive),
            )
            .map_err(WaxError::from)
    }

    fn create_asset_with_required_symbol(
        &self,
        required_symbol: AssetName,
        asset: NaiAssetConvertible,
    ) -> Result<NaiAsset, WaxError> {
        Asset::new()?.resolve_from_convertible_type(required_symbol, asset)
    }

    fn get_asset(&self, asset: &JsonAsset) -> Result<HiveAssetData, WaxError> {
        let protocol = rust_protocol();
        let ffi = from_json_asset(asset);
        let amount = protocol.cpp_asset_value(&ffi).map_err(WaxError::from)?;
        let symbol = protocol.cpp_asset_symbol(&ffi).map_err(WaxError::from)?;
        Ok(HiveAssetData { amount, symbol })
    }

    fn calculate_current_manabar_value(
        &self,
        head_block_time: HiveDateTime,
        max_mana: i64,
        current_mana: i64,
        last_update_time: u32,
    ) -> Result<ManabarData, WaxError> {
        let now = head_block_time_to_now(head_block_time);
        let regenerated = rust_protocol()
            .cpp_calculate_current_manabar_value(now, max_mana, current_mana, last_update_time)
            .map_err(WaxError::from)?;
        Ok(ManabarData::new(max_mana, regenerated))
    }

    fn calculate_manabar_full_regeneration_time(
        &self,
        head_block_time: HiveDateTime,
        max_mana: i64,
        current_mana: i64,
        last_update_time: u32,
    ) -> Result<u64, WaxError> {
        let now = head_block_time_to_now(head_block_time);
        rust_protocol()
            .cpp_calculate_manabar_full_regeneration_time(
                now,
                max_mana,
                current_mana,
                last_update_time,
            )
            .map_err(WaxError::from)
    }

    fn is_valid_account_name(&self, name: &str) -> bool {
        rust_protocol().cpp_is_valid_account_name(name)
    }

    fn deserialize_transaction(&self, hex: &Hex) -> Result<String, WaxError> {
        let protocol = rust_protocol();
        let handle = protocol
            .cpp_deserialize_transaction(hex)
            .map_err(WaxError::from)?;
        protocol.cpp_tx_to_json(&handle).map_err(WaxError::from)
    }

    fn legacy_transaction_to_json(&self, legacy_json: &str) -> Result<String, WaxError> {
        rust_protocol()
            .cpp_legacy_tx_to_json(legacy_json)
            .map_err(WaxError::from)
    }

    fn get_tapos_data(&self, block_id: &str) -> Result<RefBlockData, WaxError> {
        rust_protocol()
            .cpp_get_tapos_data(block_id)
            .map(|d| RefBlockData {
                ref_block_num: d.ref_block_num,
                ref_block_prefix: d.ref_block_prefix,
            })
            .map_err(WaxError::from)
    }
}

pub(crate) fn to_json_asset(asset: RustJsonAsset) -> JsonAsset {
    JsonAsset {
        amount: asset.amount,
        precision: asset.precision,
        nai: asset.nai,
    }
}

pub(crate) fn from_json_asset(asset: &JsonAsset) -> RustJsonAsset {
    RustJsonAsset {
        amount: asset.amount.clone(),
        precision: asset.precision,
        nai: asset.nai.clone(),
    }
}

pub(crate) fn from_json_price(price: &JsonPrice) -> RustJsonPrice {
    RustJsonPrice {
        base: from_json_asset(&price.base),
        quote: from_json_asset(&price.quote),
    }
}

/// Reduces a `HiveDateTime` to the `int32_t` unix timestamp the C++ manabar
/// helpers consume — same `int(dt.timestamp())` shape as Python's wrapper.
fn head_block_time_to_now(dt: HiveDateTime) -> i32 {
    dt.inner().timestamp() as i32
}
