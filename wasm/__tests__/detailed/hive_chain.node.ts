import { test, expect } from '@playwright/test';
import beekeeperFactory, { DEFAULT_STORAGE_ROOT, IBeekeeperInstance } from "@hive/beekeeper/node";

import { protoVoteOp, vote_operation } from "../assets/data.proto-protocol";

import { createHiveChain, IHiveChainInterface, BroadcastTransactionRequest, WaxFormatable } from "../../dist/bundle/node";

import fs from "fs";
import { instanceToPlain } from 'class-transformer';

let bk: IBeekeeperInstance;
let chain: IHiveChainInterface;

const HIVE_BLOCK_INTERVAL = 3 * 1000; // 3 seconds

test.describe('Wax object interface chain tests for Node.js', () => {
  test.beforeAll(async () => {
    bk = await beekeeperFactory();
    chain = await createHiveChain();
  });

  test.beforeEach(() => {
    if(fs.existsSync(`${DEFAULT_STORAGE_ROOT}/.beekeeper/w0.wallet`))
      fs.rmSync(`${DEFAULT_STORAGE_ROOT}/.beekeeper/w0.wallet`);
  });

  test('Should be able to create and sign transaction using object interface', async () => {
    // Create wallet:
    const session = bk.createSession("salt");
    const { wallet } = await session.createWallet("w0");
    await wallet.importKey('5JkFnXrLM2ap9t3AmAxBJvQHF7xSKtnTrCTginQCkhzU5S7ecPT');

    // Create transaction
    const tx = new chain.TransactionBuilder("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

    // Create signed transaction
    tx.push(protoVoteOp).validate();

    const stx = tx.build(wallet, "5RqVBAVNp5ufMCetQtvLGLJo7unX9nyCBMMrTXRWQ9i1Zzzizh");

    expect(stx.signatures[0]).toBe('1f7f0c3e89e6ccef1ae156a96fb4255e619ca3a73ef3be46746b4b40a66cc4252070eb313cc6308bbee39a0a9fc38ef99137ead3c9b003584c0a1b8f5ca2ff8707');
    expect(tx.sigDigest).toBe('205c79e3d17211882b1a2ba8640ff208413d68cabdca892cf47e9a6ad46e63a1');
  });

  test('Should be able to perform example API call', async () => {
    // https://developers.hive.io/apidefinitions/#account_by_key_api.get_key_references
    const result = await chain.api.account_by_key_api.get_key_references({
      keys: [
        "STM6vJmrwaX5TjgTS9dPH8KsArso5m91fVodJvv91j7G765wqcNM9"
      ]
    });

     expect(instanceToPlain(result)).toStrictEqual({ accounts: [["hiveio"]] });
  });

  test('Should be able to create and sign transaction using hive chain dynamic data', async () => {
    // Create wallet:
    const session = bk.createSession("salt");
    const { wallet } = await session.createWallet("w0");
    await wallet.importKey('5JkFnXrLM2ap9t3AmAxBJvQHF7xSKtnTrCTginQCkhzU5S7ecPT');

    // Create transaction
    const tx = await chain.getTransactionBuilder();

    // Create signed transaction
    tx.push(protoVoteOp).validate();

    const stx = tx.build(wallet, "5RqVBAVNp5ufMCetQtvLGLJo7unX9nyCBMMrTXRWQ9i1Zzzizh");

    expect(stx.signatures.length).toBe(1);
    expect(stx.ref_block_num).toBeGreaterThan(0);
    expect(stx.ref_block_prefix).toBeGreaterThan(0);
  });

  test('Should be able to extend hive chain interface by custom definitions', async () => {
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

    expect(instanceToPlain(result)).toStrictEqual({ args: {}, ret: [] });
  });

  test('Should throw when creating broadcast transaction request from unsigned transaction', async () => {
    const tx = new chain.TransactionBuilder("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");
    tx.push(protoVoteOp).build();

    expect(() => {
      new BroadcastTransactionRequest(tx);
    }).toThrowError();
  });

  test('Should be able to transmit protobuf transaction using hive chain interface', async () => {
    // Create wallet:
    const session = bk.createSession("salt");
    const { wallet } = await session.createWallet("w0");
    await wallet.importKey('5JkFnXrLM2ap9t3AmAxBJvQHF7xSKtnTrCTginQCkhzU5S7ecPT');

    const tx = new chain.TransactionBuilder("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");
    tx.push(protoVoteOp).build(wallet, "5RqVBAVNp5ufMCetQtvLGLJo7unX9nyCBMMrTXRWQ9i1Zzzizh");

    const retVal = new BroadcastTransactionRequest(tx);

    expect(instanceToPlain(retVal)).toStrictEqual({
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

  test('Should be able to calculate current manabar value using hive chain interface', async () => {
    const { current, max, percent } = chain.calculateCurrentManabarValue(
        1702548351,
        "2196088774870643",
        "1952744111294225",
        1702548249
      );

    expect(current.toString()).toBe("1953262632254958");
    expect(max.toString()).toBe("2196088774870643");
    expect(percent).toBe(88.94);
  });

  test('Should be able to parse user manabar from API using hive chain interface', async () => {
    const { accounts: [ account ] } = await chain.api.database_api.find_accounts({
      accounts: [ "initminer" ]
    });
    const dgpo = await chain.api.database_api.get_dynamic_global_properties({});

    const retVal = chain.calculateCurrentManabarValue(
      Math.round(new Date(`${dgpo.time}Z`).getTime() / 1000), // Convert API time to seconds
      account.post_voting_power.amount,
      account.voting_manabar.current_mana,
      account.voting_manabar.last_update_time
    ).max.toString();

    expect(retVal).toBe("1000000000000");
  });

  test('Should be able to calculate full manabar regeneration time from API using hive chain interface', async () => {
    const time = await chain.calculateManabarFullRegenerationTimeForAccount("initminer");

    const retVal = time.getTime(); // Should be close to Date.now() when fully regenerated

    expect(Date.now() - retVal).toBeLessThanOrEqual( HIVE_BLOCK_INTERVAL * 2 ); // Manabar of the initminer should not be used
  });

  test('Should be able to calculate current downvote manabar value from API using hive chain interface', async () => {
    const time = await chain.calculateCurrentManabarValueForAccount("initminer", 1);

    const retVal = time.max.toString();

    expect(retVal).toBe("250000000000");
  });

  test('Should be able to calculate current manabar rc value from API using hive chain interface', async () => {
    const time = await chain.calculateCurrentManabarValueForAccount("initminer", 2);

    const retVal = time.max.toString();

    expect(retVal).toBe("1002020748973");
  });

  test('Should be able to format values using default formatters from hive chain interface', () => {
    expect(
      chain.waxify`Operation: ${vote_operation}`
    ).toBe("Operation: vote_operation");
  });

  test('Should be able to format values using custom formatters extended from hive chain interface', () => {
    class MyFormatters {
      @WaxFormatable()
      myCustomProp(value) {
        return value.myCustomProp.toString();
      }
    }

    const formatter = chain.formatter.extend(MyFormatters);
    const data = {
      myCustomProp: 12542
    };

    expect(
      formatter.format`MyData: ${data}`
    ).toBe("MyData: 12542");
  });
});
