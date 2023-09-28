/**
 * Required data for the proto-protocol.spec.ts tests
 */

export * from "./data.protocol";

export const protoVoteOp = {
  vote: {
    voter: "otom",
    author: "c0ff33a",
    permlink: "ewxhnjbj",
    weight: 2200
  }
};

export const protoTx = JSON.stringify({
  ref_block_num: 34559,
  ref_block_prefix: 1271006404,
  expiration: "2021-12-13T11:31:33",
  operations: [
    protoVoteOp
  ],
  extensions: []
});

export const protoRecurrentTransferOperation = JSON.stringify({
  recurrent_transfer: {
    // Note: Those values are named from and to in proto definitions, but are later transformed. We do not have access to the proto transformers here, so we have to hardcode it.
    // If you want to test how the transformers work, please see our examples
    from: "alice",
    to: "harry",
    amount: { nai: "@@000000021", precision: 3, amount: "10" },
    memo: "it is only memo",
    recurrence: 3 * 24 * 60 * 60,
    executions: 3,
    extensions: [ { recurrent_transfer_pair_id: { pair_id: 0 } }, { void_t: {} } ]
  }
});
