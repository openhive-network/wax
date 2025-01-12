import { TestInfo, ConsoleMessage, Page, test as base, chromium, expect } from '@playwright/test';

import "./globals";
import type { IWaxGlobals, IWasmGlobals, IWaxEncryptionGlobals, TEnvType } from './globals';
import { IWaxOptionsChain } from '../../dist/bundle/index-full';

import fs from 'fs';

type TWaxTestCallable<R, Args extends any[]> = (globals: IWaxGlobals, ...args: Args) => (R | Promise<R>);
type TWaxEncryptionTestCallable<R, Args extends any[]> = (globals: IWaxEncryptionGlobals, ...args: Args) => (R | Promise<R>);
type TWasmTestCallable<R, Args extends any[]> = (globals: IWasmGlobals, ...args: Args) => (R | Promise<R>);

export interface IWaxedTest {
  config: IWaxOptionsChain | undefined;

  beforeEach: (inner: (args: any) => Promise<any> | any) => Promise<void>;

  afterEach: (inner: (args: any) => Promise<any> | any) => Promise<void>;

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

  encryptionTest: (<R, Args extends any[]>(fn: TWaxEncryptionTestCallable<R, Args>, ...args: Args) => Promise<R>);

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

type TTestCallable<GlobalType extends IWaxGlobals | IWasmGlobals, R, Args extends any[]> =
  GlobalType extends IWaxEncryptionGlobals ? TWaxEncryptionTestCallable<R, Args> :
    (GlobalType extends IWaxGlobals ? TWaxTestCallable<R, Args> : TWasmTestCallable<R, Args>);

type TTestEnvBuilderFn<GlobalType extends IWaxGlobals | IWasmGlobals, Args extends any[]> = (envType: TEnvType, ...args: Args) => Promise<GlobalType>;

const envTestFor = <GlobalType extends IWaxGlobals | IWasmGlobals, RetFunType extends keyof IWaxedTest,
  TEnvBuilderAdditionalArgs extends any[]
  >(
  _: RetFunType,
  page: Page,
  globalFunction: TTestEnvBuilderFn<GlobalType, TEnvBuilderAdditionalArgs>,
  ...envArgs: TEnvBuilderAdditionalArgs): IWaxedTest[RetFunType] => {
  const runner = async<R, Args extends any[]>(checkEqual: boolean, fn: TTestCallable<GlobalType, R, Args>, ...args: Args): Promise<R> => {

    let nodeData, webData;

    try {
      nodeData = await fn(await (globalFunction as Function)('node', ...envArgs), ...args);
      webData = await page.evaluate(async({ args, envArgs, globalFunction, webFn, customConfig }) => {
        eval(`window.webEvalFn = ${webFn};`);
        globalThis.config = customConfig;
        return (window as Window & typeof globalThis & { webEvalFn: Function }).webEvalFn(await globalThis[globalFunction]('web', ...envArgs), ...args);
      }, { args, envArgs, globalFunction: globalFunction.name, webFn: fn.toString(), customConfig: globalThis.config});
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

  const using = function<R, Args extends any[]>(fn: TTestCallable<GlobalType, R, Args>, ...args: Args) {
    return runner.bind(undefined, true)(fn as any, ...args);
  };
  using.dynamic = runner.bind(undefined, false);

  return using as IWaxedTest[RetFunType];
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

    const webStoragePath = `${testInfo.outputDir}/web`;
    const nodeStoragePath = `${testInfo.outputDir}/node`;

    if (fs.existsSync(webStoragePath)) {
      console.log('removing beekeeper root: ', webStoragePath);

      fs.rmSync(webStoragePath, { recursive: true });
    }

    // This is needed for the web environment.
    //fs.mkdirSync(webStoragePath, { recursive: true });

    if (fs.existsSync(nodeStoragePath)) {
      console.log('removing beekeeper root: ', nodeStoragePath);

      fs.rmSync(nodeStoragePath, { recursive: true });
    }

    // This is needed for the node environment (otherwise beekeeper does not work).
    fs.mkdirSync(nodeStoragePath, { recursive: true });

    await page.goto("http://localhost:8080/wasm/__tests__/assets/test.html", { waitUntil: "load" });

    await use(async () => {});
  }, { auto: true }],

  afterEach: [async ({ }, use, testInfo) => {
    await use(async () => {});

    const webStoragePath = '/storage_root';
    const nodeStoragePath = `${testInfo.outputDir}`;

    if (fs.existsSync(webStoragePath)) {
      console.log('After removing beekeeper root: ', webStoragePath);

      fs.rmSync(webStoragePath, { recursive: true });
    }

    if (fs.existsSync(nodeStoragePath)) {
      console.log('After removing beekeeper root: ', nodeStoragePath);

      fs.rmSync(nodeStoragePath, { recursive: true });
    }
  }, { auto: true }],

  afterAll: [async ({ browser }, use) => {
    await use(async () => {});

    await browser.close();
  }, { scope: 'worker', auto: true }],

  waxTest: async({ page, config }, use, testInfo: TestInfo) => {
    globalThis.config = config;

    use(envTestFor('waxTest', page, createWaxTestFor, testInfo.outputDir));
  },

  wasmTest: async({ page }, use) => {
    use(envTestFor('wasmTest', page, createWasmTestFor));
  },

  encryptionTest: async ({ page }, use, testInfo: TestInfo) => {
    use(envTestFor('encryptionTest', page, createWaxEncryptionTestFor, testInfo.outputDir));
  }
});
