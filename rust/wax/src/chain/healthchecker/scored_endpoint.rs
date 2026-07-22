//! Scored endpoint states: the entries of the scoreboard produced by
//! [`super::default_calc_scores`].

use super::endpoint::ErrorReason;

/// Represents the scored state of a node URL within the scoreboard.
#[derive(Debug, Clone)]
pub struct ScoredEndpoint {
    pub url: String,
    pub state: ScoredState,
}

/// Represents the up/down half of a scored entry.
#[derive(Debug, Clone)]
pub enum ScoredState {
    Up {
        /// Normalized quality in `0.1..=1.0`; the best up URL scores `1.0`.
        score: f64,
        /// Raw latencies of the up probes in milliseconds, newest last.
        latencies: Vec<u64>,
    },
    Down {
        last_error_reason: ErrorReason,
    },
}
