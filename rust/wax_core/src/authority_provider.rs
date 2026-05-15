use crate::ffi::RustAccountAuthorities;

pub trait AuthorityProvider {
    fn get_authorities(&self, accounts: Vec<String>) -> Vec<RustAccountAuthorities>;
    fn get_witness_public_key(&self, witness: String) -> String;
}

pub struct RustAuthorityProvider {
    inner: Box<dyn AuthorityProvider>,
}

impl RustAuthorityProvider {
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
