//! The health checker: registration, scoring and scheduling of endpoint
//! probes.
//!
//! TS NOTE: ported from `ts/wasm/lib/detailed/healthchecker/healthchecker.ts`
//! (the `HealthChecker` class itself; its event map lives in `events.rs`,
//! its constructor parameters in `options.rs`). The TS `setInterval` loop
//! becomes the user-spawned [`HealthChecker::run`] future.

use std::collections::{HashMap, HashSet, VecDeque};
use std::sync::atomic::{AtomicU32, Ordering};
use std::sync::{Arc, Mutex, MutexGuard};
use std::time::Duration;

use futures_util::future::join_all;
use tokio::sync::broadcast;
use tokio::time::{Instant, MissedTickBehavior};

use super::endpoint::{
    CheckOutcome, EndpointCore, HiveEndpoint, HiveEndpointData, ProbeFn,
    ProbeState,
};
use super::errors::{ChainApiType, ProbeFailure};
use super::events::{EVENT_CHANNEL_CAPACITY, HealthCheckerEvent};
use super::options::{
    CalcScoresFn, DEFAULT_JSON_RPC_ENDPOINTS, DEFAULT_REST_API_ENDPOINTS,
    HealthCheckerOptions,
};
use super::probe::ApiProbe;
use super::scored_endpoint::ScoredEndpoint;

/// Used as the tick period of [`HealthChecker::run`].
///
/// TS NOTE: `PERFORM_CHECK_INTERVAL_MS`.
const PERFORM_CHECK_INTERVAL: Duration = Duration::from_millis(1_000);

/// Provides endpoint health checking: registered API probes run periodically
/// against a set of node URLs, their results are scored into a best-first
/// list, and state transitions are broadcast as [`HealthCheckerEvent`]s.
///
/// Cloning is cheap and every clone drives the same checker. Nothing is
/// probed until one clone's [`run`](Self::run) future is spawned; checks
/// start with the first [`register`](Self::register) and pause when the last
/// endpoint group is unregistered.
///
/// TS NOTE: `HealthChecker` (an `EventEmitter` driven by `setInterval`);
/// event listeners become the [`events`](Self::events) channel and the
/// interval becomes the user-spawned [`run`](Self::run) future.
#[derive(Clone)]
pub struct HealthChecker {
    inner: Arc<CheckerInner>,
}

impl HealthChecker {
    /// Creates a health checker with the default [`HealthCheckerOptions`].
    pub fn new() -> Self {
        Self::with_options(HealthCheckerOptions::default())
    }

    /// Creates a health checker with the given options.
    pub fn with_options(options: HealthCheckerOptions) -> Self {
        let (events, _) = broadcast::channel(EVENT_CHANNEL_CAPACITY);

        Self {
            inner: Arc::new(CheckerInner {
                default_endpoints: options.default_endpoints,
                minimal_check_interval: Duration::from_millis(
                    options.minimal_check_interval_ms,
                ),
                calculate_scores: options.calculate_scores,
                next_id: AtomicU32::new(0),
                endpoints: Mutex::new(HashMap::new()),
                stats: Mutex::new(StatsStore {
                    per_url: HashMap::new(),
                    limit: 1,
                }),
                scores: Mutex::new(ScoreCache {
                    list: Vec::new(),
                    last_best: None,
                }),
                subscriptions: Mutex::new(HashSet::new()),
                next_check: Mutex::new(None),
                events,
            }),
        }
    }

    /// Returns the currently best-scored node URL, if any round has scored
    /// one yet.
    pub fn best(&self) -> Option<String> {
        self.inner.scores().last_best.clone()
    }

    /// Returns the scoreboard cached by the latest check round, best first.
    pub fn list(&self) -> Vec<ScoredEndpoint> {
        self.inner.scores().list.clone()
    }

    /// Returns a receiver of the checker's events. Only events emitted after
    /// this call are delivered; a receiver lagging more than the channel
    /// backlog skips the oldest events.
    ///
    /// TS NOTE: the `EventEmitter` `on`/`off` surface (`IHealthCheckerEvents`).
    pub fn events(&self) -> broadcast::Receiver<HealthCheckerEvent> {
        self.inner.events.subscribe()
    }

