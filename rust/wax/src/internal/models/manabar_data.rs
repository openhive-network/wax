use rust_decimal::{Decimal, RoundingStrategy};

use crate::constants::HIVE_PERCENT_PRECISION_DOT_PLACES;
use crate::interfaces::Manabar;

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
