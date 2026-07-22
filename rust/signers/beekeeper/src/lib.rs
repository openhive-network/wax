//! Beekeeper-backed [`SignatureProvider`] for the `wax` crate.
//!
//! TS NOTE: the Rust counterpart of the TS `signers-*` extension packages —
//! a pluggable signing provider wired into wax's transaction signing.

use std::cell::RefCell;

use beekeeper::wallet::UnlockedWallet;
use wax::result::CryptoMemo;
use wax::{SignatureProvider, WaxError, WaxFoundation, create_wax_foundation};

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
