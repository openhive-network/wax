//! Single-import surface for common wax usage: `use wax::prelude::*;`.
//!
//! Re-exports the factory functions, the types they return (and the traits
//! required to extend the API surface), the options and error types appearing
//! in typical signatures, the complex and hive-apps operation builders, the
//! asset and authority models with the well-known chain constants, plus the
//! protocol operation payloads: everything under [`proto`](crate::proto) and
//! the [`proto::operation::Value`] oneof — so operations can be built without
//! a separate `wax::proto::` import. The [`api`](crate::api) module rides
//! along for the request/response types of the default API surface
//! (`api::FindAccountsRequest`, ...). Specialized surfaces (health checking,
//! authority tracing, call descriptors, the remaining models) stay behind
//! explicit imports from the crate root.
//!
//! NOTE: the crate types shadow their same-named proto messages here
//! (`Transaction`, `Operation`); the proto mirrors stay reachable through the
//! also-exported `proto` module (`proto::Transaction` / `proto::Operation`).

pub use crate::api;
pub use crate::complex_operations::*;
pub use crate::constants::MAINNET_CHAIN_ID;
pub use crate::hive_apps_operations::{
    AvailableCommunityRoles, CommunityOperation, CommunityOperationActions,
    CommunityProps, FollowActions, FollowBlogAction, FollowOperation,
    FollowOperationActions, HiveAppsOperation, HiveAppsOperationBase,
    ResourceCreditsOperation, SupportedLanguages,
};
pub use crate::models::{
    AccountAuthorityInfo, AssetAmount, AssetName, Authorities, HiveDateTime,
    ManabarData, ManabarType, NaiAsset, NaiAssetConvertible,
    RequiredAuthorities, WaxAuthority,
};
pub use crate::proto::operation::Value;
pub use crate::proto::*;
pub use crate::{
    AuthorityDataProvider, ComplexOperation, HiveChain, HiveChainOptions,
    Manabar, OnlineTransaction, Operation, SignatureProvider, Transaction,
    WaxChainError, WaxError, WaxFoundation, WaxOptions, create_hive_chain,
    create_wax_foundation, hive_api, proto,
};

#[cfg(test)]
mod tests {
    use super::*;

    // Compile-time smoke test: the commonly-used names must resolve through
    // the prelude alone — a dropped re-export or an ambiguous glob (e.g. a
    // future proto message clashing with a builder name) fails right here.
    #[test]
    fn common_names_resolve_through_the_prelude() {
        fn resolves<T: ?Sized>() {}

        resolves::<NaiAsset>();
        resolves::<NaiAssetConvertible>();
        resolves::<AssetName>();
        resolves::<AssetAmount>();
        resolves::<ManabarData>();
        resolves::<Authorities>();
        resolves::<AccountAuthorityInfo>();
        resolves::<RequiredAuthorities>();
        resolves::<WaxAuthority>();
        resolves::<BlogPostOperation>();
        resolves::<ReplyOperation>();
        resolves::<WitnessSetPropertiesOperation>();
        resolves::<FollowOperation>();
        resolves::<CommunityOperation>();
        resolves::<ResourceCreditsOperation>();
        resolves::<AccountAuthorityUpdateOperation>();
        resolves::<HiveRole>();
        resolves::<HiveRoles<'static>>();
        resolves::<LegacyVoteOperation>();
        resolves::<api::FindAccountsRequest>();

        assert_eq!(MAINNET_CHAIN_ID.len(), 64);
    }
}
