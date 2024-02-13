import { Page, test as base, expect } from '@playwright/test';

import "./globals-wasm";
import "./globals-chain";

import type { IBeekeeperInstance } from '@hive/beekeeper';
import type { IWaxBaseInterface, IHiveChainInterface } from '../../dist/bundle/web-full';
import type { proto_protocol, protocol, result } from '../../dist/lib/build_wasm/wax.web';

declare global {
  var protocol: protocol;
  var proto_protocol: proto_protocol;
  var transform: (result: result) => result & { value: 0 | 1 };
  var bk: IBeekeeperInstance;
  var wx: IWaxBaseInterface;
  var chain: IHiveChainInterface;
}

export const testWasm = base.extend<{
  dual: Page['evaluate']
}>({
  dual: async({ page }, use) => {
    use(async(fn, arg) => {
      await page.evaluate(async() => {
        if(!globalThis.protocol) globalThis.protocol = await WaxWasmTests.protocol();
        if(!globalThis.proto_protocol) globalThis.proto_protocol = await WaxWasmTests.proto_protocol();
        if(!globalThis.transform) globalThis.transform = WaxWasmTests.transform.bind(undefined, await WaxWasmTests.provider());
      });
      if(!globalThis.protocol) globalThis.protocol = await WaxWasmTests.protocol();
      if(!globalThis.proto_protocol) globalThis.proto_protocol = await WaxWasmTests.proto_protocol();
      if(!globalThis.transform) globalThis.transform = WaxWasmTests.transform.bind(undefined, await WaxWasmTests.provider());

      const webData = await page.evaluate(fn, arg);
      const nodeData = await fn(arg);

      expect(webData).toStrictEqual(nodeData);

      return nodeData;
    });
  }
});

export const testChain = base.extend<{
  dual: Page['evaluate']
}>({
  dual: async({ page }, use) => {
    await page.evaluate(async() => {
      if(!globalThis.bk) globalThis.bk = await WaxTests.bk();
      if(!globalThis.wx) globalThis.wx = await WaxTests.wx();
      if(!globalThis.chain) globalThis.chain = await WaxTests.chain();
    });
    if(!globalThis.bk) globalThis.bk = await WaxTests.bk();
    if(!globalThis.wx) globalThis.wx = await WaxTests.wx();
    if(!globalThis.chain) globalThis.chain = await WaxTests.chain();

    use(async(fn, arg) => {
      const webData = await page.evaluate(fn, arg);
      const nodeData = await fn(arg);

      expect(webData).toStrictEqual(nodeData);

      return nodeData;
    });
  }
});
