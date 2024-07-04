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
      tx.pushRawOperation(voteOp);
    });

    expect(retVal.operations[0]).toEqual(voteOp);
  });

  test('Should be able to pass through encryption on transaction with transfer to vesting operation which does not support encryption', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.pushRawOperation(transferToVestingOp);
    });

    expect(retVal.operations[0]).toEqual(transferToVestingOp);
  });

  test('Should be able to pass through encryption on transaction with withdraw vesting operation which does not support encryption', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.pushRawOperation(withdrawVestingOp);
    });

    expect(retVal.operations[0]).toEqual(withdrawVestingOp);
  });

  test('Should be able to pass through encryption on transaction with limit order create operation which does not support encryption', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.pushRawOperation(limitOrderCreateOp);
    });

    expect(retVal.operations[0]).toEqual(limitOrderCreateOp);
  });

  test('Should be able to pass through encryption on transaction with limit order cancel operation which does not support encryption', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.pushRawOperation(limitOrderCancelOp);
    });

    expect(retVal.operations[0]).toEqual(limitOrderCancelOp);
  });

  test('Should be able to pass through encryption on transaction with feed publish operation which does not support encryption', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.pushRawOperation(feedPublishOp);
    });

    expect(retVal.operations[0]).toEqual(feedPublishOp);
  });

  test('Should be able to pass through encryption on transaction with convert operation which does not support encryption', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.pushRawOperation(convertOp);
    });

    expect(retVal.operations[0]).toEqual(convertOp);
  });

  test('Should be able to pass through encryption on transaction with account create operation which does not support encryption', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.pushRawOperation(accountCreateOp);
    });

    expect(retVal.operations[0]).toEqual(accountCreateOp);
  });

  test('Should be able to pass through encryption on transaction with account update operation which does not support encryption', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.pushRawOperation(accountUpdateOp);
    });

    expect(retVal.operations[0]).toEqual(accountUpdateOp);
  });

  // XXX
  // test('Should be able to pass through encryption on transaction with witness update operation which does not support encryption', async () => {
  //   const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
  //     tx.pushRawOperation(witnessUpdateOp);
  //   });

  //   expect(retVal.operations[0]).toEqual(witnessUpdateOp);
  // });

  test('Should be able to pass through encryption on transaction with account witness vote operation which does not support encryption', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.pushRawOperation(accountWitnessVoteOp);
    });

    expect(retVal.operations[0]).toEqual(accountWitnessVoteOp);
  });

  test('Should be able to pass through encryption on transaction with account witness proxy operation which does not support encryption', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.pushRawOperation(accountWitnessProxyOp);
    });

    expect(retVal.operations[0]).toEqual(accountWitnessProxyOp);
  });

  test('Should be able to pass through encryption on transaction with witness block approve operation which does not support encryption', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.pushRawOperation(witnessBlockApproveOp);
    });

    expect(retVal.operations[0]).toEqual(witnessBlockApproveOp);
  });

  test('Should be able to pass through encryption on transaction with delete comment operation which does not support encryption', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.pushRawOperation(deleteCommentOp);
    });

    expect(retVal.operations[0]).toEqual(deleteCommentOp);
  });

  test('Should be able to pass through encryption on transaction with comment options operation which does not support encryption', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.pushRawOperation(commentOptionsOp);
    });

    expect(retVal.operations[0]).toEqual(commentOptionsOp);
  });

  test('Should be able to pass through encryption on transaction with set withdraw vesting route operation which does not support encryption', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.pushRawOperation(setWithdrawVestingRouteOp);
    });

    expect(retVal.operations[0]).toEqual(setWithdrawVestingRouteOp);
  });

  test('Should be able to pass through encryption on transaction with limit order create 2 operation which does not support encryption', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.pushRawOperation(limitOrderCreate2Op);
    });

    expect(retVal.operations[0]).toEqual(limitOrderCreate2Op);
  });

  test('Should be able to pass through encryption on transaction with claim account operation which does not support encryption', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.pushRawOperation(claimAccountOp);
    });

    expect(retVal.operations[0]).toEqual(claimAccountOp);
  });

  test('Should be able to pass through encryption on transaction with create claimed account operation which does not support encryption', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.pushRawOperation(createClaimedAccountOp);
    });

    expect(retVal.operations[0]).toEqual(createClaimedAccountOp);
  });

  test('Should be able to pass through encryption on transaction with request account recovery operation which does not support encryption', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.pushRawOperation(requestAccountRecoveryOp);
    });

    expect(retVal.operations[0]).toEqual(requestAccountRecoveryOp);
  });

  test('Should be able to pass through encryption on transaction with change recovery account operation which does not support encryption', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.pushRawOperation(changeRecoveryAccountOp);
    });

    expect(retVal.operations[0]).toEqual(changeRecoveryAccountOp);
  });

  test('Should be able to pass through encryption on transaction with escrow transfer operation which does not support encryption', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.pushRawOperation(escrowTransferOp);
    });

    expect(retVal.operations[0]).toEqual(escrowTransferOp);
  });

  test('Should be able to pass through encryption on transaction with escrow dispute operation which does not support encryption', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.pushRawOperation(escrowDisputeOp);
    });

    expect(retVal.operations[0]).toEqual(escrowDisputeOp);
  });

  test('Should be able to pass through encryption on transaction with escrow release operation which does not support encryption', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.pushRawOperation(escrowReleaseOp);
    });

    expect(retVal.operations[0]).toEqual(escrowReleaseOp);
  });

  test('Should be able to pass through encryption on transaction with escrow approve operation which does not support encryption', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.pushRawOperation(escrowApproveOp);
    });

    expect(retVal.operations[0]).toEqual(escrowApproveOp);
  });

  test('Should be able to pass through encryption on transaction with cancel transfer from savings operation which does not support encryption', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.pushRawOperation(cancelTransferFromSavingsOp);
    });

    expect(retVal.operations[0]).toEqual(cancelTransferFromSavingsOp);
  });

  test('Should be able to pass through encryption on transaction with decline voting rights operation which does not support encryption', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.pushRawOperation(declineVotingRightsOp);
    });

    expect(retVal.operations[0]).toEqual(declineVotingRightsOp);
  });

  test('Should be able to pass through encryption on transaction with claim reward balance operation which does not support encryption', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.pushRawOperation(claimRewardBalanceOp);
    });

    expect(retVal.operations[0]).toEqual(claimRewardBalanceOp);
  });

  test('Should be able to pass through encryption on transaction with delegate vesting shares operation which does not support encryption', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.pushRawOperation(delegateVestingSharesOp);
    });

    expect(retVal.operations[0]).toEqual(delegateVestingSharesOp);
  });

  test('Should be able to pass through encryption on transaction with account create with delegation operation which does not support encryption', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.pushRawOperation(accountCreateWithDelegationOp);
    });

    expect(retVal.operations[0]).toEqual(accountCreateWithDelegationOp);
  });

  // XXX
  // test('Should be able to pass through encryption on transaction with witness set properties operation which does not support encryption', async () => {
  //   const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
  //     tx.pushRawOperation(witnessSetPropertiesOp);
  //   });

  //   expect(retVal.operations[0]).toEqual(witnessSetPropertiesOp);
  // });

  test('Should be able to pass through encryption on transaction with account update 2 operation which does not support encryption', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.pushRawOperation(accountUpdate2Op);
    });

    expect(retVal.operations[0]).toEqual(accountUpdate2Op);
  });

  test('Should be able to pass through encryption on transaction with create proposal operation which does not support encryption', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.pushRawOperation(createProposalOp);
    });

    expect(retVal.operations[0]).toEqual(createProposalOp);
  });

  test('Should be able to pass through encryption on transaction with update proposal votes operation which does not support encryption', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.pushRawOperation(updateProposalVotesOp);
    });

    expect(retVal.operations[0]).toEqual(updateProposalVotesOp);
  });

  test('Should be able to pass through encryption on transaction with remove proposal operation which does not support encryption', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.pushRawOperation(removeProposalOp);
    });

    expect(retVal.operations[0]).toEqual(removeProposalOp);
  });

  test('Should be able to pass through encryption on transaction with update proposal operation which does not support encryption', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.pushRawOperation(updateProposalOp);
    });

    expect(retVal.operations[0]).toEqual(updateProposalOp);
  });

  test('Should be able to pass through encryption on transaction with collateralized converts operation which does not support encryption', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.pushRawOperation(collateralizedConvertOp);
    });

    expect(retVal.operations[0]).toEqual(collateralizedConvertOp);
  });

  test.afterAll(async () => {
    await browser.close();
  });
});
