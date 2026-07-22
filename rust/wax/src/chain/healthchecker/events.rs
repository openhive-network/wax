//! Events broadcast by the health checker.

use std::sync::Arc;

use super::error::{HealthCheckerError, ValidatorFailedError};
use super::scored_endpoint::ScoredEndpoint;

/// Used to bound the backlog of the [`super::HealthChecker::events`]
/// channel; a receiver more than this many events behind skips the oldest
/// ones.
pub(super) const EVENT_CHANNEL_CAPACITY: usize = 128;

/// Represents a notification broadcast by the [`super::HealthChecker`].
#[derive(Debug, Clone)]
pub enum HealthCheckerEvent {
    /// A check round scored a different node URL best.
    NewBest(ScoredEndpoint),

    /// A [subscribed](super::HealthChecker::subscribe) node URL came back
    /// up.
    NewUp { url: String },

    /// A [subscribed](super::HealthChecker::subscribe) node URL went down.
    NewDown { url: String },

    /// A check round finished; carries the fresh scoreboard, best first.
    Data(Vec<ScoredEndpoint>),

    /// A probe failed; its URL is marked down.
    Error(Arc<HealthCheckerError>),

    /// A user validator rejected a probe response; its URL is marked down
    /// (a wrapping [`Self::Error`] follows).
    ValidationError(Arc<ValidatorFailedError>),
}
