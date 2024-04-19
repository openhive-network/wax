import { ChromiumBrowser, ConsoleMessage, chromium } from 'playwright';
import { expect } from '@playwright/test';

import { test } from '../assets/jest-helper';
import { IScoredEndpoint } from '../../dist/bundle/index-full';

let browser!: ChromiumBrowser;

test.describe('Wax object interface chain tests', () => {
  test.beforeAll(async () => {
    browser = await chromium.launch({
      headless: true
    });
  });

  test.beforeEach(async({ page }) => {
    page.on('console', (msg: ConsoleMessage) => {
      console.log('>>', msg.type(), msg.text())
    });

    await page.goto("http://localhost:8080/wasm/__tests__/assets/test.html", { waitUntil: "load" });
  });

  test('Should be able to create endpoint healthchecker', async ({ waxTest }) => {
    const testEndpoint = "https://api.hive.blog";

    const retVal = await waxTest(({ wax, chain }, testEndpoint) => {
      return new Promise<string>((resolve, reject) => {
        const hc = new wax.HealthChecker();

        hc.on("newbest", ({ endpointUrl }) => { resolve(endpointUrl); }); // New best endpoint url
        hc.on("data", (data: Array<IScoredEndpoint>) => { console.log(JSON.stringify(data)); }); // New data from all endpoint checks - scores ready
        hc.on("error", reject); // Error handled

        hc.register(chain.api.block_api.get_block, { block_num: 1 }, data => data.block?.previous === "0000000000000000000000000000000000000000", [testEndpoint]);
      });
    }, testEndpoint);

    expect(retVal).toStrictEqual("https://api.hive.blog");
   });

  test.afterAll(async () => {
    await browser.close();
  });
});
