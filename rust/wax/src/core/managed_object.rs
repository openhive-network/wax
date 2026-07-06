use std::cell::RefCell;
use std::rc::Rc;
use std::sync::OnceLock;

use prost::Message;
use prost_reflect::{
    DescriptorPool, DynamicMessage, MapKey, MessageDescriptor, ReflectMessage,
    Value,
};

use crate::core::proto;

const FILE_DESCRIPTOR_SET: &[u8] =
    include_bytes!(concat!(env!("CARGO_MANIFEST_DIR"), "/proto/hive.protocol.buffers.bin"));

/// Returns the process-wide protobuf descriptor pool, decoding it from the
/// embedded `FileDescriptorSet` on first use.
pub fn descriptor_pool() -> &'static DescriptorPool {
    static POOL: OnceLock<DescriptorPool> = OnceLock::new();
    POOL.get_or_init(|| {
        DescriptorPool::decode(FILE_DESCRIPTOR_SET).expect(
            "hive.protocol.buffers.bin must be a valid FileDescriptorSet",
        )
    })
}

fn message_descriptor(full_name: &str) -> MessageDescriptor {
    descriptor_pool()
        .get_message_by_name(full_name)
        .unwrap_or_else(|| panic!("missing descriptor for {full_name}"))
}

fn dynamic_from_prost<M: Message>(msg: &M, full_name: &str) -> DynamicMessage {
    let bytes = msg.encode_to_vec();
    DynamicMessage::decode(message_descriptor(full_name), bytes.as_slice())
        .expect("prost message must decode under its own descriptor")
}

// ---------------------------------------------------------------------------
// JSON-backed tree.
//
// `to_proto_visitor` walks a managed object and mutates it in place — most
// notably it rewrites each operation's API-shape `{ "type": "X", "value": {…} }`
// envelope into proto-shape `{ "X": {…} }`. In TS/Python that aliases via
// reference semantics: `nextval = jsval["value"]; jsval.set("X", nextval);
// jsval.del("value")` leaves `nextval` still pointing at the moved payload.
// To mirror that in Rust the tree shares nodes via `Rc<RefCell<…>>`, so every
// `RustManagedObject` (handle) referencing a sub-object stays valid through
// arbitrary mutations of its parent.
// ---------------------------------------------------------------------------

type Node = Rc<RefCell<NodeValue>>;

#[derive(Debug)]
enum NodeValue {
    Null,
    Bool(bool),
    Number(serde_json::Number),
    String(String),
    Array(Vec<Node>),
    Object(Vec<(String, Node)>),
}

fn new_node(v: NodeValue) -> Node {
    Rc::new(RefCell::new(v))
}

fn json_value_to_node(v: serde_json::Value) -> Node {
    match v {
        serde_json::Value::Null => new_node(NodeValue::Null),
        serde_json::Value::Bool(b) => new_node(NodeValue::Bool(b)),
        serde_json::Value::Number(n) => new_node(NodeValue::Number(n)),
        serde_json::Value::String(s) => new_node(NodeValue::String(s)),
        serde_json::Value::Array(arr) => new_node(NodeValue::Array(
            arr.into_iter().map(json_value_to_node).collect(),
        )),
        serde_json::Value::Object(map) => new_node(NodeValue::Object(
            map.into_iter()
                .map(|(k, v)| (k, json_value_to_node(v)))
                .collect(),
        )),
    }
}

fn node_to_json_value(node: &Node) -> serde_json::Value {
    match &*node.borrow() {
        NodeValue::Null => serde_json::Value::Null,
        NodeValue::Bool(b) => serde_json::Value::Bool(*b),
        NodeValue::Number(n) => serde_json::Value::Number(n.clone()),
        NodeValue::String(s) => serde_json::Value::String(s.clone()),
        NodeValue::Array(arr) => serde_json::Value::Array(
            arr.iter().map(node_to_json_value).collect(),
        ),
        NodeValue::Object(entries) => {
            let mut map = serde_json::Map::with_capacity(entries.len());
            for (k, child) in entries {
                map.insert(k.clone(), node_to_json_value(child));
            }
            serde_json::Value::Object(map)
        }
    }
}

// ---------------------------------------------------------------------------
// RustManagedObject
// ---------------------------------------------------------------------------

#[derive(Debug)]
enum Backing {
    Proto {
        value: Value,
        descriptor: Option<MessageDescriptor>,
    },
    Json(Node),
}

