import type { ApiBlockHeader } from "../types/block.js";

export interface GetBlockHeaderRequest {
  block_num: number;
}

export interface GetBlockHeaderResponse {
  header: ApiBlockHeader;
}
