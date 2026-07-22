//! Basic type aliases and small value types used throughout the API.

use crate::base::models::hive_date_time::HiveDateTime;

/// Represents a Hive account name.
pub type AccountName = String;
/// Represents a hex-encoded byte string.
pub type Hex = String;
/// Represents a chain id (a hex-encoded 32-byte value).
pub type ChainId = Hex;
/// Represents a transaction id (a hex-encoded digest).
pub type TransactionId = Hex;
/// Represents a signature digest (hex-encoded).
pub type SigDigest = Hex;
/// Represents a signature (hex-encoded).
pub type Signature = Hex;
/// Represents a head-block id (hex-encoded).
pub type HeadBlockId = Hex;
/// Represents a public key in its textual form.
pub type PublicKey = String;

/// Represents the reference data needed to set a transaction's TaPoS: the
/// head-block time and id.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ChainReferenceData {
    pub time: HiveDateTime,
    pub head_block_id: HeadBlockId,
}
