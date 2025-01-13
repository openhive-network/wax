import { expect } from '@playwright/test';

import { test } from '../assets/jest-helper';
import { protoVoteOp } from "../assets/data.proto-protocol";
import type { IWaxOptionsChain, WaxPrivateKeyLeakDetectedException } from '../../dist/bundle';

import type { IOnlineTransaction, operation, transfer } from '../../dist/bundle';

test.describe('Wax chain tests to cover Online Transaction flow', () => {
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

  test('Should be able to get authority trace for direct multi-sig from already existing transaction', async ({ waxTest }) => {

    const retVal = await waxTest(async({ wax }) => {
      /// warning: this tx is taken from mainnet - regular chainid must be used, so let's use default initialized chain object
      const chain = await wax.createHiveChain();

      /// tx from https://testexplore.openhive.network/transaction/a7efc7be69861fdcdc39712e532beb8ddc701f03
      const txJson = '{"ref_block_num":808,"ref_block_prefix":1359279161,"extensions":[],"expiration":"2024-08-02T12:09:03","operations":[{"type":"vote_operation","value":{"voter":"ecency","author":"el-panal","weight":100,"permlink":"el-panal-presentacion-de-autores-destacados-dia31072024"}},{"type":"vote_operation","value":{"voter":"ecency.stats","author":"el-panal","weight":100,"permlink":"el-panal-presentacion-de-autores-destacados-dia31072024"}},{"type":"vote_operation","value":{"voter":"esteem.app","author":"el-panal","weight":100,"permlink":"el-panal-presentacion-de-autores-destacados-dia31072024"}},{"type":"vote_operation","value":{"voter":"good-karma","author":"el-panal","weight":100,"permlink":"el-panal-presentacion-de-autores-destacados-dia31072024"}},{"type":"vote_operation","value":{"voter":"esteemapp","author":"el-panal","weight":100,"permlink":"el-panal-presentacion-de-autores-destacados-dia31072024"}}],"signatures":["1f4141e7645dd2bdcdb2001baea165e668a6f9c2a366f6fd2f3e9d878f071f5eb052509eb666b80c1e0daaa7fdec36e3de827087dcd3015c8672b536ddddbc5726","20223edff229382e67031d993c13d26062ab4d33c45ede7aced7f1e432d6b6d57a4fd68eae708f562a9644ee08ea447fa354febe34aa8ba14a434c66adc753774f","20286bd3b0ad2ecb01488ce866361b4fcd53b1f3dac41962496986fdf89c89c20a0e86f8dd2669ed14b6dafc3e0bb0d24ec54a794ee6c0b563275a22a122992ac1","2043b5ea9cbf76f1cd0fbb5f589350d9b8273d241c8bb704189bc9fd4444493c384594536e0387ff121bcdbfa4fa401917e30609ac86ea82f13132d26280e74f9a","205f0e25631bdbcd37669b2f6c36594d0153e468be8b2b6a57f8eae49538132efd0dde1ad6a707788d6a2024efd03a55dd0bb478a40eedce48f6e5db19d365bce5"]}';
      const sourceTx = chain.createTransactionFromJson(txJson);

      // Create online transaction
      const tx = await chain.createTransaction();
      const authTrace = await tx.generateAuthorityVerificationTrace(sourceTx);

      const authTraceStr = JSON.stringify(authTrace);
      console.log(`Authority trace: ${authTraceStr }`);

      return authTraceStr;
    });

    /// TODO improve comparison to avoid string form
    expect(retVal).toBe('{"rootEntry":{"processedEntry":"good-karma","processedRole":"posting","threshold":1,"weight":1,"recursionDepth":0,"processingStatus":{"entryAccepted":true,"isOpenAuthority":false},"visitedEntries":[{"processedEntry":"STM5dhkPS223F9d3TCXKttuWpdWgqS2Fx8KNRQve6BMGmAvJ5GnJR","processedRole":"posting","threshold":1,"weight":1,"recursionDepth":0,"processingStatus":{"entryAccepted":true,"isOpenAuthority":false},"visitedEntries":[]}]},"finalAuthorityPath":[{"processedEntry":"ecency","processedRole":"posting","threshold":1,"weight":1,"recursionDepth":0,"processingStatus":{"entryAccepted":true,"isOpenAuthority":false},"visitedEntries":[{"processedEntry":"STM8AZuk2ja5vSFySFL2zpB9bNew8wJAg8r4QFtbnoamEX8Jvvq43","processedRole":"posting","threshold":1,"weight":1,"recursionDepth":0,"processingStatus":{"entryAccepted":true,"isOpenAuthority":false},"visitedEntries":[]}]},{"processedEntry":"ecency.stats","processedRole":"posting","threshold":1,"weight":1,"recursionDepth":0,"processingStatus":{"entryAccepted":true,"isOpenAuthority":false},"visitedEntries":[{"processedEntry":"STM8jviUDRAefxmTQ9m8wNdiQV5dmCPSMDjSnztPYZpHf1yfaD6Rd","processedRole":"posting","threshold":1,"weight":1,"recursionDepth":0,"processingStatus":{"entryAccepted":true,"isOpenAuthority":false},"visitedEntries":[]}]},{"processedEntry":"esteem.app","processedRole":"posting","threshold":1,"weight":1,"recursionDepth":0,"processingStatus":{"entryAccepted":true,"isOpenAuthority":false},"visitedEntries":[{"processedEntry":"STM64Bb5TXsiEbjjLsgVrvVttEDsLNSot9p8zJd41D5zEr5opxcHK","processedRole":"posting","threshold":1,"weight":1,"recursionDepth":0,"processingStatus":{"entryAccepted":true,"isOpenAuthority":false},"visitedEntries":[]}]},{"processedEntry":"esteemapp","processedRole":"posting","threshold":1,"weight":1,"recursionDepth":0,"processingStatus":{"entryAccepted":true,"isOpenAuthority":false},"visitedEntries":[{"processedEntry":"STM7S3wsVtQotgKLN8wFLPNBALe6YHt8MPLEHuTH5CxfxdhpGPBUP","processedRole":"posting","threshold":1,"weight":1,"recursionDepth":0,"processingStatus":{"entryAccepted":true,"isOpenAuthority":false},"visitedEntries":[]}]},{"processedEntry":"good-karma","processedRole":"posting","threshold":1,"weight":1,"recursionDepth":0,"processingStatus":{"entryAccepted":true,"isOpenAuthority":false},"visitedEntries":[{"processedEntry":"STM5dhkPS223F9d3TCXKttuWpdWgqS2Fx8KNRQve6BMGmAvJ5GnJR","processedRole":"posting","threshold":1,"weight":1,"recursionDepth":0,"processingStatus":{"entryAccepted":true,"isOpenAuthority":false},"visitedEntries":[]}]}],"verificationStatus":{"entryAccepted":true,"isOpenAuthority":false}}');
   });


  test('Should be able to get authority trace for direct sign', async ({ waxTest, config }) => {
    /// similar tx to https://testexplore.openhive.network/transaction/da9602787693edccdafa1e7325502e0bb14453d1
    const retVal = await waxTest(async ({ beekeeper, wax }, mirrornetSkeletonKey: string, config: IWaxOptionsChain) => {

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
    }, mirrornetSkeletonKey, config!);

    /// TODO improve comparison to avoid string form
    expect(retVal).toBe('{"rootEntry":{"processedEntry":"splinterboost","processedRole":"active","threshold":1,"weight":1,"recursionDepth":0,"processingStatus":{"entryAccepted":true,"isOpenAuthority":false},"visitedEntries":[{"processedEntry":"STM6LLegbAgLAy28EHrffBVuANFWcFgmqRMW13wBmTExqFE9SCkg4","processedRole":"active","threshold":1,"weight":1,"recursionDepth":0,"processingStatus":{"entryAccepted":true,"isOpenAuthority":false},"visitedEntries":[]}]},"finalAuthorityPath":[{"processedEntry":"splinterboost","processedRole":"active","threshold":1,"weight":1,"recursionDepth":0,"processingStatus":{"entryAccepted":true,"isOpenAuthority":false},"visitedEntries":[{"processedEntry":"STM6LLegbAgLAy28EHrffBVuANFWcFgmqRMW13wBmTExqFE9SCkg4","processedRole":"active","threshold":1,"weight":1,"recursionDepth":0,"processingStatus":{"entryAccepted":true,"isOpenAuthority":false},"visitedEntries":[]}]}],"verificationStatus":{"entryAccepted":true,"isOpenAuthority":false}}');
   });

   test('Should be able to get authority trace for direct sign from already existing transaction', async ({ waxTest }) => {
    test.fail();
    const retVal = await waxTest(async({wax}) => {
      /// seems this case does not work.
      ///1. trace generator throws instead of producing a trace
      ///2. the transaction is valid, authority should be satisfied

      /// warning: this tx is taken from mainnet - regular chainid must be used, so let's use default initialized chain object
      const chain = await wax.createHiveChain();

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
    expect(retVal).toBe('{"rootEntry":{"processedEntry":"splinterboost","processedRole":"active","threshold":1,"weight":1,"recursionDepth":0,"processingStatus":{"entryAccepted":true,"isOpenAuthority":false},"visitedEntries":[]},"finalAuthorityPath":[{"processedEntry":"splinterboost","processedRole":"active","threshold":1,"weight":1,"recursionDepth":0,"processingStatus":{"entryAccepted":true,"isOpenAuthority":false},"visitedEntries":[]}],"verificationStatus":{"entryAccepted":true,"isOpenAuthority":false}}');
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
    const retVal = await waxTest(async({ beekeeper, wax }, protoVoteOp, mirrornetSkeletonKey, mirrornetSkeletonPublicKey, config) => {
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
    }, protoVoteOp, mirrornetSkeletonKey, mirrornetSkeletonPublicKey, config);

    expect(retVal.signerKey).toBe(retVal.expectedKey);
   });
});
