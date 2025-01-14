import { expect } from '@playwright/test';

import { test } from '../assets/jest-helper';

import { IEncryptingTransaction } from '../../dist/bundle/index-full';

import {
  utilFunctionTest,
  commentOp,
  convertOp,
  customJsonOp,
  recurrentTransferOp,
  transferFromSavingsOp,
  transferOp,
  transferToSavingsOp,
  voteOp,
} from '../assets/data.encryption-operations';

test.describe('Wax encrypted operations tests', () => {
  test('Should be able to encrypt transaction with comment operation', async ({ waxTest }) => {
    const retVal = await waxTest(async (globals, utilFunctionTest, commentOp) => {
      return await utilFunctionTest(globals, (tx: IEncryptingTransaction) => {
        tx.pushOperation(commentOp);
      });
    }, utilFunctionTest, commentOp);

    expect(retVal.operations[0]).toEqual(commentOp);
  });

  test('Should be able to encrypt transaction with transfer operation', async ({ waxTest }) => {
    const retVal = await waxTest(async (globals, utilFunctionTest, transferOp) => {
      return await utilFunctionTest(globals, (tx: IEncryptingTransaction) => {
        tx.pushOperation(transferOp);
      });
    }, utilFunctionTest, transferOp);

    expect(retVal.operations[0]).toEqual(transferOp);
  });

  test('Should be able to encrypt transaction with custom json operation', async ({ waxTest }) => {
    const retVal = await waxTest(async (globals, utilFunctionTest, customJsonOp) => {
      return await utilFunctionTest(globals, (tx: IEncryptingTransaction) => {
        tx.pushOperation(customJsonOp);
      });
    }, utilFunctionTest, customJsonOp);

    expect(retVal.operations[0]).toEqual(customJsonOp);
  });

  test('Should be able to encrypt transaction with transfer to savings operation', async ({ waxTest }) => {
    const retVal = await waxTest(async (globals, utilFunctionTest, transferToSavingsOp) => {
      return await utilFunctionTest(globals, (tx: IEncryptingTransaction) => {
        tx.pushOperation(transferToSavingsOp);
      });
    }, utilFunctionTest, transferToSavingsOp);

    expect(retVal.operations[0]).toEqual(transferToSavingsOp);
  });

  test('Should be able to encrypt transaction with transfer from savings operation', async ({ waxTest }) => {
    const retVal = await waxTest(async (globals, utilFunctionTest, transferFromSavingsOp) => {
      return await utilFunctionTest(globals, (tx: IEncryptingTransaction) => {
        tx.pushOperation(transferFromSavingsOp);
      });
    }, utilFunctionTest, transferFromSavingsOp);

    expect(retVal.operations[0]).toEqual(transferFromSavingsOp);
  });

  test('Should be able to encrypt transaction with recurrent transfer operation', async ({ waxTest }) => {
    const retVal = await waxTest(async (globals, utilFunctionTest, recurrentTransferOp) => {
      return await utilFunctionTest(globals, (tx: IEncryptingTransaction) => {
        tx.pushOperation(recurrentTransferOp);
      });
    }, utilFunctionTest, recurrentTransferOp);

    expect(retVal.operations[0]).toEqual(recurrentTransferOp);
  });

  test('Should be able to encrypt transaction with different operations', async ({ waxTest }) => {
    const retVal = await waxTest(async (globals, utilFunctionTest, recurrentTransferOp, convertOp, transferToSavingsOp, voteOp, commentOp, transferOp) => {
      return await utilFunctionTest(globals, (tx: IEncryptingTransaction) => {
       tx.pushOperation(recurrentTransferOp).pushOperation(convertOp).pushOperation(transferToSavingsOp).pushOperation(voteOp).pushOperation(commentOp).pushOperation(transferOp);
     }, [1, 3]);
    }, utilFunctionTest, recurrentTransferOp, convertOp, transferToSavingsOp, voteOp, commentOp, transferOp);

    expect(retVal.operations).toEqual([recurrentTransferOp, convertOp, transferToSavingsOp, voteOp, commentOp, transferOp]);
  });

  test('Should be able to encrypt transaction with comment operation with different keys', async ({ waxTest }) => {
    const retVal = await waxTest(async (globals, utilFunctionTest, commentOp) => {
      return await utilFunctionTest(globals, (tx: IEncryptingTransaction) => {
        tx.pushOperation(commentOp);
      }, [], true);
    }, utilFunctionTest, commentOp);

    expect(retVal.operations[0]).toEqual(commentOp);
  });

  test('Should be able to encrypt transaction with recurrent transfer operation with different keys', async ({ waxTest }) => {
    const retVal = await waxTest(async (globals, utilFunctionTest, recurrentTransferOp) => {
      return await utilFunctionTest(globals, (tx: IEncryptingTransaction) => {
        tx.pushOperation(recurrentTransferOp);
      }, [], true);
    }, utilFunctionTest, recurrentTransferOp);

    expect(retVal.operations[0]).toEqual(recurrentTransferOp);
  });

  test('Should be able to encrypt transaction with transfer to savings operation with different keys', async ({ waxTest }) => {
    const retVal = await waxTest(async (globals, utilFunctionTest, transferToSavingsOp) => {
      return await utilFunctionTest(globals, (tx: IEncryptingTransaction) => {
        tx.pushOperation(transferToSavingsOp);
      }, [], true);
    }, utilFunctionTest, transferToSavingsOp);

    expect(retVal.operations[0]).toEqual(transferToSavingsOp);
  });

  test('Should be able to encrypt transaction with different operations with different keys', async ({ waxTest }) => {
    const retVal = await waxTest(async (globals, utilFunctionTest, recurrentTransferOp, convertOp, transferToSavingsOp, voteOp, commentOp, transferOp) => {
      return await utilFunctionTest(globals, (tx: IEncryptingTransaction, encryptionKeys) => {
        tx
        .pushOperation(recurrentTransferOp)
        .stopEncrypt()
        .pushOperation(convertOp)
        .startEncrypt(encryptionKeys[0], encryptionKeys[1])
        .pushOperation(transferToSavingsOp)
        .stopEncrypt()
        .pushOperation(voteOp)
        .startEncrypt(encryptionKeys[0], encryptionKeys[1])
        .pushOperation(commentOp)
        .pushOperation(transferOp);
      }, [1, 3], true);
    }, utilFunctionTest, recurrentTransferOp, convertOp, transferToSavingsOp, voteOp, commentOp, transferOp);

    expect(retVal.operations).toEqual([recurrentTransferOp, convertOp, transferToSavingsOp, voteOp, commentOp, transferOp]);
  });

  test('Should be able to encrypt some specific operations in transaction', async ({ waxTest }) => {
    const retVal = await waxTest(async (globals, utilFunctionTest, recurrentTransferOp, convertOp, transferToSavingsOp, voteOp, commentOp, transferOp) => {
      return await utilFunctionTest(globals, (tx: IEncryptingTransaction, encryptionKeys) => {
        tx
          .pushOperation(recurrentTransferOp)
          .stopEncrypt()
          .pushOperation(convertOp)
          .pushOperation(transferToSavingsOp)
          .pushOperation(voteOp)
          .startEncrypt(encryptionKeys[0], encryptionKeys[1])
          .pushOperation(commentOp)
          .stopEncrypt()
          .pushOperation(transferOp)
          .startEncrypt(encryptionKeys[0])
          .pushOperation(voteOp); // Test should end with startEncrypt statement to avoid complications and allow utilFunctionTest to stop encrypt by itself.
      }, [1, 2, 3, 5]); // Index 6 is omited here to check if EncryptionVisitor will correctly avoid lambda call on this operation.
    }, utilFunctionTest, recurrentTransferOp, convertOp, transferToSavingsOp, voteOp, commentOp, transferOp);

    expect(retVal.operations).toEqual([recurrentTransferOp, convertOp, transferToSavingsOp, voteOp, commentOp, transferOp, voteOp]);
  });

  test('Should be able to encrypt some specific operations in transaction with a barren keys pair at the end', async ({ waxTest }) => {
    const retVal = await waxTest(async (globals, utilFunctionTest, recurrentTransferOp, convertOp, transferToSavingsOp, voteOp, commentOp, transferOp) => {
      return await utilFunctionTest(globals, (tx: IEncryptingTransaction, encryptionKeys) => {
        tx
          .pushOperation(recurrentTransferOp)
          .stopEncrypt()
          .pushOperation(convertOp)
          .pushOperation(transferToSavingsOp)
          .pushOperation(voteOp)
          .startEncrypt(encryptionKeys[0], encryptionKeys[1])
          .pushOperation(commentOp)
          .stopEncrypt()
          .pushOperation(transferOp)
          .startEncrypt(encryptionKeys[0], encryptionKeys[1]);
      }, [1, 2, 3, 5], true);
    }, utilFunctionTest, recurrentTransferOp, convertOp, transferToSavingsOp, voteOp, commentOp, transferOp);

    expect(retVal.operations).toEqual([recurrentTransferOp, convertOp, transferToSavingsOp, voteOp, commentOp, transferOp]);
  });
});
