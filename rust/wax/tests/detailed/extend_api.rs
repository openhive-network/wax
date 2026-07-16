// Exercises the `extend` / `extend_rest` surface from an external crate — the
// same view user code gets (`#[hive_api]` emits `::wax::` paths, which
// resolve differently here than in the in-crate unit tests). The chain points
// at an unroutable endpoint: each call must reach the transport and fail
// there, proving the whole binding chain without a live node (the wire
// behavior is covered by the in-crate unit tests against a capture server).

use serde::{Deserialize, Serialize};

use wax::{
    HiveChain, HiveChainOptions, WaxChainError, create_hive_chain, hive_api,
};

#[derive(Serialize)]
pub struct PingRequest {
    pub token: u32,
}

#[derive(Deserialize)]
pub struct PingResponse {}

/// Custom namespace surface as a user crate would declare it.
#[hive_api]
pub trait CustomApi {
    /// Sends a ping.
    async fn ping(params: PingRequest) -> PingResponse;
}

/// Custom REST surface as a user crate would declare it.
#[hive_api(rest)]
pub trait HafahApi {
    /// Returns the head block.
    #[get("/hafah-api/headblock")]
    async fn headblock() -> serde_json::Value;
}

/// Custom surface composed on top of the default one.
#[hive_api]
pub struct ExtendedApi {
    pub custom_api: CustomApi,
    #[hive_api(base)]
    base: wax::DefaultHiveApi,
}

fn unroutable_chain() -> HiveChain {
    create_hive_chain(HiveChainOptions {
        api_endpoint: "http://127.0.0.1:1".into(),
        rest_api_endpoint: "http://127.0.0.1:1".into(),
        ..Default::default()
    })
    .unwrap()
}

#[tokio::test]
async fn extend_binds_custom_api_to_the_chain_transport() {
    let chain = unroutable_chain();
    let api = chain.extend::<CustomApi>();

    let result = api.ping(PingRequest { token: 1 }).await;

    assert!(matches!(result, Err(WaxChainError::Request(_))));
}

#[tokio::test]
async fn composed_api_reaches_default_namespaces_through_deref() {
    let chain = unroutable_chain();
    let api = chain.extend::<ExtendedApi>();

    // Own namespace...
    assert!(api.custom_api.ping(PingRequest { token: 1 }).await.is_err());
    // ...and a `DefaultHiveApi` namespace through `Deref`.
    assert!(
        api.database_api
            .get_dynamic_global_properties(Default::default())
            .await
            .is_err()
    );
}

#[tokio::test]
async fn chain_api_exposes_default_namespaces() {
    let chain = unroutable_chain();

    let result = chain
        .api()
        .block_api
        .get_block(wax::api::GetBlockRequest { block_num: 1 })
        .await;

    assert!(result.is_err());
}

#[tokio::test]
async fn extend_rest_binds_generated_rest_surface() {
    let chain = unroutable_chain();
    let rest = chain.extend_rest::<HafahApi>();

    let result = rest.headblock().await;

    assert!(matches!(result, Err(WaxChainError::Request(_))));
}
