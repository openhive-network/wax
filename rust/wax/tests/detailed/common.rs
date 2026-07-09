//! Shared test fixture for the `detailed` integration-test suite. Rust port of
//! the TS `waxTest` helper in
//! `ts/wasm/__tests__/assets/jest-helper.ts`.

use std::cell::RefCell;

use beekeeper::{
    api::BeekeeperApi, options::BeekeeperOptions, wallet::UnlockedWallet,
};
use wax::{
    SignatureProvider, WaxError, WaxFoundation, WaxOptions,
    create_wax_foundation, result::CryptoMemo,
};

pub struct WaxTestCtx {
    pub base: Box<dyn WaxFoundation>,
}

pub fn wax_test<R>(
    options: impl Into<Option<WaxOptions>>,
    test: impl FnOnce(&WaxTestCtx) -> R,
) -> R {
    let ctx = WaxTestCtx {
        base: create_wax_foundation(options),
    };
    test(&ctx)
}

/// Bridges a Beekeeper [`UnlockedWallet`] to wax's [`SignatureProvider`] trait.
///
/// TS NOTE: TS tests build an `OnlineSigner` via `createSigner(base, wallet, key)`
/// which both signs and encrypts through the same wallet handle. This adapter
/// mirrors that role for the Rust side.
///
/// Beekeeper's `sign_digest` / `encrypt_data` / `decrypt_data` take `&mut self`,
/// so the wallet is wrapped in a `RefCell` to satisfy the `&self`-taking
/// `SignatureProvider` methods.
///
/// Like TS's `createSigner(base, wallet, key)`, encryption is a two-step
/// process: the beekeeper wallet produces the inner ciphertext, then the wax
/// foundation's `crypto_memo` codec wraps it (embedding the from/to keys and
/// the `#` prefix) into the final memo payload — and the reverse on decrypt.
/// crypto-memo packing is stateless, so a default foundation suffices.
pub struct BeekeeperSignatureProvider<'a> {
    wallet: RefCell<UnlockedWallet<'a>>,
    base: Box<dyn WaxFoundation>,
}

impl<'a> BeekeeperSignatureProvider<'a> {
    pub fn new(wallet: UnlockedWallet<'a>) -> Self {
        Self {
            wallet: RefCell::new(wallet),
            base: create_wax_foundation(None),
        }
    }
}

impl<'a> SignatureProvider for BeekeeperSignatureProvider<'a> {
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
        // NOTE: Beekeeper treats `nonce == 0` as "generate a fresh random nonce".
        // wax core always passes `Some(ref_block_prefix)`, so for our deterministic
        // tests this collapses to a real, reproducible nonce.
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

    fn decrypt_data(
        &self,
        content: &str,
        _key: &str,
        _other_key: Option<&str>,
    ) -> Result<String, WaxError> {
        // The from/to keys are embedded in the crypto-memo, so the inbound
        // key arguments (wax core passes empty markers here) are unused — we
        // recover the real keys by decoding the memo, mirroring TS `base.decrypt`.
        let memo = self.base.crypto_memo_from_string(content)?;

        self.wallet
            .borrow_mut()
            .decrypt_data(&memo.from, Some(&memo.to), &memo.content)
            .map_err(|e| WaxError::new(e.to_string()))
    }
}

/// Owns an in-memory [`BeekeeperApi`] plus an open session token. Returned by
/// [`new_in_memory_beekeeper`] so the borrow chain — `api → session → wallet`
/// — has a single, locally-scoped owner per test.
pub struct BeekeeperFixture {
    pub api: BeekeeperApi,
    pub token: String,
}

/// Creates a fresh in-memory beekeeper and opens a session on it.
pub fn new_in_memory_beekeeper() -> BeekeeperFixture {
    let mut api =
        BeekeeperApi::new(BeekeeperOptions::new("ignored").in_memory(true));
    let token = api.create_session().expect("create_session");
    BeekeeperFixture { api, token }
}
