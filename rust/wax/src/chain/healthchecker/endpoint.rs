//! A single health-checked endpoint group: the public [`HiveEndpoint`]
//! handle and its probe internals.
//!
//! TS NOTE: ported from `ts/wasm/lib/detailed/healthchecker/endpoint.ts`. TS
//! splits the public surface into the `IHiveEndpoint` interface and hides the
//! probe internals in the `HiveEndpoint` class; in Rust the internals live in
//! [`EndpointCore`] and the public surface is the [`HiveEndpoint`] handle
//! the checker hands out. TS also holds a `checker` back-reference purely to
//! emit events while probing; [`EndpointCore::perform_check`] returns them
//! as a [`CheckOutcome`] instead, so no back-reference exists.

use std::collections::{HashMap, HashSet};
use std::future::Future;
use std::pin::Pin;
use std::sync::{Arc, Mutex, MutexGuard};

use futures_util::future::join_all;

use crate::chain::error::WaxChainError;
use crate::chain::util::DetailedResponseData;

use super::checker::HealthChecker;
use super::errors::{
    ChainApiType, EndpointInfo, HealthCheckerError, ProbeFailure, RequestError,
    ValidatorFailedError,
};

/// Represents a registered endpoint group: a cheap-clone handle to inspect
/// and adjust the node URLs it checks.
///
/// TS NOTE: `IHiveEndpoint` — TS hands out the live `HiveEndpoint` class,
/// whose URL removal reaches the checker through the internal 'clearunused'
/// event; the Rust handle pairs the shared group core with its checker to do
/// the same directly.
#[derive(Clone)]
pub struct HiveEndpoint {
    checker: HealthChecker,
    core: Arc<EndpointCore>,
}

impl HiveEndpoint {
    /// Creates the handle pairing a registered group with its checker.
    pub(super) fn new(checker: HealthChecker, core: Arc<EndpointCore>) -> Self {
        Self { checker, core }
    }

    /// Returns the unique identifier of this endpoint group. Can be used
    /// upon validation-error parsing to properly identify the endpoint
    /// (see [`EndpointInfo::id`]), and unregisters it
    /// ([`HealthChecker::unregister`]).
    pub fn id(&self) -> u32 {
        self.core.id()
    }

    /// Returns the API caller this endpoint group belongs to, e.g.
    /// `json_rpc` or `rest`.
    pub fn api_caller_id(&self) -> ChainApiType {
        self.core.api_caller_id()
    }

    /// Returns the API call paths, e.g. `["block_api", "get_block_header"]`
    /// or `["hafbe-api", "operation-type-counts"]`.
    pub fn paths(&self) -> &[String] {
        self.core.paths()
    }

    /// Returns a snapshot of the node URLs that will be checked.
    pub fn endpoint_urls(&self) -> HashSet<String> {
        self.core.endpoint_urls()
    }

    /// Lists the endpoint URL statuses: the ones that are up first, ordered
    /// by ascending latency, followed by the ones that are down.
    pub fn list(&self) -> Vec<HiveEndpointData> {
        self.core.list()
    }

    /// Adds a new node URL to the set of URLs to check.
    pub fn add_endpoint_url(&self, endpoint_url: impl Into<String>) {
        self.core.add_endpoint_url(endpoint_url.into());

        // TS NOTE: TS leaves the cached-scored-list limit stale until the
        // next register/unregister; Rust keeps the invariant on every URL
        // set change.
        self.checker.recalculate_stats_limit();
    }

    /// Removes a node URL from the set of URLs to check, dropping its stats
    /// unless another endpoint group still checks it. Returns `true` if the
    /// URL was present, `false` otherwise.
    pub fn remove_endpoint_url(&self, endpoint_url: &str) -> bool {
        let removed = self.core.remove_endpoint_url(endpoint_url);

        self.checker.clear_unused_endpoint_urls_from_stats();

        removed
    }
}

/// Represents a single health-checked endpoint group: a set of node URLs
/// sharing the same API call paths, together with their probe results.
///
/// The identity fields are immutable; everything the probes and the user can
/// mutate lives in [`EndpointState`] behind a lock that is only held for
/// bookkeeping, never across a probe.
pub(crate) struct EndpointCore {
    id: u32,
    api_caller_id: ChainApiType,
    paths: Vec<String>,
    caller: ProbeFn,
    state: Mutex<EndpointState>,
}

/// Represents the mutable half of an endpoint group: the node URLs to check
/// and the latest probe result per URL.
struct EndpointState {
    endpoint_urls: HashSet<String>,
    /// Latest latency (in milliseconds) per node URL currently up.
    up: HashMap<String, u64>,
    /// Latest failure reason per node URL currently down.
    down: HashMap<String, ErrorReason>,
}