    /// Registers a health check and returns its endpoint-group handle.
    /// `probe` bundles the transport, the API paths and the call — take it
    /// from a `<method>_probe` constructor emitted by
    /// [`#[hive_api]`](crate::hive_api), or build one with
    /// [`ApiProbe::new`] / [`ApiProbe::json_rpc`] / [`ApiProbe::rest`].
    /// `test_on_endpoints` lists the node URLs to check (empty falls back to
    /// [`HealthCheckerOptions::default_endpoints`], then to the per-transport
    /// defaults).
    ///
    /// The first registration schedules an immediate check round, picked up
    /// by the [`run`](Self::run) future.
    ///
    /// TS NOTE: `register(endpointToCheck, toSend, validator?,
    /// testOnEndpoints?)`. TS reflects the transport and paths off the
    /// proxied API method and closes over `toSend`; [`ApiProbe`] carries the
    /// same three things explicitly.
    pub fn register<R>(
        &self,
        probe: ApiProbe<R>,
        test_on_endpoints: Vec<String>,
    ) -> HiveEndpoint
    where
        R: Send + 'static,
    {
        self.register_with_validator(probe, |_: &R| Ok(()), test_on_endpoints)
    }

    /// Registers a health check like [`register`](Self::register), with a
    /// validator inspecting each decoded probe response. A rejection —
    /// `Err(reason)` — marks the URL down with
    /// [`super::ErrorReason::ValidationError`] and emits
    /// [`HealthCheckerEvent::ValidationError`].
    ///
    /// TS NOTE: the `validator` parameter of `register`; `true | string`
    /// becomes `Result<(), String>`.
    pub fn register_with_validator<R, V>(
        &self,
        probe: ApiProbe<R>,
        validator: V,
        test_on_endpoints: Vec<String>,
    ) -> HiveEndpoint
    where
        R: Send + 'static,
        V: Fn(&R) -> Result<(), String> + Send + Sync + 'static,
    {
        let ApiProbe {
            api_caller_id,
            paths,
            probe,
        } = probe;

        let validator = Arc::new(validator);
        let caller: ProbeFn = Box::new(move |url| {
            let future = probe(url);
            let validator = Arc::clone(&validator);

            Box::pin(async move {
                let (value, response) = future.await?;

                if let Err(reason) = validator(&value) {
                    return Err(ProbeFailure::Validation { reason, response });
                }

                Ok(response)
            })
        });

        self.register_erased(api_caller_id, paths, test_on_endpoints, caller)
    }

    /// Unregisters the endpoint group with the given id from the periodic
    /// health checks, dropping the stats of node URLs no other group checks.
    /// Returns `false` if no such group is registered. The last
    /// unregistration pauses checking until the next registration.
    ///
    /// TS NOTE: `unregister(api)` — takes the id
    /// ([`HiveEndpoint::id`]) instead of the handle.
    pub fn unregister(&self, id: u32) -> bool {
        let removed = self.inner.endpoints().remove(&id).is_some();
        if !removed {
            return false;
        }

        self.clear_unused_endpoint_urls_from_stats();

        // TS NOTE: `stop()` — TS clears its interval; the Rust `run` future
        // keeps ticking and just finds no check scheduled.
        if self.inner.endpoints().is_empty() {
            *self.inner.next_check() = None;
        }

        true
    }

    /// Unregisters all endpoint groups and pauses checking.
    pub fn unregister_all(&self) {
        self.inner.endpoints().clear();

        self.clear_unused_endpoint_urls_from_stats();
        *self.inner.next_check() = None;
    }

    /// Returns the handle of the endpoint group with the given id, if
    /// registered.
    ///
    /// TS NOTE: `getEndpoint`.
    pub fn endpoint(&self, id: u32) -> Option<HiveEndpoint> {
        let core = self.inner.endpoints().get(&id).cloned()?;

        Some(HiveEndpoint::new(self.clone(), core))
    }

    /// Returns the handles of all registered endpoint groups.
    ///
    /// TS NOTE: the `[Symbol.iterator]` surface.
    pub fn endpoints(&self) -> Vec<HiveEndpoint> {
        self.endpoint_cores()
            .into_iter()
            .map(|core| HiveEndpoint::new(self.clone(), core))
            .collect()
    }

    /// Adds a node URL to every endpoint group of the given transport type.
    pub fn add_endpoint_url(&self, endpoint_url: &str, api_type: ChainApiType) {
        for endpoint in self.endpoint_cores() {
            if endpoint.api_caller_id() == api_type {
                endpoint.add_endpoint_url(endpoint_url.to_string());
            }
        }

        // TS NOTE: TS leaves the cached-scored-list limit stale until the
        // next register/unregister; Rust keeps the invariant on every URL
        // set change.
        self.recalculate_stats_limit();
    }

    /// Removes a node URL from every endpoint group of the given transport
    /// type, dropping the stats of node URLs no group checks anymore.
    pub fn remove_endpoint_url(
        &self,
        endpoint_url: &str,
        api_type: ChainApiType,
    ) {
        for endpoint in self.endpoint_cores() {
            if endpoint.api_caller_id() == api_type {
                endpoint.remove_endpoint_url(endpoint_url);
            }
        }

        self.clear_unused_endpoint_urls_from_stats();
    }

