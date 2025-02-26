import { expect } from '@playwright/test';

import { test } from '../assets/jest-helper';

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

test.describe('Wax encrypted operations tests', () => {
  test('Should be able to pass through encryption on transaction with vote operation which does not support encryption', async ({ waxTest }) => {
    const retVal = await waxTest(async (globals, utilFunctionTest, voteOp) => {
      return await utilFunctionTest(globals, tx => {
        tx.pushOperation(voteOp);
      });
    }, utilFunctionTest, voteOp);

    expect(retVal.operations[0]).toEqual(voteOp);
  });

  test('Should be able to pass through encryption on transaction with transfer to vesting operation which does not support encryption', async ({ waxTest }) => {
    const retVal = await waxTest(async (globals, utilFunctionTest, transferToVestingOp) => {
      return await utilFunctionTest(globals, tx => {
        tx.pushOperation(transferToVestingOp);
      });
    }, utilFunctionTest, transferToVestingOp);

    expect(retVal.operations[0]).toEqual(transferToVestingOp);
  });

  test('Should be able to pass through encryption on transaction with withdraw vesting operation which does not support encryption', async ({ waxTest }) => {
    const retVal = await waxTest(async (globals, utilFunctionTest, withdrawVestingOp) => {
      return await utilFunctionTest(globals, tx => {
        tx.pushOperation(withdrawVestingOp);
      });
    }, utilFunctionTest, withdrawVestingOp);

    expect(retVal.operations[0]).toEqual(withdrawVestingOp);
  });

  test('Should be able to pass through encryption on transaction with limit order create operation which does not support encryption', async ({ waxTest }) => {
    const retVal = await waxTest(async (globals, utilFunctionTest, limitOrderCreateOp) => {
      return await utilFunctionTest(globals, tx => {
        tx.pushOperation(limitOrderCreateOp);
      });
    }, utilFunctionTest, limitOrderCreateOp);

    expect(retVal.operations[0]).toEqual(limitOrderCreateOp);
  });

  test('Should be able to pass through encryption on transaction with limit order cancel operation which does not support encryption', async ({ waxTest }) => {
    const retVal = await waxTest(async (globals, utilFunctionTest, limitOrderCancelOp) => {
      return await utilFunctionTest(globals, tx => {
        tx.pushOperation(limitOrderCancelOp);
      });
    }, utilFunctionTest, limitOrderCancelOp);

    expect(retVal.operations[0]).toEqual(limitOrderCancelOp);
  });

  test('Should be able to pass through encryption on transaction with feed publish operation which does not support encryption', async ({ waxTest }) => {
    const retVal = await waxTest(async (globals, utilFunctionTest, feedPublishOp) => {
      return await utilFunctionTest(globals, tx => {
        tx.pushOperation(feedPublishOp);
      });
    }, utilFunctionTest, feedPublishOp);

    expect(retVal.operations[0]).toEqual(feedPublishOp);
  });

  test('Should be able to pass through encryption on transaction with convert operation which does not support encryption', async ({ waxTest }) => {
    const retVal = await waxTest(async (globals, utilFunctionTest, convertOp) => {
      return await utilFunctionTest(globals, tx => {
        tx.pushOperation(convertOp);
      });
    }, utilFunctionTest, convertOp);

    expect(retVal.operations[0]).toEqual(convertOp);
  });

  test('Should be able to pass through encryption on transaction with account create operation which does not support encryption', async ({ waxTest }) => {
    const retVal = await waxTest(async (globals, utilFunctionTest, accountCreateOp) => {
      return await utilFunctionTest(globals, tx => {
        tx.pushOperation(accountCreateOp);
      });
    }, utilFunctionTest, accountCreateOp);

    expect(retVal.operations[0]).toEqual(accountCreateOp);
  });

  test('Should be able to pass through encryption on transaction with account update operation which does not support encryption', async ({ waxTest }) => {
    const retVal = await waxTest(async (globals, utilFunctionTest, accountUpdateOp) => {
      return await utilFunctionTest(globals, tx => {
        tx.pushOperation(accountUpdateOp);
      });
    }, utilFunctionTest, accountUpdateOp);

    expect(retVal.operations[0]).toEqual(accountUpdateOp);
  });

  // XXX
  // test('Should be able to pass through encryption on transaction with witness update operation which does not support encryption', async () => {
  //   const retVal = await utilFunctionTest(tx => {
  //     tx.pushOperation(witnessUpdateOp);
  //   });

  //   expect(retVal.operations[0]).toEqual(witnessUpdateOp);
  // });

  test('Should be able to pass through encryption on transaction with account witness vote operation which does not support encryption', async ({ waxTest }) => {
    const retVal = await waxTest(async (globals, utilFunctionTest, accountWitnessVoteOp) => {
      return await utilFunctionTest(globals, tx => {
        tx.pushOperation(accountWitnessVoteOp);
      });
    }, utilFunctionTest, accountWitnessVoteOp);

    expect(retVal.operations[0]).toEqual(accountWitnessVoteOp);
  });

  test('Should be able to pass through encryption on transaction with account witness proxy operation which does not support encryption', async ({ waxTest }) => {
    const retVal = await waxTest(async (globals, utilFunctionTest, accountWitnessProxyOp) => {
      return await utilFunctionTest(globals, tx => {
        tx.pushOperation(accountWitnessProxyOp);
      });
    }, utilFunctionTest, accountWitnessProxyOp);

    expect(retVal.operations[0]).toEqual(accountWitnessProxyOp);
  });

  test('Should be able to pass through encryption on transaction with witness block approve operation which does not support encryption', async ({ waxTest }) => {
    const retVal = await waxTest(async (globals, utilFunctionTest, witnessBlockApproveOp) => {
      return await utilFunctionTest(globals, tx => {
        tx.pushOperation(witnessBlockApproveOp);
      });
    }, utilFunctionTest, witnessBlockApproveOp);

    expect(retVal.operations[0]).toEqual(witnessBlockApproveOp);
  });

  test('Should be able to pass through encryption on transaction with delete comment operation which does not support encryption', async ({ waxTest }) => {
    const retVal = await waxTest(async (globals, utilFunctionTest, deleteCommentOp) => {
      return await utilFunctionTest(globals, tx => {
        tx.pushOperation(deleteCommentOp);
      });
    }, utilFunctionTest, deleteCommentOp);

    expect(retVal.operations[0]).toEqual(deleteCommentOp);
  });

  test('Should be able to pass through encryption on transaction with comment options operation which does not support encryption', async ({ waxTest }) => {
    const retVal = await waxTest(async (globals, utilFunctionTest, commentOptionsOp) => {
      return await utilFunctionTest(globals, tx => {
        tx.pushOperation(commentOptionsOp);
      });
    }, utilFunctionTest, commentOptionsOp);

    expect(retVal.operations[0]).toEqual(commentOptionsOp);
  });

  test('Should be able to pass through encryption on transaction with set withdraw vesting route operation which does not support encryption', async ({ waxTest }) => {
    const retVal = await waxTest(async (globals, utilFunctionTest, setWithdrawVestingRouteOp) => {
      return await utilFunctionTest(globals, tx => {
        tx.pushOperation(setWithdrawVestingRouteOp);
      });
    }, utilFunctionTest, setWithdrawVestingRouteOp);

    expect(retVal.operations[0]).toEqual(setWithdrawVestingRouteOp);
  });

  test('Should be able to pass through encryption on transaction with limit order create 2 operation which does not support encryption', async ({ waxTest }) => {
    const retVal = await waxTest(async (globals, utilFunctionTest, limitOrderCreate2Op) => {
      return await utilFunctionTest(globals, tx => {
        tx.pushOperation(limitOrderCreate2Op);
      });
    }, utilFunctionTest, limitOrderCreate2Op);

    expect(retVal.operations[0]).toEqual(limitOrderCreate2Op);
  });

  test('Should be able to pass through encryption on transaction with claim account operation which does not support encryption', async ({ waxTest }) => {
    const retVal = await waxTest(async (globals, utilFunctionTest, claimAccountOp) => {
      return await utilFunctionTest(globals, tx => {
        tx.pushOperation(claimAccountOp);
      });
    }, utilFunctionTest, claimAccountOp);

    expect(retVal.operations[0]).toEqual(claimAccountOp);
  });

  test('Should be able to pass through encryption on transaction with create claimed account operation which does not support encryption', async ({ waxTest }) => {
    const retVal = await waxTest(async (globals, utilFunctionTest, createClaimedAccountOp) => {
      return await utilFunctionTest(globals, tx => {
        tx.pushOperation(createClaimedAccountOp);
      });
    }, utilFunctionTest, createClaimedAccountOp);

    expect(retVal.operations[0]).toEqual(createClaimedAccountOp);
  });

  test('Should be able to pass through encryption on transaction with request account recovery operation which does not support encryption', async ({ waxTest }) => {
    const retVal = await waxTest(async (globals, utilFunctionTest, requestAccountRecoveryOp) => {
      return await utilFunctionTest(globals, tx => {
        tx.pushOperation(requestAccountRecoveryOp);
      });
    }, utilFunctionTest, requestAccountRecoveryOp);

    expect(retVal.operations[0]).toEqual(requestAccountRecoveryOp);
  });

  test('Should be able to pass through encryption on transaction with change recovery account operation which does not support encryption', async ({ waxTest }) => {
    const retVal = await waxTest(async (globals, utilFunctionTest, changeRecoveryAccountOp) => {
      return await utilFunctionTest(globals, tx => {
        tx.pushOperation(changeRecoveryAccountOp);
      });
    }, utilFunctionTest, changeRecoveryAccountOp);

    expect(retVal.operations[0]).toEqual(changeRecoveryAccountOp);
  });

  test('Should be able to pass through encryption on transaction with escrow transfer operation which does not support encryption', async ({ waxTest }) => {
    const retVal = await waxTest(async (globals, utilFunctionTest, escrowTransferOp) => {
      return await utilFunctionTest(globals, tx => {
        tx.pushOperation(escrowTransferOp);
      });
    }, utilFunctionTest, escrowTransferOp);

    expect(retVal.operations[0]).toEqual(escrowTransferOp);
  });

  test('Should be able to pass through encryption on transaction with escrow dispute operation which does not support encryption', async ({ waxTest }) => {
    const retVal = await waxTest(async (globals, utilFunctionTest, escrowDisputeOp) => {
      return await utilFunctionTest(globals, tx => {
        tx.pushOperation(escrowDisputeOp);
      });
    }, utilFunctionTest, escrowDisputeOp);

    expect(retVal.operations[0]).toEqual(escrowDisputeOp);
  });

  test('Should be able to pass through encryption on transaction with escrow release operation which does not support encryption', async ({ waxTest }) => {
    const retVal = await waxTest(async (globals, utilFunctionTest, escrowReleaseOp) => {
      return await utilFunctionTest(globals, tx => {
        tx.pushOperation(escrowReleaseOp);
      });
    }, utilFunctionTest, escrowReleaseOp);

    expect(retVal.operations[0]).toEqual(escrowReleaseOp);
  });

  test('Should be able to pass through encryption on transaction with escrow approve operation which does not support encryption', async ({ waxTest }) => {
    const retVal = await waxTest(async (globals, utilFunctionTest, escrowApproveOp) => {
      return await utilFunctionTest(globals, tx => {
        tx.pushOperation(escrowApproveOp);
      });
    }, utilFunctionTest, escrowApproveOp);

    expect(retVal.operations[0]).toEqual(escrowApproveOp);
  });

  test('Should be able to pass through encryption on transaction with cancel transfer from savings operation which does not support encryption', async ({ waxTest }) => {
    const retVal = await waxTest(async (globals, utilFunctionTest, cancelTransferFromSavingsOp) => {
      return await utilFunctionTest(globals, tx => {
        tx.pushOperation(cancelTransferFromSavingsOp);
      });
    }, utilFunctionTest, cancelTransferFromSavingsOp);

    expect(retVal.operations[0]).toEqual(cancelTransferFromSavingsOp);
  });

  test('Should be able to pass through encryption on transaction with decline voting rights operation which does not support encryption', async ({ waxTest }) => {
    const retVal = await waxTest(async (globals, utilFunctionTest, declineVotingRightsOp) => {
      return await utilFunctionTest(globals, tx => {
        tx.pushOperation(declineVotingRightsOp);
      });
    }, utilFunctionTest, declineVotingRightsOp);

    expect(retVal.operations[0]).toEqual(declineVotingRightsOp);
  });

  test('Should be able to pass through encryption on transaction with claim reward balance operation which does not support encryption', async ({ waxTest }) => {
    const retVal = await waxTest(async (globals, utilFunctionTest, claimRewardBalanceOp) => {
      return await utilFunctionTest(globals, tx => {
        tx.pushOperation(claimRewardBalanceOp);
      });
    }, utilFunctionTest, claimRewardBalanceOp);

    expect(retVal.operations[0]).toEqual(claimRewardBalanceOp);
  });

  test('Should be able to pass through encryption on transaction with delegate vesting shares operation which does not support encryption', async ({ waxTest }) => {
    const retVal = await waxTest(async (globals, utilFunctionTest, delegatedVestingSharesOp) => {
      return await utilFunctionTest(globals, tx => {
        tx.pushOperation(delegatedVestingSharesOp);
      });
    }, utilFunctionTest, delegateVestingSharesOp);

    expect(retVal.operations[0]).toEqual(delegateVestingSharesOp);
  });

  test('Should be able to pass through encryption on transaction with account create with delegation operation which does not support encryption', async ({ waxTest }) => {
    const retVal = await waxTest(async (globals, utilFunctionTest, accountCreateWithDelegationOp) => {
      return await utilFunctionTest(globals, tx => {
        tx.pushOperation(accountCreateWithDelegationOp);
      });
    }, utilFunctionTest, accountCreateWithDelegationOp);

    expect(retVal.operations[0]).toEqual(accountCreateWithDelegationOp);
  });

  // XXX
  // test('Should be able to pass through encryption on transaction with witness set properties operation which does not support encryption', async () => {
  //   const retVal = await utilFunctionTest(tx => {
  //     tx.pushOperation(witnessSetPropertiesOp);
  //   });

  //   expect(retVal.operations[0]).toEqual(witnessSetPropertiesOp);
  // });

  test('Should be able to pass through encryption on transaction with account update 2 operation which does not support encryption', async ({ waxTest }) => {
    const retVal = await waxTest(async (globals, utilFunctionTest, accountUpdate2Op) => {
      return await utilFunctionTest(globals, tx => {
        tx.pushOperation(accountUpdate2Op);
      });
    }, utilFunctionTest, accountUpdate2Op);

    expect(retVal.operations[0]).toEqual(accountUpdate2Op);
  });

  test('Should be able to pass through encryption on transaction with create proposal operation which does not support encryption', async ({ waxTest }) => {
    const retVal = await waxTest(async (globals, utilFunctionTest, createProposalOp) => {
      return await utilFunctionTest(globals, tx => {
        tx.pushOperation(createProposalOp);
      });
    }, utilFunctionTest, createProposalOp);

    expect(retVal.operations[0]).toEqual(createProposalOp);
  });

  test('Should be able to pass through encryption on transaction with update proposal votes operation which does not support encryption', async ({ waxTest }) => {
    const retVal = await waxTest(async (globals, utilFunctionTest, updateProposalVotesOp) => {
      return await utilFunctionTest(globals, tx => {
        tx.pushOperation(updateProposalVotesOp);
      });
    }, utilFunctionTest, updateProposalVotesOp);

    expect(retVal.operations[0]).toEqual(updateProposalVotesOp);
  });

  test('Should be able to pass through encryption on transaction with remove proposal operation which does not support encryption', async ({ waxTest }) => {
    const retVal = await waxTest(async (globals, utilFunctionTest, removeProposalOp) => {
      return await utilFunctionTest(globals, tx => {
        tx.pushOperation(removeProposalOp);
      });
    }, utilFunctionTest, removeProposalOp);

    expect(retVal.operations[0]).toEqual(removeProposalOp);
  });

  test('Should be able to pass through encryption on transaction with update proposal operation which does not support encryption', async ({ waxTest }) => {
    const retVal = await waxTest(async (globals, utilFunctionTest, updateProposalOp) => {
      return await utilFunctionTest(globals, tx => {
        tx.pushOperation(updateProposalOp);
      });
    }, utilFunctionTest, updateProposalOp);

    expect(retVal.operations[0]).toEqual(updateProposalOp);
  });

  test('Should be able to pass through encryption on transaction with collateralized converts operation which does not support encryption', async ({ waxTest }) => {
    const retVal = await waxTest(async (globals, utilFunctionTest, collateralizedConvertOp) => {
      return await utilFunctionTest(globals, tx => {
        tx.pushOperation(collateralizedConvertOp);
      });
    }, utilFunctionTest, collateralizedConvertOp);

    expect(retVal.operations[0]).toEqual(collateralizedConvertOp);
  });
});
