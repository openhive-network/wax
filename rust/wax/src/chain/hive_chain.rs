use crate::WaxFoundation;

use crate::chain::api::DefaultHiveApi;
use crate::chain::error::WaxChainError;
use crate::chain::extend::HiveApi;
use crate::chain::options::WaxChainOptions;
use crate::chain::rest::RestCaller;
use crate::chain::rpc::JsonRpcCaller;

/// Provides online (chain-bound) capabilities on top of [`WaxFoundation`]:
/// endpoint configuration, transport handles and the typed API surfaces
/// bound to them ([`Self::api`] and
/// [`HiveChainExt`](crate::HiveChainExt), which also hosts the online-only
/// helpers — the `create_transaction` factory, `broadcast` and the
/// per-account manabar accessors).
///
/// TS NOTE: TypeScript `IHiveChainInterface` extends `IWaxBaseInterface` and
/// exposes the same surface — Rust mirrors that via the [`WaxFoundation`]
/// supertrait bound, so chain instances can be passed wherever a foundation
/// is expected.
pub trait HiveChain: WaxFoundation {
    /// Returns the JSON-RPC endpoint currently used for chain calls.
    fn endpoint_url(&self) -> String;

    /// Replaces the JSON-RPC endpoint at runtime. Mirrors TS
    /// `endpointUrl` setter and Python `endpoint_url` setter.
    fn set_endpoint_url(&self, url: &str) -> Result<(), WaxChainError>;

    /// Returns the REST API endpoint currently used.
    fn rest_endpoint_url(&self) -> String;

    /// Replaces the REST API endpoint at runtime.
    fn set_rest_endpoint_url(&self, url: &str) -> Result<(), WaxChainError>;

    /// Returns a cloneable handle to this chain's JSON-RPC transport, used
    /// to bind typed API surfaces to the chain (see
    /// [`HiveChainExt`](crate::HiveChainExt)).
    fn json_rpc_caller(&self) -> JsonRpcCaller;

    /// Returns a cloneable handle to this chain's REST transport, used to
    /// bind typed REST API surfaces to the chain (see
    /// [`HiveChainExt`](crate::HiveChainExt)).
    fn rest_caller(&self) -> RestCaller;

    /// Returns a snapshot of the chain's current configuration: the chain id,
    /// the live endpoints and the construction-time transport settings.
    ///
    /// TS NOTE: with [`create_hive_chain`](crate::create_hive_chain) and
    /// struct-update syntax this covers `IHiveChainInterface.extendConfig` —
    /// deriving a chain with selectively overridden options:
    /// `create_hive_chain(WaxChainOptions { api_timeout_ms: 5_000,
    /// ..chain.options() })`. TS additionally links the derived chain back to
    /// its originator (endpoint changes propagate up); the Rust copies are
    /// independent.
    fn options(&self) -> WaxChainOptions;

    /// Returns the default typed API surface bound to this chain.
    ///
    /// TS NOTE: `chain.api` — the default JSON-RPC namespaces every chain
    /// exposes without `extend`.
    fn api(&self) -> DefaultHiveApi {
        DefaultHiveApi::bind(self.json_rpc_caller())
    }
}
