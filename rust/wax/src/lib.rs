//! Hive blockchain library: transaction building, operation construction,
//! asset math, authority handling and validation, plus chain-bound operations
//! over JSON-RPC/REST endpoints.
//!
//! The offline entry point is [`create_wax_foundation`], which returns a
//! [`WaxFoundation`] exposing the offline API surface. The online entry point
//! is [`create_hive_chain`], which returns a [`HiveChain`] that also
//! implements [`WaxFoundation`].

// NOTE: `mod core` shadows the built-in `core` crate in this root module;
// always write `crate::core::...` (never bare `core::...`) in this file.
#[doc(hidden)]
pub mod core;

mod base;
mod chain;

pub use crate::core::proto;
pub use crate::core::transaction_to_canonical_json;
pub use base::{
    AuthorityDataProvider, Manabar, ManabarData, Operation, OperationBuilder,
    SignatureProvider, Transaction, WaxError, WaxFoundation, WaxOptions,
    complex_operations, constants, create_wax_foundation, hive_apps_operations,
    models, result,
};
pub use chain::{
    AuthorityEntryProcessingStatus, AuthorityPathEntry, AuthorityPathTraceData,
    AuthorityRole, AuthorityTrace, AuthorityTraceSignatureInfo, ChainApiType,
    EndpointInfo, ErrorReason, HealthCheckerError, HiveChain, HiveEndpoint,
    HiveEndpointData, HiveEndpointDataDown, HiveEndpointDataUp, NewBestEvent,
    NewUpDownEvent, OnlineTransaction, ProcessedEntry, RequestError,
    WaxChainError, WaxChainOptions, create_hive_chain,
};
