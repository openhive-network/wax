//! Beekeeper-backed [`SignatureProvider`] for the `wax` crate.
//!
//! TS NOTE: the Rust counterpart of the TS `signers-*` extension packages —
//! a pluggable signing provider wired into wax's transaction signing.

use std::cell::RefCell;
use std::fmt;

use beekeeper::wallet::UnlockedWallet;
use thiserror::Error;
use wax::api::FindAccountsRequest;
use wax::models::basic::{AccountName, PublicKey};
use wax::result::CryptoMemo;
use wax::{
    HiveChain, SignatureProvider, WaxChainError, WaxError, WaxFoundation,
    create_wax_foundation,
};

/// Bridges a Beekeeper [`UnlockedWallet`] to wax's [`SignatureProvider`]
/// trait.
///
/// TS NOTE: TS builds an `OnlineSigner` via `createSigner(base, wallet, key)`
/// which both signs and encrypts through the same wallet handle. This adapter
/// mirrors that role for the Rust side.
///
/// Beekeeper's `sign_digest` / `encrypt_data` / `decrypt_data` take `&mut
/// self`, so the wallet is wrapped in a `RefCell` to satisfy the
/// `&self`-taking `SignatureProvider` methods.
///
/// Like TS's `createSigner(base, wallet, key)`, encryption is a two-step
/// process: the beekeeper wallet produces the inner ciphertext, then the wax
/// foundation's `crypto_memo` codec wraps it (embedding the from/to keys and
/// the `#` prefix) into the final memo payload — and the reverse on decrypt.
/// crypto-memo packing is stateless, so a default foundation suffices.
pub struct BeekeeperSignatureProvider {
    wallet: RefCell<UnlockedWallet>,
    base: WaxFoundation,
}

impl BeekeeperSignatureProvider {
    pub fn new(wallet: UnlockedWallet) -> Self {
        Self {
            wallet: RefCell::new(wallet),
            base: create_wax_foundation(None),
        }
    }
}

impl SignatureProvider for BeekeeperSignatureProvider {
    fn sign_digest(
        &self,
        public_key: &str,
        sig_digest: &str,
    ) -> Result<String, WaxError> {
        self.wallet
            .borrow_mut()
            .sign_digest(public_key, sig_digest)
            .map_err(|e| WaxError::new(e.to_string()))
    }

    fn encrypt_data(
        &self,
        content: &str,
        key: &str,
        other_key: Option<&str>,
        nonce: Option<u64>,
    ) -> Result<String, WaxError> {
        // NOTE: Beekeeper treats `nonce == 0` as "generate a fresh random
        // nonce". wax core always passes `Some(ref_block_prefix)`, so in
        // practice the nonce is deterministic per transaction.
        let inner = self
            .wallet
            .borrow_mut()
            .encrypt_data(key, other_key, content, nonce.unwrap_or(0))
            .map_err(|e| WaxError::new(e.to_string()))?;

        self.base.crypto_memo_dump_string(&CryptoMemo {
            from: key.to_string(),
            to: other_key.unwrap_or(key).to_string(),
            content: inner,
        })
    }

    fn decrypt_data(&self, content: &str) -> Result<String, WaxError> {
        // The from/to keys are embedded in the crypto-memo; recover them by
        // decoding the memo, mirroring TS `base.decrypt`.
        let memo = self.base.crypto_memo_from_string(content)?;

        self.wallet
            .borrow_mut()
            .decrypt_data(&memo.from, Some(memo.to.as_str()), &memo.content)
            .map_err(|e| WaxError::new(e.to_string()))
    }
}

/// Resolves the public key of `account`'s `role` authority via
/// `database_api.find_accounts`, ready to be passed to signing calls such as
/// [`wax::Transaction::sign`] together with a
/// [`BeekeeperSignatureProvider`].
///
/// For the key-authority roles the first `key_auths` entry is used; for
/// [`Role::Memo`] the account's `memo_key`.
///
/// TS NOTE: mirrors the `BeekeeperProvider.for(chain, wallet, account,
/// role)` overload. TS stores the resolved key inside the provider because
/// its signing entry point is transaction-level; Rust's
/// [`SignatureProvider::sign_digest`] receives the public key per call, so
/// the key is returned to the caller instead.
pub async fn resolve_public_key(
    chain: &HiveChain,
    account: &str,
    role: Role,
) -> Result<PublicKey, BeekeeperProviderError> {
    let response = chain
        .api()
        .database_api
        .find_accounts(FindAccountsRequest {
            accounts: vec![account.to_string()],
            delayed_votes_active: Some(false),
        })
        .await?;

    let Some(found) = response.accounts.into_iter().next() else {
        return Err(BeekeeperProviderError::AccountNotFound(
            account.to_string(),
        ));
    };

    let authority = match role {
        Role::Owner => found.owner,
        Role::Active => found.active,
        Role::Posting => found.posting,
        Role::Memo => {
            // TS NOTE: TS only checks the resolved key for truthiness, so an
            // empty `memo_key` rejects like a missing authority key.
            return if found.memo_key.is_empty() {
                Err(BeekeeperProviderError::MissingRoleKey {
                    account: account.to_string(),
                    role,
                })
            } else {
                Ok(found.memo_key)
            };
        }
    };

    // NOTE: TS reads `key_auths[0][0]` unchecked — an authority without key
    // entries dies there with a TypeError; Rust surfaces the same condition
    // as a dedicated error.
    authority
        .key_auths
        .into_iter()
        .next()
        .map(|(key, _weight)| key)
        .ok_or_else(|| BeekeeperProviderError::MissingRoleKey {
            account: account.to_string(),
            role,
        })
}

/// Represents a failure of [`resolve_public_key`].
///
/// TS NOTE: `WaxBeekeeperProviderError`, plus a variant carrying the
/// underlying chain-call failure (TS lets those propagate untyped).
#[derive(Debug, Error)]
pub enum BeekeeperProviderError {
    #[error("Account {0} not found")]
    AccountNotFound(AccountName),

    #[error("Account {account} does not have {role} key")]
    MissingRoleKey { account: AccountName, role: Role },

    // Boxed: `WaxChainError` dwarfs the other variants (clippy
    // `large_enum_variant`).
    #[error(transparent)]
    Chain(Box<WaxChainError>),
}

impl From<WaxChainError> for BeekeeperProviderError {
    fn from(error: WaxChainError) -> Self {
        Self::Chain(Box::new(error))
    }
}

/// Represents the account authority whose key is resolved by
/// [`resolve_public_key`].
///
/// TS NOTE: `TRole` (`"owner" | "active" | "posting" | "memo"`). wax's
/// `HiveRole` spans only the three key authorities, while the signer also
/// accepts the memo key — hence a local enum.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Role {
    Owner,
    Active,
    Posting,
    Memo,
}

impl Role {
    /// Returns the role's lowercase protocol name.
    pub fn as_str(self) -> &'static str {
        match self {
            Self::Owner => "owner",
            Self::Active => "active",
            Self::Posting => "posting",
            Self::Memo => "memo",
        }
    }
}

impl fmt::Display for Role {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str(self.as_str())
    }
}