    /// Subscribes to the given node URL: while subscribed, its up/down
    /// transitions are emitted as [`HealthCheckerEvent::NewUp`] /
    /// [`HealthCheckerEvent::NewDown`].
    ///
    /// TS NOTE: `subscribe` adds a per-URL listener on the internal
    /// 'statechanged' event; the Rust checker filters against the
    /// subscription set while applying check outcomes.
    pub fn subscribe(&self, endpoint_url: impl Into<String>) {
        self.inner.subscriptions().insert(endpoint_url.into());
    }

    /// Unsubscribes from the given node URL.
    pub fn unsubscribe(&self, endpoint_url: &str) {
        self.inner.subscriptions().remove(endpoint_url);
    }

    /// Unsubscribes from all node URLs.
    pub fn unsubscribe_all(&self) {
        self.inner.subscriptions().clear();
    }

    /// Spawns [`run`](Self::run) on the current tokio runtime, returning a
    /// guard that aborts the task when dropped — shutting the checker down
    /// becomes leaving the guard's scope:
    /// `let _guard = checker.spawn();`.
    ///
    /// NOTE: dropping a raw `tokio::spawn` handle would *detach* the task,
    /// leaving the checker probing forever with no way to reach it; the
    /// guard makes the shutdown path explicit. Must be called within a
    /// tokio runtime.
    pub fn spawn(&self) -> HealthCheckerGuard {
        let checker = self.clone();

        HealthCheckerGuard {
            run: tokio::spawn(async move { checker.run().await }),
            dispatcher: None,
        }
    }

    /// Spawns the checker like [`spawn`](Self::spawn) and additionally a
    /// dispatcher task feeding every [`HealthCheckerEvent`] to `handler`.
    /// The returned guard aborts both tasks when dropped.
    ///
    /// The handler runs on the dispatcher task, never inside the checker,
    /// so it may freely call back into this checker. It is deliberately
    /// synchronous — for async reactions consume a receiver from
    /// [`events`](Self::events) with a `while let` loop instead.
    ///
    /// TS NOTE: the closest analog of the TS `EventEmitter` `on(...)`
    /// surface; one handler receives all events (match on the variant)
    /// instead of one listener per event name.
    pub fn spawn_with_handler<F>(&self, mut handler: F) -> HealthCheckerGuard
    where
        F: FnMut(HealthCheckerEvent) + Send + 'static,
    {
        // Subscribe before the run task spawns, so its first round cannot
        // slip past the dispatcher.
        let mut events = self.events();
        let dispatcher = tokio::spawn(async move {
            loop {
                match events.recv().await {
                    Ok(event) => handler(event),
                    // A lagged receiver skips the oldest backlog but stays
                    // subscribed.
                    Err(broadcast::error::RecvError::Lagged(_)) => {}
                    Err(broadcast::error::RecvError::Closed) => break,
                }
            }
        });

        let mut guard = self.spawn();
        guard.dispatcher = Some(dispatcher);

        guard
    }

    /// Drives the periodic health checks; spawn it on your async runtime
    /// (or let [`spawn`](Self::spawn) do both).
    /// The future never resolves — drop it (or abort its task) to shut the
    /// checker down. Requires a tokio runtime with the time driver enabled.
    ///
    /// Rounds run at most once per tick (1s): one is due when the first
    /// endpoint group is registered, then each round schedules the next at
    /// `max(2 × round duration, minimal_check_interval_ms)` after it ends;
    /// with nothing registered, ticks are idle.
    ///
    /// TS NOTE: the `setInterval(performChecks, 1000)` loop that
    /// `ensureRunning`/`stop` manage; Rust hands the loop to the user
    /// instead of owning a timer.
    pub async fn run(&self) {
        let mut ticker = tokio::time::interval(PERFORM_CHECK_INTERVAL);
        ticker.set_missed_tick_behavior(MissedTickBehavior::Delay);

        loop {
            ticker.tick().await;
            self.perform_checks().await;
        }
    }

    /// Runs one scheduled check round, if due: probes every endpoint group
    /// concurrently, applies the outcomes, refreshes the scoreboard and
    /// schedules the next round.
    ///
    /// TS NOTE: `performChecks`. Crate-visible so in-crate tests can drive
    /// rounds without spawning [`Self::run`].
    pub(crate) async fn perform_checks(&self) {
        let due = {
            let mut next_check = self.inner.next_check();

            match *next_check {
                Some(at) if at <= Instant::now() => {
                    *next_check = None;
                    true
                }
                _ => false,
            }
        };
        if !due {
            return;
        }

        let start = Instant::now();
        let endpoints = self.endpoint_cores();
        let outcomes =
            join_all(endpoints.iter().map(|endpoint| endpoint.perform_check()))
                .await;

        for outcome in outcomes {
            self.apply_outcome(outcome);
        }

        self.refresh_scores();

        if !self.inner.endpoints().is_empty() {
            let interval =
                (start.elapsed() * 2).max(self.inner.minimal_check_interval);
            *self.inner.next_check() = Some(Instant::now() + interval);
        }
    }

