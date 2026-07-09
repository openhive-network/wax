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
/// The TS `up` discriminant collapses into the enum variants.
#[derive(Debug, Clone)]
pub enum ScoredEndpoint {
    Up(ScoredEndpointUp),
    Down(ScoredEndpointDown),
}

impl ScoredEndpoint {
    /// Returns the node URL this score refers to.
    pub fn endpoint_url(&self) -> &str {
        match self {
            Self::Up(data) => &data.endpoint_url,
            Self::Down(data) => &data.endpoint_url,
        }
    }
}

/// Represents a responding node URL together with its normalized quality
/// score.
///
/// TS NOTE: `IScoredEndpointUp`.
#[derive(Debug, Clone)]
pub struct ScoredEndpointUp {
    pub endpoint_url: String,
    /// Normalized quality in `0.1..=1.0`; the best up URL scores `1.0`.
    pub score: f64,
    /// Raw latencies of the up probes in milliseconds, newest last.
    pub latencies: Vec<u64>,
}

/// Represents a node URL considered down, together with its most recent
/// failure reason.
///
/// TS NOTE: `IScoredEndpointDown`; its constant `score: 0` field is implied
/// by the variant.
#[derive(Debug, Clone)]
pub struct ScoredEndpointDown {
    pub endpoint_url: String,
    pub last_error_reason: ErrorReason,
}