/// Represents a dynamically-typed value handed to and from the C++ protocol
/// visitors. It is backed either by a reflected proto value or by a shared
/// JSON tree; the JSON backing aliases nodes via `Rc<RefCell<…>>` to mirror
/// the reference semantics relied on by the TS/Python implementations.
#[derive(Debug)]
pub struct RustManagedObject {
    backing: Backing,
}

impl Clone for RustManagedObject {
    fn clone(&self) -> Self {
        match &self.backing {
            Backing::Proto { value, descriptor } => Self {
                backing: Backing::Proto {
                    value: value.clone(),
                    descriptor: descriptor.clone(),
                },
            },
            // Sharing is intentional: copies of a JSON handle alias the same
            // tree node so mutations made through one copy are visible through
            // the others (matches JS/Python reference semantics).
            Backing::Json(node) => Self {
                backing: Backing::Json(Rc::clone(node)),
            },
        }
    }
}

impl RustManagedObject {
    // --- Proto-backed constructors (existing) ---------------------------

    /// Creates a proto-backed managed object from an operation.
    pub fn from_operation(op: &proto::Operation) -> Box<RustManagedObject> {
        let dm = dynamic_from_prost(op, "hive.protocol.buffers.operation");
        Box::new(Self::from_message(dm))
    }

    /// Creates a proto-backed managed object from a transaction.
    pub fn from_transaction(tx: &proto::Transaction) -> Box<RustManagedObject> {
        let dm = dynamic_from_prost(tx, "hive.protocol.buffers.transaction");
        Box::new(Self::from_message(dm))
    }

    /// Creates a proto-backed managed object from a reflected message.
    pub fn from_message(msg: DynamicMessage) -> Self {
        let descriptor = Some(msg.descriptor());
        Self {
            backing: Backing::Proto {
                value: Value::Message(msg),
                descriptor,
            },
        }
    }

    fn from_value(value: Value) -> Self {
        let descriptor = match &value {
            Value::Message(m) => Some(m.descriptor()),
            _ => None,
        };
        Self {
            backing: Backing::Proto { value, descriptor },
        }
    }

    // --- JSON-backed constructors (new) ---------------------------------

    /// Creates a JSON-backed managed object by parsing a JSON string.
    pub fn from_json_str(json: &str) -> Result<Box<RustManagedObject>, String> {
        let v: serde_json::Value =
            serde_json::from_str(json).map_err(|e| e.to_string())?;
        Ok(Box::new(Self {
            backing: Backing::Json(json_value_to_node(v)),
        }))
    }

    fn from_node(node: Node) -> Self {
        Self {
            backing: Backing::Json(node),
        }
    }

    /// Creates an empty JSON-backed managed object (an empty object).
    pub fn new_object() -> Box<RustManagedObject> {
        Box::new(Self {
            backing: Backing::Json(new_node(NodeValue::Object(Vec::new()))),
        })
    }

    /// Converts a JSON-backed managed object into its JSON string form.
    pub fn to_json_string(&self) -> Result<String, String> {
        match &self.backing {
            Backing::Json(node) => {
                serde_json::to_string(&node_to_json_value(node))
                    .map_err(|e| e.to_string())
            }
            Backing::Proto { .. } => Err(
                "to_json_string only supported for JSON-backed managed objects"
                    .into(),
            ),
        }
    }

    // --- Read API (dispatches on backing) -------------------------------

