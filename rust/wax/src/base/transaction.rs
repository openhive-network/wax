//! The offline transaction type: building, signing, serialization, authority
//! inspection and memo encryption.

use std::collections::HashMap;

use crate::core::ffi::{
    RustAccountAuthorities, RustAuthEntry, RustBinaryData, RustBinaryDataNode,
    RustMinimizeRequiredSignaturesData, RustRequiredAuthorities,
    RustWaxAuthority,
};
use crate::core::{EncryptionIndex, RustOperation, RustTransaction, proto};

use crate::WaxError;
use crate::base::foundation::WaxFoundation;
use crate::base::interfaces::{AuthorityDataProvider, SignatureProvider};
use crate::base::internal::authority::{build_provider, to_rust_authorities};
use crate::base::internal::protocol::rust_protocol;
use crate::base::models::authority::RequiredAuthorities;
use crate::base::models::basic::{
    AccountName, Hex, PublicKey, SigDigest, Signature, TransactionId,
};
use crate::base::operation::{Operation, OperationBuilder};
use crate::base::result::{
    BinaryViewNode, BinaryViewOutputData, MinimizeRequiredSignaturesData,
};

/// Represents a transaction through its full lifecycle: building, signing,
/// serialization, authority inspection and memo encryption. Created by the
/// `create_transaction*` factories on [`WaxFoundation`].
///
/// The chain-bound counterpart adding online checks is
/// [`OnlineTransaction`](crate::OnlineTransaction), which composes this type.
///
/// TS NOTE: the TS `Transaction` class. TS builder methods return `this` for
/// fluent chaining; the Rust builders take `&mut self` (and return
/// `&mut Self`), so a fallible builder never consumes the transaction.
pub struct Transaction {
    pub(crate) inner: RustTransaction,
}

impl Transaction {
    pub(crate) fn from_rust(inner: RustTransaction) -> Self {
        Self { inner }
    }

    /// Appends `op` to this transaction.
    pub fn push_operation(&mut self, op: Operation) -> &mut Self {
        rust_protocol()
            .cpp_tx_add_operation(self.inner.handle.pin_mut(), &op.inner.handle)
            .expect("failed to add operation to transaction");

        self.inner.inner.operations.push(op.inner.inner);

        self
    }

    /// Finalizes `builder` against `foundation` and appends the resulting
    /// operations to this transaction.
    pub fn push_builder(
        &mut self,
        foundation: &WaxFoundation,
        builder: impl OperationBuilder,
    ) -> Result<&mut Self, WaxError> {
        let protocol = rust_protocol();
        for op in builder.finalize(foundation)? {
            let rust_op = RustOperation::from_proto(protocol, op);
            protocol
                .cpp_tx_add_operation(
                    self.inner.handle.pin_mut(),
                    &rust_op.handle,
                )
                .expect("failed to add operation to transaction");
            self.inner.inner.operations.push(rust_op.inner);
        }

        Ok(self)
    }

    /// Appends a precomputed signature to the transaction.
    pub fn add_signature(&mut self, signature: &str) -> Result<(), WaxError> {
        rust_protocol()
            .cpp_tx_add_signature(self.inner.handle.pin_mut(), signature)
            .map_err(WaxError::from)?;

        self.inner.inner.signatures.push(signature.to_string());

        Ok(())
    }

    /// Sets the transaction's expiration timestamp.
    pub fn set_expiration(&mut self, expiration: &str) -> Result<(), WaxError> {
        rust_protocol()
            .cpp_tx_set_expiration(self.inner.handle.pin_mut(), expiration)
            .map_err(WaxError::from)?;

        self.inner.inner.expiration = expiration.to_string();

        Ok(())
    }

    /// Returns whether the transaction carries at least one signature.
    pub fn is_signed(&self) -> bool {
        !self.inner.inner.signatures.is_empty()
    }

    /// Validates the transaction against the protocol rules.
    pub fn validate(&self) -> Result<(), WaxError> {
        rust_protocol()
            .cpp_tx_validate(&self.inner.handle)
            .map_err(WaxError::from)
    }

    /// Returns the HF26 signing digest of the transaction.
    pub fn sig_digest(&self) -> Result<SigDigest, WaxError> {
        rust_protocol()
            .cpp_tx_sig_digest(&self.inner.handle, &self.inner.chain_id)
            .map_err(WaxError::from)
    }

    /// Returns the legacy-serialization signing digest of the transaction.
    pub fn legacy_sig_digest(&self) -> Result<SigDigest, WaxError> {
        rust_protocol()
            .cpp_tx_legacy_sig_digest(&self.inner.handle, &self.inner.chain_id)
            .map_err(WaxError::from)
    }

    /// Returns the HF26 transaction id.
    pub fn id(&self) -> Result<TransactionId, WaxError> {
        rust_protocol()
            .cpp_tx_id(&self.inner.handle)
            .map_err(WaxError::from)
    }

