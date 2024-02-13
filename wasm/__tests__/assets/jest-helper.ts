import { Page, test as base, expect } from '@playwright/test';

import "./globals-wasm";
import "./globals-chain";

import type { IBeekeeperInstance } from '@hive/beekeeper';
import type { IWaxBaseInterface, IHiveChainInterface } from '../../dist/bundle/web-full';
import type { proto_protocol, protocol } from '../../dist/lib/build_wasm/wax.web';

declare global {
  var protocol: protocol;
  var proto_protocol: proto_protocol;
  var bk: IBeekeeperInstance;
  var wx: IWaxBaseInterface;
  var chain: IHiveChainInterface;
}

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

export const testWasm = base.extend<IWaxedTest>({
  dual: async({ page }, use) => {
    const runner = async(checkEqual, fn, arg) => {
      await page.evaluate(async() => {
        if(!globalThis.protocol) globalThis.protocol = await WaxWasmTests.protocol();
        if(!globalThis.proto_protocol) globalThis.proto_protocol = await WaxWasmTests.proto_protocol();
      });
      if(!globalThis.protocol) globalThis.protocol = await WaxWasmTests.protocol();
      if(!globalThis.proto_protocol) globalThis.proto_protocol = await WaxWasmTests.proto_protocol();

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

export const testChain = base.extend<IWaxedTest>({
  dual: async({ page }, use) => {
    const runner = async(checkEqual, fn, arg) => {
      await page.evaluate(async() => {
        if(!globalThis.bk) globalThis.bk = await WaxTests.bk();
        if(!globalThis.wx) globalThis.wx = await WaxTests.wx();
        if(!globalThis.chain) globalThis.chain = await WaxTests.chain();
      });
      if(!globalThis.bk) globalThis.bk = await WaxTests.bk();
      if(!globalThis.wx) globalThis.wx = await WaxTests.wx();
      if(!globalThis.chain) globalThis.chain = await WaxTests.chain();

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
