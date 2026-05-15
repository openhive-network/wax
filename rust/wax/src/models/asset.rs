use wax_core::proto;

pub type NaiAsset = proto::Asset;

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum AssetAmount {
    Int(i64),
    Float(f64),
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
    fn coins(amount: AssetAmount) -> NaiAsset;
    fn satoshis(amount: i64) -> NaiAsset;
}
