import { Page, test as base, expect } from '@playwright/test';

import "./globals-wasm";
import "./globals-chain";

export interface IWaxedTest {
  /**
   * Runs given function in both environments: web and Node.js
   *
   * Checks if results are equal. If your tests may differ please use {@link dual.dynamic}
   */
  dual: Page['evaluate'] & {
    /**
     * Runs given function in both environments: web and Node.js
     *
     * Does not check if results are equal.
     */
    dynamic: Page['evaluate'];
  };
}

export const test = base.extend<IWaxedTest>({
  dual: async({ page }, use) => {
    const runner = async(checkEqual, fn, arg) => {
      const webData = await page.evaluate(fn, arg);
      let nodeData = await fn(arg);

      if(typeof nodeData === "object") // Remove prototype data from the node result to match webData
        nodeData = JSON.parse(JSON.stringify(nodeData));

      if(checkEqual)
        expect(webData).toStrictEqual(nodeData);

      return webData;
    };

    const using = function(fn, arg) {
      return runner.bind(undefined, true)(fn, arg);
    };
    using.dynamic = runner.bind(undefined, false);

    use(using);
  }
});
