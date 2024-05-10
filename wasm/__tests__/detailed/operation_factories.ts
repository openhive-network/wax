import { expect } from '@playwright/test';
import { ChromiumBrowser, ConsoleMessage, chromium } from 'playwright';

import { test } from '../assets/jest-helper';

import { DEFAULT_STORAGE_ROOT } from "@hiveio/beekeeper/node";
import fs from "fs";

let browser!: ChromiumBrowser;

test.describe('Wax operation factories tests', () => {
  test.beforeAll(async () => {
    browser = await chromium.launch({
      headless: true
    });
  });

  test.beforeEach(async({ page }) => {
    page.on('console', (msg: ConsoleMessage) => {
      console.log('>>', msg.type(), msg.text())
    });

    if(fs.existsSync(`${DEFAULT_STORAGE_ROOT}/.beekeeper/w0.wallet`))
      fs.rmSync(`${DEFAULT_STORAGE_ROOT}/.beekeeper/w0.wallet`);

    await page.goto('http://localhost:8080/wasm/__tests__/assets/test.html', { waitUntil: 'load' });
  });

  test('Should create a recurrent transfer with basic properties', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain, wax }) => {
      const tx = new chain.TransactionBuilder('04c507a8c7fe5be96be64ce7c86855e1806cbde3', '2023-11-09T21:51:27');

      tx.useBuilder(wax.RecurrentTransferBuilder, () => {}, 'alice', 'bob', { amount: '100', precision: 3, nai: '@@000000013' }, 'thanks for the service');

      return tx.toApi();
    });

    expect(JSON.parse(retVal).operations[0]).toEqual({
      type: 'recurrent_transfer_operation',
      value: {
        amount: {
          amount: '100',
          nai: '@@000000013',
          precision: 3
        },
        executions: 2,
        from: 'alice',
        memo: 'thanks for the service',
        recurrence: 24,
        to: 'bob'
      }
    });
  });

  test('Should add extensions using RecurrentTransferPairIdBuilder', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain, wax }) => {
      const tx = new chain.TransactionBuilder('04c507a8c7fe5be96be64ce7c86855e1806cbde3', '2023-11-09T21:51:27');

      tx.useBuilder(wax.RecurrentTransferPairIdBuilder, () => {}, 'alice', 'bob', 12345, 'monthly subscription', 24, 2);

      return tx.toApi();
    });

    expect(JSON.parse(retVal).operations[0]).toEqual({
      type: 'recurrent_transfer_operation',
      value: {
        amount: {
          amount: '',
          nai: '',
          precision: 0
        },
        executions: 2,
        extensions: [{
          type: 'recurrent_transfer_pair_id',
          value: {
            pair_id: 12345
          }
        }],
        from: 'alice',
        memo: 'monthly subscription',
        recurrence: 24,
        to: 'bob'
      }
    });
  });

  test('Properly initialized API should allow generation of a removal operation', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain, wax }) => {
      const tx = new chain.TransactionBuilder('04c507a8c7fe5be96be64ce7c86855e1806cbde3', '2023-11-09T21:51:27');

      tx.useBuilder(wax.RecurrentTransferPairIdBuilder, builder => {
        builder.generateRemoval();
      }, 'grace', 'henry', 24680);

      return tx.toApi();
    });

    expect(JSON.parse(retVal).operations[0]).toEqual({
      type: 'recurrent_transfer_operation',
      value: {
        from: 'grace',
        to: 'henry',
        amount: { amount: '0', precision: 3, nai: '@@000000021' },
        memo: '',
        recurrence: 24,
        executions: 2,
        extensions: [ { type: 'recurrent_transfer_pair_id', value: { pair_id: 24680 } } ]
      }
    });
  });

  test('Should initialize update proposal builder with mandatory fields only', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain, wax }) => {
      const tx = new chain.TransactionBuilder('04c507a8c7fe5be96be64ce7c86855e1806cbde3', '2023-11-09T21:51:27');

      tx.useBuilder(wax.UpdateProposalBuilder, () => {}, '123', 'alice', { amount: '1000', precision: 3, nai: '@@000000013' }, 'Improve UI Design', 'improve-ui');

      return tx.toApi();
    });

    expect(JSON.parse(retVal).operations[0]).toEqual({
      type: 'update_proposal_operation',
      value: {
        creator: 'alice',
        daily_pay: { amount: '1000', nai: '@@000000013', precision: 3 },
        permlink: 'improve-ui',
        proposal_id: '123',
        subject: 'Improve UI Design'
      }
    });
  });

  test('Should add endDate in update proposal builder when provided', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain, wax }) => {
      const tx = new chain.TransactionBuilder('04c507a8c7fe5be96be64ce7c86855e1806cbde3', '2023-11-09T21:51:27');

      tx.useBuilder(wax.UpdateProposalBuilder, () => {}, '123', 'alice', { amount: '1000', precision: 3, nai: '@@000000013' }, 'Improve UI Design', 'improve-ui', '2023-03-14');

      return tx.toApi();
    });

    expect(JSON.parse(retVal).operations[0]).toEqual({
      type: 'update_proposal_operation',
      value: {
        creator: 'alice',
        daily_pay: { amount: '1000', nai: '@@000000013', precision: 3 },
        extensions: [{
          type: 'update_proposal_end_date',
          value: {
            end_date: '2023-03-14T00:00:00'
          }
        }],
        permlink: 'improve-ui',
        proposal_id: '123',
        subject: 'Improve UI Design'
      }
    });
  });

  test('Should handle edge case in update proposal builder where endDate is given as timestamp', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain, wax }) => {
      const tx = new chain.TransactionBuilder('04c507a8c7fe5be96be64ce7c86855e1806cbde3', '2023-11-09T21:51:27');

      tx.useBuilder(wax.UpdateProposalBuilder, () => {}, '123', 'alice', { amount: '1000', precision: 3, nai: '@@000000013' }, 'Improve UI Design', 'improve-ui', 1678917600000);

      return tx.toApi();
    });

    expect(JSON.parse(retVal).operations[0]).toEqual({
      type: 'update_proposal_operation',
      value: {
        creator: 'alice',
        daily_pay: { amount: '1000', nai: '@@000000013', precision: 3 },
        extensions: [{
          type: 'update_proposal_end_date',
          value: {
            end_date: '2023-03-15T22:00:00'
          }
        }],
        permlink: 'improve-ui',
        proposal_id: '123',
        subject: 'Improve UI Design'
      }
    });
  });

  test.afterAll(async () => {
    await browser.close();
  });
});

