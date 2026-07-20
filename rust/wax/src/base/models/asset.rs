//! Asset models: amounts, symbols and the convertible/factory types used to
//! build NAI-encoded assets.

use crate::core::proto;
use rust_decimal::Decimal;

pub use crate::base::internal::models::asset::{Asset, NaiAssetFactory};

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
