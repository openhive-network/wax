import { ChromiumBrowser, ConsoleMessage, chromium } from 'playwright';
import { expect } from '@playwright/test';

import { DEFAULT_STORAGE_ROOT } from "@hiveio/beekeeper/node";
import fs from "fs";

import { test } from '../assets/jest-helper';
import { protoVoteOp } from "../assets/data.proto-protocol";
import { IWaxOptionsChain, WaxPrivateKeyLeakDetectedException } from '../../dist/bundle/index-full';

import { IOnlineTransaction, operation, transfer } from '../../dist/bundle/index-full';

let browser!: ChromiumBrowser;
test.describe('Wax chain tests to cover Online Transaction flow', () => {
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

  const txSecurityLeakBody = async ({ beekeeper, wax }, mirrornetSkeletonKey: string, config: IWaxOptionsChain, directBroadcast: boolean) => {
    // Create wallet:
    const session = beekeeper.createSession("salt");
    const { wallet } = await session.createWallet("w0");
    const matchingPublicKey = await wallet.importKey(mirrornetSkeletonKey);

    const myCustomChain = await wax.createHiveChain(config);

    // Create online transaction
    const tx: IOnlineTransaction = await myCustomChain.createTransaction();

    // Fill it with some operation
    const transferOp: transfer = {
      from_account: "otom",
      to_account: "otom",
      amount: myCustomChain.hiveCoins(1),
      memo: `${mirrornetSkeletonKey}`
    };

    const op: operation = { transfer: transferOp };
    tx.pushOperation(op);

    try {
      if(directBroadcast)
        await myCustomChain.broadcast(tx);
      else
        await tx.performOnChainVerification();
    }
    catch(e) {
      const error: object = e as object;

      if (e instanceof wax.WaxPrivateKeyLeakDetectedException) {
        const caughtError: WaxPrivateKeyLeakDetectedException = error as WaxPrivateKeyLeakDetectedException;

        return {
          detectedLeakError: {
            account: caughtError.account,
            authorityRole: caughtError.authorityRole,
            matchingPublicKey: caughtError.matchingPublicKey,
            message: caughtError.message
          }
        };
      } else
        throw new Error("Invalid error instance");
    }

    tx.sign(wallet, matchingPublicKey);

    throw new Error("No error detected");
  };

  const mirrornetSkeletonKey = '5JNHfZYKGaomSFvd4NUdQ9qMcEAC43kujbfjueTHpVapX1Kzq2n';
  const mirrornetSkeletonPublicKey = 'STM6LLegbAgLAy28EHrffBVuANFWcFgmqRMW13wBmTExqFE9SCkg4';

  test('Should be able to get authority trace for direct sign', async ({ waxTest, config }) => {
    /// similar tx to https://testexplore.openhive.network/transaction/da9602787693edccdafa1e7325502e0bb14453d1
    const retVal = await waxTest(async({ beekeeper, wax }, mirrornetSkeletonKey: string) => {

      const session = beekeeper.createSession("salt");
      const { wallet } = await session.createWallet("w0");
      const matchingPublicKey = await wallet.importKey(mirrornetSkeletonKey);

      const myCustomChain = await wax.createHiveChain(config);

      // Create online transaction
      const tx: IOnlineTransaction = await myCustomChain.createTransaction();

      // Fill it with some operation
      const transferOp: transfer = {
        from_account: "splinterboost",
        to_account: "bluehy20",
        amount: myCustomChain.hiveSatoshis(14),
        memo: 'Thank you for delegating to Splinterboost here is your daily HIVE payout!'
      };

      const op: operation = { transfer: transferOp };
      tx.pushOperation(op);
      tx.sign(wallet, matchingPublicKey);

      const authTrace = await tx.generateAuthorityVerificationTrace();

      const authTraceStr = JSON.stringify(authTrace);
      console.log(`Authority trace: ${authTraceStr }`);

      return authTraceStr;
    }, mirrornetSkeletonKey);

    /// TODO improve comparison to avoid string form
    expect(retVal).toBe('{"rootEntry":{"processedEntry":"splinterboost","processedRole":"active","threshold":1,"weight":0,"recursionDepth":0,"processingStatus":{"entryAccepted":true,"isOpenAuthority":false},"visitedEntries":[]},"finalAuthorityPath":[{"processedEntry":"splinterboost","processedRole":"active","threshold":1,"weight":0,"recursionDepth":0,"processingStatus":{"entryAccepted":true,"isOpenAuthority":false},"visitedEntries":[]}],"verificationStatus":{"entryAccepted":true,"isOpenAuthority":false}}');
   });

   test('Should be able to get authority trace for direct sign from already existing transaction', async ({ waxTest }) => {
    const retVal = await waxTest(async({ chain }) => {
      /// seems this case does not work.
      ///1. trace generator throws instead of producing a trace
      ///2. the transaction is valid, authority should be satisfied
      test.fail();

      /// tx from https://testexplore.openhive.network/transaction/da9602787693edccdafa1e7325502e0bb14453d1
      const txJson = '{"ref_block_num":33561,"ref_block_prefix":2922397352,"extensions":[],"expiration":"2024-09-20T12:16:45","operations":[{"type":"transfer_operation","value":{"to":"bluehy20","from":"splinterboost","memo":"Thank you for delegating to Splinterboost here is your daily HIVE payout!","amount":{"nai":"@@000000021","amount":"14","precision":3}}}],"signatures":["203eed491a1e032bc889b030861a80bf3f0bc8ba7fa30843041825c4f542411fb3678fd527c598dcc6646a5dabf2110691a4d6355c72d7638ffdaa11ac10451d07"]}';
      const sourceTx = chain.createTransactionFromJson(txJson);

      // Create online transaction
      const tx = await chain.createTransaction();
      const authTrace = await tx.generateAuthorityVerificationTrace(sourceTx);

      const authTraceStr = JSON.stringify(authTrace);
      console.log(`Authority trace: ${authTraceStr }`);

      return authTraceStr;
    });

    /// TODO improve comparison to avoid string form
    expect(retVal).toBe('{"rootEntry":{"processedEntry":"splinterboost","processedRole":"active","threshold":1,"weight":0,"recursionDepth":0,"processingStatus":{"entryAccepted":true,"isOpenAuthority":false},"visitedEntries":[]},"finalAuthorityPath":[{"processedEntry":"splinterboost","processedRole":"active","threshold":1,"weight":0,"recursionDepth":0,"processingStatus":{"entryAccepted":true,"isOpenAuthority":false},"visitedEntries":[]}],"verificationStatus":{"entryAccepted":true,"isOpenAuthority":false}}');
   });


  test('Should catch private key leak using online transaction interface during explicit online validation', async ({ waxTest, config }) => {
      const retVal = await waxTest(txSecurityLeakBody, mirrornetSkeletonKey, config!, false);
    expect(retVal.detectedLeakError).toStrictEqual({
      account: "otom",
      authorityRole: "owner",
      matchingPublicKey: mirrornetSkeletonPublicKey,
      message: "Detected private key leak."
    });
  });

  test('Should catch private key leak using online transaction interface during direct broadcast', async ({ waxTest, config }) => {
    const retVal = await waxTest(txSecurityLeakBody, mirrornetSkeletonKey, config!, true);
  expect(retVal.detectedLeakError).toStrictEqual({
    account: "otom",
    authorityRole: "owner",
    matchingPublicKey: mirrornetSkeletonPublicKey,
    message: "Detected private key leak."
  });
});

  test('Should be able to create and sign transaction using online transaction interface', async ({ waxTest, config }) => {
    const retVal = await waxTest(async({ beekeeper, wax }, protoVoteOp, mirrornetSkeletonKey, mirrornetSkeletonPublicKey) => {
      // Create wallet:
      const session = beekeeper.createSession("salt");
      const { wallet } = await session.createWallet("w0");
      const matchingPublicKey = await wallet.importKey(mirrornetSkeletonKey);

      console.log(`${matchingPublicKey}`);

      const myCustomChain = await wax.createHiveChain(config);

      // Create online transaction
      const tx: IOnlineTransaction = await myCustomChain.createTransaction();

      // Fill it with some operation
      tx.pushOperation(protoVoteOp).validate();

      await tx.performOnChainVerification();

      tx.sign(wallet, matchingPublicKey);

      return {
        signerKey: tx.signatureKeys[0],
        expectedKey: mirrornetSkeletonPublicKey
      };
    }, protoVoteOp, mirrornetSkeletonKey, mirrornetSkeletonPublicKey);

    
    expect(retVal.signerKey).toBe(retVal.expectedKey);
   });
   
  test.afterAll(async () => {
    await browser.close();
  });
});
