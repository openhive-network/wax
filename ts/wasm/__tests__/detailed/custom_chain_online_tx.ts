import { expect } from '@playwright/test';

import { test } from '../assets/jest-helper';
import type { IWaxGlobals } from '../assets/globals';
import { protoVoteOp } from "../assets/data.proto-protocol";
import type { IOnlineTransaction, IOnlineSignatureProvider, operation, transfer, IWaxOptionsChain, WaxPrivateKeyLeakDetectedException, IHiveChainInterface, ApiAccount } from '../../dist/bundle';

test.describe('Wax chain tests to cover Online Transaction flow', () => {
  const txSecurityLeakBody = async ({ beekeeper, wax, createSigner }: { beekeeper: IWaxGlobals["beekeeper"]; wax: IWaxGlobals["wax"]; createSigner: IWaxGlobals["createSigner"] }, mirrornetSkeletonKey: string, config: IWaxOptionsChain, directBroadcast: boolean) => {
    // Create wallet:
    const session = beekeeper.createSession("salt");
    const { wallet } = await session.createWallet("w0");
    const matchingPublicKey = await wallet.importKey(mirrornetSkeletonKey);

    const myCustomChain = await wax.createHiveChain(config);

    // Create online transaction
    const tx: IOnlineTransaction = await myCustomChain.createTransaction();

    // Fill it with some operation
    const transferOp: transfer = {
      from: "otom",
      to: "otom",
      amount: myCustomChain.hiveCoins(1),
      memo: `${mirrornetSkeletonKey}`
    };

    const op: operation = { transfer_operation: transferOp };
    tx.pushOperation(op);

    try {
      if (directBroadcast)
        await myCustomChain.broadcast(tx);
      else
        await tx.performOnChainVerification();
    }
    catch (e) {
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

    const signer = createSigner(myCustomChain, wallet, matchingPublicKey);
    await signer.signTransaction(tx);

    throw new Error("No error detected");
  };

  const mirrornetSkeletonKey = '5JNHfZYKGaomSFvd4NUdQ9qMcEAC43kujbfjueTHpVapX1Kzq2n';
  const mirrornetSkeletonPublicKey = 'STM6LLegbAgLAy28EHrffBVuANFWcFgmqRMW13wBmTExqFE9SCkg4';
  const authtracetst1OwnerPublicKey = 'STM8GC13uCZbP44HzMLV6zPZGwVQ8Nt4Kji8PapsPiNq1BK153XTX';

  /**
   * Self-contained preconfiguration function that creates test accounts on demand.
   *
   * Authority graph created:
   *
   *   authtracetst1  active  (threshold = 2)
   *     +-- account_auth: authtracetst2  weight 1  -->  active  (threshold = 1)
   *     |     +-- key_auth: STM6LLeg...  weight 1   ** matches signature **
   *     +-- account_auth: authtracetst3  weight 1  -->  active  (threshold = 1)
   *           +-- account_auth: authtracetst1  weight 1   ** CYCLE **
   *
   *   Accumulated weight = 1 < threshold 2  -->  INSUFFICIENT WEIGHT
   *   Owner fallback also fails (different key).
   *
   * All parameters are passed explicitly (no closures) for web context serialization.
   * 
   * See ts/wasm/__tests__/assets/authority_trace_test_accounts.md for more details.
   */
  const ensureTestAccountsExist = async (
    chain: IHiveChainInterface,
    signer: IOnlineSignatureProvider,
    skeletonPublicKey: string,
    ownerPublicKey: string
  ) => {
    const accountNames = ['authtracetst1', 'authtracetst2', 'authtracetst3'];
    const { accounts } = await chain.api.database_api.find_accounts({
      accounts: accountNames,
      delayed_votes_active: true
    });

    const existingNames = new Set(accounts.map((a: any) => a.name));

    if (existingNames.size === 3) {
      console.log('All test accounts already exist - assuming correct authority structure');
      return;
    }

    console.log('Creating test accounts (' + existingNames.size + '/3 exist)...');

    const { median_props: { account_creation_fee } } =
      await chain.api.database_api.get_witness_schedule({});

    const accountCreator = 'xbtsio';

    // Step 1: Create authtracetst2 — holds the signing key, no account_auth dependencies
    if (!existingNames.has('authtracetst2')) {
      const tx = await chain.createTransaction();
      tx.pushOperation({
        account_create_operation: {
          fee: account_creation_fee,
          creator: accountCreator,
          new_account_name: 'authtracetst2',
          owner:   { weight_threshold: 1, account_auths: {}, key_auths: { [skeletonPublicKey]: 1 } },
          active:  { weight_threshold: 1, account_auths: {}, key_auths: { [skeletonPublicKey]: 1 } },
          posting: { weight_threshold: 1, account_auths: {}, key_auths: { [skeletonPublicKey]: 1 } },
          memo_key: skeletonPublicKey,
          json_metadata: '{}'
        }
      });
      await signer.signTransaction(tx);
      await chain.broadcast(tx);
      console.log('Created account: authtracetst2');
    }

    // Step 2: Create authtracetst3 — initially with simple key-based auth (cycle added in step 4)
    if (!existingNames.has('authtracetst3')) {
      const tx = await chain.createTransaction();
      tx.pushOperation({
        account_create_operation: {
          fee: account_creation_fee,
          creator: accountCreator,
          new_account_name: 'authtracetst3',
          owner:   { weight_threshold: 1, account_auths: {}, key_auths: { [skeletonPublicKey]: 1 } },
          active:  { weight_threshold: 1, account_auths: {}, key_auths: { [skeletonPublicKey]: 1 } },
          posting: { weight_threshold: 1, account_auths: {}, key_auths: { [skeletonPublicKey]: 1 } },
          memo_key: skeletonPublicKey,
          json_metadata: '{}'
        }
      });
      await signer.signTransaction(tx);
      await chain.broadcast(tx);
      console.log('Created account: authtracetst3');
    }

    // Step 3: Create authtracetst1 — active delegates to authtracetst2 + authtracetst3, owner uses a different key
    if (!existingNames.has('authtracetst1')) {
      const tx = await chain.createTransaction();
      tx.pushOperation({
        account_create_operation: {
          fee: account_creation_fee,
          creator: accountCreator,
          new_account_name: 'authtracetst1',
          owner:   { weight_threshold: 1, account_auths: {}, key_auths: { [ownerPublicKey]: 1 } },
          active:  { weight_threshold: 2, account_auths: { 'authtracetst2': 1, 'authtracetst3': 1 }, key_auths: {} },
          posting: { weight_threshold: 1, account_auths: {}, key_auths: { [skeletonPublicKey]: 1 } },
          memo_key: skeletonPublicKey,
          json_metadata: '{}'
        }
      });
      await signer.signTransaction(tx);
      await chain.broadcast(tx);
      console.log('Created account: authtracetst1');
    }

    // Step 4: Update authtracetst3 active authority to create the cycle back to authtracetst1
    const { accounts: refreshed } = await chain.api.database_api.find_accounts({
      accounts: ['authtracetst3'],
      delayed_votes_active: true
    });
    const acct3: ApiAccount = refreshed[0];
    const needsUpdate = !acct3.active.account_auths.some(
      (entry) => entry[0] === 'authtracetst1'
    );

    if (needsUpdate) {
      const tx = await chain.createTransaction();
      tx.pushOperation({
        account_update_operation: {
          account: 'authtracetst3',
          active:  { weight_threshold: 1, account_auths: { 'authtracetst1': 1 }, key_auths: {} },
          posting: { weight_threshold: 1, account_auths: {}, key_auths: { [skeletonPublicKey]: 1 } },
          memo_key: skeletonPublicKey,
          json_metadata: '{}'
        }
      });
      await signer.signTransaction(tx);
      await chain.broadcast(tx);
      console.log('Updated authtracetst3 active authority: cycle to authtracetst1');
    }
  };

  type TEnsureTestAccountsExistFn = typeof ensureTestAccountsExist;

  test('Should be able to get authority trace for direct multi-sig from already existing transaction', async ({ waxTest }) => {
    const retVal = await waxTest(async({ wax }) => {
      /// warning: this tx is taken from mainnet - regular chainid must be used, so let's use default initialized chain object
      const chain = await wax.createHiveChain();

      /// tx from https://testexplore.openhive.network/transaction/a7efc7be69861fdcdc39712e532beb8ddc701f03
      const txJson = '{"ref_block_num":808,"ref_block_prefix":1359279161,"extensions":[],"expiration":"2024-08-02T12:09:03","operations":[{"type":"vote_operation","value":{"voter":"ecency","author":"el-panal","weight":100,"permlink":"el-panal-presentacion-de-autores-destacados-dia31072024"}},{"type":"vote_operation","value":{"voter":"ecency.stats","author":"el-panal","weight":100,"permlink":"el-panal-presentacion-de-autores-destacados-dia31072024"}},{"type":"vote_operation","value":{"voter":"esteem.app","author":"el-panal","weight":100,"permlink":"el-panal-presentacion-de-autores-destacados-dia31072024"}},{"type":"vote_operation","value":{"voter":"good-karma","author":"el-panal","weight":100,"permlink":"el-panal-presentacion-de-autores-destacados-dia31072024"}},{"type":"vote_operation","value":{"voter":"esteemapp","author":"el-panal","weight":100,"permlink":"el-panal-presentacion-de-autores-destacados-dia31072024"}}],"signatures":["1f4141e7645dd2bdcdb2001baea165e668a6f9c2a366f6fd2f3e9d878f071f5eb052509eb666b80c1e0daaa7fdec36e3de827087dcd3015c8672b536ddddbc5726","20223edff229382e67031d993c13d26062ab4d33c45ede7aced7f1e432d6b6d57a4fd68eae708f562a9644ee08ea447fa354febe34aa8ba14a434c66adc753774f","20286bd3b0ad2ecb01488ce866361b4fcd53b1f3dac41962496986fdf89c89c20a0e86f8dd2669ed14b6dafc3e0bb0d24ec54a794ee6c0b563275a22a122992ac1","2043b5ea9cbf76f1cd0fbb5f589350d9b8273d241c8bb704189bc9fd4444493c384594536e0387ff121bcdbfa4fa401917e30609ac86ea82f13132d26280e74f9a","205f0e25631bdbcd37669b2f6c36594d0153e468be8b2b6a57f8eae49538132efd0dde1ad6a707788d6a2024efd03a55dd0bb478a40eedce48f6e5db19d365bce5"]}';
      const sourceTx = chain.createTransactionFromJson(txJson);

      // Create online transaction
      const tx = await chain.createTransaction();
      const authTrace = await tx.generateAuthorityVerificationTrace(undefined, sourceTx);

      const authTraceStr = JSON.stringify(authTrace);
      console.log(`Authority trace: ${authTraceStr }`);

      return authTrace.collectedData;
    });

    expect(retVal).toStrictEqual([
      {
        "finalAuthorityPath": {
          "processedEntry": "ecency",
          "processedRole": "posting",
          "processingStatus": {
            "entryAccepted": true,
            "isOpenAuthority": false,
          },
          "recursionDepth": 0,
          "threshold": 1,
          "visitedEntries": [
            {
              "processedEntry": "STM8AZuk2ja5vSFySFL2zpB9bNew8wJAg8r4QFtbnoamEX8Jvvq43",
              "processedRole": "posting",
              "processingStatus": {
                "entryAccepted": true,
                "isOpenAuthority": false,
              },
              "recursionDepth": 0,
              "threshold": 1,
              "visitedEntries": [],
              "weight": 1,
            },
          ],
          "weight": 1,
        },
        "matchingSignatures": [{
          "signature": "205f0e25631bdbcd37669b2f6c36594d0153e468be8b2b6a57f8eae49538132efd0dde1ad6a707788d6a2024efd03a55dd0bb478a40eedce48f6e5db19d365bce5",
          "signatureKey": "STM8AZuk2ja5vSFySFL2zpB9bNew8wJAg8r4QFtbnoamEX8Jvvq43",
        }],
      },
      {
        "finalAuthorityPath": {
          "processedEntry": "ecency.stats",
          "processedRole": "posting",
          "processingStatus": {
            "entryAccepted": true,
            "isOpenAuthority": false,
          },
          "recursionDepth": 0,
          "threshold": 1,
          "visitedEntries": [
            {
              "processedEntry": "STM8jviUDRAefxmTQ9m8wNdiQV5dmCPSMDjSnztPYZpHf1yfaD6Rd",
              "processedRole": "posting",
              "processingStatus": {
                "entryAccepted": true,
                "isOpenAuthority": false,
              },
              "recursionDepth": 0,
              "threshold": 1,
              "visitedEntries": [],
              "weight": 1,
            },
          ],
          "weight": 1,
        },
        "matchingSignatures": [{
          "signature": "20223edff229382e67031d993c13d26062ab4d33c45ede7aced7f1e432d6b6d57a4fd68eae708f562a9644ee08ea447fa354febe34aa8ba14a434c66adc753774f",
          "signatureKey": "STM8jviUDRAefxmTQ9m8wNdiQV5dmCPSMDjSnztPYZpHf1yfaD6Rd",
        }],
      },
      {
        "finalAuthorityPath": {
          "processedEntry": "esteem.app",
          "processedRole": "posting",
          "processingStatus": {
            "entryAccepted": true,
            "isOpenAuthority": false,
          },
          "recursionDepth": 0,
          "threshold": 1,
          "visitedEntries": [
            {
              "processedEntry": "STM64Bb5TXsiEbjjLsgVrvVttEDsLNSot9p8zJd41D5zEr5opxcHK",
              "processedRole": "posting",
              "processingStatus": {
                "entryAccepted": true,
                "isOpenAuthority": false,
              },
              "recursionDepth": 0,
              "threshold": 1,
              "visitedEntries": [],
              "weight": 1,
            },
          ],
          "weight": 1,
        },
        "matchingSignatures": [{
          "signature": "20286bd3b0ad2ecb01488ce866361b4fcd53b1f3dac41962496986fdf89c89c20a0e86f8dd2669ed14b6dafc3e0bb0d24ec54a794ee6c0b563275a22a122992ac1",
          "signatureKey": "STM64Bb5TXsiEbjjLsgVrvVttEDsLNSot9p8zJd41D5zEr5opxcHK",
        }],
      },
      {
        "finalAuthorityPath": {
          "processedEntry": "esteemapp",
          "processedRole": "posting",
          "processingStatus": {
            "entryAccepted": true,
            "isOpenAuthority": false,
          },
          "recursionDepth": 0,
          "threshold": 1,
          "visitedEntries": [
            {
              "processedEntry": "STM7S3wsVtQotgKLN8wFLPNBALe6YHt8MPLEHuTH5CxfxdhpGPBUP",
              "processedRole": "posting",
              "processingStatus": {
                "entryAccepted": true,
                "isOpenAuthority": false,
              },
              "recursionDepth": 0,
              "threshold": 1,
              "visitedEntries": [],
              "weight": 1,
            },
          ],
          "weight": 1,
        },
        "matchingSignatures": [{
          "signature": "1f4141e7645dd2bdcdb2001baea165e668a6f9c2a366f6fd2f3e9d878f071f5eb052509eb666b80c1e0daaa7fdec36e3de827087dcd3015c8672b536ddddbc5726",
          "signatureKey": "STM7S3wsVtQotgKLN8wFLPNBALe6YHt8MPLEHuTH5CxfxdhpGPBUP",
        }],
      },
      {
        "finalAuthorityPath": {
          "processedEntry": "good-karma",
          "processedRole": "posting",
          "processingStatus": {
            "entryAccepted": true,
            "isOpenAuthority": false
          },
          "recursionDepth": 0,
          "threshold": 1,
          "visitedEntries": [
            {
              "processedEntry": "STM5dhkPS223F9d3TCXKttuWpdWgqS2Fx8KNRQve6BMGmAvJ5GnJR",
              "processedRole": "posting",
              "processingStatus": {
                "entryAccepted": true,
                "isOpenAuthority": false
              },
              "recursionDepth": 0,
              "threshold": 1,
              "visitedEntries": [],
              "weight": 1
            }
          ],
          "weight": 1
        },
        "matchingSignatures": [{
          "signature": "2043b5ea9cbf76f1cd0fbb5f589350d9b8273d241c8bb704189bc9fd4444493c384594536e0387ff121bcdbfa4fa401917e30609ac86ea82f13132d26280e74f9a",
          "signatureKey": "STM5dhkPS223F9d3TCXKttuWpdWgqS2Fx8KNRQve6BMGmAvJ5GnJR"
        }]
      }
    ]);
  });


  test('Should be able to get authority trace for direct sign', async ({ waxTest, config }) => {
    /// similar tx to https://testexplore.openhive.network/transaction/da9602787693edccdafa1e7325502e0bb14453d1
    const retVal = await waxTest(async ({ beekeeper, wax, createSigner }, mirrornetSkeletonKey: string, config: IWaxOptionsChain) => {

      const session = beekeeper.createSession("salt");
      const { wallet } = await session.createWallet("w0");
      const matchingPublicKey = await wallet.importKey(mirrornetSkeletonKey);

      const myCustomChain = await wax.createHiveChain(config);

      // Create online transaction
      const tx: IOnlineTransaction = await myCustomChain.createTransaction();

      // Fill it with some operation
      const transferOp: transfer = {
        from: "splinterboost",
        to: "bluehy20",
        amount: myCustomChain.hiveSatoshis(14),
        memo: 'Thank you for delegating to Splinterboost here is your daily HIVE payout!'
      };

      const op: operation = { transfer_operation: transferOp };
      tx.pushOperation(op);
      const signer = createSigner(myCustomChain, wallet, matchingPublicKey);
      await signer.signTransaction(tx);

      const authTrace = await tx.generateAuthorityVerificationTrace();

      authTrace.collectedData[0].matchingSignatures[0].signature = 'fakeSignature'; // The signature changes every time so we need to fake it.

      const authTraceStr = JSON.stringify(authTrace);
      console.log(`Authority trace: ${authTraceStr }`);

      return authTrace.collectedData;
    }, mirrornetSkeletonKey, config!);

    expect(retVal).toStrictEqual([
      {
        "finalAuthorityPath": {
          "processedEntry": "splinterboost",
          "processedRole": "active",
          "processingStatus": {
            "entryAccepted": true,
            "isOpenAuthority": false
          },
          "recursionDepth": 0,
          "threshold": 1,
          "visitedEntries": [
            {
              "processedEntry": "STM6LLegbAgLAy28EHrffBVuANFWcFgmqRMW13wBmTExqFE9SCkg4",
              "processedRole": "active",
              "processingStatus": {
                "entryAccepted": true,
                "isOpenAuthority": false
              },
              "recursionDepth": 0,
              "threshold": 1,
              "visitedEntries": [],
              "weight": 1
            }
          ],
          "weight": 1
        },
        "matchingSignatures": [{
          "signature": "fakeSignature",
          "signatureKey": "STM6LLegbAgLAy28EHrffBVuANFWcFgmqRMW13wBmTExqFE9SCkg4"
        }]
      }
    ]);
  });

   test('Should be able to get authority trace for direct sign from already existing transaction', async ({ waxTest }) => {
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
      const authTrace = await tx.generateAuthorityVerificationTrace(true, sourceTx);

      const authTraceStr = JSON.stringify(authTrace);
      console.log(`Authority trace: ${authTraceStr }`);

      return authTrace.collectedData;
    });

    expect(retVal).toStrictEqual([
      {
        "finalAuthorityPath": {
          "processedEntry": "splinterboost",
          "processedRole": "active",
          "processingStatus": {
            "entryAccepted": true,
            "isOpenAuthority": false
          },
          "recursionDepth": 0,
          "threshold": 1,
          "visitedEntries": [
            {
              "processedEntry": "STM7jDAdjyLYgqhyCwSafVzNGN4PLBGWrYB9uJun4AitZA8TERgif",
              "processedRole": "active",
              "processingStatus": {
                "entryAccepted": true,
                "isOpenAuthority": false
              },
              "recursionDepth": 0,
              "threshold": 1,
              "visitedEntries": [],
              "weight": 1
            }
          ],
          "weight": 1
        },
        "matchingSignatures": [{
          "signature": "203eed491a1e032bc889b030861a80bf3f0bc8ba7fa30843041825c4f542411fb3678fd527c598dcc6646a5dabf2110691a4d6355c72d7638ffdaa11ac10451d07",
          "signatureKey": "STM7jDAdjyLYgqhyCwSafVzNGN4PLBGWrYB9uJun4AitZA8TERgif"
        }]
      }
    ]);
  });

  test('Should be able to get authority trace for delegated sign', async ({ waxTest }) => {
    const retVal = await waxTest(async({ wax }) => {
      const chain = await wax.createHiveChain();

      const sourceTx = chain.createTransactionFromJson({
        "ref_block_num": 31682,
        "ref_block_prefix": 1691585842,
        "extensions": [],
        "expiration": "2024-10-01T20:10:59",
        "operations": [
          {
            "type": "vote_operation",
            "value": {
              "voter": "tattooworld",
              "author": "mamaemigrante",
              "weight": 10000,
              "permlink": "buscando-ollas-nuevas-para-mi-cocina-looking-for-new-pots-and-pans-for-my-kitchen"
            }
          }
        ],
        "signatures": [
          "20543c6e9e5ea2acfb94e9c5cd6672f302d067b62a4c71832dcaec7caf5e83a83b45ae76c55e3f51f8eb254b460a0585e7f911a93d6e5a58522429b7a4678dc22e"
        ]
      });

      const tx = await chain.createTransaction();

      const trace = await tx.generateAuthorityVerificationTrace(false, sourceTx);

      return trace.collectedData;
    });

    expect(retVal).toStrictEqual([
      {
        "finalAuthorityPath": {
          "processedEntry": "tattooworld",
          "processedRole": "posting",
          "processingStatus": {
            "entryAccepted": true,
            "isOpenAuthority": false
          },
          "recursionDepth": 0,
          "threshold": 1,
          "visitedEntries": [
            {
              "processedEntry": "leofinance",
              "processedRole": "posting",
              "processingStatus": {
                "entryAccepted": true,
                "isOpenAuthority": false
              },
              "recursionDepth": 1,
              "threshold": 1,
              "visitedEntries": [
                {
                  "processedEntry": "steemauto",
                  "processedRole": "posting",
                  "processingStatus": {
                    "entryAccepted": true,
                    "isOpenAuthority": false
                  },
                  "recursionDepth": 2,
                  "threshold": 1,
                  "visitedEntries": [
                    {
                      "processedEntry": "STM8WWUYHMdHLgEHidYCztswzfZCViA16EqGkAxt7RG4dWwDpFtCF",
                      "processedRole": "posting",
                      "processingStatus": {
                        "entryAccepted": true,
                        "isOpenAuthority": false
                      },
                      "recursionDepth": 2,
                      "threshold": 1,
                      "visitedEntries": [],
                      "weight": 1
                    }
                  ],
                  "weight": 1
                }
              ],
              "weight": 1
            }
          ],
          "weight": 1
        },
        "matchingSignatures": [{
          "signature": "20543c6e9e5ea2acfb94e9c5cd6672f302d067b62a4c71832dcaec7caf5e83a83b45ae76c55e3f51f8eb254b460a0585e7f911a93d6e5a58522429b7a4678dc22e",
          "signatureKey": "STM8WWUYHMdHLgEHidYCztswzfZCViA16EqGkAxt7RG4dWwDpFtCF"
        }]
      }
    ]);
  });

  test('Should be able to get authority trace for delegated sign with single nest level', async ({ waxTest }) => {
    const retVal = await waxTest(async({ wax }) => {
      const chain = await wax.createHiveChain();

      const sourceTx = chain.createTransactionFromJson({
        "ref_block_num": 59824,
        "ref_block_prefix": 3761625792,
        "extensions": [],
        "expiration": "2024-12-12T12:30:00",
        "operations": [
          {
            "type": "vote_operation",
            "value": {
              "voter": "sunnyvo",
              "author": "franciscomarval",
              "weight": 475,
              "permlink": "alegoria-sirenida-mermaid-allegory"
            }
          }
        ],
        "signatures": [
          "20282d87e22cad745d263ee43fe8552044ecb68ebd274a03421d6e59aaaa891d5a594808c58605828c240b9e498f53d32a8f4f7baec5bfcbc7d391af4e4283366e"
        ]
      });

      const tx = await chain.createTransaction();

      const trace = await tx.generateAuthorityVerificationTrace(false, sourceTx);

      return trace.collectedData;
    });

    expect(retVal).toStrictEqual([
      {
        "finalAuthorityPath":       {
          "processedEntry": "sunnyvo",
          "processedRole": "posting",
          "processingStatus": {
            "entryAccepted": true,
            "isOpenAuthority": false
          },
          "recursionDepth": 0,
          "threshold": 1,
          "visitedEntries": [
            {
              "processedEntry": "steemauto",
              "processedRole": "posting",
              "processingStatus": {
                "entryAccepted": true,
                "isOpenAuthority": false
              },
              "recursionDepth": 1,
              "threshold": 1,
              "visitedEntries": [
                {
                  "processedEntry": "STM8WWUYHMdHLgEHidYCztswzfZCViA16EqGkAxt7RG4dWwDpFtCF",
                  "processedRole": "posting",
                  "processingStatus": {
                    "entryAccepted": true,
                    "isOpenAuthority": false
                  },
                  "recursionDepth": 1,
                  "threshold": 1,
                  "visitedEntries": [],
                  "weight": 1
                }
              ],
              "weight": 1
            }
          ],
          "weight": 1
        },
        "matchingSignatures": [{
          "signature": "20282d87e22cad745d263ee43fe8552044ecb68ebd274a03421d6e59aaaa891d5a594808c58605828c240b9e498f53d32a8f4f7baec5bfcbc7d391af4e4283366e",
          "signatureKey": "STM8WWUYHMdHLgEHidYCztswzfZCViA16EqGkAxt7RG4dWwDpFtCF"
        }]
      }
    ]);
  });

  test('Should be able to get authority trace for open authority transaction', async ({ waxTest }) => {
    // The authority trace is not generated correctly for open authority transactions.
    const retVal = await waxTest(async({ wax }) => {
      const chain = await wax.createHiveChain();

      const sourceTx = chain.createTransactionFromJson({
        "ref_block_num": 35292,
        "ref_block_prefix": 2546881088,
        "extensions": [],
        "expiration": "2024-07-27T20:43:36",
        "operations": [
          {
            "type": "comment_operation",
            "value": {
              "body": "With no response, we have no recourse but to release the source code to exploit this will be publicly released on Sunday July 28, 2024.",
              "title": "",
              "author": "temp",
              "permlink": "37",
              "json_metadata": "",
              "parent_author": "hive-engine",
              "parent_permlink": "market-smart-contract-23"
            }
          }
        ],
        "signatures": []
      });

      const tx = await chain.createTransaction();

      const trace = await tx.generateAuthorityVerificationTrace(false, sourceTx);

      console.log(JSON.stringify(trace));

      return trace.collectedData;
    });

    expect(retVal).toStrictEqual([
      {
        "finalAuthorityPath":{
          "processedEntry":"temp",
          "processedRole":"posting",
          "threshold":0,
          "weight":0,
          "recursionDepth":0,
          "processingStatus":{
            "entryAccepted": true,
            "isOpenAuthority": true
          },
          "visitedEntries":[]
        },
        "matchingSignatures": []
      }
    ]);
  });

  test('Should be able to get authority trace for insufficient weight transaction', async ({ waxTest, config }) => {
    /// See ts/wasm/__tests__/assets/authority_trace_test_accounts.md for more details.
    const retVal = await waxTest(
      async ({ beekeeper, wax, createSigner },
      ensureTestAccountsExist: TEnsureTestAccountsExistFn,
      skeletonKey: string,
      skeletonPublicKey: string,
      ownerPublicKey: string,
      chainConfig: IWaxOptionsChain
    ) => {
      const session = beekeeper.createSession("salt");
      const { wallet } = await session.createWallet("w0");
      await wallet.importKey(skeletonKey);

      const chain = await wax.createHiveChain(chainConfig);

      const signer = createSigner(chain, wallet, skeletonPublicKey);

      // Ensure test accounts exist with correct authority structure
      await ensureTestAccountsExist(chain, signer, skeletonPublicKey, ownerPublicKey);

      // Build and sign a transfer from authtracetst1 (requires active authority, threshold=2)
      const sourceTx: IOnlineTransaction = await chain.createTransaction();
      sourceTx.pushOperation({
        transfer_operation: {
          from: 'authtracetst1',
          to: 'authtracetst2',
          amount: chain.hiveSatoshis(1),
          memo: 'Authority trace test'
        }
      });
      await signer.signTransaction(sourceTx);

      // Generate authority verification trace using a separate online transaction
      const tx: IOnlineTransaction = await chain.createTransaction();
      const trace = await tx.generateAuthorityVerificationTrace(false, sourceTx);

      console.log(JSON.stringify(trace));

      return trace;
    }, ensureTestAccountsExist, mirrornetSkeletonKey, mirrornetSkeletonPublicKey, authtracetst1OwnerPublicKey, config!);

    expect(retVal).toStrictEqual({
      "collectedData": [
        {
          "finalAuthorityPath": {
            "processedEntry": "authtracetst1",
            "processedRole": "owner",
            "processingStatus": {
              "accountAuthorityCountExceeded": false,
              "accountAuthorityPointsMissingAccount": false,
              "accountAuthorityProcessingDepthExceeded": false,
              "entryAccepted": false,
              "hasAccountAuthorityCycle": false,
              "hasInsufficientWeight": true,
              "hasMatchingPublicKey": false
            },
            "recursionDepth": 0,
            "threshold": 1,
            "visitedEntries": [],
            "weight": 0
          },
          "matchingSignatures": []
        }
      ],
      "finalAuthorityPath": [
        {
          "processedEntry": "authtracetst1",
          "processedRole": "owner",
          "processingStatus": {
            "accountAuthorityCountExceeded": false,
            "accountAuthorityPointsMissingAccount": false,
            "accountAuthorityProcessingDepthExceeded": false,
            "entryAccepted": false,
            "hasAccountAuthorityCycle": false,
            "hasInsufficientWeight": true,
            "hasMatchingPublicKey": false
          },
          "recursionDepth": 0,
          "threshold": 1,
          "visitedEntries": [],
          "weight": 0
        }
      ],
      "rootEntries": [
        {
          "processedEntry": "authtracetst1",
          "processedRole": "active",
          "processingStatus": {
            "accountAuthorityCountExceeded": false,
            "accountAuthorityPointsMissingAccount": false,
            "accountAuthorityProcessingDepthExceeded": false,
            "entryAccepted": false,
            "hasAccountAuthorityCycle": false,
            "hasInsufficientWeight": true,
            "hasMatchingPublicKey": false
          },
          "recursionDepth": 0,
          "threshold": 2,
          "visitedEntries": [
            {
              "processedEntry": "authtracetst2",
              "processedRole": "active",
              "processingStatus": {
                "entryAccepted": true,
                "isOpenAuthority": false
              },
              "recursionDepth": 1,
              "threshold": 1,
              "visitedEntries": [
                {
                  "processedEntry": "STM6LLegbAgLAy28EHrffBVuANFWcFgmqRMW13wBmTExqFE9SCkg4",
                  "processedRole": "active",
                  "processingStatus": {
                    "entryAccepted": true,
                    "isOpenAuthority": false
                  },
                  "recursionDepth": 1,
                  "threshold": 1,
                  "visitedEntries": [],
                  "weight": 1
                }
              ],
              "weight": 1
            },
            {
              "processedEntry": "authtracetst3",
              "processedRole": "active",
              "processingStatus": {
                "accountAuthorityCountExceeded": false,
                "accountAuthorityPointsMissingAccount": false,
                "accountAuthorityProcessingDepthExceeded": false,
                "entryAccepted": false,
                "hasAccountAuthorityCycle": false,
                "hasInsufficientWeight": true,
                "hasMatchingPublicKey": false
              },
              "recursionDepth": 1,
              "threshold": 1,
              "visitedEntries": [
                {
                  "processedEntry": "authtracetst1",
                  "processedRole": "active",
                  "processingStatus": {
                    "accountAuthorityCountExceeded": false,
                    "accountAuthorityPointsMissingAccount": false,
                    "accountAuthorityProcessingDepthExceeded": true,
                    "entryAccepted": false,
                    "hasAccountAuthorityCycle": true,
                    "hasInsufficientWeight": true,
                    "hasMatchingPublicKey": false
                  },
                  "recursionDepth": 2,
                  "threshold": 2,
                  "visitedEntries": [
                    {
                      "processedEntry": "authtracetst2",
                      "processedRole": "active",
                      "processingStatus": {
                        "entryAccepted": true,
                        "isOpenAuthority": false
                      },
                      "recursionDepth": 3,
                      "threshold": 2,
                      "visitedEntries": [],
                      "weight": 1
                    }
                  ],
                  "weight": 1
                }
              ],
              "weight": 0
            }
          ],
          "weight": 1
        },
        {
          "processedEntry": "authtracetst1",
          "processedRole": "owner",
          "processingStatus": {
            "accountAuthorityCountExceeded": false,
            "accountAuthorityPointsMissingAccount": false,
            "accountAuthorityProcessingDepthExceeded": false,
            "entryAccepted": false,
            "hasAccountAuthorityCycle": false,
            "hasInsufficientWeight": true,
            "hasMatchingPublicKey": false
          },
          "recursionDepth": 0,
          "threshold": 1,
          "visitedEntries": [],
          "weight": 0
        }
      ],
      "rootEntry": {
        "processedEntry": "authtracetst1",
        "processedRole": "owner",
        "processingStatus": {
          "accountAuthorityCountExceeded": false,
          "accountAuthorityPointsMissingAccount": false,
          "accountAuthorityProcessingDepthExceeded": false,
          "entryAccepted": false,
          "hasAccountAuthorityCycle": false,
          "hasInsufficientWeight": true,
          "hasMatchingPublicKey": false
        },
        "recursionDepth": 0,
        "threshold": 1,
        "visitedEntries": [],
        "weight": 0
      },
      "verificationStatus": {
        "accountAuthorityCountExceeded": false,
        "accountAuthorityPointsMissingAccount": false,
        "accountAuthorityProcessingDepthExceeded": false,
        "entryAccepted": false,
        "hasAccountAuthorityCycle": false,
        "hasInsufficientWeight": true,
        "hasMatchingPublicKey": false
      }
    });
  });

  test('Should be able to get authority trace root entires for multi signature transaction', async ({ waxTest }) => {
    const retVal = await waxTest(async({ wax }) => {
      const chain = await wax.createHiveChain();

      const sourceTx = chain.createTransactionFromJson({
        "ref_block_num": 808,
        "ref_block_prefix": 1359279161,
        "extensions": [],
        "expiration": "2024-08-02T12:09:03",
        "operations": [
          {
            "type": "vote_operation",
            "value": {
              "voter": "ecency",
              "author": "el-panal",
              "weight": 100,
              "permlink": "el-panal-presentacion-de-autores-destacados-dia31072024"
            }
          },
          {
            "type": "vote_operation",
            "value": {
              "voter": "ecency.stats",
              "author": "el-panal",
              "weight": 100,
              "permlink": "el-panal-presentacion-de-autores-destacados-dia31072024"
            }
          },
          {
            "type": "vote_operation",
            "value": {
              "voter": "esteem.app",
              "author": "el-panal",
              "weight": 100,
              "permlink": "el-panal-presentacion-de-autores-destacados-dia31072024"
            }
          },
          {
            "type": "vote_operation",
            "value": {
              "voter": "good-karma",
              "author": "el-panal",
              "weight": 100,
              "permlink": "el-panal-presentacion-de-autores-destacados-dia31072024"
            }
          },
          {
            "type": "vote_operation",
            "value": {
              "voter": "esteemapp",
              "author": "el-panal",
              "weight": 100,
              "permlink": "el-panal-presentacion-de-autores-destacados-dia31072024"
            }
          }
        ],
        "signatures": [
          "1f4141e7645dd2bdcdb2001baea165e668a6f9c2a366f6fd2f3e9d878f071f5eb052509eb666b80c1e0daaa7fdec36e3de827087dcd3015c8672b536ddddbc5726",
          "20223edff229382e67031d993c13d26062ab4d33c45ede7aced7f1e432d6b6d57a4fd68eae708f562a9644ee08ea447fa354febe34aa8ba14a434c66adc753774f",
          "20286bd3b0ad2ecb01488ce866361b4fcd53b1f3dac41962496986fdf89c89c20a0e86f8dd2669ed14b6dafc3e0bb0d24ec54a794ee6c0b563275a22a122992ac1",
          "2043b5ea9cbf76f1cd0fbb5f589350d9b8273d241c8bb704189bc9fd4444493c384594536e0387ff121bcdbfa4fa401917e30609ac86ea82f13132d26280e74f9a",
          "205f0e25631bdbcd37669b2f6c36594d0153e468be8b2b6a57f8eae49538132efd0dde1ad6a707788d6a2024efd03a55dd0bb478a40eedce48f6e5db19d365bce5"
        ]
      });

      const tx = await chain.createTransaction();

      const trace = await tx.generateAuthorityVerificationTrace(false, sourceTx);

      console.log(JSON.stringify(trace));

      return trace.rootEntries;
    });

    expect(retVal).toStrictEqual([
      {
        "processedEntry": "ecency",
        "processedRole": "posting",
        "processingStatus": {
          "entryAccepted": true,
          "isOpenAuthority": false
        },
        "recursionDepth": 0,
        "threshold": 1,
        "visitedEntries": [
          {
            "processedEntry": "STM8AZuk2ja5vSFySFL2zpB9bNew8wJAg8r4QFtbnoamEX8Jvvq43",
            "processedRole": "posting",
            "processingStatus": {
              "entryAccepted": true,
              "isOpenAuthority": false
            },
            "recursionDepth": 0,
            "threshold": 1,
            "visitedEntries": [],
            "weight": 1
          }
        ],
        "weight": 1
      },
      {
        "processedEntry": "ecency.stats",
        "processedRole": "posting",
        "processingStatus": {
          "entryAccepted": true,
          "isOpenAuthority": false
        },
        "recursionDepth": 0,
        "threshold": 1,
        "visitedEntries": [
          {
            "processedEntry": "STM8jviUDRAefxmTQ9m8wNdiQV5dmCPSMDjSnztPYZpHf1yfaD6Rd",
            "processedRole": "posting",
            "processingStatus": {
              "entryAccepted": true,
              "isOpenAuthority": false
            },
            "recursionDepth": 0,
            "threshold": 1,
            "visitedEntries": [],
            "weight": 1
          }
        ],
        "weight": 1
      },
      {
        "processedEntry": "esteem.app",
        "processedRole": "posting",
        "processingStatus": {
          "entryAccepted": true,
          "isOpenAuthority": false
        },
        "recursionDepth": 0,
        "threshold": 1,
        "visitedEntries": [
          {
            "processedEntry": "STM64Bb5TXsiEbjjLsgVrvVttEDsLNSot9p8zJd41D5zEr5opxcHK",
            "processedRole": "posting",
            "processingStatus": {
              "entryAccepted": true,
              "isOpenAuthority": false
            },
            "recursionDepth": 0,
            "threshold": 1,
            "visitedEntries": [],
            "weight": 1
          }
        ],
        "weight": 1
      },
      {
        "processedEntry": "esteemapp",
        "processedRole": "posting",
        "processingStatus": {
          "entryAccepted": true,
          "isOpenAuthority": false
        },
        "recursionDepth": 0,
        "threshold": 1,
        "visitedEntries": [
          {
            "processedEntry": "STM7S3wsVtQotgKLN8wFLPNBALe6YHt8MPLEHuTH5CxfxdhpGPBUP",
            "processedRole": "posting",
            "processingStatus": {
              "entryAccepted": true,
              "isOpenAuthority": false
            },
            "recursionDepth": 0,
            "threshold": 1,
            "visitedEntries": [],
            "weight": 1
          }
        ],
        "weight": 1
      },
      {
        "processedEntry": "good-karma",
        "processedRole": "posting",
        "processingStatus": {
          "entryAccepted": true,
          "isOpenAuthority": false
        },
        "recursionDepth": 0,
        "threshold": 1,
        "visitedEntries": [
          {
            "processedEntry": "STM5dhkPS223F9d3TCXKttuWpdWgqS2Fx8KNRQve6BMGmAvJ5GnJR",
            "processedRole": "posting",
            "processingStatus": {
              "entryAccepted": true,
              "isOpenAuthority": false
            },
            "recursionDepth": 0,
            "threshold": 1,
            "visitedEntries": [],
            "weight": 1
          }
        ],
        "weight": 1
      }
    ]);
  });

  test('Should be able to get authority trace root entires for multisig transaction with one broken signature ', async ({ waxTest }) => {
    const retVal = await waxTest(async({ wax }) => {
      const chain = await wax.createHiveChain();

      const sourceTx = chain.createTransactionFromJson({
        "ref_block_num": 808,
        "ref_block_prefix": 1359279161,
        "extensions": [],
        "expiration": "2024-08-02T12:09:03",
        "operations": [
          {
            "type": "vote_operation",
            "value": {
              "voter": "ecency",
              "author": "el-panal",
              "weight": 100,
              "permlink": "el-panal-presentacion-de-autores-destacados-dia31072024"
            }
          },
          {
            "type": "vote_operation",
            "value": {
              "voter": "ecency.stats",
              "author": "el-panal",
              "weight": 100,
              "permlink": "el-panal-presentacion-de-autores-destacados-dia31072024"
            }
          },
          {
            "type": "vote_operation",
            "value": {
              "voter": "esteem.app",
              "author": "el-panal",
              "weight": 100,
              "permlink": "el-panal-presentacion-de-autores-destacados-dia31072024"
            }
          },
          {
            "type": "vote_operation",
            "value": {
              "voter": "good-karma",
              "author": "el-panal",
              "weight": 100,
              "permlink": "el-panal-presentacion-de-autores-destacados-dia31072024"
            }
          },
          {
            "type": "vote_operation",
            "value": {
              "voter": "esteemapp",
              "author": "el-panal",
              "weight": 100,
              "permlink": "el-panal-presentacion-de-autores-destacados-dia31072024"
            }
          }
        ],
        "signatures": [
          "1f4141e7645dd2bdcdb2001baea165e668a6f9c2a366f6fd2f3e9d878f071f5eb052509eb666b80c1e0daaa7fdec36e3de827087dcd3015c8672b536ddddbc5726",
          "20223edff229382e67031d993c13d26062ab4d33c45ede7aced7f1e432d6b6d57a4fd68eae708f562a9644ee08ea447fa354febe34aa8ba14a434c66adc753774f",
          "20286bd3b0ad2ecb01488ce866361b4fcd53b1f3dac41962496986fdf89c89c20a0e86f8dd2669ed14b6dafc3e0bb0d24ec54a794ee6c0b563275a22a122992ac1",
          "2043b5ea9cbf76f1cd0fbb5f589350d9b8273d241c8bb704189bc9fd4444493c384594536e0387ff121bcdbfa4fa401917e30609ac86ea82f13132d26280e74f9a",
          "205f0e25631bdbcd37669b2f6c36594d0153e468be8b2b6a57f8eae49538132efd0dde1ad6a707788d6a2024efd03a55dd0bb478a40eedce48f6e5db19d365"
        ]
      });

      const tx = await chain.createTransaction();

      const trace = await tx.generateAuthorityVerificationTrace(false, sourceTx);

      console.log(JSON.stringify(trace));

      return trace.rootEntries;
    });

    expect(retVal).toStrictEqual([
      {
        "processedEntry": "ecency",
        "processedRole": "posting",
        "processingStatus": {
          "accountAuthorityCountExceeded": false,
          "accountAuthorityPointsMissingAccount": false,
          "accountAuthorityProcessingDepthExceeded": false,
          "entryAccepted": false,
          "hasAccountAuthorityCycle": false,
          "hasInsufficientWeight": true,
          "hasMatchingPublicKey": false
        },
        "recursionDepth": 0,
        "threshold": 1,
        "visitedEntries": [
          {
            "processedEntry": "ecency.app",
            "processedRole": "posting",
            "processingStatus": {
              "accountAuthorityCountExceeded": false,
              "accountAuthorityPointsMissingAccount": false,
              "accountAuthorityProcessingDepthExceeded": false,
              "entryAccepted": false,
              "hasAccountAuthorityCycle": false,
              "hasInsufficientWeight": true,
              "hasMatchingPublicKey": false
            },
            "recursionDepth": 1,
            "threshold": 1,
            "visitedEntries": [
              {
                "processedEntry": "hivesigner",
                "processedRole": "posting",
                "processingStatus": {
                  "accountAuthorityCountExceeded": false,
                  "accountAuthorityPointsMissingAccount": false,
                  "accountAuthorityProcessingDepthExceeded": false,
                  "entryAccepted": false,
                  "hasAccountAuthorityCycle": false,
                  "hasInsufficientWeight": true,
                  "hasMatchingPublicKey": false
                },
                "recursionDepth": 2,
                "threshold": 1,
                "visitedEntries": [],
                "weight": 0
              }
            ],
            "weight": 0
          }
        ],
        "weight": 0
      },
      {
        "processedEntry": "ecency",
        "processedRole": "active",
        "processingStatus": {
          "accountAuthorityCountExceeded": false,
          "accountAuthorityPointsMissingAccount": false,
          "accountAuthorityProcessingDepthExceeded": false,
          "entryAccepted": false,
          "hasAccountAuthorityCycle": false,
          "hasInsufficientWeight": true,
          "hasMatchingPublicKey": false
        },
        "recursionDepth": 0,
        "threshold": 1,
        "visitedEntries": [],
        "weight": 0
      },
      {
        "processedEntry": "ecency",
        "processedRole": "owner",
        "processingStatus": {
          "accountAuthorityCountExceeded": false,
          "accountAuthorityPointsMissingAccount": false,
          "accountAuthorityProcessingDepthExceeded": false,
          "entryAccepted": false,
          "hasAccountAuthorityCycle": false,
          "hasInsufficientWeight": true,
          "hasMatchingPublicKey": false
        },
        "recursionDepth": 0,
        "threshold": 1,
        "visitedEntries": [],
        "weight": 0
      },
      {
        "processedEntry": "ecency.stats",
        "processedRole": "posting",
        "processingStatus": { "entryAccepted": true, "isOpenAuthority": false },
        "recursionDepth": 0,
        "threshold": 1,
        "visitedEntries": [
          {
            "processedEntry": "STM8jviUDRAefxmTQ9m8wNdiQV5dmCPSMDjSnztPYZpHf1yfaD6Rd",
            "processedRole": "posting",
            "processingStatus": { "entryAccepted": true, "isOpenAuthority": false },
            "recursionDepth": 0,
            "threshold": 1,
            "visitedEntries": [],
            "weight": 1
          }
        ],
        "weight": 1
      },
      {
        "processedEntry": "esteem.app",
        "processedRole": "posting",
        "processingStatus": { "entryAccepted": true, "isOpenAuthority": false },
        "recursionDepth": 0,
        "threshold": 1,
        "visitedEntries": [
          {
            "processedEntry": "STM64Bb5TXsiEbjjLsgVrvVttEDsLNSot9p8zJd41D5zEr5opxcHK",
            "processedRole": "posting",
            "processingStatus": { "entryAccepted": true, "isOpenAuthority": false },
            "recursionDepth": 0,
            "threshold": 1,
            "visitedEntries": [],
            "weight": 1
          }
        ],
        "weight": 1
      },
      {
        "processedEntry": "esteemapp",
        "processedRole": "posting",
        "processingStatus": { "entryAccepted": true, "isOpenAuthority": false },
        "recursionDepth": 0,
        "threshold": 1,
        "visitedEntries": [
          {
            "processedEntry": "STM7S3wsVtQotgKLN8wFLPNBALe6YHt8MPLEHuTH5CxfxdhpGPBUP",
            "processedRole": "posting",
            "processingStatus": { "entryAccepted": true, "isOpenAuthority": false },
            "recursionDepth": 0,
            "threshold": 1,
            "visitedEntries": [],
            "weight": 1
          }
        ],
        "weight": 1
      },
      {
        "processedEntry": "good-karma",
        "processedRole": "posting",
        "processingStatus": { "entryAccepted": true, "isOpenAuthority": false },
        "recursionDepth": 0,
        "threshold": 1,
        "visitedEntries": [
          {
            "processedEntry": "STM5dhkPS223F9d3TCXKttuWpdWgqS2Fx8KNRQve6BMGmAvJ5GnJR",
            "processedRole": "posting",
            "processingStatus": { "entryAccepted": true, "isOpenAuthority": false },
            "recursionDepth": 0,
            "threshold": 1,
            "visitedEntries": [],
            "weight": 1
          }
        ],
        "weight": 1
      }
    ]
    );
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

  test('Should allow to create account and send transfer to it in one transaction', async ({ waxTest, config }) => {
    const retVal = await waxTest(async ({ beekeeper, wax, createSigner }, mirrornetSkeletonKey, config) => {
      // Create wallet:
      const session = beekeeper.createSession("salt");
      const { wallet } = await session.createWallet("w0");
      const matchingPublicKey = await wallet.importKey(mirrornetSkeletonKey);

      const myCustomChain = await wax.createHiveChain(config);

      const { median_props: { account_creation_fee } } = await myCustomChain.api.database_api.get_witness_schedule({});

      // Create online transaction
      const tx: IOnlineTransaction = await myCustomChain.createTransaction();

      const randomAccountName = 'z' + Math.random().toString(36).substring(2, 12);

      tx.pushOperation({
        account_create_operation: {
          fee: account_creation_fee,
          creator: "xbtsio",
          json_metadata: "",
          memo_key: matchingPublicKey,
          new_account_name: randomAccountName,
          active: { account_auths: {}, key_auths: {[matchingPublicKey]: 1}, weight_threshold: 1 },
          owner: { account_auths: {}, key_auths: {[matchingPublicKey]: 1}, weight_threshold: 1 },
          posting: { account_auths: {}, key_auths: {[matchingPublicKey]: 1}, weight_threshold: 1 },
        }
      }).pushOperation({
        transfer_operation: {
          from: "xbtsio",
          to: randomAccountName,
          amount: myCustomChain.hiveSatoshis(1),
          memo: ""
        }
      });

      const signer = createSigner(myCustomChain, wallet, matchingPublicKey);
      await signer.signTransaction(tx);

      try {
        // Do not perform real broadcast.
        // To do so, we need to introduce some official mirrornet automatic preconfig, in similar way as it was done here:
        // https://gitlab.syncad.com/hive/wax/-/blob/develop/examples/ts/signature-extension/common-data.ts?ref_type=heads#L39
        // At the moment it will be sufficient to call performOnChainVerification only which should pass.
        // await myCustomChain.broadcast(tx);\
        await tx.performOnChainVerification();
      }
      catch (error) {
        console.error(error);

        return JSON.stringify(error);
      }

      return undefined;
    }, mirrornetSkeletonKey, config!);

    expect(retVal).toBeUndefined();
  });

  test('Should be able to create and sign transaction using online transaction interface', async ({ waxTest, config }) => {
    const retVal = await waxTest(async({ beekeeper, wax, createSigner }, protoVoteOp, mirrornetSkeletonKey, mirrornetSkeletonPublicKey, config) => {
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

      const signer = createSigner(myCustomChain, wallet, matchingPublicKey);
      await signer.signTransaction(tx);

      return {
        signerKey: tx.signatureKeys[0],
        expectedKey: mirrornetSkeletonPublicKey
      };
    }, protoVoteOp, mirrornetSkeletonKey, mirrornetSkeletonPublicKey, config);

    expect(retVal.signerKey).toBe(retVal.expectedKey);
   });
});
