//! Endpoint health checking: latency probing and failover across multiple Hive
//! API nodes.
//!
//! TS NOTE: ported from `ts/wasm/lib/detailed/healthchecker/`. Register API
//! probes with [`HealthChecker::register`], spawn the checker with
//! [`HealthChecker::spawn`] (or hand [`HealthChecker::run`] to your runtime
//! yourself), and watch the scoreboard through [`HealthChecker::events`] /
//! [`HealthChecker::best`].

mod checker;
mod endpoint;
mod errors;
mod events;
mod math;
mod options;
mod probe;
mod scored_endpoint;

pub use checker::{HealthChecker, HealthCheckerGuard};
pub use endpoint::{ErrorReason, HiveEndpoint, HiveEndpointData, ProbeState};
pub use errors::{
    ChainApiType, EndpointInfo, HealthCheckerError, RequestError,
    ValidatorFailedError,
};
pub use events::HealthCheckerEvent;
pub use math::default_calc_scores;
pub use options::{
    CalcScoresFn, DEFAULT_JSON_RPC_ENDPOINTS, DEFAULT_REST_API_ENDPOINTS,
    HealthCheckerOptions,
};
pub use probe::ApiProbe;
pub use scored_endpoint::{ScoredEndpoint, ScoredState};
