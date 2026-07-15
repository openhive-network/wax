//! The online transaction type: [`OnlineTransaction`].
//!
//! TS NOTE: ports the `OnlineTransaction` class and its
//! `OnChainOperationValidator` helper from
//! `ts/wasm/lib/detailed/online_transaction.ts`. The TS visitor subclass is
//! replaced by a match over `proto::operation::Value`.

use std::collections::{HashMap, HashSet};

use crate::core::{RustOperation, proto};

use crate::base::internal::authority::to_rust_authorities;
use crate::base::internal::protocol::rust_protocol;
use crate::models::authority::RequiredAuthorities;
use crate::models::basic::{
    AccountName, Hex, PublicKey, SigDigest, Signature, TransactionId,
};
use crate::result::{BinaryViewOutputData, MinimizeRequiredSignaturesData};
use crate::{
    AuthorityDataProvider, Operation, OperationBuilder, SignatureProvider,
    Transaction, WaxError, WaxFoundation,
};

use crate::chain::api::{DefaultHiveApi, FindRcAccountsRequest};
use crate::chain::authority_trace::AuthorityTrace;
use crate::chain::error::WaxChainError;
use crate::chain::internal::account_data::collect_account_authorities;
use crate::chain::internal::authority_cache::CachingAuthorityProvider;
use crate::chain::internal::trace::convert_authority_trace;

/// TS NOTE: `MAX_ACCOUNTS_PER_CALL` — existence checks never ask
/// `rc_api.find_rc_accounts` for more than this many accounts per call.
const MAX_ACCOUNTS_PER_CALL: usize = 100;

/// Represents a [`Transaction`] bound to the chain it was created from,
/// adding chain-dependent checks on top of the offline surface:
///
/// - private-key leak detection (memo-style texts cross-referenced against
///   the authorities of the impacted accounts)
/// - existence checks for accounts referenced by authority updates
/// - authority verification trace generation
///
/// Created by
/// [`HiveChainExt::create_transaction`](crate::HiveChainExt::create_transaction).
/// Every [`Transaction`] method is mirrored here; the builders return
/// `&mut Self` so building keeps the online type.
///
/// TS NOTE: the TS `OnlineTransaction` class (extends `Transaction`).
pub struct OnlineTransaction {
    base: Transaction,
    api: DefaultHiveApi,
}

// Mirrors the read-only Transaction surface by delegation.
macro_rules! forward {
    ($( fn $name:ident(&self $(, $arg:ident: $argty:ty)* $(,)?) -> $ret:ty );* $(;)?) => {
        $(
            #[doc = concat!("See [`Transaction::", stringify!($name), "`].")]
            pub fn $name(&self $(, $arg: $argty)*) -> $ret {
                self.base.$name($($arg),*)
            }
        )*
    };
}

// Mirrors the mutating (non-builder) Transaction surface by delegation.
macro_rules! forward_mut {
    ($( fn $name:ident(&mut self $(, $arg:ident: $argty:ty)* $(,)?) -> $ret:ty );* $(;)?) => {
        $(
            #[doc = concat!("See [`Transaction::", stringify!($name), "`].")]
            pub fn $name(&mut self $(, $arg: $argty)*) -> $ret {
                self.base.$name($($arg),*)
            }
        )*
    };
}

impl OnlineTransaction {
    pub(crate) fn new(base: Transaction, api: DefaultHiveApi) -> Self {
        Self { base, api }
    }

    /// Appends `op` to this transaction. See [`Transaction::push_operation`].
    pub fn push_operation(&mut self, op: Box<dyn Operation>) -> &mut Self {
        self.base.push_operation(op);
        self
    }

    /// Finalizes `builder` against `foundation` and appends the resulting
    /// operations. See [`Transaction::push_builder`].
    pub fn push_builder(
        &mut self,
        foundation: &dyn WaxFoundation,
        builder: Box<dyn OperationBuilder>,
    ) -> Result<&mut Self, WaxError> {
        self.base.push_builder(foundation, builder)?;

        Ok(self)
    }

    /// Opens an encryption range. See [`Transaction::start_encrypt`].
    pub fn start_encrypt(
        &mut self,
        main_key: &str,
        other_key: Option<&str>,
    ) -> &mut Self {
        self.base.start_encrypt(main_key, other_key);
        self
    }

    /// Closes the most recently opened encryption range. See
    /// [`Transaction::stop_encrypt`].
    pub fn stop_encrypt(&mut self) -> Result<&mut Self, WaxError> {
        self.base.stop_encrypt()?;

        Ok(self)
    }

