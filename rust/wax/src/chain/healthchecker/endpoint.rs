//! A single health-checked endpoint group and its probe state.
//!
//! TS NOTE: ported from `ts/wasm/lib/detailed/healthchecker/endpoint.ts`. TS
//! splits the public surface into the `IHiveEndpoint` interface and hides the
//! probe internals in the `HiveEndpoint` class; since there is only ever one
//! implementation, Rust collapses both into a single [`HiveEndpoint`] struct
//! whose `pub` methods are the former interface and whose private fields and
//! methods are the former class internals.

use std::collections::{HashMap, HashSet};

use crate::chain::util::DetailedResponseData;

use super::Dummy;
use super::errors::ChainApiType;

/// Represents a single health-checked endpoint group: a set of node URLs sharing
/// the same API call paths, together with their probe results.
///
/// TS NOTE: the `IHiveEndpoint` interface and `HiveEndpoint` class merged.
#[allow(dead_code)]
pub struct HiveEndpoint {
    /// TS NOTE: `HealthChecker` (from `healthchecker.ts`) is not yet ported, so
    /// it is stubbed with [`Dummy`], like the request_helper types.
    checker: Dummy,
    id: u32,
    api_caller_id: ChainApiType,
    paths: Vec<String>,
    endpoint_urls: HashSet<String>,
    /// TS NOTE: `(apiUrl: string) => Promise<IDetailedResponseData<any>>`. The
    /// request_helper response type is not yet ported, so its result is
    /// [`Dummy`].
    caller: Box<dyn Fn(String) -> DetailedResponseData>,
    up: HashMap<String, HiveEndpointDataUp>,
    down: HashMap<String, HiveEndpointDataDown>,
}

#[allow(dead_code)]
impl HiveEndpoint {
    /// Creates an endpoint group bound to a health checker and a request caller.
    pub(crate) fn new(
        checker: Dummy,
        id: u32,
        api_caller_id: ChainApiType,
        paths: Vec<String>,
        endpoint_urls: HashSet<String>,
        caller: Box<dyn Fn(String) -> DetailedResponseData>,
    ) -> Self {
        Self {
            checker,
            id,
            api_caller_id,
            paths,
            endpoint_urls,
            caller,
            up: HashMap::new(),
            down: HashMap::new(),
        }
    }

    /// Returns the API call paths, e.g. `["block_api", "get_block_header"]` or
    /// `["hafbe-api", "operation-type-counts"]`.
    pub fn paths(&self) -> &[String] {
        &self.paths
    }

    /// Returns the API caller this endpoint group belongs to, e.g. `json_rpc`
    /// or `rest`.
    pub fn api_caller_id(&self) -> ChainApiType {
        self.api_caller_id
    }

    /// Returns the node URLs that will be checked.
    pub fn endpoint_urls(&self) -> &HashSet<String> {
        &self.endpoint_urls
    }

    /// Returns the unique identifier of this endpoint group. Can be used upon
    /// validation-error parsing to properly identify the endpoint.
    pub fn id(&self) -> u32 {
        self.id
    }

    /// Adds a new node URL to the set of URLs to check.
    pub fn add_endpoint_url(&mut self, endpoint_url: String) {
        self.endpoint_urls.insert(endpoint_url);
    }

    /// Removes a node URL from the set of URLs to check. Returns `true` if the
    /// URL was present, `false` otherwise.
    pub fn remove_endpoint_url(&mut self, endpoint_url: &str) -> bool {
        let deleted = self.endpoint_urls.remove(endpoint_url);

        // TS NOTE: TS also emits a `clearunused` event through the HealthChecker
        // (not yet ported) to drop the stats of the removed URL.

        deleted
    }

    /// Lists the endpoint URL statuses: the ones that are up first, ordered by
    /// ascending latency, followed by the ones that are down.
    pub fn list(&self) -> Vec<HiveEndpointData> {
        let mut up: Vec<&HiveEndpointDataUp> = self.up.values().collect();
        up.sort_by_key(|data| data.latency);

        let mut result: Vec<HiveEndpointData> =
            up.into_iter().cloned().map(HiveEndpointData::Up).collect();

        result.extend(self.down.values().cloned().map(HiveEndpointData::Down));

        result
    }

    /// Probes every node URL concurrently, recording the latency for the ones
    /// that answer and the failure reason for the ones that do not, emitting the
    /// corresponding health-checker events. Failures are classified into an
    /// [`ErrorReason`] depending on the [`super::RequestError`] they raise.
    pub(crate) async fn perform_check(&self) {
        todo!()
    }

    /// Probes a single node URL, recording its latency or failure reason in the
    /// up/down maps and emitting the matching state-transition events. On
    /// failure, re-raises the cause wrapped in [`super::HealthCheckerError`].
    async fn verify_upon_url(&self, endpoint_url: &str) {
        let _ = endpoint_url;

        todo!()
    }
}

/// Represents a node URL transitioning between the up and down states.
///
/// TS NOTE: `INewUpDownEvent`.
#[derive(Debug, Clone)]
pub struct NewUpDownEvent {
    pub data: HiveEndpointData,
    pub paths: Vec<String>,
    pub api_caller_id: ChainApiType,
    pub endpoint_url: String,
    pub up: bool,
}

/// Represents the selection of a new best (lowest-latency) endpoint.
///
/// TS NOTE: `INewBestEvent`.
#[derive(Debug, Clone)]
pub struct NewBestEvent {
    pub best: String,
    pub api_type: String,
    pub api_endpoint: String,
}

/// Represents the latest probe result for a single node URL.
///
/// TS NOTE: `THiveEndpointData` (`IHiveEndpointDataUp | IHiveEndpointDataDown`).
/// The shared `endpointUrl` field and the `up` discriminant collapse into the
/// enum variants.
#[derive(Debug, Clone)]
pub enum HiveEndpointData {
    Up(HiveEndpointDataUp),
    Down(HiveEndpointDataDown),
}

/// Represents a node URL that responded, along with its measured latency.
///
/// TS NOTE: `IHiveEndpointDataUp` (with the inlined `IHiveEndpointDataBase`).
#[derive(Debug, Clone)]
pub struct HiveEndpointDataUp {
    pub endpoint_url: String,
    /// Round-trip latency in milliseconds.
    pub latency: u64,
}

/// Represents a node URL that failed to respond, along with the failure reason.
///
/// TS NOTE: `IHiveEndpointDataDown` (with the inlined `IHiveEndpointDataBase`).
#[derive(Debug, Clone)]
pub struct HiveEndpointDataDown {
    pub endpoint_url: String,
    pub reason: ErrorReason,
}

/// Represents why a node URL was marked as down.
///
/// TS NOTE: `TErrorReason`.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ErrorReason {
    Timeout,
    ServerError,
    ValidationError,
    UserAbort,
    Other,
}
