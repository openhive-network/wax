//! Single-import surface for common wax usage: `use wax::prelude::*;`.
//!
//! Re-exports the factory functions, the types they return (and the traits
//! required to extend the API surface), plus the options and error types
//! appearing in typical signatures. Specialized surfaces (health checking,
//! authority tracing, call descriptors, models) stay behind explicit imports
//! from the crate root.

pub use crate::{
    HiveChain, HiveChainOptions, Manabar, OnlineTransaction, Operation,
    OperationBuilder, Transaction, WaxChainError, WaxError, WaxFoundation,
    WaxOptions, create_hive_chain, create_wax_foundation, hive_api,
};