    /// Applies one endpoint group's round outcome: records the stats and
    /// emits the subscribed transitions and the failures.
    fn apply_outcome(&self, outcome: CheckOutcome) {
        for data in outcome.stats {
            self.push_endpoint_data(data);
        }

        {
            let subscriptions = self.inner.subscriptions();
            for change in &outcome.state_changes {
                if !subscriptions.contains(&change.url) {
                    continue;
                }

                let url = change.url.clone();
                self.inner.emit(match change.state {
                    ProbeState::Up { .. } => HealthCheckerEvent::NewUp { url },
                    ProbeState::Down { .. } => {
                        HealthCheckerEvent::NewDown { url }
                    }
                });
            }
        }

        for error in outcome.validation_errors {
            self.inner
                .emit(HealthCheckerEvent::ValidationError(Arc::new(error)));
        }
        for error in outcome.errors {
            self.inner.emit(HealthCheckerEvent::Error(Arc::new(error)));
        }
    }

    /// Appends a probe result to its URL's history ring, trimming the front
    /// so the ring never exceeds the cached-scored-list limit.
    ///
    /// TS NOTE: `pushEndpointData`.
    fn push_endpoint_data(&self, data: HiveEndpointData) {
        let mut stats = self.inner.stats();
        let limit = stats.limit;
        let history = stats.per_url.entry(data.url).or_default();

        if history.len() >= limit {
            let excess = history.len() + 1 - limit;
            for _ in 0..excess {
                history.pop_front();
            }
        }

        history.push_back(data.state);
    }

    /// Rebuilds the cached scoreboard from the recorded per-URL histories,
    /// announcing a leadership change and the fresh scoreboard.
    ///
    /// TS NOTE: `calculateCachedScored` plus the 'data' emit of
    /// `performChecks`.
    fn refresh_scores(&self) {
        let mut snapshot: Vec<(String, Vec<ProbeState>)> = {
            let stats = self.inner.stats();

            stats
                .per_url
                .iter()
                .map(|(url, history)| {
                    (url.clone(), history.iter().cloned().collect())
                })
                .collect()
        };
        // NOTE: the TS stats map iterates in insertion order; a `HashMap`
        // does not, so sort by URL to keep equal-score ordering — and with
        // it the 'newbest' choice — stable across rounds.
        snapshot.sort_by(|a, b| a.0.cmp(&b.0));

        let scored = if snapshot.is_empty() {
            Vec::new()
        } else {
            (self.inner.calculate_scores)(&snapshot)
        };

        let mut cache = self.inner.scores();
        if let Some(best) = scored.first() {
            if cache.last_best.as_deref() != Some(best.url.as_str()) {
                cache.last_best = Some(best.url.clone());
                self.inner.emit(HealthCheckerEvent::NewBest(best.clone()));
            }
        }
        cache.list = scored.clone();
        drop(cache);

        self.inner.emit(HealthCheckerEvent::Data(scored));
    }

    /// Registers a type-erased probe (see [`register`](Self::register)).
    fn register_erased(
        &self,
        api_caller_id: ChainApiType,
        paths: Vec<String>,
        test_on_endpoints: Vec<String>,
        caller: ProbeFn,
    ) -> HiveEndpoint {
        let urls = self.resolve_endpoint_urls(api_caller_id, test_on_endpoints);
        let id = self.inner.next_id.fetch_add(1, Ordering::Relaxed);
        let core =
            Arc::new(EndpointCore::new(id, api_caller_id, paths, urls, caller));

        let became_first = {
            let mut endpoints = self.inner.endpoints();
            endpoints.insert(id, Arc::clone(&core));

            endpoints.len() == 1
        };

        // TS NOTE: `ensureRunning` — the first registration schedules an
        // immediate round for the `run` future to pick up.
        if became_first {
            let mut next_check = self.inner.next_check();
            if next_check.is_none() {
                *next_check = Some(Instant::now());
            }
        }

        self.recalculate_stats_limit();

        HiveEndpoint::new(self.clone(), core)
    }

    /// Resolves the node URLs a registration will probe: the explicit list,
    /// else the checker-wide default, else the per-transport default.
    fn resolve_endpoint_urls(
        &self,
        api_caller_id: ChainApiType,
        test_on_endpoints: Vec<String>,
    ) -> HashSet<String> {
        if !test_on_endpoints.is_empty() {
            return test_on_endpoints.into_iter().collect();
        }

        if let Some(defaults) = &self.inner.default_endpoints {
            return defaults.iter().cloned().collect();
        }

        let defaults = match api_caller_id {
            ChainApiType::JsonRpc => DEFAULT_JSON_RPC_ENDPOINTS,
            ChainApiType::Rest => DEFAULT_REST_API_ENDPOINTS,
        };

        defaults.iter().map(ToString::to_string).collect()
    }

