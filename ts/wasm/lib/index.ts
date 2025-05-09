export * from "./detailed/index.js";

import { createHiveChain as constructHiveChainWithWasm, createWaxFoundation as constructWaxFoundationWithWasm, type IWaxOptions, type IWaxOptionsChain, type IHiveChainInterface, type IWaxBaseInterface } from "./detailed/index.js";

// During bundle - this module will be replaced with the actual wasm module based on your environment
import MainModuleFunction from "./build_wasm/wax.common.js";

const getModuleExt = () => {
  // Warning: important change is moving conditional ternary expression outside of URL constructor call, what confused parcel analyzer.
  // Seems it must have simple variables & literals present to correctly translate code.
  const wasmFilePath = new URL("./build_wasm/wax.common.wasm", import.meta.url).href;
  // Fallback for client-bundled inlined WASM, e.g. when using webpack
  let wasmBinary: Buffer | undefined;
  if (wasmFilePath.startsWith("data:application/wasm;base64,"))
      wasmBinary = Buffer.from(wasmFilePath.slice(29), "base64");

  return {
    locateFile(path: string, scriptDirectory: string): string {
      if (path === "wax.common.wasm") {
        return wasmFilePath;
      }
      return scriptDirectory + path;
    },
    wasmBinary
  };
};

/**
 * Creates a Wax Hive chain instance
 *
 * @param {?Partial<IWaxOptionsChain>} options wax options
 *
 * @returns {Promise<IHiveChainInterface>} Wax Hive chain API Instance
 *
 * @throws {WaxError} on any Wax API-related error
 */
export const createHiveChain = (options: Partial<IWaxOptionsChain> = {}): Promise<IHiveChainInterface> => {
  return constructHiveChainWithWasm(MainModuleFunction, getModuleExt(), options);
};

/**
 * Creates a Wax Hive base instance
 *
 * @param {?Partial<IWaxOptions>} options wax options
 *
 * @returns {Promise<IWaxBaseInterface>} Wax Hive Base API Instance
 *
 * @throws {WaxError} on any Wax API-related error
 */
export const createWaxFoundation = (options: Partial<IWaxOptions> = {}): Promise<IWaxBaseInterface> => {
  return constructWaxFoundationWithWasm(MainModuleFunction, getModuleExt(), options);
};
