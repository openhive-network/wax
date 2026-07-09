//! Query-string serialization for the REST API caller.
//!
//! TS NOTE: ported from `objectToQueryString` in
//! `ts/wasm/lib/detailed/util/query_string.ts`.

use percent_encoding::{AsciiSet, NON_ALPHANUMERIC, utf8_percent_encode};
use serde_json::{Map, Value};

/// Used to percent-encode values exactly like JavaScript's
/// `encodeURIComponent`, which escapes everything except the alphanumerics and
/// the unreserved marks `- _ . ! ~ * ' ( )`.
const URI_COMPONENT: &AsciiSet = &NON_ALPHANUMERIC
    .remove(b'-')
    .remove(b'_')
    .remove(b'.')
    .remove(b'!')
    .remove(b'~')
    .remove(b'*')
    .remove(b'\'')
    .remove(b'(')
    .remove(b')');

/// Converts a params object into a URL query string (`key=value&...`),
/// percent-encoding the values while leaving the keys untouched.
///
/// TS NOTE: TS skips both `undefined` and `null` values; JSON has no
/// `undefined`, so only [`Value::Null`] is skipped. Arrays are comma-joined and
/// nested objects are JSON-encoded before escaping, matching the TS branch
/// order (the array check precedes the generic object check).
pub fn object_to_query_string(params: &Map<String, Value>) -> String {
    let mut parts = Vec::with_capacity(params.len());

    for (key, value) in params {
        let encoded = match value {
            Value::Null => continue,
            Value::Array(items) => items
                .iter()
                .map(|item| encode(&stringify(item)))
                .collect::<Vec<_>>()
                .join(","),
            Value::Object(_) => encode(&value.to_string()),
            scalar => encode(&stringify(scalar)),
        };

        parts.push(format!("{key}={encoded}"));
    }

    parts.join("&")
}

/// Converts a JSON value to the string JavaScript's `String()` coercion would
/// produce. Exists to special-case [`Value::String`]: [`Value::to_string`]
/// would render it as quoted JSON (`"foo"`), whereas the query string and the
/// REST path parameters need the raw text (`foo`).
pub(super) fn stringify(value: &Value) -> String {
    match value {
        Value::String(text) => text.clone(),
        scalar => scalar.to_string(),
    }
}

/// Converts a string into its `encodeURIComponent` representation.
fn encode(value: &str) -> String {
    utf8_percent_encode(value, URI_COMPONENT).to_string()
}
