import { ChromiumBrowser, ConsoleMessage, chromium } from 'playwright';
import { test, expect } from '@playwright/test';

import type WaxModule from '../../dist/lib/wax_module';
declare var wax: typeof WaxModule;

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

    await page.goto(`http://localhost:8080/wasm/__tests__/assets/test.html`);
    await page.waitForURL('**/test.html', { waitUntil: 'load' });
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

  test('Should have global module', async ({ page }) => {
    const moduleType = await page.evaluate(() => {
      return typeof wax;
    });

    expect(moduleType).toBe('function');
  });

  test('Should be able to create instance of protocol', async ({ page }) => {
    await page.evaluate(async () => {
      const provider = await wax();
      new provider.protocol();
    });
  });

  test('Should be able to create instance of proto protocol', async ({ page }) => {
    await page.evaluate(async () => {
      const provider = await wax();
      new provider.proto_protocol();
    });
  });

  test.afterAll(async () => {
    await browser.close();
  });
});
