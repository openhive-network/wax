import type { ApiBlock } from "../types/block.js";

export interface GetBlockRequest {
  block_num: number;
}

export interface GetBlockResponse {
  block?: ApiBlock;
}
