import { ChromiumBrowser, ConsoleMessage, chromium } from 'playwright';
import { expect } from '@playwright/test';

import { DEFAULT_STORAGE_ROOT } from "@hive/beekeeper/node";
import fs from "fs";

import { testChain as test } from '../assets/jest-helper';
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

    await page.goto("http://localhost:8080/wasm/__tests__/assets/test-chain.html", { waitUntil: "load" });
  });

  test('Should be able to convert API asset to the proper HIVE asset data', async ({ dual }) => {
    const retVal = await dual(async(naiAsset) => {
      const asset = wx.getAsset(naiAsset);

      return asset;
    }, naiAsset);

    expect(retVal).toStrictEqual({
      amount: "300.000",
      symbol: "HIVE"
    });
  });

  test('Should be able to convert API asset to the proper custom asset data', async ({ dual }) => {
    const retVal = await dual(async() => {
      const asset = wx.getAsset({
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

  test('Should be able to bidirectional convert api to proto using object interface', async ({ dual }) => {
    const retVal = await dual(async(transaction) => {
      const tx = wx.TransactionBuilder.fromApi(transaction);

      return tx.toApi();
    }, transaction);

    expect(retVal).toBe(transaction);
  });

  test('Should be able to create and sign transaction using object interface', async ({ dual }) => {
    const retVal = await dual(async(protoVoteOp) => {
      // Create wallet:
      const session = bk.createSession("salt");
      const { wallet } = await session.createWallet("w0");
      await wallet.importKey('5JkFnXrLM2ap9t3AmAxBJvQHF7xSKtnTrCTginQCkhzU5S7ecPT');

      // Create transaction
      const tx = new wx.TransactionBuilder("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

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

  test.afterAll(async () => {
    await browser.close();
  });
});
