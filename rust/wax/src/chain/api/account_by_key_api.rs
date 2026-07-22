//! DTOs of the `account_by_key_api` namespace.

use serde::{Deserialize, Serialize};

use crate::hive_api;
use crate::models::basic::{AccountName, PublicKey};

/// `account_by_key_api` JSON-RPC namespace of
/// [`DefaultHiveApi`](super::DefaultHiveApi).
#[hive_api]
pub trait AccountByKeyApi {
    /// Returns, for each given public key, the accounts referencing it.
    async fn get_key_references(
        params: GetKeyReferencesRequest,
    ) -> GetKeyReferencesResponse;
}

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
