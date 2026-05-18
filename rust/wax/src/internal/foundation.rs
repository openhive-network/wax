use wax_core::ffi::RustJsonAsset;

use crate::foundation::WaxFoundation;
use crate::internal::protocol::{rust_protocol, with_protocol_mut};
use crate::models::basic::Hex;
use crate::options::WaxOptions;
use crate::result::{JsonAsset, RefBlockData};
use crate::WaxError;

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
        with_protocol_mut(|protocol| {
            protocol
                .cpp_get_tapos_data(block_id)
                .map(|d| RefBlockData {
                    ref_block_num: d.ref_block_num,
                    ref_block_prefix: d.ref_block_prefix,
                })
                .map_err(WaxError::from)
        })
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