    /// Recalculates the per-URL history limit: the largest URL count of any
    /// endpoint group times the group count.
    ///
    /// TS NOTE: `calculateCachedScoredListSize`.
    pub(super) fn recalculate_stats_limit(&self) {
        let endpoints = self.endpoint_cores();

        let mut max_urls = 1;
        for endpoint in &endpoints {
            max_urls = max_urls.max(endpoint.endpoint_urls().len());
        }

        self.inner.stats().limit = max_urls * endpoints.len();
    }

    /// Drops the history of node URLs no endpoint group checks anymore and
    /// recalculates the history limit.
    ///
    /// TS NOTE: `clearUnusedEndpointUrlsFromStats` (the internal
    /// 'clearunused' event handler).
    pub(super) fn clear_unused_endpoint_urls_from_stats(&self) {
        let endpoints = self.endpoint_cores();

        let mut used = HashSet::new();
        for endpoint in &endpoints {
            used.extend(endpoint.endpoint_urls());
        }

        self.inner
            .stats()
            .per_url
            .retain(|url, _| used.contains(url));

        self.recalculate_stats_limit();
    }

    /// Snapshots the registered endpoint cores, so no map lock is held while
    /// they are probed or their state locks taken.
    fn endpoint_cores(&self) -> Vec<Arc<EndpointCore>> {
        self.inner.endpoints().values().cloned().collect()
    }
}

impl Default for HealthChecker {
    fn default() -> Self {
        Self::new()
    }
}

/// Represents the running tasks behind a spawned health checker
/// ([`HealthChecker::spawn`] / [`HealthChecker::spawn_with_handler`]);
/// dropping the guard aborts them, tying the checker's activity to a scope.
///
/// The checker itself outlives the guard — respawning later is just another
/// `spawn` call.
#[must_use = "dropping the guard aborts the spawned health checker tasks \
              immediately; bind it, e.g. `let _guard = checker.spawn();`"]
pub struct HealthCheckerGuard {
    run: tokio::task::JoinHandle<()>,
    dispatcher: Option<tokio::task::JoinHandle<()>>,
}

impl Drop for HealthCheckerGuard {
    fn drop(&mut self) {
        self.run.abort();

        if let Some(dispatcher) = &self.dispatcher {
            dispatcher.abort();
        }
    }
}

/// Represents the shared state behind every [`HealthChecker`] clone (and
/// every [`HiveEndpoint`] handle holding a checker clone).
struct CheckerInner {
    default_endpoints: Option<Vec<String>>,
    minimal_check_interval: Duration,
    calculate_scores: CalcScoresFn,
    next_id: AtomicU32,
    endpoints: Mutex<HashMap<u32, Arc<EndpointCore>>>,
    stats: Mutex<StatsStore>,
    scores: Mutex<ScoreCache>,
    /// Node URLs whose transitions are emitted (see
    /// [`HealthChecker::subscribe`]).
    subscriptions: Mutex<HashSet<String>>,
    /// When the next check round is due; `None` while one is running or
    /// nothing is registered.
    ///
    /// TS NOTE: `nextScheduledCheck`.
    next_check: Mutex<Option<Instant>>,
    events: broadcast::Sender<HealthCheckerEvent>,
}

impl CheckerInner {
    /// Broadcasts an event, ignoring the absence of receivers.
    fn emit(&self, event: HealthCheckerEvent) {
        let _ = self.events.send(event);
    }

    fn endpoints(&self) -> MutexGuard<'_, HashMap<u32, Arc<EndpointCore>>> {
        self.endpoints.lock().expect("endpoints mutex poisoned")
    }

    fn stats(&self) -> MutexGuard<'_, StatsStore> {
        self.stats.lock().expect("stats mutex poisoned")
    }

    fn scores(&self) -> MutexGuard<'_, ScoreCache> {
        self.scores.lock().expect("scores mutex poisoned")
    }

    fn subscriptions(&self) -> MutexGuard<'_, HashSet<String>> {
        self.subscriptions
            .lock()
            .expect("subscriptions mutex poisoned")
    }

    fn next_check(&self) -> MutexGuard<'_, Option<Instant>> {
        self.next_check.lock().expect("next-check mutex poisoned")
    }
}

