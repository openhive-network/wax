//! Broadcast input forms: the [`Broadcastable`] trait accepted by
//! [`HiveChainExt::broadcast`](crate::HiveChainExt::broadcast).

use crate::Transaction;

use crate::chain::api::ApiTransaction;
use crate::chain::error::WaxChainError;
use crate::chain::online_transaction::OnlineTransaction;

/// Provides conversion of a transaction form into the wire form
/// [`HiveChainExt::broadcast`](crate::HiveChainExt::broadcast) posts, running
/// any pre-broadcast checks the form implies.
///
/// TS NOTE: models the `ApiTransaction | ITransaction | IOnlineTransaction`
/// union parameter of TS `IHiveChainInterface.broadcast`.
#[allow(async_fn_in_trait)]
pub trait Broadcastable {
    /// Converts the transaction into its API wire form, running the form's
    /// pre-broadcast checks.
    async fn to_broadcast_form(&self)
    -> Result<ApiTransaction, WaxChainError>;
}

/// TS NOTE: an [`ApiTransaction`] (e.g. fetched from the block API) is
/// broadcast as-is.
impl Broadcastable for ApiTransaction {
    async fn to_broadcast_form(
        &self,
    ) -> Result<ApiTransaction, WaxChainError> {
        Ok(self.clone())
    }
}

/// TS NOTE: the `"toApiJson" in transaction` branch — an offline transaction
/// is converted to its HF26 API form, with no on-chain checks.
impl Broadcastable for Transaction {
    async fn to_broadcast_form(
        &self,
    ) -> Result<ApiTransaction, WaxChainError> {
        api_form(self.to_api()?)
    }
}

/// TS NOTE: the `"performOnChainVerification" in transaction` branch — an
/// online transaction additionally runs
/// [`OnlineTransaction::perform_on_chain_verification`] before broadcast.
impl Broadcastable for OnlineTransaction {
    async fn to_broadcast_form(
        &self,
    ) -> Result<ApiTransaction, WaxChainError> {
        let form = api_form(self.to_api()?)?;
        self.perform_on_chain_verification().await?;

        Ok(form)
    }
}

/// Parses a transaction's HF26 API JSON into the typed request form.
fn api_form(json: String) -> Result<ApiTransaction, WaxChainError> {
    Ok(serde_json::from_str(&json)?)
}