    /// Returns the legacy-serialization transaction id.
    pub fn legacy_id(&self) -> Result<TransactionId, WaxError> {
        rust_protocol()
            .cpp_tx_legacy_id(&self.inner.handle)
            .map_err(WaxError::from)
    }

    /// Converts the transaction into its wire-form hex, optionally stripped
    /// to the unsigned form.
    pub fn to_binary_form(
        &self,
        strip_to_unsigned: bool,
    ) -> Result<Hex, WaxError> {
        rust_protocol()
            .cpp_tx_to_binary(&self.inner.handle, strip_to_unsigned)
            .map_err(WaxError::from)
    }

    /// Returns the HF26 binary view: the wire-form hex plus a parsed AST
    /// annotating each byte range with its field name and type.
    pub fn binary_view_metadata(
        &self,
    ) -> Result<BinaryViewOutputData, WaxError> {
        rust_protocol()
            .cpp_tx_binary_view(&self.inner.handle, true, false)
            .map(to_binary_view_output)
            .map_err(WaxError::from)
    }

    /// Legacy-serialization counterpart to [`Self::binary_view_metadata`].
    pub fn legacy_binary_view_metadata(
        &self,
    ) -> Result<BinaryViewOutputData, WaxError> {
        rust_protocol()
            .cpp_tx_binary_view(&self.inner.handle, false, false)
            .map(to_binary_view_output)
            .map_err(WaxError::from)
    }

    /// Converts the transaction into its HF26 API JSON string.
    pub fn to_api(&self) -> Result<String, WaxError> {
        rust_protocol()
            .cpp_tx_to_json(&self.inner.handle)
            .map_err(WaxError::from)
    }

    /// Same payload as [`Self::to_api`], parsed into a [`serde_json::Value`]
    /// for callers that want structured access without a manual parse step.
    pub fn to_api_json(&self) -> Result<serde_json::Value, WaxError> {
        let raw = self.to_api()?;
        serde_json::from_str(&raw).map_err(|e| WaxError::new(e.to_string()))
    }

    /// Converts the transaction into its legacy API JSON string.
    pub fn to_legacy_api(&self) -> Result<String, WaxError> {
        rust_protocol()
            .cpp_tx_to_legacy_json(&self.inner.handle)
            .map_err(WaxError::from)
    }

    /// Returns the public keys that produced the transaction's signatures.
    pub fn signature_keys(&self) -> Result<Vec<PublicKey>, WaxError> {
        rust_protocol()
            .cpp_tx_signature_keys(&self.inner.handle, &self.inner.chain_id)
            .map_err(WaxError::from)
    }

    /// Legacy-serialization counterpart to [`Self::signature_keys`].
    pub fn legacy_signature_keys(&self) -> Result<Vec<PublicKey>, WaxError> {
        rust_protocol()
            .cpp_tx_legacy_signature_keys(
                &self.inner.handle,
                &self.inner.chain_id,
            )
            .map_err(WaxError::from)
    }

    /// Returns the accounts impacted by the transaction's operations.
    pub fn impacted_accounts(&self) -> Result<Vec<AccountName>, WaxError> {
        rust_protocol()
            .cpp_tx_impacted_accounts(&self.inner.handle)
            .map_err(WaxError::from)
    }

    /// Returns the authorities the transaction requires to be signed.
    pub fn required_authorities(
        &self,
    ) -> Result<RequiredAuthorities, WaxError> {
        rust_protocol()
            .cpp_tx_required_authorities(&self.inner.handle)
            .map(to_required_authorities)
            .map_err(WaxError::from)
    }

    /// Collects the signing keys needed to satisfy the transaction's
    /// authorities, resolving them through `provider`.
    pub fn collect_signing_keys(
        &self,
        provider: &dyn AuthorityDataProvider,
    ) -> Result<Vec<PublicKey>, WaxError> {
        let core_provider = build_provider(provider);
        rust_protocol()
            .cpp_tx_collect_signing_keys(&self.inner.handle, &core_provider)
            .map_err(WaxError::from)
    }

    /// Returns the minimal set of signing keys that still satisfies the
    /// transaction's authorities, subject to the limits in `data`.
    pub fn minimize_required_signatures(
        &self,
        data: &MinimizeRequiredSignaturesData,
        provider: &dyn AuthorityDataProvider,
    ) -> Result<Vec<PublicKey>, WaxError> {
        let core_provider = build_provider(provider);
        let ffi_data = to_rust_minimize_data(data);

        rust_protocol()
            .cpp_minimize_required_signatures(
                &self.inner.handle,
                &ffi_data,
                &core_provider,
            )
            .map_err(WaxError::from)
    }

    /// Returns the underlying [`proto::Transaction`] mirror.
    pub fn transaction(&self) -> &proto::Transaction {
        self.inner.proto()
    }

