//! Broadcast input forms: the [`Broadcastable`] trait accepted by
//! [`HiveChain::broadcast`](crate::HiveChain::broadcast).

use crate::Transaction;

use crate::chain::api::ApiTransaction;
use crate::chain::error::WaxChainError;
use crate::chain::online_transaction::OnlineTransaction;

/// Provides conversion of a transaction form into the wire form
/// [`HiveChain::broadcast`](crate::HiveChain::broadcast) posts, running
/// any pre-broadcast checks the form implies.
#[allow(async_fn_in_trait)]
pub trait Broadcastable {
    /// Converts the transaction into its API wire form, running the form's
    /// pre-broadcast checks.
    async fn to_broadcast_form(&self) -> Result<ApiTransaction, WaxChainError>;
}

impl Broadcastable for ApiTransaction {
    async fn to_broadcast_form(&self) -> Result<ApiTransaction, WaxChainError> {
        Ok(self.clone())
    }
}

impl Broadcastable for Transaction {
    async fn to_broadcast_form(&self) -> Result<ApiTransaction, WaxChainError> {
        api_form(self.to_api()?)
    }
}

impl Broadcastable for OnlineTransaction {
    async fn to_broadcast_form(&self) -> Result<ApiTransaction, WaxChainError> {
        let form = api_form(self.to_api()?)?;
        self.perform_on_chain_verification().await?;

        Ok(form)
    }
}

/// Parses a transaction's HF26 API JSON into the typed request form.
fn api_form(json: String) -> Result<ApiTransaction, WaxChainError> {
    Ok(serde_json::from_str(&json)?)
}
