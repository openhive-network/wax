import { ChromiumBrowser, ConsoleMessage, chromium } from 'playwright';
import { expect } from '@playwright/test';

import { test } from '../assets/jest-helper';
import { numToHighLow, transaction, serialization_sensitive_transaction, witness_properties, vote_operation } from "../assets/data.protocol";

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

    await page.goto("http://localhost:8080/wasm/__tests__/assets/test.html", { waitUntil: "load" });
  });

  test('Should be able to generate random private key', async ({ wasmTest }) => {
    const retVal = await wasmTest.dynamic(({ protocol }) => {
      return protocol.cpp_generate_private_key();
    });

    expect(retVal.exception_message).toHaveLength(0);

    privateKey = retVal.content as string;
  });

  test('Should be able to generate random private key using password', async ({ wasmTest }) => {
    const retVal = await wasmTest(({ protocol }) => {
      return protocol.cpp_generate_private_key_password_based("gtg", "active", "verysecurepassword");
    });

    expect(retVal.associated_public_key).toBe("STM6JswFatSixhR9AMUP38rtpMVAagTvxGYu7d8i2JUK1QZDkPbH3");
    expect(retVal.wif_private_key).toBe("5J89tdX8b1wQJHcqDMDVn1UwvtiYFK53PQEgG5gL5oCEk83Us12");
  });

  test('Should be able to suggest brain key', async ({ wasmTest }) => {
    const retVal = await wasmTest.dynamic(({ protocol }) => {
      return protocol.cpp_suggest_brain_key();
    });

    expect(retVal.associated_public_key).toHaveLength(53);
    expect((retVal.brain_key as string).length).toBeGreaterThan(0);
    expect(retVal.wif_private_key).toHaveLength(51);
  });

  test('Should be able to calculate public key', async ({ wasmTest }) => {
    const retVal = await wasmTest(({ protocol }, privateKey) => {
      return protocol.cpp_calculate_public_key(privateKey);
    }, privateKey);

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.content).toMatch(/^[1-9A-HJ-NP-Za-km-z]+$/m);
  });

  test('Should be able to calculate the transaction id', async ({ wasmTest }) => {
    const retVal = await wasmTest(({ protocol }, transaction) => {
      return protocol.cpp_calculate_transaction_id(transaction);
    }, transaction);

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.content).toBe("da8ca54c9c3acad06915ae9d93988c367f5cd164");
  });

  test('Should be able to calculate the legacy transaction id of the serialization sensitive transaction', async ({ wasmTest }) => {
    const retVal = await wasmTest(({ protocol }, serialization_sensitive_transaction) => {
      return protocol.cpp_calculate_legacy_transaction_id(serialization_sensitive_transaction);
    }, serialization_sensitive_transaction);

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.content).toBe("7f34699e9eea49d1bcc10c88f96e38897839ece3"); /// See Hive mainnet block 80021416
  });

  test('Should be able to calculate the HF26 transaction id of the serialization sensitive transaction', async ({ wasmTest }) => {
    const retVal = await wasmTest(({ protocol }, serialization_sensitive_transaction) => {
      return protocol.cpp_calculate_transaction_id(serialization_sensitive_transaction);
    }, serialization_sensitive_transaction);

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.content).toBe("3725c81634f152011e2043eb7119911b953d4267"); /// See Hive mainnet block 80021416
  });

  test('Should be able to serialize the transaction', async ({ wasmTest }) => {
    const retVal = await wasmTest(({ protocol }, transaction) => {
      return protocol.cpp_serialize_transaction(transaction);
    }, transaction);

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.content).toBe("ff86c404c24b152fb7610100046f746f6d076330666633336108657778686e6a626a98080000");
  });

  test('Should be able to calculate sig digest of the transaction', async ({ wasmTest }) => {
    const retVal = await wasmTest(({ protocol }, transaction) => {
      return protocol.cpp_calculate_sig_digest(transaction, "beeab0de00000000000000000000000000000000000000000000000000000000");
    }, transaction);

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.content).toBe("1394412814ea3e444f65c46f075e15b9b82e6bea9241319b02743a8e593219e1");
  });

  test('Should be able to calculate legacy sig digest of the transaction', async ({ wasmTest }) => {
    const retVal = await wasmTest(({ protocol }, serialization_sensitive_transaction) => {
      return protocol.cpp_calculate_legacy_sig_digest(serialization_sensitive_transaction, "beeab0de00000000000000000000000000000000000000000000000000000000");
    }, serialization_sensitive_transaction);

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.content).toBe("7fbd09ff2c3a90acfc59adce5abffdaa3fc95e33160c5ac237f0f4366f90e2fe");
  });

  test('Should be able to validate example operation', async ({ wasmTest }) => {
    const retVal = await wasmTest(({ protocol }, operation) => {
      return protocol.cpp_validate_operation(operation);
    }, JSON.stringify(vote_operation));

    expect(retVal.exception_message).toHaveLength(0);
  });

  test('Should be able to validate example transaction', async ({ wasmTest }) => {
    const retVal = await wasmTest(({ protocol }, transaction) => {
      return protocol.cpp_validate_transaction(transaction);
    }, transaction);

    expect(retVal.exception_message).toHaveLength(0);
  });

  test('Should be able to calculate manabar full regeneration time', async ({ wasmTest }) => {
    const retVal = await wasmTest(({ protocol }, ...args) => {
      return protocol.cpp_calculate_manabar_full_regeneration_time(...args);
    }, 0, ...numToHighLow(100), ...numToHighLow(100), 0);

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.content).toBe("0");
  });

  test('Should be able to calculate manabar full regeneration time (relaxed)', async ({ wasmTest }) => {
    const retVal = await wasmTest(({ protocol }, ...args) => {
      return protocol.cpp_calculate_manabar_full_regeneration_time(...args);
    }, 0, ...numToHighLow(100), ...numToHighLow(100), 10);

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.content).toBe("10");
  });

  test('Should be able to calculate the current manabar value', async ({ wasmTest }) => {
    const retVal = await wasmTest(({ protocol }, ...args) => {
      return protocol.cpp_calculate_current_manabar_value(...args);
    }, 0, ...numToHighLow(100), ...numToHighLow(100), 0);

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.content).toBe("100");
  });

  test('Should be able to calculate the current manabar value (relaxed)', async ({ wasmTest }) => {
    const retVal = await wasmTest(({ protocol }, ...args) => {
      return protocol.cpp_calculate_current_manabar_value(...args);
    }, 0, ...numToHighLow(100), ...numToHighLow(100), 10);

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.content).toBe("100");
  });

  test('Should be able to create Hive in NAI form', async ({ wasmTest }) => {
    const retVal = await wasmTest(({ protocol }, ...args) => {
      return protocol.cpp_hive(...args);
    }, ...numToHighLow(10));

    expect(retVal).toEqual({
      nai: "@@000000021",
      precision: 3,
      amount: "10"
    });
  });

  test('Should be able to create Hive in NAI form - large integer', async ({ wasmTest }) => {
    const retVal = await wasmTest(({ protocol }, ...args) => {
      return protocol.cpp_hive(...args);
    }, ...numToHighLow(10000000000));

    expect(retVal).toEqual({
      nai: "@@000000021",
      precision: 3,
      amount: "10000000000"
    });
  });

  test('Should be able to create HBD in NAI form', async ({ wasmTest }) => {
    const retVal = await wasmTest(({ protocol }, ...args) => {
      return protocol.cpp_hbd(...args);
    }, ...numToHighLow(Number.MAX_SAFE_INTEGER + 1));

    expect(retVal).toEqual({
      nai: "@@000000013",
      precision: 3,
      amount: `${Number.MAX_SAFE_INTEGER + 1}`
    });
  });

  test('Should be able to create VESTS in NAI form', async ({ wasmTest }) => {
    const retVal = await wasmTest(({ protocol }, ...args) => {
      return protocol.cpp_vests(...args);
    }, ...numToHighLow(Number.MIN_SAFE_INTEGER));

    expect(retVal).toEqual({
      nai: "@@000000037",
      precision: 6,
      amount: `${Number.MIN_SAFE_INTEGER}`
    });
  });

  test('Should be able to create custom general asset in NAI form', async ({ wasmTest }) => {
    const retVal = await wasmTest(({ protocol }, ...args) => {
      return protocol.cpp_general_asset(3200000035, ...args);
    }, ...numToHighLow(10));

    expect(retVal).toEqual({
      nai: "@@000000021",
      precision: 3,
      amount: "10"
    });
  });

  test('Should be able to calculate HP APR 1', async ({ wasmTest }) => {
    const retVal = await wasmTest(({ protocol }, ...args) => {
      const virtual_supply = protocol.cpp_hive(args[2], args[3]);
      const total_vesting_fund_hive = protocol.cpp_hive(args[4], args[5]);
      return protocol.cpp_calculate_hp_apr(args[0], args[1], virtual_supply, total_vesting_fund_hive);
    }, 1_000_000, 1_500, ...numToHighLow(530_656_835_180), ...numToHighLow(173_009_633_181));

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.content).toEqual("4.48");
  });

  test('Should be able to calculate HP APR 2', async ({ wasmTest }) => {
    const retVal = await wasmTest(({ protocol }, ...args) => {
      const virtual_supply = protocol.cpp_hive(args[2], args[3]);
      const total_vesting_fund_hive = protocol.cpp_hive(args[4], args[5]);
      return protocol.cpp_calculate_hp_apr(args[0], args[1], virtual_supply, total_vesting_fund_hive);
    }, 82_779_364, 1_500, ...numToHighLow(530_656_835_180), ...numToHighLow(173_009_633_181));

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.content).toEqual("2.97");
  });

  test('Should be able to calculate account hp 1', async ({ wasmTest }) => {
    const retVal = await wasmTest(({ protocol }, ...args) => {
      const vests = protocol.cpp_vests(args[0], args[1]);
      const total_vesting_fund_hive = protocol.cpp_hive(args[2], args[3]);
      const total_vesting_shares = protocol.cpp_vests(args[4], args[5]);
      return protocol.cpp_calculate_account_hp(vests, total_vesting_fund_hive, total_vesting_shares);
    }, ...numToHighLow(1_100_000_000), ...numToHighLow(100_000), ...numToHighLow(100_000_000_000));

    expect(retVal).toEqual({
      nai: "@@000000021",
      precision: 3,
      amount: "1100"
    });
  });

  test('Should be able to calculate account hp 2', async ({ wasmTest }) => {
    const retVal = await wasmTest(({ protocol }, ...args) => {
      const vests = protocol.cpp_vests(args[0], args[1]);
      const total_vesting_fund_hive = protocol.cpp_hive(args[2], args[3]);
      const total_vesting_shares = protocol.cpp_vests(args[4], args[5]);
      return protocol.cpp_calculate_account_hp(vests, total_vesting_fund_hive, total_vesting_shares);
    }, ...numToHighLow(2_268_225_009_295_472), ...numToHighLow(173_009_633_181), ...numToHighLow("300729442281783339"));

    expect(retVal).toEqual({
      nai: "@@000000021",
      precision: 3,
      amount: "1304909734"
    });
  });

  test('Should be able to calculate witness votes hp 1', async ({ wasmTest }) => {
    const retVal = await wasmTest(({ protocol }, ...args) => {
      const total_vesting_fund_hive = protocol.cpp_hive(args[2], args[3]);
      const total_vesting_shares = protocol.cpp_vests(args[4], args[5]);
      return protocol.cpp_calculate_witness_votes_hp(args[0], args[1], total_vesting_fund_hive, total_vesting_shares);
    }, ...numToHighLow(1_100_000_000), ...numToHighLow(100_000), ...numToHighLow(100_000_000_000));

    expect(retVal).toEqual({
      nai: "@@000000021",
      precision: 3,
      amount: "1100"
    });
  });

  test('Should be able to calculate witness votes hp 2', async ({ wasmTest }) => {
    const retVal = await wasmTest(({ protocol }, ...args) => {
      const total_vesting_fund_hive = protocol.cpp_hive(args[2], args[3]);
      const total_vesting_shares = protocol.cpp_vests(args[4], args[5]);
      return protocol.cpp_calculate_witness_votes_hp(args[0], args[1], total_vesting_fund_hive, total_vesting_shares);
    }, ...numToHighLow("142103996686715320"), ...numToHighLow(173_009_633_181), ...numToHighLow("300729442281783339"));

    expect(retVal).toEqual({
      nai: "@@000000021",
      precision: 3,
      amount: "81752422223"
    });
  });

  test('Should be able to calculate inflation rate for block 1_000_000', async ({ wasmTest }) => {
    const retVal = await wasmTest(({ protocol }, block_num) => {
      return protocol.cpp_calculate_inflation_rate_for_block(block_num);
    }, 1_000_000);

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.content).toBe("974");
  });

  test('Should be able to calculate inflation rate for block 7_000_000', async ({ wasmTest }) => {
    const retVal = await wasmTest(({ protocol }, block_num) => {
      return protocol.cpp_calculate_inflation_rate_for_block(block_num);
    }, 7_000_000);

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.content).toBe("950");
  });

  test('Should be able to calculate inflation rate for block 9_000_000', async ({ wasmTest }) => {
    const retVal = await wasmTest(({ protocol }, block_num) => {
      return protocol.cpp_calculate_inflation_rate_for_block(block_num);
    }, 9_000_000);

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.content).toBe("942");
  });

  test('Should be able to serialize witness properties and retrieve serialized data', async ({ wasmTest }) => {
    const retVal = await wasmTest(({ protocol }, witness_properties) => {
      const propsSerialized = protocol.cpp_serialize_witness_set_properties(witness_properties);

      const propsKeys = propsSerialized.keys();

      const keys: string[] = [];
      for(let i = 0; i < propsKeys.size(); ++i)
        keys.push(propsKeys.get(i) as string);

      const props: Record<string, string> = {};

      for(const key of keys)
        props[key] = propsSerialized.get(key) as string;

      return props;
    }, witness_properties);

    expect(retVal).toStrictEqual({
      account_creation_fee: "881300000000000003535445454d0000",
      account_subsidy_budget: "1d030000",
      account_subsidy_decay: "b94c0500",
      hbd_exchange_rate: "64000000000000000353424400000000640000000000000003535445454d0000",
      hbd_interest_rate: "e803",
      key: "02472d6eb6d691b6de8b103b51ebdf4e128a523946d8cd03d6ded91b1497ee2e83",
      maximum_block_size: "00000200",
      new_signing_key: "02cf69b1f999d133ebbe178a8b4bbf4da356b264dfdc843b1c740378bff8f65b33",
      url: "0f68747470733a2f2f686976652e696f"
    });
  });

  test('Should be able to serialize witness properties and then deserialize', async ({ wasmTest }) => {
    const retVal = await wasmTest(({ protocol }, witness_properties) => {
      const propsSerialized = protocol.cpp_serialize_witness_set_properties(witness_properties);

      const props = protocol.cpp_deserialize_witness_set_properties(propsSerialized);

      return props;
    }, witness_properties);

    expect(retVal).toStrictEqual(witness_properties);
  });

  test.afterAll(async () => {
    await browser.close();
  });
});
