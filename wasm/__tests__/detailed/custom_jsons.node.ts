import { test, expect } from '@playwright/test';

import { customCommunityJsonsTransaction, customJsonsTransaction, customMultipleJsonsTransaction, protoVoteOp } from "../assets/data.proto-protocol";

import { EFollowBlogAction, FollowOperationBuilder, CommunityOperationBuilder, ResourceCreditsOperationBuilder, IWaxBaseInterface, createWaxFoundation } from "../../dist/bundle/node";

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
        .authorize("initminer")
        .muteBlog("initminer", "spammer")
        .authorize("initminer")
        .resetBlogList(EFollowBlogAction.BOTH, "initminer", "spammer")
        .authorize("initminer")
        .build());

    expect(
      JSON.parse(tx.toApi())
    ).toStrictEqual(customJsonsTransaction);
  });

  test('Should be able to create transaction with hive apps follow operation authorizing at the end using transaction builder interface', () => {
    const tx = new wax.TransactionBuilder('04c507a8c7fe5be96be64ce7c86855e1806cbde3', '2023-11-09T21:51:27');

    tx.push(protoVoteOp);

    tx.push(
      new FollowOperationBuilder()
        .followBlog("initminer", "gtg")
        .muteBlog("initminer", "spammer")
        .resetBlogList(EFollowBlogAction.FOLLOW_BLOG, "initminer", "spammer")
        .resetBlogList(EFollowBlogAction.MUTE_BLOG, "initminer", "spammer")
        .authorize("initminer")
        .build());

    expect(
      JSON.parse(tx.toApi())
    ).toStrictEqual(customJsonsTransaction);
  });

  test('Should be able to create transaction with mutliple hive apps authorizing at the end using transaction builder interface', () => {
    const tx = new wax.TransactionBuilder('04c507a8c7fe5be96be64ce7c86855e1806cbde3', '2023-11-09T21:51:27');

    tx.push(
      new FollowOperationBuilder()
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

    expect(
      JSON.parse(tx.toApi())
    ).toStrictEqual(customMultipleJsonsTransaction);
  });

  test('Should be able to create transaction with mutliple community hive apps authorizing at the end using transaction builder interface', () => {
    const tx = new wax.TransactionBuilder('04c507a8c7fe5be96be64ce7c86855e1806cbde3', '2023-11-09T21:51:27');

    tx.push(
      new CommunityOperationBuilder()
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

    expect(
      JSON.parse(tx.toApi())
    ).toStrictEqual(customCommunityJsonsTransaction);
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

  test('Should be able to create transaction with hive apps rc operation using transaction builder interface', () => {
    const tx = new wax.TransactionBuilder('04c507a8c7fe5be96be64ce7c86855e1806cbde3', '2023-11-09T21:51:27');

    tx.push(new ResourceCreditsOperationBuilder()
      .delegate("initminer", 3000, "gtg")
      .authorize("initminer")
      .removeDelegation("initminer", "gtg")
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
});
