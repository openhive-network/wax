import { ChromiumBrowser, ConsoleMessage, chromium } from 'playwright';
import { expect } from '@playwright/test';

import { DEFAULT_STORAGE_ROOT } from "@hiveio/beekeeper/node";
import fs from "fs";

import { test } from '../assets/jest-helper';
import { protoVoteOp } from "../assets/data.proto-protocol";
import { WaxPrivateKeyLeakDetectedException } from '../../dist/bundle/index-full';

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

  const mirrornetSkeletonKey = '5JNHfZYKGaomSFvd4NUdQ9qMcEAC43kujbfjueTHpVapX1Kzq2n';
  const mirrornetSkeletonPublicKey = 'STM6LLegbAgLAy28EHrffBVuANFWcFgmqRMW13wBmTExqFE9SCkg4';

  test('Should catch private key leak using online transaction interface', async ({ waxTest, config }) => {
      const retVal = await waxTest(async({ beekeeper, wax }, mirrornetSkeletonKey) => {
        // Create wallet:
        const session = beekeeper.createSession("salt");
        const { wallet } = await session.createWallet("w0");
        const matchingPublicKey = await wallet.importKey(mirrornetSkeletonKey);

        console.log(`${matchingPublicKey}`);

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

      }, mirrornetSkeletonKey);
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
