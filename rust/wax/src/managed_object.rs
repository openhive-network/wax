//! Runtime-typed view of a hive protocol message for the cxx bridge.
//!
//! `RustManagedObject` plays the same role for the Rust bridge that
//! `python_managed_object` plays for the Cython bridge and
//! `emscripten_managed_object` plays for the WASM bridge: a thin wrapper
//! around a protobuf-shaped payload that the core/ visitor system can poke
//! field-by-field via `operator[]("field_name")`, `as<T>()`, etc.
//!
//! The Rust side stores a [`prost_reflect::Value`] (which can be a
//! `DynamicMessage`, list, map, or scalar). The C++ side holds a
//! `rust::Box<RustManagedObject>` and forwards every method call back into
//! Rust through cxx callbacks.

use std::sync::OnceLock;

use prost::Message;
use prost_reflect::{DescriptorPool, DynamicMessage, MapKey, MessageDescriptor, ReflectMessage, Value};

use crate::proto;

const FILE_DESCRIPTOR_SET: &[u8] =
    include_bytes!("../../protobuf_patterns/hive.protocol.buffers.bin");

/// Process-wide descriptor pool, lazily built from the FileDescriptorSet
/// emitted by `proto_builder`.
pub fn descriptor_pool() -> &'static DescriptorPool {
    static POOL: OnceLock<DescriptorPool> = OnceLock::new();
    POOL.get_or_init(|| {
        DescriptorPool::decode(FILE_DESCRIPTOR_SET)
            .expect("hive.protocol.buffers.bin must be a valid FileDescriptorSet")
    })
}

fn message_descriptor(full_name: &str) -> MessageDescriptor {
    descriptor_pool()
        .get_message_by_name(full_name)
        .unwrap_or_else(|| panic!("missing descriptor for {full_name}"))
}

/// Build a `DynamicMessage` for a typed prost message by round-tripping
/// through the wire format.
fn dynamic_from_prost<M: Message>(msg: &M, full_name: &str) -> DynamicMessage {
    let bytes = msg.encode_to_vec();
    DynamicMessage::decode(message_descriptor(full_name), bytes.as_slice())
        .expect("prost message must decode under its own descriptor")
}

/// Runtime view of a hive protocol payload at one level of nesting.
///
/// Mirrors what `python_managed_object` carries: either a message, a list
/// (repeated field), a map, or a scalar.
pub struct RustManagedObject {
    value: Value,
    /// Owning descriptor for the current message, when [`value`] is a
    /// `Message`. Lets us answer `is_optional_field_present` and walk
    /// oneofs without consulting the pool again.
    descriptor: Option<MessageDescriptor>,
}

impl RustManagedObject {
    pub fn from_operation(op: &proto::Operation) -> Box<RustManagedObject> {
        let dm = dynamic_from_prost(op, "hive.protocol.buffers.operation");
        Box::new(Self::from_message(dm))
    }

    pub fn from_transaction(tx: &proto::Transaction) -> Box<RustManagedObject> {
        let dm = dynamic_from_prost(tx, "hive.protocol.buffers.transaction");
        Box::new(Self::from_message(dm))
    }

    pub fn from_message(msg: DynamicMessage) -> Self {
        let descriptor = Some(msg.descriptor());
        Self {
            value: Value::Message(msg),
            descriptor,
        }
    }

    fn from_value(value: Value) -> Self {
        let descriptor = match &value {
            Value::Message(m) => Some(m.descriptor()),
            _ => None,
        };
        Self { value, descriptor }
    }

