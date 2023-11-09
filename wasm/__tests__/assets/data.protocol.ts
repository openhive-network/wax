/**
 * Required data for the protocol.spec.ts tests
 */

import "./data";

import Long from "long";

/// Converts given number to the array of low and high number parts
export const numToHighLow = (value: number) => {
  const long = Long.fromNumber(value);

  return [ long.low, long.high ];
};

export enum ErrorCodes {
  FAIL = 0,
  OK = 1
}

export const vote_operation = {
  type: "vote_operation",
  value: {
    voter: "otom",
    author: "c0ff33a",
    permlink: "ewxhnjbj",
    weight: 2200
  }
};

export const transaction = JSON.stringify({
  ref_block_num: 34559,
  ref_block_prefix: 1271006404,
  expiration: "2021-12-13T11:31:33",
  operations: [
    vote_operation
  ],
  extensions: []
});

/// See Hive mainnet block 80021416, trx_id: 7f34699e9eea49d1bcc10c88f96e38897839ece3
export const serialization_sensitive_transaction = JSON.stringify({
  ref_block_num: 1959,
  ref_block_prefix: 3625727107,
  expiration: "2023-11-09T22:01:24",
  operations: [
    {
      type: "transfer_operation",
      value: {
        from: "oneplus7",
        to: "kryptogames",
        amount: {
          amount: "300000",
          precision: 3,
          nai: "@@000000021"
        },
        memo: "Roll under 50 4d434bd943616"
      }
    }
  ],
  extensions: []
});
