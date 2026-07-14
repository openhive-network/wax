//! Configuration of the health checker.
//!
//! TS NOTE: the `HealthChecker` constructor parameters and the class-level
//! default endpoint lists of
//! `ts/wasm/lib/detailed/healthchecker/healthchecker.ts`.

use super::endpoint::ProbeState;
use super::math::default_calc_scores;
use super::scored_endpoint::ScoredEndpoint;

/// Used as the fallback probe URLs for JSON-RPC endpoint groups registered
/// without explicit URLs (see [`HealthCheckerOptions::default_endpoints`]).
///
/// TS NOTE: `HealthChecker.DefaultJsonRpcEndpoints`.
pub const DEFAULT_JSON_RPC_ENDPOINTS: &[&str] = &["https://api.hive.blog"];

/// Used as the fallback probe URLs for REST endpoint groups registered
/// without explicit URLs (see [`HealthCheckerOptions::default_endpoints`]).
///
/// TS NOTE: `HealthChecker.DefaultRestApiEndpoints`.
pub const DEFAULT_REST_API_ENDPOINTS: &[&str] = &["https://api.syncad.com"];

/// Used as the default minimal interval between two check rounds.
///
/// TS NOTE: `INITIAL_CHECKER_INTERVAL_MS`.
pub(super) const INITIAL_CHECK_INTERVAL_MS: u64 = 10_000;

/// Represents the configuration of a [`super::HealthChecker`].
///
/// TS NOTE: the `HealthChecker` constructor parameters.
pub struct HealthCheckerOptions {
    /// Node URLs probed by registrations that pass no explicit list; `None`
    /// falls back to [`DEFAULT_JSON_RPC_ENDPOINTS`] /
    /// [`DEFAULT_REST_API_ENDPOINTS`] by transport.
    pub default_endpoints: Option<Vec<String>>,

    /// Minimal interval between two check rounds in milliseconds; a round
    /// taking longer than half this interval pushes the next one further
    /// out (see [`super::HealthChecker::run`]).
    pub minimal_check_interval_ms: u64,

    /// Converts the accumulated probe history into the scoreboard;
    /// [`default_calc_scores`] unless overridden.
    pub calculate_scores: CalcScoresFn,
}

impl Default for HealthCheckerOptions {
    fn default() -> Self {
        Self {
            default_endpoints: None,
            minimal_check_interval_ms: INITIAL_CHECK_INTERVAL_MS,
            calculate_scores: Box::new(default_calc_scores),
        }
    }
}

/// Represents a scoring function: per-URL probe histories (newest last) in,
/// best-first scoreboard out.
///
/// TS NOTE: `TCalculateScoresFunction`.
pub type CalcScoresFn = Box<
    dyn Fn(&[(String, Vec<ProbeState>)]) -> Vec<ScoredEndpoint> + Send + Sync,
>;
