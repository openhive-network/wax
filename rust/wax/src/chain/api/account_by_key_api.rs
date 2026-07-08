//! DTOs of the `account_by_key_api` namespace.
//!
//! TS NOTE: ported from `ts/wasm/lib/detailed/api/account_by_key_api/`.

use serde::{Deserialize, Serialize};

use crate::models::basic::{AccountName, PublicKey};

/// Represents the parameters of `account_by_key_api.get_key_references`.
#[derive(Debug, Clone, Default, PartialEq, Serialize, Deserialize)]
pub struct GetKeyReferencesRequest {
    pub keys: Vec<PublicKey>,
}

/// Represents the result of `account_by_key_api.get_key_references`: for
/// each requested key, the accounts referencing it.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct GetKeyReferencesResponse {
    pub accounts: Vec<Vec<AccountName>>,
}
