import { ChromiumBrowser, ConsoleMessage, chromium } from 'playwright';
import { expect } from '@playwright/test';

import { test } from '../assets/jest-helper';

let browser!: ChromiumBrowser;

test.describe('WASM Base tests', () => {
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

  // Base browser type test
  test('Should test on chromium', async () => {
    const browserType = browser.browserType();

    expect(browserType.name()).toBe('chromium');
  });

  // Base valid test html webpage test
  test('Should have a valid html test webpage', async ({ page }) => {
    const id = await page.$eval("body", n => n.getAttribute("id"))

    expect(id).toBe('waxbody');
  });

  test('Should have global instance of protocol', async ({ wasmTest }) => {
    const moduleType = await wasmTest(({ protocol }) => {
      return typeof protocol;
    });

    expect(moduleType).toBe('object');
  });

  test.afterAll(async () => {
    await browser.close();
  });
});
