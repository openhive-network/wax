mod request_helper;
#[cfg(test)]
pub(super) mod test_support;

// NOTE: the request/response payload types were always reachable through the
// public `WaxChainError` fields; `call_at` returning [`DetailedResponseData`]
// makes them properly nameable.
pub use request_helper::{
    DetailedResponseData, RequestData, RequestOptions, ResponseType,
};

pub(super) use request_helper::RequestHelper;