/// Represents the recorded probe histories feeding the scoring function,
/// keyed by node URL across all endpoint groups.
struct StatsStore {
    /// Per-URL probe results, newest last.
    ///
    /// TS NOTE: `endpointStats`.
    per_url: HashMap<String, VecDeque<ProbeState>>,
    /// Ring capacity of each history.
    ///
    /// TS NOTE: `cachedScoredListLimit`.
    limit: usize,
}

/// Represents the scoreboard cached by the latest check round.
struct ScoreCache {
    /// TS NOTE: `cachedScoredList`.
    list: Vec<ScoredEndpoint>,
    /// TS NOTE: `lastBest`.
    last_best: Option<String>,
}

#[cfg(test)]
mod tests {
    use std::future::{Ready, ready};
    use std::sync::atomic::AtomicBool;
    use std::time::Instant as StdInstant;

    use crate::chain::error::WaxChainError;
    use crate::chain::util::DetailedResponseData;

    use super::super::endpoint::ErrorReason;
    use super::super::options::INITIAL_CHECK_INTERVAL_MS;
    use super::super::scored_endpoint::ScoredState;
    use super::*;

    type ProbeResult = Result<((), DetailedResponseData), WaxChainError>;

    fn response_with_latency(ms: u64) -> DetailedResponseData {
        let start = StdInstant::now();

        DetailedResponseData {
            start,
            end: Some(start + Duration::from_millis(ms)),
            status: Some(200),
            headers: None,
            response: None,
        }
    }

