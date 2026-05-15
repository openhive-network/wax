use rust_decimal::Decimal;
use wax_core::proto;

pub use crate::internal::models::asset::{Asset, NaiAssetFactory};

pub type NaiAsset = proto::Asset;

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

#[derive(Debug, Clone, PartialEq)]
pub enum NaiAssetConvertible {
    Asset(NaiAsset),
    Json(String),
}

pub type HiveNaiAssetConvertible = NaiAssetConvertible;
pub type HbdNaiAssetConvertible = NaiAssetConvertible;
pub type VestsNaiAssetConvertible = NaiAssetConvertible;
pub type AnyNaiAssetConvertible = NaiAssetConvertible;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum AssetName {
    Hive,
    Hbd,
    Vests,
}

impl AssetName {
    pub fn as_str(&self) -> &'static str {
        match self {
            AssetName::Hive => "HIVE",
            AssetName::Hbd => "HBD",
            AssetName::Vests => "VESTS",
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct AssetInfo {
    pub nai: String,
    pub precision: u32,
}

pub trait AssetFactory {
    fn coins(&self, amount: AssetAmount) -> Result<NaiAsset, crate::WaxError>;
    fn satoshis(&self, amount: i64) -> Result<NaiAsset, crate::WaxError>;
}
