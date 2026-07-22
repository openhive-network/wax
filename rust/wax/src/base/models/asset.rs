//! Asset models: amounts, symbols, the convertible form accepted by the
//! builders and the chain-context helper building NAI-encoded assets.

use std::collections::HashMap;
use std::str::FromStr;

use crate::core::{RustJsonAsset, proto};

use rust_decimal::Decimal;
use rust_decimal::prelude::*;

use crate::WaxError;
use crate::base::internal::protocol::rust_protocol;

const INIT_CPP_ASSET_AMOUNT: i64 = 0;

/// Represents the asset helper bound to a chain context, caching the native
/// HIVE/HBD/VESTS symbol metadata obtained from the C++ layer.
pub struct Asset {
    assets: HashMap<AssetName, NaiAsset>,
}

impl Asset {
    /// Creates an asset helper, loading the native symbols' metadata.
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

    /// Returns the NAI and precision metadata for the given symbol.
    pub fn get_asset_info(
        &self,
        asset_name: AssetName,
    ) -> Result<AssetInfo, WaxError> {
        let cpp_asset = self.cpp_asset(asset_name)?;
        Ok(AssetInfo {
            nai: cpp_asset.nai.clone(),
            precision: cpp_asset.precision,
        })
    }

    /// Creates a NAI asset of the given symbol from an amount, optionally
    /// scaling whole coins by the symbol's precision.
    pub fn create_wax_asset(
        &self,
        asset_name: AssetName,
        amount: impl Into<AssetAmount>,
        use_precision: bool,
    ) -> Result<NaiAsset, WaxError> {
        let amount = amount.into();
        let info = self.get_asset_info(asset_name)?;

        if !use_precision {
            return Ok(NaiAsset {
                amount: amount_to_string(amount),
                precision: info.precision,
                nai: info.nai,
            });
        }

        let scaled = amount_to_decimal(amount)? * scale(info.precision);
        let integer_amount = scaled.trunc().to_i128().ok_or_else(|| {
            WaxError::InvalidAssetAmount {
                amount: scaled.to_string(),
            }
        })?;

        Ok(NaiAsset {
            amount: integer_amount.to_string(),
            precision: info.precision,
            nai: info.nai,
        })
    }

    /// Creates a NAI asset of the given symbol from a raw satoshi amount.
    pub fn create_asset_satoshis(
        &self,
        asset_name: AssetName,
        amount: i64,
    ) -> Result<NaiAsset, WaxError> {
        self.create_wax_asset(asset_name, AssetAmount::Int(amount), false)
    }

    /// Returns a [`NaiAssetFactory`] bound to the given symbol.
    pub fn create_asset_factory(
        &self,
        asset_name: AssetName,
    ) -> NaiAssetFactory<'_> {
        NaiAssetFactory {
            asset: self,
            asset_name,
        }
    }

    /// Resolves a [`NaiAssetConvertible`] into a [`NaiAsset`], validating that
    /// its NAI matches the expected symbol.
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
                let cannot = || WaxError::CannotCreateAsset {
                    potential_asset: s.clone(),
                };

                let parsed: serde_json::Value =
                    serde_json::from_str(&s).map_err(|_| cannot())?;

                let amount = parsed
                    .get("amount")
                    .and_then(serde_json::Value::as_str)
                    .ok_or_else(cannot)?
                    .to_string();
                let precision = parsed
                    .get("precision")
                    .and_then(serde_json::Value::as_u64)
                    .and_then(|n| u32::try_from(n).ok())
                    .ok_or_else(cannot)?;
                let nai = parsed
                    .get("nai")
                    .and_then(serde_json::Value::as_str)
                    .ok_or_else(cannot)?
                    .to_string();

                let asset = NaiAsset {
                    amount,
                    precision,
                    nai,
                };

                self.assert_asset_nai_valid(proper_asset, &asset)
                    .map_err(|_| cannot())?;

                Ok(asset)
            }
        }
    }

    /// Normalizes an asset's amount through the C++ layer, validating its NAI.
    pub fn normalize_asset(
        &self,
        asset: NaiAsset,
    ) -> Result<NaiAsset, WaxError> {
        let matched = self
            .assets
            .iter()
            .find(|(_, cpp_asset)| cpp_asset.nai == asset.nai)
            .map(|(name, _)| *name);

        let amount: i64 =
            asset
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

/// Represents an asset constructor bound to a single symbol of an [`Asset`],
/// building assets from either whole coins or raw satoshis.
pub struct NaiAssetFactory<'a> {
    asset: &'a Asset,
    asset_name: AssetName,
}

impl<'a> NaiAssetFactory<'a> {
    /// Creates an asset from a whole-coin amount (precision applied).
    pub fn coins(
        &self,
        amount: impl Into<AssetAmount>,
    ) -> Result<NaiAsset, WaxError> {
        self.asset.create_wax_asset(self.asset_name, amount, true)
    }

    /// Creates an asset from a raw satoshi amount (no precision scaling).
    pub fn satoshis(&self, amount: i64) -> Result<NaiAsset, WaxError> {
        self.asset.create_asset_satoshis(self.asset_name, amount)
    }
}

/// Represents a NAI-encoded asset (amount, precision and NAI symbol).
pub type NaiAsset = proto::Asset;

/// Represents an asset amount accepted by the builders, in any of the numeric
/// forms a caller may provide.
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum AssetAmount {
    Int(i64),
    Float(f64),
    Decimal(Decimal),
}

impl From<i64> for AssetAmount {
    fn from(value: i64) -> Self {
        Self::Int(value)
    }
}

impl From<i32> for AssetAmount {
    fn from(value: i32) -> Self {
        Self::Int(value.into())
    }
}

impl From<f64> for AssetAmount {
    fn from(value: f64) -> Self {
        Self::Float(value)
    }
}

impl From<Decimal> for AssetAmount {
    fn from(value: Decimal) -> Self {
        Self::Decimal(value)
    }
}

/// Represents a value that can be resolved into a [`NaiAsset`], either an
/// already-built asset or its JSON form.
#[derive(Debug, Clone, PartialEq)]
pub enum NaiAssetConvertible {
    Asset(NaiAsset),
    Json(String),
}

// NOTE: the default is an empty-asset placeholder enabling
// `..Default::default()` on the complex-operation types carrying a required
// amount; resolving it unset fails symbol coercion at `finalize` time.
impl Default for NaiAssetConvertible {
    fn default() -> Self {
        Self::Asset(NaiAsset::default())
    }
}

/// Represents one of the three native Hive asset symbols.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum AssetName {
    Hive,
    Hbd,
    Vests,
}

impl AssetName {
    /// Returns the upper-case symbol string for the asset.
    pub fn as_str(&self) -> &'static str {
        match self {
            AssetName::Hive => "HIVE",
            AssetName::Hbd => "HBD",
            AssetName::Vests => "VESTS",
        }
    }
}

/// Represents the static metadata of an asset symbol: its NAI and precision.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct AssetInfo {
    pub nai: String,
    pub precision: u32,
}

fn amount_to_decimal(amount: AssetAmount) -> Result<Decimal, WaxError> {
    match amount {
        AssetAmount::Int(v) => Ok(Decimal::from(v)),
        AssetAmount::Decimal(v) => Ok(v),
        // NOTE: via the shortest round-trip string — matches the JS
        // `String(number)` coercion (see `foundation::amount_to_satoshis`).
        AssetAmount::Float(v) => Decimal::from_str(&v.to_string())
            .map_err(|_| WaxError::DecimalConversionNotANumber),
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