    fn up_probe(
        ms: u64,
    ) -> impl Fn(String) -> Ready<ProbeResult> + Send + Sync + 'static {
        move |_| ready(Ok(((), response_with_latency(ms))))
    }

    /// Probes up with the given latency while `healthy` holds, down (with a
    /// chain error) otherwise.
    fn flip_probe(
        healthy: Arc<AtomicBool>,
        ms: u64,
    ) -> impl Fn(String) -> Ready<ProbeResult> + Send + Sync + 'static {
        move |_| {
            if healthy.load(Ordering::Relaxed) {
                ready(Ok(((), response_with_latency(ms))))
            } else {
                ready(Err(WaxChainError::JsonRpc {
                    code: -1,
                    message: "node down".into(),
                }))
            }
        }
    }

    fn paths() -> Vec<String> {
        vec!["block_api".into(), "get_block".into()]
    }

    /// Bundles a fake probe closure for `register`.
    fn probe<F>(api_caller_id: ChainApiType, probe: F) -> ApiProbe<()>
    where
        F: Fn(String) -> Ready<ProbeResult> + Send + Sync + 'static,
    {
        ApiProbe::new(api_caller_id, paths(), probe)
    }

    fn urls(list: &[&str]) -> Vec<String> {
        list.iter().map(ToString::to_string).collect()
    }

    /// Waits out the minimal check interval (paused-clock tests only).
    async fn next_round(checker: &HealthChecker) {
        tokio::time::advance(Duration::from_millis(
            INITIAL_CHECK_INTERVAL_MS + 1,
        ))
        .await;
        checker.perform_checks().await;
    }

    #[tokio::test]
    async fn first_registration_schedules_immediate_round() {
        let checker = HealthChecker::new();
        let mut events = checker.events();

        checker.register(
            probe(ChainApiType::Rest, up_probe(50)),
            urls(&["https://a"]),
        );
        checker.perform_checks().await;

        assert_eq!(checker.best().as_deref(), Some("https://a"));
        assert!(matches!(
            events.try_recv(),
            Ok(HealthCheckerEvent::NewBest(ScoredEndpoint { url, .. }))
                if url == "https://a"
        ));
        assert!(matches!(
            events.try_recv(),
            Ok(HealthCheckerEvent::Data(scored)) if scored.len() == 1
        ));
        assert!(matches!(
            &checker.list()[..],
            [ScoredEndpoint {
                state: ScoredState::Up { .. },
                ..
            }]
        ));
    }

    #[tokio::test(start_paused = true)]
    async fn respects_minimal_check_interval() {
        let checker = HealthChecker::new();

        checker.register(
            probe(ChainApiType::Rest, up_probe(50)),
            urls(&["https://a"]),
        );
        checker.perform_checks().await;

        let mut events = checker.events();
        checker.perform_checks().await;

        // Immediately after a round the next one is not due yet.
        assert!(events.try_recv().is_err());

        next_round(&checker).await;

        assert!(matches!(events.try_recv(), Ok(HealthCheckerEvent::Data(_))));
    }

    #[tokio::test(start_paused = true)]
    async fn unregister_clears_stats_and_stops_scheduling() {
        let checker = HealthChecker::new();
        let endpoint = checker.register(
            probe(ChainApiType::Rest, up_probe(50)),
            urls(&["https://a"]),
        );
        checker.perform_checks().await;

        assert!(checker.unregister(endpoint.id()));
        assert!(!checker.unregister(endpoint.id()));

        // Unregistering the last group stops scheduling rounds.
        let mut events = checker.events();
        next_round(&checker).await;
        assert!(events.try_recv().is_err());

        // The dropped group's stats are gone: a fresh round only sees the
        // new registration.
        checker.register(
            probe(ChainApiType::Rest, up_probe(50)),
            urls(&["https://b"]),
        );
        checker.perform_checks().await;

        assert!(matches!(
            &checker.list()[..],
            [ScoredEndpoint { url, .. }] if url == "https://b"
        ));
    }

    #[tokio::test]
    async fn validator_rejection_emits_validation_and_error_events() {
        let checker = HealthChecker::new();
        let mut events = checker.events();

        let endpoint = checker.register_with_validator(
            ApiProbe::new(ChainApiType::JsonRpc, paths(), |_url: String| {
                ready(Ok((7u32, response_with_latency(10))))
            }),
            |head_block: &u32| {
                if *head_block == 7 {
                    Err("head block too old".to_string())
                } else {
                    Ok(())
                }
            },
            urls(&["https://a"]),
        );
        checker.perform_checks().await;

        assert!(matches!(
            &endpoint.list()[..],
            [HiveEndpointData {
                state: ProbeState::Down {
                    reason: ErrorReason::ValidationError,
                },
                ..
            }]
        ));
        assert!(matches!(
            events.try_recv(),
            Ok(HealthCheckerEvent::ValidationError(error))
                if error.failed_reason == "head block too old"
                    && error.url == "https://a"
        ));
        assert!(matches!(
            events.try_recv(),
            Ok(HealthCheckerEvent::Error(_))
        ));
    }

    #[tokio::test(start_paused = true)]
    async fn subscription_filters_transition_events_per_url() {
        let checker = HealthChecker::new();
        let healthy = Arc::new(AtomicBool::new(true));

        checker.register(
            probe(ChainApiType::Rest, flip_probe(healthy.clone(), 40)),
            urls(&["https://a", "https://b"]),
        );
        checker.subscribe("https://b");
        checker.perform_checks().await;

        let mut events = checker.events();
        healthy.store(false, Ordering::Relaxed);
        next_round(&checker).await;

        // Both URLs went down, but only the subscribed one is announced.
        let mut down = Vec::new();
        while let Ok(event) = events.try_recv() {
            if let HealthCheckerEvent::NewDown { url } = event {
                down.push(url);
            }
        }
        assert_eq!(down, ["https://b"]);

        checker.unsubscribe("https://b");
        healthy.store(true, Ordering::Relaxed);
        next_round(&checker).await;

        while let Ok(event) = events.try_recv() {
            assert!(!matches!(event, HealthCheckerEvent::NewUp { .. }));
        }
    }

    #[tokio::test(start_paused = true)]
    async fn history_is_capped_at_the_scored_list_limit() {
        let checker = HealthChecker::new();

        // Limit = max URL count (2) × group count (1).
        checker.register(
            probe(ChainApiType::Rest, up_probe(30)),
            urls(&["https://a", "https://b"]),
        );

        checker.perform_checks().await;
        next_round(&checker).await;
        next_round(&checker).await;

        let scored = checker.list();
        assert_eq!(scored.len(), 2);
        for entry in scored {
            assert!(matches!(
                entry.state,
                ScoredState::Up { ref latencies, .. } if latencies.len() == 2
            ));
        }
    }

    #[tokio::test(start_paused = true)]
    async fn announces_new_best_when_the_leader_drops_from_history() {
        let checker = HealthChecker::new();
        let a_healthy = Arc::new(AtomicBool::new(true));

        let flag = a_healthy.clone();
        checker.register(
            probe(ChainApiType::Rest, move |url: String| {
                if url == "https://b" {
                    ready(Ok(((), response_with_latency(500))))
                } else if flag.load(Ordering::Relaxed) {
                    ready(Ok(((), response_with_latency(10))))
                } else {
                    ready(Err(WaxChainError::JsonRpc {
                        code: -1,
                        message: "node down".into(),
                    }))
                }
            }),
            urls(&["https://a", "https://b"]),
        );

        let mut events = checker.events();
        checker.perform_checks().await;
        assert_eq!(checker.best().as_deref(), Some("https://a"));

        // One down round is outweighed by the fast up sample; only once the
        // ring (2 entries) holds downs alone does the leadership move.
        a_healthy.store(false, Ordering::Relaxed);
        next_round(&checker).await;
        next_round(&checker).await;
        assert_eq!(checker.best().as_deref(), Some("https://b"));

        let mut best = Vec::new();
        while let Ok(event) = events.try_recv() {
            if let HealthCheckerEvent::NewBest(scored) = event {
                best.push(scored.url);
            }
        }
        assert_eq!(best, ["https://a", "https://b"]);
    }

    #[test]
    fn adds_and_removes_urls_by_transport_type() {
        let checker = HealthChecker::new();
        let rpc = checker.register(
            probe(ChainApiType::JsonRpc, up_probe(10)),
            urls(&["https://rpc"]),
        );
        let rest = checker.register(
            probe(ChainApiType::Rest, up_probe(10)),
            urls(&["https://rest"]),
        );

        checker.add_endpoint_url("https://extra", ChainApiType::Rest);

        assert!(!rpc.endpoint_urls().contains("https://extra"));
        assert!(rest.endpoint_urls().contains("https://extra"));

        checker.remove_endpoint_url("https://extra", ChainApiType::Rest);

        assert!(!rest.endpoint_urls().contains("https://extra"));

        assert_eq!(
            checker.endpoint(rpc.id()).map(|found| found.id()),
            Some(rpc.id())
        );
        assert!(checker.endpoint(u32::MAX).is_none());
        assert_eq!(checker.endpoints().len(), 2);
    }

    #[test]
    fn falls_back_to_default_endpoints_per_transport() {
        let checker = HealthChecker::new();

        let rpc = checker
            .register(probe(ChainApiType::JsonRpc, up_probe(10)), Vec::new());
        assert_eq!(
            rpc.endpoint_urls(),
            HashSet::from(["https://api.hive.blog".to_string()])
        );

        let rest = checker
            .register(probe(ChainApiType::Rest, up_probe(10)), Vec::new());
        assert_eq!(
            rest.endpoint_urls(),
            HashSet::from(["https://api.syncad.com".to_string()])
        );

        let custom = HealthChecker::with_options(HealthCheckerOptions {
            default_endpoints: Some(urls(&["https://custom"])),
            ..Default::default()
        });
        let endpoint = custom
            .register(probe(ChainApiType::JsonRpc, up_probe(10)), Vec::new());
        assert_eq!(
            endpoint.endpoint_urls(),
            HashSet::from(["https://custom".to_string()])
        );
    }

    #[tokio::test(start_paused = true)]
    async fn spawn_drives_rounds_and_the_guard_aborts_on_drop() {
        let checker = HealthChecker::new();
        let mut events = checker.events();

        checker.register(
            probe(ChainApiType::Rest, up_probe(20)),
            urls(&["https://a"]),
        );

        let guard = checker.spawn();

        let event =
            tokio::time::timeout(Duration::from_secs(5), events.recv()).await;
        assert!(matches!(
            event,
            Ok(Ok(HealthCheckerEvent::NewBest(scored))) if scored.url == "https://a"
        ));

        drop(guard);
        while events.try_recv().is_ok() {}

        // With the run task aborted nothing performs the due round, however
        // far the clock advances.
        tokio::time::advance(Duration::from_millis(
            INITIAL_CHECK_INTERVAL_MS * 2,
        ))
        .await;
        assert!(events.try_recv().is_err());
    }

    #[tokio::test(start_paused = true)]
    async fn spawn_with_handler_dispatches_events_until_dropped() {
        let checker = HealthChecker::new();
        let (sender, mut received) = tokio::sync::mpsc::unbounded_channel();

        checker.register(
            probe(ChainApiType::Rest, up_probe(20)),
            urls(&["https://a"]),
        );

        let guard = checker.spawn_with_handler(move |event| {
            let _ = sender.send(event);
        });

        let event =
            tokio::time::timeout(Duration::from_secs(5), received.recv())
                .await
                .expect("handler feeds the channel")
                .expect("sender alive");
        assert!(matches!(
            event,
            HealthCheckerEvent::NewBest(scored) if scored.url == "https://a"
        ));

        // Both tasks die with the guard: no run task performs the due
        // round, and a manually driven round's events reach no handler.
        drop(guard);
        while received.try_recv().is_ok() {}

        next_round(&checker).await;

        assert!(received.try_recv().is_err());
    }

    #[tokio::test(start_paused = true)]
    async fn run_drives_rounds_once_spawned() {
        let checker = HealthChecker::new();
        let mut events = checker.events();

        checker.register(
            probe(ChainApiType::Rest, up_probe(20)),
            urls(&["https://a"]),
        );

        let runner = {
            let checker = checker.clone();
            tokio::spawn(async move { checker.run().await })
        };

        // The paused clock auto-advances to the runner's next tick.
        let event =
            tokio::time::timeout(Duration::from_secs(5), events.recv()).await;

        assert!(matches!(
            event,
            Ok(Ok(HealthCheckerEvent::NewBest(scored))) if scored.url == "https://a"
        ));

        runner.abort();
    }
}
