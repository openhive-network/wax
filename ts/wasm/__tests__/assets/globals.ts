// We only want to import types here!
import type { IBeekeeperInstance } from "@hiveio/beekeeper/web";
import type Wax from "../../dist/bundle/index-full.js";
import type { IWaxBaseInterface, IHiveChainInterface, IWaxOptionsChain } from "../../dist/bundle/index-full.js";
import type { MainModule, proto_protocol as proto_protocolT, protocol as protocolT } from "../../dist/lib/build_wasm/wax.common.js";

type TMainModuleFn = () => Promise<MainModule>;
export type TEnvType = 'web' | 'node';

// Define global interfaces:
export interface IWaxGlobals {
  beekeeper: IBeekeeperInstance;
  base: IWaxBaseInterface;
  chain: IHiveChainInterface;
  wax: typeof Wax;
}
export interface IWasmGlobals {
  protocol: protocolT;
  proto_protocol: proto_protocolT;
  provider: MainModule;
}

export interface IWaxEncryptionGlobals extends IWaxGlobals {
  /// TODO: extend base interface by data needed by encryption tests
};

declare global {
  function createWaxTestFor(env: TEnvType, outputpath: string): Promise<IWaxGlobals>;
  function createWaxEncryptionTestFor(env: TEnvType, outputpath: string): Promise<IWaxEncryptionGlobals>;
  function createWasmTestFor(env: TEnvType): Promise<IWasmGlobals>;
  function createWaxMockTestFor(env: TEnvType, mockData: any): Promise<IWaxGlobals>;
  var config: IWaxOptionsChain | undefined;
}

export const getBeekeeperStoragePath = (env: TEnvType, outputPath: string): string => {
  const pathSuffix = env === "web" ? 'web' : 'node';

  const path = env === 'node' ? `${outputPath}/${pathSuffix}` : '/storage_root';

  return path;
};

// Use function as we later extract the function name in the jest-helpers
globalThis.createWaxTestFor = async function createWaxTestFor(env: TEnvType, outputPath: string) {
  const locWax = env === "web" ? "../../dist/bundle/index-full.js" : "../../dist/bundle/index.js";
  const locBeekeeper = env === "web" ? "@hiveio/beekeeper/web" : "@hiveio/beekeeper/node";

  // Import required libraries env-dependent
  const wax = await import(locWax) as typeof import("../../dist/bundle/index-full.js");
  const beekeeper = await import(locBeekeeper) as typeof import("@hiveio/beekeeper/web");

  const beekeeperRoot = getBeekeeperStoragePath(env, outputPath);

  try {
    // Initialize data
    console.log('creating beekeeper using storage root', beekeeperRoot);
    const bk = await beekeeper.default({ enableLogs: true, storageRoot: beekeeperRoot }) as IBeekeeperInstance;
    const wx = await wax.createWaxFoundation();

    console.log('beekeeper instance created.');

    let chain: IHiveChainInterface;

    if (globalThis.config === undefined)
      chain = await wax.createHiveChain();
    else {
      chain = await wax.createHiveChain(globalThis.config);

      console.log(`Using custom config: API endpoint: ${globalThis.config.apiEndpoint}, chain id: ${globalThis.config.chainId}`);
    }

    // Provide results
    return {
      beekeeper: bk,
      base: wx,
      chain,
      wax
    };
  } catch(e) {
    console.log(JSON.stringify(e));
    throw e;
  }
};

globalThis.createWaxEncryptionTestFor = async function createWaxEncryptionTestFor(env: TEnvType, outputpath: string): Promise<IWaxEncryptionGlobals> {
  const baseData = await globalThis.createWaxTestFor(env, outputpath);

  const beekeeper = baseData.beekeeper;
  const chain = baseData.chain;

  /// TODO: implement actual encryption env. init
  return {beekeeper, chain, base: baseData.base, wax: baseData.wax};
};

// Use function as we later extract the function name in the jest-helpers
globalThis.createWasmTestFor = async function createWasmTestFor(_env: TEnvType) {
  // Import required libraries env-dependent
  const wasm = await import("../../dist/lib/build_wasm/wax.common.js");

  // Initialize data
  const provider = await (wasm as unknown as { default: TMainModuleFn }).default();

  // Provide results
  return {
    protocol: new provider.protocol(),
    proto_protocol: new provider.proto_protocol(),
    provider
  };
};

export {};