/// Represents a registered probe: calls one API method against the given
/// node URL, returning the raw response data (with its timings) on success.
///
/// TS NOTE: the `(apiUrl: string) => Promise<IDetailedResponseData<any>>`
/// closure TS `register` builds around `withProxy`; the Rust checker builds
/// it around `call_at`, erasing the user validator into it.
pub(crate) type ProbeFn = Box<dyn Fn(String) -> ProbeFuture + Send + Sync>;

/// Represents the boxed future a probe call resolves to.
pub(crate) type ProbeFuture = Pin<
    Box<dyn Future<Output = Result<DetailedResponseData, ProbeFailure>> + Send>,
>;

impl EndpointCore {
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
            caller,
            state: Mutex::new(EndpointState {
                endpoint_urls,
                up: HashMap::new(),
                down: HashMap::new(),
            }),
        }
    }

    /// Returns the API call paths, e.g. `["block_api", "get_block_header"]`
    /// or `["hafbe-api", "operation-type-counts"]`.
    pub(crate) fn paths(&self) -> &[String] {
        &self.paths
    }

    /// Returns the API caller this endpoint group belongs to, e.g. `json_rpc`
    /// or `rest`.
    pub(crate) fn api_caller_id(&self) -> ChainApiType {
        self.api_caller_id
    }

    /// Returns a snapshot of the node URLs that will be checked.
    pub(crate) fn endpoint_urls(&self) -> HashSet<String> {
        self.state().endpoint_urls.clone()
    }

    /// Returns the unique identifier of this endpoint group. Can be used upon
    /// validation-error parsing to properly identify the endpoint.
    pub(crate) fn id(&self) -> u32 {
        self.id
    }

    /// Adds a new node URL to the set of URLs to check.
    pub(crate) fn add_endpoint_url(&self, endpoint_url: String) {
        self.state().endpoint_urls.insert(endpoint_url);
    }

    /// Removes a node URL from the set of URLs to check. Returns `true` if
    /// the URL was present, `false` otherwise.
    pub(crate) fn remove_endpoint_url(&self, endpoint_url: &str) -> bool {
        self.state().endpoint_urls.remove(endpoint_url)
    }

    /// Lists the endpoint URL statuses: the ones that are up first, ordered
    /// by ascending latency, followed by the ones that are down.
    pub(crate) fn list(&self) -> Vec<HiveEndpointData> {
        let state = self.state();

        let mut up: Vec<(&String, u64)> = state
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

        result.extend(state.down.iter().map(|(url, reason)| {
            HiveEndpointData {
                url: url.clone(),
                state: ProbeState::Down { reason: *reason },
            }
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
    /// transitions once all probes settled and returns them instead. Like TS
    /// (which snapshots the URL set before looping), URLs added or removed
    /// while a round is in flight only affect the next round.
    pub(crate) async fn perform_check(&self) -> CheckOutcome {
        let urls: Vec<String> =
            self.state().endpoint_urls.iter().cloned().collect();

        let results =
            join_all(urls.iter().map(|url| self.verify_upon_url(url.clone())))
                .await;

        let mut state = self.state();
        let mut outcome = CheckOutcome::default();
        for (url, result) in urls.into_iter().zip(results) {
            match result {
                Ok(latency) => {
                    self.record_up(&mut state, url, latency, &mut outcome)
                }
                Err(failure) => {
                    self.record_down(&mut state, url, failure, &mut outcome)
                }
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
        &self,
        state: &mut EndpointState,
        url: String,
        latency: u64,
        outcome: &mut CheckOutcome,
    ) {
        let data = HiveEndpointData {
            url: url.clone(),
            state: ProbeState::Up { latency },
        };

        if state.down.remove(&url).is_some() {
            outcome.state_changes.push(data.clone());
        }

        outcome.stats.push(data);
        state.up.insert(url, latency);
    }

    /// Records a failing URL: collects the stats entry (plus the transition
    /// if it just left the up bucket), the wrapped failure — and, for a
    /// validator rejection, the rich validation error — and stores its down
    /// reason.
    fn record_down(
        &self,
        state: &mut EndpointState,
        url: String,
        failure: ProbeFailure,
        outcome: &mut CheckOutcome,
    ) {
        let reason = classify_reason(&failure);
        let data = HiveEndpointData {
            url: url.clone(),
            state: ProbeState::Down { reason },
        };

        if state.up.remove(&url).is_some() {
            outcome.state_changes.push(data.clone());
        }

        // TS NOTE: TS builds this error inside the `register` closure and
        // emits 'validationerror' right away; the Rust closure only returns
        // the reason and the response, and the rich error is built here,
        // where the live endpoint identity is known.
        if let ProbeFailure::Validation { reason, response } = &failure {
            outcome.validation_errors.push(ValidatorFailedError {
                failed_reason: reason.clone(),
                endpoint: self.info(state),
                url: url.clone(),
                response: response.clone(),
            });
        }

        outcome.stats.push(data);
        outcome.errors.push(HealthCheckerError {
            source: Box::new(failure),
            endpoint: self.info(state),
            api_url: Some(url.clone()),
        });
        state.down.insert(url, reason);
    }

    /// Returns the owned identity snapshot attached to error payloads.
    fn info(&self, state: &EndpointState) -> EndpointInfo {
        EndpointInfo {
            id: self.id,
            api_caller_id: self.api_caller_id,
            paths: self.paths.clone(),
            endpoint_urls: state.endpoint_urls.clone(),
        }
    }

    /// Locks the mutable state.
    fn state(&self) -> MutexGuard<'_, EndpointState> {
        self.state.lock().expect("endpoint state mutex poisoned")
    }
}

/// Converts a probe failure into the reason its URL is marked down with.
///
/// TS NOTE: the `instanceof` cascade of the `verifyUponUrl` catch block
/// (`endpoint.ts` lines 146-155).
fn classify_reason(failure: &ProbeFailure) -> ErrorReason {
    match failure {
        ProbeFailure::Validation { .. } => ErrorReason::ValidationError,
        ProbeFailure::Chain(WaxChainError::Request(request_error)) => {
            match request_error {
                RequestError::Timeout { .. } => ErrorReason::Timeout,
                RequestError::NonSuccessResponseCode { .. } => {
                    ErrorReason::ServerError
                }
                _ => ErrorReason::Other,
            }
        }
        ProbeFailure::Chain(_) => ErrorReason::Other,
    }
}

/// Represents everything one [`EndpointCore::perform_check`] round produced:
/// the per-URL probe results, the up/down transitions and the failures.
///
/// TS NOTE: TS pushes these through the `HealthChecker` event emitter
/// ('stats', 'statechanged', 'error' and 'validationerror') as each probe
/// settles; the Rust endpoint returns them and the checker does the emitting.
#[derive(Debug, Default)]
pub(crate) struct CheckOutcome {
    pub stats: Vec<HiveEndpointData>,
    /// The URLs that switched buckets, with their new state.
    ///
    /// TS NOTE: `INewUpDownEvent` — its `endpointUrl` / `up` fields duplicate
    /// `data`, and its `paths` / `apiCallerId` only serve 'statechanged'
    /// listeners, which Rust does not expose (the checker filters
    /// subscriptions by URL); what remains is the plain data entry. The
    /// dead-code TS `INewBestEvent` is not ported either — the TS 'newbest'
    /// event actually emits a `TScoredEndpoint`
    /// ([`super::ScoredEndpoint`]).
    pub state_changes: Vec<HiveEndpointData>,
    pub errors: Vec<HealthCheckerError>,
    pub validation_errors: Vec<ValidatorFailedError>,
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
/// TS NOTE: `TErrorReason`; its `userabort` value maps the browser-only
/// abort signal behind the unported `WaxRequestAbortedByUser` (see
/// [`RequestError`]), so it is not ported either.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ErrorReason {
    Timeout,
    ServerError,
    ValidationError,
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

    fn endpoint(urls: &[&str], caller: ProbeFn) -> EndpointCore {
        EndpointCore::new(
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

    fn validation_failure(reason: &str) -> ProbeFailure {
        ProbeFailure::Validation {
            reason: reason.into(),
            response: response_with_latency(5),
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
            extra_headers: Vec::new(),
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
        let endpoint = endpoint(
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
        let endpoint = endpoint(
            &["https://a"],
            Box::new(|_| {
                Box::pin(async {
                    Err(validation_failure("head block too old"))
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
            [HealthCheckerError { endpoint, api_url, .. }]
                if endpoint.id == 7
                    && api_url.as_deref() == Some("https://a")
        ));
        // The validator rejection must also surface as the rich error.
        assert!(matches!(
            &outcome.validation_errors[..],
            [ValidatorFailedError { failed_reason, url, endpoint, .. }]
                if failed_reason == "head block too old"
                    && url == "https://a"
                    && endpoint.id == 7
        ));
    }

    #[test]
    fn emits_state_changes_on_up_down_transitions() {
        let healthy = Arc::new(AtomicBool::new(true));
        let flag = healthy.clone();
        let endpoint = endpoint(
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
            [HiveEndpointData {
                url,
                state: ProbeState::Down { .. },
            }] if url == "https://a"
        ));
        assert_eq!(outcome.errors.len(), 1);

        healthy.store(true, Ordering::Relaxed);
        let outcome = block_on(endpoint.perform_check());

        assert!(matches!(
            &outcome.state_changes[..],
            [HiveEndpointData {
                state: ProbeState::Up { .. },
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
            (validation_failure("mismatch"), ErrorReason::ValidationError),
        ];

        for (failure, expected) in cases {
            assert_eq!(classify_reason(&failure), expected, "{failure:?}");
        }
    }

    #[test]
    fn probes_every_url_of_the_group() {
        let endpoint = endpoint(
            &["https://a", "https://b", "https://c"],
            Box::new(|url| {
                Box::pin(async move {
                    if url == "https://b" {
                        Err(validation_failure("bad"))
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
