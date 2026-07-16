//! The online chain type: [`HiveChain`], created by
//! [`create_hive_chain`](crate::create_hive_chain).

use std::ops::Deref;
use std::sync::Arc;

use crate::WaxFoundation;
use crate::create_wax_foundation;

use crate::WaxOptions;
use crate::chain::api::DefaultHiveApi;
use crate::chain::error::WaxChainError;
use crate::chain::extend::HiveApi;
use crate::chain::options::HiveChainOptions;
use crate::chain::rest::{RestCaller, RestClient};
use crate::chain::rpc::{JsonRpcCaller, JsonRpcClient};

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
