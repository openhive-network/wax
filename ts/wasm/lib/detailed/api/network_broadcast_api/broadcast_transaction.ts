import { ApiTransaction } from "../types/transaction.js";

export interface BroadcastTransactionRequest {
  trx: ApiTransaction;
  max_block_age: number;
}

export interface BroadcastTransactionResponse {}
