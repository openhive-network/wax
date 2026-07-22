//! Endpoint health checking: latency probing and failover across multiple Hive
//! API nodes.

mod checker;
mod endpoint;
mod error;
mod events;
mod math;
mod options;
mod probe;
mod scored_endpoint;

pub use checker::{HealthChecker, HealthCheckerGuard};
pub use endpoint::{ErrorReason, HiveEndpoint, HiveEndpointData, ProbeState};
pub use error::{
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
