import { ChromiumBrowser, ConsoleMessage, chromium } from 'playwright';
import { expect } from '@playwright/test';

import { test } from '../assets/jest-helper';
import { createServer } from '../assets/proxy-mock-server';
import { JsonRpcMock } from '../assets/api-mock';
import jsonRpcMock from '../assets/mock/jsonRpcMock';
import steem from '../assets/mock/data/steem';

let browser!: ChromiumBrowser;

let closeServer: () => Promise<void>;

test.describe('Wax base mock tests', () => {
  test.beforeAll(async () => {
    browser = await chromium.launch({
      headless: true
    });

    closeServer = await createServer(new JsonRpcMock(jsonRpcMock), 'localhost', 8000);
  });

  test.beforeEach(async({ page }) => {
    page.on('console', (msg: ConsoleMessage) => {
      console.log('>>', msg.type(), msg.text())
    });

    await page.goto("http://localhost:8080/wasm/__tests__/assets/test.html", { waitUntil: "load" });
  });

  test('Should be able to find account based on mock interface', async ({ waxTest }) => {
    const retVal = await waxTest(async({ chain }, account) => {
      const foundAccount = await chain.api.database_api.find_accounts({ accounts: ['steem'] });

      console.log(JSON.stringify(foundAccount));

      return JSON.stringify(foundAccount) === JSON.stringify(account.result);
    }, steem);

    expect(retVal).toBe(true);
  });

  test.afterAll(async () => {
    await browser.close();

    await closeServer();
  });
});