    /// Returns the named field (or map/array entry) as a managed object.
    pub fn get_field(&self, key: &str) -> Box<RustManagedObject> {
        match &self.backing {
            Backing::Proto { value, .. } => match value {
                Value::Message(m) => {
                    // C++ callers (the `val_protocol_visitor` / `to_proto_visitor`
                    // running on a Proto-backed RMO inside `cpp_create_transaction_handle`)
                    // use C++ struct field names, which match the proto field's
                    // `json_name` rather than its proto name (e.g. `transfer.from`
                    // → proto `from_account` with `json_name = "from"`). Fall back
                    // to the json_name lookup so both naming conventions resolve.
                    let descriptor = m.descriptor();
                    let field = descriptor
                        .get_field_by_name(key)
                        .or_else(|| descriptor.get_field_by_json_name(key))
                        .unwrap_or_else(|| {
                            panic!(
                                "no field '{key}' on {}",
                                descriptor.full_name()
                            )
                        });
                    let value = m.get_field(&field).into_owned();
                    Box::new(Self::from_value(value))
                }
                Value::Map(map) => {
                    let mk = MapKey::String(key.to_string());
                    let v = map.get(&mk).cloned().unwrap_or_else(|| {
                        panic!("map key '{key}' not present")
                    });
                    Box::new(Self::from_value(v))
                }
                Value::List(list) => {
                    let idx: usize = key.parse().unwrap_or_else(|_| {
                        panic!("list indexed by non-integer key '{key}'")
                    });
                    Box::new(Self::from_value(list[idx].clone()))
                }
                _ => panic!("get_field('{key}') called on a scalar value"),
            },
            Backing::Json(node) => {
                let borrow = node.borrow();
                match &*borrow {
                    NodeValue::Object(entries) => {
                        if let Some((_, child)) =
                            entries.iter().find(|(k, _)| k == key)
                        {
                            Box::new(Self::from_node(Rc::clone(child)))
                        } else {
                            // Match emscripten's `jsval[missing] -> undefined`
                            // behaviour: hand back a Null node so callers can
                            // inspect it via `is_undefined()` etc.
                            Box::new(Self::from_node(new_node(NodeValue::Null)))
                        }
                    }
                    NodeValue::Array(arr) => {
                        let idx: usize = key.parse().unwrap_or_else(|_| {
                            panic!(
                                "JSON array indexed by non-integer key '{key}'"
                            )
                        });
                        Box::new(Self::from_node(Rc::clone(&arr[idx])))
                    }
                    _ => panic!("get_field('{key}') on JSON scalar"),
                }
            }
        }
    }

    /// Returns the list element at `idx` as a managed object.
    pub fn get_index(&self, idx: usize) -> Box<RustManagedObject> {
        match &self.backing {
            Backing::Proto { value, .. } => match value {
                Value::List(list) => {
                    Box::new(Self::from_value(list[idx].clone()))
                }
                _ => panic!("get_index({idx}) called on a non-list"),
            },
            Backing::Json(node) => {
                let borrow = node.borrow();
                match &*borrow {
                    NodeValue::Array(arr) => {
                        Box::new(Self::from_node(Rc::clone(&arr[idx])))
                    }
                    _ => panic!(
                        "get_index({idx}) called on a non-list JSON node"
                    ),
                }
            }
        }
    }

    /// Returns the number of elements in a list, or entries in a map/object.
    pub fn array_length(&self) -> usize {
        match &self.backing {
            Backing::Proto { value, .. } => match value {
                Value::List(list) => list.len(),
                Value::Map(map) => map.len(),
                _ => panic!("array_length() called on a non-collection"),
            },
            Backing::Json(node) => match &*node.borrow() {
                NodeValue::Array(arr) => arr.len(),
                NodeValue::Object(entries) => entries.len(),
                _ => panic!(
                    "array_length() called on a non-collection JSON node"
                ),
            },
        }
    }

    /// Returns whether the value is undefined (a JSON null / missing field).
    pub fn is_undefined(&self) -> bool {
        match &self.backing {
            Backing::Proto { .. } => false,
            Backing::Json(node) => matches!(&*node.borrow(), NodeValue::Null),
        }
    }

    /// Returns whether the value is a string.
    pub fn is_string(&self) -> bool {
        match &self.backing {
            Backing::Proto { value, .. } => matches!(value, Value::String(_)),
            Backing::Json(node) => {
                matches!(&*node.borrow(), NodeValue::String(_))
            }
        }
    }

    /// Returns the name of the active oneof variant (or first present key).
    pub fn oneof_variant(&self) -> String {
        match &self.backing {
            Backing::Proto { value, .. } => match value {
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
                Value::Map(map) => map
                    .keys()
                    .next()
                    .map(|k| match k {
                        MapKey::String(s) => s.clone(),
                        other => format!("{other:?}"),
                    })
                    .unwrap_or_default(),
                _ => String::new(),
            },
            Backing::Json(node) => match &*node.borrow() {
                NodeValue::Object(entries) => {
                    entries.first().map(|(k, _)| k.clone()).unwrap_or_default()
                }
                _ => String::new(),
            },
        }
    }

    /// Returns the keys of a map or object value.
    pub fn map_keys(&self) -> Vec<String> {
        match &self.backing {
            Backing::Proto { value, .. } => match value {
                Value::Map(map) => map
                    .keys()
                    .map(|k| match k {
                        MapKey::String(s) => s.clone(),
                        other => format!("{other:?}"),
                    })
                    .collect(),
                _ => Vec::new(),
            },
            Backing::Json(node) => match &*node.borrow() {
                NodeValue::Object(entries) => {
                    entries.iter().map(|(k, _)| k.clone()).collect()
                }
                _ => Vec::new(),
            },
        }
    }

