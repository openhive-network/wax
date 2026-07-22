//! Query-string serialization for the REST API caller.

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

#[cfg(test)]
mod tests {
    use serde_json::{Map, Value, json};

    use super::object_to_query_string;

    fn params(value: Value) -> Map<String, Value> {
        value.as_object().expect("fixture is an object").clone()
    }

    fn decode(encoded: &str) -> String {
        percent_encoding::percent_decode_str(encoded)
            .decode_utf8()
            .expect("valid utf-8")
            .into_owned()
    }

    // TS line 6: "Should be able to convert empty object to a correct query
    // string".
    #[test]
    fn converts_empty_object() {
        let querified = object_to_query_string(&params(json!({})));

        assert_eq!(querified, "");
        assert_eq!(decode(&querified), "");
    }

    // TS line 17: "Should be able to convert single parameter to a correct
    // query string".
    #[test]
    fn converts_single_parameter() {
        let querified =
            object_to_query_string(&params(json!({ "name": "John" })));

        assert_eq!(querified, "name=John");
        assert_eq!(decode(&querified), "name=John");
    }

    // TS line 30: "Should be able to convert object with multiple parameters
    // to a correct query string".
    #[test]
    fn converts_multiple_parameters() {
        let querified = object_to_query_string(&params(json!({
            "name": "John",
            "age": 30,
            "interests": ["music", "movies", "sports"],
            "location": { "city": "New York", "country": "USA" },
            "isStudent": false,
            "nullValue": null,
        })));

        assert_eq!(
            querified,
            "age=30&interests=music,movies,sports&isStudent=false&location=%7B%22city%22%3A%22New%20York%22%2C%22country%22%3A%22USA%22%7D&name=John"
        );
        assert_eq!(
            decode(&querified),
            r#"age=30&interests=music,movies,sports&isStudent=false&location={"city":"New York","country":"USA"}&name=John"#
        );
    }
}