    /// Convenience: compute the transaction's `sig_digest`, ask `wallet` to
    /// sign it with the private key matching `public_key`, append the result
    /// to this transaction, and return it.
    ///
    /// To sign with multiple keys, call this once per key.
    pub fn sign(
        &mut self,
        wallet: &dyn SignatureProvider,
        public_key: &str,
    ) -> Result<Signature, WaxError> {
        self.validate()?;
        let digest = self.sig_digest()?;
        let signature = wallet.sign_digest(public_key, &digest)?;
        self.add_signature(&signature)?;

        Ok(signature)
    }

    /// Opens an encryption range. Operations pushed (or already at) the
    /// current end of the transaction will be encrypted by the next
    /// `perform_operation_encryption` call. Multiple ranges may be opened
    /// sequentially, each with its own key(s).
    ///
    /// `main_key` is the principal recipient public key; `other_key` is an
    /// optional second recipient (memo-style two-party encryption).
    pub fn start_encrypt(
        &mut self,
        main_key: &str,
        other_key: Option<&str>,
    ) -> &mut Self {
        let begin = self.inner.inner.operations.len();
        self.inner.encryption_indices.push(EncryptionIndex {
            main_key: main_key.to_string(),
            other_key: other_key.map(str::to_string),
            begin,
            end: None,
        });

        self
    }

    /// Closes the most recently opened encryption range. Errors if no range
    /// is open or the latest range is already closed.
    pub fn stop_encrypt(&mut self) -> Result<&mut Self, WaxError> {
        let current_len = self.inner.inner.operations.len();
        let last =
            self.inner.encryption_indices.last_mut().ok_or_else(|| {
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

    /// Walks each tracked encryption range and encrypts the memo-style field
    /// on the operations it covers, using `wallet.encrypt_data` with the
    /// range's keys and the transaction's `ref_block_prefix` as the nonce.
    /// The C++ transaction handle is rebuilt from the mutated proto, and all
    /// ranges are cleared on success.
    ///
    /// The affected fields are: `transfer.memo`, `transfer_to_savings.memo`,
    /// `transfer_from_savings.memo`, `recurrent_transfer.memo`,
    /// `comment.body`, and `custom_json.json` (which is wrapped as
    /// `{"encrypted": "<ciphertext>"}`). Operations without an encryptable
    /// field are skipped silently.
    pub fn perform_operation_encryption(
        &mut self,
        wallet: &dyn SignatureProvider,
    ) -> Result<(), WaxError> {
        let tx = &mut self.inner;
        if tx.encryption_indices.is_empty() {
            return Ok(());
        }

        let nonce = Some(u64::from(tx.inner.ref_block_prefix));
        let total = tx.inner.operations.len();
        // Take ownership of the index list up-front so we can iterate while
        // mutably borrowing the proto. On success we leave it cleared
        // (matches TS).
        let indices = std::mem::take(&mut tx.encryption_indices);
        for index in &indices {
            let end = index.end.unwrap_or(total).min(total);
            for op in &mut tx.inner.operations[index.begin..end] {
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
        tx.refresh_handle(rust_protocol());

        Ok(())
    }

    /// Walks every operation on the transaction and, for memo-style fields
    /// whose value starts with `#` (the encrypted marker used by hived),
    /// decrypts it via `wallet.decrypt_data`. Plaintext fields and operations
    /// without an encryptable field are left untouched. The C++ transaction
    /// handle is rebuilt from the mutated proto on success.
    pub fn decrypt(
        &mut self,
        wallet: &dyn SignatureProvider,
    ) -> Result<(), WaxError> {
        // decrypt visits every operation; ranges are not consulted. Per TS,
        // only memo-style values that begin with '#' are sent to the wallet —
        // everything else is left untouched.
        let tx = &mut self.inner;
        let mutated = {
            let mut any = false;
            for op in &mut tx.inner.operations {
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
            tx.refresh_handle(rust_protocol());
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
        Value::CustomJsonOperation(c) => {
            apply_custom_json_crypto(c, mode, &mut crypto)?
        }
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
            op.json =
                serde_json::json!({ CUSTOM_JSON_ENCRYPTED_KEY: ciphertext })
                    .to_string();
        }
        EncryptMode::Decrypt => {
            // Only unwrap if the payload looks like the envelope produced by
            // the encrypt path. Anything else is treated as already plaintext.
            let parsed: serde_json::Value = match serde_json::from_str(&op.json)
            {
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
    let (max_account_auths, has_max_account_auths) =
        match data.max_account_auths {
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
        allow_strict_and_mixed_authorities: data
            .allow_strict_and_mixed_authorities,
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

pub(crate) fn to_binary_view_output(
    ffi: RustBinaryData,
) -> BinaryViewOutputData {
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

fn build_binary_view_node(
    nodes: &[RustBinaryDataNode],
    idx: u32,
) -> BinaryViewNode {
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

fn to_required_authorities(
    ffi: RustRequiredAuthorities,
) -> RequiredAuthorities {
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
