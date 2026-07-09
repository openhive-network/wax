//! Endpoint health checking: latency probing and failover across multiple Hive
//! API nodes.
//!
//! TS NOTE: ported from `ts/wasm/lib/detailed/healthchecker/`. The error
//! surface, the endpoint data types and the scoring math are present; the
//! `HealthChecker` probe loop is not ported yet.

mod endpoint;
mod errors;
mod math;
mod scored_endpoint;

/// Used as a placeholder for types that are not yet ported to Rust.
///
/// TS NOTE: stands in for the not-yet-ported `IRequestOptions` /
/// `IDetailedResponseData` (from `util/request_helper.ts`) and `HealthChecker`
/// (from `healthchecker.ts`).
pub(crate) type Dummy = ();

pub use endpoint::{
    ErrorReason, HiveEndpoint, HiveEndpointData, HiveEndpointDataDown,
    HiveEndpointDataUp, NewBestEvent, NewUpDownEvent,
};
pub use errors::{
    ChainApiType, EndpointInfo, HealthCheckerError, RequestError,
};
pub use math::default_calc_scores;
pub use scored_endpoint::{
    ScoredEndpoint, ScoredEndpointDown, ScoredEndpointUp,
};
