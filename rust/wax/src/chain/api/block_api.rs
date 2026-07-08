//! DTOs of the `block_api` namespace.
//!
//! TS NOTE: ported from `ts/wasm/lib/detailed/api/block_api/`.

use serde::{Deserialize, Serialize};

use super::types::{ApiBlock, ApiBlockHeader};

/// Represents the parameters of `block_api.get_block`.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct GetBlockRequest {
    pub block_num: u32,
}

/// Represents the result of `block_api.get_block`; `block` is absent for
/// blocks the node does not have.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct GetBlockResponse {
    pub block: Option<ApiBlock>,
}

/// Represents the parameters of `block_api.get_block_header`.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct GetBlockHeaderRequest {
    pub block_num: u32,
}

/// Represents the result of `block_api.get_block_header`.
///
/// TS NOTE: TS types `header` as required; the node reflects it as
/// `fc::optional`, absent for blocks the node does not have.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct GetBlockHeaderResponse {
    pub header: Option<ApiBlockHeader>,
}

/// Represents the parameters of `block_api.get_block_range`.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct GetBlockRangeRequest {
    pub starting_block_num: u32,
    pub count: u32,
}

/// Represents the result of `block_api.get_block_range`.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct GetBlockRangeResponse {
    pub blocks: Vec<ApiBlock>,
}
