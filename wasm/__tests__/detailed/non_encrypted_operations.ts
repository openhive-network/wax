import { expect } from '@playwright/test';
import { ChromiumBrowser, ConsoleMessage, chromium } from 'playwright';

import { test } from '../assets/jest-helper';

import { DEFAULT_STORAGE_ROOT } from '@hiveio/beekeeper/node';
import fs from 'fs';

import { IEncryptingTransactionBuilder } from '../../dist/bundle/index-full';

import {
  accountCreateOp,
  accountCreateWithDelegationOp,
  accountUpdate2Op,
  accountUpdateOp,
  accountWitnessProxyOp,
  accountWitnessVoteOp,
  cancelTransferFromSavingsOp,
  changeRecoveryAccountOp,
  claimAccountOp,
  claimRewardBalanceOp,
  collateralizedConvertOp,
  commentOptionsOp,
  convertOp,
  createClaimedAccountOp,
  createProposalOp,
  declineVotingRightsOp,
  delegateVestingSharesOp,
  deleteCommentOp,
  escrowApproveOp,
  escrowDisputeOp,
  escrowReleaseOp,
  escrowTransferOp,
  feedPublishOp,
  limitOrderCancelOp,
  limitOrderCreate2Op,
  limitOrderCreateOp,
  removeProposalOp,
  requestAccountRecoveryOp,
  setWithdrawVestingRouteOp,
  transferToVestingOp,
  updateProposalOp,
  updateProposalVotesOp,
  utilFunctionTest,
  voteOp,
  withdrawVestingOp,
  witnessBlockApproveOp,
} from '../assets/data.encryption-operations';

let browser!: ChromiumBrowser;

