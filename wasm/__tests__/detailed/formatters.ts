import { ChromiumBrowser, ConsoleMessage, chromium } from 'playwright';
import { test, expect } from '@playwright/test';

import "../assets/data";
import { naiAsset } from "../assets/data.protocol";

let browser!: ChromiumBrowser;

test.describe('Wax object interface formatters tests', () => {
  test.beforeAll(async () => {
    browser = await chromium.launch({
      headless: true
    });
  });

  test.beforeEach(async({ page }) => {
    page.on('console', (msg: ConsoleMessage) => {
      console.log('>>', msg.type(), msg.text())
    });

    await page.goto(`http://localhost:8080/wasm/__tests__/assets/beekeeper.html`);
    await page.waitForURL('**/beekeeper.html', { waitUntil: 'load' });

    await page.evaluate(async () => {
      const chain = await createHiveChain();

      Object.defineProperties(window, {
        chain: {
          get() {
            return chain;
          }
        }
      });
    });
  });

  test('Should be able to format asset using default formatters from hive chain interface', async({ page }) => {
    const retVal = await page.evaluate((naiAsset) => {
      return chain.waxify`Amount: ${naiAsset}`;
    }, naiAsset);

    expect(retVal).toBe("Amount: 300.000 HIVE");
  });

  test.afterAll(async () => {
    await browser.close();
  });
});
