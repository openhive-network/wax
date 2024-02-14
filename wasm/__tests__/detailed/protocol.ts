import { ChromiumBrowser, ConsoleMessage, chromium } from 'playwright';
import { expect } from '@playwright/test';

import { test } from '../assets/jest-helper';
import { numToHighLow, transaction, serialization_sensitive_transaction, vote_operation } from "../assets/data.protocol";

import "../assets/globals-wasm";

let browser!: ChromiumBrowser;

let privateKey!: string;

test.describe('WASM Protocol', () => {
  test.beforeAll(async () => {
    browser = await chromium.launch({
      headless: true
    });
  });

  test.beforeEach(async({ page }) => {
    page.on('console', (msg: ConsoleMessage) => {
      console.log('>>', msg.type(), msg.text())
    });

    await page.goto("http://localhost:8080/wasm/__tests__/assets/test-wasm.html", { waitUntil: "load" });
    await page.waitForFunction(() => waxScriptLoaded); // Wait until async scripts load
  });

  test('Should be able to generate random private key', async ({ dual }) => {
    const retVal = await dual.dynamic(() => {
      return protocol.cpp_generate_private_key();
    });

    expect(retVal.exception_message).toHaveLength(0);

    privateKey = retVal.content as string;
  });

  test('Should be able to calculate public key', async ({ dual }) => {
    const retVal = await dual((privateKey) => {
      return protocol.cpp_calculate_public_key(privateKey);
    }, privateKey);

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.content).toMatch(/^[1-9A-HJ-NP-Za-km-z]+$/m);
  });

  test('Should be able to calculate the transaction id', async ({ dual }) => {
    const retVal = await dual((transaction) => {
      return protocol.cpp_calculate_transaction_id(transaction);
    }, transaction);

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.content).toBe("da8ca54c9c3acad06915ae9d93988c367f5cd164");
  });

  test('Should be able to calculate the legacy transaction id of the serialization sensitive transaction', async ({ dual }) => {
    const retVal = await dual((serialization_sensitive_transaction) => {
      return protocol.cpp_calculate_legacy_transaction_id(serialization_sensitive_transaction);
    }, serialization_sensitive_transaction);

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.content).toBe("7f34699e9eea49d1bcc10c88f96e38897839ece3"); /// See Hive mainnet block 80021416
  });

  test('Should be able to calculate the HF26 transaction id of the serialization sensitive transaction', async ({ dual }) => {
    const retVal = await dual((serialization_sensitive_transaction) => {
      return protocol.cpp_calculate_transaction_id(serialization_sensitive_transaction);
    }, serialization_sensitive_transaction);

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.content).toBe("3725c81634f152011e2043eb7119911b953d4267"); /// See Hive mainnet block 80021416
  });

  test('Should be able to serialize the transaction', async ({ dual }) => {
    const retVal = await dual((transaction) => {
      return protocol.cpp_serialize_transaction(transaction);
    }, transaction);

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.content).toBe("ff86c404c24b152fb7610100046f746f6d076330666633336108657778686e6a626a98080000");
  });

  test('Should be able to calculate sig digest of the transaction', async ({ dual }) => {
    const retVal = await dual((transaction) => {
      return protocol.cpp_calculate_sig_digest(transaction, "beeab0de00000000000000000000000000000000000000000000000000000000");
    }, transaction);

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.content).toBe("1394412814ea3e444f65c46f075e15b9b82e6bea9241319b02743a8e593219e1");
  });

  test('Should be able to validate example operation', async ({ dual }) => {
    const retVal = await dual((operation) => {
      return protocol.cpp_validate_operation(operation);
    }, JSON.stringify(vote_operation));

    expect(retVal.exception_message).toHaveLength(0);
  });

  test('Should be able to validate example transaction', async ({ dual }) => {
    const retVal = await dual((transaction) => {
      return protocol.cpp_validate_transaction(transaction);
    }, transaction);

    expect(retVal.exception_message).toHaveLength(0);
  });

  test('Should be able to calculate manabar full regeneration time', async ({ dual }) => {
    const retVal = await dual((args: number[]) => {
      return protocol.cpp_calculate_manabar_full_regeneration_time(args[0], args[1], args[2], args[3], args[4], args[5]);
    }, [ 0, ...numToHighLow(100), ...numToHighLow(100), 0 ]);

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.content).toBe("0");
  });

  test('Should be able to calculate the current manabar full regeneration time', async ({ dual }) => {
    const retVal = await dual((args: number[]) => {
      return protocol.cpp_calculate_current_manabar_value(args[0], args[1], args[2], args[3], args[4], args[5]);
    }, [ 0, ...numToHighLow(100), ...numToHighLow(100), 0 ]);

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.content).toBe("100");
  });

  test('Should be able to create Hive in NAI form', async ({ dual }) => {
    const retVal = await dual((args: number[]) => {
      return protocol.cpp_hive(args[0], args[1]);
    }, numToHighLow(10));

    expect(retVal).toEqual({
      nai: "@@000000021",
      precision: 3,
      amount: "10"
    });
  });

  test('Should be able to create Hive in NAI form - large integer', async ({ dual }) => {
    const retVal = await dual((args: number[]) => {
      return protocol.cpp_hive(args[0], args[1]);
    }, numToHighLow(10000000000));

    expect(retVal).toEqual({
      nai: "@@000000021",
      precision: 3,
      amount: "10000000000"
    });
  });

  test('Should be able to create HBD in NAI form', async ({ dual }) => {
    const retVal = await dual((args: number[]) => {
      return protocol.cpp_hbd(args[0], args[1]);
    }, numToHighLow(Number.MAX_SAFE_INTEGER + 1));

    expect(retVal).toEqual({
      nai: "@@000000013",
      precision: 3,
      amount: `${Number.MAX_SAFE_INTEGER + 1}`
    });
  });

  test('Should be able to create VESTS in NAI form', async ({ dual }) => {
    const retVal = await dual((args: number[]) => {
      return protocol.cpp_vests(args[0], args[1]);
    }, numToHighLow(Number.MIN_SAFE_INTEGER));

    expect(retVal).toEqual({
      nai: "@@000000037",
      precision: 6,
      amount: `${Number.MIN_SAFE_INTEGER}`
    });
  });

  test('Should be able to create custom general asset in NAI form', async ({ dual }) => {
    const retVal = await dual((args: number[]) => {
      return protocol.cpp_general_asset(3200000035, args[0], args[1]);
    }, numToHighLow(10));

    expect(retVal).toEqual({
      nai: "@@000000021",
      precision: 3,
      amount: "10"
    });
  });

  test('Should be able to calculate HP APR 1', async ({ dual }) => {
    const retVal = await dual((args: number []) => {
      const virtual_supply = protocol.cpp_hive(args[2], args[3]);
      const total_vesting_fund_hive = protocol.cpp_hive(args[4], args[5]);
      return protocol.cpp_calculate_hp_apr(args[0], args[1], virtual_supply, total_vesting_fund_hive);
    }, [1_000_000, 1_500, ...numToHighLow(530_656_835_180), ...numToHighLow(173_009_633_181)]);

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.content).toEqual("4.48");
  });

  test('Should be able to calculate HP APR 2', async ({ dual }) => {
    const retVal = await dual((args: number[]) => {
      const virtual_supply = protocol.cpp_hive(args[2], args[3]);
      const total_vesting_fund_hive = protocol.cpp_hive(args[4], args[5]);
      return protocol.cpp_calculate_hp_apr(args[0], args[1], virtual_supply, total_vesting_fund_hive);
    }, [82_779_364, 1_500, ...numToHighLow(530_656_835_180), ...numToHighLow(173_009_633_181)]);

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.content).toEqual("2.97");
  });

  test.afterAll(async () => {
    await browser.close();
  });
});
