import { ChromiumBrowser, ConsoleMessage, chromium } from 'playwright';
import { expect } from '@playwright/test';

import { DEFAULT_STORAGE_ROOT } from "@hiveio/beekeeper/node";
import fs from "fs";

import { test } from '../assets/jest-helper';
import { protoVoteOp, recoverAccountTransaction, requiredActiveAuthorityTransaction, requiredOwnerAuthorityTransaction, signatureTransaction } from "../assets/data.proto-protocol";
import { IsArray, IsObject, IsString } from 'class-validator';

let browser!: ChromiumBrowser;

const HIVE_BLOCK_INTERVAL = 3 * 1000; // 3 seconds

test.describe('Wax object interface chain tests', () => {
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

  test('Should be able to create and sign transaction using object interface', async ({ waxTest }) => {
    const retVal = await waxTest(async({ beekeeper, chain }, protoVoteOp) => {
      // Create wallet:
      const session = beekeeper.createSession("salt");
      const { wallet } = await session.createWallet("w0");
      await wallet.importKey('5JkFnXrLM2ap9t3AmAxBJvQHF7xSKtnTrCTginQCkhzU5S7ecPT');

      // Create transaction
      const tx = chain.createTransactionWithTaPoS("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      // Create signed transaction
      tx.pushOperation(protoVoteOp).validate();

      tx.sign(wallet, "STM5RqVBAVNp5ufMCetQtvLGLJo7unX9nyCBMMrTXRWQ9i1Zzzizh");
      const stx = tx.transaction;

      return {
        sig: stx.signatures[0],
        digest: tx.sigDigest
      };
    }, protoVoteOp);

    expect(retVal.sig).toBe('1f7f0c3e89e6ccef1ae156a96fb4255e619ca3a73ef3be46746b4b40a66cc4252070eb313cc6308bbee39a0a9fc38ef99137ead3c9b003584c0a1b8f5ca2ff8707');
    expect(retVal.digest).toBe('205c79e3d17211882b1a2ba8640ff208413d68cabdca892cf47e9a6ad46e63a1');
   });

   test('Should be able to transmit article transaction using hive chain interface', async ({ waxTest }) => {
    const retVal = await waxTest(async({ beekeeper, chain, wax }) => {
      // Create wallet:
      const session = beekeeper.createSession("salt");
      const { wallet } = await session.createWallet("w0");
      await wallet.importKey('5JkFnXrLM2ap9t3AmAxBJvQHF7xSKtnTrCTginQCkhzU5S7ecPT');

      const tx = chain.createTransactionWithTaPoS("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      tx.pushOperation(new wax.BlogPostOperation({
        author: "mee",
        body: "how r u",
        category: "test",
        title: "about you",
        permlink: "permlink1",
        percentHbd: 0,
        maxAcceptedPayout: chain.hbdSatoshis(0)
      }));

      tx.sign(wallet, "STM5RqVBAVNp5ufMCetQtvLGLJo7unX9nyCBMMrTXRWQ9i1Zzzizh");

      console.log(tx.toApi());

      return new wax.BroadcastTransactionRequest(tx);
    });

    retVal.trx.signatures.splice(0, 1); // We do not want to test signing here which will change due to json_metadata app version and name values

    expect(retVal).toStrictEqual({
      max_block_age: -1,
      trx: {
        operations: [
          {
            type: "comment_operation",
            value: {
              parent_author: "",
              parent_permlink: "test",
              author: "mee",
              permlink: "permlink1",
              title: "about you",
              body: "how r u",
              json_metadata: `{\"format\":\"markdown+html\",\"app\":\"${process.env.npm_package_name}/${process.env.npm_package_version}\"}`
            }
          },
          {
            type: "comment_options_operation",
            value: {
              author: "mee",
              permlink: "permlink1",
              max_accepted_payout: {
                amount: "0",
                precision: 3,
                nai: "@@000000013"
              },
              percent_hbd: 0,
              allow_votes: true,
              allow_curation_rewards: true
            }
          }
         ],
        extensions: [],
        signatures: [],
        ref_block_num: 51109,
        ref_block_prefix: 2785934438,
        expiration: '2023-08-01T15:38:48'
      }
    });
  });

   test('Should be able to perform example API call', async ({ waxTest }) => {
     const retVal = await waxTest(async({ chain }) => {
      // https://developers.hive.io/apidefinitions/#account_by_key_api.get_key_references
      const result = await chain.api.account_by_key_api.get_key_references({
        keys: [
          "STM6vJmrwaX5TjgTS9dPH8KsArso5m91fVodJvv91j7G765wqcNM9"
        ]
      });

       return result;
     });

     expect(retVal).toStrictEqual({ accounts: [["hiveio"]] });
    });

    test('Should be able to create and sign transaction using hive chain dynamic data', async ({ waxTest }) => {
      const retVal = await waxTest.dynamic(async({ beekeeper, chain }, protoVoteOp) => {
        // Create wallet:
        const session = beekeeper.createSession("salt");
        const { wallet } = await session.createWallet("w0");
        await wallet.importKey('5JkFnXrLM2ap9t3AmAxBJvQHF7xSKtnTrCTginQCkhzU5S7ecPT');

        // Create transaction
        const tx = await chain.createTransaction();

        // Add operation and validate underlying Hive transaction
        tx.pushOperation(protoVoteOp).validate();
        // Generate transaction signature using provided wallet containing private key matching to specified public one.
        tx.sign(wallet, "STM5RqVBAVNp5ufMCetQtvLGLJo7unX9nyCBMMrTXRWQ9i1Zzzizh");
        // get built transaction structure for further analysis
        const stx = tx.transaction;

        return stx;
      }, protoVoteOp);

      expect(retVal.signatures.length).toBe(1);
      expect(retVal.ref_block_num).toBeGreaterThan(0);
      expect(retVal.ref_block_prefix).toBeGreaterThan(0);
    });

    test('Should be able to extend hive chain interface by custom definitions', async ({ waxTest }) => {
      const retVal = await waxTest(async({ chain }) => {
        class MyRequest {
          method!: string;
        }
        class MyResponse {
          args!: {};
          ret!: [];
        }

        const extended = chain.extend({
          jsonrpc: {
            get_signature: {
              params: MyRequest,
              result: MyResponse
            }
          }
        });

        const result = await extended.api.jsonrpc.get_signature({ method: "jsonrpc.get_methods" });

        return result;
      });

      expect(retVal).toStrictEqual({ args: {}, ret: [] });
    });

    test('Should be able to extend hive chain and validate properties interface by custom definitions', async () => {
      class MyRequest {
        @IsString()
        method!: string;
      }
      class MyResponse {
        @IsObject()
        args!: {};
        @IsArray()
        ret!: [];
      }

      const { chain } = await createWaxTestFor('node');
      const extended = chain.extend({
        jsonrpc: {
          get_signature: {
            params: MyRequest,
            result: MyResponse
          }
        }
      });

      await expect(async() => {
        await extended.api.jsonrpc.get_signature(new MyRequest());
      }).rejects.toBeInstanceOf(Array); // Array<ValidationError>

      await expect(async() => {
        const req = new MyRequest();
        (req.method as any) = 10; // Force invalid type on the method

        await extended.api.jsonrpc.get_signature(req); // This should throw after validating
      }).rejects.toBeInstanceOf(Array); // Array<ValidationError>

      const result = await extended.api.jsonrpc.get_signature({ method: "jsonrpc.get_methods" });

      const expectedResult = new MyResponse();
      expectedResult.args = {};
      expectedResult.ret = [];
      expect(result).toStrictEqual(expectedResult);
    });

    test('Should be able to extend hive chain interface by custom definitions using interfaces only', async ({ waxTest }) => {
      const retVal = await waxTest(async({ chain }) => {
        interface IMyRequest {
          method: string;
        }
        interface IMyResponse {
          args: {};
          ret: [];
        }

        type TMyType = {
          jsonrpc: {
            get_signature: {
              params: IMyRequest,
              result: IMyResponse
            }
          }
        };

        const result = await chain.extend<TMyType>().api.jsonrpc.get_signature({ method: "jsonrpc.get_methods" });

        return result;
      });

      expect(retVal).toStrictEqual({ args: {}, ret: [] });
    });

    test('Should throw when creating broadcast transaction request from unsigned transaction', async ({ waxTest }) => {
      const retVal = await waxTest(async({ chain, wax }, protoVoteOp) => {
        const tx = chain.createTransactionWithTaPoS("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");
        tx.pushOperation(protoVoteOp).transaction;

        try {
          new wax.BroadcastTransactionRequest(tx);
          return false;
        } catch {
          return true;
        }
      }, protoVoteOp);

      expect(retVal).toBeTruthy();
    });

    test('Should be able to transmit protobuf transaction using hive chain interface', async ({ waxTest }) => {
      const retVal = await waxTest(async({ beekeeper, chain, wax }, protoVoteOp) => {
        // Create wallet:
        const session = beekeeper.createSession("salt");
        const { wallet } = await session.createWallet("w0");
        await wallet.importKey('5JkFnXrLM2ap9t3AmAxBJvQHF7xSKtnTrCTginQCkhzU5S7ecPT');

        const tx = chain.createTransactionWithTaPoS("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");
        tx.pushOperation(protoVoteOp).sign(wallet, "STM5RqVBAVNp5ufMCetQtvLGLJo7unX9nyCBMMrTXRWQ9i1Zzzizh");

        return new wax.BroadcastTransactionRequest(tx);
      }, protoVoteOp);

      expect(retVal).toStrictEqual({
        max_block_age: -1,
        trx: {
          operations: [ {
            type: "vote_operation",
            value: {
              author: "c0ff33a",
              permlink: "ewxhnjbj",
              voter: "otom",
              weight: 2200,
            }
          } ],
          extensions: [],
          signatures: [
            "1f7f0c3e89e6ccef1ae156a96fb4255e619ca3a73ef3be46746b4b40a66cc4252070eb313cc6308bbee39a0a9fc38ef99137ead3c9b003584c0a1b8f5ca2ff8707"
          ],
          ref_block_num: 51109,
          ref_block_prefix: 2785934438,
          expiration: '2023-08-01T15:38:48'
        }
      });
    });

    test('Should be able to calculate current manabar value using hive chain interface', async ({ waxTest }) => {
      const retVal = await waxTest(async({ chain }) => {
        const { current, max, percent } = chain.calculateCurrentManabarValue(
            1702548351,
            "2196088774870643",
            "1952744111294225",
            1702548249
          );

        return {
          max: max.toString(),
          current: current.toString(),
          percent
        };
      });

      expect(retVal.current).toBe("1953262632254958");
      expect(retVal.max).toBe("2196088774870643");
      expect(retVal.percent).toBe(88.94);
    });

    test('Should be able to parse user manabar from API using hive chain interface', async ({ waxTest }) => {
      const retVal = await waxTest(async({ chain }) => {
        const { accounts: [ account ] } = await chain.api.database_api.find_accounts({
          accounts: [ "initminer" ]
        });
        const dgpo = await chain.api.database_api.get_dynamic_global_properties({});

        return chain.calculateCurrentManabarValue(
          Math.round(new Date(`${dgpo.time}Z`).getTime() / 1000), // Convert API time to seconds
          account.post_voting_power.amount,
          account.voting_manabar.current_mana,
          account.voting_manabar.last_update_time
        ).max.toString();
      });

      expect(retVal).toBe("1000000000000");
    });

    test('Should be able to calculate full manabar regeneration time from API using hive chain interface', async ({ waxTest }) => {
      const retVal = await waxTest.dynamic(async({ chain }) => {
        const time = await chain.calculateManabarFullRegenerationTimeForAccount("initminer");

        return time.getTime(); // Should be close to Date.now() when fully regenerated
      });

      expect(Date.now() - retVal).toBeLessThanOrEqual( HIVE_BLOCK_INTERVAL * 2 ); // Manabar of the initminer should not be used
    });

    test('Should be able to calculate current downvote manabar value from API using hive chain interface', async ({ waxTest }) => {
      const retVal = await waxTest(async({ chain }) => {
        const time = await chain.calculateCurrentManabarValueForAccount("initminer", 1);

        return time.max.toString();
      });

      expect(retVal).toBe("250000000000");
    });

    test('Should be able to calculate current manabar rc value from API using hive chain interface', async ({ waxTest }) => {
      const retVal = await waxTest(async({ chain }) => {
        const time = await chain.calculateCurrentManabarValueForAccount("initminer", 2);

        return time.max.toString();
      });

      expect(retVal).toBe("1002020748973");
    });

    test('Should be able to change endpointUrl property', async ({ waxTest }) => {
      const retVal = await waxTest(async({ chain }) => {
        chain.endpointUrl = "https://best.honey.provider";
        return chain.endpointUrl;
      });

      expect(retVal).toBe("https://best.honey.provider");
    });

    test('Should be able to set custom endpointUrl property on database api', async ({ waxTest }) => {
      const retVal = await waxTest(async({ chain }) => {
        chain.api.database_api.endpointUrl = "https://best.honey.provider";
        return chain.api.database_api.endpointUrl;
      });

      expect(retVal).toBe("https://best.honey.provider");
    });

    test('Should be able to change endpointUrl property on both: extended and base chain objects', async ({ waxTest }) => {
      const retVal = await waxTest(async({ chain }) => {
        const customExtendedTypes = {};
        const extendedHiveChain = chain.extend(customExtendedTypes);

        extendedHiveChain.endpointUrl = "https://best.honey.provider";
        return [chain.endpointUrl, extendedHiveChain.endpointUrl];
      });

      expect(retVal).toStrictEqual(["https://best.honey.provider", "https://best.honey.provider"]);
    });

    test('Should be able to set custom endpointUrl property on both: extended and base chain objects on database api', async ({ waxTest }) => {
      const retVal = await waxTest(async({ chain }) => {
        const customExtendedTypes = {};
        const extendedHiveChain = chain.extend(customExtendedTypes);

        extendedHiveChain.api.database_api.endpointUrl = "https://best.honey.provider";
        return [chain.api.database_api.endpointUrl, extendedHiveChain.api.database_api.endpointUrl];
      });

      expect(retVal).toStrictEqual(["https://best.honey.provider", "https://best.honey.provider"]);
    });

    test('Should be able to change endpointUrl property ONLY at base chain object', async ({ waxTest }) => {
      const retVal = await waxTest(async({ chain }) => {
        const customExtendedTypes = {};
        const extendedHiveChain = chain.extend(customExtendedTypes);

        chain.endpointUrl = "https://best.honey.provider";
        return [chain.endpointUrl, extendedHiveChain.endpointUrl];
      });

      expect(retVal).toStrictEqual(["https://best.honey.provider", "https://api.hive.blog"]);
    });

    test('Should be able to sign the transaction twice', async ({ waxTest }) => {
      const retVal = await waxTest(async({ chain, beekeeper }, protoVoteOp) => {
        const session = beekeeper.createSession("salt");
        const { wallet } = await session.createWallet("w0");

        const key = await wallet.importKey('5JkFnXrLM2ap9t3AmAxBJvQHF7xSKtnTrCTginQCkhzU5S7ecPT');
        const otherKey = await wallet.importKey('5KXNQP5feaaXpp28yRrGaFeNYZT7Vrb1PqLEyo7E3pJiG1veLKG');

        const tx = chain.createTransactionWithTaPoS('04c1c7a566fc0da66aee465714acee7346b48ac2', '2023-08-01T15:38:48');

        tx.pushOperation(protoVoteOp);

        tx.sign(wallet, key);
        tx.sign(wallet, otherKey);
        return tx.transaction;
      }, protoVoteOp);

      expect(retVal.signatures).toEqual([
        '1f7f0c3e89e6ccef1ae156a96fb4255e619ca3a73ef3be46746b4b40a66cc4252070eb313cc6308bbee39a0a9fc38ef99137ead3c9b003584c0a1b8f5ca2ff8707',
        '209e2e371495ae731486c46cad62786ebb4260a54e558c41393e4ee681047ee07b5f476133d1100e08a6b88220c62c372789efbeb17d465d1c65efb0e23f8f1e0b'
      ]);
    });

    test('Should be able to sign the transaction twice on different transaction instances', async ({ waxTest }) => {
      const retVal = await waxTest.dynamic(async({ chain, beekeeper }, protoVoteOp) => {
        const session = beekeeper.createSession("salt");
        const { wallet } = await session.createWallet("w0");

        const key = await wallet.importKey('5JkFnXrLM2ap9t3AmAxBJvQHF7xSKtnTrCTginQCkhzU5S7ecPT');
        const otherKey = await wallet.importKey('5KXNQP5feaaXpp28yRrGaFeNYZT7Vrb1PqLEyo7E3pJiG1veLKG');

        const txBuilder = chain.createTransactionWithTaPoS('04c1c7a566fc0da66aee465714acee7346b48ac2', '2023-08-01T15:38:48');

        txBuilder.pushOperation(protoVoteOp);

        txBuilder.sign(wallet, key);

        const otherTxBuilder = chain.createTransactionFromJson(txBuilder.toApi());
        otherTxBuilder.sign(wallet, otherKey);
        return otherTxBuilder.transaction;
      }, protoVoteOp);

      expect(retVal.signatures).toEqual([
        '1f7f0c3e89e6ccef1ae156a96fb4255e619ca3a73ef3be46746b4b40a66cc4252070eb313cc6308bbee39a0a9fc38ef99137ead3c9b003584c0a1b8f5ca2ff8707',
        '209e2e371495ae731486c46cad62786ebb4260a54e558c41393e4ee681047ee07b5f476133d1100e08a6b88220c62c372789efbeb17d465d1c65efb0e23f8f1e0b'
      ]);
    });

    test('Should be able to get transaction required posting authority', async ({ waxTest }) => {
      const retVal = await waxTest.dynamic(async({ chain }, signatureTransaction) => {
        const tx = chain.createTransactionFromJson(signatureTransaction);

        return {
          authsArr: [...tx.requiredAuthorities.posting.values()],
          postingSize: tx.requiredAuthorities.posting.size,
          activeSize: tx.requiredAuthorities.active.size,
          ownerSize: tx.requiredAuthorities.owner.size,
          otherSize: tx.requiredAuthorities.other.length
        };
      }, signatureTransaction);

      const { authsArr, postingSize, activeSize, ownerSize, otherSize } = retVal;

      expect(authsArr[0]).toEqual('thatcryptodave');
      expect(postingSize).toEqual(1);
      expect(activeSize).toEqual(0);
      expect(ownerSize).toEqual(0);
      expect(otherSize).toEqual(0);
    });

    test('Should be able to get transaction required active authority', async ({ waxTest }) => {
      const retVal = await waxTest.dynamic(async({ chain }, requiredActiveAuthorityTransaction) => {
        const tx = chain.createTransactionFromJson(requiredActiveAuthorityTransaction);

        return {
          authsArr: [...tx.requiredAuthorities.active.values()],
          postingSize: tx.requiredAuthorities.posting.size,
          activeSize: tx.requiredAuthorities.active.size,
          ownerSize: tx.requiredAuthorities.owner.size,
          otherSize: tx.requiredAuthorities.other.length
        };
      }, requiredActiveAuthorityTransaction);

      const { authsArr, postingSize, activeSize, ownerSize, otherSize } = retVal;

      expect(authsArr[0]).toEqual('droida');
      expect(postingSize).toEqual(0);
      expect(activeSize).toEqual(1);
      expect(ownerSize).toEqual(0);
      expect(otherSize).toEqual(0);
    });

    test('Should be able to get transaction required owner authority', async ({ waxTest }) => {
      const retVal = await waxTest.dynamic(async({ chain }, requiredOwnerAuthorityTransaction) => {
        const tx = chain.createTransactionFromJson(requiredOwnerAuthorityTransaction);

        return {
          authsArr: [...tx.requiredAuthorities.owner.values()],
          postingSize: tx.requiredAuthorities.posting.size,
          activeSize: tx.requiredAuthorities.active.size,
          ownerSize: tx.requiredAuthorities.owner.size,
          otherSize: tx.requiredAuthorities.other.length
        };
      }, requiredOwnerAuthorityTransaction);

      const { authsArr, postingSize, activeSize, ownerSize, otherSize } = retVal;

      expect(authsArr[0]).toEqual('vsc.gateway');
      expect(postingSize).toEqual(0);
      expect(activeSize).toEqual(0);
      expect(ownerSize).toEqual(1);
      expect(otherSize).toEqual(0);
    });

    test('Should be able to get transaction required authorities for transaction with recover_account_operation', async ({ waxTest }) => {
      const retVal = await waxTest.dynamic(async({ chain }, recoverAccountTransaction) => {
        const tx = chain.createTransactionFromJson(recoverAccountTransaction);

        return {
          first: tx.requiredAuthorities.other[0].key_auths,
          second: tx.requiredAuthorities.other[1].key_auths
        }
      }, recoverAccountTransaction);

      expect(retVal.first).toEqual({"STM5P8syqoj7itoDjbtDvCMCb5W3BNJtUjws9v7TDNZKqBLmp3pQW": 1});
      expect(retVal.second).toEqual({"STM4wJYLcRnALfbpb4ziqiH3oLEgw9PTJZTBBj8goFyjta3mm6D1s": 1});
    });

      test('Should be able to get hive asset with JS Double-precision floating-point format', async ({ waxTest }) => {
      const retVal = await waxTest(async({ chain }) => {
        return chain.hiveCoins(100.3).amount;
      });

      expect(retVal).toBe("100300");
    });

    test('Should be able to get hbd asset with JS Double-precision floating-point format', async ({ waxTest }) => {
      const retVal = await waxTest(async({ chain }) => {
        return chain.hbdCoins(100.34567).amount;
      });

      expect(retVal).toBe("100345");
    });

    test('Should be able to get vests asset with JS Double-precision floating-point format', async ({ waxTest }) => {
      const retVal = await waxTest(async({ chain }) => {
        return chain.vestsCoins(100).amount;
      });

      expect(retVal).toBe("100000000");
    });

    test('Should be able to get vests asset with JS Double-precision floating-point format near max safe integer (with fractional part)', async ({ waxTest }) => {
      const retVal = await waxTest(async({ chain }) => {
        return chain.vestsCoins(9007199254740.543).amount;
      });

      expect(retVal).toBe("9007199254740543000");
    });

    test('Should be able to get hive asset with large number value', async ({ waxTest }) => {
      const retVal = await waxTest(async({ chain }) => {
        return chain.hiveSatoshis(Number.MAX_SAFE_INTEGER + 1).amount;
      });

      expect(retVal).toBe("9007199254740992");
    });

    test('Should be able to get hbd asset with large number value', async ({ waxTest }) => {
      const retVal = await waxTest(async({ chain }) => {
        return chain.hbdSatoshis(Number.MAX_SAFE_INTEGER + 1).amount;
      });

      expect(retVal).toBe("9007199254740992");
    });

    test('Should be able to get vests asset with large number value', async ({ waxTest }) => {
      const retVal = await waxTest(async({ chain }) => {
        return chain.vestsSatoshis(Number.MAX_SAFE_INTEGER + 1).amount;
      });

      expect(retVal).toBe("9007199254740992");
    });

  test.afterAll(async () => {
    await browser.close();
  });
});
