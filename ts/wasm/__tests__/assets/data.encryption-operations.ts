import { createHiveChain, IEncryptingTransaction, transaction, WaxError } from '../../dist/bundle/index-full';
import { EncryptionVisitor, EEncryptionType } from '../../dist/lib/detailed/encryption_visitor.js';
import beekeeperFactory, { TPublicKey } from '@hiveio/beekeeper';

const chain = await createHiveChain();
const beekeeper = await beekeeperFactory();

const operationEncryptionTest = (shouldBeEncrypted: boolean): EncryptionVisitor => {
  const encryptionVisitor = new EncryptionVisitor(EEncryptionType.DECRYPT, (data: string) => {
    if (shouldBeEncrypted && !data.startsWith('#'))
      throw new WaxError(`Expected encrypted operation data: ${data}`);

    if (!shouldBeEncrypted && data.startsWith('#'))
      throw new WaxError(`Expected non-encrypted operation data: ${data}`);

    return data;
  });

  return encryptionVisitor;
};

export const utilFunctionTest = async (
  txOperationsLambda: (tx: IEncryptingTransaction, encryptionKeys: [TPublicKey] | [TPublicKey, TPublicKey]) => void,
  nonEncryptedOperationIndices: number[] = [],
  otherEncryptionKey: boolean = false
): Promise<transaction> => {
  const session = beekeeper.createSession('salt');
  const { wallet } = await session.createWallet('w0');

  const key = await wallet.importKey('5JkFnXrLM2ap9t3AmAxBJvQHF7xSKtnTrCTginQCkhzU5S7ecPT');

  const tx = chain.createTransactionWithTaPoS('04c507a8c7fe5be96be64ce7c86855e1806cbde3', '2023-11-09T21:51:27');

  const encryptionKeys: [TPublicKey] | [TPublicKey, TPublicKey] = [key];

  if (otherEncryptionKey)
    encryptionKeys.push(await wallet.importKey('5KXNQP5feaaXpp28yRrGaFeNYZT7Vrb1PqLEyo7E3pJiG1veLKG'));

  let encryptingTx = tx.startEncrypt(...encryptionKeys);

  txOperationsLambda(encryptingTx, encryptionKeys);

  encryptingTx.stopEncrypt();

  encryptingTx.sign(wallet, await wallet.importKey('5KGKYWMXReJewfj5M29APNMqGEu173DzvHv5TeJAg9SkjUeQV78'));

  const builtTransaction = encryptingTx.transaction;

  if (nonEncryptedOperationIndices.length > 0) {
    const nonEncryptedSet = new Set<number>(nonEncryptedOperationIndices);

    for (let i = 0; i < builtTransaction.operations.length; ++i) {
      const shouldBeEncrypted = !nonEncryptedSet.has(i); // If set object does not contain the index than the operation should be encrypted

      const visitor = operationEncryptionTest(shouldBeEncrypted);

      visitor.accept(builtTransaction.operations[i]);
    }
  }

  return encryptingTx.decrypt(wallet);
};

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
    amount: chain.hiveSatoshis(100),
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
    amount: chain.hiveSatoshis(100),
    memo: 'This should be encrypted',
  },
};

export const transferFromSavingsOp = {
  transfer_from_savings: {
    from_account: 'savings',
    request_id: 1,
    to_account: 'gtg',
    amount: chain.hiveSatoshis(100),
    memo: 'This should be encrypted',
  },
};

export const recurrentTransferOp = {
  recurrent_transfer: {
    from_account: 'gtg',
    to_account: 'initminer',
    amount: chain.hiveSatoshis(100),
    memo: 'This should be encrypted',
    recurrence: 24,
    executions: 2,
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
    amount: chain.hbdSatoshis(100),
  },
};

export const transferToVestingOp = {
  transfer_to_vesting: {
    from_account: 'gtg',
    to_account: 'initminer',
    amount: chain.hiveSatoshis(100),
  },
};

export const withdrawVestingOp = {
  withdraw_vesting: {
    account: 'gtg',
    vesting_shares: chain.vestsSatoshis(100),
  },
};

export const limitOrderCreateOp = {
  limit_order_create: {
    owner: 'gtg',
    orderid: 1,
    amount_to_sell: chain.hiveSatoshis(100),
    min_to_receive: chain.hbdSatoshis(50),
    fill_or_kill: false,
    expiration: '2023-11-09T21:51:27',
  },
};

export const limitOrderCancelOp = {
  limit_order_cancel: {
    owner: 'gtg',
    orderid: 1,
  },
};

export const feedPublishOp = {
  feed_publish: {
    publisher: 'gtg',
    exchange_rate: {
      base: chain.hiveSatoshis(100),
      quote: chain.hbdSatoshis(50),
    },
  },
};

