
import { expect } from '@playwright/test';

import { test } from '../assets/jest-helper';
import { protoVoteOp } from "../assets/data.proto-protocol";
import { naiAsset, transaction, transactionObj, vote_operation, legacyApiTransaction } from "../assets/data.protocol";
import type { ApiTransaction } from '../../dist/bundle';


test.describe('Wax object interface foundation tests', () => {
  test('Should be able to create TAPOS transaction using implicit expiration time', async ({ waxTest }) => {
    const retVal = await waxTest(async({ wax, beekeeper, base }, protoVoteOp) => {
      // Create wallet:
      const session = beekeeper.createSession("salt");
      const { wallet } = await session.createWallet("w0");
      await wallet.importKey('5JkFnXrLM2ap9t3AmAxBJvQHF7xSKtnTrCTginQCkhzU5S7ecPT');

      const now = Date.now();

      // Create transaction
      const tx = base.createTransactionWithTaPoS("04c1c7a566fc0da66aee465714acee7346b48ac2");

      // Create signed transaction
      tx.pushOperation(protoVoteOp).validate();

      tx.sign(wallet, "STM5RqVBAVNp5ufMCetQtvLGLJo7unX9nyCBMMrTXRWQ9i1Zzzizh");
      const stx = tx.transaction;

      const appliedExpirationTime: Date = wax.dateFromString(stx.expiration);

      const appliedExpirationTimeMs = appliedExpirationTime.getTime();

      /// We can't compare absolute values, so let's estimate that applied estimation is in given range
      const expirationValid = now < appliedExpirationTimeMs + 60*1000;

      return {
        expirationValid: expirationValid,
        signees: tx.signatureKeys
      };
    }, protoVoteOp);

    expect(retVal.expirationValid).toBeTruthy();
    expect(retVal.signees).toHaveLength(1);
    expect(retVal.signees[0]).toBe('STM5RqVBAVNp5ufMCetQtvLGLJo7unX9nyCBMMrTXRWQ9i1Zzzizh');
  });


  test('Should be able to convert HIVE to HBD - numbers', async ({ waxTest }) => {
    const retVal = await waxTest(async ({ base }) => {
      const feedPriceQuote = 1000;
      const feedPriceBase = 171;
      return base.hiveToHbd(13316762799, feedPriceBase, feedPriceQuote);
    });

    expect(retVal).toEqual({
      amount: "2277166438",
      nai: "@@000000013",
      precision: 3
    });
  });

  test('Should be able to convert HIVE to HBD - NAIs', async ({ waxTest }) => {
    const retVal = await waxTest(async ({ base }) => {
      const feedPriceQuote = base.hiveSatoshis(1000_000);
      const feedPriceBase = base.hbdSatoshis(171_000);
      const amount = base.hiveSatoshis(13316762799_000);
      return base.hiveToHbd(amount, feedPriceBase, feedPriceQuote);
    });

    expect(retVal).toEqual({
      amount: "2277166438629",
      nai: "@@000000013",
      precision: 3
    });
  });

  test('Should be able to validate valid account names', async ({ waxTest }) => {
    const retVal = await waxTest(async ({ base }) => {
      return base.isValidAccountName("gtg");
    });

    expect(retVal).toBeTruthy();
  });

  test('Should be able to validate invalid account names', async ({ waxTest }) => {
    // To short name
    await expect(waxTest(async ({ base }) => {
      return base.isValidAccountName("g");
    })).resolves.toBeFalsy();

    // Too long name
    await expect(waxTest(async ({ base }) => {
      return base.isValidAccountName("a".repeat(Number.parseInt(base.config.HIVE_MAX_ACCOUNT_NAME_LENGTH) + 1));
    })).resolves.toBeFalsy();

    // Invalid sequence
    await expect(waxTest(async ({ base }) => {
      return base.isValidAccountName("a..b");
    })).resolves.toBeFalsy();
  });

  test('Should be able to convert VESTS to HP (bug)', async ({ waxTest }) => {
    const retVal = await waxTest(async ({ base }) => {
      let blocktrades_delegated_hp = "";
      let blocktrades_self_witness_vote_hp = "";
      let mcfarhat_delegated_hp = "";

      {
        const delegated_vesting_shares = "6909522651976083";
        /// according to result taken from: https://api.hive.blog/hafbe-api/witnesses/blocktrades/voters?sort=vests&direction=desc&result-limit=2147483647
        const self_witness_vote = "43357485398000965";

        ///                                     vests-balance    total-hive   total-vests
        let hpValue = base.vestsToHp(delegated_vesting_shares, "182849539607", "312353953479712805");
        blocktrades_delegated_hp = base.waxify`${hpValue}`;
        console.log(`Blocktrades delegated_vesting_shares (HP): ${blocktrades_delegated_hp}`)

        hpValue = base.vestsToHp(self_witness_vote, "182849539607", "312353953479712805");
        blocktrades_self_witness_vote_hp = base.waxify`${hpValue}`;
        console.log(`Blocktrades (self) witness_vote (HP): ${blocktrades_self_witness_vote_hp}`)
      }

      {
        const delegated_vesting_shares = "13261033608208";

        ///                                    vests-balance    total-hive   total-vests
        let hpValue = base.vestsToHp(delegated_vesting_shares, "182849539607", "312353953479712805");
        mcfarhat_delegated_hp = base.waxify`${hpValue}`;
        console.log(`mcfarhat delegated_vesting_shares (HP): ${mcfarhat_delegated_hp}`)
      }

      return {
        "blocktrades_delegated_hp": blocktrades_delegated_hp,
        "blocktrades_self_witness_vote_hp": blocktrades_self_witness_vote_hp,
        "mcfarhat_delegated_hp": mcfarhat_delegated_hp
      };
    });

    expect(retVal).toEqual({
      "blocktrades_delegated_hp": "4,044,780.037 HIVE",
      "blocktrades_self_witness_vote_hp": "25,381,129.821 HIVE",
      "mcfarhat_delegated_hp": "7,762.904 HIVE"
    });
  });


  test('Should be able to generate negative HIVE asset', async ({ waxTest }) => {
    const retVal = await waxTest(async({ base }) => {
      return base.hiveSatoshis(-300_000);
    });

    expect(retVal).toStrictEqual({
      amount: "-300000",
      nai: "@@000000021",
      precision: 3
    });
  });

  test('Should be able to generate negative HBD asset', async ({ waxTest }) => {
    const retVal = await waxTest(async({ base }) => {
      return base.hbdSatoshis(-300_000);
    });

    expect(retVal).toStrictEqual({
      amount: "-300000",
      nai: "@@000000013",
      precision: 3
    });
  });

  test('Should be able to generate negative VESTS asset', async ({ waxTest }) => {
    const retVal = await waxTest(async({ base }) => {
      return base.vestsSatoshis(-300_000000);
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
      return base.vestsToHp(base.vestsSatoshis(10), base.hiveSatoshis(10), base.vestsSatoshis(10));
    });

    expect(retVal).toEqual({
      amount: "10",
      nai: "@@000000021",
      precision: 3
    });
  });

  test('Should be able to convert VESTS to HP using mixed params', async ({ waxTest }) => {
    const retVal = await waxTest(async({ base }) => {
      return base.vestsToHp(base.vestsSatoshis(10), 10, base.vestsSatoshis(10));
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
      return base.hbdToHive(base.hbdSatoshis(10), base.hbdSatoshis(1), base.hiveSatoshis(10));
    });

    expect(retVal).toEqual({
      amount: "100",
      nai: "@@000000021",
      precision: 3
    });
  });

  test('Should be able to convert HBD to HIVE using mixed params', async ({ waxTest }) => {
    const retVal = await waxTest(async({ base }) => {
      return base.hbdToHive(10, base.hbdSatoshis(1), base.hiveSatoshis(10));
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
      const tx = base.createTransactionFromJson(transaction);

      return tx.toApi();
    }, transaction);

    expect(retVal).toBe(JSON.stringify({
      ...transactionObj,
      extensions: [],
      signatures: []
    }));
  });

  test('Should be able to get impacted accounts from example api operation', async ({ waxTest }) => {
    const retVal = await waxTest(({ base }, operation) => {
      return [...base.operationGetImpactedAccounts(operation)];
    }, vote_operation);

    expect(retVal).toStrictEqual(["c0ff33a", "otom"]);
  });

  test('Should be able to get impacted accounts from example proto operation', async ({ waxTest }) => {
    const retVal = await waxTest(({ base }, operation) => {
      return [...base.operationGetImpactedAccounts(operation)];
    }, protoVoteOp);

    expect(retVal).toStrictEqual(["c0ff33a", "otom"]);
  });

  test('Should be able to create and sign transaction using object interface', async ({ waxTest }) => {
    const retVal = await waxTest(async({ beekeeper, base }, protoVoteOp) => {
      // Create wallet:
      const session = beekeeper.createSession("salt");
      const { wallet } = await session.createWallet("w0");
      await wallet.importKey('5JkFnXrLM2ap9t3AmAxBJvQHF7xSKtnTrCTginQCkhzU5S7ecPT');

      // Create transaction
      const tx = base.createTransactionWithTaPoS("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

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

  test('Should be able to binary serialize signed transaction using object interface', async ({ waxTest }) => {
    const retVal = await waxTest(async ({ beekeeper, base, wax }, protoVoteOp) => {
      // Create wallet:
      const session = beekeeper.createSession("salt");
      const { wallet } = await session.createWallet("w0");
      await wallet.importKey('5JkFnXrLM2ap9t3AmAxBJvQHF7xSKtnTrCTginQCkhzU5S7ecPT');

      // Create transaction
      const tx = base.createTransactionWithTaPoS("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      // push some operations
      tx.pushOperation(protoVoteOp);
      tx.pushOperation(new wax.DefineRecurrentTransferOperation({ from: "initminer", to: "gtg", amount: base.hiveSatoshis(100) }));

      tx.sign(wallet, "STM5RqVBAVNp5ufMCetQtvLGLJo7unX9nyCBMMrTXRWQ9i1Zzzizh");
      const stx = tx.transaction;

      const binaryHex = tx.toBinaryForm();

      console.log(tx.toApi());

      return {
        sig: stx.signatures[0],
        digest: tx.sigDigest,
        signees: tx.signatureKeys,
        binHex: binaryHex
      };
    }, protoVoteOp);

    expect(retVal.sig).toBe('1f7c6eb7a30681d77606a1491be2869e8112fee5241ec13cea5c7b4f54edc8d145269172f88359bb190fb26b362c81ccdf02bb56eb1d09daea3a381e5580e52f58');
    expect(retVal.digest).toBe('d07a8509795ff7c6f33ab7d6f4da24044e8f5833f0dffcd357bf21ba5e4db1d9');
    expect(retVal.signees).toHaveLength(1);
    expect(retVal.signees[0]).toBe('STM5RqVBAVNp5ufMCetQtvLGLJo7unX9nyCBMMrTXRWQ9i1Zzzizh');
    expect(retVal.binHex).toBe('a5c766fc0da60827c9640200046f746f6d076330666633336108657778686e6a626a98083109696e69746d696e65720367746764000000000000002320bcbe00180002000000011f7c6eb7a30681d77606a1491be2869e8112fee5241ec13cea5c7b4f54edc8d145269172f88359bb190fb26b362c81ccdf02bb56eb1d09daea3a381e5580e52f58');
  });

  test('Should be able to convert transaction json to binary form', async ({ waxTest }) => {
    const retVal = await waxTest(async({ base }, transaction) => {
      return base.convertTransactionToBinaryForm(JSON.parse(transaction));
    }, transaction);

    expect(retVal).toEqual('ff86c404c24b152fb7610100046f746f6d076330666633336108657778686e6a626a98080000')
  });

  test('Should not be able to convert transaction json to binary form because of invalid input type', async ({ waxTest }) => {
    const retVal = await waxTest(async({ base }) => {
      try {
        return base.convertTransactionToBinaryForm({
          "expiration": "2021-12-13T11:31:33",
          "extensions": [],
          "operations": [{
            "vote": {
              "author": "c0ff33a",
              "permlink": "ewxhnjbj",
              "voter": "otom",
              "weight": 2200
            }
          }],
          "ref_block_num": 34559,
          "ref_block_prefix": 1271006404,
          "signatures": []
        } as unknown as ApiTransaction); // Invalid input type
      } catch (error) {
        return false;
      }
    });

    expect(retVal).toBeFalsy();
  });

  test('Should be able to convert binary transaction to json form', async ({ waxTest }) => {
    const retVal = await waxTest(async({ base }) => {
      return base.convertTransactionFromBinaryForm('ff86c404c24b152fb7610100046f746f6d076330666633336108657778686e6a626a98080000');
    });

    expect(retVal).toEqual({
      "expiration": "2021-12-13T11:31:33",
      "extensions": [],
      "operations": [{
        "type": "vote_operation",
        "value": {
          "author": "c0ff33a",
          "permlink": "ewxhnjbj",
          "voter": "otom",
          "weight": 2200
        }
      }],
      "ref_block_num": 34559,
      "ref_block_prefix": 1271006404,
      "signatures": []
    });
  });

  test('Should be able to call convertTransactionToBinaryForm on object received from convertTransactionFromBinaryForm', async ({ waxTest }) => {
    const retVal = await waxTest(async({ base }) => {
      return base.convertTransactionToBinaryForm(base.convertTransactionFromBinaryForm('ff86c404c24b152fb7610100046f746f6d076330666633336108657778686e6a626a98080000'));
    });

    expect(retVal).toEqual('ff86c404c24b152fb7610100046f746f6d076330666633336108657778686e6a626a98080000');
  });

  test('Should be able to create a recurrent transfer with underlying extensions using transaction interface', async ({ waxTest }) => {
    const retVal = await waxTest(async({ wax, base }) => {
      const tx = base.createTransactionWithTaPoS("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");
      tx.pushOperation(new wax.RecurrentTransferRemovalOperation({
        from: "initminer",
        to: "gtg",
        pairId: 100
      }));
      tx.pushOperation(new wax.DefineRecurrentTransferOperation({ from: "initminer", to: "gtg", amount: base.hiveSatoshis(100) }));

      return tx.transaction.operations;
    });

    expect(retVal).toStrictEqual([
      {
        recurrent_transfer_operation: {
          from: "initminer",
          to: "gtg",
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
        recurrent_transfer_operation: {
          from: "initminer",
          to: "gtg",
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
    const retVal = await waxTest(async({ base, wax }) => {
      const tx = base.createTransactionWithTaPoS("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");
      tx.pushOperation(new wax.DefineRecurrentTransferOperation({ from: "initminer", to: "gtg", amount: base.hiveSatoshis(100) }));

      return tx.transaction.operations;
    });

    expect(retVal).toStrictEqual([
      {
        recurrent_transfer_operation: {
          from: "initminer",
          to: "gtg",
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

  test('Should fail when invalid asset is provided', async ({ waxTest }) => {
    await expect(waxTest(async({ base, wax }) => {
      const tx = base.createTransactionWithTaPoS("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      tx.pushOperation(new wax.UpdateProposalOperation({ proposalId: 100, creator: "initminer", dailyPay: base.hiveSatoshis(0), subject: "subject", permlink: "permlink", endDate: "2023-08-01T15:38:48" }));
      tx.pushOperation(new wax.UpdateProposalOperation({ proposalId: 100, creator: "initminer", dailyPay: base.hiveSatoshis(0), subject: "subject", permlink: "permlink" }));

      return tx.transaction.operations;
    })).rejects.toThrow('Invalid asset provided: "{"amount":"0","precision":3,"nai":"@@000000021"}". Expected asset symbol(s): ""@@000000013" (HBD) with precision: 3".');
  });

  test('Should be able to create an update proposal with underlying extensions using transaction interface', async ({ waxTest }) => {
    const retVal = await waxTest(async({ base, wax }) => {
      const tx = base.createTransactionWithTaPoS("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      tx.pushOperation(new wax.UpdateProposalOperation({ proposalId: 100, creator: "initminer", dailyPay: base.hbdSatoshis(0), subject: "subject", permlink: "permlink", endDate: "2023-08-01T15:38:48" }));
      tx.pushOperation(new wax.UpdateProposalOperation({ proposalId: 100, creator: "initminer", dailyPay: base.hbdSatoshis(0), subject: "subject", permlink: "permlink" }));

      return tx.transaction.operations;
    });

    expect(retVal).toStrictEqual([
      {
        update_proposal_operation: {
          creator: "initminer",
          daily_pay: {
            amount: "0",
            nai: "@@000000013",
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
        update_proposal_operation: {
          creator: "initminer",
          daily_pay: {
            amount: "0",
            nai: "@@000000013",
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
    const retVal = await waxTest(async({ base, beekeeper }) => {
      // Create wallet:
      const session = beekeeper.createSession("salt");
      const { wallet } = await session.createWallet("w0");
      const publicKey = await wallet.importKey('5JkFnXrLM2ap9t3AmAxBJvQHF7xSKtnTrCTginQCkhzU5S7ecPT');

      const tx = base.createTransactionWithTaPoS("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      tx.startEncrypt(publicKey).pushOperation({
        transfer_operation: {
          amount: base.hiveSatoshis(100),
          from: "gtg",
          to: "initminer",
          memo: "This should be encrypted"
        }
      }).stopEncrypt().startEncrypt(publicKey).pushOperation({
        transfer_operation: {
          amount: base.hiveSatoshis(120),
          from: "initminer",
          to: "gtg",
          memo: "This also should be encrypted"
        }
      });

      tx.sign(wallet, publicKey)
      const operations = tx.transaction.operations;

      const encrypted1 = operations[0].transfer_operation!.memo;
      const encrypted2 = operations[1].transfer_operation!.memo;

      return {
        encrypted: [ encrypted1, encrypted2 ],
        decrypted: [ base.decrypt(wallet, encrypted1), base.decrypt(wallet, encrypted2) ]
      };
    });

    expect(retVal.encrypted[0]).toBe("#5P5bvgpUUGTskb98shuYBTpSMqfoTBev6Ay2xo9UgMF3Rj5uhFSqwVLb4LZkmCcodBdQUgEspA1t2dByaMVAjyJFZN767GRGxGDtx2r3sQtui9kFEWPGcxXYvWZLxAxDJmgtqc4wUsgNKYe5kZPPQSHg");
    expect(retVal.encrypted[1]).toBe("#5P5bvgpUUGTskb98siFoASHTSKsjZmsqW38CFKJxtVdCB9bFvnqwexhDDB2eNvCfxCMTeAjAsqxA3HDsTqEKqNiA6ve41UqYudCWtqXYrVM3dPf8m4E3hVp2grEPmDYa3GhSakAw7bxgfiYVXzcbS1ni");
    expect(retVal.decrypted[0]).toBe("This should be encrypted");
    expect(retVal.decrypted[1]).toBe("This also should be encrypted");
  });

  test('Should be able to decrypt operations using transaction interface', async ({ waxTest }) => {
    const retVal = await waxTest(async({ base, beekeeper }) => {
      // Create wallet:
      const session = beekeeper.createSession("salt");
      const { wallet } = await session.createWallet("w0");
      const publicKey = await wallet.importKey('5JkFnXrLM2ap9t3AmAxBJvQHF7xSKtnTrCTginQCkhzU5S7ecPT');

      const tx = base.createTransactionWithTaPoS("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      tx.startEncrypt(publicKey).pushOperation({
        transfer_operation: {
          amount: base.hiveSatoshis(100),
          from: "gtg",
          to: "initminer",
          memo: "This should be encrypted"
        }
      });

      tx.sign(wallet, publicKey)
      const operations = tx.transaction.operations;

      const encrypted = operations[0].transfer_operation!.memo;

      const decrypted = tx.decrypt(wallet);

      return {
        encrypted,
        decrypted: decrypted.operations[0].transfer_operation!.memo
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
      return base.calculateAccountHp(10, base.hiveSatoshis(10), 10);
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
      amount: "10",
      nai: "@@000000021",
      precision: 3
    });
  });

  test('Should be able to calculate witness votes HP with mixed params', async ({ waxTest }) => {
    const retVal = await waxTest(async({ base }) => {
      return base.calculateWitnessVotesHp(10, base.hiveSatoshis(10), 10);
    });

    expect(retVal).toEqual({
      amount: "10",
      nai: "@@000000021",
      precision: 3
    });
  });

  test('Should be able to calculate witness votes HP with big values (mainnet 5M)', async ({ waxTest }) => {
    const retVal = await waxTest(async({ base }) => {
      return base.calculateWitnessVotesHp("147408633689698596", "180520335089", "304505804867506145");
    });

    expect(retVal).toEqual({
      amount: "87388337178",
      nai: "@@000000021",
      precision: 3
    });
  });

  test('Should be able to calculate witness votes HP with big values (mainnet 5M) - typed asset version', async ({ waxTest }) => {
    const retVal = await waxTest(async({ base }) => {
      return base.calculateWitnessVotesHp(base.vestsSatoshis("147408633689698596"), base.hiveSatoshis("180520335089"), base.vestsSatoshis("304505804867506145"));
    });

    expect(retVal).toEqual({
      amount: "87388337178",
      nai: "@@000000021",
      precision: 3
    });
  });

  test('Should be able to calculate account hp 1', async ({ waxTest }) => {
    const retVal = await waxTest(({ base }, ...args) => {
      const vests = base.vestsSatoshis(args[0]);
      const total_vesting_fund_hive = base.hiveSatoshis(args[1]);
      const total_vesting_shares = base.vestsSatoshis(args[2]);
      return base.calculateAccountHp(vests, total_vesting_fund_hive, total_vesting_shares);
    }, "1100000000", 100000, "100000000000");

    expect(retVal).toEqual({
      nai: "@@000000021",
      precision: 3,
      amount: "1100"
    });
  });

  test('Should be able to calculate account hp 2', async ({ waxTest }) => {
    const retVal = await waxTest(({ base }, ...args) => {
      const vests = base.vestsSatoshis(args[0]);
      const total_vesting_fund_hive = base.hiveSatoshis(args[1]);
      const total_vesting_shares = base.vestsSatoshis(args[2]);
      return base.calculateAccountHp(vests, total_vesting_fund_hive, total_vesting_shares);
    }, "2268225009295472", "173009633181", "300729442281783339");

    expect(retVal).toEqual({
      nai: "@@000000021",
      precision: 3,
      amount: "1304909734"
    });
  });

  test('Should be able to calculate witness votes hp 1', async ({ waxTest }) => {
    const retVal = await waxTest(({ base }, ...args) => {
      const vests = args[0];
      const total_vesting_fund_hive = base.hiveSatoshis(args[1]);
      const total_vesting_shares = base.vestsSatoshis(args[2]);
      return base.calculateWitnessVotesHp(vests, total_vesting_fund_hive, total_vesting_shares);
    }, "1100000000", 100_000, "100000000000");

    expect(retVal).toEqual({
      nai: "@@000000021",
      precision: 3,
      amount: "1100"
    });
  });

  test('Should be able to calculate witness votes hp 2', async ({ waxTest }) => {
    const retVal = await waxTest(({ base }, ...args) => {
      const vests = args[0];
      const total_vesting_fund_hive = base.hiveSatoshis(args[1]);
      const total_vesting_shares = base.vestsSatoshis(args[2]);
      return base.calculateWitnessVotesHp(vests, total_vesting_fund_hive, total_vesting_shares);
    }, "142103996686715320", 173_009_633_181, "300729442281783339");

    expect(retVal).toEqual({
      nai: "@@000000021",
      precision: 3,
      amount: "81752422223"
    });
  });


  test('Should be able to calculate witness votes HP with big values (mainnet 5M)-mixed param types', async ({ waxTest }) => {
    const retVal = await waxTest(async({ base }) => {
      return base.calculateWitnessVotesHp("147408633689698596", base.hiveSatoshis("180520335089"), base.vestsSatoshis("304505804867506145"));
    });

    expect(retVal).toEqual({
      amount: "87388337178",
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
      return base.calculateHpApr(1_000_000, 1_500, base.hiveSatoshis(10), 10);
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

  test('Should be able to convert between raw private key -> WIF formats', async ({ waxTest }) => {
    const retVal = await waxTest(async({ base }) => {
      return base.convertRawPrivateKeyToWif('48a9c812cafcd35eb761501768ba7e2eb9a238853548556c2c38431f51d63030');
    });

    expect(retVal).toBe('5JNHfZYKGaomSFvd4NUdQ9qMcEAC43kujbfjueTHpVapX1Kzq2n');
  });

  test('Should be able to convert between raw compressed public key -> WIF formats', async ({ waxTest }) => {
    const retVal = await waxTest(({ base }) => {
      return base.convertRawPublicKeyToWif('02be643d4c424ac7cf2f3cf51dd048773cbdcee30b111adb30d89c27668c501705');
    });

    expect(retVal).toBe('STM6LLegbAgLAy28EHrffBVuANFWcFgmqRMW13wBmTExqFE9SCkg4');
  });

  test('Should be able to convert between raw uncompressed public key -> WIF formats', async ({ waxTest }) => {
    const retVal = await waxTest(({ base }) => {
      return base.convertRawPublicKeyToWif('04be643d4c424ac7cf2f3cf51dd048773cbdcee30b111adb30d89c27668c5017051a9cc2866c479818522ffd2b4a3d7a5a64d1b98c968f8f6ea2ef6745a637eb92');
    });

    expect(retVal).toBe('STM6LLegbAgLAy28EHrffBVuANFWcFgmqRMW13wBmTExqFE9SCkg4');
  });

  test('Should be able to estimate hive collateral', async ({ waxTest }) => {
    const retVal = await waxTest(async({ base }) => {
      return base.estimateHiveCollateral(201, 1000, 197, 1000, 100000);
    });

    expect(retVal).toStrictEqual({
      nai: "@@000000021",
      precision: 3,
      amount: "1065988"
    });
  });

  test('Should be able to estimate hbd interests', async ({ waxTest }) => {
    const retVal = await waxTest(async({ base }) => {
      return base.estimateHbdInterest("2860100980056", base.hbdSatoshis(46107782), "2025-11-15T20:27:54", "2025-11-26T16:05:33", 1500);
    });

    expect(retVal).toStrictEqual({
      nai: "@@000000013",
      precision: 3,
      amount: "218584"
    });
  });

  test('Should be able to create transaction from legacy JSON format', async ({ waxTest }) => {
    const retVal = await waxTest(async({ base }, legacyTx) => {
      const tx = base.createTransactionFromLegacyJson(legacyTx);

      // Verify it was parsed correctly
      return {
        operations: tx.transaction.operations.length,
        opType: tx.transaction.operations[0]?.transfer_operation ? 'transfer' : 'unknown',
        from: tx.transaction.operations[0]?.transfer_operation?.from,
        to: tx.transaction.operations[0]?.transfer_operation?.to
      };
    }, legacyApiTransaction);

    expect(retVal).toStrictEqual({
      operations: 1,
      opType: 'transfer',
      from: 'oneplus7',
      to: 'kryptogames'
    });
  });

  test('Should be able to convert legacy transaction to API JSON', async ({ waxTest }) => {
    const retVal = await waxTest(async({ base }, legacyTx) => {
      const tx = base.createTransactionFromLegacyJson(legacyTx);
      const apiJson = tx.toApi();
      const parsed = JSON.parse(apiJson);

      return {
        hasType: 'type' in parsed.operations[0],
        hasValue: 'value' in parsed.operations[0],
        operationType: parsed.operations[0].type,
        hasNaiAsset: 'nai' in parsed.operations[0].value.amount
      };
    }, legacyApiTransaction);

    expect(retVal).toStrictEqual({
      hasType: true,
      hasValue: true,
      operationType: 'transfer_operation',
      hasNaiAsset: true
    });
  });

  test('Should be able to validate legacy transaction', async ({ waxTest }) => {
    await waxTest(async({ base }, legacyTx) => {
      const tx = base.createTransactionFromLegacyJson(legacyTx);

      // Should not throw
      tx.validate();
    }, legacyApiTransaction);
  });

  test('Should be able to get impacted accounts from legacy transaction', async ({ waxTest }) => {
    const retVal = await waxTest(async({ base }, legacyTx) => {
      const tx = base.createTransactionFromLegacyJson(legacyTx);

      return Array.from(tx.impactedAccounts);
    }, legacyApiTransaction);

    expect(retVal).toContain('oneplus7');
    expect(retVal).toContain('kryptogames');
  });

  test('Should be able to calculate transaction ID from legacy transaction', async ({ waxTest }) => {
    const retVal = await waxTest(async({ base }, legacyTx) => {
      const tx = base.createTransactionFromLegacyJson(legacyTx);

      return tx.id;
    }, legacyApiTransaction);

    expect(retVal).toBe("3725c81634f152011e2043eb7119911b953d4267");
  });

  test('Should be able to push operations to legacy transaction', async ({ waxTest }) => {
    const retVal = await waxTest(async({ base }, legacyTx) => {
      const tx = base.createTransactionFromLegacyJson(legacyTx);

      // Add another operation
      tx.pushOperation({
        vote_operation: {
          voter: 'alice',
          author: 'bob',
          permlink: 'test-post',
          weight: 10000
        }
      });

      return tx.transaction.operations.length;
    }, legacyApiTransaction);

    expect(retVal).toBe(2);
  });

  test('Should handle legacy asset format conversion', async ({ waxTest }) => {
    const retVal = await waxTest(async({ base }) => {
      const legacyTx = {
        ref_block_num: 1,
        ref_block_prefix: 1,
        expiration: '2023-11-09T22:01:24',
        operations: [
          ['transfer', {
            from: 'alice',
            to: 'bob',
            amount: '100.500 HIVE',  // Legacy format
            memo: 'test'
          }]
        ],
        extensions: [],
        signatures: []
      };

      const tx = base.createTransactionFromLegacyJson(legacyTx);
      const transferOp = tx.transaction.operations[0]?.transfer_operation;

      return {
        amount: transferOp?.amount?.amount,
        nai: transferOp?.amount?.nai,
        precision: transferOp?.amount?.precision
      };
    });

    expect(retVal).toStrictEqual({
      amount: '100500',
      nai: '@@000000021',
      precision: 3
    });
  });

  test('Should handle legacy HBD asset format', async ({ waxTest }) => {
    const retVal = await waxTest(async({ base }) => {
      const legacyTx = {
        ref_block_num: 1,
        ref_block_prefix: 1,
        expiration: '2023-11-09T22:01:24',
        operations: [
          ['transfer', {
            from: 'alice',
            to: 'bob',
            amount: '50.000 HBD',  // Legacy HBD format
            memo: ''
          }]
        ],
        extensions: [],
        signatures: []
      };

      const tx = base.createTransactionFromLegacyJson(legacyTx);
      const transferOp = tx.transaction.operations[0]?.transfer_operation;

      return {
        amount: transferOp?.amount?.amount,
        nai: transferOp?.amount?.nai,
        precision: transferOp?.amount?.precision
      };
    });

    expect(retVal).toStrictEqual({
      amount: '50000',
      nai: '@@000000013',
      precision: 3
    });
  });

  test('Should handle legacy operation with numeric type ID', async ({ waxTest }) => {
    const retVal = await waxTest(async({ base }) => {
      const legacyTx = {
        ref_block_num: 1,
        ref_block_prefix: 1,
        expiration: '2023-11-09T22:01:24',
        operations: [
          [2, {  // Transfer is operation type 2
            from: 'alice',
            to: 'bob',
            amount: '1.000 HIVE',
            memo: ''
          }]
        ],
        extensions: [],
        signatures: []
      };

      const tx = base.createTransactionFromLegacyJson(legacyTx);

      return tx.transaction.operations[0]?.transfer_operation ? 'transfer' : 'unknown';
    });

    expect(retVal).toBe('transfer');
  });

  test('Should calculate public key from private key using wax API', async ({ waxTest }) => {
    const privateKey = "5JkFnXrLM2ap9t3AmAxBJvQHF7xSKtnTrCTginQCkhzU5S7ecPT";
    const expectedPublicKey = "STM5RqVBAVNp5ufMCetQtvLGLJo7unX9nyCBMMrTXRWQ9i1Zzzizh";

    const publicKey = await waxTest(async ({ base }, privateKey) => {
      return base.calculatePublicKey(privateKey);
    }, privateKey);

    expect(publicKey).toBe(expectedPublicKey);
  });

  test('Should throw error for invalid private key format using wax API', async ({ waxTest }) => {
    const invalidPrivateKey = "invalid_key";

    await expect(waxTest(async ({ base }, invalidPrivateKey) => {
      return base.calculatePublicKey(invalidPrivateKey);
    }, invalidPrivateKey)).rejects.toThrow();
  });
});
