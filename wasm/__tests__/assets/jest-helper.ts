import { Page, test as base, expect } from '@playwright/test';

import "./globals";
import type { IWaxGlobals, IWasmGlobals, TEnvType } from './globals';
import type { IWaxOptionsChain } from '../../dist/lib/interfaces';

type TWaxTestCallable<R, Args extends any[]> = (globals: IWaxGlobals, ...args: Args) => (R | Promise<R>);
type TWasmTestCallable<R, Args extends any[]> = (globals: IWasmGlobals, ...args: Args) => (R | Promise<R>);

export interface IWaxedTest {
  /**
   * Runs given function in both environments: web and Node.js
   * Created specifically for testing the wax code - base and chain
   * Contains beekeeper instance (if required)
   *
   * Checks if results are equal. If your tests may differ please use {@link dual.dynamic}
   */
  waxTest: (<R, Args extends any[]>(fn: TWaxTestCallable<R, Args>, ...args: Args) => Promise<R>) & {
    /**
     * Provides custom config in chain object including custom @prop {string} apiEndpoint and @prop {string} chainId
     * Config should follow @interface IWaxOptionsChain
     */
    withConfig <R, Args extends any[]>(config: IWaxOptionsChain, fn: TWaxTestCallable<R, Args>, ...args: Args): Promise<R>;
    /**
     * Runs given function in both environments: web and Node.js
     *
     * Does not check if results are equal.
     */
    dynamic: (<R, Args extends any[]>(fn: TWaxTestCallable<R, Args>, ...args: Args) => Promise<R>) & {
      /**
       * Provides custom config in chain object including custom @prop {string} apiEndpoint and @prop {string} chainId
       * Config should follow @interface IWaxOptionsChain
       */
      withConfig <R, Args extends any[]>(config: IWaxOptionsChain, fn: TWaxTestCallable<R, Args>, ...args: Args): Promise<R>;
    };
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

const runner = async function<GlobalType extends IWaxGlobals | IWasmGlobals, R, Args extends any[]>(
  page: Page,
  globalFunction: (env: TEnvType) => Promise<GlobalType>,
  checkEqual: boolean,
  config: IWaxOptionsChain | undefined,
  fn: GlobalType extends IWaxGlobals ? TWaxTestCallable<R, Args> : TWasmTestCallable<R, Args>,
  ...args: Args
): Promise<R> {
  globalThis.waxConfig = config;
  const webData = await page.evaluate(async({ args, globalFunction, webFn, config }) => {
    window.waxConfig = config;
    eval(`window.webEvalFn = ${webFn};`);
    return (window as Window & typeof globalThis & { webEvalFn: Function }).webEvalFn(await globalThis[globalFunction]('web'), ...args);
  }, { args, globalFunction: globalFunction.name, webFn: fn.toString(), config });
  let nodeData = await fn(await (globalFunction as Function)('node'), ...args);

  if(typeof nodeData === "object") // Remove prototype data from the node result to match webData
    nodeData = JSON.parse(JSON.stringify(nodeData));

  if(checkEqual)
    expect(webData as any).toStrictEqual(nodeData);

  return webData;
};

const envTestFor = <GlobalType extends IWaxGlobals | IWasmGlobals>(
  page: Page,
  globalFunction: (env: TEnvType) => Promise<GlobalType>
): IWaxedTest[GlobalType extends IWaxGlobals ? 'waxTest' : 'wasmTest'] => {
  const using = function<R, Args extends any[]>(
    fn: GlobalType extends IWaxGlobals ? TWaxTestCallable<R, Args> : TWasmTestCallable<R, Args>,
    ...args: Args) {
    // @ts-expect-error invalid this type
    return runner.bind(undefined, page, globalFunction, true, undefined)(fn as any, ...args);
  };
  // @ts-expect-error invalid this type
  using.dynamic = runner.bind(undefined, page, globalFunction, false, undefined);

  return using as IWaxedTest[GlobalType extends IWaxGlobals ? 'waxTest' : 'wasmTest'];
};

export const test = base.extend<IWaxedTest>({
  waxTest: async({ page }, use) => {
    const using = envTestFor(page, createWaxTestFor);
    // @ts-expect-error invalid this type
    using.withConfig = runner.bind(undefined, page, createWaxTestFor, true);
    // @ts-expect-error invalid this type
    using.dynamic.withConfig = runner.bind(undefined, page, createWaxTestFor, false);

    use(using);
  },
  wasmTest: async({ page }, use) => {
    use(envTestFor(page, createWasmTestFor));
  }
});
