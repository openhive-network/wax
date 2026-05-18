use wax_core::ffi::{RustJsonAsset, RustJsonPrice};
use wax_core::{RustTransaction, proto};

use rust_decimal::Decimal;
use rust_decimal::prelude::ToPrimitive;

use crate::WaxError;
use crate::foundation::WaxFoundation;
use crate::internal::models::manabar_data::ManabarData;
use crate::internal::protocol::rust_protocol;
use crate::models::asset::{Asset, AssetAmount, AssetName, NaiAsset, NaiAssetConvertible};
use crate::models::basic::{Hex, HiveDateTime};
use crate::options::WaxOptions;
use crate::result::{HiveAssetData, JsonPrice, RefBlockData};

pub(crate) struct WaxFoundationApi {
    options: WaxOptions,
}

impl WaxFoundationApi {
    pub(crate) fn new(options: WaxOptions) -> Self {
        Self { options }
    }
}

const HIVE_PRECISION: u32 = 3;
const HBD_PRECISION: u32 = 3;
const VESTS_PRECISION: u32 = 6;

impl WaxFoundation for WaxFoundationApi {
    fn hive_coins(&self, amount: AssetAmount) -> Result<NaiAsset, WaxError> {
        let satoshis = amount_to_satoshis(amount, HIVE_PRECISION)?;
        self.hive_satoshis(satoshis)
    }

    fn hbd_coins(&self, amount: AssetAmount) -> Result<NaiAsset, WaxError> {
        let satoshis = amount_to_satoshis(amount, HBD_PRECISION)?;
        self.hbd_satoshis(satoshis)
    }

    fn vests_coins(&self, amount: AssetAmount) -> Result<NaiAsset, WaxError> {
        let satoshis = amount_to_satoshis(amount, VESTS_PRECISION)?;
        self.vests_satoshis(satoshis)
    }

    fn hive_satoshis(&self, amount: i64) -> Result<NaiAsset, WaxError> {
        rust_protocol()
            .cpp_hive(amount)
            .map(to_nai_asset)
            .map_err(WaxError::from)
    }

    fn hbd_satoshis(&self, amount: i64) -> Result<NaiAsset, WaxError> {
        rust_protocol()
            .cpp_hbd(amount)
            .map(to_nai_asset)
            .map_err(WaxError::from)
    }

    fn vests_satoshis(&self, amount: i64) -> Result<NaiAsset, WaxError> {
        rust_protocol()
            .cpp_vests(amount)
            .map(to_nai_asset)
            .map_err(WaxError::from)
    }

    fn hbd_to_hive(
        &self,
        hbd: &NaiAsset,
        base: &NaiAsset,
        quote: &NaiAsset,
    ) -> Result<NaiAsset, WaxError> {
        rust_protocol()
            .cpp_hbd_to_hive(
                &to_ffi_asset(hbd),
                &to_ffi_asset(base),
                &to_ffi_asset(quote),
            )
            .map(to_nai_asset)
            .map_err(WaxError::from)
    }

    fn hive_to_hbd(
        &self,
        amount: &NaiAsset,
        base: &NaiAsset,
        quote: &NaiAsset,
    ) -> Result<NaiAsset, WaxError> {
        rust_protocol()
            .cpp_hive_to_hbd(
                &to_ffi_asset(amount),
                &to_ffi_asset(base),
                &to_ffi_asset(quote),
            )
            .map(to_nai_asset)
            .map_err(WaxError::from)
    }

    fn vests_to_hp(
        &self,
        vests: &NaiAsset,
        total_vesting_fund_hive: &NaiAsset,
        total_vesting_shares: &NaiAsset,
    ) -> Result<NaiAsset, WaxError> {
        rust_protocol()
            .cpp_vests_to_hp(
                &to_ffi_asset(vests),
                &to_ffi_asset(total_vesting_fund_hive),
                &to_ffi_asset(total_vesting_shares),
            )
            .map(to_nai_asset)
            .map_err(WaxError::from)
    }

    fn hp_to_vests(
        &self,
        hive: &NaiAsset,
        total_vesting_fund_hive: &NaiAsset,
        total_vesting_shares: &NaiAsset,
    ) -> Result<NaiAsset, WaxError> {
        rust_protocol()
            .cpp_hp_to_vests(
                &to_ffi_asset(hive),
                &to_ffi_asset(total_vesting_fund_hive),
                &to_ffi_asset(total_vesting_shares),
            )
            .map(to_nai_asset)
            .map_err(WaxError::from)
    }

