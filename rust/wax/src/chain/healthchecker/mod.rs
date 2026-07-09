//! Endpoint health checking: latency probing and failover across multiple Hive
//! API nodes.
//!
//! TS NOTE: ported from `ts/wasm/lib/detailed/healthchecker/`. The error
//! surface, the endpoint probe internals and the scoring math are present;
//! the `HealthChecker` registration and scheduling loop is not ported yet.

mod endpoint;
mod errors;
mod math;
mod scored_endpoint;

pub use endpoint::{
    ErrorReason, HiveEndpoint, HiveEndpointData, NewUpDownEvent, ProbeState,
};
pub use errors::{
    ChainApiType, EndpointInfo, HealthCheckerError, RequestError,
};
pub use math::default_calc_scores;
pub use scored_endpoint::{ScoredEndpoint, ScoredState};
