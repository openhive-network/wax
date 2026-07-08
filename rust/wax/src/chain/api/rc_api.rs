//! DTOs of the `rc_api` namespace.
//!
//! TS NOTE: ported from `ts/wasm/lib/detailed/api/rc_api/`.

use serde::{Deserialize, Serialize};

use crate::hive_api;
use crate::models::asset::NaiAsset;
use crate::models::basic::AccountName;

use super::types::{ApiManabar, NumberOrString};

/// `rc_api` JSON-RPC namespace of [`DefaultHiveApi`](super::DefaultHiveApi).
#[hive_api]
pub trait RcApi {
    /// Returns the resource-credit state of the requested accounts.
    async fn find_rc_accounts(
        params: FindRcAccountsRequest,
    ) -> FindRcAccountsResponse;
}

/// Represents the parameters of `rc_api.find_rc_accounts`.
#[derive(Debug, Clone, Default, PartialEq, Serialize, Deserialize)]
pub struct FindRcAccountsRequest {
    pub accounts: Vec<AccountName>,
}

/// Represents the result of `rc_api.find_rc_accounts`.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct FindRcAccountsResponse {
    pub rc_accounts: Vec<RcAccount>,
}

/// Represents an account's resource-credit state.
///
/// TS NOTE: `RcAccount`.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct RcAccount {
    pub account: AccountName,
    pub rc_manabar: ApiManabar,
    pub max_rc_creation_adjustment: NaiAsset,
    pub max_rc: NumberOrString,
}