export const accountCreateOp = {
  account_create: {
    fee: chain.hiveSatoshis(100),
    creator: 'gtg',
    new_account_name: 'initminer',
    owner: {
      weight_threshold: 1,
      account_auths: {},
      key_auths: {},
    },
    active: {
      weight_threshold: 1,
      account_auths: {},
      key_auths: {},
    },
    posting: {
      weight_threshold: 1,
      account_auths: {},
      key_auths: {},
    },
    memo_key: 'STM8GC13uCZbP44HzMLV6zPZGwVQ8Nt4Kji8PapsPiNq1BK153XTX',
    json_metadata: '{}',
  },
};

export const accountUpdateOp = {
  account_update: {
    account: 'gtg',
    owner: {
      weight_threshold: 1,
      account_auths: {},
      key_auths: {},
    },
    active: {
      weight_threshold: 1,
      account_auths: {},
      key_auths: {},
    },
    posting: {
      weight_threshold: 1,
      account_auths: {},
      key_auths: {},
    },
    memo_key: 'STM8GC13uCZbP44HzMLV6zPZGwVQ8Nt4Kji8PapsPiNq1BK153XTX',
    json_metadata: '{}',
  },
};

export const witnessUpdateOp = {
  witness_update: {
    owner: 'gtg',
    url: 'http://example.com',
    block_signing_key: '5KGKYWMXReJewfj5M29APNMqGEu173DzvHv5TeJAg9SkjUeQV78',
    props: {
      account_creation_fee: chain.hiveSatoshis(100),
      maximum_block_size: 2000,
      hbd_interest_rate: 100,
    },
    fee: chain.hiveSatoshis(100),
  },
};

export const accountWitnessVoteOp = {
  account_witness_vote: {
    account: 'gtg',
    witness: 'initminer',
    approve: true,
  },
};

export const accountWitnessProxyOp = {
  account_witness_proxy: {
    account: 'gtg',
    proxy: 'initminer',
  },
};

export const powOp = {
  pow: {
    worker_account: 'initminer',
    block_id: '1',
    nonce: 'test nonce',
    work: {
      worker: 'initminer',
      input: 'test input',
      signature: '1f6ad21ddf9f57f1a94c1462185744cb0ea779ec1e99899f2556a3ce02b18d1b810fcddaccb349a53037798aea8023909447df756db461235ba5b63984d515c977',
      work: 'test work',
    },
    props: {
      account_creation_fee: chain.hiveSatoshis(100),
      maximum_block_size: 10,
      hbd_interest_rate: 10,
    },
  },
};

export const customOp = {
  custom: {
    required_auths: ['gtg'],
    id: 1,
    data: 'test data',
  },
};

export const witnessBlockApproveOp = {
  witness_block_approve: {
    witness: 'initminer',
    block_id: '1',
  },
};

export const deleteCommentOp = {
  delete_comment: {
    author: 'gtg',
    permlink: 'test-permlink',
  },
};

export const commentOptionsOp = {
  comment_options: {
    author: 'gtg',
    permlink: 'test-permlink',
    max_accepted_payout: chain.hbdSatoshis(100),
    percent_hbd: 10,
    allow_votes: true,
    allow_curation_rewards: true,
    extensions: [],
  },
};

export const setWithdrawVestingRouteOp = {
  set_withdraw_vesting_route: {
    from_account: 'gtg',
    to_account: 'initminer',
    percent: 10,
    auto_vest: true,
  },
};

export const limitOrderCreate2Op = {
  limit_order_create2: {
    owner: 'gtg',
    orderid: 1,
    amount_to_sell: chain.hiveSatoshis(100),
    fill_or_kill: false,
    exchange_rate: {
      base: chain.hiveSatoshis(100),
      quote: chain.hbdSatoshis(50),
    },
    expiration: '2023-11-09T21:51:27',
  },
};

export const claimAccountOp = {
  claim_account: {
    creator: 'gtg',
    fee: chain.hiveSatoshis(100),
    extensions: [],
  },
};

export const createClaimedAccountOp = {
  create_claimed_account: {
    creator: 'gtg',
    new_account_name: 'initminer',
    owner: {
      weight_threshold: 1,
      account_auths: {},
      key_auths: {},
    },
    active: {
      weight_threshold: 1,
      account_auths: {},
      key_auths: {},
    },
    posting: {
      weight_threshold: 1,
      account_auths: {},
      key_auths: {},
    },
    memo_key: 'STM8GC13uCZbP44HzMLV6zPZGwVQ8Nt4Kji8PapsPiNq1BK153XTX',
    json_metadata: '{}',
    extensions: [],
  },
};

export const requestAccountRecoveryOp = {
  request_account_recovery: {
    recovery_account: 'gtg',
    account_to_recover: 'initminer',
    new_owner_authority: {
      weight_threshold: 1,
      account_auths: {},
      key_auths: {},
    },
    extensions: [],
  },
};

export const changeRecoveryAccountOp = {
  change_recovery_account: {
    account_to_recover: 'gtg',
    new_recovery_account: 'initminer',
    extensions: [],
  },
};

