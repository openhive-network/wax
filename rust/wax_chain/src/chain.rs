use wax::WaxFoundation;

use crate::error::WaxChainError;

/// Provides online (chain-bound) capabilities on top of [`WaxFoundation`].
///
/// Phase 1 surface: just endpoint URL get/set. API namespaces, `broadcast`,
/// `create_transaction`, and online-only helpers are added in subsequent
/// phases (see `rust/hive.md`).
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
}
