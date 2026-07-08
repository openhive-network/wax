// Exercises the `extend` / `extend_rest` surface from an external crate — the
// same view user code gets (`$crate` inside `define_hive_api!` expands to
// `::wax` here, unlike the in-crate unit tests). The chain points at an
// unroutable endpoint: each call must reach the transport and fail there,
// proving the whole binding chain without a live node (the wire behavior is
// covered by the in-crate unit tests against a capture server).

use serde::{Deserialize, Serialize};

use wax::{
    HiveChain, HiveChainExt, HiveRestApi, RestCallDescriptor, RestCaller,
    WaxChainError, WaxChainOptions, create_hive_chain,
};

#[derive(Serialize)]
pub struct PingRequest {
    pub token: u32,
}

#[derive(Deserialize)]
pub struct PingResponse {}

wax::define_hive_api! {
    /// Custom surface as a user crate would declare it.
    pub struct CustomApi {
        /// `custom_api` JSON-RPC namespace.
        custom_api {
            /// Sends a ping.
            fn ping(PingRequest) -> PingResponse;
        }
    }
}

wax::define_hive_api! {
    /// Custom surface composed on top of the default one.
    pub struct ExtendedApi: wax::DefaultHiveApi {
        /// `custom_api` JSON-RPC namespace.
        custom_api {
            /// Sends a ping.
            fn ping(PingRequest) -> PingResponse;
        }
    }
}

fn unroutable_chain() -> Box<dyn HiveChain> {
    create_hive_chain(WaxChainOptions {
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

    let result = api.custom_api.ping(PingRequest { token: 1 }).await;

    assert!(matches!(result, Err(WaxChainError::Http(_))));
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

struct HeadBlockRestApi {
    caller: RestCaller,
}

impl HiveRestApi for HeadBlockRestApi {
    fn bind(caller: RestCaller) -> Self {
        Self { caller }
    }
}

#[tokio::test]
async fn extend_rest_binds_hand_written_surface() {
    const HEADBLOCK: RestCallDescriptor = RestCallDescriptor {
        method: "GET",
        path_template: "/hafah-api/headblock",
        namespace_path: &["hafah_api", "headblock"],
    };

    let chain = unroutable_chain();
    let rest = chain.extend_rest::<HeadBlockRestApi>();

    let result: Result<serde_json::Value, _> =
        rest.caller.call(&HEADBLOCK, ()).await;

    assert!(matches!(result, Err(WaxChainError::Request(_))));
}
