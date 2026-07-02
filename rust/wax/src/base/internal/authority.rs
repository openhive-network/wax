use std::collections::HashMap;

use crate::core::ffi::{
    RustAccountAuthorities, RustAuthEntry, RustWaxAuthorities, RustWaxAuthority,
};
use crate::core::{AuthorityProvider, RustAuthorityProvider};

use crate::base::interfaces::AuthorityDataProvider;
use crate::base::models::authority::{Authorities, WaxAuthority};

// Adapter from the high-level, per-account [`AuthorityDataProvider`] to the core bridge's
// batch `AuthorityProvider`. Holds a raw pointer to keep the type `'static`
// (required by `RustAuthorityProvider::new`); the pointer is only dereferenced
// while `cpp_tx_collect_signing_keys` is on the stack, which is synchronous —
// so the source reference is guaranteed to outlive every callback.
struct AuthorityProviderAdapter {
    inner: *const dyn AuthorityDataProvider,
}

impl AuthorityProvider for AuthorityProviderAdapter {
    fn get_authorities(
        &self,
        accounts: Vec<String>,
    ) -> Vec<RustAccountAuthorities> {
        // SAFETY: see struct docs — the source reference outlives the call.
        let provider = unsafe { &*self.inner };
        accounts
            .into_iter()
            .filter_map(|account| {
                provider.get_account_authorities(&account).ok().map(|info| {
                    RustAccountAuthorities {
                        account: info.account,
                        authorities: to_rust_authorities(info.authorities),
                    }
                })
            })
            .collect()
    }

    fn get_witness_public_key(&self, witness: String) -> String {
        // SAFETY: see struct docs — the source reference outlives the call.
        let provider = unsafe { &*self.inner };
        match provider.get_witness_public_key(&witness) {
            Ok(Some(key)) => key,
            Ok(None) | Err(_) => String::new(),
        }
    }
}

pub(crate) fn build_provider(
    provider: &dyn AuthorityDataProvider,
) -> Box<RustAuthorityProvider> {
    // Lifetime-erase the trait object so it can live in an adapter that
    // satisfies the `'static` bound on `RustAuthorityProvider::new`. The
    // resulting `Box<RustAuthorityProvider>` must not outlive `provider` —
    // callers ensure that by consuming it within one synchronous FFI call.
    let inner: *const dyn AuthorityDataProvider = unsafe {
        core::mem::transmute(provider as *const dyn AuthorityDataProvider)
    };
    let adapter = AuthorityProviderAdapter { inner };
    RustAuthorityProvider::new(Box::new(adapter))
}

pub(crate) fn to_rust_authorities(
    authorities: Authorities,
) -> RustWaxAuthorities {
    RustWaxAuthorities {
        owner: to_rust_authority(authorities.owner),
        active: to_rust_authority(authorities.active),
        posting: to_rust_authority(authorities.posting),
    }
}

pub(crate) fn to_rust_authority(
    authority: Option<WaxAuthority>,
) -> RustWaxAuthority {
    let Some(auth) = authority else {
        return RustWaxAuthority {
            weight_threshold: 0,
            account_auths: Vec::new(),
            key_auths: Vec::new(),
        };
    };
    RustWaxAuthority {
        weight_threshold: auth.weight_threshold,
        account_auths: map_to_entries(auth.account_auths),
        key_auths: map_to_entries(auth.key_auths),
    }
}

fn map_to_entries(map: HashMap<String, u32>) -> Vec<RustAuthEntry> {
    map.into_iter()
        .map(|(name, weight)| RustAuthEntry { name, weight })
        .collect()
}