test.describe('Wax encrypted operations tests', () => {
  test.beforeAll(async () => {
    browser = await chromium.launch({
      headless: true,
    });
  });

  test.beforeEach(async ({ page }) => {
    page.on('console', (msg: ConsoleMessage) => {
      console.log('>>', msg.type(), msg.text());
    });

    if (fs.existsSync(`${DEFAULT_STORAGE_ROOT}/.beekeeper/w0.wallet`)) fs.rmSync(`${DEFAULT_STORAGE_ROOT}/.beekeeper/w0.wallet`);

    await page.goto('http://localhost:8080/wasm/__tests__/assets/test.html', { waitUntil: 'load' });
  });

  test('Should be able to pass through encryption on transaction with vote operation which does not support encryption', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.push(voteOp);
    });

    expect(retVal.operations[0]).toEqual(voteOp);
  });

  test('Should be able to pass through encryption on transaction with transfer to vesting operation which does not support encryption', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.push(transferToVestingOp);
    });

    expect(retVal.operations[0]).toEqual(transferToVestingOp);
  });

  test('Should be able to pass through encryption on transaction with withdraw vesting operation which does not support encryption', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.push(withdrawVestingOp);
    });

    expect(retVal.operations[0]).toEqual(withdrawVestingOp);
  });

  test('Should be able to pass through encryption on transaction with limit order create operation which does not support encryption', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.push(limitOrderCreateOp);
    });

    expect(retVal.operations[0]).toEqual(limitOrderCreateOp);
  });

  test('Should be able to pass through encryption on transaction with limit order cancel operation which does not support encryption', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.push(limitOrderCancelOp);
    });

    expect(retVal.operations[0]).toEqual(limitOrderCancelOp);
  });

  test('Should be able to pass through encryption on transaction with feed publish operation which does not support encryption', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.push(feedPublishOp);
    });

    expect(retVal.operations[0]).toEqual(feedPublishOp);
  });

  test('Should be able to pass through encryption on transaction with convert operation which does not support encryption', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.push(convertOp);
    });

    expect(retVal.operations[0]).toEqual(convertOp);
  });

  test('Should be able to pass through encryption on transaction with account create operation which does not support encryption', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.push(accountCreateOp);
    });

    expect(retVal.operations[0]).toEqual(accountCreateOp);
  });

  test('Should be able to pass through encryption on transaction with account update operation which does not support encryption', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.push(accountUpdateOp);
    });

    expect(retVal.operations[0]).toEqual(accountUpdateOp);
  });

  // XXX
  // test('Should be able to pass through encryption on transaction with witness update operation which does not support encryption', async () => {
  //   const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
  //     tx.push(witnessUpdateOp);
  //   });

  //   expect(retVal.operations[0]).toEqual(witnessUpdateOp);
  // });

  test('Should be able to pass through encryption on transaction with account witness vote operation which does not support encryption', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.push(accountWitnessVoteOp);
    });

    expect(retVal.operations[0]).toEqual(accountWitnessVoteOp);
  });

  test('Should be able to pass through encryption on transaction with account witness proxy operation which does not support encryption', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.push(accountWitnessProxyOp);
    });

    expect(retVal.operations[0]).toEqual(accountWitnessProxyOp);
  });

  test('Should be able to pass through encryption on transaction with witness block approve operation which does not support encryption', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.push(witnessBlockApproveOp);
    });

    expect(retVal.operations[0]).toEqual(witnessBlockApproveOp);
  });

  test('Should be able to pass through encryption on transaction with delete comment operation which does not support encryption', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.push(deleteCommentOp);
    });

    expect(retVal.operations[0]).toEqual(deleteCommentOp);
  });

  test('Should be able to pass through encryption on transaction with comment options operation which does not support encryption', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.push(commentOptionsOp);
    });

    expect(retVal.operations[0]).toEqual(commentOptionsOp);
  });

  test('Should be able to pass through encryption on transaction with set withdraw vesting route operation which does not support encryption', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.push(setWithdrawVestingRouteOp);
    });

    expect(retVal.operations[0]).toEqual(setWithdrawVestingRouteOp);
  });

  test('Should be able to pass through encryption on transaction with limit order create 2 operation which does not support encryption', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.push(limitOrderCreate2Op);
    });

    expect(retVal.operations[0]).toEqual(limitOrderCreate2Op);
  });

  test('Should be able to pass through encryption on transaction with claim account operation which does not support encryption', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.push(claimAccountOp);
    });

    expect(retVal.operations[0]).toEqual(claimAccountOp);
  });

  test('Should be able to pass through encryption on transaction with create claimed account operation which does not support encryption', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.push(createClaimedAccountOp);
    });

    expect(retVal.operations[0]).toEqual(createClaimedAccountOp);
  });

  test('Should be able to pass through encryption on transaction with request account recovery operation which does not support encryption', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.push(requestAccountRecoveryOp);
    });

    expect(retVal.operations[0]).toEqual(requestAccountRecoveryOp);
  });

  test('Should be able to pass through encryption on transaction with change recovery account operation which does not support encryption', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.push(changeRecoveryAccountOp);
    });

    expect(retVal.operations[0]).toEqual(changeRecoveryAccountOp);
  });

  test('Should be able to pass through encryption on transaction with escrow transfer operation which does not support encryption', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.push(escrowTransferOp);
    });

    expect(retVal.operations[0]).toEqual(escrowTransferOp);
  });

  test('Should be able to pass through encryption on transaction with escrow dispute operation which does not support encryption', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.push(escrowDisputeOp);
    });

    expect(retVal.operations[0]).toEqual(escrowDisputeOp);
  });

  test('Should be able to pass through encryption on transaction with escrow release operation which does not support encryption', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.push(escrowReleaseOp);
    });

    expect(retVal.operations[0]).toEqual(escrowReleaseOp);
  });

  test('Should be able to pass through encryption on transaction with escrow approve operation which does not support encryption', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.push(escrowApproveOp);
    });

    expect(retVal.operations[0]).toEqual(escrowApproveOp);
  });

  test('Should be able to pass through encryption on transaction with cancel transfer from savings operation which does not support encryption', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.push(cancelTransferFromSavingsOp);
    });

    expect(retVal.operations[0]).toEqual(cancelTransferFromSavingsOp);
  });

  test('Should be able to pass through encryption on transaction with decline voting rights operation which does not support encryption', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.push(declineVotingRightsOp);
    });

    expect(retVal.operations[0]).toEqual(declineVotingRightsOp);
  });

  test('Should be able to pass through encryption on transaction with claim reward balance operation which does not support encryption', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.push(claimRewardBalanceOp);
    });

    expect(retVal.operations[0]).toEqual(claimRewardBalanceOp);
  });

  test('Should be able to pass through encryption on transaction with delegate vesting shares operation which does not support encryption', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.push(delegateVestingSharesOp);
    });

    expect(retVal.operations[0]).toEqual(delegateVestingSharesOp);
  });

  test('Should be able to pass through encryption on transaction with account create with delegation operation which does not support encryption', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.push(accountCreateWithDelegationOp);
    });

    expect(retVal.operations[0]).toEqual(accountCreateWithDelegationOp);
  });

  // XXX
  // test('Should be able to pass through encryption on transaction with witness set properties operation which does not support encryption', async () => {
  //   const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
  //     tx.push(witnessSetPropertiesOp);
  //   });

  //   expect(retVal.operations[0]).toEqual(witnessSetPropertiesOp);
  // });

  test('Should be able to pass through encryption on transaction with account update 2 operation which does not support encryption', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.push(accountUpdate2Op);
    });

    expect(retVal.operations[0]).toEqual(accountUpdate2Op);
  });

  test('Should be able to pass through encryption on transaction with create proposal operation which does not support encryption', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.push(createProposalOp);
    });

    expect(retVal.operations[0]).toEqual(createProposalOp);
  });

  test('Should be able to pass through encryption on transaction with update proposal votes operation which does not support encryption', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.push(updateProposalVotesOp);
    });

    expect(retVal.operations[0]).toEqual(updateProposalVotesOp);
  });

  test('Should be able to pass through encryption on transaction with remove proposal operation which does not support encryption', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.push(removeProposalOp);
    });

    expect(retVal.operations[0]).toEqual(removeProposalOp);
  });

  test('Should be able to pass through encryption on transaction with update proposal operation which does not support encryption', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.push(updateProposalOp);
    });

    expect(retVal.operations[0]).toEqual(updateProposalOp);
  });

  test('Should be able to pass through encryption on transaction with collateralized converts operation which does not support encryption', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.push(collateralizedConvertOp);
    });

    expect(retVal.operations[0]).toEqual(collateralizedConvertOp);
  });

  test.afterAll(async () => {
    await browser.close();
  });
});
