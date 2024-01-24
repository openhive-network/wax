/**
 * Required data for the protocol.spec.ts tests
 */

import Long from "long";
import type { transaction as transactionT } from "../../dist/lib/web";

/// Converts given number to the array of low and high number parts
export const numToHighLow = (value: number): [ number, number ] => {
  const long = Long.fromNumber(value);

  return [ long.low, long.high ];
};

export enum ErrorCodes {
  FAIL = 0,
  OK = 1
}

export const naiAsset = {
  amount: "300000",
  precision: 3,
  nai: "@@000000021"
};

export const vote_operation = {
  type: "vote_operation",
  value: {
    voter: "otom",
    author: "c0ff33a",
    permlink: "ewxhnjbj",
    weight: 2200
  }
};

export const transfer_operation = {
  type: "transfer_operation",
  value: {
    from: "oneplus7",
    to: "kryptogames",
    amount: naiAsset,
    memo: "Roll under 50 4d434bd943616"
  }
};

export const transaction = JSON.stringify({
  ref_block_num: 34559,
  ref_block_prefix: 1271006404,
  expiration: "2021-12-13T11:31:33",
  operations: [
    vote_operation
  ]
});

/// See Hive mainnet block 80021416, trx_id: 7f34699e9eea49d1bcc10c88f96e38897839ece3
export const serialization_sensitive_transaction = JSON.stringify({
  ref_block_num: 1959,
  ref_block_prefix: 3625727107,
  expiration: "2023-11-09T22:01:24",
  operations: [
    transfer_operation
  ],
  extensions: []
});

export const serialization_sensitive_transaction_proto: transactionT = {
  ref_block_num: 1959,
  ref_block_prefix: 3625727107,
  expiration: "2023-11-09T22:01:24",
  operations: [
    {
      transfer: {
        from_account: transfer_operation.value.from,
        to_account: transfer_operation.value.to,
        amount: transfer_operation.value.amount,
        memo: transfer_operation.value.memo
      }
    }
  ],
  extensions: [],
  signatures: []
};
