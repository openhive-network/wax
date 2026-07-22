//! Online complex operations: builders resolved against live chain state
//! before they can emit protocol operations.
//!
//! TS NOTE: TS keeps these next to the offline builders in
//! `detailed/complex_operations/`; the Rust port splits them by layer — the
//! offline builders live in [`crate::complex_operations`], the online ones
//! (constructed through `async` chain-bound factories) here.

mod account_update;
mod legacy_vote_operation;

#[cfg(test)]
mod tests;

pub use account_update::{
    AccountAuthorityUpdateOperation, HiveRole, HiveRoleAuthority,
    HiveRoleMemoKey, HiveRoles,
};
pub use legacy_vote_operation::LegacyVoteOperation;
