import { ChromiumBrowser, ConsoleMessage, chromium } from 'playwright';
import { test, expect } from '@playwright/test';

import { protoVoteOp } from "../assets/data.proto-protocol";

let browser!: ChromiumBrowser;

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

    await page.goto(`http://localhost:8080/wasm/__tests__/assets/beekeeper.html`);
    await page.waitForURL('**/beekeeper.html', { waitUntil: 'load' });

    await page.evaluate(async () => {
      const bk = await beekeeperFactory();
      const chain = await createHiveChain();

      Object.defineProperties(window, {
        chain: {
          get() {
            return chain;
          }
        },
        bk: {
          get() {
            return bk;
          }
        }
      });
    });
  });

  test('Should be able to create and sign transaction using object interface', async ({ page }) => {
    const retVal = await page.evaluate(async(protoVoteOp) => {
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

   test('Should be able to perform example API call', async ({ page }) => {
     const retVal = await page.evaluate(async() => {
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

    test('Should be able to create and sign transaction using hive chain dynamic data', async ({ page }) => {
      const retVal = await page.evaluate(async(protoVoteOp) => {
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

    test('Should be able to extend hive chain interface by custom definitions', async ({ page }) => {
      const retVal = await page.evaluate(async() => {
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

    test('Should be able to transmit protobuf transaction using hive chain interface', async ({ page }) => {
      const retVal = await page.evaluate(async(protoVoteOp) => {
        const tx = new chain.TransactionBuilder("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");
        tx.push(protoVoteOp).build();

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
          signatures: [],
          ref_block_num: 51109,
          ref_block_prefix: 2785934438,
          expiration: '2023-08-01T15:38:48'
        }
      });
    });

  test.afterAll(async () => {
    await browser.close();
  });
});
