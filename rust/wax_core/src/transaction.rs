use cxx::UniquePtr;
// `DynamicMessage` impls `prost::Message` from the prost version that
// prost-reflect itself depends on, which may differ from the prost release
// our generated `proto::*` types target. Importing both traits under
// distinct names lets method resolution pick the right one per type.
#[allow(unused_imports)]
use prost::Message as _;
#[allow(unused_imports)]
use prost_reflect::prost::Message as _;
use prost_reflect::DynamicMessage;

use crate::ffi::{hive_transaction_handle, rust_protocol};
use crate::managed_object::{descriptor_pool, RustManagedObject};
use crate::proto;

const TRANSACTION_MESSAGE_NAME: &str = "hive.protocol.buffers.transaction";

pub struct RustTransaction {
    pub inner: proto::Transaction,
    pub handle: UniquePtr<hive_transaction_handle>,
    pub chain_id: String,
}

impl RustTransaction {
    pub fn new(
        protocol: &rust_protocol,
        chain_id: impl Into<String>,
        ref_block_num: u32,
        ref_block_prefix: u32,
        expiration: impl Into<String>,
        operations: Vec<proto::Operation>,
    ) -> Self {
        let inner = proto::Transaction {
            ref_block_num,
            ref_block_prefix,
            expiration: expiration.into(),
            operations,
            extensions: Vec::new(),
            signatures: Vec::new(),
        };
        let handle = create_handle(protocol, &inner);
        Self { inner, handle, chain_id: chain_id.into() }
    }

    pub fn from_proto(
        protocol: &rust_protocol,
        chain_id: impl Into<String>,
        inner: proto::Transaction,
    ) -> Self {
        let handle = create_handle(protocol, &inner);
        Self { inner, handle, chain_id: chain_id.into() }
    }

    pub fn from_json(
        protocol: &rust_protocol,
        chain_id: impl Into<String>,
        json: &str,
    ) -> Result<Self, String> {
        let descriptor = descriptor_pool()
            .get_message_by_name(TRANSACTION_MESSAGE_NAME)
            .expect("missing descriptor for hive.protocol.buffers.transaction");
        let mut deserializer = serde_json::Deserializer::from_str(json);
        let dyn_msg = DynamicMessage::deserialize(descriptor, &mut deserializer)
            .map_err(|e| e.to_string())?;
        deserializer.end().map_err(|e| e.to_string())?;
        let bytes = dyn_msg.encode_to_vec();
        let inner = proto::Transaction::decode(bytes.as_slice()).map_err(|e| e.to_string())?;
        Ok(Self::from_proto(protocol, chain_id, inner))
    }

    pub fn proto(&self) -> &proto::Transaction {
        &self.inner
    }

    pub fn into_proto(self) -> proto::Transaction {
        self.inner
    }

    pub fn to_managed(&self) -> Box<RustManagedObject> {
        RustManagedObject::from_transaction(&self.inner)
    }
}

pub fn transaction_to_canonical_json(tx: &proto::Transaction) -> String {
    let descriptor = descriptor_pool()
        .get_message_by_name(TRANSACTION_MESSAGE_NAME)
        .expect("missing descriptor for hive.protocol.buffers.transaction");
    let bytes = tx.encode_to_vec();
    let dyn_msg = DynamicMessage::decode(descriptor, bytes.as_slice())
        .expect("prost-encoded Transaction must decode under its own descriptor");
    serde_json::to_string(&dyn_msg).expect("DynamicMessage::serialize must produce valid JSON")
}

fn create_handle(
    protocol: &rust_protocol,
    tx: &proto::Transaction,
) -> UniquePtr<hive_transaction_handle> {
    protocol
        .cpp_create_transaction_handle(RustManagedObject::from_transaction(tx))
        .expect("failed to create transaction handle")
}
