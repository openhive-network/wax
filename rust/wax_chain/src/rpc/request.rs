use serde::{Deserialize, Serialize};

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
