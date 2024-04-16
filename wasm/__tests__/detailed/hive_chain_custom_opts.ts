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

  test('Should be able to use different options', async ({ waxTest, apiEndpointUrl, chainId }) => {
    const retVal = await waxTest(async({ wax, chain }) => {
      
      console.log(`Passed custom apiEndpointUrl is: ${apiEndpointUrl}`);
      console.log(`Passed custom chainId is: ${chainId}`);
    

      const myChain = await wax.createHiveChain({apiEndpoint: apiEndpointUrl, chainId: chainId});

      if(myChain.endpointUrl !== apiEndpointUrl) {
        console.warn('Custom chain Endpoints are NOT matching !!!');
      }

      if(chain.endpointUrl !== apiEndpointUrl) {
        console.warn('Standard chain Endpoints are NOT matching !!!');
      }

      return {
        effective_endpointUrl: myChain.endpointUrl,
        effective_chainId: chainId
      };
    });

    expect(retVal.effective_endpointUrl).toEqual('http://use.me.now');
    expect(retVal.effective_chainId).toEqual('42');
   });

   test.afterAll(async () => {
    await browser.close();
  });
});
