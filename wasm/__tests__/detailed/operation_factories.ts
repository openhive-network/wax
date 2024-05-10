import { test, expect } from '@playwright/test';
import { ChromiumBrowser, ConsoleMessage, chromium } from 'playwright';

import { DEFAULT_STORAGE_ROOT } from "@hive/beekeeper/node";
import fs from "fs";
import { RecurrentTransferBuilder, RecurrentTransferPairIdBuilder } from '../../dist/lib/detailed/operation_factories';

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

    await page.goto("http://localhost:8080/wasm/__tests__/assets/test.html", { waitUntil: "load" });
  });

  test("Should create a recurrent transfer with basic properties", async () => {
    const builder = new RecurrentTransferBuilder('alice', 'bob', {
      amount: '100',
      precision: 3,
      nai: '@@000000013'
    }, 'thanks for the service');

    const result = builder.build();

    expect(result.length).toBe(1);
    expect(result).toEqual({
      customJsonContainer: [{
        recurrent_transfer: {
          from_account: 'alice',
          to_account: 'bob',
          amount: {
            amount: '100',
            precision: 3,
            nai: '@@000000013'
          },
          memo: 'thanks for the service',
          recurrence: 24,
          executions: 2,
          extensions: []
        }
      }]
    });
  });

  test("Should add extensions using RecurrentTransferPairIdBuilder", async () => {
    const builder = new RecurrentTransferPairIdBuilder('alice', 'bob', 12345, 'monthly subscription', 24, 2);

    const result = builder.build();

    expect(result).toEqual({
      customJsonContainer: [{
        recurrent_transfer: {
          amount: {
            amount: "",
            nai: "",
            precision: 0
          },
          executions: 2,
          extensions: [{
            recurrent_transfer_pair_id: {
              pair_id: 12345
            }
          }],
          from_account: 'alice',
          memo: 'monthly subscription',
          recurrence: 24,
          to_account: 'bob',
        }
      }]
    });
  });

  test("Properly initialized API should allow generation of a removal operation", async () => {
    const builder = new RecurrentTransferPairIdBuilder('grace', 'henry', 24680);

    const result = builder.generateRemoval().build();

    expect(result).toEqual({
      amount: '0',
      precision: 3,
      nai: '@@000000021'
    });
  });

  test.afterAll(async () => {
    await browser.close();
  });
});

