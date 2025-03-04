import { ApiTransaction } from "./transaction.js";

export interface ApiBlockHeader {
  previous: string;
  timestamp: string;
  witness: string;
  transaction_merkle_root: string;
  extensions: object[];
}

export interface ApiBlock extends ApiBlockHeader {
  witness_signature: string;
  transactions: Array<ApiTransaction>;
  block_id: string;
  signing_key: string;
  transaction_ids: string[];
}
