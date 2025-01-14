import { TestInfo, ConsoleMessage, Page, test as base, expect } from '@playwright/test';

import "./globals";
import type { IWaxGlobals, IWasmGlobals } from './globals';
import { IWaxOptionsChain } from '../../dist/bundle/index-full';

import fs from 'fs';

type TWaxTestCallable<R, Args extends any[]> = (globals: IWaxGlobals, ...args: Args) => (R | Promise<R>);
type TWasmTestCallable<R, Args extends any[]> = (globals: IWasmGlobals, ...args: Args) => (R | Promise<R>);

interface IWaxedTestPlaywright {
  beforeEach: (inner: (args: any) => Promise<any> | any) => Promise<void>;
  afterEach: (inner: (args: any) => Promise<any> | any) => Promise<void>;
}

/** Holds definition of all methods able to run test provided by the wax fixture
 * By design only callable types shall be defined here.
*/
export interface IWaxFixtureMethods {
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
};

export interface IWaxedTest extends IWaxFixtureMethods, IWaxedTestPlaywright {
  config: IWaxOptionsChain | undefined;

}

interface IWaxedWorker {
  beforeAll: (inner: (args: any) => Promise<any> | any) => Promise<void>;

  afterAll: (inner: (args: any) => Promise<any> | any) => Promise<void>;
}

//type Callable<R = any, Args extends any[] =any[]> = (...args: Args) => R;
type Callable = (...args: any[]) => any;

export type TCallableWaxedTestProperties = {
  [key in keyof IWaxFixtureMethods]: IWaxFixtureMethods[key] extends Callable ? IWaxFixtureMethods[key] : never
}[keyof IWaxFixtureMethods];

type FirstArgType<T extends Callable> = T extends (fn: infer FirstArgument, ...args: any[]) => any ? FirstArgument : never;
type RestArgType<T extends Callable> = T extends (first: any, ...args: infer ArgsType) => any ? ArgsType : never;
type FirstCallableArg<T extends Callable> = FirstArgType<T> extends Callable ? FirstArgType<T> : never;

//type TAvailableGlobalWaxFunction = typeof WaxTestGlobalFunctions[keyof typeof WaxTestGlobalFunctions];

const envTestFor = <
  ExpectedWaxedTestFunction extends TCallableWaxedTestProperties,
  TGlobalFunction extends Callable,
  TTestCallableFn extends Callable = FirstCallableArg<ExpectedWaxedTestFunction>
  >
  (page: Page, globalFunction: TGlobalFunction, ...envArgs: RestArgType<TGlobalFunction>): ExpectedWaxedTestFunction => {

  const runner = async<R, Args extends any[]>(checkEqual: boolean, fn: TTestCallableFn, ...args: Args): Promise<R> => {
    let nodeData: any, webData: any;

    try {
      nodeData = await fn(await globalFunction('node', ...envArgs), ...args);

      webData = await page.evaluate(async( { args, envArgs, globalFunction, webFn } ) => {
        // Transform previously encoded test-body args to deserialize functions passed as arguments
        const finalArgs: any[] = [];
        for(const { initialType, value } of args)
          if (initialType === "function")
            finalArgs.push(eval(value));
          else
            finalArgs.push(value);

        eval(`window.webEvalFn = ${webFn};`);
        return (window as Window & typeof globalThis & { webEvalFn: TTestCallableFn }).webEvalFn(await (globalThis[globalFunction])('web', ...envArgs), ...finalArgs);
      }, {
        // Transform arguments passed to the test body function, to serializable values (functions are converted to their textual representation)
        args: args.map(value => {
          const initialType = typeof value;
          if (initialType === "function")
            value = value.toString();

          return {
            initialType,
            value
          };
        }),
        envArgs,
        globalFunction: globalFunction.name,
        webFn: fn.toString()
      });
    } catch(error) {
      if(!(error instanceof Error) || error.name !== "WebAssembly.Exception")
        throw error;

      // Rethrow WASM exceptions here, but remove the stack to prevent large stacktraces overflowing the console buffer
      throw Object.assign(error, { stack: '' });
    }

    if(checkEqual) // Remove prototype data from the node result to match webData when checking for equality
      expect(webData as any).toStrictEqual(typeof nodeData === "object" ? JSON.parse(JSON.stringify(nodeData)) : nodeData);

    return webData;
  };

  const using = function<R, Args extends any[]>(fn: TTestCallableFn, ...args: Args): Promise<R> {
    return runner.bind(undefined, true)(fn, ...args) as Promise<R>;
  };
  using.dynamic = runner.bind(undefined, false);

  return using as ExpectedWaxedTestFunction;
};

export const test = base.extend<IWaxedTest, IWaxedWorker>({
  config: [undefined, { option: true }],

  /// According to PW docs, ever hook must be wrapped into tuple holding additional information related to its scope and automatic installation:
  /// https://playwright.dev/docs/test-fixtures#adding-global-beforeeachaftereach-hooks

  beforeEach: [async ({ page }, use, testInfo) => {
    /// use >> marker for each texts printed in the browser context
    page.on('console', (msg: ConsoleMessage) => {
      console.log('>>', msg.type(), msg.text());
    });

    const nodeStoragePath = testInfo.outputDir;

    if (fs.existsSync(nodeStoragePath)) {
      //console.log('Before-Each: removing beekeeper root: ', nodeStoragePath);

      fs.rmSync(nodeStoragePath, { recursive: true });
    }

    await page.goto("http://localhost:8080/wasm/__tests__/assets/test.html", { waitUntil: "load" });

    await use(async () => {});
  }, { auto: true }],

  afterEach: [async ({ }, use, testInfo) => {
    const nodeStoragePath = testInfo.outputDir;

    if (fs.existsSync(nodeStoragePath)) {
      //console.log('After-each: removing beekeeper root: ', nodeStoragePath);

      fs.rmSync(nodeStoragePath, { recursive: true });
    }

    await use(async () => {});
  }, { auto: true }],

  afterAll: [async ({ browser }, use) => {
    await use(async () => {});

    await browser.close();
  }, { scope: 'worker', auto: true }],

  waxTest: async({ page, config }, use, testInfo: TestInfo) => {
    use(envTestFor(page, createWaxTestFor, testInfo.outputDir, config));
  },

  wasmTest: async({ page }, use) => {
    use(envTestFor(page, createWasmTestFor));
  }
});
