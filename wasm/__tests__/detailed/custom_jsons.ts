import { ChromiumBrowser, ConsoleMessage, chromium } from 'playwright';
import { expect } from '@playwright/test';

import { test } from '../assets/jest-helper';

import { customCommunityJsonsTransaction, customJsonsTransaction, customMultipleJsonsTransaction, protoVoteOp } from '../assets/data.proto-protocol';

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

    await page.goto("http://localhost:8080/wasm/__tests__/assets/test.html", { waitUntil: "load" });
  });

  test('Should be able to create transaction with hive apps follow operation using transaction builder interface', async ({ waxTest }) => {
    const retVal = await waxTest(({ base, wax }, protoVoteOp) => {
      const tx = new base.TransactionBuilder('04c507a8c7fe5be96be64ce7c86855e1806cbde3', '2023-11-09T21:51:27');

      tx.pushRawOperation(protoVoteOp);

      tx.pushRawOperation(
        new wax.FollowOperationBuilder()
          .followBlog("initminer", "gtg")
          .authorize("initminer")
          .muteBlog("initminer", "spammer")
          .authorize("initminer")
          .resetBlogList(2, "initminer", "spammer")
          .authorize("initminer")
          .build());

      return JSON.parse(tx.toApi());
    }, protoVoteOp);

    expect(retVal).toStrictEqual(customJsonsTransaction);
  });

  test('Should be able to create transaction with hive apps follow operation authorizing at the end using transaction builder interface', async({ waxTest }) => {
    const retVal = await waxTest(({ base, wax }, protoVoteOp) => {
      const tx = new base.TransactionBuilder('04c507a8c7fe5be96be64ce7c86855e1806cbde3', '2023-11-09T21:51:27');

      tx.pushRawOperation(protoVoteOp);

      tx.pushRawOperation(
        new wax.FollowOperationBuilder()
          .followBlog("initminer", "gtg")
          .muteBlog("initminer", "spammer")
          .resetBlogList(0, "initminer", "spammer")
          .resetBlogList(1, "initminer", "spammer")
          .authorize("initminer")
          .build());

      return JSON.parse(tx.toApi());
    }, protoVoteOp);

    expect(retVal).toStrictEqual(customJsonsTransaction);
  });

  test('Should be able to create transaction with mutliple hive apps authorizing at the end using transaction builder interface', async({ waxTest }) => {
    const retVal = await waxTest(({ base, wax }) => {
      const tx = new base.TransactionBuilder('04c507a8c7fe5be96be64ce7c86855e1806cbde3', '2023-11-09T21:51:27');

      tx.pushRawOperation(
        new wax.FollowOperationBuilder()
          .followBlacklistBlog("initminer", "gtg")
          .followMutedBlog("initminer", "gtg")
          .resetAllBlog("initminer", "gtg")
          .resetBlacklistBlog("initminer", "gtg")
          .resetFollowBlacklistBlog("initminer", "gtg")
          .resetFollowMutedBlog("initminer", "gtg")
          .unblacklistBlog("initminer", "gtg")
          .unfollowBlacklistBlog("initminer", "gtg")
          .unfollowBlog("initminer", "gtg")
          .unfollowMutedBlog("initminer", "gtg")
          .authorize("initminer")
          .build());

      return JSON.parse(tx.toApi());
    });

    expect(retVal).toStrictEqual(customMultipleJsonsTransaction);
  });

  test('Should be able to create transaction with mutliple community hive apps authorizing at the end using transaction builder interface', async({ waxTest }) => {
    const retVal = await waxTest(async({ base, wax }) => {
      const tx = new base.TransactionBuilder('04c507a8c7fe5be96be64ce7c86855e1806cbde3', '2023-11-09T21:51:27');

      tx.pushRawOperation(
        new wax.CommunityOperationBuilder()
          .flagPost("mycomm", "gtg", "first-post", "note")
          .mutePost("mycomm", "gtg", "first-post", "note")
          .pinPost("mycomm", "gtg", "first-post")
          .subscribe("mycomm")
          .unmutePost("mycomm", "gtg", "first-post", "note")
          .unpinPost("mycomm", "gtg", "first-post")
          .unsubscribe("mycomm")
          .setUserTitle("mycomm", "gtg", "first-post")
          .updateProps("mycomm", {
            title: "Custom title",
            about: "This community is the best!",
            description: "Accepting all kind of users",
            flag_text: "1. Smoking here is not allowed",
            is_nsfw: false,
            lang: "en"
          })
          .authorize("gtg")
          .build());

      return JSON.parse(tx.toApi());
    });

    expect(retVal).toStrictEqual(customCommunityJsonsTransaction);
  });

  test('Should be able to create transaction with hive apps reblog operation using transaction builder interface', async ({ waxTest }) => {
    const retVal = await waxTest(({ base, wax }) => {
      const tx = new base.TransactionBuilder('04c507a8c7fe5be96be64ce7c86855e1806cbde3', '2023-11-09T21:51:27');

      tx.pushRawOperation(new wax.FollowOperationBuilder()
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

  test('Should be able to create transaction with hive apps rc operation using transaction builder interface', async ({ waxTest }) => {
    const retVal = await waxTest(({ base, wax }) => {
      const tx = new base.TransactionBuilder('04c507a8c7fe5be96be64ce7c86855e1806cbde3', '2023-11-09T21:51:27');

      tx.pushRawOperation(new wax.ResourceCreditsOperationBuilder()
        .delegate("initminer", 3000, "gtg")
        .authorize("initminer")
        .removeDelegation("initminer", "gtg")
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
            id: "rc",
            json: "[\"delegate_rc\",{\"from\":\"initminer\",\"delegatees\":[\"gtg\"],\"max_rc\":\"3000\",\"extensions\":[]}]",
            required_posting_auths: [
              "initminer",
            ]
          }
        },
        {
          type: "custom_json_operation",
          value: {
            id: "rc",
            json: "[\"delegate_rc\",{\"from\":\"initminer\",\"delegatees\":[\"gtg\"],\"max_rc\":\"0\",\"extensions\":[]}]",
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

  test('Should be able to create transaction with hive apps rc operation using both operation type and operation builder in transaction builder interface', async ({ waxTest }) => {
    const retVal = await waxTest(({ base, wax }) => {
      const tx = new base.TransactionBuilder('04c507a8c7fe5be96be64ce7c86855e1806cbde3', '2023-11-09T21:51:27');

      tx.pushRawOperation(new wax.ResourceCreditsOperationBuilder().removeDelegation("gtg", "initminer").authorize("gtg").build());
      tx.pushRawOperation(new wax.ResourceCreditsOperation("gtg", base.vests(0), [ "initminer" ]));

      return tx.transaction.operations;
    });

    expect(retVal[0]).toStrictEqual(retVal[1]);
  });

  test.afterAll(async () => {
    await browser.close();
  });
});
