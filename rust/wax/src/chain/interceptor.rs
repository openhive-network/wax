//! Runtime request/response callbacks run around every HTTP request the
//! chain makes (JSON-RPC, REST, health-check probes).
//!
//! TS NOTE: ported from the user `requestInterceptor` / `responseInterceptor`
//! pair of `ts/wasm/lib/detailed/util/api_caller.ts`, installed via
//! `chain.withProxy` (`chain_api.ts:122`):
//!
//! | TS | Rust |
//! |----|------|
//! | `requestInterceptor(data) => IRequestOptions` | [`RequestInterceptor`] |
//! | `responseInterceptor(data, requestData) => IDetailedResponseData` | [`ResponseInterceptor`] |
//! | `apiCallerId` (`EChainApiType`) | [`InterceptorRequestOptions::caller`] |
//! | interceptor throws → call promise rejects | `Err` → `RequestError::Interceptor` |
//! | identity-function defaults | `None` fields on [`HiveChainOptions`] |
//! | static interceptor pair (JSON-RPC envelope) | replaced by the dedicated `JsonRpcClient` |
//! | health checker's `withProxy` endpoint rewrite | replaced by `call_at` |
//!
//! The request callback receives the wax-level [`RequestOptions`] *before*
//! any HTTP assembly — the same visibility TS interceptors have — and its
//! return value drives the request. The response callback runs on the
//! success path *after* the body is decoded and the timings are stamped, so
//! decoded-response transformation is supported: the returned
//! [`DetailedResponseData`] is what the typed engines parse.
//!
//! Both callbacks also run for health-check probes (`call_at`) —
//! deliberate, so e.g. an injected auth header reaches probes too.
//!
//! Callbacks are sync (TS parity) — no async work inside; refresh tokens
//! out-of-band and read a cached value in the callback instead. Retries and
//! short-circuiting are out of scope: callbacks observe and transform, they
//! do not wrap the send. Composing several concerns is closure composition
//! by hand: `move |o| second(first(o)?)`.
//!
//! # Examples
//!
//! Auth-header injection plus logging:
//!
//! ```
//! use wax::{HiveChainOptions, create_hive_chain};
//!
//! # fn main() -> Result<(), wax::WaxChainError> {
//! let chain = create_hive_chain(
//!     HiveChainOptions::default()
//!         .with_request_interceptor(|mut data| {
//!             // `extra_headers` is a deliberate Rust extension: TS
//!             // `IRequestOptions` models no arbitrary headers, so a TS
//!             // interceptor has nowhere to put an `Authorization` header.
//!             data.options
//!                 .extra_headers
//!                 .push(("authorization".into(), "Bearer s3cr3t".into()));
//!             println!(
//!                 "[wax] {:?} {} {}",
//!                 data.caller, data.options.method, data.options.endpoint
//!             );
//!
//!             Ok(data.options)
//!         })
//!         .with_response_interceptor(|data, request| {
//!             // Decoded body and timings are already populated here.
//!             println!(
//!                 "[wax] {:?} <- status {:?}",
//!                 request.caller, data.status
//!             );
//!
//!             Ok(data)
//!         }),
//! )?;
//! # Ok(())
//! # }
//! ```
//!
//! Capturing a request field through shared state — spelled out explicitly
//! once, then with the [`capture!`](crate::capture) sugar:
//!
//! ```
//! use std::sync::{Arc, Mutex};
//!
//! use wax::HiveChainOptions;
//! use wax::capture;
//!
//! let seen: Arc<Mutex<Option<String>>> = Arc::new(Mutex::new(None));
//!
//! // Explicit expansion: clone the handle, move the clone in.
//! let options = HiveChainOptions::default().with_request_interceptor({
//!     let seen = Arc::clone(&seen);
//!     move |data| {
//!         *seen.lock().unwrap() = data.options.wax_api_caller.clone();
//!
//!         Ok(data.options)
//!     }
//! });
//!
//! // The same, via the macro.
//! let options = HiveChainOptions::default().with_request_interceptor(
//!     capture!([seen] |data| {
//!         *seen.lock().unwrap() = data.options.wax_api_caller.clone();
//!
//!         Ok(data.options)
//!     }),
//! );
//! ```
//!
//! [`HiveChainOptions`]: crate::chain::HiveChainOptions