    /// Returns whether an optional field is present on the value.
    pub fn is_optional_field_present(&self, name: &str) -> bool {
        match &self.backing {
            Backing::Proto { value, descriptor } => match (value, descriptor) {
                (Value::Message(m), Some(_)) => {
                    let desc = m.descriptor();
                    // Same name-vs-json_name fallback as `get_field` — see
                    // the comment there for rationale.
                    let Some(field) = desc
                        .get_field_by_name(name)
                        .or_else(|| desc.get_field_by_json_name(name))
                    else {
                        return false;
                    };
                    if !field.supports_presence() {
                        return true;
                    }
                    m.has_field(&field)
                }
                (Value::Map(map), _) => {
                    map.contains_key(&MapKey::String(name.to_string()))
                }
                _ => false,
            },
            Backing::Json(node) => match &*node.borrow() {
                NodeValue::Object(entries) => {
                    entries.iter().any(|(k, _)| k == name)
                }
                _ => false,
            },
        }
    }

    // --- Scalar conversions ---------------------------------------------

    /// Converts the value into a [`String`].
    pub fn as_string(&self) -> String {
        match &self.backing {
            Backing::Proto { value, .. } => match value {
                Value::String(s) => s.clone(),
                Value::Bytes(b) => String::from_utf8_lossy(b).into_owned(),
                Value::EnumNumber(n) => n.to_string(),
                other => {
                    panic!("as_string called on non-string value: {other:?}")
                }
            },
            Backing::Json(node) => match &*node.borrow() {
                NodeValue::String(s) => s.clone(),
                NodeValue::Number(n) => n.to_string(),
                other => panic!(
                    "as_string called on non-string JSON node: {other:?}"
                ),
            },
        }
    }

    /// Converts the value into a [`bool`].
    pub fn as_bool(&self) -> bool {
        match &self.backing {
            Backing::Proto { value, .. } => match value {
                Value::Bool(b) => *b,
                other => panic!("as_bool called on non-bool value: {other:?}"),
            },
            Backing::Json(node) => match &*node.borrow() {
                NodeValue::Bool(b) => *b,
                other => {
                    panic!("as_bool called on non-bool JSON node: {other:?}")
                }
            },
        }
    }

    /// Converts the value into an [`i64`].
    pub fn as_i64(&self) -> i64 {
        match &self.backing {
            Backing::Proto { value, .. } => match value {
                Value::I32(n) => *n as i64,
                Value::I64(n) => *n,
                Value::U32(n) => *n as i64,
                Value::U64(n) => *n as i64,
                Value::EnumNumber(n) => *n as i64,
                other => {
                    panic!("as_i64 called on non-integer value: {other:?}")
                }
            },
            Backing::Json(node) => match &*node.borrow() {
                NodeValue::Number(n) => n
                    .as_i64()
                    .or_else(|| n.as_u64().map(|u| u as i64))
                    .or_else(|| n.as_f64().map(|f| f as i64))
                    .expect("number is convertible to i64"),
                NodeValue::String(s) => s.parse::<i64>().unwrap_or_else(|_| {
                    panic!("as_i64 called on non-numeric string '{s}'")
                }),
                other => {
                    panic!("as_i64 called on non-integer JSON node: {other:?}")
                }
            },
        }
    }

    /// Converts the value into an [`i64`] and narrows it to an [`i32`].
    pub fn as_i32(&self) -> i32 {
        self.as_i64() as i32
    }

    /// Converts the value into an [`i64`] and narrows it to an [`i16`].
    pub fn as_i16(&self) -> i16 {
        self.as_i64() as i16
    }

    /// Converts the value into an [`i64`] and narrows it to an [`i8`].
    pub fn as_i8(&self) -> i8 {
        self.as_i64() as i8
    }

