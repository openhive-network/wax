import { ChromiumBrowser, ConsoleMessage, chromium } from 'playwright';
import { expect } from '@playwright/test';

import { DEFAULT_STORAGE_ROOT } from "@hiveio/beekeeper/node";
import fs from "fs";

import { test } from '../assets/jest-helper';
import { protoVoteOp } from "../assets/data.proto-protocol";
import { naiAsset, transaction } from "../assets/data.protocol";

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

  test('Should be able to generate negative HIVE asset', async ({ waxTest }) => {
    const retVal = await waxTest(async({ base }) => {
      return base.hive(-300_000);
    });

    expect(retVal).toStrictEqual({
      amount: "-300000",
      nai: "@@000000021",
      precision: 3
    });
  });

  test('Should be able to generate negative HBD asset', async ({ waxTest }) => {
    const retVal = await waxTest(async({ base }) => {
      return base.hbd(-300_000);
    });

    expect(retVal).toStrictEqual({
      amount: "-300000",
      nai: "@@000000013",
      precision: 3
    });
  });

  test('Should be able to generate negative VESTS asset', async ({ waxTest }) => {
    const retVal = await waxTest(async({ base }) => {
      return base.vests(-300_000000);
    });

    expect(retVal).toStrictEqual({
      amount: "-300000000",
      nai: "@@000000037",
      precision: 6
    });
  });

  test('Should be able to convert API asset to the proper negative HIVE asset data', async ({ waxTest }) => {
    const retVal = await waxTest(async({ base }, naiAsset) => {
      const asset = base.getAsset({ ...naiAsset, amount: `-${naiAsset.amount}` });

      return asset;
    }, naiAsset);

    expect(retVal).toStrictEqual({
      amount: "-300.000",
      symbol: "HIVE"
    });
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

  test('Should be able to convert VESTS to HP', async ({ waxTest }) => {
    const retVal = await waxTest(async({ base }) => {
      return base.vestsToHp(10, 1, 10);
    });

    expect(retVal).toEqual({
      amount: "1",
      nai: "@@000000021",
      precision: 3
    });
  });

  test('Should be able to convert VESTS to HP using NaiAssets', async ({ waxTest }) => {
    const retVal = await waxTest(async({ base }) => {
      return base.vestsToHp(base.vests(10), base.hive(10), base.vests(10));
    });

    expect(retVal).toEqual({
      amount: "10",
      nai: "@@000000021",
      precision: 3
    });
  });

  test('Should be able to convert VESTS to HP using mixed params', async ({ waxTest }) => {
    const retVal = await waxTest(async({ base }) => {
      return base.vestsToHp(base.vests(10), 10, base.vests(10));
    });

    expect(retVal).toEqual({
      amount: "10",
      nai: "@@000000021",
      precision: 3
    });
  });

  test('Should be able to convert HBD to HIVE', async ({ waxTest }) => {
    const retVal = await waxTest(async({ base }) => {
      return base.hbdToHive(10, 1, 10);
    });

    expect(retVal).toEqual({
      amount: "100",
      nai: "@@000000021",
      precision: 3
    });
  });

  test('Should be able to convert HBD to HIVE using NaiAsset', async ({ waxTest }) => {
    const retVal = await waxTest(async({ base }) => {
      return base.hbdToHive(base.hbd(10), base.hbd(1), base.hive(10));
    });

    expect(retVal).toEqual({
      amount: "100",
      nai: "@@000000021",
      precision: 3
    });
  });

  test('Should be able to convert HBD to HIVE using mixed params', async ({ waxTest }) => {
    const retVal = await waxTest(async({ base }) => {
      return base.hbdToHive(10, base.hbd(1), base.hive(10));
    });

    expect(retVal).toEqual({
      amount: "100",
      nai: "@@000000021",
      precision: 3
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
      const tx = base.Transaction.fromApi(transaction);

      return tx.toApi();
    }, transaction);

    expect(retVal).toBe(transaction);
  });

  test('Should be able to create and sign transaction using object interface', async ({ waxTest }) => {
    const retVal = await waxTest(async({ beekeeper, base }, protoVoteOp) => {
      // Create wallet:
      const session = beekeeper.createSession("salt");
      const { wallet } = await session.createWallet("w0");
      await wallet.importKey('5JkFnXrLM2ap9t3AmAxBJvQHF7xSKtnTrCTginQCkhzU5S7ecPT');

      // Create transaction
      const tx = new base.Transaction("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      // Create signed transaction
      tx.pushOperation(protoVoteOp).validate();

      tx.sign(wallet, "STM5RqVBAVNp5ufMCetQtvLGLJo7unX9nyCBMMrTXRWQ9i1Zzzizh");
      const stx = tx.transaction;

      return {
        sig: stx.signatures[0],
        digest: tx.sigDigest,
        signees: tx.signatureKeys
      };
    }, protoVoteOp);

    expect(retVal.sig).toBe('1f7f0c3e89e6ccef1ae156a96fb4255e619ca3a73ef3be46746b4b40a66cc4252070eb313cc6308bbee39a0a9fc38ef99137ead3c9b003584c0a1b8f5ca2ff8707');
    expect(retVal.digest).toBe('205c79e3d17211882b1a2ba8640ff208413d68cabdca892cf47e9a6ad46e63a1');
    expect(retVal.signees).toHaveLength(1);
    expect(retVal.signees[0]).toBe('STM5RqVBAVNp5ufMCetQtvLGLJo7unX9nyCBMMrTXRWQ9i1Zzzizh');
  });

  test('Should be able to create a recurrent transfer with underlying extensions using transaction interface', async ({ waxTest }) => {
    const retVal = await waxTest(async({ wax, chain }) => {
      const tx = new chain.Transaction("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");
      tx.pushOperation(new wax.RecurrentTransferOperation({
        from: "initminer",
        to: "gtg",
        pairId: 100
      }));
      tx.pushOperation(new wax.RecurrentTransferOperation({ from: "initminer", to: "gtg", amount: chain.hive(100) }));

      return tx.transaction.operations;
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
          recurrence: 24,
          executions: 2,
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
          recurrence: 24,
          executions: 2,
          extensions: []
        }
      }
    ]);
  });

  test('Should be able to create a recurrent transfer without any underlying extensions using transaction interface', async ({ waxTest }) => {
    const retVal = await waxTest(async({ chain, wax }) => {
      const tx = new chain.Transaction("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");
      tx.pushOperation(new wax.RecurrentTransferOperation({ from: "initminer", to: "gtg", amount: chain.hive(100) }));

      return tx.transaction.operations;
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
          recurrence: 24,
          executions: 2,
          extensions: []
        }
      }
    ]);
  });

  test('Should be able to create an update proposal with underlying extensions using transaction interface', async ({ waxTest }) => {
    const retVal = await waxTest(async({ chain, wax }) => {
      const tx = new chain.Transaction("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      tx.pushOperation(new wax.UpdateProposalOperation({ proposalId: 100, creator: "initminer", dailyPay: chain.hive(0), subject: "subject", permlink: "permlink", endDate: "2023-08-01T15:38:48" }));
      tx.pushOperation(new wax.UpdateProposalOperation({ proposalId: 100, creator: "initminer", dailyPay: chain.hive(0), subject: "subject", permlink: "permlink" }));

      return tx.transaction.operations;
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

  test('Should be able to create encrypted operations using transaction interface', async ({ waxTest }) => {
    const retVal = await waxTest(async({ chain, beekeeper }) => {
      // Create wallet:
      const session = beekeeper.createSession("salt");
      const { wallet } = await session.createWallet("w0");
      const publicKey = await wallet.importKey('5JkFnXrLM2ap9t3AmAxBJvQHF7xSKtnTrCTginQCkhzU5S7ecPT');

      const tx = new chain.Transaction("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      tx.startEncrypt(publicKey).pushOperation({
        transfer: {
          amount: chain.hive(100),
          from_account: "gtg",
          to_account: "initminer",
          memo: "This should be encrypted"
        }
      }).stopEncrypt().startEncrypt(publicKey).pushOperation({
        transfer: {
          amount: chain.hive(120),
          from_account: "initminer",
          to_account: "gtg",
          memo: "This also should be encrypted"
        }
      });

      tx.sign(wallet, publicKey)
      const operations = tx.transaction.operations;

      const encrypted1 = operations[0].transfer!.memo;
      const encrypted2 = operations[1].transfer!.memo;

      return {
        encrypted: [ encrypted1, encrypted2 ],
        decrypted: [ chain.decrypt(wallet, encrypted1), chain.decrypt(wallet, encrypted2) ]
      };
    });

    expect(retVal.encrypted[0]).toBe("#5P5bvgpUUGTskb98shuYBTpSMqfoTBev6Ay2xo9UgMF3Rj5uhFSqwVLb4LZkmCcodBdQUgEspA1t2dByaMVAjyJFZN767GRGxGDtx2r3sQtui9kFEWPGcxXYvWZLxAxDJmgtqc4wUsgNKYe5kZPPQSHg");
    expect(retVal.encrypted[1]).toBe("#5P5bvgpUUGTskb98siFoASHTSKsjZmsqW38CFKJxtVdCB9bFvnqwexhDDB2eNvCfxCMTeAjAsqxA3HDsTqEKqNiA6ve41UqYudCWtqXYrVM3dPf8m4E3hVp2grEPmDYa3GhSakAw7bxgfiYVXzcbS1ni");
    expect(retVal.decrypted[0]).toBe("This should be encrypted");
    expect(retVal.decrypted[1]).toBe("This also should be encrypted");
  });

  test('Should be able to decrypt operations using transaction interface', async ({ waxTest }) => {
    const retVal = await waxTest(async({ chain, beekeeper }) => {
      // Create wallet:
      const session = beekeeper.createSession("salt");
      const { wallet } = await session.createWallet("w0");
      const publicKey = await wallet.importKey('5JkFnXrLM2ap9t3AmAxBJvQHF7xSKtnTrCTginQCkhzU5S7ecPT');

      const tx = new chain.Transaction("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      tx.startEncrypt(publicKey).pushOperation({
        transfer: {
          amount: chain.hive(100),
          from_account: "gtg",
          to_account: "initminer",
          memo: "This should be encrypted"
        }
      });

      tx.sign(wallet, publicKey)
      const operations = tx.transaction.operations;

      const encrypted = operations[0].transfer!.memo;

      const decrypted = tx.decrypt(wallet);

      return {
        encrypted,
        decrypted: decrypted.operations[0].transfer!.memo
      };
    });

    expect(retVal.encrypted).toBe("#5P5bvgpUUGTskb98shuYBTpSMqfoTBev6Ay2xo9UgMF3Rj5uhFSqwVLb4LZkmCcodBdQUgEspA1t2dByaMVAjyJFZN767GRGxGDtx2r3sQtui9kFEWPGcxXYvWZLxAxDJmgtqc4wUsgNKYe5kZPPQSHg");
    expect(retVal.decrypted).toBe("This should be encrypted");
  })

  test('Should be able to calculate account HP', async ({ waxTest }) => {
    const retVal = await waxTest(async({ base }) => {
      return base.calculateAccountHp(10, 10, 10);
    });

    expect(retVal).toEqual({
      amount: "10",
      nai: "@@000000021",
      precision: 3
    });
  });

  test('Should be able to calculate account HP with mixed params', async ({ waxTest }) => {
    const retVal = await waxTest(async({ base }) => {
      return base.calculateAccountHp(10, base.hive(10), 10);
    });

    expect(retVal).toEqual({
      amount: "10",
      nai: "@@000000021",
      precision: 3
    });
  });

  test('Should be able to calculate witness votes HP', async ({ waxTest }) => {
    const retVal = await waxTest(async({ base }) => {
      return base.calculateWitnessVotesHp(10, 10, 10);
    });

    expect(retVal).toEqual({
      amount: "42949672970",
      nai: "@@000000021",
      precision: 3
    });
  });

  test('Should be able to calculate witness votes HP with mixed params', async ({ waxTest }) => {
    const retVal = await waxTest(async({ base }) => {
      return base.calculateWitnessVotesHp(10, base.hive(10), 10);
    });

    expect(retVal).toEqual({
      amount: "42949672970",
      nai: "@@000000021",
      precision: 3
    });
  });

  test('Should be able to calculate HP APR', async ({ waxTest }) => {
    const retVal = await waxTest(async({ base }) => {
      return base.calculateHpApr(1_000_000, 1_500, 10, 10);
    });

    expect(retVal).toEqual(1.46);
  });

  test('Should be able to calculate HP APR with mixed params', async ({ waxTest }) => {
    const retVal = await waxTest(async({ base }) => {
      return base.calculateHpApr(1_000_000, 1_500, base.hive(10), 10);
    });

    expect(retVal).toEqual(1.46);
  });

  test('Should be able to generate random private key using password', async ({ waxTest }) => {
    const retVal = await waxTest(async({ base }) => {
      return base.getPrivateKeyFromPassword("gtg", "active", "verysecurepassword");
    });

    expect(retVal.associatedPublicKey).toBe("STM6JswFatSixhR9AMUP38rtpMVAagTvxGYu7d8i2JUK1QZDkPbH3");
    expect(retVal.wifPrivateKey).toBe("5J89tdX8b1wQJHcqDMDVn1UwvtiYFK53PQEgG5gL5oCEk83Us12");
  });

  test('Should be able to suggest brain key', async ({ waxTest }) => {
    const retVal = await waxTest.dynamic(async({ base }) => {
      return base.suggestBrainKey();
    });

    expect(retVal.associatedPublicKey).toHaveLength(53);
    expect((retVal.brainKey as string).length).toBeGreaterThan(0);
    expect(retVal.wifPrivateKey).toHaveLength(51);
  });

  test.afterAll(async () => {
    await browser.close();
  });
});
