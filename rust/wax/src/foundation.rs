use crate::models::basic::Hex;
use crate::result::{JsonAsset, RefBlockData};
use crate::WaxError;

pub trait WaxFoundation {
    fn hive(&self, amount: i64) -> Result<JsonAsset, WaxError>;
    fn hbd(&self, amount: i64) -> Result<JsonAsset, WaxError>;
    fn vests(&self, amount: i64) -> Result<JsonAsset, WaxError>;

    fn is_valid_account_name(&self, name: &str) -> bool;

    fn deserialize_transaction(&self, hex: &Hex) -> Result<String, WaxError>;
    // TODO: probably remove this
    fn legacy_transaction_to_json(&self, legacy_json: &str) -> Result<String, WaxError>;

    fn get_tapos_data(&self, block_id: &str) -> Result<RefBlockData, WaxError>;
}
