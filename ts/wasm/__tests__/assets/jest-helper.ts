import { ConsoleMessage, Page, test as base, chromium, expect } from '@playwright/test';

import "./globals";
import type { IWaxGlobals, IWasmGlobals, TEnvType } from './globals';
import { IWaxOptionsChain } from '../../dist/bundle/index-full';
import { DEFAULT_STORAGE_ROOT } from '@hiveio/beekeeper';

import fs from 'fs';

type TWaxTestCallable<R, Args extends any[]> = (globals: IWaxGlobals, ...args: Args) => (R | Promise<R>);
type TWasmTestCallable<R, Args extends any[]> = (globals: IWasmGlobals, ...args: Args) => (R | Promise<R>);

export interface IWaxedTest {
  config: IWaxOptionsChain | undefined;


  beforeEach: (inner: (args: any) => Promise<any> | any) => Promise<void>;


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

interface IWaxedWorker {
  beforeAll: (inner: (args: any) => Promise<any> | any) => Promise<void>;

  afterAll: (inner: (args: any) => Promise<any> | any) => Promise<void>;
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

export const test = base.extend<IWaxedTest, IWaxedWorker>({
  config: [undefined, { option: true }],

  /// According to PW docs, ever hook must be wrapped into tuple holding additional information related to its scope and automatic installation:
  /// https://playwright.dev/docs/test-fixtures#adding-global-beforeeachaftereach-hooks

  beforeAll: [async ({}, use) => {
    await chromium.launch({
      headless: true
    });

    await use(async () => {});
  }, { scope: 'worker', auto: true }],

  beforeEach: [async ({ page }, use, testInfo) => {
    page.on('console', (msg: ConsoleMessage) => {
      console.log('>>', msg.type(), msg.text());
    });

    console.log(testInfo.parallelIndex);

    if (fs.existsSync(`${DEFAULT_STORAGE_ROOT}/.beekeeper/w0.wallet`)) {
      fs.rmSync(`${DEFAULT_STORAGE_ROOT}/.beekeeper/w0.wallet`);
    }

    await page.goto("http://localhost:8080/wasm/__tests__/assets/test.html", { waitUntil: "load" });

    await use(async () => {});
  }, { auto: true }],

  afterAll: [async ({ browser }, use) => {
    await use(async () => {});

    await browser.close();
  }, { scope: 'worker', auto: true }],

  // forEachWorker: [async ({}, use) => {
  //   const browser = await chromium.launch({
  //     headless: true
  //   });

  //   await use();

  //   await browser.close();
  // }, { scope: 'worker', auto: true }],

  // forEachTest: [async ({ page }, use, testInfo) => {
  //   page.on('console', (msg: ConsoleMessage) => {
  //     console.log('>>', msg.type(), msg.text());
  //   });

  //   console.log(testInfo.parallelIndex);

  //   if (fs.existsSync(`${DEFAULT_STORAGE_ROOT}/.beekeeper/w0.wallet`)) {
  //     fs.rmSync(`${DEFAULT_STORAGE_ROOT}/.beekeeper/w0.wallet`);
  //   }

  //   await page.goto("http://localhost:8080/wasm/__tests__/assets/test.html", { waitUntil: "load" });

  //   await use();
  // }, { auto: true }],

  waxTest: async({ page, config }, use) => {
    globalThis.config = config;
    use(envTestFor(page, createWaxTestFor));
  },

  wasmTest: async({ page }, use) => {
    use(envTestFor(page, createWasmTestFor));
  }
});

// Solution nr. 2
// export const defineTestSuite = (testSuiteName: string, testSuiteBody: (test: typeof base) => void) => {
//   test.describe(testSuiteName, () => {
//     let browser: ChromiumBrowser;

//     test.beforeAll(async () => {
//       browser = await chromium.launch({
//         headless: true
//       });
//     });

//     test.beforeEach(async ({ page }, testInfo) => {
//       page.on('console', (msg: ConsoleMessage) => {
//         console.log('>>', msg.type(), msg.text());
//       });

//       console.log(testInfo.parallelIndex);

//       if (fs.existsSync(`${DEFAULT_STORAGE_ROOT}/.beekeeper/w0.wallet`)) {
//         fs.rmSync(`${DEFAULT_STORAGE_ROOT}/.beekeeper/w0.wallet`);
//       }

//       await page.goto("http://localhost:8080/wasm/__tests__/assets/test.html", { waitUntil: "load" });
//     });

//     testSuiteBody(test);

//     test.afterAll(async () => {
//       await browser.close();
//     });
//   });
// };
