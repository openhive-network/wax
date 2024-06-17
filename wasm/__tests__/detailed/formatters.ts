import { ChromiumBrowser, ConsoleMessage, chromium } from 'playwright';
import { expect } from '@playwright/test';

import { DEFAULT_STORAGE_ROOT } from "@hiveio/beekeeper/node";
import fs from "fs";

import { test } from '../assets/jest-helper';

import { initminerAccountApi, naiAsset, serialization_sensitive_transaction, serialization_sensitive_transaction_proto, transfer_operation, vote_operation, serializedWitnessSetProperties } from "../assets/data.protocol";
import { ECommunityOperationActions, EFollowActions, IFormatFunctionArguments, ResourceCreditsOperation, WaxFormattable, operation } from '../../dist/lib';

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
    if(fs.existsSync(`${DEFAULT_STORAGE_ROOT}/.beekeeper/w0.wallet`))
      fs.rmSync(`${DEFAULT_STORAGE_ROOT}/.beekeeper/w0.wallet`);

    await page.goto("http://localhost:8080/wasm/__tests__/assets/test.html", { waitUntil: "load" });
  });

  test('Should traverse from bottom to top of the object using default formatters from hive chain interface', async() => {
    const { wax, base } = await createWaxTestFor('node');

    const BottomKey1 = "bottomKey1";
    const BottomKey2 = "bottomKey2";
    const BottomKey3 = "bottomKey3";

    const NestedKey1 = "nestedKey1";
    const NestedKey2 = "nestedKey2";
    const NestedKey3 = "nestedKey3";
    const NestedKey4 = "nestedKey4";

    class ExampleClassMatch { a = "hello"; }

    const myClass = new ExampleClassMatch();

    const obj = {
      [NestedKey1]: {
        [NestedKey2]: {
          [BottomKey1]: "123"
        },
        [NestedKey3]: {
          [BottomKey2]: "123"
        },
        [NestedKey4]: {
          [BottomKey3]: myClass
        }
      }
    };

    expect(Object.getPrototypeOf(obj[NestedKey1][NestedKey4][BottomKey3]) === Object.prototype).toBeFalsy();

    let counter = 0;

    class TraverseCustomFormatter {
      @wax.WaxFormattable({ matchProperty: BottomKey1 })
      public bottomKey1Handler({ source, target }: IFormatFunctionArguments<typeof obj['nestedKey1']['nestedKey2'], { [BottomKey1]: string }>) {
        expect(++counter).toBe(1);

        expect(source).toStrictEqual(obj[NestedKey1][NestedKey2]);
        expect(target).toStrictEqual(obj[NestedKey1][NestedKey2]);

        return Number.parseInt(source[BottomKey1]);
      }
      @wax.WaxFormattable({ matchProperty: NestedKey2 })
      public nestedKey2Handler({ source, target }: IFormatFunctionArguments<typeof obj['nestedKey1'], { [NestedKey2]: number; [NestedKey3]: { [BottomKey2]: string }; [NestedKey4]: { [BottomKey3]: ExampleClassMatch } }>) {
        expect(++counter).toBe(2);

        expect(source).toStrictEqual(obj[NestedKey1]);
        expect(target).toStrictEqual({ [NestedKey2]: 123, [NestedKey3]: { [BottomKey2]: "123" }, [NestedKey4]: { [BottomKey3]: { a: myClass.a } } });

        return target[NestedKey2][BottomKey1];
      }
      @wax.WaxFormattable({ matchProperty: BottomKey2 })
      public bottomKey2Handler({ source, target }: IFormatFunctionArguments<typeof obj['nestedKey1']['nestedKey3'], { [BottomKey2]: string }>) {
        expect(++counter).toBe(3);

        expect(source).toStrictEqual(obj[NestedKey1][NestedKey3]);
        expect(target).toStrictEqual(obj[NestedKey1][NestedKey3]);

        return Boolean(source[BottomKey2]);
      }
      @wax.WaxFormattable({ matchProperty: NestedKey3 })
      public nestedKey3Handler({ source, target }: IFormatFunctionArguments<typeof obj['nestedKey1'], { [NestedKey2]: number; [NestedKey3]: boolean; [NestedKey4]: { [BottomKey3]: ExampleClassMatch } }>) {
        expect(++counter).toBe(4);

        expect(source).toStrictEqual(obj[NestedKey1]);
        expect(target).toStrictEqual({ [NestedKey2]: 123, [NestedKey3]: true, [NestedKey4]: { [BottomKey3]: { a: myClass.a } } });
      }
      @wax.WaxFormattable({ matchInstanceOf: ExampleClassMatch })
      public bottomKey3Handler({ source, target }: IFormatFunctionArguments<typeof obj['nestedKey1']['nestedKey4'], { [BottomKey3]: ExampleClassMatch }>) {
        expect(++counter).toBe(5);

        expect(source).toStrictEqual(obj[NestedKey1][NestedKey4]);
        expect(target).toStrictEqual({ [BottomKey3]: { a: myClass.a } });

        return source[BottomKey3].a;
      }
      @wax.WaxFormattable({ matchProperty: NestedKey4 })
      public nestedKey4Handler({ source, target }: IFormatFunctionArguments<typeof obj['nestedKey1'], { [NestedKey2]: number; [NestedKey3]: boolean; [NestedKey4]: string }>) {
        expect(++counter).toBe(6);

        expect(source).toStrictEqual(obj[NestedKey1]);
        expect(target).toStrictEqual({ [NestedKey2]: 123, [NestedKey3]: true, [NestedKey4]: myClass.a });

        return [ target[NestedKey2], target[NestedKey3], target[NestedKey4] ];
      }
      @wax.WaxFormattable({ matchProperty: NestedKey1 })
      public nestedKey1Handler({ source, target }: IFormatFunctionArguments<typeof obj, { [NestedKey1]: [ number, boolean, string ] }>) {
        expect(++counter).toBe(7);

        expect(source).toStrictEqual(obj);
        expect(target).toStrictEqual({ [NestedKey1]: [ 123, true, myClass.a ] });

        return JSON.stringify(target[NestedKey1]);
      }
    }

    const formatted = base.formatter.extend(TraverseCustomFormatter).format(obj);
    expect(formatted).toBe('[123,true,"hello"]');
  });

  test('Should be able to format numbers using default formatters from hive chain interface', async({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      return [
        chain.formatter.formatNumber(76543212345678, 3, "en-US"),
        chain.formatter.formatNumber(76543212345678, 2, "en-US"),
        chain.formatter.formatNumber(76543212345678, 0, "en-US"),
        chain.formatter.formatNumber(76543212345678, undefined, "en-US"),
        chain.formatter.formatNumber(BigInt(76543212345678), 3, "en-US"),
        chain.formatter.formatNumber(BigInt(76543212345678), 2, "en-US"),
        chain.formatter.formatNumber(BigInt(76543212345678), 0, "en-US"),
        chain.formatter.formatNumber(BigInt(76543212345678), undefined, "en-US"),
        chain.formatter.formatNumber("76543212345678", 3, "en-US"),
        chain.formatter.formatNumber("76543212345678", 2, "en-US"),
        chain.formatter.formatNumber("76543212345678", 0, "en-US"),
        chain.formatter.formatNumber("76543212345678", undefined, "en-US"),
        chain.formatter.formatNumber("765432123.4567", 3, "en-US"),
        chain.formatter.formatNumber("765432123.4567", 2, "en-US"),
        chain.formatter.formatNumber("765432123.4567", 0, "en-US"),
        chain.formatter.formatNumber("765432123.4567", undefined, "en-US"),
        chain.formatter.formatNumber("-76543212.3456", 3, "en-US"),
        chain.formatter.formatNumber("-76543212.3456", 2, "en-US"),
        chain.formatter.formatNumber("-76543212.3456", 0, "en-US"),
        chain.formatter.formatNumber("-76543212.3456", undefined, "en-US"),
        chain.formatter.formatNumber("0.3456",         3, "en-US"),
        chain.formatter.formatNumber("0.3456",         2, "en-US"),
        chain.formatter.formatNumber("0.3456",         0, "en-US"),
        chain.formatter.formatNumber("0.3456",         undefined, "en-US"),
        chain.formatter.formatNumber("0.1",            3, "en-US"),
        chain.formatter.formatNumber("0.1",            2, "en-US"),
        chain.formatter.formatNumber("0.1",            0, "en-US"),
        chain.formatter.formatNumber("0.1",            undefined, "en-US"),
        chain.formatter.formatNumber("0",              3, "en-US"),
        chain.formatter.formatNumber("0",              2, "en-US"),
        chain.formatter.formatNumber("0",              0, "en-US"),
        chain.formatter.formatNumber("0",              undefined, "en-US"),
        chain.formatter.formatNumber(Number.NaN,       3, "en-US"),
        chain.formatter.formatNumber(Number.NaN,       2, "en-US"),
        chain.formatter.formatNumber(Number.NaN,       0, "en-US"),
        chain.formatter.formatNumber(Number.NaN,       undefined, "en-US")
      ];
    });

    expect(retVal).toStrictEqual([
      "76,543,212,345,678.000",
      "76,543,212,345,678.00",
      "76,543,212,345,678",
      "76,543,212,345,678",
      "76,543,212,345,678.000",
      "76,543,212,345,678.00",
      "76,543,212,345,678",
      "76,543,212,345,678",
      "76,543,212,345,678.000",
      "76,543,212,345,678.00",
      "76,543,212,345,678",
      "76,543,212,345,678",
      "765,432,123.456",
      "765,432,123.45",
      "765,432,123",
      "765,432,123.4567",
      "-76,543,212.345",
      "-76,543,212.34",
      "-76,543,212",
      "-76,543,212.3456",
      "0.345",
      "0.34",
      "0",
      "0.3456",
      "0.100",
      "0.10",
      "0",
      "0.1",
      "0.000",
      "0.00",
      "0",
      "0",
      "0.000",
      "0.00",
      "0",
      "0"
    ]);
  });

  test('Should be able to format witness set properties operation using default formatters from hive chain interface', async({ waxTest }) => {
    const retVal = await waxTest(({ chain }, serializedWitnessSetProperties) => {
      const data = chain.formatter.format(serializedWitnessSetProperties);

      return `${data.value.owner} set new signing key to ${data.value.props.new_signing_key}`;
    }, serializedWitnessSetProperties);

    expect(retVal).toBe("gtg set new signing key to STM6TqSJaS1aRj6p6yZEo5xicX7bvLhrfdVqi5ToNrKxHU3FRBEdW");
  });

  test('Should be able to format asset using default formatters from hive chain interface', async({ waxTest }) => {
    const retVal = await waxTest(({ chain }, naiAsset) => {
      return chain.waxify`Amount: ${naiAsset}`;
    }, naiAsset);

    expect(retVal).toBe("Amount: 300.000 HIVE");
  });

  test('Should be able to format asset using default formatters from hive chain interface nad keep the original object immutable', async({ waxTest }) => {
    const retVal = await waxTest(({ chain }, naiAsset) => {
      const inputObject = { naiAsset };

      return {
        input: inputObject,
        output: chain.formatter.format(inputObject)
      };
    }, naiAsset);

    expect(retVal.input).toStrictEqual({ naiAsset });
    expect(retVal.output).toStrictEqual({ naiAsset: "300.000 HIVE" });
  });

  test('Should be able to format transaction using default formatters from hive chain interface', async({ waxTest }) => {
    const retVal = await waxTest(({ chain }, serialization_sensitive_transaction) => {
      const tx = JSON.parse(serialization_sensitive_transaction);

      return chain.waxify`Tx: #${tx}`;
    }, serialization_sensitive_transaction);

    expect(retVal).toBe("Tx: #3725c81634f152011e2043eb7119911b953d4267");
  });

  test('Should be able to format protobuf transaction using default formatters from hive chain interface', async({ waxTest }) => {
    const retVal = await waxTest(({ chain }, serialization_sensitive_transaction_proto) => {
      return chain.waxify`Tx: #${serialization_sensitive_transaction_proto}`;
    }, serialization_sensitive_transaction_proto);

    expect(retVal).toBe("Tx: #3725c81634f152011e2043eb7119911b953d4267");
  });

  test('Should be able to extend formatter with custom options from hive chain interface', async({ waxTest }) => {
    const retVal = await waxTest(({ chain }, serialization_sensitive_transaction) => {
      const tx = JSON.parse(serialization_sensitive_transaction);

      const formatter = chain.formatter.extend({ transaction: { displayAsId: false } });

      return formatter.format(tx);
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

  test('Should be able to retrieve account from the API and format it using default formatter from the hive chain interface', async({ waxTest }) => {
    const retVal = await waxTest(async({ chain }) => {
      const response = await chain.api.database_api.find_accounts({ accounts: [ "initminer" ] });

      return chain.formatter.extend({ asset: { displayAsNai: false, appendTokenName: true, formatAmount: true, locales: "en-US" } }).format(response.accounts[0]);
    });

    expect(
      retVal
    ).toEqual(initminerAccountApi);
  });

  test('Should be able to format custom JSON rc delegation operation using default formatter from the hive chain interface', async({ waxTest }) => {
    const retVal = await waxTest(async({ wax, base, chain }) => {
      const tx = new base.TransactionBuilder('04c507a8c7fe5be96be64ce7c86855e1806cbde3', '2023-11-09T21:51:27');

      tx.push(new wax.ResourceCreditsOperationBuilder()
        .delegate("initminer", 4127361273, "gtg", "null")
        .removeDelegation("initminer", "null")
        .authorize("initminer")
        .build());

      const built = tx.build();

      return chain.formatter.format(
        built.operations
      );
    });

    expect(
      retVal
    ).toEqual([{
      custom_json: {
        delegatees: [ "gtg", "null" ],
        from: "initminer",
        rc: {
          amount: "4127361273",
          nai: "@@000000037",
          precision: 6,
        }
      }
    }, {
      custom_json: {
        delegatees: [ "null" ],
        from: "initminer",
        rc: {
          amount: "0",
          nai: "@@000000037",
          precision: 6,
        }
      }
    }]);
  });

  test('Should be able to format custom JSON community operation using default formatter from the hive chain interface', async({ waxTest }) => {
    const retVal = await waxTest.dynamic(async({ base, wax, chain }) => {
      const tx = new base.TransactionBuilder('04c507a8c7fe5be96be64ce7c86855e1806cbde3', '2023-11-09T21:51:27');

      tx.push(
        new wax.CommunityOperationBuilder()
          .flagPost("mycomm", "gtg", "first-post", "note")
          .mutePost("mycomm", "gtg", "first-post", "note")
          .pinPost("mycomm", "gtg", "first-post")
          .subscribe("mycomm")
          .unmutePost("mycomm", "gtg", "first-post", "note")
          .unpinPost("mycomm", "gtg", "first-post")
          .unsubscribe("mycomm")
          .setUserTitle("mycomm", "gtg", "first-post")
          .updateProps("mycomm", { title: "Custom title" })
          .authorize("gtg")
          .build());

      const built = tx.build();

      return chain.formatter.format(
        built.operations
      );
    });

    expect(
      retVal
    ).toEqual([{
      custom_json: {
        accounts: [ "gtg" ],
        community: "mycomm",
        data: {
          action: ECommunityOperationActions.FLAG_POST,
          account: "gtg",
          permlink: "first-post",
          notes: "note",
          props: undefined,
          title: undefined
        }
      }
    }, {
      custom_json: {
        accounts: [ "gtg" ],
        community: "mycomm",
        data: {
          action: ECommunityOperationActions.MUTE_POST,
          account: "gtg",
          permlink: "first-post",
          notes: "note",
          props: undefined,
          title: undefined
        }
      }
    }, {
      custom_json: {
        accounts: [ "gtg" ],
        community: "mycomm",
        data: {
          action: ECommunityOperationActions.PIN_POST,
          account: "gtg",
          permlink: "first-post",
          notes: undefined,
          props: undefined,
          title: undefined
        }
      }
    }, {
      custom_json: {
        accounts: [ "gtg" ],
        community: "mycomm",
        data: {
          action: ECommunityOperationActions.SUBSCRIBE,
          account: undefined,
          permlink: undefined,
          notes: undefined,
          props: undefined,
          title: undefined
        }
      }
    }, {
      custom_json: {
        accounts: [ "gtg" ],
        community: "mycomm",
        data: {
          action: ECommunityOperationActions.UNMUTE_POST,
          account: "gtg",
          permlink: "first-post",
          notes: "note",
          props: undefined,
          title: undefined
        }
      }
    }, {
      custom_json: {
        accounts: [ "gtg" ],
        community: "mycomm",
        data: {
          action: ECommunityOperationActions.UNPIN_POST,
          account: "gtg",
          permlink: "first-post",
          notes: undefined,
          props: undefined,
          title: undefined
        }
      }
    }, {
      custom_json: {
        accounts: [ "gtg" ],
        community: "mycomm",
        data: {
          action: ECommunityOperationActions.UNSUBSCRIBE,
          account: undefined,
          permlink: undefined,
          notes: undefined,
          props: undefined,
          title: undefined
        }
      }
    }, {
      custom_json: {
        accounts: [ "gtg" ],
        community: "mycomm",
        data: {
          action: ECommunityOperationActions.SET_USER_TITLE,
          account: "gtg",
          title: "first-post",
          permlink: undefined,
          notes: undefined,
          props: undefined
        }
      }
    }, {
      custom_json: {
        accounts: [ "gtg" ],
        community: "mycomm",
        data: {
          action: ECommunityOperationActions.UPDATE_PROPS,
          props: {
            about: "",
            description: "",
            title: "Custom title",
            flag_text: "",
            is_nsfw: false,
            lang: "en",
          },
          account: undefined,
          permlink: undefined,
          notes: undefined,
          title: undefined
        }
      }
    }]);
  });

  test('Should be able to format custom JSON follow operation using default formatter from the hive chain interface', async({ waxTest }) => {
    const retVal = await waxTest(async({ base, chain, wax }) => {
      const tx = new base.TransactionBuilder('04c507a8c7fe5be96be64ce7c86855e1806cbde3', '2023-11-09T21:51:27');

      tx.push(
        new wax.FollowOperationBuilder()
          .followBlacklistBlog("initminer", "gtg", "null")
          .followMutedBlog("initminer", "gtg")
          .resetAllBlog("initminer", "gtg", "null")
          .resetBlacklistBlog("initminer", "gtg")
          .resetFollowBlacklistBlog("initminer", "gtg", "null")
          .resetFollowMutedBlog("initminer", "gtg")
          .unblacklistBlog("initminer", "gtg", "null")
          .unfollowBlacklistBlog("initminer", "gtg")
          .unfollowBlog("initminer", "gtg", "null")
          .unfollowMutedBlog("initminer", "gtg")
          .reblog("initminer", "gtg", "first-post")
          .authorize("initminer")
          .build());

      const built = tx.build();

      return chain.formatter.format(
        built.operations
      );
    });

    expect(
      retVal
    ).toEqual([{
      custom_json: {
        action: EFollowActions.FOLLOW_BLACKLIST,
        follower: "initminer",
        following: [
          "gtg",
          "null"
        ]
      }
    }, {
      custom_json: {
        action: EFollowActions.FOLLOW_MUTED,
        follower: "initminer",
        following: [
          "gtg"
        ]
      }
    }, {
      custom_json: {
        action: EFollowActions.RESET_ALL_LISTS,
        follower: "initminer",
        following: [
          "gtg",
          "null"
        ]
      }
    }, {
      custom_json: {
        action: EFollowActions.RESET_BLACKLIST,
        follower: "initminer",
        following: [
          "gtg"
        ]
      }
    }, {
      custom_json: {
        action: EFollowActions.RESET_FOLLOW_BLACKLIST,
        follower: "initminer",
        following: [
          "gtg",
          "null"
        ]
      }
    }, {
      custom_json: {
        action: EFollowActions.RESET_FOLLOW_MUTED_LIST,
        follower: "initminer",
        following: [
          "gtg"
        ]
      }
    }, {
      custom_json: {
        action: EFollowActions.UNBLACKLIST,
        follower: "initminer",
        following: [
          "gtg",
          "null"
        ]
      }
    }, {
      custom_json: {
        action: EFollowActions.UNFOLLOW_BLACKLIST,
        follower: "initminer",
        following: [
          "gtg"
        ]
      }
    }, {
      custom_json: {
        action: EFollowActions.UNFOLLOW,
        follower: "initminer",
        following: [
          "gtg",
          "null"
        ]
      }
    }, {
      custom_json: {
        action: EFollowActions.UNFOLLOW_MUTED,
        follower: "initminer",
        following: [
          "gtg"
        ]
      }
    }, {
      custom_json: {
        account: "initminer",
        author: "gtg",
        permlink: "first-post"
      }
    }]);
  });

  test('Should be able to format values using custom formatters extended from hive chain interface', async() => {
    class MyFormatters {
      myFunction(value) {
        return value.toString();
      }

      @WaxFormattable()
      myCustomProp({ source }) {
        return this.myFunction(source.myCustomProp);
      }
    }

    const { chain } = await createWaxTestFor('node');
    const formatter = chain.formatter.extend(MyFormatters);
    const data = {
      myCustomProp: 12542
    };

    expect(
      formatter.waxify`MyData: ${data}`
    ).toBe("MyData: 12542");
  });

  test('Should be able to match values on properties using custom formatters extended from hive chain interface', async() => {
    class OperationsFormatter {
      @WaxFormattable({ matchProperty: "type", matchValue: "transfer_operation" })
      public transferOperationFormatter({ source }): string {
        return `${source.value.from} transferred ${chain.waxify`${source.value.amount!}`} to ${source.value.to}`;
      }

      @WaxFormattable({ matchProperty: "type", matchValue: "vote_operation" })
      public voteOperationFormatter({ source }): string {
        return `${source.value.voter} voted on @${source.value.author}/${source.value.permlink}`;
      }
    }

    const { chain } = await createWaxTestFor('node');
    const formatter = chain.formatter.extend(OperationsFormatter);

    const ops = [ transfer_operation, vote_operation ];

    expect(
      formatter.format(ops)
    ).toStrictEqual([
      "oneplus7 transferred 300.000 HIVE to kryptogames",
      "otom voted on @c0ff33a/ewxhnjbj"
    ]);
  });

  test('Should be able to match instances of the hive apps operations using custom formatters extended from hive chain interface', async() => {
    const { wax, chain } = await createWaxTestFor('node');

    class HiveAppsOperationsFormatter {
      @wax.WaxFormattable({ matchInstanceOf: wax.ResourceCreditsOperation })
      public rcOperationFormatter({ target }: IFormatFunctionArguments<operation, { custom_json: ResourceCreditsOperation }>) {
        return `${target.custom_json.from} delegated ${target.custom_json.rc.amount} to ${target.custom_json.delegatees.join(",")}`;
      }
    }

    const formatter = chain.formatter.extend(HiveAppsOperationsFormatter);

    const tx = new chain.TransactionBuilder("04c507a8c7fe5be96be64ce7c86855e1806cbde3", "2023-11-09T21:51:27");
    tx.push(
      new wax.ResourceCreditsOperationBuilder().removeDelegation("gtg", "initminer").authorize("gtg").build()
    );

    expect(
      formatter.format(tx.build().operations)
    ).toStrictEqual([
      "gtg delegated 0 to initminer"
    ]);
  });

  test.afterAll(async () => {
    await browser.close();
  });
});
