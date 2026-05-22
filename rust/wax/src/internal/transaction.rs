use std::collections::HashMap;

use wax_core::ffi::{
    RustAccountAuthorities, RustAuthEntry, RustBinaryData, RustBinaryDataNode,
    RustMinimizeRequiredSignaturesData, RustRequiredAuthorities, RustWaxAuthority,
};
use wax_core::{EncryptionIndex, RustOperation, RustTransaction, proto};

use crate::WaxError;
use crate::foundation::WaxFoundation;
use crate::interfaces::{AuthorityDataProvider, OperationBuilder, SignatureProvider, Transaction};
use crate::internal::authority::{build_provider, to_rust_authorities};
use crate::internal::protocol::rust_protocol;
use crate::models::authority::RequiredAuthorities;
use crate::result::{BinaryViewNode, BinaryViewOutputData, MinimizeRequiredSignaturesData};

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

    fn binary_view_metadata(&self) -> Result<BinaryViewOutputData, WaxError> {
        rust_protocol()
            .cpp_tx_binary_view(&self.handle, true, false)
            .map(to_binary_view_output)
            .map_err(WaxError::from)
    }

    fn legacy_binary_view_metadata(&self) -> Result<BinaryViewOutputData, WaxError> {
        rust_protocol()
            .cpp_tx_binary_view(&self.handle, false, false)
            .map(to_binary_view_output)
            .map_err(WaxError::from)
    }

    fn to_api(&self) -> Result<String, WaxError> {
        rust_protocol()
            .cpp_tx_to_json(&self.handle)
            .map_err(WaxError::from)
    }

    fn to_api_json(&self) -> Result<serde_json::Value, WaxError> {
        let raw = self.to_api()?;
        serde_json::from_str(&raw).map_err(|e| WaxError::new(e.to_string()))
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

    fn push_builder(
        self,
        foundation: &dyn WaxFoundation,
        builder: impl OperationBuilder,
    ) -> Result<Self, WaxError> {
        let protocol = rust_protocol();
        let mut tx = self;
        for op in builder.finalize(foundation)? {
            tx = tx.push_operation(RustOperation::from_proto(protocol, op));
        }
        Ok(tx)
    }

    fn sign(
        &mut self,
        wallet: &dyn SignatureProvider,
        public_key: &str,
    ) -> Result<String, WaxError> {
        self.validate()?;
        let digest = self.sig_digest()?;
        let signature = wallet.sign_digest(public_key, &digest)?;
        self.add_signature(&signature)?;

        Ok(signature)
    }

    fn start_encrypt(mut self, main_key: &str, other_key: Option<&str>) -> Self {
        let begin = self.inner.operations.len();
        self.encryption_indices.push(EncryptionIndex {
            main_key: main_key.to_string(),
            other_key: other_key.map(str::to_string),
            begin,
            end: None,
        });
        self
    }

    fn stop_encrypt(mut self) -> Result<Self, WaxError> {
        let current_len = self.inner.operations.len();
        let last = self.encryption_indices.last_mut().ok_or_else(|| {
            WaxError::new("Mismatch in index types - stop_encrypt called before start_encrypt")
        })?;
        if last.end.is_some() {
            return Err(WaxError::new(format!(
                "Encryption on operation index: #{} for key: {:?} already closed",
                last.begin, last.main_key
            )));
        }
        last.end = Some(current_len);
        Ok(self)
    }

    fn perform_operation_encryption(
        &mut self,
        wallet: &dyn SignatureProvider,
    ) -> Result<(), WaxError> {
        if self.encryption_indices.is_empty() {
            return Ok(());
        }
        let nonce = Some(u64::from(self.inner.ref_block_prefix));
        let total = self.inner.operations.len();
        // Take ownership of the index list up-front so we can iterate while
        // mutably borrowing self.inner. On success we leave it cleared (matches TS).
        let indices = std::mem::take(&mut self.encryption_indices);
        for index in &indices {
            let end = index.end.unwrap_or(total).min(total);
            for op in &mut self.inner.operations[index.begin..end] {
                visit_encryptable(op, EncryptMode::Encrypt, |data| {
                    wallet.encrypt_data(
                        data,
                        &index.main_key,
                        index.other_key.as_deref(),
                        nonce,
                    )
                })?;
            }
        }
        refresh_handle(self);
        Ok(())
    }

    fn decrypt(&mut self, wallet: &dyn SignatureProvider) -> Result<(), WaxError> {
        // decrypt visits every operation; ranges are not consulted. Per TS,
        // only memo-style values that begin with '#' are sent to the wallet —
        // everything else is left untouched.
        let mutated = {
            let mut any = false;
            for op in &mut self.inner.operations {
                visit_encryptable(op, EncryptMode::Decrypt, |data| {
                    if data.starts_with('#') {
                        any = true;
                        // TODO: avoid passing `""`
                        wallet.decrypt_data(data, "", None)
                    } else {
                        Ok(data.to_string())
                    }
                })?;
            }
            any
        };
        if mutated {
            refresh_handle(self);
        }
        Ok(())
    }
}

