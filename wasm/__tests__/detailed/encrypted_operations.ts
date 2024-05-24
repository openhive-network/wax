import { expect } from '@playwright/test';
import { ChromiumBrowser, ConsoleMessage, chromium } from 'playwright';

import { test } from '../assets/jest-helper';

import { DEFAULT_STORAGE_ROOT } from '@hiveio/beekeeper/node';
import fs from 'fs';
import { IEncryptingTransactionBuilder } from '../../dist/bundle/index-full';

import {
  utilFunctionTest,
  chain,
  commentOp,
  convertOp,
  customJsonOp,
  recurrentTransferOp,
  transferFromSavingsOp,
  transferOp,
  transferToSavingsOp,
  voteOp
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

    expect(retVal.operations[0]).toEqual({
      comment: {
        author: 'gtg',
        body: 'Test comment body',
        json_metadata: '{}',
        parent_author: 'gtg',
        parent_permlink: 'test-comment',
        permlink: 'test-comment-2',
        title: 'Test comment',
      },
    });
  });

  test('Should be able to encrypt transaction with transfer operation', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.push(transferOp);
    });

    expect(retVal.operations[0]).toEqual({
      transfer: {
        from_account: 'gtg',
        to_account: 'initminer',
        amount: chain.hive(100),
        memo: 'This should be encrypted',
      },
    });
  });

  test('Should be able to encrypt transaction with custom json operation', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.push(customJsonOp);
    });

    expect(retVal.operations[0]).toEqual({
      custom_json: {
        required_auths: ['gtg'],
        required_posting_auths: ['gtg'],
        id: 'custom_json',
        json: '{}',
      },
    });
  });

  test('Should be able to encrypt transaction with transfer to savings operation', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.push(transferToSavingsOp);
    });

    expect(retVal.operations[0]).toEqual({
      transfer_to_savings: {
        from_account: 'gtg',
        to_account: 'savings',
        amount: chain.hive(100),
        memo: 'This should be encrypted',
      },
    });
  });

  test('Should be able to encrypt transaction with transfer from savings operation', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.push(transferFromSavingsOp);
    });

    expect(retVal.operations[0]).toEqual({
      transfer_from_savings: {
        from_account: 'savings',
        request_id: 1,
        to_account: 'gtg',
        amount: chain.hive(100),
        memo: 'This should be encrypted',
      },
    });
  });

  test('Should be able to encrypt transaction with recurrent transfer operation', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx.push(recurrentTransferOp);
    });

    expect(retVal.operations[0]).toEqual({
      recurrent_transfer: {
        from_account: 'gtg',
        to_account: 'initminer',
        amount: chain.hive(100),
        memo: 'This should be encrypted',
        recurrence: 1,
        executions: 1,
        extensions: [],
      },
    });
  });

  test('Should be able to encrypt transaction with different operations', async () => {
    const retVal = await utilFunctionTest((tx: IEncryptingTransactionBuilder) => {
      tx
        .push(recurrentTransferOp)
        .push(convertOp)
        .push(transferToSavingsOp)
        .push(voteOp)
        .push(commentOp)
        .push(transferOp);
    });

    expect(retVal.operations).toEqual([
      {
        recurrent_transfer: {
          from_account: 'gtg',
          to_account: 'initminer',
          amount: chain.hive(100),
          memo: 'This should be encrypted',
          recurrence: 1,
          executions: 1,
          extensions: [],
        },
      },
      {
        convert: {
          owner: 'gtg',
          requestid: 1,
          amount: chain.hive(100),
        },
      },
      {
        transfer_to_savings: {
          from_account: 'gtg',
          to_account: 'savings',
          amount: chain.hive(100),
          memo: 'This should be encrypted',
        },
      },
      {
        vote: {
          voter: 'gtg',
          author: 'initminer',
          permlink: 'test-permlink',
          weight: 100,
        },
      },
      {
        comment: {
          parent_author: 'gtg',
          parent_permlink: 'test-comment',
          author: 'gtg',
          permlink: 'test-comment-2',
          title: 'Test comment',
          body: 'Test comment body',
          json_metadata: '{}',
        },
      },
      {
        transfer: {
          from_account: 'gtg',
          to_account: 'initminer',
          amount: chain.hive(100),
          memo: 'This should be encrypted',
        },
      },
    ]);
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
