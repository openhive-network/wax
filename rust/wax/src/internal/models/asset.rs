use std::collections::HashMap;

use rust_decimal::Decimal;
use rust_decimal::prelude::*;
use wax_core::RustJsonAsset;

use crate::WaxError;
use crate::internal::protocol::rust_protocol;
use crate::models::asset::{
    AssetAmount, AssetFactory, AssetInfo, AssetName, NaiAsset, NaiAssetConvertible,
};

const INIT_CPP_ASSET_AMOUNT: i64 = 0;

pub struct Asset {
    assets: HashMap<AssetName, NaiAsset>,
}

impl Asset {
    pub fn new() -> Result<Self, WaxError> {
        let to_nai = |ffi: Result<RustJsonAsset, _>| {
            ffi.map(|a| NaiAsset {
                amount: a.amount,
                precision: a.precision,
                nai: a.nai,
            })
            .map_err(WaxError::from)
        };

        Ok(Self {
            assets: HashMap::from([
                (
                    AssetName::Hive,
                    to_nai(rust_protocol().cpp_hive(INIT_CPP_ASSET_AMOUNT))?,
                ),
                (
                    AssetName::Hbd,
                    to_nai(rust_protocol().cpp_hbd(INIT_CPP_ASSET_AMOUNT))?,
                ),
                (
                    AssetName::Vests,
                    to_nai(rust_protocol().cpp_vests(INIT_CPP_ASSET_AMOUNT))?,
                ),
            ]),
        })
    }

    pub fn get_asset_info(&self, asset_name: AssetName) -> Result<AssetInfo, WaxError> {
        let cpp_asset = self.cpp_asset(asset_name)?;
        Ok(AssetInfo {
            nai: cpp_asset.nai.clone(),
            precision: cpp_asset.precision,
        })
    }

    pub fn create_wax_asset(
        &self,
        asset_name: AssetName,
        amount: AssetAmount,
        use_precision: bool,
    ) -> Result<NaiAsset, WaxError> {
        let info = self.get_asset_info(asset_name)?;

        if !use_precision {
            return Ok(NaiAsset {
                amount: amount_to_string(amount),
                precision: info.precision,
                nai: info.nai,
            });
        }

        let scaled = amount_to_decimal(amount)? * scale(info.precision);
        let integer_amount =
            scaled
                .trunc()
                .to_i128()
                .ok_or_else(|| WaxError::InvalidAssetAmount {
                    amount: scaled.to_string(),
                })?;

        Ok(NaiAsset {
            amount: integer_amount.to_string(),
            precision: info.precision,
            nai: info.nai,
        })
    }

    pub fn create_asset_satoshis(
        &self,
        asset_name: AssetName,
        amount: i64,
    ) -> Result<NaiAsset, WaxError> {
        self.create_wax_asset(asset_name, AssetAmount::Int(amount), false)
    }

    pub fn create_asset_factory(&self, asset_name: AssetName) -> NaiAssetFactory<'_> {
        NaiAssetFactory {
            asset: self,
            asset_name,
        }
    }

    pub fn resolve_from_convertible_type(
        &self,
        asset_name: AssetName,
        asset: NaiAssetConvertible,
    ) -> Result<NaiAsset, WaxError> {
        let proper_asset = self.cpp_asset(asset_name)?;
        match asset {
            NaiAssetConvertible::Asset(a) => {
                self.assert_asset_nai_valid(proper_asset, &a)?;
                Ok(a)
            }
            NaiAssetConvertible::Json(s) => {
                // TODO: add JSON parsing once a json crate is justified by a
                // real caller. Python uses stdlib `json.loads` here.
                Err(WaxError::CannotCreateAsset { potential_asset: s })
            }
        }
    }

    pub fn normalize_asset(&self, asset: NaiAsset) -> Result<NaiAsset, WaxError> {
        let matched = self
            .assets
            .iter()
            .find(|(_, cpp_asset)| cpp_asset.nai == asset.nai)
            .map(|(name, _)| *name);

        let amount: i64 = asset
            .amount
            .parse()
            .map_err(|_| WaxError::InvalidAssetAmount {
                amount: asset.amount.clone(),
            })?;

        let protocol = rust_protocol();
        let ffi = match matched {
            Some(AssetName::Hive) => protocol.cpp_hive(amount),
            Some(AssetName::Hbd) => protocol.cpp_hbd(amount),
            Some(AssetName::Vests) => protocol.cpp_vests(amount),
            None => return Err(WaxError::UnknownAssetNai { nai: asset.nai }),
        }
        .map_err(WaxError::from)?;

        Ok(NaiAsset {
            amount: ffi.amount,
            precision: ffi.precision,
            nai: ffi.nai,
        })
    }

    fn assert_asset_nai_valid(
        &self,
        valid_asset: &NaiAsset,
        asset_to_check: &NaiAsset,
    ) -> Result<(), WaxError> {
        if valid_asset.nai == asset_to_check.nai {
            return Ok(());
        }
        Err(WaxError::new("Nai is not the same as expected."))
    }

    fn cpp_asset(&self, asset_name: AssetName) -> Result<&NaiAsset, WaxError> {
        self.assets
            .get(&asset_name)
            .ok_or_else(|| WaxError::UnknownAssetType {
                symbol: asset_name.as_str().to_string(),
            })
    }
}

pub struct NaiAssetFactory<'a> {
    asset: &'a Asset,
    asset_name: AssetName,
}

impl<'a> AssetFactory for NaiAssetFactory<'a> {
    fn coins(&self, amount: AssetAmount) -> Result<NaiAsset, WaxError> {
        self.asset.create_wax_asset(self.asset_name, amount, true)
    }

    fn satoshis(&self, amount: i64) -> Result<NaiAsset, WaxError> {
        self.asset.create_asset_satoshis(self.asset_name, amount)
    }
}

fn amount_to_decimal(amount: AssetAmount) -> Result<Decimal, WaxError> {
    match amount {
        AssetAmount::Int(v) => Ok(Decimal::from(v)),
        AssetAmount::Decimal(v) => Ok(v),
        AssetAmount::Float(v) => {
            Decimal::from_f64_retain(v).ok_or(WaxError::DecimalConversionNotANumber)
        }
    }
}

fn amount_to_string(amount: AssetAmount) -> String {
    match amount {
        AssetAmount::Int(v) => v.to_string(),
        AssetAmount::Float(v) => v.to_string(),
        AssetAmount::Decimal(v) => v.to_string(),
    }
}

fn scale(precision: u32) -> Decimal {
    Decimal::from(10_i64.pow(precision))
}
