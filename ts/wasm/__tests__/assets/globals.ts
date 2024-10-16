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

declare global {
  function createWaxTestFor(env: TEnvType): Promise<IWaxGlobals>;
  function createWasmTestFor(env: TEnvType): Promise<IWasmGlobals>;
  var config: IWaxOptionsChain | undefined;
}

// Use function as we later extract the function name in the jest-helpers
globalThis.createWaxTestFor = async function createWaxTestFor(env: TEnvType) {
  const locWax = env === "web" ? "../../dist/bundle/index-full.js" : "../../dist/bundle/index.js";
  const locBeekeeper = env === "web" ? "@hiveio/beekeeper/web" : "@hiveio/beekeeper/node";

  // Import required libraries env-dependent
  const wax = await import(locWax) as typeof import("../../dist/bundle/index-full.js");
  const beekeeper = await import(locBeekeeper) as typeof import("@hiveio/beekeeper/web");

  // Initialize data
  const bk = await beekeeper.default({ enableLogs: false }) as IBeekeeperInstance;
  const wx = await wax.createWaxFoundation();

  let chain: IHiveChainInterface;

  if(globalThis.config === undefined)
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
