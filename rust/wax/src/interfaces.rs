use rust_decimal::Decimal;
use wax_core::{RustOperation, proto};

use crate::WaxError;
use crate::foundation::WaxFoundation;
use crate::models::authority::{AccountAuthorityInfo, RequiredAuthorities};
use crate::models::basic::{AccountName, Hex, PublicKey, SigDigest, TransactionId};
use crate::result::MinimizeRequiredSignaturesData;

pub trait Manabar {
    fn max_mana(&self) -> i64;
    fn current_mana(&self) -> i64;
    fn percent(&self) -> Decimal;
}

pub trait AuthorityDataProvider {
    fn get_account_authorities(&self, account: &str) -> Result<AccountAuthorityInfo, WaxError>;

    fn get_witness_public_key(&self, _witness: &str) -> Result<Option<PublicKey>, WaxError> {
        Ok(None)
    }
}

pub trait Operation {
    fn validate(&self) -> Result<(), WaxError>;
    fn impacted_accounts(&self) -> Result<Vec<AccountName>, WaxError>;
}

pub trait OperationBuilder {
    fn finalize(self, foundation: &dyn WaxFoundation)
        -> Result<Vec<proto::Operation>, WaxError>;
}

pub trait Transaction {
    fn push_operation(self, op: RustOperation) -> Self;
    fn add_signature(&mut self, signature: &str) -> Result<(), WaxError>;
    fn set_expiration(&mut self, expiration: &str) -> Result<(), WaxError>;
    fn is_signed(&self) -> bool;
    fn validate(&self) -> Result<(), WaxError>;
    fn sig_digest(&self) -> Result<SigDigest, WaxError>;
    fn legacy_sig_digest(&self) -> Result<SigDigest, WaxError>;
    fn id(&self) -> Result<TransactionId, WaxError>;
    fn legacy_id(&self) -> Result<TransactionId, WaxError>;
    fn to_binary_form(&self, strip_to_unsigned: bool) -> Result<Hex, WaxError>;
    fn to_api(&self) -> Result<String, WaxError>;
    fn to_legacy_api(&self) -> Result<String, WaxError>;
    fn signature_keys(&self) -> Result<Vec<PublicKey>, WaxError>;
    fn legacy_signature_keys(&self) -> Result<Vec<PublicKey>, WaxError>;
    fn impacted_accounts(&self) -> Result<Vec<AccountName>, WaxError>;
    fn required_authorities(&self) -> Result<RequiredAuthorities, WaxError>;
    fn collect_signing_keys(
        &self,
        provider: &dyn AuthorityDataProvider,
    ) -> Result<Vec<PublicKey>, WaxError>;
    fn minimize_required_signatures(
        &self,
        data: &MinimizeRequiredSignaturesData,
        provider: &dyn AuthorityDataProvider,
    ) -> Result<Vec<PublicKey>, WaxError>;
    fn transaction(&self) -> &proto::Transaction;
    fn push_builder(
        self,
        foundation: &dyn WaxFoundation,
        builder: impl OperationBuilder,
    ) -> Result<Self, WaxError>
    where
        Self: Sized;
    // TODO: add `sign` method
}
