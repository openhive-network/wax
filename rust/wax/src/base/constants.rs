//! Shared constants for the offline wax API: the well-known chain ids, the
//! Hive date-time format and percent precision.

/// Used as the chain id of the Hive mainnet.
pub const MAINNET_CHAIN_ID: &str =
    "beeab0de00000000000000000000000000000000000000000000000000000000";
/// Used as the chain id when [`crate::WaxOptions`] does not specify one.
pub const DEFAULT_CHAIN_ID: &str = MAINNET_CHAIN_ID;

/// Used to format and parse Hive timestamps (`strftime` syntax).
pub const HIVE_TIME_FORMAT: &str = "%Y-%m-%dT%H:%M:%S";

/// Used to round percent values to the precision Hive expects.
pub const HIVE_PERCENT_PRECISION_DOT_PLACES: u32 = 2;

/// Used as the default `comment_options.percent_hbd` (100% in basis points)
/// when a comment does not override the HBD payout split.
pub const DEFAULT_COMMENT_PERCENT_HBD: u32 = 10_000;

/// Used as the default `comment_options.max_accepted_payout` amount, in HBD
/// satoshis — effectively uncapped — when a comment does not set its own.
pub const DEFAULT_COMMENT_MAX_ACCEPTED_PAYOUT_SATOSHIS: i64 = 1_000_000_000;