    /// Field access by name. For a message, returns the named field's value
    /// (or the field's default if it isn't set). For a map keyed by string,
    /// returns the value at that key. For a list whose key parses as an
    /// integer, defers to indexed access (mirrors python_managed_object).
    pub fn get_field(&self, key: &str) -> Box<RustManagedObject> {
        match &self.value {
            Value::Message(m) => {
                let field = m
                    .descriptor()
                    .get_field_by_name(key)
                    .unwrap_or_else(|| panic!("no field '{key}' on {}", m.descriptor().full_name()));
                let value = m.get_field(&field).into_owned();
                Box::new(Self::from_value(value))
            }
            Value::Map(map) => {
                let mk = MapKey::String(key.to_string());
                let v = map
                    .get(&mk)
                    .cloned()
                    .unwrap_or_else(|| panic!("map key '{key}' not present"));
                Box::new(Self::from_value(v))
            }
            Value::List(list) => {
                let idx: usize = key
                    .parse()
                    .unwrap_or_else(|_| panic!("list indexed by non-integer key '{key}'"));
                Box::new(Self::from_value(list[idx].clone()))
            }
            _ => panic!("get_field('{key}') called on a scalar value"),
        }
    }

    pub fn get_index(&self, idx: usize) -> Box<RustManagedObject> {
        match &self.value {
            Value::List(list) => Box::new(Self::from_value(list[idx].clone())),
            _ => panic!("get_index({idx}) called on a non-list"),
        }
    }

    pub fn array_length(&self) -> usize {
        match &self.value {
            Value::List(list) => list.len(),
            Value::Map(map) => map.len(),
            _ => panic!("array_length() called on a non-collection"),
        }
    }

    pub fn is_undefined(&self) -> bool {
        // prost-reflect has no explicit "none" value: messages whose oneof
        // is unset surface as a Message with no fields populated. Treat
        // default-everywhere messages as defined; only an explicit empty
        // string scalar with no descriptor maps to "undefined" via the
        // python parallel.
        false
    }

    pub fn is_string(&self) -> bool {
        matches!(&self.value, Value::String(_))
    }

    /// For a oneof-bearing message (notably `Operation`), return the
    /// variant name that is currently populated. The `field_name` argument
    /// is the name of the oneof on the parent message ("value" in the
    /// hive Operation case). Mirrors python's
    /// `WhichOneof("value")` and python_managed_object::get_underlying_sv_type.
    pub fn oneof_variant(&self) -> String {
        match &self.value {
            Value::Message(m) => {
                let desc = m.descriptor();
                for oneof in desc.oneofs() {
                    for field in oneof.fields() {
                        if m.has_field(&field) {
                            return field.name().to_string();
                        }
                    }
                }
                String::new()
            }
            Value::Map(map) => {
                // python's fallback path: first key of a static-variant map
                map.keys()
                    .next()
                    .map(|k| match k {
                        MapKey::String(s) => s.clone(),
                        other => format!("{other:?}"),
                    })
                    .unwrap_or_default()
            }
            _ => String::new(),
        }
    }

    /// Names of every key in a string-keyed map. Matches
    /// python_managed_object::get_map_keys.
    pub fn map_keys(&self) -> Vec<String> {
        match &self.value {
            Value::Map(map) => map
                .keys()
                .map(|k| match k {
                    MapKey::String(s) => s.clone(),
                    other => format!("{other:?}"),
                })
                .collect(),
            _ => Vec::new(),
        }
    }

    /// Whether an *optional* field is explicitly present on the underlying
    /// message. For required/repeated fields this returns true unconditionally
    /// — matches python_managed_object semantics.
    pub fn is_optional_field_present(&self, name: &str) -> bool {
        match (&self.value, &self.descriptor) {
            (Value::Message(m), Some(_)) => {
                let Some(field) = m.descriptor().get_field_by_name(name) else {
                    return false;
                };
                if !field.supports_presence() {
                    // required or repeated: always considered present
                    return true;
                }
                m.has_field(&field)
            }
            (Value::Map(map), _) => map.contains_key(&MapKey::String(name.to_string())),
            _ => false,
        }
    }

    pub fn as_string(&self) -> String {
        match &self.value {
            Value::String(s) => s.clone(),
            Value::Bytes(b) => String::from_utf8_lossy(b).into_owned(),
            Value::EnumNumber(n) => n.to_string(),
            other => panic!("as_string called on non-string value: {other:?}"),
        }
    }