    forward! {
        fn is_signed(&self) -> bool;
        fn validate(&self) -> Result<(), WaxError>;
        fn sig_digest(&self) -> Result<SigDigest, WaxError>;
        fn legacy_sig_digest(&self) -> Result<SigDigest, WaxError>;
        fn id(&self) -> Result<TransactionId, WaxError>;
        fn legacy_id(&self) -> Result<TransactionId, WaxError>;
        fn to_binary_form(&self, strip_to_unsigned: bool) -> Result<Hex, WaxError>;
        fn binary_view_metadata(&self) -> Result<BinaryViewOutputData, WaxError>;
        fn legacy_binary_view_metadata(&self) -> Result<BinaryViewOutputData, WaxError>;
        fn to_api(&self) -> Result<String, WaxError>;
        fn to_api_json(&self) -> Result<serde_json::Value, WaxError>;
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
    }

    forward_mut! {
        fn add_signature(&mut self, signature: &str) -> Result<(), WaxError>;
        fn set_expiration(&mut self, expiration: &str) -> Result<(), WaxError>;
        fn sign(
            &mut self,
            wallet: &dyn SignatureProvider,
            public_key: &str,
        ) -> Result<Signature, WaxError>;
        fn perform_operation_encryption(
            &mut self,
            wallet: &dyn SignatureProvider,
        ) -> Result<(), WaxError>;
        fn decrypt(
            &mut self,
            wallet: &dyn SignatureProvider,
        ) -> Result<(), WaxError>;
    }

    /// Consumes the wrapper and returns the underlying offline
    /// [`Transaction`], dropping the chain binding.
    pub fn into_transaction(self) -> Transaction {
        self.base
    }

    pub async fn perform_on_chain_verification(
        &self,
    ) -> Result<(), WaxChainError> {
        let data = collect_verification_data(self.base.transaction())?;

        scan_for_key_leaks(&self.api, &data).await?;

        ensure_accounts_exist(&self.api, &data).await
    }

    /// Builds an authority verification trace for the (already signed)
    /// transaction. `use_legacy` forces pre-HF26 serialization when true.
    pub async fn generate_authority_verification_trace(
        &self,
        use_legacy: bool,
    ) -> Result<AuthorityTrace, WaxChainError> {
        let signature_keys = if use_legacy {
            self.base.legacy_signature_keys()?
        } else {
            self.base.signature_keys()?
        };

        let required_authorities = rust_protocol()
            .cpp_tx_required_authorities(&self.base.inner.handle)
            .map_err(WaxError::from)?;

        let seed_accounts = required_authorities
            .posting_accounts
            .iter()
            .chain(&required_authorities.active_accounts)
            .chain(&required_authorities.owner_accounts)
            .cloned();
        let cache = CachingAuthorityProvider::new(seed_accounts);

        // Each round fetches the authorities requested by the previous
        // traversal; the trace is final once no new accounts surface.
        let trace = loop {
            cache.acquire_data(&self.api).await?;

            let provider = cache.ffi_provider();
            let trace = rust_protocol()
                .cpp_trace_authority_verification(
                    &required_authorities,
                    &signature_keys,
                    &provider,
                )
                .map_err(WaxError::from)?;

            if !cache.can_continue() {
                break trace;
            }
        };

        let key_signatures: HashMap<PublicKey, Signature> = signature_keys
            .iter()
            .cloned()
            .zip(self.base.transaction().signatures.iter().cloned())
            .collect();

        Ok(convert_authority_trace(&key_signatures, &trace))
    }
}

/// Represents the data gathered from the transaction's operations before the
/// async checks run: texts to scan for leaked keys per impacted account,
/// accounts whose existence must be confirmed, and accounts this very
/// transaction creates (exempt from both checks).
#[derive(Default)]
struct VerificationData {
    key_leak_texts: HashMap<AccountName, Vec<String>>,
    accounts_to_check: HashSet<AccountName>,
    created_accounts: HashSet<AccountName>,
}

impl VerificationData {
    // TS NOTE: TS subtracts the created-accounts set both while collecting
    // and again before scanning; only the final subtraction is observable,
    // so the Rust port collects everything and subtracts once at scan time.
    fn collect_key_leak_texts(
        &mut self,
        op: &proto::Operation,
        texts: &[&str],
    ) -> Result<(), WaxError> {
        let operation = RustOperation::from_proto(rust_protocol(), op.clone());

        for account in operation.impacted_accounts()? {
            self.key_leak_texts
                .entry(account)
                .or_default()
                .extend(texts.iter().map(|text| text.to_string()));
        }

        Ok(())
    }

