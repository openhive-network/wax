mod api_caller;
mod braced_strings;
mod query_string;
mod request_helper;
#[cfg(test)]
pub(super) mod test_support;

// NOTE: api_caller is not re-exported yet — its consumers (the generated API
// surfaces behind `extend_rest`) arrive in a later phase.
pub(super) use query_string::*;
pub(super) use request_helper::*;