    /// Converts the value into a [`u64`].
    pub fn as_u64(&self) -> u64 {
        match &self.backing {
            Backing::Proto { value, .. } => match value {
                Value::U32(n) => *n as u64,
                Value::U64(n) => *n,
                Value::I32(n) if *n >= 0 => *n as u64,
                Value::I64(n) if *n >= 0 => *n as u64,
                other => {
                    panic!("as_u64 called on non-unsigned value: {other:?}")
                }
            },
            Backing::Json(node) => match &*node.borrow() {
                NodeValue::Number(n) => n
                    .as_u64()
                    .or_else(|| {
                        n.as_i64().and_then(|i| {
                            if i >= 0 { Some(i as u64) } else { None }
                        })
                    })
                    .expect("number is convertible to u64"),
                NodeValue::String(s) => s.parse::<u64>().unwrap_or_else(|_| {
                    panic!("as_u64 called on non-numeric string '{s}'")
                }),
                other => {
                    panic!("as_u64 called on non-integer JSON node: {other:?}")
                }
            },
        }
    }

    /// Converts the value into a [`u64`] and narrows it to a [`u32`].
    pub fn as_u32(&self) -> u32 {
        self.as_u64() as u32
    }

    /// Converts the value into a [`u64`] and narrows it to a [`u16`].
    pub fn as_u16(&self) -> u16 {
        self.as_u64() as u16
    }

    /// Converts the value into a [`u64`] and narrows it to a [`u8`].
    pub fn as_u8(&self) -> u8 {
        self.as_u64() as u8
    }

    // --- Mutating API (JSON mode only) ----------------------------------

    fn json_node(&self) -> &Node {
        match &self.backing {
            Backing::Json(n) => n,
            Backing::Proto { .. } => {
                panic!(
                    "mutating operation called on proto-backed managed object"
                )
            }
        }
    }

    /// Set `self[key] = value`. The child node is *shared* with `value`, so
    /// any `RustManagedObject` previously obtained from `value` (or from
    /// `self[other_key]` if `value` aliases such a sub-tree) stays valid.
    pub fn set_field(&self, key: &str, value: &RustManagedObject) {
        let child = Rc::clone(value.json_node());
        let mut borrow = self.json_node().borrow_mut();
        match &mut *borrow {
            NodeValue::Object(entries) => {
                if let Some(entry) = entries.iter_mut().find(|(k, _)| k == key)
                {
                    entry.1 = child;
                } else {
                    entries.push((key.to_string(), child));
                }
            }
            other => panic!("set_field on non-object JSON node: {other:?}"),
        }
    }

    /// Sets `self[key] = value`, taking the key from a managed-object string.
    pub fn set_field_obj_key(
        &self,
        key: &RustManagedObject,
        value: &RustManagedObject,
    ) {
        let k = key.as_string();
        self.set_field(&k, value);
    }

    /// Removes the named field from an object value.
    pub fn del_field(&self, key: &str) {
        let mut borrow = self.json_node().borrow_mut();
        match &mut *borrow {
            NodeValue::Object(entries) => {
                if let Some(pos) = entries.iter().position(|(k, _)| k == key) {
                    entries.remove(pos);
                }
            }
            other => panic!("del_field on non-object JSON node: {other:?}"),
        }
    }
}

// ---------------------------------------------------------------------------
// cxx-bridged free functions
// ---------------------------------------------------------------------------

pub(crate) fn rmo_clone(obj: &RustManagedObject) -> Box<RustManagedObject> {
    Box::new(obj.clone())
}
pub(crate) fn rmo_get_field(
    obj: &RustManagedObject,
    key: &str,
) -> Box<RustManagedObject> {
    obj.get_field(key)
}
pub(crate) fn rmo_get_index(
    obj: &RustManagedObject,
    idx: usize,
) -> Box<RustManagedObject> {
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
pub(crate) fn rmo_is_optional_field_present(
    obj: &RustManagedObject,
    name: &str,
) -> bool {
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

pub(crate) fn rmo_new_object() -> Box<RustManagedObject> {
    RustManagedObject::new_object()
}
pub(crate) fn rmo_from_json_str(
    json: &str,
) -> Result<Box<RustManagedObject>, String> {
    RustManagedObject::from_json_str(json)
}
pub(crate) fn rmo_to_json_string(
    obj: &RustManagedObject,
) -> Result<String, String> {
    obj.to_json_string()
}
pub(crate) fn rmo_set_field(
    obj: &RustManagedObject,
    key: &str,
    value: &RustManagedObject,
) {
    obj.set_field(key, value);
}
pub(crate) fn rmo_set_field_obj_key(
    obj: &RustManagedObject,
    key: &RustManagedObject,
    value: &RustManagedObject,
) {
    obj.set_field_obj_key(key, value);
}
pub(crate) fn rmo_del_field(obj: &RustManagedObject, key: &str) {
    obj.del_field(key);
}
