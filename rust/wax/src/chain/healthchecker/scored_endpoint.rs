//! Scored endpoint states: the entries of the scoreboard produced by
//! [`super::default_calc_scores`].
//!
//! TS NOTE: the `TScoredEndpoint` types, declared in
//! `ts/wasm/lib/detailed/healthchecker/healthchecker.ts` next to the
//! `HealthChecker` class.

use super::endpoint::ErrorReason;

/// Represents the scored state of a node URL within the scoreboard.
///
/// TS NOTE: `TScoredEndpoint` (`IScoredEndpointUp | IScoredEndpointDown`).
/// The `endpointUrl` field both TS shapes carry is hoisted here; the `up`
/// discriminant collapses into [`ScoredState`].
#[derive(Debug, Clone)]
pub struct ScoredEndpoint {
    pub url: String,
    pub state: ScoredState,
}

/// Represents the up/down half of a scored entry.
///
/// TS NOTE: the varying fields of `IScoredEndpointUp` /
/// `IScoredEndpointDown`; the constant down `score: 0` is implied by the
/// variant.
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
