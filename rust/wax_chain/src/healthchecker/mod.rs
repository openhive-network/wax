//! Endpoint health checking: latency probing and failover across multiple Hive
//! API nodes.
//!
//! TS NOTE: ported from `ts/wasm/lib/detailed/healthchecker/`. Only the error
//! surface is present so far.

mod endpoint;
mod errors;

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
