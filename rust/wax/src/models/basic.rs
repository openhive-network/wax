//! Type aliases for primitive blockchain values, mirroring `wax.models.basic`
//! in the Python port.
//!
//! These aliases are documentation-only — they all expand to `String`. They do
//! NOT provide compile-time type safety (you can pass a `Signature` where a
//! `PublicKey` is expected). If/when stricter typing is warranted, individual
//! aliases can be upgraded to newtypes.

/// Account name on the Hive blockchain.
pub type AccountName = String;

/// Hexadecimal string.
pub type Hex = String;

/// Chain identifier (hex).
pub type ChainId = Hex;

/// Transaction identifier (hex, 20 bytes / 40 chars).
pub type TransactionId = Hex;

/// Signature digest of a transaction (hex, 32 bytes / 64 chars).
pub type SigDigest = Hex;

/// Compact ECDSA signature (hex, 65 bytes / 130 chars).
pub type Signature = Hex;

/// Head block id (hex).
pub type HeadBlockId = Hex;

/// Public key in base58 WIF form, e.g. `STM…`.
pub type PublicKey = String;

/// Default mainnet chain id. Use with `ChainId` when callers want the canonical
/// Hive network rather than a custom chain (e.g. testnet).
pub const MAINNET_CHAIN_ID: &str =
    "beeab0de00000000000000000000000000000000000000000000000000000000";
