//! Single-import surface for common wax usage: `use wax::prelude::*;`.
//!
//! Re-exports the factory functions, the types they return (and the traits
//! required to extend the API surface), the options and error types appearing
//! in typical signatures, plus the protocol operation payloads: everything
//! under [`proto`](crate::proto) and the [`proto::operation::Value`] oneof —
//! so operations can be built without a separate `wax::proto::` import.
//! Specialized surfaces (health checking, authority tracing, call
//! descriptors, models) stay behind explicit imports from the crate root.
//!
//! NOTE: the crate types shadow their same-named proto messages here
//! (`Transaction`, `Operation`); the proto mirrors stay reachable through the
//! also-exported `proto` module (`proto::Transaction` / `proto::Operation`).

pub use crate::models::basic::HiveDateTime;
pub use crate::models::enums::EManabarType;
pub use crate::proto::operation::Value;
pub use crate::proto::*;
pub use crate::{
    AuthorityDataProvider, ComplexOperation, HiveChain, HiveChainOptions,
    Manabar, OnlineTransaction, Operation, SignatureProvider, Transaction,
    WaxChainError, WaxError, WaxFoundation, WaxOptions, create_hive_chain,
    create_wax_foundation, hive_api, proto,
};