    fn estimate_hive_collateral(
        &self,
        current_median_history: &JsonPrice,
        current_min_history: &JsonPrice,
        hbd_amount_to_get: &NaiAsset,
    ) -> Result<NaiAsset, WaxError> {
        rust_protocol()
            .cpp_estimate_hive_collateral(
                &to_ffi_price(current_median_history),
                &to_ffi_price(current_min_history),
                &to_ffi_asset(hbd_amount_to_get),
            )
            .map(to_nai_asset)
            .map_err(WaxError::from)
    }

    fn estimate_hbd_interest(
        &self,
        hbd_seconds: u128,
        head_block_time: u32,
        hbd: &NaiAsset,
        hbd_seconds_last_update: u32,
        hbd_interest_rate: u16,
    ) -> Result<NaiAsset, WaxError> {
        let hbd_seconds_low = hbd_seconds as u64;
        let hbd_seconds_high = (hbd_seconds >> 64) as u64;
        rust_protocol()
            .cpp_estimate_hbd_interest(
                hbd_seconds_low,
                hbd_seconds_high,
                head_block_time,
                &to_ffi_asset(hbd),
                hbd_seconds_last_update,
                hbd_interest_rate,
            )
            .map(to_nai_asset)
            .map_err(WaxError::from)
    }

    fn calculate_hp_apr(
        &self,
        head_block_num: u32,
        vesting_reward_percent: u16,
        virtual_supply: &NaiAsset,
        total_vesting_fund_hive: &NaiAsset,
    ) -> Result<String, WaxError> {
        rust_protocol()
            .cpp_calculate_hp_apr(
                head_block_num,
                vesting_reward_percent,
                &to_ffi_asset(virtual_supply),
                &to_ffi_asset(total_vesting_fund_hive),
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

    fn get_asset(&self, asset: &NaiAsset) -> Result<HiveAssetData, WaxError> {
        let protocol = rust_protocol();
        let ffi = to_ffi_asset(asset);
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

    fn create_transaction_from_proto(
        &self,
        transaction: proto::Transaction,
    ) -> Result<RustTransaction, WaxError> {
        Ok(RustTransaction::from_proto(
            rust_protocol(),
            self.options.chain_id.clone(),
            transaction,
        ))
    }

    fn create_transaction_from_json(&self, json: &str) -> Result<RustTransaction, WaxError> {
        RustTransaction::from_json(rust_protocol(), self.options.chain_id.clone(), json)
            .map_err(WaxError::new)
    }

    fn create_transaction_with_tapos(
        &self,
        tapos_block_id: &str,
        expiration: &str,
    ) -> Result<RustTransaction, WaxError> {
        let tapos = rust_protocol()
            .cpp_get_tapos_data(tapos_block_id)
            .map_err(WaxError::from)?;
        Ok(RustTransaction::new(
            rust_protocol(),
            self.options.chain_id.clone(),
            tapos.ref_block_num as u32,
            tapos.ref_block_prefix,
            expiration,
            Vec::new(),
        ))
    }
}

pub(crate) fn to_nai_asset(asset: RustJsonAsset) -> NaiAsset {
    NaiAsset {
        amount: asset.amount,
        precision: asset.precision,
        nai: asset.nai,
    }
}

pub(crate) fn to_ffi_asset(asset: &NaiAsset) -> RustJsonAsset {
    RustJsonAsset {
        amount: asset.amount.clone(),
        precision: asset.precision,
        nai: asset.nai.clone(),
    }
}

pub(crate) fn to_ffi_price(price: &JsonPrice) -> RustJsonPrice {
    RustJsonPrice {
        base: to_ffi_asset(&price.base),
        quote: to_ffi_asset(&price.quote),
    }
}

fn head_block_time_to_now(dt: HiveDateTime) -> i32 {
    dt.inner().timestamp() as i32
}

fn amount_to_satoshis(amount: AssetAmount, precision: u32) -> Result<i64, WaxError> {
    let decimal = match amount {
        AssetAmount::Int(v) => Decimal::from(v),
        AssetAmount::Decimal(v) => v,
        AssetAmount::Float(v) => {
            Decimal::from_f64_retain(v).ok_or(WaxError::DecimalConversionNotANumber)?
        }
    };

    let scaled = decimal * Decimal::from(10_i64.pow(precision));
    scaled
        .trunc()
        .to_i64()
        .ok_or_else(|| WaxError::InvalidAssetAmount {
            amount: scaled.to_string(),
        })
}
