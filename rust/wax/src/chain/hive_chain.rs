//! The online chain type: [`HiveChain`], created by
//! [`create_hive_chain`](crate::create_hive_chain).

use std::ops::Deref;
use std::sync::Arc;
use std::time::Duration;

use tokio::sync::Mutex;
use tokio::time::Instant;

use crate::WaxFoundation;
use crate::create_wax_foundation;

use crate::WaxOptions;
use crate::chain::api::DefaultHiveApi;
use crate::chain::error::WaxChainError;
use crate::chain::extend::HiveApi;
use crate::chain::options::HiveChainOptions;
use crate::chain::rest::{RestCaller, RestClient};
use crate::chain::rpc::{JsonRpcCaller, JsonRpcClient};
use crate::models::basic::ChainReferenceData;

/// Used to bound the reuse of cached TaPoS reference data between
/// [`create_transaction`](HiveChain::create_transaction) calls.
///
/// TS NOTE: the `taposLiveness` argument TS `createTransaction` passes to
/// `acquireChainReferenceData` — the same 3 s.
const TAPOS_LIVENESS: Duration = Duration::from_secs(3);

/// Represents the online (chain-bound) API on top of [`WaxFoundation`]:
/// endpoint configuration, transport handles and the typed API surfaces
/// bound to them ([`Self::api`], [`Self::extend`] / [`Self::extend_rest`]),
/// plus the online-only helpers — the
/// [`create_transaction`](Self::create_transaction) factory,
/// [`broadcast`](Self::broadcast) and the per-account manabar accessors.
///
/// Composes a [`WaxFoundation`] for offline operations and owns the
/// JSON-RPC / REST transports used for online calls.
///
/// TS NOTE: TypeScript `IHiveChainInterface` extends `IWaxBaseInterface` and
/// exposes the same surface — Rust mirrors that via
/// `Deref<Target = WaxFoundation>`, so the offline methods are callable on a
/// chain and `&chain` coerces wherever a `&WaxFoundation` is expected.
pub struct HiveChain {
    foundation: WaxFoundation,
    rpc: Arc<JsonRpcClient>,
    rest: Arc<RestClient>,
    // Kept for the `options()` snapshot — the transports do not expose them
    // back.
    api_timeout: u32,
    wax_api_caller: Option<String>,
    tapos_cache: Mutex<Option<TaposCache>>,
}

/// Represents the TaPoS reference data last fetched from the node, reused
/// while younger than [`TAPOS_LIVENESS`].
struct TaposCache {
    data: ChainReferenceData,
    fetched_at: Instant,
}

impl HiveChain {
    pub(crate) fn new(
        options: HiveChainOptions,
    ) -> Result<Self, WaxChainError> {
        validate_endpoint(&options.api_endpoint)?;
        validate_endpoint(&options.rest_api_endpoint)?;

        let foundation = create_wax_foundation(WaxOptions {
            chain_id: options.chain_id.clone(),
        });
        let rpc = Arc::new(JsonRpcClient::new(
            options.api_endpoint.clone(),
            options.api_timeout.into(),
            options.wax_api_caller.clone(),
        ));
        let rest = Arc::new(RestClient::new(
            options.rest_api_endpoint,
            options.api_timeout.into(),
            options.wax_api_caller.clone(),
        ));

        Ok(Self {
            foundation,
            rpc,
            rest,
            api_timeout: options.api_timeout,
            wax_api_caller: options.wax_api_caller,
            tapos_cache: Mutex::new(None),
        })
    }

    /// Returns the JSON-RPC endpoint currently used for chain calls.
    pub fn endpoint_url(&self) -> String {
        self.rpc.endpoint()
    }

    /// Replaces the JSON-RPC endpoint at runtime. Mirrors TS
    /// `endpointUrl` setter and Python `endpoint_url` setter.
    pub fn set_endpoint_url(&self, url: &str) -> Result<(), WaxChainError> {
        validate_endpoint(url)?;
        self.rpc.set_endpoint(url.to_string());
        Ok(())
    }

    /// Returns the REST API endpoint currently used.
    pub fn rest_endpoint_url(&self) -> String {
        self.rest.endpoint()
    }

