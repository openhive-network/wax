use crate::ffi::RustAccountAuthorities;

/// Provides account authorities and witness signing keys to the C++ layer
/// during signature collection and verification.
pub trait AuthorityProvider {
    /// Returns the authorities of the requested accounts.
    fn get_authorities(
        &self,
        accounts: Vec<String>,
    ) -> Vec<RustAccountAuthorities>;
    /// Returns the public signing key of the given witness.
    fn get_witness_public_key(&self, witness: String) -> String;
}

/// Represents a boxed [`AuthorityProvider`] passed across the cxx bridge.
pub struct RustAuthorityProvider {
    inner: Box<dyn AuthorityProvider>,
}

impl RustAuthorityProvider {
    /// Wraps a boxed [`AuthorityProvider`] for use across the cxx bridge.
    pub fn new(inner: Box<dyn AuthorityProvider>) -> Box<Self> {
        Box::new(Self { inner })
    }
}

pub(crate) fn rap_get_authorities(
    provider: &RustAuthorityProvider,
    accounts: Vec<String>,
) -> Vec<RustAccountAuthorities> {
    provider.inner.get_authorities(accounts)
}

pub(crate) fn rap_get_witness_public_key(
    provider: &RustAuthorityProvider,
    witness: String,
) -> String {
    provider.inner.get_witness_public_key(witness)
}
