use crate::WaxFoundation;

use crate::chain::api::DefaultHiveApi;
use crate::chain::error::WaxChainError;
use crate::chain::extend::HiveApi;
use crate::chain::rest::RestCaller;
use crate::chain::rpc::JsonRpcCaller;

/// Provides online (chain-bound) capabilities on top of [`WaxFoundation`]:
/// endpoint configuration, transport handles and the typed API surfaces
/// bound to them ([`Self::api`] and
/// [`HiveChainExt`](crate::HiveChainExt)). `broadcast`, `create_transaction`
/// and online-only helpers are added in subsequent phases (see
/// `rust/hive.md`).
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

    /// Returns the default typed API surface bound to this chain.
    ///
    /// TS NOTE: `chain.api` — the default JSON-RPC namespaces every chain
    /// exposes without `extend`.
    fn api(&self) -> DefaultHiveApi {
        DefaultHiveApi::bind(self.json_rpc_caller())
    }
}
