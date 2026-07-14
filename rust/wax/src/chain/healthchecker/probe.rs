//! A ready-to-register health check: transport type, logical paths and the
//! typed probe bundled into one value.
//!
//! TS NOTE: TS `register(endpointToCheck, toSend, ...)` reflects the
//! transport and paths off the passed proxy method and closes over `toSend`
//! itself; Rust has no reflection, so [`ApiProbe`] carries the same three
//! things explicitly. The `<method>_probe` constructors emitted by
//! [`#[hive_api]`](crate::hive_api) build it from a call descriptor in one
//! move — [`ApiProbe::new`] covers everything else.

use std::future::Future;
use std::pin::Pin;
use std::sync::Arc;

use serde::Serialize;
use serde::de::DeserializeOwned;

use crate::chain::error::WaxChainError;
use crate::chain::rest::{RestCallDescriptor, RestCaller};
use crate::chain::rpc::{JsonRpcCallDescriptor, JsonRpcCaller};
use crate::chain::util::DetailedResponseData;

use super::errors::ChainApiType;

/// Represents a health check ready for
/// [`HealthChecker::register`](super::HealthChecker::register): which
/// transport it belongs to, the logical API paths it covers and the typed
/// probe calling the method against a given node URL.
///
/// `R` is the decoded response type a validator inspects
/// ([`HealthChecker::register_with_validator`](super::HealthChecker::register_with_validator)).
pub struct ApiProbe<R> {
    pub(super) api_caller_id: ChainApiType,
    pub(super) paths: Vec<String>,
    pub(super) probe: TypedProbeFn<R>,
}

/// Represents the typed probe: calls one API method against the given node
/// URL, returning the decoded response and the raw response data.
pub(super) type TypedProbeFn<R> =
    Box<dyn Fn(String) -> TypedProbeFuture<R> + Send + Sync>;

/// Represents the boxed future a typed probe call resolves to.
pub(super) type TypedProbeFuture<R> = Pin<
    Box<
        dyn Future<Output = Result<(R, DetailedResponseData), WaxChainError>>
            + Send,
    >,
>;

impl<R> ApiProbe<R> {
    /// Builds a probe from an arbitrary async closure — the escape hatch for
    /// checks no generated constructor covers. `probe` receives the node URL
    /// under test; route the call through
    /// [`JsonRpcCaller::call_at`] / [`RestCaller::call_at`] so the returned
    /// [`DetailedResponseData`] carries real timings.
    pub fn new<P, F>(
        api_caller_id: ChainApiType,
        paths: Vec<String>,
        probe: P,
    ) -> Self
    where
        P: Fn(String) -> F + Send + Sync + 'static,
        F: Future<Output = Result<(R, DetailedResponseData), WaxChainError>>
            + Send
            + 'static,
    {
        Self {
            api_caller_id,
            paths,
            probe: Box::new(move |url| Box::pin(probe(url))),
        }
    }

    /// Builds a probe calling the JSON-RPC method described by `descriptor`
    /// with `params` through [`JsonRpcCaller::call_at`].
    ///
    /// TS NOTE: what TS `register` assembles from the proxied method +
    /// `toSend`; the descriptor is the `#[hive_api]`-emitted const.
    pub fn json_rpc<P>(
        caller: JsonRpcCaller,
        descriptor: JsonRpcCallDescriptor,
        params: P,
    ) -> Self
    where
        P: Serialize + Send + Sync + 'static,
        R: DeserializeOwned + Send + 'static,
    {
        let params = Arc::new(params);
        let probe: TypedProbeFn<R> = Box::new(move |url| {
            let caller = caller.clone();
            let params = Arc::clone(&params);

            Box::pin(async move {
                caller.call_at(&url, descriptor.method, &*params).await
            })
        });

        Self {
            api_caller_id: ChainApiType::JsonRpc,
            paths: to_paths(descriptor.namespace_path),
            probe,
        }
    }

    /// Builds a probe calling the REST method described by `descriptor`
    /// with `params` through [`RestCaller::call_at`].
    pub fn rest<P>(
        caller: RestCaller,
        descriptor: RestCallDescriptor,
        params: P,
    ) -> Self
    where
        P: Serialize + Send + Sync + 'static,
        R: DeserializeOwned + Send + 'static,
    {
        let params = Arc::new(params);
        let probe: TypedProbeFn<R> = Box::new(move |url| {
            let caller = caller.clone();
            let params = Arc::clone(&params);

            Box::pin(async move {
                caller.call_at(&url, &descriptor, &*params).await
            })
        });

        Self {
            api_caller_id: ChainApiType::Rest,
            paths: to_paths(descriptor.namespace_path),
            probe,
        }
    }
}

/// Converts a descriptor's static namespace path into the owned paths the
/// health checker stores.
fn to_paths(namespace_path: &[&str]) -> Vec<String> {
    namespace_path.iter().map(ToString::to_string).collect()
}
