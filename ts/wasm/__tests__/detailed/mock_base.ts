import { expect } from '@playwright/test';

import { test } from '../assets/jest-helper';
import { createServer } from '../assets/proxy-mock-server';
import { JsonRpcMock } from '../assets/api-mock';
import jsonRpcMock from '../assets/mock/jsonRpcMock';
import { initminerAccountApi } from '../assets/data.protocol';
import steem from '../assets/mock/data/steem';
import data4nonexistingAccount from "../assets/mock/data/data4nonexistingaccount";
import type { claim_account, operation } from '../../dist/bundle';
import type { WaxAssertionError } from '../../dist/bundle';

let closeServer: () => Promise<void>;

test.describe('Wax base mock tests', () => {
  test.beforeAll(async () => {
    closeServer = await createServer(new JsonRpcMock(jsonRpcMock), 'api.hive.blog', 8000);
  });

  // Moved from formatters.ts: retrieves "initminer" through the API and
  // formats it with the default formatter. Runs against the mock (canned
  // fixture) because the live account's vesting_withdraw_rate drifted
  // on-chain, breaking the snapshot.
  test('Should be able to retrieve account from the API and format it using default formatter from the hive chain interface', async({ waxTest }) => {
    const retVal = await waxTest(async({ chain }) => {
      const response = await chain.api.database_api.find_accounts({ accounts: [ "initminer" ], delayed_votes_active: true });

      return chain.formatter.extend({ asset: { displayAsNai: false, appendTokenName: true, formatAmount: true, locales: "en-US" } }).format(response.accounts[0]);
    });

    expect(
      retVal
    ).toEqual(initminerAccountApi);
  });

  test('Should be able to create proper legacy vote operation', async ({ waxTest }) => {
    const retVal = await waxTest(async({ chain, wax }) => {
      const tx = await chain.createTransaction();

      const accounts = ["alpha.manabar100", "alpha.manabar50", "alpha.manabar1"];
      const weights = [100, 50, 0, -50, -100];

      const operations = await Promise.all(accounts.flatMap(account => weights.map(weight =>
        wax.LegacyVoteOperation.for(chain, account, "gtg", "hello-world", weight)
      )));

      operations.forEach(op => tx.pushOperation(op));

      return tx.transaction.operations;
    });

    expect(retVal[0].vote_operation).toStrictEqual({
      voter: 'alpha.manabar100',
      author: 'gtg',
      permlink: 'hello-world',
      weight: 10000
    });

    const manabarValues = retVal.map(op => op.vote_operation!.weight);

    expect(manabarValues).toEqual([
    // weight percent:
    //  100,   50, 0,   -50,   -100
      10000, 5000, 0, -5000, -10000, // alpha.manabar100
       4999, 2499, 0, -2499,  -4999, // alpha.manabar50
         99,   49, 0,   -49,    -99  // alpha.manabar1
    ]);
  });

  test('Should be able to find account based on mock interface', async ({ waxTest }) => {
    const retVal = await waxTest(async({ chain }) => {
      const foundAccount = await chain.api.database_api.find_accounts({ accounts: ['steem'], delayed_votes_active: true });

      return foundAccount;
    });

    expect(retVal).toStrictEqual(steem.result);
  });

  test('Should be able to correctly handle no data in hived node error', async ({ waxTest }) => {
    const retVal = await waxTest(async({ chain }) => {
      const actualChain = chain.extend<{
        condenser_api: {
          get_active_votes: {
            params: string[];
            result: any;
          }
        }
      }>();

      try {
        await actualChain.api.condenser_api.get_active_votes(["nodata"]);
      } catch(error) {
        // console.error(error);

        return { name: (error as Error).name, message: (error as Error).message };
      }

      return {};
    });

    expect(retVal.name).toBe('WaxError');
    expect(retVal.message).toStrictEqual('Invalid response from chain API');
  });

  test('Should be able to correctly handle malformed hived node error', async ({ waxTest }) => {
    const retVal = await waxTest(async({ chain }) => {
      const actualChain = chain.extend<{
        condenser_api: {
          get_active_votes: {
            params: string[];
            result: any;
          }
        }
      }>();

      try {
        await actualChain.api.condenser_api.get_active_votes(["malformed"]);
      } catch(error) {
        // console.error(error);

        return { name: (error as Error).name, message: (error as Error).message };
      }

      return {};
    });

    expect(retVal.name).toBe('WaxError');
    expect(retVal.message).toStrictEqual('Non-typed Error during Wasm call: std::runtime_error: Non assert_exception error received: Got non-object-like error. Original deserialization data: 12333333');
  });

  test('Should be able to correctly handle Hivemind string-like error', async ({ waxTest }) => {
    const retVal = await waxTest(async({ chain }) => {
      const actualChain = chain.extend<{
        condenser_api: {
          get_active_votes: {
            params: string[];
            result: any;
          }
        }
      }>();

      try {
        await actualChain.api.condenser_api.get_active_votes(["appspecific", "com.chrome.devtools.json"]);
      } catch(error) {
        // console.error(error);

        return { name: (error as Error).name, message: (error as Error).message };
      }

      return {};
    });

    expect(retVal.name).toBe('WaxError');
    expect(retVal.message).toStrictEqual('Non-typed Error during Wasm call: std::runtime_error: Non assert_exception error received: Got non-object-like error. Original deserialization data: "Post appspecific/com.chrome.devtools.json does not exist"');
  });

  test('Should be able to correctly handle standard Hived errors', async ({ waxTest }) => {
    const retVal = await waxTest(async({ chain, wax }) => {
      try {
        await chain.api.database_api.find_accounts({ accounts: ["toolargeinputitis"] });
      } catch(error) {
        if (error instanceof wax.WaxAssertionError) {
          const assertion = error as WaxAssertionError;
          return {
            name: assertion.name,
            category: assertion.category,
            rawName: assertion.raw.name,
            rawMessage: assertion.raw.message,
            formatted: assertion.message,
            stackFormat: assertion.raw.stack[0]?.format,
            stackData: assertion.raw.stack[0]?.data,
          };
        }
        return { name: (error as Error).name, message: (error as Error).message };
      }

      return {};
    });

    expect(retVal.name).toBe('WaxAssertionError');
    expect(retVal.category).toBe('protocol');
    expect(retVal.rawName).toBe('assert_exception');
    expect(retVal.rawMessage).toBe('Assert Exception');
    expect(retVal.stackFormat).toBe('Input too large: `${in}` (${is}) for fixed size string: (${fs})');
    expect(retVal.stackData).toStrictEqual({ fs: 16, in: 'toolargeinputitis', is: 17 });
  });

  test('Testing assertion during transaction broadcast', async ({ waxTest }) => {
    const retVal = await waxTest( async ({ chain, wax }) => {
      const testedOp: claim_account = {
        creator: "user123",
        fee: { nai: "@@000000013", amount: "1", precision: 3 },
        extensions: []
      };
      const op: operation = { claim_account_operation: testedOp };
      const tx = await chain.createTransaction();
      tx.pushOperation(op);
      try {
        await chain.api.network_broadcast_api.broadcast_transaction({
          max_block_age: 0,
          trx: tx.toApiJson()
        });
      }
      catch (e) {
        if(e && typeof e === "object") {
          const error: object = e as object;
          if(e instanceof wax.WaxAssertionError) {
            const caughtAssertion: WaxAssertionError = error as WaxAssertionError;
            return {
              detectedError: {
                source: caughtAssertion.category,
                expression: caughtAssertion.raw.extension.assertion_expression || "Unknown assertion expression",
                hash: caughtAssertion.assertHash
              }
            };
          } else {
            const errorStr = JSON.stringify(error);
            return { detectedError: {message: errorStr} };
          }
        }
        throw new Error("Unexpected error type caught: " + e);
      };
      throw new Error("No error detected");
    });
    expect(retVal.detectedError).toStrictEqual({
      source: "unknown",
      expression: "!check_max_block_age( args.max_block_age )",
      hash: "4716502953486857149"
    });
  });

  test('Should be able to find NONEXISTING account based on mock interface', async ({ waxTest }) => {
    const retVal = await waxTest(async({ chain }, accountData) => {
      const foundAccount = await chain.api.database_api.find_accounts({ accounts: ['0steem'], delayed_votes_active: true }); /// Intentionally use invalid name in Hive

      console.log(JSON.stringify(foundAccount));

      return JSON.stringify(foundAccount) === JSON.stringify(accountData.result);
    }, data4nonexistingAccount);

    expect(retVal).toBe(true);
  });

  test('Should be able to get authority trace with mock data', async ({ waxTest }) => {
    const retVal = await waxTest(async({ chain }) => {
      const sourceTx = chain.createTransactionFromJson({
        "ref_block_num": 47527,
        "ref_block_prefix": 1507238693,
        "extensions": [],
        "expiration": "2024-11-12T10:34:48",
        "operations": [
          {
            "type": "vote_operation",
            "value": {
              "voter": "andablackwidow",
              "author": "hbd.funder",
              "weight": 10000,
              "permlink": "re-upvote-this-post-to-fund-hbdstabilizer-20241112t045515z"
            }
          }
        ],
        "signatures": [
          "1f411808fe07ba78c8e0d1edc7e4bdf14b8af1b85a26437fd7e082054fc0fa5b503627072e4cc482d1a4e60ea5f318a85539282c5beb9747e83a429bcd369d1ece"
        ]
      });

      const tx = await chain.createTransaction();

      const trace = await tx.generateAuthorityVerificationTrace(false, sourceTx);

      //console.log(JSON.stringify(trace.collectedData));

      return trace.collectedData;
    });

    expect(retVal).toEqual([
      {
        "finalAuthorityPath": {
          "processedEntry": "andablackwidow",
          "processedRole": "posting",
          "threshold": 1,
          "weight": 1,
          "recursionDepth": 0,
          "processingStatus": {
            "entryAccepted": true,
            "isOpenAuthority": false
          },
          "visitedEntries": [
            {
              "processedEntry": "STM7UEziXTT9CMCTLvSpWsS974XiYCGSb9jP3ycriAXFFoQVWxzZK",
              "processedRole": "posting",
              "threshold": 1,
              "weight": 1,
              "recursionDepth": 0,
              "processingStatus": {
                "entryAccepted": true,
                "isOpenAuthority": false
              },
              "visitedEntries": []
            }
          ]
        },
        "matchingSignatures": [{
          "signature": "1f411808fe07ba78c8e0d1edc7e4bdf14b8af1b85a26437fd7e082054fc0fa5b503627072e4cc482d1a4e60ea5f318a85539282c5beb9747e83a429bcd369d1ece",
          "signatureKey": "STM7UEziXTT9CMCTLvSpWsS974XiYCGSb9jP3ycriAXFFoQVWxzZK"
        }]
      }
    ]);
  });

  test('Should be able to get authority trace with mock data for account which declares itself as account authority', async ({ waxTest }) => {
    test.fail(); // The cycle flag should be true because account declares itself as account authority.
    const retVal = await waxTest(async({ chain }) => {
      const sourceTx = chain.createTransactionFromJson({
        "ref_block_num": 41973,
        "ref_block_prefix": 2696396446,
        "extensions": [],
        "expiration": "2025-02-11T10:33:18",
        "operations": [
          {
            "type": "comment_operation",
            "value": {
              "body": "Edite su comentario. La **primera línea** debe contener **solo el nombre del usuario**, ¡nada más!<div><a href=\"https://engage.hivechain.app\">![](https://i.imgur.com/XsrNmcl.png)</a></div>",
              "title": "",
              "author": "hivebuzz",
              "permlink": "re-1739269398362",
              "json_metadata": "{\"app\":\"engage\"}",
              "parent_author": "numa26",
              "parent_permlink": "re-hivebuzz-srhhfn"
            }
          }
        ],
        "signatures": [
          "1f6a2c32c04a3def7d91832c6b476abaeb686472036ef9fb80a920baab9c63dac31a0c3ac67f4c66e42eecfd1cceb0e926ab6e224b97fa3fa0150435ca0db804f3"
        ]
      });

      const tx = await chain.createTransaction();

      const trace = await tx.generateAuthorityVerificationTrace(false, sourceTx);

      console.log(JSON.stringify(trace.collectedData));

      return trace.collectedData;
    });

    expect(retVal).toEqual([
      {
        "finalAuthorityPath": {
          "processedEntry": "hivebuzz",
          "processedRole": "owner",
          "threshold": 1,
          "weight": 0,
          "recursionDepth": 0,
          "processingStatus": {
            "entryAccepted": false,
            "accountAuthorityProcessingDepthExceeded": false,
            "accountAuthorityCountExceeded": false,
            "accountAuthorityPointsMissingAccount": false,
            "hasAccountAuthorityCycle": true, // It should be true, because account declares itself as account authority.
            "hasInsufficientWeight": true,
            "hasMatchingPublicKey": false
          },
          "visitedEntries": []
        }
      }
    ]);
  });

  test('Should be able to get authority trace with mock data with delegated authority where 2 accounts are required to satisfy threshold', async ({ waxTest }) => {
    // FIXED! The trace proccess is stopped after first account beacuse of incorrect weight calculation (Only one account satisfied threshold, but indicated from mock API response, 2 accounts are required).
    const retVal = await waxTest(async({ chain }) => {
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

      console.log(JSON.stringify(trace.collectedData));

      return trace.collectedData;
    });

    expect(retVal).toEqual([
      {
        "finalAuthorityPath":       {
          "processedEntry": "sunnyvo",
          "processedRole": "posting",
          "processingStatus": {
            "entryAccepted": true,
            "isOpenAuthority": false,
          },
          "recursionDepth": 0,
          "threshold": 2,
          "weight": 2,
          "visitedEntries": [
            {
              "processedEntry": "steemauto",
              "processedRole": "posting",
              "threshold": 1,
              "weight": 1,
              "recursionDepth": 1,
              "processingStatus": {
                "entryAccepted": true,
                "isOpenAuthority": false
              },
              "visitedEntries": [
                {
                  "processedEntry": "STM8WWUYHMdHLgEHidYCztswzfZCViA16EqGkAxt7RG4dWwDpFtCF",
                  "processedRole": "posting",
                  "threshold": 1,
                  "weight": 1,
                  "recursionDepth": 1,
                  "processingStatus": {
                    "entryAccepted": true,
                    "isOpenAuthority": false
                  },
                  "visitedEntries": []
                }
              ]
            },
            {
              "processedEntry": "threespeak",
              "processedRole": "posting",
              "threshold": 1,
              "weight": 1,
              "recursionDepth": 1,
              "processingStatus": {
                "entryAccepted": true,
                "isOpenAuthority": false
              },
              "visitedEntries": [
                {
                  "processedEntry": "STM8WWUYHMdHLgEHidYCztswzfZCViA16EqGkAxt7RG4dWwDpFtCF",
                  "processedRole": "posting",
                  "threshold": 1,
                  "weight": 1,
                  "recursionDepth": 1,
                  "processingStatus": {
                    "entryAccepted": true,
                    "isOpenAuthority": false
                  },
                  "visitedEntries": []
                }
              ]
            }
          ]
        },
        "matchingSignatures": [{
          "signature": "20282d87e22cad745d263ee43fe8552044ecb68ebd274a03421d6e59aaaa891d5a594808c58605828c240b9e498f53d32a8f4f7baec5bfcbc7d391af4e4283366e",
          "signatureKey": "STM8WWUYHMdHLgEHidYCztswzfZCViA16EqGkAxt7RG4dWwDpFtCF"
        }]
      }
    ]);
  });

  test('Should be able to get authority trace with mock data for 6 signatures where one of the public keys (in the middle of public keys array) does not match any account', async ({ waxTest }) => {
    // FIXED! The proccess of getting authority trace is stopped when public key placed in the middle does not match any account, istead of continuing to the end of the public keys array.
    const retVal = await waxTest(async({ chain }) => {
      const sourceTx = chain.createTransactionFromJson({
        "ref_block_num": 59525,
        "ref_block_prefix": 1587984329,
        "extensions": [],
        "expiration": "2025-02-07T11:50:42",
        "operations": [
          {
            "type": "vote_operation",
            "value": {
              "voter": "ecency",
              "author": "alzee",
              "weight": 100,
              "permlink": "13562877099-8088131425"
            }
          },
          {
            "type": "vote_operation",
            "value": {
              "voter": "ecency.stats",
              "author": "alzee",
              "weight": 100,
              "permlink": "13562877099-8088131425"
            }
          },
          {
            "type": "vote_operation",
            "value": {
              "voter": "ecency.waves",
              "author": "alzee",
              "weight": 100,
              "permlink": "13562877099-8088131425"
            }
          },
          {
            "type": "vote_operation",
            "value": {
              "voter": "esteem.app",
              "author": "alzee",
              "weight": 100,
              "permlink": "13562877099-8088131425"
            }
          },
          {
            "type": "vote_operation",
            "value": {
              "voter": "good-karma",
              "author": "alzee",
              "weight": 100,
              "permlink": "13562877099-8088131425"
            }
          },
          {
            "type": "vote_operation",
            "value": {
              "voter": "esteemapp",
              "author": "alzee",
              "weight": 100,
              "permlink": "13562877099-8088131425"
            }
          }
        ],
        "signatures": [
          "1f4149e010568da05380ae5beb143bb94db658567c20b73228ea84b269da7bc82208b9493535515ad4aef8c347bd8c9681b7827af9720130c20999774518cb620b",
          "1f475ba65d89c97fc82c7858ae863154d6770b0dea7aafc94e111a9c8a3bcb7cba17d29a86e93c5eae3a5f8b51f963a8532c33313bf7e3d5a43a31d8ddfaef8251",
          "1f73e14ee975d584f121c7ad3de059d4f361cdbb417a0020b911efe77632bd86044c33d276ea72fb45d1138d061c90226f6127dc163e1ac92baf3340eb1848b09f",
          "2027682ab7577d97da39f6e6ec3bfc26221e45e93336b17027523080c83843d2cc5be76380e6fda21f28ada5194adb345f6a172600cdab9377e475935a3af7e7b4",
          "2043c1aadca24f71aab3efb48aa809d06f644ef17fe7016febea9d75fb2207710a14ed0a7ae72180acab16676bdce6d05638e6bd9b719a4b41eaf201095776aab9",
          "205e09b4e5af6338f2a2d90a5d7a0a7c64203668f53beb0dd24b401cec25a347190988aaa102af008674803d6665647258f99076b3a1dc2da7c2629b1f61332d60"
        ]
      });

      const tx = await chain.createTransaction();

      const trace = await tx.generateAuthorityVerificationTrace(false, sourceTx);

      console.log(JSON.stringify(trace.collectedData));

      return trace.collectedData;
    });

    expect(retVal).toEqual([
      {
        "finalAuthorityPath":{
          "processedEntry":"ecency",
          "processedRole":"owner",
          "threshold":1,
          "weight":0,
          "recursionDepth":0,
          "processingStatus":{
            "entryAccepted":false,
            "accountAuthorityProcessingDepthExceeded":false,
            "accountAuthorityCountExceeded":false,
            "accountAuthorityPointsMissingAccount":false,
            "hasAccountAuthorityCycle":false,
            "hasInsufficientWeight":true,
            "hasMatchingPublicKey":false
          },
          "visitedEntries":[]
        },
        "matchingSignatures": []
      },
      {
        "finalAuthorityPath":{
          "processedEntry":"ecency.stats",
          "processedRole":"posting",
          "threshold":1,
          "weight":1,
          "recursionDepth":0,
          "processingStatus":{
            "entryAccepted":true,
            "isOpenAuthority":false
          },
          "visitedEntries":[
            {
              "processedEntry":"STM8jviUDRAefxmTQ9m8wNdiQV5dmCPSMDjSnztPYZpHf1yfaD6Rd",
              "processedRole":"posting",
              "threshold":1,
              "weight":1,
              "recursionDepth":0,
              "processingStatus":{
                "entryAccepted":true,
                "isOpenAuthority":false
              },
              "visitedEntries":[]
            }
          ]
        },
        "matchingSignatures":[{
          "signature":"205e09b4e5af6338f2a2d90a5d7a0a7c64203668f53beb0dd24b401cec25a347190988aaa102af008674803d6665647258f99076b3a1dc2da7c2629b1f61332d60",
          "signatureKey":"STM8jviUDRAefxmTQ9m8wNdiQV5dmCPSMDjSnztPYZpHf1yfaD6Rd"
        }]
      },
      {
        "finalAuthorityPath":{
          "processedEntry":"ecency.waves",
          "processedRole":"posting",
          "threshold":1,
          "weight":1,
          "recursionDepth":0,
          "processingStatus":{
            "entryAccepted":true,
            "isOpenAuthority":false
          },
          "visitedEntries":[
            {
              "processedEntry":"STM8UxNA8pQpL7wtvzZUrfFFz1qGxgGH6a1VnJqDTGbivsU3Mi4Mz",
              "processedRole":"posting",
              "threshold":1,
              "weight":1,
              "recursionDepth":0,
              "processingStatus":{
                "entryAccepted":true,
                "isOpenAuthority":false
              },
              "visitedEntries":[]
            }
          ]
        },
        "matchingSignatures":[{
          "signature":"2043c1aadca24f71aab3efb48aa809d06f644ef17fe7016febea9d75fb2207710a14ed0a7ae72180acab16676bdce6d05638e6bd9b719a4b41eaf201095776aab9",
          "signatureKey":"STM8UxNA8pQpL7wtvzZUrfFFz1qGxgGH6a1VnJqDTGbivsU3Mi4Mz"
        }]
      },
      {
        "finalAuthorityPath":{
          "processedEntry":"esteem.app",
          "processedRole":"posting",
          "threshold":1,
          "weight":1,
          "recursionDepth":0,
          "processingStatus":{
            "entryAccepted":true,
            "isOpenAuthority":false
          },
          "visitedEntries":[
            {
              "processedEntry":"STM64Bb5TXsiEbjjLsgVrvVttEDsLNSot9p8zJd41D5zEr5opxcHK",
              "processedRole":"posting",
              "threshold":1,
              "weight":1,
              "recursionDepth":0,
              "processingStatus":{
                "entryAccepted":true,
                "isOpenAuthority":false
              },
              "visitedEntries":[]
            }
          ]
        },
        "matchingSignatures":[{
          "signature":"1f4149e010568da05380ae5beb143bb94db658567c20b73228ea84b269da7bc82208b9493535515ad4aef8c347bd8c9681b7827af9720130c20999774518cb620b",
          "signatureKey":"STM64Bb5TXsiEbjjLsgVrvVttEDsLNSot9p8zJd41D5zEr5opxcHK"
        }]
      },
      {
        "finalAuthorityPath":{
          "processedEntry":"esteemapp",
          "processedRole":"posting",
          "threshold":1,
          "weight":1,
          "recursionDepth":0,
          "processingStatus":{
            "entryAccepted":true,
            "isOpenAuthority":false
          },
          "visitedEntries":[
            {
              "processedEntry":
              "STM7S3wsVtQotgKLN8wFLPNBALe6YHt8MPLEHuTH5CxfxdhpGPBUP",
              "processedRole":"posting",
              "threshold":1,
              "weight":1,
              "recursionDepth":0,
              "processingStatus":{
                "entryAccepted":true,
                "isOpenAuthority":false
              },
              "visitedEntries":[]
            }
          ]
        },
        "matchingSignatures":[{
          "signature":"1f475ba65d89c97fc82c7858ae863154d6770b0dea7aafc94e111a9c8a3bcb7cba17d29a86e93c5eae3a5f8b51f963a8532c33313bf7e3d5a43a31d8ddfaef8251",
          "signatureKey":"STM7S3wsVtQotgKLN8wFLPNBALe6YHt8MPLEHuTH5CxfxdhpGPBUP"
        }]
      },
      {
        "finalAuthorityPath":{
          "processedEntry":"good-karma",
          "processedRole":"posting",
          "threshold":1,
          "weight":1,
          "recursionDepth":0,
          "processingStatus":{
            "entryAccepted":true,
            "isOpenAuthority":false
          },
          "visitedEntries":[
            {
              "processedEntry":"STM5dhkPS223F9d3TCXKttuWpdWgqS2Fx8KNRQve6BMGmAvJ5GnJR",
              "processedRole":"posting",
              "threshold":1,
              "weight":1,
              "recursionDepth":0,
              "processingStatus":{
                "entryAccepted":true,
                "isOpenAuthority":false
              },
              "visitedEntries":[]
            }
          ]
        },
        "matchingSignatures":[{
          "signature":"1f73e14ee975d584f121c7ad3de059d4f361cdbb417a0020b911efe77632bd86044c33d276ea72fb45d1138d061c90226f6127dc163e1ac92baf3340eb1848b09f",
          "signatureKey":"STM5dhkPS223F9d3TCXKttuWpdWgqS2Fx8KNRQve6BMGmAvJ5GnJR"
        }]
      }
    ]);
  });

  test('Should be able to get authority trace with mock data for transaction with one required authority with threshold 2', async ({ waxTest }) => {
    const retVal = await waxTest(async({ chain }) => {
      const sourceTx = chain.createTransactionFromJson({
        "ref_block_num": 15353,
        "ref_block_prefix": 1141939857,
        "expiration": "2025-02-10T12:11:41",
        "operations": [
          {
            "type": "vote_operation",
            "value": {
              "voter": "alice",
              "author": "bob",
              "permlink": "example-post",
              "weight": 10000
            }
          },
          {
            "type":"vote_operation",
            "value": {
              "voter": "alice",
              "author": "bob",
              "permlink": "example-post",
              "weight": 10000
            }
          }
        ],
        "extensions": [],
        "signatures": [
          "1f32e76fbebe2a92a2b83953e62460ef150bac1ab0989bc5338bbc3a3978c077573403787d509b669f548ccdc06ec6c1995dadd51b5221172635df0f1a443a4d8f",
          "209b7e96212bf1d776187d9321e083eddfed55f9b4b2bf58034302255eb7b8402e436519b4d391bc54462920a9fb1e36b5f60c951e51895f0e19ac3b22f1a97af1"
        ]
      });

      const tx = await chain.createTransaction();

      const trace = await tx.generateAuthorityVerificationTrace(false, sourceTx);

      console.log(JSON.stringify(trace.collectedData));

      return trace.collectedData;
    });

    expect(retVal).toStrictEqual([
      {
        "finalAuthorityPath": {
          "processedEntry": "alice",
          "processedRole": "posting",
          "processingStatus": {
            "entryAccepted": true,
            "isOpenAuthority": false
          },
          "recursionDepth": 0,
          "threshold": 2,
          "visitedEntries": [
            {
              "processedEntry": "STM5RqVBAVNp5ufMCetQtvLGLJo7unX9nyCBMMrTXRWQ9i1Zzzizh",
              "processedRole": "posting",
              "processingStatus": {
                "accountAuthorityCountExceeded": false,
                "accountAuthorityPointsMissingAccount": false,
                "accountAuthorityProcessingDepthExceeded": false,
                "entryAccepted": false,
                "hasAccountAuthorityCycle": false,
                "hasInsufficientWeight": true,
                "hasMatchingPublicKey": true,
              },
              "recursionDepth": 0,
              "threshold": 2,
              "visitedEntries": [],
              "weight": 1,
            },
            {
              "processedEntry": "STM6a34GANY5LD8deYvvfySSWGd7sPahgVNYoFPapngMUD27pWb45",
              "processedRole": "posting",
              "processingStatus": {
                "accountAuthorityCountExceeded": false,
                "accountAuthorityPointsMissingAccount": false,
                "accountAuthorityProcessingDepthExceeded": false,
                "entryAccepted": false,
                "hasAccountAuthorityCycle": false,
                "hasInsufficientWeight": true,
                "hasMatchingPublicKey": true
              },
              "recursionDepth": 0,
              "threshold": 2,
              "visitedEntries": [],
              "weight": 1
            }
          ],
          "weight": 2
        },
        "matchingSignatures": [{
          "signature": "1f32e76fbebe2a92a2b83953e62460ef150bac1ab0989bc5338bbc3a3978c077573403787d509b669f548ccdc06ec6c1995dadd51b5221172635df0f1a443a4d8f",
          "signatureKey": "STM5RqVBAVNp5ufMCetQtvLGLJo7unX9nyCBMMrTXRWQ9i1Zzzizh"
          },
          {
          "signature": "209b7e96212bf1d776187d9321e083eddfed55f9b4b2bf58034302255eb7b8402e436519b4d391bc54462920a9fb1e36b5f60c951e51895f0e19ac3b22f1a97af1",
          "signatureKey": "STM6a34GANY5LD8deYvvfySSWGd7sPahgVNYoFPapngMUD27pWb45"
        }]
      }
    ]);
  });

  test('Should be able to get authority trace with mock data for 5 signatures where one of the public keys does not match any account', async ({ waxTest }) => {
    const retVal = await waxTest(async({ chain }) => {
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

      console.log(JSON.stringify(trace.collectedData));

      return trace.collectedData;
    });

    expect(retVal).toStrictEqual([
      {
        "finalAuthorityPath":{
          "processedEntry":"ecency",
          "processedRole":"posting",
          "threshold":1,
          "weight":1,
          "recursionDepth":0,
          "processingStatus":{
            "entryAccepted":true,
            "isOpenAuthority":false
          },
          "visitedEntries":[
            {
              "processedEntry":"STM8AZuk2ja5vSFySFL2zpB9bNew8wJAg8r4QFtbnoamEX8Jvvq43",
              "processedRole":"posting",
              "threshold":1,
              "weight":1,
              "recursionDepth":0,
              "processingStatus":{
                "entryAccepted":true,
                "isOpenAuthority":false
              },
              "visitedEntries":[]
            }
          ]
        },
        "matchingSignatures":[{
          "signature":"205f0e25631bdbcd37669b2f6c36594d0153e468be8b2b6a57f8eae49538132efd0dde1ad6a707788d6a2024efd03a55dd0bb478a40eedce48f6e5db19d365bce5",
          "signatureKey":"STM8AZuk2ja5vSFySFL2zpB9bNew8wJAg8r4QFtbnoamEX8Jvvq43"
        }]
      },
      {
        "finalAuthorityPath":{
          "processedEntry":"ecency.stats",
          "processedRole":"posting",
          "threshold":1,
          "weight":1,
          "recursionDepth":0,
          "processingStatus":{
            "entryAccepted":true,
            "isOpenAuthority":false
          },
          "visitedEntries":[
            {
              "processedEntry":"STM8jviUDRAefxmTQ9m8wNdiQV5dmCPSMDjSnztPYZpHf1yfaD6Rd",
              "processedRole":"posting",
              "threshold":1,
              "weight":1,
              "recursionDepth":0,
              "processingStatus":{
                "entryAccepted":true,
                "isOpenAuthority":false
              },
              "visitedEntries":[]
            }
          ]
        },
        "matchingSignatures":[{
          "signature":"20223edff229382e67031d993c13d26062ab4d33c45ede7aced7f1e432d6b6d57a4fd68eae708f562a9644ee08ea447fa354febe34aa8ba14a434c66adc753774f",
          "signatureKey":"STM8jviUDRAefxmTQ9m8wNdiQV5dmCPSMDjSnztPYZpHf1yfaD6Rd"
        }]
      },
      {
        "finalAuthorityPath":{
          "processedEntry":"esteem.app",
          "processedRole":"posting",
          "threshold":1,
          "weight":1,
          "recursionDepth":0,
          "processingStatus":{
            "entryAccepted":true,
            "isOpenAuthority":false
          },
          "visitedEntries":[
            {
              "processedEntry":"STM64Bb5TXsiEbjjLsgVrvVttEDsLNSot9p8zJd41D5zEr5opxcHK",
              "processedRole":"posting",
              "threshold":1,
              "weight":1,
              "recursionDepth":0,
              "processingStatus":{
                "entryAccepted":true,
                "isOpenAuthority":false
              },
              "visitedEntries":[]
            }
          ]
        },
        "matchingSignatures":[{
          "signature":"20286bd3b0ad2ecb01488ce866361b4fcd53b1f3dac41962496986fdf89c89c20a0e86f8dd2669ed14b6dafc3e0bb0d24ec54a794ee6c0b563275a22a122992ac1",
          "signatureKey":"STM64Bb5TXsiEbjjLsgVrvVttEDsLNSot9p8zJd41D5zEr5opxcHK"
        }]
      },
      {
        "finalAuthorityPath":{
          "processedEntry":"esteemapp",
          "processedRole":"posting",
          "threshold":1,
          "weight":1,
          "recursionDepth":0,
          "processingStatus":{
            "entryAccepted":true,
            "isOpenAuthority":false
          },
          "visitedEntries":[
            {
              "processedEntry":
              "STM7S3wsVtQotgKLN8wFLPNBALe6YHt8MPLEHuTH5CxfxdhpGPBUP",
              "processedRole":"posting",
              "threshold":1,
              "weight":1,
              "recursionDepth":0,
              "processingStatus":{
                "entryAccepted":true,
                "isOpenAuthority":false
              },
              "visitedEntries":[]
            }
          ]
        },
        "matchingSignatures":[{
          "signature":"1f4141e7645dd2bdcdb2001baea165e668a6f9c2a366f6fd2f3e9d878f071f5eb052509eb666b80c1e0daaa7fdec36e3de827087dcd3015c8672b536ddddbc5726",
          "signatureKey":"STM7S3wsVtQotgKLN8wFLPNBALe6YHt8MPLEHuTH5CxfxdhpGPBUP"
        }]
      },
      {
        "finalAuthorityPath":{
          "processedEntry":"good-karma",
          "processedRole":"owner",
          "threshold":1,
          "weight":0,
          "recursionDepth":0,
          "processingStatus":{
            "entryAccepted":false,
            "accountAuthorityProcessingDepthExceeded":false,
            "accountAuthorityCountExceeded":false,
            "accountAuthorityPointsMissingAccount":false,
            "hasAccountAuthorityCycle":false,
            "hasInsufficientWeight":true,
            "hasMatchingPublicKey":false
          },
          "visitedEntries":[]
        },
        "matchingSignatures": []
      }
    ]);
  });

  test('Should be able to get authority trace with mock data for transaction with one required authority with threshold 2 (one signature direct and the other one redirected)', async ({ waxTest }) => {
    const retVal = await waxTest(async({ chain }) => {
      const sourceTx = chain.createTransactionFromJson({
        "ref_block_num": 55285,
        "ref_block_prefix": 3183350724,
        "expiration": "2025-03-04T09:40:37",
        "operations": [
          {
            "type": "vote_operation",
            "value": {
              "voter": "alice",
              "author": "test",
              "permlink": "test",
              "weight": 10000
            }
          }
        ],
        "extensions": [],
        "signatures": [
          "20a5932916064c776785df77821b0aaaa442af49faab4304083764de0a25de4ab660aec343efdb443ffa479446dfd1f433f3b968ad8f821c9497e4671f762e0d3a",
          "2068fd39a6a9751877b707e56adf1b8a814b02a7168e0be906e295daf4e35fbe072bf5dba4bfe5567239ed88aab84449bec09237b504ee5a0afaa1fb1e51770947"
        ]
      });

      const tx = await chain.createTransaction();

      const trace = await tx.generateAuthorityVerificationTrace(false, sourceTx);

      console.log(JSON.stringify(trace.collectedData));

      return trace.collectedData;
    });

    expect(retVal).toStrictEqual([
      {
        "finalAuthorityPath": {
          "processedEntry": "alice",
          "processedRole": "posting",
          "threshold": 2,
          "weight": 2,
          "recursionDepth": 0,
          "processingStatus": {
            "entryAccepted": true,
            "isOpenAuthority": false
          },
          "visitedEntries": [
            {
              "processedEntry": "STM5RqVBAVNp5ufMCetQtvLGLJo7unX9nyCBMMrTXRWQ9i1Zzzizh",
              "processedRole": "posting",
              "threshold": 2,
              "weight": 1,
              "recursionDepth": 0,
              "processingStatus": {
                "entryAccepted": false,
                "accountAuthorityProcessingDepthExceeded": false,
                "accountAuthorityCountExceeded": false,
                "accountAuthorityPointsMissingAccount": false,
                "hasAccountAuthorityCycle": false,
                "hasInsufficientWeight": true,
                "hasMatchingPublicKey": true
              },
              "visitedEntries": []
            },
            {
              "processedEntry": "guest4test8",
              "processedRole": "posting",
              "threshold": 1,
              "weight": 1,
              "recursionDepth": 1,
              "processingStatus": {
                "entryAccepted": true,
                "isOpenAuthority": false
              },
              "visitedEntries": [
                {
                  "processedEntry": "STM6ooSpKC7jEhujcCakiH881MSgJhddrVb1dNCc1h47wF2nqB9zb",
                  "processedRole": "posting",
                  "threshold": 1,
                  "weight": 1,
                  "recursionDepth": 1,
                  "processingStatus": {
                    "entryAccepted": true,
                    "isOpenAuthority": false
                  },
                  "visitedEntries": []
                }
              ]
            }
          ]
        },
        "matchingSignatures": [
          {
            "signature": "2068fd39a6a9751877b707e56adf1b8a814b02a7168e0be906e295daf4e35fbe072bf5dba4bfe5567239ed88aab84449bec09237b504ee5a0afaa1fb1e51770947",
            "signatureKey": "STM5RqVBAVNp5ufMCetQtvLGLJo7unX9nyCBMMrTXRWQ9i1Zzzizh"
          },
          {
          "signature": "20a5932916064c776785df77821b0aaaa442af49faab4304083764de0a25de4ab660aec343efdb443ffa479446dfd1f433f3b968ad8f821c9497e4671f762e0d3a",
          "signatureKey": "STM6ooSpKC7jEhujcCakiH881MSgJhddrVb1dNCc1h47wF2nqB9zb"
        }]
      }
    ]);
  });

  test.afterAll(async () => {
    await closeServer();
  });
});
