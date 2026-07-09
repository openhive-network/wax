//! A single health-checked endpoint group and its probe state.
//!
//! TS NOTE: ported from `ts/wasm/lib/detailed/healthchecker/endpoint.ts`. TS
//! splits the public surface into the `IHiveEndpoint` interface and hides the
//! probe internals in the `HiveEndpoint` class; since there is only ever one
//! implementation, Rust collapses both into a single [`HiveEndpoint`] struct
//! whose `pub` methods are the former interface and whose private fields and
//! methods are the former class internals.

use std::collections::{HashMap, HashSet};
use std::future::Future;
use std::pin::Pin;

use futures_util::future::join_all;

use crate::chain::error::WaxChainError;
use crate::chain::util::DetailedResponseData;

use super::errors::{
    ChainApiType, EndpointInfo, HealthCheckerError, ProbeFailure, RequestError,
};

/// Represents a single health-checked endpoint group: a set of node URLs sharing
/// the same API call paths, together with their probe results.
///
/// TS NOTE: the `IHiveEndpoint` interface and `HiveEndpoint` class merged.
/// TS also holds a `checker` back-reference purely to emit events while
/// probing; [`Self::perform_check`] returns them as a [`CheckOutcome`]
/// instead, so no back-reference exists.
#[allow(dead_code)]
pub struct HiveEndpoint {
    id: u32,
    api_caller_id: ChainApiType,
    paths: Vec<String>,
    endpoint_urls: HashSet<String>,
    caller: ProbeFn,
    /// Latest latency (in milliseconds) per node URL currently up.
    up: HashMap<String, u64>,
    /// Latest failure reason per node URL currently down.
    down: HashMap<String, ErrorReason>,
}

/// Represents a registered probe: calls one API method against the given
/// node URL, returning the raw response data (with its timings) on success.
///
/// TS NOTE: the `(apiUrl: string) => Promise<IDetailedResponseData<any>>`
/// closure TS `register` builds around `withProxy`; the Rust checker will
/// build it around `call_at`, erasing the user validator into it.
pub(crate) type ProbeFn = Box<dyn Fn(String) -> ProbeFuture + Send + Sync>;

/// Represents the boxed future a probe call resolves to.
pub(crate) type ProbeFuture = Pin<
    Box<dyn Future<Output = Result<DetailedResponseData, ProbeFailure>> + Send>,
>;

