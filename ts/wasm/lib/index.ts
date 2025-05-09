export * from "./detailed/index.js";

import { createHiveChain as constructHiveChainWithWasm, createWaxFoundation as constructWaxFoundationWithWasm, type IWaxOptions, type IWaxOptionsChain, type IHiveChainInterface, type IWaxBaseInterface } from "./detailed/index.js";

// During bundle - this module will be replaced with the actual wasm module based on your environment
import MainModuleFunction from "./build_wasm/wax.common.js";

const getModuleExt = (fileLocation?: string) => {
  // Warning: important change is moving conditional ternary expression outside of URL constructor call, what confused parcel analyzer.
  // Seems it must have simple variables & literals present to correctly translate code.
  const wasmFilePath = fileLocation ?? new URL("./build_wasm/wax.common.wasm", import.meta.url).href;
  // Fallback for client-bundled inlined WASM, e.g. when using webpack
  let wasmBinary: Uint8Array | undefined;
  if (wasmFilePath.startsWith("data:application/wasm;base64,")) {
    const base64 = wasmFilePath.slice(29);
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; ++i)
      bytes[i] = binaryString.charCodeAt(i);
    wasmBinary = bytes;
  }

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
  const { wasmLocation, ...otherOptions } = options || {};

  return constructHiveChainWithWasm(MainModuleFunction, getModuleExt(wasmLocation), otherOptions);
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
  const { wasmLocation, ...otherOptions } = options || {};

  return constructWaxFoundationWithWasm(MainModuleFunction, getModuleExt(wasmLocation), otherOptions);
};
