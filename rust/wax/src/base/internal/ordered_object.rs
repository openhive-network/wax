//! Insertion-ordered JSON object used wherever a serialized body must match
//! the TS `JSON.stringify` output byte-for-byte.

use serde::ser::{Serialize, SerializeMap, Serializer};
use serde_json::Value;

/// Represents an insertion-ordered JSON object mirroring JS object key
/// semantics: setting an existing key updates it in place, a new key is
/// appended. Serialized entry order therefore matches the TS
/// `JSON.stringify` output byte-for-byte without enabling `serde_json`'s
/// crate-wide `preserve_order` feature.
#[derive(Debug, Clone, Default)]
pub(crate) struct OrderedObject(pub(crate) Vec<(String, Value)>);

impl OrderedObject {
    pub(crate) fn get(&self, key: &str) -> Option<&Value> {
        self.0.iter().find(|(k, _)| k == key).map(|(_, v)| v)
    }

    pub(crate) fn set(&mut self, key: &str, value: Value) {
        match self.0.iter_mut().find(|(k, _)| k == key) {
            Some((_, existing)) => *existing = value,
            None => self.0.push((key.to_string(), value)),
        }
    }
}

impl Serialize for OrderedObject {
    fn serialize<S: Serializer>(
        &self,
        serializer: S,
    ) -> Result<S::Ok, S::Error> {
        let mut map = serializer.serialize_map(Some(self.0.len()))?;
        for (key, value) in &self.0 {
            map.serialize_entry(key, value)?;
        }

        map.end()
    }
}
