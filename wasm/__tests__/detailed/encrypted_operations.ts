import { expect } from '@playwright/test';
import { ChromiumBrowser, ConsoleMessage, chromium } from 'playwright';

import { test } from '../assets/jest-helper';

import { DEFAULT_STORAGE_ROOT } from '@hiveio/beekeeper/node';
import fs from 'fs';
import { IEncryptingTransactionBuilder } from '../../dist/bundle/index-full';

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

  test('Should be able to encrypt transaction with comment operation', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.push(commentOp);
    });

    expect(retVal.operations[0]).toEqual(commentOp);
  });

  test('Should be able to encrypt transaction with transfer operation', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.push(transferOp);
    });

    expect(retVal.operations[0]).toEqual(transferOp);
  });

  test('Should be able to encrypt transaction with custom json operation', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.push(customJsonOp);
    });

    expect(retVal.operations[0]).toEqual(customJsonOp);
  });

  test('Should be able to encrypt transaction with transfer to savings operation', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.push(transferToSavingsOp);
    });

    expect(retVal.operations[0]).toEqual(transferToSavingsOp);
  });

  test('Should be able to encrypt transaction with transfer from savings operation', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.push(transferFromSavingsOp);
    });

    expect(retVal.operations[0]).toEqual(transferFromSavingsOp);
  });

  test('Should be able to encrypt transaction with recurrent transfer operation', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.push(recurrentTransferOp);
    });

    expect(retVal.operations[0]).toEqual(recurrentTransferOp);
  });

  test('Should be able to encrypt transaction with different operations', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.push(recurrentTransferOp).push(convertOp).push(transferToSavingsOp).push(voteOp).push(commentOp).push(transferOp);
    }, [1, 3]);

    expect(retVal.operations).toEqual([recurrentTransferOp, convertOp, transferToSavingsOp, voteOp, commentOp, transferOp]);
  });

  test('Should be able to encrypt transaction with comment operation with different keys', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.push(commentOp);
    }, [], true);

    expect(retVal.operations[0]).toEqual(commentOp);
  });

  test('Should be able to encrypt transaction with recurrent transfer operation with different keys', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.push(recurrentTransferOp);
    }, [], true);

    expect(retVal.operations[0]).toEqual(recurrentTransferOp);
  });

  test('Should be able to encrypt transaction with transfer to savings operation with different keys', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.push(transferToSavingsOp);
    }, [], true);

    expect(retVal.operations[0]).toEqual(transferToSavingsOp);
  });

  test('Should be able to encrypt transaction with different operations with different keys', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder, encryptionKeys) => {
      tx
      .push(recurrentTransferOp)
      .stopEncrypt()
      .push(convertOp)
      .startEncrypt(encryptionKeys[0], encryptionKeys[1])
      .push(transferToSavingsOp)
      .stopEncrypt()
      .push(voteOp)
      .startEncrypt(encryptionKeys[0], encryptionKeys[1])
      .push(commentOp)
      .push(transferOp);
    }, [1, 3], true);

    expect(retVal.operations).toEqual([recurrentTransferOp, convertOp, transferToSavingsOp, voteOp, commentOp, transferOp]);
  });

  test('Should be able to encrypt some specific operations in transaction', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder, encryptionKeys) => {
      tx
        .push(recurrentTransferOp)
        .stopEncrypt()
        .push(convertOp)
        .push(transferToSavingsOp)
        .push(voteOp)
        .startEncrypt(encryptionKeys[0], encryptionKeys[1])
        .push(commentOp)
        .stopEncrypt()
        .push(transferOp)
        .startEncrypt(encryptionKeys[0])
        .push(voteOp); // Test should end with startEncrypt statement to avoid complications and allow utilFunctionTest to stop encrypt by itself.
    }, [1, 2, 3, 5]); // Index 6 is omited here to check if EncryptionVisitor will correctly avoid lambda call on this operation.

    expect(retVal.operations).toEqual([recurrentTransferOp, convertOp, transferToSavingsOp, voteOp, commentOp, transferOp, voteOp]);
  });

  test('Should be able to encrypt some specific operations in transaction with a barren keys pair at the end', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder, encryptionKeys) => {
      tx
        .push(recurrentTransferOp)
        .stopEncrypt()
        .push(convertOp)
        .push(transferToSavingsOp)
        .push(voteOp)
        .startEncrypt(encryptionKeys[0], encryptionKeys[1])
        .push(commentOp)
        .stopEncrypt()
        .push(transferOp)
        .startEncrypt(encryptionKeys[0], encryptionKeys[1]);
    }, [1, 2, 3, 5], true);

    expect(retVal.operations).toEqual([recurrentTransferOp, convertOp, transferToSavingsOp, voteOp, commentOp, transferOp]);
  });

  test.afterAll(async () => {
    await browser.close();
  });
});
