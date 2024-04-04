import { ChromiumBrowser, ConsoleMessage, chromium } from 'playwright';
import { expect } from '@playwright/test';

import { DEFAULT_STORAGE_ROOT } from "@hive/beekeeper/node";
import fs from "fs";

import { test } from '../assets/jest-helper';
import { protoVoteOp } from "../assets/data.proto-protocol";
import { legacyApiTransaction, naiAsset, serialization_sensitive_transaction, transaction } from "../assets/data.protocol";

let browser!: ChromiumBrowser;

test.describe('Wax object interface foundation tests', () => {
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

  test('Should be able to convert API asset to the proper HIVE asset data', async ({ waxTest }) => {
    const retVal = await waxTest(async({ base }, naiAsset) => {
      const asset = base.getAsset(naiAsset);

      return asset;
    }, naiAsset);

    expect(retVal).toStrictEqual({
      amount: "300.000",
      symbol: "HIVE"
    });
  });

  test('Should be able to convert API asset to the proper custom asset data', async ({ waxTest }) => {
    const retVal = await waxTest(async({ base }) => {
      const asset = base.getAsset({
        amount: "300",
        precision: 1,
        nai: "@@002137000"
      });

      return asset;
    });

    expect(retVal).toStrictEqual({
      amount: "30.0",
      symbol: "@@002137000"
    });
  });

  test('Should be able to bidirectional convert api to proto using object interface', async ({ waxTest }) => {
    const retVal = await waxTest(async({ base }, transaction) => {
      const tx = base.TransactionBuilder.fromApi(transaction);

      return tx.toApi();
    }, transaction);

    expect(retVal).toBe(transaction);
  });

  test('Should be able to bidirectional convert legacy api to proto using object interface', async ({ waxTest }) => {
    const retVal = await waxTest(async({ chain }, serialization_sensitive_transaction) => {
      const tx = chain.TransactionBuilder.fromApi(serialization_sensitive_transaction);

      return tx.toLegacyApi();
    }, serialization_sensitive_transaction);

    expect(retVal).toBe(legacyApiTransaction);
  });

  test('Should be able to create and sign transaction using object interface', async ({ waxTest }) => {
    const retVal = await waxTest(async({ beekeeper, base }, protoVoteOp) => {
      // Create wallet:
      const session = beekeeper.createSession("salt");
      const { wallet } = await session.createWallet("w0");
      await wallet.importKey('5JkFnXrLM2ap9t3AmAxBJvQHF7xSKtnTrCTginQCkhzU5S7ecPT');

      // Create transaction
      const tx = new base.TransactionBuilder("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      // Create signed transaction
      tx.push(protoVoteOp).validate();

      const stx = tx.build(wallet, "5RqVBAVNp5ufMCetQtvLGLJo7unX9nyCBMMrTXRWQ9i1Zzzizh");

      return {
        sig: stx.signatures[0],
        digest: tx.sigDigest,
        signees: tx.signatureKeys
      };
    }, protoVoteOp);

    expect(retVal.sig).toBe('1f7f0c3e89e6ccef1ae156a96fb4255e619ca3a73ef3be46746b4b40a66cc4252070eb313cc6308bbee39a0a9fc38ef99137ead3c9b003584c0a1b8f5ca2ff8707');
    expect(retVal.digest).toBe('205c79e3d17211882b1a2ba8640ff208413d68cabdca892cf47e9a6ad46e63a1');
    expect(retVal.signees).toHaveLength(1);
    expect(retVal.signees[0]).toBe('5RqVBAVNp5ufMCetQtvLGLJo7unX9nyCBMMrTXRWQ9i1Zzzizh');
  });

  test('Should be able to create a recurrent transfer with underlying extensions using transaction builder interface', async ({ waxTest }) => {
    const retVal = await waxTest(async({ chain }) => {
      const tx = new chain.TransactionBuilder("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");
      tx.pushRecurrentTransfer("initminer", "gtg", 100).generateRemoval().store();
      tx.pushRecurrentTransfer("initminer", "gtg", chain.hive(100)).store();

      return tx.build().operations;
    });

    expect(retVal).toStrictEqual([
      {
        recurrent_transfer: {
          from_account: "initminer",
          to_account: "gtg",
          amount: {
            amount: "0",
            nai: "@@000000021",
            precision: 3
          },
          memo: "",
          recurrence: 0,
          executions: 0,
          extensions: [
            { recurrent_transfer_pair_id: { pair_id: 100 } }
          ]
        }
      },
      {
        recurrent_transfer: {
          from_account: "initminer",
          to_account: "gtg",
          amount: {
            amount: "100",
            nai: "@@000000021",
            precision: 3
          },
          memo: "",
          recurrence: 0,
          executions: 0,
          extensions: []
        }
      }
    ]);
  });

  test('Should be able to create a recurrent transfer without any underlying extensions using transaction builder interface', async ({ waxTest }) => {
    const retVal = await waxTest(async({ chain }) => {
      const tx = new chain.TransactionBuilder("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");
      tx.pushRecurrentTransfer("initminer", "gtg", chain.hive(100)).store();

      return tx.build().operations;
    });

    expect(retVal).toStrictEqual([
      {
        recurrent_transfer: {
          from_account: "initminer",
          to_account: "gtg",
          amount: {
            amount: "100",
            nai: "@@000000021",
            precision: 3
          },
          memo: "",
          recurrence: 0,
          executions: 0,
          extensions: []
        }
      }
    ]);
  });

  test('Should be able to create an update proposal with underlying extensions using transaction builder interface', async ({ waxTest }) => {
    const retVal = await waxTest(async({ chain }) => {
      const tx = new chain.TransactionBuilder("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");
      tx.pushUpdateProposal(100, "initminer", chain.hive(0), "subject", "permlink", "2023-08-01T15:38:48").store();
      tx.pushUpdateProposal(100, "initminer", chain.hive(0), "subject", "permlink").store();

      return tx.build().operations;
    });

    expect(retVal).toStrictEqual([
      {
        update_proposal: {
          creator: "initminer",
          daily_pay: {
            amount: "0",
            nai: "@@000000021",
            precision: 3
          },
          permlink: "permlink",
          subject: "subject",
          proposal_id: "100",
          extensions: [
            { update_proposal_end_date: { end_date: "2023-08-01T15:38:48" } }
          ]
        }
      },
      {
        update_proposal: {
          creator: "initminer",
          daily_pay: {
            amount: "0",
            nai: "@@000000021",
            precision: 3
          },
          permlink: "permlink",
          subject: "subject",
          proposal_id: "100",
          extensions: []
        }
      }
    ]);
  });

  test.afterAll(async () => {
    await browser.close();
  });
});
