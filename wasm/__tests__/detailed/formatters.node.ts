import { test, expect } from '@playwright/test';
import { DEFAULT_STORAGE_ROOT } from "@hive/beekeeper/node";

import { naiAsset, serialization_sensitive_transaction } from "../assets/data.protocol";

import { createHiveChain, IHiveChainInterface, WaxFormatable } from "../../dist/bundle/node";

import fs from "fs";

let chain: IHiveChainInterface;

test.describe('Wax object interface formatters tests for Node.js', () => {
  test.beforeAll(async () => {
    chain = await createHiveChain();
  });

  test.beforeEach(() => {
    if(fs.existsSync(`${DEFAULT_STORAGE_ROOT}/.beekeeper/w0.wallet`))
      fs.rmSync(`${DEFAULT_STORAGE_ROOT}/.beekeeper/w0.wallet`);
  });

  test('Should be able to format asset using default formatters from hive chain interface', () => {
    expect(
      chain.waxify`Amount: ${naiAsset}`
    ).toBe("Amount: 300.000 HIVE");
  });

  test('Should be able to format transaction using default formatters from hive chain interface', () => {
    const tx = JSON.parse(serialization_sensitive_transaction);

    expect(
      chain.waxify`Tx: #${tx}`
    ).toBe("Tx: #3725c81634f152011e2043eb7119911b953d4267");
  });

  test('Should be able to extend formatter with custom options from hive chain interface', () => {
    const tx = JSON.parse(serialization_sensitive_transaction);

    const formatter = chain.formatter.extend({ transaction: { displayAsId: false } });

    expect(
      formatter.format`Tx: ${tx}`
    ).toBe("Tx: {\"ref_block_num\":1959,\"ref_block_prefix\":3625727107,\"expiration\":\"2023-11-09T22:01:24\",\"operations\":[{\"type\":\"transfer_operation\",\"value\":{\"from\":\"oneplus7\",\"to\":\"kryptogames\",\"amount\":\"300.000 HIVE\",\"memo\":\"Roll under 50 4d434bd943616\"}}],\"extensions\":[]}");
  });

  test('Should be able to format values using custom formatters extended from hive chain interface', () => {
    class MyFormatters {
      @WaxFormatable()
      myCustomProp(value) {
        return value.myCustomProp.toString();
      }
    }

    const formatter = chain.formatter.extend(MyFormatters);
    const data = {
      myCustomProp: 12542
    };

    expect(
      formatter.format`MyData: ${data}`
    ).toBe("MyData: 12542");
  });
});
