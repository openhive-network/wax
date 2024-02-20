import { ChromiumBrowser, ConsoleMessage, chromium } from 'playwright';
import { expect } from '@playwright/test';

import { DEFAULT_STORAGE_ROOT } from "@hive/beekeeper/node";
import fs from "fs";

import { test } from '../assets/jest-helper';
import { protoVoteOp } from "../assets/data.proto-protocol";
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

    await page.goto("http://localhost:8080/wasm/__tests__/assets/test-chain.html", { waitUntil: "load" });
    await page.waitForFunction(() => waxScriptLoaded); // Wait until async scripts load
  });

  test('Should be able to create and sign transaction using object interface', async ({ dual }) => {
    const retVal = await dual(async(protoVoteOp) => {
      // Create wallet:
      const session = bk.createSession("salt");
      const { wallet } = await session.createWallet("w0");
      await wallet.importKey('5JkFnXrLM2ap9t3AmAxBJvQHF7xSKtnTrCTginQCkhzU5S7ecPT');

      // Create transaction
      const tx = new chain.TransactionBuilder("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      // Create signed transaction
      tx.push(protoVoteOp).validate();

      const stx = tx.build(wallet, "5RqVBAVNp5ufMCetQtvLGLJo7unX9nyCBMMrTXRWQ9i1Zzzizh");

      return {
        sig: stx.signatures[0],
        digest: tx.sigDigest
      };
    }, protoVoteOp);

    expect(retVal.sig).toBe('1f7f0c3e89e6ccef1ae156a96fb4255e619ca3a73ef3be46746b4b40a66cc4252070eb313cc6308bbee39a0a9fc38ef99137ead3c9b003584c0a1b8f5ca2ff8707');
    expect(retVal.digest).toBe('205c79e3d17211882b1a2ba8640ff208413d68cabdca892cf47e9a6ad46e63a1');
   });

   test('Should be able to perform example API call', async ({ dual }) => {
     const retVal = await dual(async() => {
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

    test('Should be able to create and sign transaction using hive chain dynamic data', async ({ dual }) => {
      const retVal = await dual.dynamic(async(protoVoteOp) => {
        // Create wallet:
        const session = bk.createSession("salt");
        const { wallet } = await session.createWallet("w0");
        await wallet.importKey('5JkFnXrLM2ap9t3AmAxBJvQHF7xSKtnTrCTginQCkhzU5S7ecPT');

        // Create transaction
        const tx = await chain.getTransactionBuilder();

        // Create signed transaction
        tx.push(protoVoteOp).validate();

        const stx = tx.build(wallet, "5RqVBAVNp5ufMCetQtvLGLJo7unX9nyCBMMrTXRWQ9i1Zzzizh");

        return stx;
      }, protoVoteOp);

      expect(retVal.signatures.length).toBe(1);
      expect(retVal.ref_block_num).toBeGreaterThan(0);
      expect(retVal.ref_block_prefix).toBeGreaterThan(0);
    });

    test('Should be able to extend hive chain interface by custom definitions', async ({ dual }) => {
      const retVal = await dual(async() => {
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

    test('Should be able to extend hive chain interface by custom definitions using interfaces only', async ({ dual }) => {
      const retVal = await dual(async() => {
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

    test('Should throw when creating broadcast transaction request from unsigned transaction', async ({ dual }) => {
      const retVal = await dual(async(protoVoteOp) => {
        const tx = new chain.TransactionBuilder("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");
        tx.push(protoVoteOp).build();

        try {
          new BroadcastTransactionRequest(tx);
          return false;
        } catch {
          return true;
        }
      }, protoVoteOp);

      expect(retVal).toBeTruthy();
    });

    test('Should be able to transmit protobuf transaction using hive chain interface', async ({ dual }) => {
      const retVal = await dual(async(protoVoteOp) => {
        // Create wallet:
        const session = bk.createSession("salt");
        const { wallet } = await session.createWallet("w0");
        await wallet.importKey('5JkFnXrLM2ap9t3AmAxBJvQHF7xSKtnTrCTginQCkhzU5S7ecPT');

        const tx = new chain.TransactionBuilder("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");
        tx.push(protoVoteOp).build(wallet, "5RqVBAVNp5ufMCetQtvLGLJo7unX9nyCBMMrTXRWQ9i1Zzzizh");

        return new BroadcastTransactionRequest(tx);
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

    test('Should be able to calculate current manabar value using hive chain interface', async ({ dual }) => {
      const retVal = await dual(async() => {
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

    test('Should be able to parse user manabar from API using hive chain interface', async ({ dual }) => {
      const retVal = await dual(async() => {
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

    test('Should be able to calculate full manabar regeneration time from API using hive chain interface', async ({ dual }) => {
      const retVal = await dual(async() => {
        const time = await chain.calculateManabarFullRegenerationTimeForAccount("initminer");

        return time.getTime(); // Should be close to Date.now() when fully regenerated
      });

      expect(Date.now() - retVal).toBeLessThanOrEqual( HIVE_BLOCK_INTERVAL * 2 ); // Manabar of the initminer should not be used
    });

    test('Should be able to calculate current downvote manabar value from API using hive chain interface', async ({ dual }) => {
      const retVal = await dual(async() => {
        const time = await chain.calculateCurrentManabarValueForAccount("initminer", 1);

        return time.max.toString();
      });

      expect(retVal).toBe("250000000000");
    });

    test('Should be able to calculate current manabar rc value from API using hive chain interface', async ({ dual }) => {
      const retVal = await dual(async() => {
        const time = await chain.calculateCurrentManabarValueForAccount("initminer", 2);

        return time.max.toString();
      });

      expect(retVal).toBe("1002020748973");
    });

  test.afterAll(async () => {
    await browser.close();
  });
});
