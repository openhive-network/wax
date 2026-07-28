//! Rust port of the TS detailed test suite
//! (`ts/wasm/__tests__/detailed/*.ts`). One module per TS file, matching
//! name where a counterpart exists.
//!
//! TS files without a module here and where their coverage lives:
//! - `base.ts` — WASM/emscripten plumbing (browser boot, C++ exception
//!   propagation, `getExceptionMessage`); the portable members are covered
//!   by `protocol.rs` (witness-props round trip, key math) and
//!   `hive_base.rs` (public-key derivation + invalid-WIF error).
//! - `protocol_benchmarks.ts` — performance benchmarks over the same calls
//!   `protocol.rs` already asserts; benchmarking is out of scope for this
//!   suite.
//! - `utils.ts` — ported as unit tests in `src/chain/rest/query_string.rs`.
//! - `wax_api_caller_header.ts` — ported as unit tests in
//!   `src/chain/transport/request_helper.rs`.
//! - `hive_chain_rest_api.ts` — ported into `extend_api.rs` (see its header
//!   for the TS-only members).

// The account fixture in `formatters.rs` nests deeper than serde_json's
// `json!` fits into the default limit.
#![recursion_limit = "256"]

mod common;
mod complex_operations;
mod custom_chain_online_tx;
mod custom_jsons;
mod encrypted_operations;
mod encryption_data;
mod extend_api;
mod formatters;
mod healthchecks;
mod hive_assertion;
mod hive_base;
mod hive_chain;
mod hive_chain_custom_opts;
mod interceptor;
mod mock_base;
mod non_encrypted_operations;
mod online_transaction;
mod protocol;
mod regression_hive_operations;
mod signers_beekeeper;
