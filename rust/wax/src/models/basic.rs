pub use crate::internal::models::hive_date_time::HiveDateTime;

pub type AccountName = String;
pub type Hex = String;
pub type ChainId = Hex;
pub type TransactionId = Hex;
pub type SigDigest = Hex;
pub type Signature = Hex;
pub type HeadBlockId = Hex;
pub type PublicKey = String;

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ChainReferenceData {
    pub time: HiveDateTime,
    pub head_block_id: HeadBlockId,
}
