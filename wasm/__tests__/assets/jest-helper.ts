import { Page, test as base, expect } from '@playwright/test';

import "./globals";
import type { IWaxGlobals, IWasmGlobals, TEnvType } from './globals';

type TWaxTestCallable<R, Args extends any[]> = (globals: IWaxGlobals, ...args: Args) => (R | Promise<R>);
type TWasmTestCallable<R, Args extends any[]> = (globals: IWasmGlobals, ...args: Args) => (R | Promise<R>);

export interface IWasmTest {
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

  /**
   * Gives access to instance of reference context specific to WASM test objects, i.e. to use such interfaces at test result verification.
   */
  wasmRefContext: IWasmGlobals;
};

export interface IWaxedTest extends IWasmTest {
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
}

type TTestedFnType<TestType, R, Args extends any[]> = TestType extends IWaxGlobals ? TWaxTestCallable<R, Args> : TWasmTestCallable<R, Args>;

const envTestFor = <GlobalType>(
  page: Page,
  globalFunction: (env: TEnvType) => Promise<GlobalType>
): IWaxedTest[GlobalType extends IWaxGlobals ? 'waxTest' : 'wasmTest'] => {
  const runner = async<R, Args extends any[]>(checkEqual: boolean, fn: TTestedFnType<GlobalType, R, Args>, ...args: Args): Promise<R> => {
    const webData = await page.evaluate(async({ args, globalFunction, webFn }) => {
      eval(`window.webEvalFn = ${webFn};`);
      const webExecContext = await globalThis[globalFunction]('web');
      return (window as Window & typeof globalThis & { webEvalFn: Function }).webEvalFn(webExecContext, ...args);
    }, { args, globalFunction: globalFunction.name, webFn: fn.toString() });

    let nodeData = await fn(await (globalFunction as Function)('node'), ...args);

    if(typeof nodeData === "object") // Remove prototype data from the node result to match webData
      nodeData = JSON.parse(JSON.stringify(nodeData));

    if(checkEqual)
      expect(webData as any).toStrictEqual(nodeData);

    return webData;
  };

  const using = function<R, Args extends any[]>(fn: TTestedFnType<GlobalType, R, Args>, ...args: Args) {
    return runner.bind(undefined, true)(fn as any, ...args);
  };
  using.dynamic = runner.bind(undefined, false);

  return using as IWaxedTest[GlobalType extends IWaxGlobals ? 'waxTest' : 'wasmTest'];
};

export const test = base.extend<IWaxedTest>({
  waxTest: async({ page }, use) => {
    use(envTestFor(page, createWaxTestFor));
  },
  wasmTest: async({ page }, use) => {
    use(envTestFor(page, createWasmTestFor));
  }
});

export const wasmTestFixture = base.extend<IWasmTest>({
  wasmRefContext: await createWasmTestFor('node'),
  wasmTest: async({ page }, use) => {
    use(envTestFor(page, createWasmTestFor));
  }
});
