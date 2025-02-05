import { expect } from '@playwright/test';

import { test } from '../assets/jest-helper';
import { createServer } from '../assets/proxy-mock-server';
import { JsonRpcMock } from '../assets/api-mock';
import jsonRpcMock from '../assets/mock/jsonRpcMock';
import steem from '../assets/mock/data/steem';
import data4nonexistingAccount from "../assets/mock/data/data4nonexistingaccount";

let closeServer: () => Promise<void>;

test.describe('Wax base mock tests', () => {
  test.beforeAll(async () => {
    closeServer = await createServer(new JsonRpcMock(jsonRpcMock), 'localhost', 8000);
  });

  test('Should be able to find account based on mock interface', async ({ waxTest }) => {
    const retVal = await waxTest(async({ chain }, account) => {
      const foundAccount = await chain.api.database_api.find_accounts({ accounts: ['steem'] });

      console.log(JSON.stringify(foundAccount));

      return JSON.stringify(foundAccount) === JSON.stringify(account.result);
    }, steem);

    expect(retVal).toBe(true);
  });

  test('Should be able to find NONEXISTING account based on mock interface', async ({ waxTest }) => {
    const retVal = await waxTest(async({ chain }, accountData) => {
      const foundAccount = await chain.api.database_api.find_accounts({ accounts: ['0steem'] }); /// Intentionally use invalid name in Hive

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

      return trace.finalAuthorityPath;
    });

    expect(retVal).toEqual([
      {
        "processedEntry": "andablackwidow",
        "processedRole": "posting",
        "processingStatus": {
          "entryAccepted": true,
          "isOpenAuthority": false
        },
        "recursionDepth": 0,
        "threshold": 1,
        "visitedEntries": [
          {
            "processedEntry": "STM7UEziXTT9CMCTLvSpWsS974XiYCGSb9jP3ycriAXFFoQVWxzZK",
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

  test('Should be able to get authority trace with mock data with delegated authority where 2 accounts are required to satisfy threshold', async ({ waxTest }) => {
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

      return trace.finalAuthorityPath;
    });

    expect(retVal).toEqual([
      {
        "processedEntry": "sunnyvo",
        "processedRole": "posting",
        "processingStatus": {
          "accountAuthorityCountExceeded": false,
          "accountAuthorityPointsMissingAccount": false,
          "accountAuthorityProcessingDepthExceeded": false,
          "entryAccepted": false,
          "hasAccountAuthorityCycle": false,
          "hasInsufficientWeight": true,
          "hasMatchingPublicKey": false,
        },
        "recursionDepth": 0,
        "threshold": 1,
        "visitedEntries": [
          {
            "processedEntry": "STM7UEziXTT9CMCTLvSpWsS974XiYCGSb9jP3ycriAXFFoQVWxzZK",
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

      return trace.finalAuthorityPath;
    });

    expect(retVal).toEqual([
      {
        "processedEntry": "sunnyvo",
        "processedRole": "posting",
        "processingStatus": {
          "accountAuthorityCountExceeded": false,
          "accountAuthorityPointsMissingAccount": false,
          "accountAuthorityProcessingDepthExceeded": false,
          "entryAccepted": false,
          "hasAccountAuthorityCycle": false,
          "hasInsufficientWeight": true,
          "hasMatchingPublicKey": false,
        },
        "recursionDepth": 0,
        "threshold": 1,
        "visitedEntries": [
          {
            "processedEntry": "STM7UEziXTT9CMCTLvSpWsS974XiYCGSb9jP3ycriAXFFoQVWxzZK",
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

  test.afterAll(async () => {
    await closeServer();
  });
});
