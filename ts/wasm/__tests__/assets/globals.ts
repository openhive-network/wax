// We only want to import types here!
// Type imports are automatically stripped out from the output-JS-code by the TypeScript compiler, which leads to full type safety, but no direct dependencies on the imported modules.
// When this file is ran in Node environment, JS-imports of "@hiveio/beekeeper/web" make no sense as we are testing Node.js
// Also when testing in Web environment, we would have to import only fully-bundled packages here as we lack any import resolution in the browser except explicitly defined importmap
// for imports defined in functions "createWaxTestFor" and "createWasmTestFor"
import type { IBeekeeperInstance } from "@hiveio/beekeeper/web";
import type Wax from "../../dist/bundle";
import type { IWaxBaseInterface, IHiveChainInterface, IWaxOptionsChain } from "../../dist/bundle";
import type { MainModule, protocol_foundation } from "../../dist/lib/build_wasm/wax.common";

// Declare global types
type TMainModuleFn = () => Promise<MainModule>;
export type TEnvType = 'web' | 'node';

// Define global interfaces:
export interface IWaxGlobals {
  beekeeper: IBeekeeperInstance;
  base: IWaxBaseInterface;
  chain: IHiveChainInterface;
  wax: typeof Wax;
  outputPath: string;
}
export interface IWasmGlobals {
  protocol: protocol_foundation;
  provider: MainModule;
}

declare global {
  function createWaxTestFor(env: TEnvType, outputpath: string, config?: IWaxOptionsChain): Promise<IWaxGlobals>;
  function createWasmTestFor(env: TEnvType): Promise<IWasmGlobals>;

  // Reexport every function as a namespace for type extraction in jest-helper - if you add new functions to the global scope, you need to add them here too
  namespace WaxTestGlobalFunctions {
    export { createWaxTestFor, createWasmTestFor };
  }
}

// Define the actual global function bodies
// We are also using function expressions here to be able to extract the function names in the jest-helpers

globalThis.createWaxTestFor = async function createWaxTestFor(env: TEnvType, outputPath: string, config?: IWaxOptionsChain) {
  const locWax = env === "web" ? "../../dist/bundle/web.js" : "../../dist/bundle/node.js";
  const locBeekeeper = env === "web" ? "@hiveio/beekeeper/web" : "@hiveio/beekeeper/node";

  // Import required libraries env-dependent
  const wax = await import(locWax) as typeof import("../../dist/bundle");
  const beekeeper = await import(locBeekeeper) as typeof import("@hiveio/beekeeper/web");

  try {
    // Initialize data
    //console.log('creating beekeeper using storage root', beekeeperRoot);
    const bk = await beekeeper.default({ enableLogs: false, storageRoot: outputPath }) as IBeekeeperInstance;
    const wx = await wax.createWaxFoundation();

    //console.log('beekeeper instance created.');

    let chain: IHiveChainInterface;

    if (config === undefined)
      chain = await wax.createHiveChain();
    else {
      chain = await wax.createHiveChain(config);

      console.log(`Using custom config: API endpoint: ${config.apiEndpoint}, chain id: ${config.chainId}`);
    }

    // Provide results
    return {
      beekeeper: bk,
      base: wx,
      chain,
      wax,
      outputPath
    };
  } catch(e) {
    console.log("Error caught at createWaxTestFor call: ", JSON.stringify(e));
    throw e;
  }
};

// Use function as we later extract the function name in the jest-helpers
globalThis.createWasmTestFor = async function createWasmTestFor(env: TEnvType) {
  // Import required libraries env-dependent
  const wasm = env === "web" ? await import("../../dist/bundle/build_wasm/wax.web.js") : await import("../../dist/bundle/build_wasm/wax.node.js");

  // Initialize data
  const provider = await (wasm as unknown as { default: TMainModuleFn }).default();

  // Provide results
  return {
    protocol: new provider.protocol_foundation(),
    provider
  };
};

export {};