    fn collect_referenced_accounts(&mut self, op: &proto::AccountUpdate2) {
        self.accounts_to_check.insert(op.account.clone());

        for authority in
            [&op.active, &op.posting, &op.owner].into_iter().flatten()
        {
            self.accounts_to_check
                .extend(authority.account_auths.keys().cloned());
        }
    }
}

fn collect_verification_data(
    tx: &proto::Transaction,
) -> Result<VerificationData, WaxError> {
    use proto::operation::Value;

    let mut data = VerificationData::default();

    for op in &tx.operations {
        let Some(value) = op.value.as_ref() else {
            continue;
        };

        match value {
            Value::CommentOperation(comment) => data.collect_key_leak_texts(
                op,
                &[&comment.body, &comment.permlink],
            )?,
            Value::TransferOperation(transfer) => {
                data.collect_key_leak_texts(op, &[&transfer.memo])?
            }
            Value::TransferToSavingsOperation(transfer) => {
                data.collect_key_leak_texts(op, &[&transfer.memo])?
            }
            Value::TransferFromSavingsOperation(transfer) => {
                data.collect_key_leak_texts(op, &[&transfer.memo])?
            }
            Value::RecurrentTransferOperation(transfer) => {
                data.collect_key_leak_texts(op, &[&transfer.memo])?
            }
            // TS NOTE: the account_create*/account_update* arms also call
            // `collectModifiedAuthorityData`, an empty TODO in TS — omitted.
            Value::AccountCreateOperation(create) => {
                data.created_accounts.insert(create.new_account_name.clone());
            }
            Value::AccountCreateWithDelegationOperation(create) => {
                data.created_accounts.insert(create.new_account_name.clone());
            }
            Value::CreateClaimedAccountOperation(create) => {
                data.created_accounts.insert(create.new_account_name.clone());
            }
            Value::AccountUpdate2Operation(update) => {
                data.collect_referenced_accounts(update)
            }
            _ => {}
        }
    }

    Ok(data)
}

/// Fetches the authorities of every account impacted by a memo-carrying
/// operation and errors if any collected text embeds a private key matching
/// those authorities (or the account's memo key).
async fn scan_for_key_leaks(
    api: &DefaultHiveApi,
    data: &VerificationData,
) -> Result<(), WaxChainError> {
    // Sorted for deterministic API request payloads (TS relies on `Set`
    // insertion order instead).
    let mut accounts: Vec<AccountName> = data
        .key_leak_texts
        .keys()
        .filter(|account| !data.created_accounts.contains(*account))
        .cloned()
        .collect();
    accounts.sort_unstable();

    let authorities = collect_account_authorities(api, true, &accounts).await?;

    for account in &accounts {
        let (account_authorities, memo_key) = &authorities[account];
        let ffi_authorities = to_rust_authorities(account_authorities.clone());

        for text in &data.key_leak_texts[account] {
            rust_protocol()
                .cpp_check_memo_for_private_keys(
                    text,
                    account,
                    &ffi_authorities,
                    memo_key,
                    &Vec::new(),
                )
                .map_err(WaxError::from)?;
        }
    }

    Ok(())
}

/// Confirms that every account referenced by an `account_update2` operation
/// exists on chain, in batches of [`MAX_ACCOUNTS_PER_CALL`].
async fn ensure_accounts_exist(
    api: &DefaultHiveApi,
    data: &VerificationData,
) -> Result<(), WaxChainError> {
    let mut accounts: Vec<AccountName> = data
        .accounts_to_check
        .difference(&data.created_accounts)
        .cloned()
        .collect();
    accounts.sort_unstable();

    for chunk in accounts.chunks(MAX_ACCOUNTS_PER_CALL) {
        // rc_api.find_rc_accounts is used instead of
        // database_api.find_accounts because it responds with less data,
        // which results in faster response time, with the same functionality.
        let response = api
            .rc_api
            .find_rc_accounts(FindRcAccountsRequest {
                accounts: chunk.to_vec(),
            })
            .await?;

        if response.rc_accounts.len() != chunk.len() {
            let found: HashSet<&AccountName> = response
                .rc_accounts
                .iter()
                .map(|rc_account| &rc_account.account)
                .collect();

            return Err(WaxChainError::AccountsDoNotExist {
                accounts: chunk
                    .iter()
                    .filter(|account| !found.contains(account))
                    .cloned()
                    .collect(),
            });
        }
    }

    Ok(())
}