use std::sync::Arc;

use crate::chain::util::{DetailedResponseData, RequestOptions};

/// Represents a failure returned by an interceptor callback.
///
/// TS NOTE: the counterpart of a TS interceptor throwing; carried by
/// `RequestError::Interceptor`.
pub type InterceptorError = Box<dyn std::error::Error + Send + Sync>;

/// Represents the request callback: runs before the HTTP request is
/// assembled; the [`RequestOptions`] it returns drive the request. An `Err`
/// fails the call before anything is sent.
///
/// TS NOTE: `TRequestInterceptor`.
pub type RequestInterceptor = Arc<
    dyn Fn(
            InterceptorRequestOptions,
        ) -> Result<RequestOptions, InterceptorError>
        + Send
        + Sync,
>;

/// Represents the response callback: runs on the success path after the
/// response body is decoded, together with the request it answers; the
/// [`DetailedResponseData`] it returns is what the caller sees. An `Err`
/// discards the response and fails the call.
///
/// TS NOTE: `TResponseInterceptor` — TS runs it on the resolved request
/// only, and its return feeds the engine likewise.
pub type ResponseInterceptor = Arc<
    dyn Fn(
            DetailedResponseData,
            &InterceptorRequestOptions,
        ) -> Result<DetailedResponseData, InterceptorError>
        + Send
        + Sync,
>;

/// Represents the request options handed to a request interceptor,
/// extended with originator info.
///
/// TS NOTE: `TInterceptorRequestOptions = IRequestOptions & { paths;
/// apiCallerId }`. `paths` is not ported.
pub struct InterceptorRequestOptions {
    pub options: RequestOptions,
    pub caller: ApiCallerKind,
}

/// Represents which transport originated a request.
///
/// TS NOTE: `apiCallerId` (`EChainApiType`).
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ApiCallerKind {
    JsonRpc,
    Rest,
}

/// Clones the listed [`Arc`] handles, then builds a `move` closure
/// capturing the clones — the originals stay usable at the call site.
/// Pinned to `Arc::clone`, so misuse on a deep-clonable type is a compile
/// error: the expansion is only ever a refcount bump.
///
/// The matcher covers plain argument lists only (no typed arguments, no
/// return-type annotation) — `with_request_interceptor` /
/// `with_response_interceptor` fix the closure type and inference fills
/// the rest.
///
/// TS NOTE: no counterpart needed in TS — JS closures capture variables by
/// GC-managed reference, which is what the `Arc::clone` + `move` expansion
/// reproduces explicitly.
///
/// # Examples
///
/// Multiple handles and a trailing comma expand:
///
/// ```
/// use std::sync::{Arc, Mutex};
///
/// use wax::capture;
///
/// let count = Arc::new(Mutex::new(0));
/// let log = Arc::new(Mutex::new(String::new()));
///
/// let record = capture!([count, log,] |tag| {
///     *count.lock().unwrap() += 1;
///     log.lock().unwrap().push_str(tag);
/// });
///
/// record("a");
/// record("b");
///
/// // The originals stayed usable at the call site.
/// assert_eq!(*count.lock().unwrap(), 2);
/// assert_eq!(*log.lock().unwrap(), "ab");
/// ```
#[macro_export]
macro_rules! capture {
    ([$($var:ident),+ $(,)?] |$($arg:pat_param),*| $body:expr) => {{
        $(let $var = ::std::sync::Arc::clone(&$var);)+
        move |$($arg),*| $body
    }};
}
