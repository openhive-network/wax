//! Typed API extension surface: the `extend` / `extend_rest` entry points
//! binding user-declared API structs to a chain's transports, and the
//! [`define_hive_api!`](crate::define_hive_api) macro generating those
//! structs.

use super::hive_chain::HiveChain;
use super::rpc::JsonRpcCaller;
use super::util::RestCaller;

/// Provides construction of a typed JSON-RPC API surface bound to a chain's
/// transport. Implemented by the structs emitted by
/// [`define_hive_api!`](crate::define_hive_api).
///
/// TS NOTE: the Rust analog of the `YourApi` type parameter of TS
/// `IHiveChainInterface.extend<YourApi>()`.
pub trait HiveApi {
    /// Builds the API surface bound to the given JSON-RPC transport.
    fn bind(caller: JsonRpcCaller) -> Self;
}

/// Provides construction of a typed REST API surface bound to a chain's
/// transport.
///
/// TS NOTE: the Rust analog of the `YourRestApi` type parameter of TS
/// `extendRest<YourRestApi>()`. The macro arm generating REST surfaces is not
/// available yet (it arrives with the `wax-api-macros` proc-macro crate);
/// until then, implement this trait by hand and issue requests through
/// [`RestCaller::call`] with [`RestCallDescriptor`](crate::RestCallDescriptor)
/// values.
pub trait HiveRestApi {
    /// Builds the API surface bound to the given REST transport.
    fn bind(caller: RestCaller) -> Self;
}

/// Provides the generic `extend` / `extend_rest` constructors on every chain.
///
/// TS NOTE: mirrors `IHiveChainInterface.extend<YourApi>()` /
/// `extendRest<YourRestApi>()`. Lives in a non-object-safe extension trait so
/// the generic methods don't break `dyn HiveChain` object safety; the blanket
/// impl makes them callable on every [`HiveChain`], including
/// `Box<dyn HiveChain>`.
///
/// TS NOTE: TS `extend` returns *the chain* widened with an `api` field
/// (`this & { api: ... }`); Rust returns the typed API surface as its own
/// value — the chain and the API handle are separate objects sharing one
/// transport, so a later `set_endpoint_url` on the chain is reflected by
/// handles already handed out.
pub trait HiveChainExt: HiveChain {
    /// Builds the typed JSON-RPC API surface `A` bound to this chain.
    fn extend<A: HiveApi>(&self) -> A {
        A::bind(self.json_rpc_caller())
    }

    /// Builds the typed REST API surface `A` bound to this chain.
    fn extend_rest<A: HiveRestApi>(&self) -> A {
        A::bind(self.rest_caller())
    }
}

impl<T: HiveChain + ?Sized> HiveChainExt for T {}

