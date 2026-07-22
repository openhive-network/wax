//! Payload shaping for the REST transport: converts the typed request params
//! into a call's path, query string and body, and decodes the typed result
//! out of the response.

use serde::Serialize;
use serde::de::DeserializeOwned;
use serde_json::{Map, Value};

use crate::chain::error::WaxChainError;
use crate::chain::transport::{
    DetailedResponseData, RequestData, RequestOptions,
};

use super::braced_strings::extract_braced_strings;
use super::query_string::{object_to_query_string, stringify};

/// Converts the typed request params into a JSON object map; `None` when the
/// params serialize to `null` (e.g. `()` for parameterless methods).
///
/// NOTE: TS constrains params to `object | undefined` at the type level;
/// `P: Serialize` cannot, so any other JSON shape is rejected here.
pub(super) fn to_params_map<P: Serialize>(
    params: P,
) -> Result<Option<Map<String, Value>>, WaxChainError> {
    match serde_json::to_value(params)? {
        Value::Null => Ok(None),
        Value::Object(map) => Ok(Some(map)),
        _ => Err(WaxChainError::NonObjectParams),
    }
}

/// Substitutes the `{param}` placeholders in the path template from the
/// params, removing each consumed key; the remaining params later become the
/// query string or the request body.
pub(super) fn substitute_path_params(
    template: &str,
    params: Option<Map<String, Value>>,
) -> Result<(String, Option<Map<String, Value>>), WaxChainError> {
    let names = extract_braced_strings(template);
    if names.is_empty() {
        return Ok((template.to_string(), params));
    }

    let mut path = template.to_string();
    let mut params = params.unwrap_or_default();

    for name in names {
        let value = params.remove(name).ok_or_else(|| {
            WaxChainError::MissingPathParam {
                name: name.to_string(),
            }
        })?;

        path = path.replace(&format!("{{{name}}}"), &stringify(&value));
    }

    Ok((path, Some(params)))
}

/// Splits the request params into the query string (`GET` / `DELETE`) or the
/// JSON body (any other verb); TS `api_caller.ts` lines 120-127.
pub(super) fn split_payload(
    method: &str,
    params: Option<Map<String, Value>>,
) -> (String, Option<RequestData>) {
    let query_string_only = method == "GET" || method == "DELETE";

    if !query_string_only {
        let body = params.map(|map| RequestData::Json(Value::Object(map)));
        return (String::new(), body);
    }

    match params {
        Some(map) if !map.is_empty() => {
            (format!("?{}", object_to_query_string(&map)), None)
        }
        _ => (String::new(), None),
    }
}

/// Decodes the response body into the typed result, passing the raw response
/// data along for callers that need the timings.
pub(super) fn extract_result<R: DeserializeOwned>(
    request: RequestOptions,
    response: DetailedResponseData,
) -> Result<(R, DetailedResponseData), WaxChainError> {
    let value = response.response.clone().unwrap_or(Value::Null);

    match serde_json::from_value(value) {
        Ok(result) => Ok((result, response)),
        Err(source) => Err(WaxChainError::ApiResponse {
            request,
            response,
            source,
        }),
    }
}

#[cfg(test)]
mod tests {
    use serde_json::json;

    use crate::chain::transport::ResponseType;

    use super::*;

    fn map(value: Value) -> Option<Map<String, Value>> {
        match value {
            Value::Object(map) => Some(map),
            _ => panic!("fixture must be a JSON object"),
        }
    }

    #[test]
    fn substitutes_and_consumes_path_params() {
        let params = map(json!({ "id": "954f", "limit": 10 }));

        let (path, rest) =
            substitute_path_params("/transactions/{id}", params).unwrap();

        assert_eq!(path, "/transactions/954f");
        assert_eq!(rest, map(json!({ "limit": 10 })));
    }

    // Covers the JS `String()` coercion: a numeric param must not be
    // JSON-quoted in the path.
    #[test]
    fn stringifies_non_string_path_params() {
        let params = map(json!({ "typeId": 1 }));

        let (path, _) =
            substitute_path_params("/operation-types/{typeId}/keys", params)
                .unwrap();

        assert_eq!(path, "/operation-types/1/keys");
    }

    #[test]
    fn passes_params_through_without_placeholders() {
        let (path, rest) = substitute_path_params("/headblock", None).unwrap();

        assert_eq!(path, "/headblock");
        assert_eq!(rest, None);
    }

    #[test]
    fn errors_on_missing_path_param() {
        for params in [None, map(json!({ "other": 1 }))] {
            let error = substitute_path_params("/tx/{id}", params).unwrap_err();

            assert!(matches!(
                error,
                WaxChainError::MissingPathParam { ref name } if name == "id"
            ));
        }
    }

    #[test]
    fn splits_get_params_into_query_string() {
        let params = map(json!({ "a": 1, "b": "text" }));

        let (query_string, body) = split_payload("GET", params);

        assert_eq!(query_string, "?a=1&b=text");
        assert!(body.is_none());
    }

    #[test]
    fn omits_query_string_without_params() {
        assert_eq!(split_payload("GET", None), (String::new(), None));
        assert_eq!(
            split_payload("DELETE", map(json!({}))),
            (String::new(), None)
        );
    }

    #[test]
    fn splits_post_params_into_json_body() {
        let params = map(json!({ "a": 1 }));

        let (query_string, body) = split_payload("POST", params);

        assert!(query_string.is_empty());
        assert!(matches!(
            body,
            Some(RequestData::Json(value)) if value == json!({ "a": 1 })
        ));
    }

    #[test]
    fn rejects_non_object_params() {
        assert!(matches!(
            to_params_map(42).unwrap_err(),
            WaxChainError::NonObjectParams
        ));
        assert_eq!(to_params_map(()).unwrap(), None);
    }

    #[test]
    fn reports_undecodable_result() {
        let request = RequestOptions {
            endpoint: "http://localhost".into(),
            url: "/headblock".into(),
            method: "GET".into(),
            timeout: 0,
            data: None,
            response_type: Some(ResponseType::Json),
            wax_api_caller: None,
            extra_headers: Vec::new(),
        };
        let response = DetailedResponseData {
            start: std::time::Instant::now(),
            end: None,
            status: Some(200),
            headers: None,
            response: None,
        };

        let error = extract_result::<u64>(request, response).unwrap_err();

        assert!(matches!(error, WaxChainError::ApiResponse { .. }));
    }
}
