import { ChromiumBrowser, ConsoleMessage, chromium } from 'playwright';
import { expect } from '@playwright/test';

import { DEFAULT_STORAGE_ROOT } from "@hiveio/beekeeper/node";
import fs from "fs";

import { test } from '../assets/jest-helper';
import { serialization_sensitive_transaction, legacyApiTransaction, signatureTransaction } from '../assets/data.protocol';

let browser!: ChromiumBrowser;

test.describe('Wax object interface chain tests (using custom options)', () => {
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

  test('Should be able to use different options', async ({ waxTest, config }) => {
    expect(config).toBeDefined;

    const retVal = await waxTest(async({ wax, chain }) => {
      const myChain = await wax.createHiveChain(config);
      const chainEndpointUrl = chain.endpointUrl;

      const myChainEndpointUrl = myChain.endpointUrl;

      return {
        myChainEndpointUrl,
        chainEndpointUrl
      };
    });

    expect(retVal.myChainEndpointUrl).toBe('https://api.hive.blog/');
    expect(config!.chainId).toBe('beeab0de00000000000000000000000000000000000000000000000000000000');
    expect(retVal.myChainEndpointUrl).toBe(config!.apiEndpoint);
    expect(retVal.chainEndpointUrl).toBe(config!.apiEndpoint);
   });

  test('Should be able to bidirectional convert legacy api to proto using object interface', async ({ waxTest }) => {
    const retVal = await waxTest(async({ chain }, serialization_sensitive_transaction) => {
      const tx = chain.Transaction.fromApi(serialization_sensitive_transaction);

      return tx.toLegacyApi();
    }, serialization_sensitive_transaction);

    expect(retVal).toBe(legacyApiTransaction);
  });

  test('Should be able to calculate from api properties from hive chain interface with signature transaction provided', async ({ waxTest }) => {
    const retVal = await waxTest(async({ chain }, signatureTransaction) => {
      const stringifiedTransaction = JSON.stringify(signatureTransaction);
      const tx = chain.Transaction.fromApi(stringifiedTransaction);

      return {
        signatureKeys: tx.signatureKeys[0],
        legacySignatureKeys: tx.legacy_signatureKeys[0],
        isSigned: tx.isSigned()
      };
    }, signatureTransaction);

    expect(retVal.signatureKeys).toBe('STM5wJarof5LWBiQu2umDUWgg1xD5QHpKQC1Z97sE2aoQdwQ8DwMf');
    expect(retVal.legacySignatureKeys).toBe('STM5wJarof5LWBiQu2umDUWgg1xD5QHpKQC1Z97sE2aoQdwQ8DwMf');
    expect(retVal.isSigned).toBe(true);

  });

  test('Should be able to calculate from api properties from hive chain interface with serialization sensitive transaction provided', async ({ waxTest }) => {
    const retVal = await waxTest(async({ chain }, serialization_sensitive_transaction) => {
      const tx = chain.Transaction.fromApi(serialization_sensitive_transaction);

      return {
        sigDigest: tx.sigDigest,
        legacySigDigest: tx.legacy_sigDigest,
        id: tx.id,
        legacyId: tx.legacy_id
      };
    }, serialization_sensitive_transaction);

    expect(retVal.sigDigest).toBe('8758db23c6aea40564697620ff61625b45c3b538cda21ded9fd6ec229caa1ee9');
    expect(retVal.legacySigDigest).toBe('7fbd09ff2c3a90acfc59adce5abffdaa3fc95e33160c5ac237f0f4366f90e2fe');
    expect(retVal.id).toBe('3725c81634f152011e2043eb7119911b953d4267');
    expect(retVal.legacyId).toBe('7f34699e9eea49d1bcc10c88f96e38897839ece3');
  });

  test('Should be able to get transaction key references from hive chain interafce', async({ waxTest }) => {
    const retVal = await waxTest(async({ chain }) => {
      return chain.api.account_by_key_api.get_key_references({ keys: ['STM5wJarof5LWBiQu2umDUWgg1xD5QHpKQC1Z97sE2aoQdwQ8DwMf'] });
    });

    expect(retVal).toStrictEqual({'accounts': [['thatcryptodave']]});
  });

  test('Should be able to get transaction block from hive chain interafce', async({ waxTest }) => {
    const retVal = await waxTest(async({ chain }) => {
      return (await chain.api.block_api.get_block({ block_num: 26295 })).block;
    });

    expect(retVal).toBeDefined();
  });

  test('Should be able to get transaction block header from hive chain interafce', async({ waxTest }) => {
    const retVal = await waxTest(async({ chain }) => {
      return (await chain.api.block_api.get_block_header({ block_num: 26295 })).header;
    });

    expect(retVal).toBeDefined();
  });

  test('Should be able to get transaction block range from hive chain interafce', async({ waxTest }) => {
    const retVal = await waxTest(async({ chain }) => {
      return (await chain.api.block_api.get_block_range({ starting_block_num: 26295, count: 5 })).blocks;
    });

    expect(retVal).toHaveLength(5);
    expect(retVal[0].block_id).toBe('000066b76f6014ae4ab9407552d7859911cf5cad');
  });

  test('Should be able to find accounts from hive chain interafce', async({ waxTest }) => {
    const retVal = await waxTest(async({ chain }) => {
      return (await chain.api.database_api.find_accounts({ accounts: ['thatcryptodave'] })).accounts[0];
    });

    expect(retVal).toHaveProperty('active');
    expect(retVal).toHaveProperty('owner');
    expect(retVal).toHaveProperty('posting');
  });

  test('Should be able to get dynamic global properties from hive chain interafce', async({ waxTest }) => {
    const retVal = await waxTest(async({ chain }) => {
      return (await chain.api.database_api.get_dynamic_global_properties({})).id;
    });

    expect(retVal).toBe(0);
  });

  test('Should be able to get verify authority from hive chain interafce', async({ waxTest }) => {
    const retVal = await waxTest(async({ chain, wax }, signatureTransaction) => {
      return (await chain.api.database_api.verify_authority({ trx: signatureTransaction, pack: wax.TTransactionPackType.HF_26 })).valid;
    }, signatureTransaction);

    expect(retVal).toBe(true);
  });

  test('Should be able to find rc accounts from hive chain interafce', async({ waxTest }) => {
    const retVal = await waxTest(async({ chain }) => {
      return (await chain.api.rc_api.find_rc_accounts({ accounts: ['thatcryptodave'] })).rc_accounts[0].account;
    });

    expect(retVal).toBe('thatcryptodave');
  });

   test.afterAll(async () => {
    await browser.close();
  });
});