export const escrowTransferOp = {
  escrow_transfer: {
    from_account: 'initminer',
    to_account: 'gtg',
    agent: 'blocktrades',
    escrow_id: 100,
    hbd_amount: chain.hbdSatoshis(100),
    hive_amount: chain.hiveSatoshis(100),
    fee: chain.hiveSatoshis(100),
    ratification_deadline: '2023-11-09T21:51:20',
    escrow_expiration: '2023-11-09T21:51:27',
    json_meta: '{}',
  },
};

export const escrowDisputeOp = {
  escrow_dispute: {
    from_account: 'initminer',
    to_account: 'gtg',
    agent: 'blocktrades',
    who: 'gtg',
    escrow_id: 100,
  },
};

export const escrowReleaseOp = {
  escrow_release: {
    from_account: 'initminer',
    to_account: 'gtg',
    agent: 'gtg',
    who: 'gtg',
    receiver: 'gtg',
    escrow_id: 100,
    hbd_amount: chain.hbdSatoshis(100),
    hive_amount: chain.hiveSatoshis(100),
  },
};

export const escrowApproveOp = {
  escrow_approve: {
    from_account: 'initminer',
    to_account: 'gtg',
    agent: 'gtg',
    who: 'gtg',
    escrow_id: 100,
    approve: true,
  },
};

export const cancelTransferFromSavingsOp = {
  cancel_transfer_from_savings: {
    from_account: 'gtg',
    request_id: 1,
  },
};

export const declineVotingRightsOp = {
  decline_voting_rights: {
    account: 'gtg',
    decline: true,
  },
};

export const claimRewardBalanceOp = {
  claim_reward_balance: {
    account: 'gtg',
    reward_hive: chain.hiveSatoshis(100),
    reward_hbd: chain.hbdSatoshis(100),
    reward_vests: chain.vestsSatoshis(100),
  },
};

export const delegateVestingSharesOp = {
  delegate_vesting_shares: {
    delegator: 'gtg',
    delegatee: 'initminer',
    vesting_shares: chain.vestsSatoshis(100),
  },
};

export const accountCreateWithDelegationOp = {
  account_create_with_delegation: {
    fee: chain.hiveSatoshis(100),
    delegation: chain.vestsSatoshis(50),
    creator: 'gtg',
    new_account_name: 'initminer',
    owner: {
      weight_threshold: 1,
      account_auths: {},
      key_auths: {},
    },
    active: {
      weight_threshold: 1,
      account_auths: {},
      key_auths: {},
    },
    posting: {
      weight_threshold: 1,
      account_auths: {},
      key_auths: {},
    },
    memo_key: 'STM8GC13uCZbP44HzMLV6zPZGwVQ8Nt4Kji8PapsPiNq1BK153XTX',
    json_metadata: '{}',
    extensions: [],
  },
};

export const witnessSetPropertiesOp = {
  witness_set_properties: {
    owner: 'gtg',
    props: { key: 'STM8GC13uCZbP44HzMLV6zPZGwVQ8Nt4Kji8PapsPiNq1BK153XTX' },
    extensions: [],
  },
};

export const accountUpdate2Op = {
  account_update2: {
    account: 'gtg',
    owner: {
      weight_threshold: 1,
      account_auths: {},
      key_auths: {},
    },
    active: {
      weight_threshold: 1,
      account_auths: {},
      key_auths: {},
    },
    posting: {
      weight_threshold: 1,
      account_auths: {},
      key_auths: {},
    },
    memo_key: 'STM8GC13uCZbP44HzMLV6zPZGwVQ8Nt4Kji8PapsPiNq1BK153XTX',
    json_metadata: '{}',
    posting_json_metadata: '{}',
    extensions: [],
  },
};

export const createProposalOp = {
  create_proposal: {
    creator: 'initminer',
    receiver: 'gtg',
    start_date: '2023-11-09T21:51:27',
    end_date: '2023-11-10T21:51:27',
    daily_pay: chain.hbdSatoshis(100),
    subject: 'Test subject',
    permlink: 'test-permlink',
    extensions: [],
  },
};

export const updateProposalVotesOp = {
  update_proposal_votes: {
    voter: 'gtg',
    proposal_ids: ['1'],
    approve: true,
    extensions: [],
  },
};

export const removeProposalOp = {
  remove_proposal: {
    proposal_owner: 'initminer',
    proposal_ids: ['1'],
    extensions: [],
  },
};

export const updateProposalOp = {
  update_proposal: {
    proposal_id: '1',
    creator: 'initminer',
    daily_pay: chain.hbdSatoshis(100),
    subject: 'Test subject',
    permlink: 'test-permlink',
    extensions: [],
  },
};

export const collateralizedConvertOp = {
  collateralized_convert: {
    owner: 'gtg',
    requestid: 1,
    amount: chain.hiveSatoshis(100),
  },
};
