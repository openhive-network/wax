//! Round-based account-authority cache backing traced authority
//! verification.
//!
//! The C++ tracer resolves authorities synchronously through an
//! [`AuthorityProvider`] callback, while the data lives on chain. The cache
//! bridges the two: a cache miss during a trace round records the account as
//! requested, [`CachingAuthorityProvider::acquire_data`] fetches everything
//! requested between rounds, and the trace is re-run until no new accounts
//! surface.
//!
//! TS NOTE: ports `AccountAuthorityCachingProvider` from
//! `ts/wasm/lib/detailed/util/account_authority_caching_provider.ts`.

use std::collections::{HashMap, HashSet};
use std::sync::{Arc, Mutex, MutexGuard};

use crate::core::ffi::RustAccountAuthorities;
use crate::core::{AuthorityProvider, RustAuthorityProvider};

use crate::base::internal::authority::to_rust_authorities;
use crate::models::authority::Authorities;
use crate::models::basic::{AccountName, PublicKey};

use crate::chain::api::DefaultHiveApi;
use crate::chain::error::WaxChainError;
use crate::chain::internal::account_data::{
    collect_account_authorities, collect_witness_signing_keys,
};

/// Provides account authorities and witness keys to the C++ tracer from a
/// cache filled one fetch round at a time.
pub(crate) struct CachingAuthorityProvider {
    // Shared with the FFI adapter handed to the tracer: the C++ callbacks
    // record cache misses in `requested_*` while the trace runs.
    state: Arc<Mutex<CacheState>>,
}

#[derive(Default)]
struct CacheState {
    authorities: HashMap<AccountName, Authorities>,
    witness_keys: HashMap<AccountName, PublicKey>,
    requested_accounts: HashSet<AccountName>,
    requested_witnesses: HashSet<AccountName>,
    unknown_accounts: HashSet<AccountName>,
    unknown_witnesses: HashSet<AccountName>,
}

impl CachingAuthorityProvider {
    /// Creates a cache with an initial set of accounts to fetch in the first
    /// [`Self::acquire_data`] round.
    pub(crate) fn new(
        requested_accounts: impl IntoIterator<Item = AccountName>,
    ) -> Self {
        let state = CacheState {
            requested_accounts: requested_accounts.into_iter().collect(),
            ..Default::default()
        };

        Self {
            state: Arc::new(Mutex::new(state)),
        }
    }

    /// Fetches authorities and witness keys for everything requested since
    /// the previous round. Accounts the chain does not know move to the
    /// unknown sets, so they are reported as missing instead of re-requested.
    ///
    /// TS NOTE: TS leaves the requested-minus-fetched difference as a `TODO`
    /// and never fills `unknownAccounts`, which would re-request nonexistent
    /// accounts forever; the Rust port implements the intended behavior so
    /// the trace loop terminates.
    pub(crate) async fn acquire_data(
        &self,
        api: &DefaultHiveApi,
    ) -> Result<(), WaxChainError> {
        let (accounts, witnesses) = {
            let mut state = self.lock();
            (
                drain_sorted(&mut state.requested_accounts),
                drain_sorted(&mut state.requested_witnesses),
            )
        };

        // The guard is not held across await points: fetch first, then merge.
        let fetched_authorities =
            collect_account_authorities(api, false, &accounts).await?;
        let fetched_keys =
            collect_witness_signing_keys(api, false, &witnesses).await?;

        let mut state = self.lock();

        for account in accounts {
            if !fetched_authorities.contains_key(&account) {
                state.unknown_accounts.insert(account);
            }
        }
        for (account, (authorities, _memo_key)) in fetched_authorities {
            state.authorities.insert(account, authorities);
        }

        for witness in witnesses {
            if !fetched_keys.contains_key(&witness) {
                state.unknown_witnesses.insert(witness);
            }
        }
        for (witness, key) in fetched_keys {
            state.witness_keys.insert(witness, key);
        }

        Ok(())
    }

    /// Returns whether the last trace round requested data the cache does not
    /// hold yet, i.e. whether another acquire + trace round is needed.
    ///
    /// TS NOTE: TS `canContinue` checks requested accounts only; witness
    /// requests are included here so a witness-key miss also triggers a
    /// fetch round.
    pub(crate) fn can_continue(&self) -> bool {
        let state = self.lock();

        !state.requested_accounts.is_empty()
            || !state.requested_witnesses.is_empty()
    }

    /// Builds the bridge-side provider handed to a single
    /// `cpp_trace_authority_verification` call.
    pub(crate) fn ffi_provider(&self) -> Box<RustAuthorityProvider> {
        RustAuthorityProvider::new(Box::new(CacheFfiAdapter {
            state: Arc::clone(&self.state),
        }))
    }

    fn lock(&self) -> MutexGuard<'_, CacheState> {
        self.state.lock().expect("authority cache lock poisoned")
    }
}

// Sorted for deterministic API request payloads (TS relies on `Set`
// insertion order instead).
fn drain_sorted(set: &mut HashSet<AccountName>) -> Vec<AccountName> {
    let mut names: Vec<AccountName> = set.drain().collect();
    names.sort_unstable();

    names
}

/// Serves the C++ tracer callbacks from the shared cache state, recording
/// misses as requests for the next fetch round.
struct CacheFfiAdapter {
    state: Arc<Mutex<CacheState>>,
}

impl AuthorityProvider for CacheFfiAdapter {
    fn get_authorities(
        &self,
        accounts: Vec<String>,
    ) -> Vec<RustAccountAuthorities> {
        let mut state =
            self.state.lock().expect("authority cache lock poisoned");

        accounts
            .into_iter()
            .filter_map(|account| {
                let Some(authorities) = state.authorities.get(&account) else {
                    // An omitted account reaches the tracer as "missing"; only
                    // definitive misses stay that way — fresh ones are fetched
                    // next round and the trace re-runs.
                    if !state.unknown_accounts.contains(&account) {
                        state.requested_accounts.insert(account);
                    }
                    return None;
                };

                Some(RustAccountAuthorities {
                    authorities: to_rust_authorities(authorities.clone()),
                    account,
                })
            })
            .collect()
    }

    fn get_witness_public_key(&self, witness: String) -> String {
        let mut state =
            self.state.lock().expect("authority cache lock poisoned");

        if let Some(key) = state.witness_keys.get(&witness) {
            return key.clone();
        }

        // An empty key reaches the tracer as "unknown witness".
        if !state.unknown_witnesses.contains(&witness) {
            state.requested_witnesses.insert(witness);
        }
        String::new()
    }
}