#[allow(dead_code)]
impl HiveEndpoint {
    /// Creates an endpoint group probing `endpoint_urls` through `caller`.
    pub(crate) fn new(
        id: u32,
        api_caller_id: ChainApiType,
        paths: Vec<String>,
        endpoint_urls: HashSet<String>,
        caller: ProbeFn,
    ) -> Self {
        Self {
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
        let mut up: Vec<(&String, u64)> = self
            .up
            .iter()
            .map(|(url, latency)| (url, *latency))
            .collect();
        up.sort_by_key(|(_, latency)| *latency);

        let mut result: Vec<HiveEndpointData> = up
            .into_iter()
            .map(|(url, latency)| HiveEndpointData {
                url: url.clone(),
                state: ProbeState::Up { latency },
            })
            .collect();

        result.extend(self.down.iter().map(|(url, reason)| HiveEndpointData {
            url: url.clone(),
            state: ProbeState::Down { reason: *reason },
        }));

        result
    }

    /// Probes every node URL concurrently, recording the latency for the ones
    /// that answer and the failure reason for the ones that do not. Returns
    /// the recorded stats, the up/down transitions and the wrapped failures
    /// for the checker to emit.
    ///
    /// TS NOTE: `performCheck`; TS emits 'stats' / 'statechanged' / 'error'
    /// through the checker as each probe settles, Rust applies the same
    /// transitions once all probes settled and returns them instead.
    pub(crate) async fn perform_check(&mut self) -> CheckOutcome {
        let urls: Vec<String> = self.endpoint_urls.iter().cloned().collect();

        let this: &Self = self;
        let results =
            join_all(urls.iter().map(|url| this.verify_upon_url(url.clone())))
                .await;

        let mut outcome = CheckOutcome::default();
        for (url, result) in urls.into_iter().zip(results) {
            match result {
                Ok(latency) => self.record_up(url, latency, &mut outcome),
                Err(failure) => self.record_down(url, failure, &mut outcome),
            }
        }

        outcome
    }

    /// Probes a single node URL, measuring the round-trip latency in
    /// milliseconds.
    ///
    /// TS NOTE: the probe half of `verifyUponUrl`; the bookkeeping half lives
    /// in [`Self::record_up`] / [`Self::record_down`], applied after the
    /// concurrent probes settle.
    async fn verify_upon_url(
        &self,
        endpoint_url: String,
    ) -> Result<u64, ProbeFailure> {
        let stats = (self.caller)(endpoint_url).await?;
        let end = stats.end.expect("set on success");

        Ok(end.duration_since(stats.start).as_millis() as u64)
    }

    /// Records a responding URL: collects the stats entry (plus the
    /// transition if it just left the down bucket) and stores its latency.
    fn record_up(
        &mut self,
        url: String,
        latency: u64,
        outcome: &mut CheckOutcome,
    ) {
        let data = HiveEndpointData {
            url: url.clone(),
            state: ProbeState::Up { latency },
        };

        if self.down.remove(&url).is_some() {
            outcome.state_changes.push(self.state_change(data.clone()));
        }

        outcome.stats.push(data);
        self.up.insert(url, latency);
    }

    /// Records a failing URL: collects the stats entry (plus the transition
    /// if it just left the up bucket), the wrapped failure, and stores its
    /// down reason.
    fn record_down(
        &mut self,
        url: String,
        failure: ProbeFailure,
        outcome: &mut CheckOutcome,
    ) {
        let reason = classify_reason(&failure);
        let data = HiveEndpointData {
            url: url.clone(),
            state: ProbeState::Down { reason },
        };

        if self.up.remove(&url).is_some() {
            outcome.state_changes.push(self.state_change(data.clone()));
        }

        outcome.stats.push(data);
        outcome.errors.push(HealthCheckerError::Check {
            source: Box::new(failure),
            endpoint: self.info(),
            api_url: Some(url.clone()),
        });
        self.down.insert(url, reason);
    }

    /// Builds the transition event for this endpoint group.
    fn state_change(&self, data: HiveEndpointData) -> NewUpDownEvent {
        NewUpDownEvent {
            data,
            paths: self.paths.clone(),
            api_caller_id: self.api_caller_id,
        }
    }

    /// Returns the owned identity snapshot attached to error payloads.
    fn info(&self) -> EndpointInfo {
        EndpointInfo {
            id: self.id,
            api_caller_id: self.api_caller_id,
            paths: self.paths.clone(),
            endpoint_urls: self.endpoint_urls.clone(),
        }
    }
}

/// Converts a probe failure into the reason its URL is marked down with.
///
/// TS NOTE: the `instanceof` cascade of the `verifyUponUrl` catch block
/// (`endpoint.ts` lines 146-155).
fn classify_reason(failure: &ProbeFailure) -> ErrorReason {
    match failure {
        ProbeFailure::Validation(_) => ErrorReason::ValidationError,
        ProbeFailure::Chain(WaxChainError::Request(request_error)) => {
            match request_error {
                RequestError::Timeout { .. } => ErrorReason::Timeout,
                RequestError::NonSuccessResponseCode { .. } => {
                    ErrorReason::ServerError
                }
                RequestError::AbortedByUser { .. } => ErrorReason::UserAbort,
                _ => ErrorReason::Other,
            }
        }
        ProbeFailure::Chain(_) => ErrorReason::Other,
    }
}

/// Represents everything one [`HiveEndpoint::perform_check`] round produced:
/// the per-URL probe results, the up/down transitions and the failures.
///
/// TS NOTE: TS pushes these through the `HealthChecker` event emitter
/// ('stats', 'statechanged' and 'error') as each probe settles; the Rust
/// endpoint returns them and the checker will do the emitting.
#[derive(Debug, Default)]
pub(crate) struct CheckOutcome {
    pub stats: Vec<HiveEndpointData>,
    pub state_changes: Vec<NewUpDownEvent>,
    pub errors: Vec<HealthCheckerError>,
}

/// Represents a node URL transitioning between the up and down states.
///
/// TS NOTE: `INewUpDownEvent`; its `endpointUrl` and `up` fields are
/// derivable from `data` (`data.url` and the [`ProbeState`] variant), so
/// they are not ported. The dead-code TS `INewBestEvent` is not ported
/// either — the TS 'newbest' event actually emits a `TScoredEndpoint`
/// ([`super::ScoredEndpoint`]).
#[derive(Debug, Clone)]
pub struct NewUpDownEvent {
    pub data: HiveEndpointData,
    pub paths: Vec<String>,
    pub api_caller_id: ChainApiType,
}

/// Represents the latest probe result for a single node URL.
///
/// TS NOTE: `THiveEndpointData` (`IHiveEndpointDataUp | IHiveEndpointDataDown`).
/// The `IHiveEndpointDataBase.endpointUrl` field both TS shapes carry is
/// hoisted here; the `up` discriminant collapses into [`ProbeState`].
#[derive(Debug, Clone)]
pub struct HiveEndpointData {
    pub url: String,
    pub state: ProbeState,
}

/// Represents the up/down half of a probe result.
///
/// TS NOTE: the varying fields of `IHiveEndpointDataUp` /
/// `IHiveEndpointDataDown`.
#[derive(Debug, Clone)]
pub enum ProbeState {
    Up {
        /// Round-trip latency in milliseconds.
        latency: u64,
    },
    Down {
        reason: ErrorReason,
    },
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

#[cfg(test)]
mod tests {
    use std::sync::Arc;
    use std::sync::atomic::{AtomicBool, Ordering};
    use std::task::{Context, Poll, Waker};
    use std::time::{Duration, Instant};

