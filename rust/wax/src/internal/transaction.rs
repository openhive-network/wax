use std::collections::HashMap;

use wax_core::ffi::{
    RustAccountAuthorities, RustAuthEntry, RustMinimizeRequiredSignaturesData,
    RustRequiredAuthorities, RustWaxAuthority,
};
use wax_core::{RustOperation, RustTransaction, proto};

use crate::WaxError;
use crate::interfaces::{AuthorityDataProvider, Transaction};
use crate::internal::authority::{build_provider, to_rust_authorities};
use crate::internal::protocol::rust_protocol;
use crate::models::authority::RequiredAuthorities;
use crate::result::MinimizeRequiredSignaturesData;

impl Transaction for RustTransaction {
    fn push_operation(mut self, op: RustOperation) -> Self {
        rust_protocol()
            .cpp_tx_add_operation(self.handle.pin_mut(), &op.handle)
            .expect("failed to add operation to transaction");

        self.inner.operations.push(op.inner);

        self
    }

    fn add_signature(&mut self, signature: &str) -> Result<(), WaxError> {
        rust_protocol()
            .cpp_tx_add_signature(self.handle.pin_mut(), signature)
            .map_err(WaxError::from)?;

        self.inner.signatures.push(signature.to_string());

        Ok(())
    }

    fn set_expiration(&mut self, expiration: &str) -> Result<(), WaxError> {
        rust_protocol()
            .cpp_tx_set_expiration(self.handle.pin_mut(), expiration)
            .map_err(WaxError::from)?;

        self.inner.expiration = expiration.to_string();

        Ok(())
    }

    fn is_signed(&self) -> bool {
        !self.inner.signatures.is_empty()
    }

    fn validate(&self) -> Result<(), WaxError> {
        rust_protocol()
            .cpp_tx_validate(&self.handle)
            .map_err(WaxError::from)
    }

    fn sig_digest(&self) -> Result<String, WaxError> {
        rust_protocol()
            .cpp_tx_sig_digest(&self.handle, &self.chain_id)
            .map_err(WaxError::from)
    }

    fn legacy_sig_digest(&self) -> Result<String, WaxError> {
        rust_protocol()
            .cpp_tx_legacy_sig_digest(&self.handle, &self.chain_id)
            .map_err(WaxError::from)
    }

    fn id(&self) -> Result<String, WaxError> {
        rust_protocol()
            .cpp_tx_id(&self.handle)
            .map_err(WaxError::from)
    }

    fn legacy_id(&self) -> Result<String, WaxError> {
        rust_protocol()
            .cpp_tx_legacy_id(&self.handle)
            .map_err(WaxError::from)
    }

    fn to_binary_form(&self, strip_to_unsigned: bool) -> Result<String, WaxError> {
        rust_protocol()
            .cpp_tx_to_binary(&self.handle, strip_to_unsigned)
            .map_err(WaxError::from)
    }

    fn to_api(&self) -> Result<String, WaxError> {
        rust_protocol()
            .cpp_tx_to_json(&self.handle)
            .map_err(WaxError::from)
    }

    fn to_legacy_api(&self) -> Result<String, WaxError> {
        rust_protocol()
            .cpp_tx_to_legacy_json(&self.handle)
            .map_err(WaxError::from)
    }

    fn signature_keys(&self) -> Result<Vec<String>, WaxError> {
        rust_protocol()
            .cpp_tx_signature_keys(&self.handle, &self.chain_id)
            .map_err(WaxError::from)
    }

    fn legacy_signature_keys(&self) -> Result<Vec<String>, WaxError> {
        rust_protocol()
            .cpp_tx_legacy_signature_keys(&self.handle, &self.chain_id)
            .map_err(WaxError::from)
    }

    fn impacted_accounts(&self) -> Result<Vec<String>, WaxError> {
        rust_protocol()
            .cpp_tx_impacted_accounts(&self.handle)
            .map_err(WaxError::from)
    }

    fn required_authorities(&self) -> Result<RequiredAuthorities, WaxError> {
        rust_protocol()
            .cpp_tx_required_authorities(&self.handle)
            .map(to_required_authorities)
            .map_err(WaxError::from)
    }

    fn collect_signing_keys(
        &self,
        provider: &dyn AuthorityDataProvider,
    ) -> Result<Vec<String>, WaxError> {
        let core_provider = build_provider(provider);
        rust_protocol()
            .cpp_tx_collect_signing_keys(&self.handle, &core_provider)
            .map_err(WaxError::from)
    }

    fn minimize_required_signatures(
        &self,
        data: &MinimizeRequiredSignaturesData,
        provider: &dyn AuthorityDataProvider,
    ) -> Result<Vec<String>, WaxError> {
        let core_provider = build_provider(provider);
        let ffi_data = to_rust_minimize_data(data);

        rust_protocol()
            .cpp_minimize_required_signatures(&self.handle, &ffi_data, &core_provider)
            .map_err(WaxError::from)
    }

    fn transaction(&self) -> &proto::Transaction {
        self.proto()
    }
}

fn to_rust_minimize_data(
    data: &MinimizeRequiredSignaturesData,
) -> RustMinimizeRequiredSignaturesData {
    let authorities = data
        .authorities
        .iter()
        .map(|(account, auths)| RustAccountAuthorities {
            account: account.clone(),
            authorities: to_rust_authorities(auths.clone()),
        })
        .collect();

    let (max_recursion, has_max_recursion) = match data.max_recursion {
        Some(v) => (v, true),
        None => (0, false),
    };
    let (max_membership, has_max_membership) = match data.max_membership {
        Some(v) => (v, true),
        None => (0, false),
    };
    let (max_account_auths, has_max_account_auths) = match data.max_account_auths {
        Some(v) => (v, true),
        None => (0, false),
    };

    RustMinimizeRequiredSignaturesData {
        chain_id: data.chain_id.clone(),
        available_keys: data.available_keys.clone(),
        authorities,
        max_recursion,
        has_max_recursion,
        max_membership,
        has_max_membership,
        max_account_auths,
        has_max_account_auths,
        allow_strict_and_mixed_authorities: data.allow_strict_and_mixed_authorities,
    }
}

fn auth_entries_to_map(entries: Vec<RustAuthEntry>) -> HashMap<String, u32> {
    entries
        .into_iter()
        .map(|entry| (entry.name, entry.weight))
        .collect()
}

fn to_proto_authority(authority: RustWaxAuthority) -> proto::Authority {
    proto::Authority {
        weight_threshold: authority.weight_threshold,
        account_auths: auth_entries_to_map(authority.account_auths),
        key_auths: auth_entries_to_map(authority.key_auths),
    }
}

fn to_required_authorities(ffi: RustRequiredAuthorities) -> RequiredAuthorities {
    RequiredAuthorities {
        posting_accounts: ffi.posting_accounts,
        active_accounts: ffi.active_accounts,
        owner_accounts: ffi.owner_accounts,
        other_authorities: ffi
            .other_authorities
            .into_iter()
            .map(to_proto_authority)
            .collect(),
    }
}
