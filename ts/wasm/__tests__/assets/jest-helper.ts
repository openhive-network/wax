import { Page, test as base, expect } from '@playwright/test';

import "./globals";
import type { IWaxGlobals, IWasmGlobals, TEnvType } from './globals';
import { IWaxOptionsChain } from '../../dist/bundle/index-full';

type TWaxTestCallable<R, Args extends any[]> = (globals: IWaxGlobals, ...args: Args) => (R | Promise<R>);
type TWasmTestCallable<R, Args extends any[]> = (globals: IWasmGlobals, ...args: Args) => (R | Promise<R>);

export interface IWaxedTest {
  config: IWaxOptionsChain | undefined;
  /**
   * Runs given function in both environments: web and Node.js
   * Created specifically for testing the wax code - base and chain
   * Contains beekeeper instance (if required)
   *
   * Checks if results are equal. If your tests may differ please use {@link dual.dynamic}
   */
  waxTest: (<R, Args extends any[]>(fn: TWaxTestCallable<R, Args>, ...args: Args) => Promise<R>) & {
    /**
     * Runs given function in both environments: web and Node.js
     *
     * Does not check if results are equal.
     */
    dynamic<R, Args extends any[]>(fn: TWaxTestCallable<R, Args>, ...args: Args): Promise<R>;
  };
  /**
   * Runs given function in both environments: web and Node.js
   * Created specifically for testing WASM code
   *
   * Checks if results are equal. If your tests may differ please use {@link dual.dynamic}
   */
  wasmTest: (<R, Args extends any[]>(fn: TWasmTestCallable<R, Args>, ...args: Args) => Promise<R>) & {
    /**
     * Runs given function in both environments: web and Node.js
     *
     * Does not check if results are equal.
     */
    dynamic<R, Args extends any[]>(fn: TWasmTestCallable<R, Args>, ...args: Args): Promise<R>;
  };
}

const envTestFor = <GlobalType extends IWaxGlobals | IWasmGlobals>(
  page: Page,
  globalFunction: (env: TEnvType) => Promise<GlobalType>
): IWaxedTest[GlobalType extends IWaxGlobals ? 'waxTest' : 'wasmTest'] => {

  const runner = async<R, Args extends any[]>(checkEqual: boolean, fn: GlobalType extends IWaxGlobals ? TWaxTestCallable<R, Args> : TWasmTestCallable<R, Args>, ...args: Args): Promise<R> => {

    let nodeData, webData;

    try {
      nodeData = await fn(await (globalFunction as Function)('node'), ...args);
      webData = await page.evaluate(async({ args, globalFunction, webFn, customConfig }) => {
        eval(`window.webEvalFn = ${webFn};`);
        globalThis.config = customConfig;
        return (window as Window & typeof globalThis & { webEvalFn: Function }).webEvalFn(await globalThis[globalFunction]('web'), ...args);
      }, { args, globalFunction: globalFunction.name, webFn: fn.toString(), customConfig: globalThis.config });
    } catch(error) {
      if(!(error instanceof Error) || error.name !== "WebAssembly.Exception")
        throw error;

      // Rethrow WASM exceptions here, but remove the stack to prevent large stacktraces overflowing the console buffer
      throw Object.assign(error, { stack: '' });
    }

    if(typeof nodeData === "object") // Remove prototype data from the node result to match webData
      nodeData = JSON.parse(JSON.stringify(nodeData));

    if(checkEqual)
      expect(webData as any).toStrictEqual(nodeData);

    return webData;
  };

  const using = function<R, Args extends any[]>(fn: GlobalType extends IWaxGlobals ? TWaxTestCallable<R, Args> : TWasmTestCallable<R, Args>, ...args: Args) {
    return runner.bind(undefined, true)(fn as any, ...args);
  };
  using.dynamic = runner.bind(undefined, false);

  return using as IWaxedTest[GlobalType extends IWaxGlobals ? 'waxTest' : 'wasmTest'];
};

export const test = base.extend<IWaxedTest>({
  config: [undefined, { option: true }],

  waxTest: async({ page, config }, use) => {
    globalThis.config = config;
    use(envTestFor(page, createWaxTestFor));
  },
  wasmTest: async({ page }, use) => {
    use(envTestFor(page, createWasmTestFor));
  }
});
