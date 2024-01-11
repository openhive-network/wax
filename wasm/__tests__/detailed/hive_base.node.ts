import { test, expect } from '@playwright/test';
import beekeeperFactory, { IBeekeeperInstance } from "@hive/beekeeper/node";

import { protoVoteOp } from "../assets/data.proto-protocol";
import { transaction } from "../assets/data.protocol";

import { createWaxFoundation, IWaxBaseInterface } from "../../dist/bundle/node";

import fs from "fs";

let bk: IBeekeeperInstance;
let wx: IWaxBaseInterface;

test.describe('Wax object interface foundation tests for Node.js', () => {
  test.beforeAll(async () => {
    bk = await beekeeperFactory();
    wx = await createWaxFoundation();
  });

  test.beforeEach(() => {
    if(fs.existsSync('storage_root-node/.beekeeper/w0.wallet'))
      fs.rmSync('storage_root-node/.beekeeper/w0.wallet');
  });

  test('Should be able to bidirectional convert api to proto using object interface', async () => {
    const tx = wx.TransactionBuilder.fromApi(transaction);

    const retVal = tx.toApi();

    expect(retVal).toBe(transaction);
  });

  test('Should be able to create and sign transaction using object interface', async () => {
    // Create wallet:
    const session = bk.createSession("salt");
    const { wallet } = await session.createWallet("w0");
    await wallet.importKey('5JkFnXrLM2ap9t3AmAxBJvQHF7xSKtnTrCTginQCkhzU5S7ecPT');

    // Create transaction
    const tx = new wx.TransactionBuilder("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

    // Create signed transaction
    tx.push(protoVoteOp).validate();

    const stx = tx.build(wallet, "5RqVBAVNp5ufMCetQtvLGLJo7unX9nyCBMMrTXRWQ9i1Zzzizh");

    expect(stx.signatures[0]).toBe('1f7f0c3e89e6ccef1ae156a96fb4255e619ca3a73ef3be46746b4b40a66cc4252070eb313cc6308bbee39a0a9fc38ef99137ead3c9b003584c0a1b8f5ca2ff8707');
    expect(tx.sigDigest).toBe('205c79e3d17211882b1a2ba8640ff208413d68cabdca892cf47e9a6ad46e63a1');
   });
});
