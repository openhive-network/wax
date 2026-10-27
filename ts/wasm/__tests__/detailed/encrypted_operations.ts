import { expect } from '@playwright/test';

import { test, type IWaxFixtureMethods } from '../assets/jest-helper';

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
      return await utilFunctionTest(globals, tx => {
        tx.pushOperation(commentOp);
      });
    }, utilFunctionTest, commentOp);

    expect(retVal.operations[0]).toEqual(commentOp);
  });

  test('Should be able to encrypt transaction with transfer operation', async ({ waxTest }) => {
    const retVal = await waxTest(async (globals, utilFunctionTest, transferOp) => {
      return await utilFunctionTest(globals, tx => {
        tx.pushOperation(transferOp);
      });
    }, utilFunctionTest, transferOp);

    expect(retVal.operations[0]).toEqual(transferOp);
  });

  test('Should be able to encrypt transaction with custom json operation', async ({ waxTest }) => {
    const retVal = await waxTest(async (globals, utilFunctionTest, customJsonOp) => {
      return await utilFunctionTest(globals, tx => {
        tx.pushOperation(customJsonOp);
      });
    }, utilFunctionTest, customJsonOp);

    expect(retVal.operations[0]).toEqual(customJsonOp);
  });

  test('Should be able to encrypt transaction with transfer to savings operation', async ({ waxTest }) => {
    const retVal = await waxTest(async (globals, utilFunctionTest, transferToSavingsOp) => {
      return await utilFunctionTest(globals, tx => {
        tx.pushOperation(transferToSavingsOp);
      });
    }, utilFunctionTest, transferToSavingsOp);

    expect(retVal.operations[0]).toEqual(transferToSavingsOp);
  });

  test('Should be able to encrypt transaction with transfer from savings operation', async ({ waxTest }) => {
    const retVal = await waxTest(async (globals, utilFunctionTest, transferFromSavingsOp) => {
      return await utilFunctionTest(globals, tx => {
        tx.pushOperation(transferFromSavingsOp);
      });
    }, utilFunctionTest, transferFromSavingsOp);

    expect(retVal.operations[0]).toEqual(transferFromSavingsOp);
  });

  test('Should be able to encrypt transaction with recurrent transfer operation', async ({ waxTest }) => {
    const retVal = await waxTest(async (globals, utilFunctionTest, recurrentTransferOp) => {
      return await utilFunctionTest(globals, tx => {
        tx.pushOperation(recurrentTransferOp);
      });
    }, utilFunctionTest, recurrentTransferOp);

    expect(retVal.operations[0]).toEqual(recurrentTransferOp);
  });

  test('Should be able to encrypt transaction with different operations', async ({ waxTest }) => {
    const retVal = await waxTest(async (globals, utilFunctionTest, recurrentTransferOp, convertOp, transferToSavingsOp, voteOp, commentOp, transferOp) => {
      return await utilFunctionTest(globals, tx => {
       tx.pushOperation(recurrentTransferOp).pushOperation(convertOp).pushOperation(transferToSavingsOp).pushOperation(voteOp).pushOperation(commentOp).pushOperation(transferOp);
     }, [1, 3]);
    }, utilFunctionTest, recurrentTransferOp, convertOp, transferToSavingsOp, voteOp, commentOp, transferOp);

    expect(retVal.operations).toEqual([recurrentTransferOp, convertOp, transferToSavingsOp, voteOp, commentOp, transferOp]);
  });

  test('Should be able to encrypt transaction with comment operation with different keys', async ({ waxTest }) => {
    const retVal = await waxTest(async (globals, utilFunctionTest, commentOp) => {
      return await utilFunctionTest(globals, tx => {
        tx.pushOperation(commentOp);
      }, [], true);
    }, utilFunctionTest, commentOp);

    expect(retVal.operations[0]).toEqual(commentOp);
  });

  test('Should be able to encrypt transaction with recurrent transfer operation with different keys', async ({ waxTest }) => {
    const retVal = await waxTest(async (globals, utilFunctionTest, recurrentTransferOp) => {
      return await utilFunctionTest(globals, tx => {
        tx.pushOperation(recurrentTransferOp);
      }, [], true);
    }, utilFunctionTest, recurrentTransferOp);

    expect(retVal.operations[0]).toEqual(recurrentTransferOp);
  });

  test('Should be able to encrypt transaction with transfer to savings operation with different keys', async ({ waxTest }) => {
    const retVal = await waxTest(async (globals, utilFunctionTest, transferToSavingsOp) => {
      return await utilFunctionTest(globals, tx => {
        tx.pushOperation(transferToSavingsOp);
      }, [], true);
    }, utilFunctionTest, transferToSavingsOp);

    expect(retVal.operations[0]).toEqual(transferToSavingsOp);
  });

  test('Should be able to encrypt transaction with different operations with different keys', async ({ waxTest }) => {
    const retVal = await waxTest(async (globals, utilFunctionTest, recurrentTransferOp, convertOp, transferToSavingsOp, voteOp, commentOp, transferOp) => {
      return await utilFunctionTest(globals, (tx, encryptionKeys) => {
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
      return await utilFunctionTest(globals, (tx, encryptionKeys) => {
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
      return await utilFunctionTest(globals, (tx, encryptionKeys) => {
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

  test.describe('Encrypted memo field order', () => {
    const memoKeyWif = '5JkFnXrLM2ap9t3AmAxBJvQHF7xSKtnTrCTginQCkhzU5S7ecPT';
    const standardOrderMemo = '#6cyczk8wKT991jWuKj2tuJLN9QGFmhSrHJ52AuKE9CP9ALS2vVhBVB5YqnT37pTLt76CuPYuzoJY9f31sX2QKQDTBXihTTqM2ZgWLsnWbdWZSsvTXr78tSCezfzAwehn1umdeHgCefsE1rTp45N3A9P';
    // The same memo in the legacy field order (nonce, check, encrypted, from, to) written by wax 1.27.5 - 1.28.6
    const legacyOrderMemo = '#5P5bvgpUUGTskb98shuYBTpSMqfoTBev6Ay2xo9UgMF3Rj5uhFSqwVLb4LZkmCcodBdQUgEspA1t2dByaMVAjyJFZN767GRGxGDtx2r3sQtui9kFEWPGcxXYvWZLxAxDJmgtqc4wUsgNKYe5kZPPQSHg';

    const decryptMemo = (waxTest: IWaxFixtureMethods['waxTest'], memo: string) =>
      waxTest(async ({ base, beekeeper, createSigner }, wif, encrypted) => {
        const session = beekeeper.createSession("salt");
        const { wallet } = await session.createWallet("w0");
        const publicKey = await wallet.importKey(wif);

        return await createSigner(base, wallet, publicKey).decryptData(encrypted);
      }, memoKeyWif, memo);

    test('Should decrypt memo in the standard field order', async ({ waxTest }) => {
      expect(await decryptMemo(waxTest, standardOrderMemo)).toBe("This should be encrypted");
    });

    test('Should decrypt memo in the legacy field order', async ({ waxTest }) => {
      expect(await decryptMemo(waxTest, legacyOrderMemo)).toBe("This should be encrypted");
    });

    test('Should fail to decrypt memo in neither field order', async ({ waxTest }) => {
      await expect(decryptMemo(waxTest, '#111111118N2MrWbLqudcbQR4EUziLoGAqR7XN')).rejects.toThrow(/Could not load the crypto memo content from given string/);
    });
  });
});
