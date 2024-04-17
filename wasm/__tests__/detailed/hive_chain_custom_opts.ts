import { ChromiumBrowser, ConsoleMessage, chromium } from 'playwright';
import { expect } from '@playwright/test';

import { DEFAULT_STORAGE_ROOT } from "@hive/beekeeper/node";
import fs from "fs";

import { test } from '../assets/jest-helper';

let browser!: ChromiumBrowser;

test.describe('Wax object interface chain tests (using custom options)', () => {
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

  test('Should be able to use different options', async ({ waxTest, config }) => {
    expect(config).toBeDefined;

    const retVal = await waxTest(async({ wax, chain }) => {
      const myChain = await wax.createHiveChain(config);
      const chainEndpointUrl = chain.endpointUrl;

      const myChainEndpointUrl = myChain.endpointUrl;

      return {
        myChainEndpointUrl,
        chainEndpointUrl
      };
    });

    expect(retVal.myChainEndpointUrl).toBe('http://use.me.now');
    expect(config!.chainId).toBe('42');
    expect(retVal.myChainEndpointUrl).toBe(config!.apiEndpoint);
    expect(retVal.chainEndpointUrl).toBe(config!.apiEndpoint);
   });

   test.afterAll(async () => {
    await browser.close();
  });
});
