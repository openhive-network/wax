use serde::{Deserialize, Serialize};

use crate::chain::error::WaxChainError;

/// Outgoing JSON-RPC 2.0 envelope.
#[derive(Debug, Serialize)]
pub(crate) struct JsonRpcRequest<'a, P> {
    pub jsonrpc: &'static str,
    pub id: u64,
    pub method: &'a str,
    pub params: P,
}

impl<'a, P> JsonRpcRequest<'a, P> {
    pub(crate) fn new(id: u64, method: &'a str, params: P) -> Self {
        Self {
            jsonrpc: "2.0",
            id,
            method,
            params,
        }
    }
}

/// Incoming JSON-RPC 2.0 envelope. Either `result` or `error` is populated.
#[derive(Debug, Deserialize)]
pub(crate) struct JsonRpcResponse<R> {
    pub result: Option<R>,
    pub error: Option<JsonRpcError>,
}

#[derive(Debug, Deserialize)]
pub(crate) struct JsonRpcError {
    pub code: i64,
    pub message: String,
}

/// Converts a decoded JSON-RPC envelope into its `result` payload, or the
/// matching [`WaxChainError`] when the node reports an error envelope or the
/// envelope carries neither field.
pub(crate) fn unwrap_envelope<R>(
    response: JsonRpcResponse<R>,
) -> Result<R, WaxChainError> {
    if let Some(err) = response.error {
        return Err(WaxChainError::JsonRpc {
            code: err.code,
            message: err.message,
        });
    }

    response.result.ok_or(WaxChainError::JsonRpc {
        code: 0,
        message: "JSON-RPC response missing both `result` and `error`".into(),
    })
}
