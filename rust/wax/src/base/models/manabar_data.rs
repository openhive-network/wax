//! Manabar models: the mana-pool read trait, an account's mana state and the
//! pool selector used by the online accessors.

use rust_decimal::{Decimal, RoundingStrategy};

use crate::base::constants::HIVE_PERCENT_PRECISION_DOT_PLACES;

/// Provides read access to an account's mana pool and its computed percentage.
pub trait Manabar {
    /// Returns the maximum mana of the pool.
    fn max_mana(&self) -> i64;
    /// Returns the current mana of the pool.
    fn current_mana(&self) -> i64;
    /// Returns the current mana as a percentage of the maximum.
    fn percent(&self) -> Decimal;
}

/// Represents an account's mana state: its maximum and current mana.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct ManabarData {
    pub max_mana: i64,
    pub current_mana: i64,
}

impl ManabarData {
    /// Creates a manabar from its maximum and current mana values.
    pub fn new(max_mana: i64, current_mana: i64) -> Self {
        Self {
            max_mana,
            current_mana,
        }
    }
}

impl Manabar for ManabarData {
    fn max_mana(&self) -> i64 {
        self.max_mana
    }

    fn current_mana(&self) -> i64 {
        self.current_mana
    }

    fn percent(&self) -> Decimal {
        if self.max_mana <= 0 {
            return Decimal::ZERO.round_dp_with_strategy(
                HIVE_PERCENT_PRECISION_DOT_PLACES,
                RoundingStrategy::ToZero,
            );
        }

        let percent = Decimal::from(self.current_mana) * Decimal::from(100)
            / Decimal::from(self.max_mana);
        percent.round_dp_with_strategy(
            HIVE_PERCENT_PRECISION_DOT_PLACES,
            RoundingStrategy::ToZero,
        )
    }
}

/// Represents which manabar pool to inspect on an account. Consumed by the
/// per-account manabar accessors of [`crate::HiveChain`]
/// (`calculate_current_manabar_value_for_account` /
/// `calculate_manabar_full_regeneration_time_for_account`).
#[derive(Debug, Clone, Copy, Default, PartialEq, Eq, Hash)]
#[repr(u8)]
pub enum ManabarType {
    #[default]
    Upvote = 0,
    Downvote = 1,
    Rc = 2,
}
