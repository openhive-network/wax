import { test, expect } from '@playwright/test';

import { customJsonsTransaction, protoVoteOp } from "../assets/data.proto-protocol";

import { EFollowBlogAction, FollowOperationBuilder, IWaxBaseInterface, createWaxFoundation } from "../../dist/bundle/node";

let wax: IWaxBaseInterface;

test.describe('Wax hive apps operations tests for Node.js', () => {
  test.beforeAll(async () => {
    wax = await createWaxFoundation();
  });

  test('Should be able to create transaction with hive apps follow operation using transaction builder interface', () => {
    const tx = new wax.TransactionBuilder('04c507a8c7fe5be96be64ce7c86855e1806cbde3', '2023-11-09T21:51:27');

    tx.push(protoVoteOp);

    tx.push(
      new FollowOperationBuilder()
        .followBlog("initminer", "gtg")
        .authorize("intiminer")
        .muteBlog("initminer", "spammer")
        .authorize("initminer")
        .resetBlogList(EFollowBlogAction.BOTH, "initminer", "spammer")
        .authorize("initminer")
        .build());

    expect(
      JSON.parse(tx.toApi())
    ).toStrictEqual(customJsonsTransaction);
  });

  test('Should be able to create transaction with hive apps reblog operation using transaction builder interface', () => {
    const tx = new wax.TransactionBuilder('04c507a8c7fe5be96be64ce7c86855e1806cbde3', '2023-11-09T21:51:27');

    tx.push(new FollowOperationBuilder()
      .reblog("initminer", "gtg", "first-post")
      .authorize("initminer")
      .build());

    expect(
      JSON.parse(tx.toApi())
    ).toStrictEqual({
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
});
