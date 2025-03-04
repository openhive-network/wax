import type { ApiBlock } from "../types/block.js";

export interface GetBlockRangeRequest {
  starting_block_num: number;
  count: number;
}

export interface GetBlockRangeResponse {
  blocks: Array<ApiBlock>;
}