/// Generates a typed JSON-RPC API surface from a declarative description, for
/// use with [`extend`](crate::HiveChainExt::extend).
///
/// This is the Rust analog of declaring a `YourApi` type for TS
/// `extend<YourApi>()`: it emits one struct per namespace with one `async fn`
/// per method, plus the top-level struct implementing
/// [`HiveApi`](crate::HiveApi). Doc comments are forwarded to the generated
/// items, and every generated struct derives `Clone`.
///
/// The method grammar is `fn <name>(<params type>) -> <result type>;` — the
/// JSON-RPC method name becomes `"<namespace>.<name>"`, the params type must
/// implement `serde::Serialize` and the result type
/// `serde::de::DeserializeOwned`.
///
/// Appending `: Base` after the struct name composes the surface on top of
/// another generated one (e.g. [`DefaultHiveApi`](crate::DefaultHiveApi)):
/// the base's namespaces stay reachable through `Deref`.
///
/// TS NOTE: TS `extend` needs no generated code — it is mapped types over a
/// runtime `Proxy`; Rust generates real structs and methods instead, which
/// also yields IDE completion and hover docs.
///
/// ```no_run
/// use wax::{HiveChainExt, create_hive_chain, define_hive_api};
///
/// define_hive_api! {
///     /// Condenser plugin surface not shipped in the default API set.
///     pub struct CondenserApi {
///         /// `condenser_api` JSON-RPC namespace.
///         condenser_api {
///             /// Returns the number of accounts on the chain.
///             fn get_account_count(Vec<String>) -> u64;
///         }
///     }
/// }
///
/// # async fn demo() -> Result<(), wax::WaxChainError> {
/// let chain = create_hive_chain(None)?;
/// let custom = chain.extend::<CondenserApi>();
/// let count = custom.condenser_api.get_account_count(vec![]).await?;
/// # Ok(())
/// # }
/// ```
#[macro_export]
macro_rules! define_hive_api {
    (
        $(#[$api_meta:meta])*
        $vis:vis struct $api:ident $(: $base:ty)? {
            $(
                $(#[$ns_meta:meta])*
                $ns:ident {
                    $(
                        $(#[$method_meta:meta])*
                        fn $method:ident($params:ty) -> $result:ty;
                    )*
                }
            )*
        }
    ) => {
        $crate::paste::paste! {
            $(#[$api_meta])*
            #[derive(Clone)]
            $vis struct $api {
                $(base: $base,)?
                $(
                    $(#[$ns_meta])*
                    pub $ns: [<$api $ns:camel>],
                )*
            }

            impl $crate::HiveApi for $api {
                fn bind(caller: $crate::JsonRpcCaller) -> Self {
                    Self {
                        $(base: <$base as $crate::HiveApi>::bind(
                            caller.clone(),
                        ),)?
                        $($ns: [<$api $ns:camel>] {
                            caller: caller.clone(),
                        },)*
                    }
                }
            }

            $(
                impl ::core::ops::Deref for $api {
                    type Target = $base;

                    fn deref(&self) -> &Self::Target {
                        &self.base
                    }
                }
            )?

            $(
                #[doc = ::core::concat!(
                    "Represents the `", ::core::stringify!($ns),
                    "` namespace of [`", ::core::stringify!($api), "`]."
                )]
                $(#[$ns_meta])*
                #[derive(Clone)]
                $vis struct [<$api $ns:camel>] {
                    caller: $crate::JsonRpcCaller,
                }

                impl [<$api $ns:camel>] {
                    $(
                        $(#[$method_meta])*
                        pub async fn $method(
                            &self,
                            params: $params,
                        ) -> ::core::result::Result<
                            $result,
                            $crate::WaxChainError,
                        > {
                            self.caller
                                .call(
                                    ::core::concat!(
                                        ::core::stringify!($ns),
                                        ".",
                                        ::core::stringify!($method),
                                    ),
                                    params,
                                )
                                .await
                        }
                    )*
                }
            )*
        }
    };
}

#[cfg(test)]
mod tests {
    use std::sync::Arc;
    use std::time::Duration;

    use serde::{Deserialize, Serialize};
    use serde_json::{Value, json};

    use super::super::rpc::JsonRpcClient;
    use super::super::util::test_support::spawn_capture_server;
    use super::super::util::{RestCallDescriptor, RestCaller};
    use super::*;

    #[derive(Serialize)]
    pub(crate) struct PingRequest {
        token: u32,
    }

    #[derive(Deserialize)]
    pub(crate) struct PingResponse {
        pong: u32,
    }

    crate::define_hive_api! {
        /// Test surface.
        pub(crate) struct TestApi {
            /// Test namespace.
            test_api {
                /// Sends a ping.
                fn ping(PingRequest) -> PingResponse;
            }
        }
    }

    crate::define_hive_api! {
        /// Composed test surface.
        pub(crate) struct ComposedApi: TestApi {
            /// Extra namespace.
            extra_api {
                /// Echoes the params.
                fn echo(Value) -> Value;
            }
        }
    }

    fn caller(endpoint: String) -> JsonRpcCaller {
        JsonRpcCaller::new(Arc::new(
            JsonRpcClient::new(endpoint, Duration::from_secs(5)).unwrap(),
        ))
    }

    // TS NOTE: mirrors `ts/wasm/__tests__/detailed/hive_chain.ts` ('Should be
    // able to extend hive chain interface by custom definitions using
    // interfaces only') — a generated method must post a `"<ns>.<method>"`
    // JSON-RPC envelope and decode the typed result.
    #[tokio::test]
    async fn generated_method_posts_namespaced_json_rpc_call() {
        let (endpoint, captured) = spawn_capture_server(
            r#"{"jsonrpc":"2.0","id":1,"result":{"pong":7}}"#,
        );

        let api = TestApi::bind(caller(endpoint));
        let response =
            api.test_api.ping(PingRequest { token: 7 }).await.unwrap();

        assert_eq!(response.pong, 7);

        let raw = captured.recv().unwrap();
        let body_start = raw.find("\r\n\r\n").unwrap() + 4;
        let body: Value = serde_json::from_str(&raw[body_start..]).unwrap();

        assert_eq!(body["jsonrpc"], "2.0");
        assert_eq!(body["method"], "test_api.ping");
        assert_eq!(body["params"], json!({ "token": 7 }));
    }

    // The `: Base` composition arm — own namespaces work and base namespaces
    // stay reachable through the generated `Deref` (the Rust analog of the
    // TS `&` intersection).
    #[tokio::test]
    async fn composed_api_exposes_own_and_base_namespaces() {
        let (endpoint, captured) = spawn_capture_server(
            r#"{"jsonrpc":"2.0","id":1,"result":"marco"}"#,
        );

        let api = ComposedApi::bind(caller(endpoint));
        let echoed: Value = api.extra_api.echo(json!("marco")).await.unwrap();

        assert_eq!(echoed, json!("marco"));
        assert!(
            captured
                .recv()
                .unwrap()
                .contains(r#""method":"extra_api.echo""#)
        );

        // The capture server is single-shot; the base namespace hit through
        // `Deref` needs its own binding.
        let (endpoint, captured) = spawn_capture_server(
            r#"{"jsonrpc":"2.0","id":1,"result":{"pong":1}}"#,
        );

        let api = ComposedApi::bind(caller(endpoint));
        api.test_api.ping(PingRequest { token: 1 }).await.unwrap();

        assert!(
            captured
                .recv()
                .unwrap()
                .contains(r#""method":"test_api.ping""#)
        );
    }

    // `extend` must resolve on `Box<dyn HiveChain>` via the blanket impl.
    #[tokio::test]
    async fn extends_chain_trait_object() {
        let (endpoint, _captured) = spawn_capture_server(
            r#"{"jsonrpc":"2.0","id":1,"result":{"pong":3}}"#,
        );

        let chain = crate::create_hive_chain(crate::WaxChainOptions {
            api_endpoint: endpoint,
            ..Default::default()
        })
        .unwrap();

        let api = chain.extend::<TestApi>();
        let response =
            api.test_api.ping(PingRequest { token: 3 }).await.unwrap();

        assert_eq!(response.pong, 3);
    }

    struct RawRestApi {
        caller: RestCaller,
    }

    impl HiveRestApi for RawRestApi {
        fn bind(caller: RestCaller) -> Self {
            Self { caller }
        }
    }

    // Until the proc-macro REST arm lands, `extend_rest` binds hand-written
    // surfaces driving `RestCaller` with descriptors.
    #[tokio::test]
    async fn extends_chain_with_hand_written_rest_surface() {
        let (endpoint, captured) = spawn_capture_server(r#"{"block_num":42}"#);

        let chain = crate::create_hive_chain(crate::WaxChainOptions {
            rest_api_endpoint: endpoint,
            ..Default::default()
        })
        .unwrap();

        const HEADBLOCK: RestCallDescriptor = RestCallDescriptor {
            method: "GET",
            path_template: "/hafah-api/headblock",
            namespace_path: &["hafah_api", "headblock"],
        };

        let rest = chain.extend_rest::<RawRestApi>();
        let result: Value = rest.caller.call(&HEADBLOCK, ()).await.unwrap();

        assert_eq!(result["block_num"], 42);
        assert!(
            captured
                .recv()
                .unwrap()
                .starts_with("GET /hafah-api/headblock")
        );
    }
}