    /// Replaces the REST API endpoint at runtime.
    pub fn set_rest_endpoint_url(
        &self,
        url: &str,
    ) -> Result<(), WaxChainError> {
        validate_endpoint(url)?;
        self.rest.set_endpoint(url.to_string());

        Ok(())
    }

    /// Returns a cloneable handle to this chain's JSON-RPC transport, used
    /// to bind typed API surfaces to the chain (see [`Self::extend`]).
    pub fn json_rpc_caller(&self) -> JsonRpcCaller {
        JsonRpcCaller::new(self.rpc.clone())
    }

    /// Returns a cloneable handle to this chain's REST transport, used to
    /// bind typed REST API surfaces to the chain (see [`Self::extend_rest`]).
    pub fn rest_caller(&self) -> RestCaller {
        RestCaller::new(self.rest.clone())
    }

    /// Returns a snapshot of the chain's current configuration: the chain id,
    /// the live endpoints and the construction-time transport settings.
    ///
    /// TS NOTE: with [`create_hive_chain`](crate::create_hive_chain) and
    /// struct-update syntax this covers `IHiveChainInterface.extendConfig` —
    /// deriving a chain with selectively overridden options:
    /// `create_hive_chain(HiveChainOptions { api_timeout: 5_000,
    /// ..chain.options() })`. TS additionally links the derived chain back to
    /// its originator (endpoint changes propagate up); the Rust copies are
    /// independent.
    pub fn options(&self) -> HiveChainOptions {
        HiveChainOptions {
            chain_id: self.foundation.chain_id().to_string(),
            api_endpoint: self.rpc.endpoint(),
            rest_api_endpoint: self.rest.endpoint(),
            api_timeout: self.api_timeout,
            wax_api_caller: self.wax_api_caller.clone(),
        }
    }

    /// Returns the default typed API surface bound to this chain.
    ///
    /// TS NOTE: `chain.api` — the default JSON-RPC namespaces every chain
    /// exposes without `extend`.
    pub fn api(&self) -> DefaultHiveApi {
        DefaultHiveApi::bind(self.json_rpc_caller())
    }

    /// Returns the chain reference data (head-block id and time) anchoring
    /// new transactions, fetched from the node and cached for
    /// [`TAPOS_LIVENESS`] — a burst of transaction creations costs one
    /// `get_dynamic_global_properties` call. The cache lock is held across
    /// the fetch, so concurrent callers wait for the one in flight instead
    /// of fetching again.
    ///
    /// TS NOTE: `acquireChainReferenceData(taposLiveness)`.
    pub(crate) async fn acquire_chain_reference_data(
        &self,
    ) -> Result<ChainReferenceData, WaxChainError> {
        let mut cache = self.tapos_cache.lock().await;

        if let Some(cached) = cache.as_ref() {
            if cached.fetched_at.elapsed() < TAPOS_LIVENESS {
                return Ok(cached.data.clone());
            }
        }

        let properties = self
            .api()
            .database_api
            .get_dynamic_global_properties(Default::default())
            .await?;
        let data = ChainReferenceData {
            time: properties.time,
            head_block_id: properties.head_block_id,
        };

        *cache = Some(TaposCache {
            data: data.clone(),
            fetched_at: Instant::now(),
        });

        Ok(data)
    }
}

// NOTE: Rust has no "extends" — the offline surface is exposed through the
// composed foundation instead: every `WaxFoundation` method is `&self`, so
// `Deref` makes them callable on a chain and lets `&chain` coerce to
// `&WaxFoundation`.
impl Deref for HiveChain {
    type Target = WaxFoundation;

    fn deref(&self) -> &Self::Target {
        &self.foundation
    }
}

