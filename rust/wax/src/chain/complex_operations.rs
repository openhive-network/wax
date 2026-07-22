//! Online complex operations: builders resolved against live chain state
//! before they can emit protocol operations.

mod account_update;
mod legacy_vote_operation;

#[cfg(test)]
mod tests;

pub use account_update::{
    AccountAuthorityUpdateOperation, HiveRole, HiveRoleAuthority,
    HiveRoleMemoKey, HiveRoles,
};
pub use legacy_vote_operation::LegacyVoteOperation;
