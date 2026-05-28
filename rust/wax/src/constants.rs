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
