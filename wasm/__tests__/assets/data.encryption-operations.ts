import { createHiveChain } from "../../dist/bundle/index-full";

const chain = await createHiveChain();

export const commentOp = {
  comment: {
    parent_author: 'gtg',
    parent_permlink: 'test-comment',
    author: 'gtg',
    permlink: 'test-comment-2',
    title: 'Test comment',
    body: 'Test comment body',
    json_metadata: '{}',
  },
};

export const transferOp = {
  transfer: {
    from_account: 'gtg',
    to_account: 'initminer',
    amount: chain.hive(100),
    memo: 'This should be encrypted',
  },
};

export const customJsonOp = {
  custom_json: {
    required_auths: ['gtg'],
    required_posting_auths: ['gtg'],
    id: 'custom_json',
    json: '{}',
  },
};

export const transferToSavingsOp = {
  transfer_to_savings: {
    from_account: 'gtg',
    to_account: 'savings',
    amount: chain.hive(100),
    memo: 'This should be encrypted',
  },
};

export const transferFromSavingsOp = {
  transfer_from_savings: {
    from_account: 'savings',
    request_id: 1,
    to_account: 'gtg',
    amount: chain.hive(100),
    memo: 'This should be encrypted',
  },
};

export const recurrentTransferOp = {
  recurrent_transfer: {
    from_account: 'gtg',
    to_account: 'initminer',
    amount: chain.hive(100),
    memo: 'This should be encrypted',
    recurrence: 1,
    executions: 1,
    extensions: [],
  },
};

export const voteOp = {
  vote: {
    voter: 'gtg',
    author: 'initminer',
    permlink: 'test-permlink',
    weight: 100,
  },
};

export const convertOp = {
  convert: {
    owner: 'gtg',
    requestid: 1,
    amount: chain.hive(100),
  },
};
