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

    test.afterAll(async () => {
    await browser.close();
  });
});
