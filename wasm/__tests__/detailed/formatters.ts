import { ChromiumBrowser, ConsoleMessage, chromium } from 'playwright';
import { test, expect } from '@playwright/test';

import "../assets/data";
import { initminerAccountApi, naiAsset, serialization_sensitive_transaction, serialization_sensitive_transaction_proto } from "../assets/data.protocol";

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
  });

  test('Should be able to format asset using default formatters from hive chain interface', async({ page }) => {
    const retVal = await page.evaluate((naiAsset) => {
      return chain.waxify`Amount: ${naiAsset}`;
    }, naiAsset);

    expect(retVal).toBe("Amount: 300.000 HIVE");
  });

  test('Should be able to format transaction using default formatters from hive chain interface', async({ page }) => {
    const retVal = await page.evaluate((serialization_sensitive_transaction) => {
      const tx = JSON.parse(serialization_sensitive_transaction);

      return chain.waxify`Tx: #${tx}`
    }, serialization_sensitive_transaction);

    expect(retVal).toBe("Tx: #3725c81634f152011e2043eb7119911b953d4267");
  });

  test('Should be able to format protobuf transaction using default formatters from hive chain interface', async({ page }) => {
    const retVal = await page.evaluate((serialization_sensitive_transaction_proto) => {
      return chain.waxify`Tx: #${serialization_sensitive_transaction_proto}`
    }, serialization_sensitive_transaction_proto);

    expect(retVal).toBe("Tx: #3725c81634f152011e2043eb7119911b953d4267");
  });

  test('Should be able to extend formatter with custom options from hive chain interface', async({ page }) => {
    const retVal = await page.evaluate((serialization_sensitive_transaction) => {
      const tx = JSON.parse(serialization_sensitive_transaction);

      const formatter = chain.formatter.extend({ transaction: { displayAsId: false } });

      return formatter.format(tx)
    }, serialization_sensitive_transaction);

    expect(
      retVal
    ).toStrictEqual({
      ref_block_num: 1959,
      ref_block_prefix: 3625727107,
      expiration: "2023-11-09T22:01:24",
      operations: [
        {
          type: "transfer_operation",
          value: {
            from: "oneplus7",
            to: "kryptogames",
            amount: "300.000 HIVE", // !! Amount formatted
            memo: "Roll under 50 4d434bd943616"
          }
        }
      ],
      extensions: []
    });
  });

  test('Should be able to retrieve account from the API and format it using default formatter from the hive chain interface', async({ page }) => {
    const retVal = await page.evaluate(async() => {
      const response = await chain.api.database_api.find_accounts({ accounts: [ "initminer" ] });

      return chain.formatter.format(response.accounts[0]);
    });

    expect(
      retVal
    ).toEqual(initminerAccountApi);
  });

  test.afterAll(async () => {
    await browser.close();
  });
});
