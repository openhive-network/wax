import { ChromiumBrowser, ConsoleMessage, chromium } from 'playwright';
import { test, expect } from '@playwright/test';

import "../assets/data";
import { customJsonsTransaction, protoVoteOp } from '../assets/data.proto-protocol';

let browser!: ChromiumBrowser;

test.describe('Wax hive apps operations tests', () => {
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
      const wx = await createWaxFoundation();

      Object.defineProperties(window, {
        wx: {
          get() {
            return wx;
          }
        }
      });
    });
  });

  test('Should be able to create transaction with hive apps follow operation using transaction builder interface', async ({ page }) => {
    const retVal = await page.evaluate(async(protoVoteOp) => {
      const tx = new wx.TransactionBuilder('04c507a8c7fe5be96be64ce7c86855e1806cbde3', '2023-11-09T21:51:27');

      tx.push(protoVoteOp);

      tx.push(
        new FollowOperationBuilder()
          .followBlog("initminer", "gtg")
          .authorize("intiminer")
          .muteBlog("initminer", "spammer")
          .authorize("initminer")
          .resetBlogList(3, "initminer", "spammer")
          .authorize("initminer")
          .build());

      return JSON.parse(tx.toApi());
    }, protoVoteOp);

    expect(retVal).toStrictEqual(customJsonsTransaction);
  });

  test('Should be able to create transaction with hive apps reblog operation using transaction builder interface', async ({ page }) => {
    const retVal = await page.evaluate(async() => {
      const tx = new wx.TransactionBuilder('04c507a8c7fe5be96be64ce7c86855e1806cbde3', '2023-11-09T21:51:27');

      tx.push(new FollowOperationBuilder()
        .reblog("initminer", "gtg", "first-post")
        .authorize("initminer")
        .build());

      return JSON.parse(tx.toApi());
    });

    expect(retVal).toStrictEqual({
      expiration: "2023-11-09T21:51:27",
      operations: [
        {
          type: "custom_json_operation",
          value: {
            id: "follow",
            json: "[\"reblog\",{\"account\":\"initminer\",\"author\":\"gtg\",\"permlink\":\"first-post\"}]",
            required_posting_auths: [
              "initminer",
            ]
          }
        }
      ],
      ref_block_num: 1960,
      ref_block_prefix: 3915120327
    });
  });

  test.afterAll(async () => {
    await browser.close();
  });
});