    pub fn as_bool(&self) -> bool {
        match &self.value {
            Value::Bool(b) => *b,
            other => panic!("as_bool called on non-bool value: {other:?}"),
        }
    }

    pub fn as_i64(&self) -> i64 {
        match &self.value {
            Value::I32(n) => *n as i64,
            Value::I64(n) => *n,
            Value::U32(n) => *n as i64,
            Value::U64(n) => *n as i64,
            Value::EnumNumber(n) => *n as i64,
            other => panic!("as_i64 called on non-integer value: {other:?}"),
        }
    }

    pub fn as_i32(&self) -> i32 {
        self.as_i64() as i32
    }

    pub fn as_i16(&self) -> i16 {
        self.as_i64() as i16
    }

    pub fn as_i8(&self) -> i8 {
        self.as_i64() as i8
    }

    pub fn as_u64(&self) -> u64 {
        match &self.value {
            Value::U32(n) => *n as u64,
            Value::U64(n) => *n,
            Value::I32(n) if *n >= 0 => *n as u64,
            Value::I64(n) if *n >= 0 => *n as u64,
            other => panic!("as_u64 called on non-unsigned value: {other:?}"),
        }
    }

    pub fn as_u32(&self) -> u32 {
        self.as_u64() as u32
    }

    pub fn as_u16(&self) -> u16 {
        self.as_u64() as u16
    }

    pub fn as_u8(&self) -> u8 {
        self.as_u64() as u8
    }
}

// cxx bridge callback shims. Each takes &RustManagedObject + the args the
// C++ side has; the C++ rust_managed_object class is a thin forwarder.

pub(crate) fn rmo_get_field(obj: &RustManagedObject, key: &str) -> Box<RustManagedObject> {
    obj.get_field(key)
}
pub(crate) fn rmo_get_index(obj: &RustManagedObject, idx: usize) -> Box<RustManagedObject> {
    obj.get_index(idx)
}
pub(crate) fn rmo_array_length(obj: &RustManagedObject) -> usize {
    obj.array_length()
}
pub(crate) fn rmo_is_undefined(obj: &RustManagedObject) -> bool {
    obj.is_undefined()
}
pub(crate) fn rmo_is_string(obj: &RustManagedObject) -> bool {
    obj.is_string()
}
pub(crate) fn rmo_is_optional_field_present(obj: &RustManagedObject, name: &str) -> bool {
    obj.is_optional_field_present(name)
}
pub(crate) fn rmo_oneof_variant(obj: &RustManagedObject) -> String {
    obj.oneof_variant()
}
pub(crate) fn rmo_map_keys(obj: &RustManagedObject) -> Vec<String> {
    obj.map_keys()
}
pub(crate) fn rmo_as_string(obj: &RustManagedObject) -> String {
    obj.as_string()
}
pub(crate) fn rmo_as_bool(obj: &RustManagedObject) -> bool {
    obj.as_bool()
}
pub(crate) fn rmo_as_i64(obj: &RustManagedObject) -> i64 {
    obj.as_i64()
}
pub(crate) fn rmo_as_i32(obj: &RustManagedObject) -> i32 {
    obj.as_i32()
}
pub(crate) fn rmo_as_i16(obj: &RustManagedObject) -> i16 {
    obj.as_i16()
}
pub(crate) fn rmo_as_i8(obj: &RustManagedObject) -> i8 {
    obj.as_i8()
}
pub(crate) fn rmo_as_u64(obj: &RustManagedObject) -> u64 {
    obj.as_u64()
}
pub(crate) fn rmo_as_u32(obj: &RustManagedObject) -> u32 {
    obj.as_u32()
}
pub(crate) fn rmo_as_u16(obj: &RustManagedObject) -> u16 {
    obj.as_u16()
}
pub(crate) fn rmo_as_u8(obj: &RustManagedObject) -> u8 {
    obj.as_u8()
}