    use crate::chain::util::RequestOptions;

    use super::*;

    /// Polls the future to completion. The fake probes below resolve
    /// immediately, so no async runtime is needed.
    fn block_on<F: Future>(future: F) -> F::Output {
        let mut future = std::pin::pin!(future);
        let mut context = Context::from_waker(Waker::noop());

        loop {
            if let Poll::Ready(value) = future.as_mut().poll(&mut context) {
                return value;
            }
        }
    }

    fn endpoint(urls: &[&str], caller: ProbeFn) -> HiveEndpoint {
        HiveEndpoint::new(
            7,
            ChainApiType::Rest,
            vec!["hafah_api".into(), "headblock".into()],
            urls.iter().map(ToString::to_string).collect(),
            caller,
        )
    }

    fn response_with_latency(ms: u64) -> DetailedResponseData {
        let start = Instant::now();

        DetailedResponseData {
            start,
            end: Some(start + Duration::from_millis(ms)),
            status: Some(200),
            headers: None,
            response: None,
        }
    }

    fn request_failure(
        build: fn(RequestOptions, DetailedResponseData) -> RequestError,
    ) -> ProbeFailure {
        let request = RequestOptions {
            endpoint: "http://node".into(),
            url: String::new(),
            method: "POST".into(),
            timeout: 0,
            data: None,
            response_type: None,
            wax_api_caller: None,
        };
        let response = DetailedResponseData {
            start: Instant::now(),
            end: None,
            status: None,
            headers: None,
            response: None,
        };

        ProbeFailure::Chain(WaxChainError::Request(build(request, response)))
    }

    #[test]
    fn records_latency_and_marks_url_up() {
        let mut endpoint = endpoint(
            &["https://a"],
            Box::new(|_| Box::pin(async { Ok(response_with_latency(120)) })),
        );

        let outcome = block_on(endpoint.perform_check());

        // First sighting: no transition, no failure, one up stat.
        assert!(outcome.state_changes.is_empty());
        assert!(outcome.errors.is_empty());
        assert!(matches!(
            &outcome.stats[..],
            [HiveEndpointData {
                url,
                state: ProbeState::Up { latency: 120 },
            }] if url == "https://a"
        ));
        assert!(matches!(
            &endpoint.list()[..],
            [HiveEndpointData {
                state: ProbeState::Up { latency: 120 },
                ..
            }]
        ));
    }

    #[test]
    fn reports_failure_with_wrapped_error() {
        let mut endpoint = endpoint(
            &["https://a"],
            Box::new(|_| {
                Box::pin(async {
                    Err(ProbeFailure::Validation("head block too old".into()))
                })
            }),
        );

        let outcome = block_on(endpoint.perform_check());

        // First sighting again: going down without ever being up is not a
        // transition (mirrors the TS `this.up.has` guard).
        assert!(outcome.state_changes.is_empty());
        assert!(matches!(
            &outcome.stats[..],
            [HiveEndpointData {
                state: ProbeState::Down {
                    reason: ErrorReason::ValidationError,
                },
                ..
            }]
        ));
        assert!(matches!(
            &outcome.errors[..],
            [HealthCheckerError::Check { endpoint, api_url, .. }]
                if endpoint.id == 7
                    && api_url.as_deref() == Some("https://a")
        ));
    }