fn validate_endpoint(url: &str) -> Result<(), WaxChainError> {
    url::Url::parse(url).map_err(|source| WaxChainError::EndpointParse {
        url: url.to_string(),
        source,
    })?;

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::super::util::test_support::spawn_capture_server;
    use super::*;
    use crate::create_hive_chain;
    use crate::models::basic::HiveDateTime;

    // A real `database_api.get_dynamic_global_properties` payload in its
    // JSON-RPC envelope (see `chain/api/tests.rs`).
    const DGP_RESPONSE: &str = r#"{"jsonrpc":"2.0","id":1,"result":{
        "id": 0,
        "head_block_number": 96549390,
        "head_block_id": "05c1578e0a90cf6de23e3fbd407ba00fedbb1c15",
        "time": "2025-07-08T12:34:57",
        "current_witness": "gtg",
        "total_pow": 514415,
        "num_pow_witnesses": 172,
        "virtual_supply": {"amount": "504726954597", "precision": 3, "nai": "@@000000021"},
        "current_supply": {"amount": "489233021062", "precision": 3, "nai": "@@000000021"},
        "init_hbd_supply": {"amount": "0", "precision": 3, "nai": "@@000000013"},
        "current_hbd_supply": {"amount": "13126252559", "precision": 3, "nai": "@@000000013"},
        "total_vesting_fund_hive": {"amount": "141086068060", "precision": 3, "nai": "@@000000021"},
        "total_vesting_shares": {"amount": "263084307129416595", "precision": 6, "nai": "@@000000037"},
        "pending_rewarded_vesting_shares": {"amount": "365194429725286", "precision": 6, "nai": "@@000000037"},
        "pending_rewarded_vesting_hive": {"amount": "194858873", "precision": 3, "nai": "@@000000021"},
        "hbd_interest_rate": 2000,
        "hbd_print_rate": 10000,
        "maximum_block_size": 65536,
        "current_aslot": 96921594,
        "recent_slots_filled": "340282366920938463463374607431768211455",
        "participation_count": 128,
        "last_irreversible_block_num": 96549371,
        "vote_power_reserve_rate": 10,
        "delegation_return_period": 432000,
        "reverse_auction_seconds": 0,
        "available_account_subsidies": 17017685,
        "hbd_stop_percent": 2000,
        "hbd_start_percent": 1900,
        "next_maintenance_time": "2025-07-08T12:47:40",
        "last_budget_time": "2025-07-08T11:47:40",
        "next_daily_maintenance_time": "2025-07-09T02:07:40",
        "content_reward_percent": 6500,
        "vesting_reward_percent": 1500,
        "proposal_fund_percent": 1000,
        "dhf_interval_ledger": {"amount": "8206", "precision": 3, "nai": "@@000000013"},
        "downvote_pool_percent": 2500,
        "current_remove_threshold": 200,
        "early_voting_seconds": 86400,
        "mid_voting_seconds": 172800,
        "max_consecutive_recurrent_transfer_failures": 10,
        "max_recurrent_transfer_end_date": 730,
        "min_recurrent_transfers_recurrence": 24,
        "max_open_recurrent_transfers": 255
    }}"#;

    // TS NOTE: mirrors `acquireChainReferenceData` — a second call within
    // the liveness window reuses the cached reference data. The capture
    // server is single-shot, so a second fetch would fail with a connection
    // error instead of succeeding.
    #[tokio::test]
    async fn chain_reference_data_is_cached_between_calls() {
        let (endpoint, _captured) = spawn_capture_server(DGP_RESPONSE);

        let chain = create_hive_chain(HiveChainOptions {
            api_endpoint: endpoint,
            ..Default::default()
        })
        .unwrap();

        let first = chain.acquire_chain_reference_data().await.unwrap();
        let second = chain.acquire_chain_reference_data().await.unwrap();

        assert_eq!(
            first.head_block_id,
            "05c1578e0a90cf6de23e3fbd407ba00fedbb1c15"
        );
        assert_eq!(first, second);
    }

    // The cached reference data must expire after `TAPOS_LIVENESS`: a later
    // call goes back to the node (unroutable here, so it errors instead of
    // serving the stale cache).
    #[tokio::test(start_paused = true)]
    async fn chain_reference_data_cache_expires() {
        let chain = create_hive_chain(HiveChainOptions {
            api_endpoint: "http://127.0.0.1:1".into(),
            ..Default::default()
        })
        .unwrap();

        let seeded = ChainReferenceData {
            time: HiveDateTime::parse("2025-07-08T12:34:57").unwrap(),
            head_block_id: "05c1578e0a90cf6de23e3fbd407ba00fedbb1c15".into(),
        };
        *chain.tapos_cache.lock().await = Some(TaposCache {
            data: seeded.clone(),
            fetched_at: Instant::now(),
        });

        let cached = chain.acquire_chain_reference_data().await.unwrap();

        assert_eq!(cached, seeded);

        tokio::time::advance(TAPOS_LIVENESS).await;

        chain.acquire_chain_reference_data().await.unwrap_err();
    }
}