#[derive(Clone, Copy)]
enum EncryptMode {
    Encrypt,
    Decrypt,
}

/// Apply `crypto` to the single memo-style field on each operation variant we
/// recognize (transfer*, comment, custom_json). The closure is invoked once
/// per encryptable field and its return value replaces the field in-place. On
/// non-encryptable variants this is a no-op.
///
/// For `custom_json_operation` the encrypt direction wraps the result in
/// `{"encrypted": "<ciphertext>"}` and the decrypt direction unwraps the same
/// envelope — matching TS `encryption_visitor.ts`. Custom-json payloads that
/// don't have the envelope are left alone.
fn visit_encryptable<F>(
    op: &mut proto::Operation,
    mode: EncryptMode,
    mut crypto: F,
) -> Result<(), WaxError>
where
    F: FnMut(&str) -> Result<String, WaxError>,
{
    use proto::operation::Value;

    let Some(value) = op.value.as_mut() else {
        return Ok(());
    };
    match value {
        Value::TransferOperation(t) => t.memo = crypto(&t.memo)?,
        Value::TransferToSavingsOperation(t) => t.memo = crypto(&t.memo)?,
        Value::TransferFromSavingsOperation(t) => t.memo = crypto(&t.memo)?,
        Value::RecurrentTransferOperation(t) => t.memo = crypto(&t.memo)?,
        Value::CommentOperation(c) => c.body = crypto(&c.body)?,
        Value::CustomJsonOperation(c) => apply_custom_json_crypto(c, mode, &mut crypto)?,
        _ => {}
    }
    Ok(())
}

const CUSTOM_JSON_ENCRYPTED_KEY: &str = "encrypted";

fn apply_custom_json_crypto<F>(
    op: &mut proto::CustomJson,
    mode: EncryptMode,
    crypto: &mut F,
) -> Result<(), WaxError>
where
    F: FnMut(&str) -> Result<String, WaxError>,
{
    match mode {
        EncryptMode::Encrypt => {
            let ciphertext = crypto(&op.json)?;
            // serde_json::json! handles escaping; manual concat would be fragile.
            op.json = serde_json::json!({ CUSTOM_JSON_ENCRYPTED_KEY: ciphertext }).to_string();
        }
        EncryptMode::Decrypt => {
            // Only unwrap if the payload looks like the envelope produced by
            // the encrypt path. Anything else is treated as already plaintext.
            let parsed: serde_json::Value = match serde_json::from_str(&op.json) {
                Ok(v) => v,
                Err(_) => return Ok(()),
            };
            if let Some(inner) = parsed
                .get(CUSTOM_JSON_ENCRYPTED_KEY)
                .and_then(serde_json::Value::as_str)
            {
                op.json = crypto(inner)?;
            }
        }
    }
    Ok(())
}

fn refresh_handle(tx: &mut RustTransaction) {
    tx.refresh_handle(rust_protocol());
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

fn to_binary_view_output(ffi: RustBinaryData) -> BinaryViewOutputData {
    let nodes = ffi.nodes;
    let offsets = ffi
        .root_indices
        .iter()
        .map(|&idx| build_binary_view_node(&nodes, idx))
        .collect();

    BinaryViewOutputData {
        binary: ffi.binary,
        offsets,
    }
}

fn build_binary_view_node(nodes: &[RustBinaryDataNode], idx: u32) -> BinaryViewNode {
    let node = &nodes[idx as usize];
    let children: Vec<BinaryViewNode> = node
        .child_indices
        .iter()
        .map(|&child| build_binary_view_node(nodes, child))
        .collect();

    match node.node_type.as_str() {
        "scalar" => BinaryViewNode::Scalar {
            key: node.key.clone(),
            offset: node.offset,
            size: node.size,
            value: node.value.clone(),
        },
        "array" => BinaryViewNode::Array {
            key: node.key.clone(),
            offset: node.offset,
            size: node.size,
            length: node.length,
            value: node.value.clone(),
            children,
        },
        // "object" — the C++ producer emits exactly these three discriminants; treat anything
        // else (including any unforeseen future tag) as an object so we don't lose its children.
        _ => BinaryViewNode::Object {
            key: node.key.clone(),
            offset: node.offset,
            size: node.size,
            value: node.value.clone(),
            children,
        },
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
