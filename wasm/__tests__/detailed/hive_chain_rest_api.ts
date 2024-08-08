import { ChromiumBrowser, ConsoleMessage, chromium } from 'playwright';
import { expect } from '@playwright/test';

import { DEFAULT_STORAGE_ROOT } from "@hiveio/beekeeper/node";
import fs from "fs";

import { test } from '../assets/jest-helper';

let browser!: ChromiumBrowser;

test.describe('Wax object interface chain REST API tests', () => {
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

  test('Should be able to call basic REST API endpoint', async ({ waxTest }) => {
    const retVal = await waxTest.dynamic(async({ chain }) => {
      const blocks = await chain.restApi.hafbe.blocks.latest({ limit: 1000 });

      return blocks;
    });

    expect(retVal.length).toBeGreaterThan(0);
    expect(typeof retVal[0].block_num).toBe("number");
    expect(typeof retVal[0].witness).toBe("string");
    expect(retVal[0].ops_count.length).toBeGreaterThan(0);
    expect(typeof retVal[0].ops_count[0].count).toBe("number");
    expect(typeof retVal[0].ops_count[0].op_type_id).toBe("number");
  });

  test('Should be able to extend and perform REST API calls', async ({ waxTest }) => {
    const retVal = await waxTest.dynamic(async({ chain }) => {
      class TransactionByIdRequest {
        public transactionId!: string;
      }

      class DummyResponse {
        public transaction_json!: object;
      }

      const extended = chain.extendRest({
        hafbe: {
          transactions: {
            byId: {
              params: TransactionByIdRequest,
              result: DummyResponse,
              urlPath: "{transactionId}"
            }
          }
        }
      });

      const blocks = await extended.restApi.hafbe.transactions.byId({ transactionId: "954f6de36e6715d128fa8eb5a053fc254b05ded0" });

      return blocks;
    });

    expect(typeof retVal).toBe("object");
    expect(typeof retVal.transaction_json).toBe("object");
    expect(retVal.transaction_json !== null).toBeTruthy();
  });

  test('Should be able to extend and perform REST API calls returning INT', async ({ waxTest }) => {
    const retVal = await waxTest.dynamic(async({ chain }) => {
      const extended = chain.extendRest({
        hafbe: {
          'block-numbers': {
            headblock: {
              params: undefined,
              result: Number
            }
          }
        }
      });

      const blockNum = await extended.restApi.hafbe['block-numbers'].headblock();

      return blockNum;
    });

    expect(typeof retVal).toBe("number");
  });

  test('Should be able to extend REST API, then extend standard API and keep all of the types', async ({ waxTest }) => {
    const retVal = await waxTest(async({ chain }) => {
      // First extend REST API
      const extended1 = chain.extendRest({
        a: {
          b: {
            params: undefined,
            result: undefined
          }
        }
      });

      // Then extend standard Node API - types from extended REST API should be preserved
      const extended2 = extended1.extend({
        a: {
          b: {
            params: {},
            result: {}
          }
        }
      })

      // This is more of a "static" compilation test - should compile successfully - tests if types has not been dropped
      return typeof extended2.restApi.a.b;
    });

    expect(retVal).toBe("function");
  });

  test('Should be able to set REST API endpoint URL', async ({ waxTest }) => {
    const url1 = "https://best.honey.provider";

    const retVal = await waxTest(async({ chain }, url1) => {
      chain.restApi.endpointUrl = url1;

      return chain.restApi.endpointUrl;
    }, url1);

    expect(retVal).toBe(url1);
  });

  test('Should be able to set REST API endpoint URL on different APIs', async ({ waxTest }) => {
    const url1 = "https://best.honey.provider";
    const url2 = "https://other.honey.provider";

    const retVal = await waxTest(async({ chain }, url1, url2) => {
      chain.restApi.hafbe.blocks.endpointUrl = url1;
      chain.restApi.hafbe.blocks.latest.endpointUrl = url2;

      return [chain.restApi.endpointUrl, chain.restApi.hafbe.blocks.endpointUrl, chain.restApi.hafbe.blocks.latest.endpointUrl];
    }, url1, url2);

    expect(retVal).toStrictEqual(["https://api.syncad.com", url1, url2]);
  });

  test.afterAll(async () => {
    await browser.close();
  });
});
