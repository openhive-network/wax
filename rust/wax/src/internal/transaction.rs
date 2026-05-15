use std::collections::HashMap;

use wax_core::ffi::{RustAuthEntry, RustRequiredAuthorities, RustWaxAuthority};
use wax_core::{proto, RustOperation, RustTransaction};

use crate::WaxError;
use crate::interfaces::Transaction;
use crate::internal::protocol::{create_operation_handle, rust_protocol};
use crate::models::authority::RequiredAuthorities;

impl Transaction for RustTransaction {
    fn push_operation(mut self, op: RustOperation) -> Self {
        let op_handle = create_operation_handle(&op);

        rust_protocol()
            .cpp_tx_add_operation(self.handle.pin_mut(), &op_handle)
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

    fn is_signed(&self) -> bool {
        !self.inner.signatures.is_empty()
    }

    fn validate(&self) -> Result<(), WaxError> {
        rust_protocol().cpp_tx_validate(&self.handle).map_err(WaxError::from)
    }

    fn sig_digest(&self) -> Result<String, WaxError> {
        rust_protocol()
            .cpp_tx_sig_digest(&self.handle, &self.chain_id)
            .map_err(WaxError::from)
    }

    fn id(&self) -> Result<String, WaxError> {
        rust_protocol().cpp_tx_id(&self.handle).map_err(WaxError::from)
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

    fn signature_keys(&self) -> Result<Vec<String>, WaxError> {
        rust_protocol()
            .cpp_tx_signature_keys(&self.handle, &self.chain_id)
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

    fn transaction(&self) -> &proto::Transaction {
        self.proto()
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