    #[test]
    fn emits_state_changes_on_up_down_transitions() {
        let healthy = Arc::new(AtomicBool::new(true));
        let flag = healthy.clone();
        let mut endpoint = endpoint(
            &["https://a"],
            Box::new(move |_| {
                let healthy = flag.load(Ordering::Relaxed);

                Box::pin(async move {
                    if healthy {
                        Ok(response_with_latency(50))
                    } else {
                        Err(request_failure(|request, response| {
                            RequestError::Timeout { request, response }
                        }))
                    }
                })
            }),
        );

        block_on(endpoint.perform_check());

        healthy.store(false, Ordering::Relaxed);
        let outcome = block_on(endpoint.perform_check());

        assert!(matches!(
            &outcome.state_changes[..],
            [NewUpDownEvent {
                data: HiveEndpointData {
                    url,
                    state: ProbeState::Down { .. },
                },
                paths,
                api_caller_id,
            }] if url == "https://a"
                && paths == &["hafah_api", "headblock"]
                && *api_caller_id == ChainApiType::Rest
        ));
        assert_eq!(outcome.errors.len(), 1);

        healthy.store(true, Ordering::Relaxed);
        let outcome = block_on(endpoint.perform_check());

        assert!(matches!(
            &outcome.state_changes[..],
            [NewUpDownEvent {
                data: HiveEndpointData {
                    state: ProbeState::Up { .. },
                    ..
                },
                ..
            }]
        ));
        assert!(outcome.errors.is_empty());
        // The recovered URL must have left the down bucket.
        assert!(matches!(
            &endpoint.list()[..],
            [HiveEndpointData {
                state: ProbeState::Up { latency: 50 },
                ..
            }]
        ));
    }

    // TS NOTE: the `instanceof` cascade of `verifyUponUrl` — each failure
    // kind must map onto its `TErrorReason`.
    #[test]
    fn classifies_failure_reasons() {
        let cases: Vec<(ProbeFailure, ErrorReason)> = vec![
            (
                request_failure(|request, response| RequestError::Timeout {
                    request,
                    response,
                }),
                ErrorReason::Timeout,
            ),
            (
                request_failure(|request, response| {
                    RequestError::NonSuccessResponseCode { request, response }
                }),
                ErrorReason::ServerError,
            ),
            (
                request_failure(|request, response| {
                    RequestError::AbortedByUser { request, response }
                }),
                ErrorReason::UserAbort,
            ),
            (
                request_failure(|request, response| RequestError::Unknown {
                    request,
                    response,
                    source: None,
                }),
                ErrorReason::Other,
            ),
            (
                ProbeFailure::Chain(WaxChainError::JsonRpc {
                    code: -32601,
                    message: "no such method".into(),
                }),
                ErrorReason::Other,
            ),
            (
                ProbeFailure::Validation("mismatch".into()),
                ErrorReason::ValidationError,
            ),
        ];

        for (failure, expected) in cases {
            assert_eq!(classify_reason(&failure), expected, "{failure:?}");
        }
    }

    #[test]
    fn probes_every_url_of_the_group() {
        let mut endpoint = endpoint(
            &["https://a", "https://b", "https://c"],
            Box::new(|url| {
                Box::pin(async move {
                    if url == "https://b" {
                        Err(ProbeFailure::Validation("bad".into()))
                    } else {
                        Ok(response_with_latency(10))
                    }
                })
            }),
        );

        let outcome = block_on(endpoint.perform_check());

        assert_eq!(outcome.stats.len(), 3);
        assert_eq!(outcome.errors.len(), 1);
        // Two up (sorted by latency) followed by the one down.
        assert!(matches!(
            &endpoint.list()[..],
            [
                HiveEndpointData { state: ProbeState::Up { .. }, .. },
                HiveEndpointData { state: ProbeState::Up { .. }, .. },
                HiveEndpointData { url, state: ProbeState::Down { .. } },
            ] if url == "https://b"
        ));
    }
}
