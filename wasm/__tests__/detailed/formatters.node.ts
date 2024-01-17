import { test, expect } from '@playwright/test';
import { DEFAULT_STORAGE_ROOT } from "@hive/beekeeper/node";

import { naiAsset } from "../assets/data.protocol";

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
