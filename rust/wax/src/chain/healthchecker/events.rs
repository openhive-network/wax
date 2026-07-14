//! Events broadcast by the health checker.
//!
//! TS NOTE: the `IHealthCheckerEvents` event map declared in
//! `ts/wasm/lib/detailed/healthchecker/healthchecker.ts`, one
//! [`HealthCheckerEvent`] variant per event name. The TS `EventEmitter`
//! listener surface (`on`/`once`/`off`) becomes the broadcast channel
//! behind [`super::HealthChecker::events`].

use std::sync::Arc;

use super::errors::{HealthCheckerError, ValidatorFailedError};
use super::scored_endpoint::ScoredEndpoint;

/// Used to bound the backlog of the [`super::HealthChecker::events`]
/// channel; a receiver more than this many events behind skips the oldest
/// ones.
pub(super) const EVENT_CHANNEL_CAPACITY: usize = 128;

/// Represents a notification broadcast by the [`super::HealthChecker`].
#[derive(Debug, Clone)]
pub enum HealthCheckerEvent {
    /// A check round scored a different node URL best.
    ///
    /// TS NOTE: 'newbest'.
    NewBest(ScoredEndpoint),

    /// A [subscribed](super::HealthChecker::subscribe) node URL came back
    /// up.
    ///
    /// TS NOTE: 'newup' — TS types the payload as `TScoredEndpoint` but only
    /// ever sends `{ endpointUrl }`, so Rust carries the URL alone.
    NewUp { url: String },

    /// A [subscribed](super::HealthChecker::subscribe) node URL went down.
    ///
    /// TS NOTE: 'newdown' — payload trimmed like [`Self::NewUp`].
    NewDown { url: String },

    /// A check round finished; carries the fresh scoreboard, best first.
    ///
    /// TS NOTE: 'data'.
    Data(Vec<ScoredEndpoint>),

    /// A probe failed; its URL is marked down.
    ///
    /// TS NOTE: 'error'.
    Error(Arc<HealthCheckerError>),

    /// A user validator rejected a probe response; its URL is marked down
    /// (a wrapping [`Self::Error`] follows).
    ///
    /// TS NOTE: 'validationerror'.
    ValidationError(Arc<ValidatorFailedError>),
}
