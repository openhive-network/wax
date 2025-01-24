export * from "./detailed/index.js";

import { constructHiveChainWithWasm, constructWaxFoundationWithWasm, type IWaxOptions, type IWaxOptionsChain, type IHiveChainInterface, type IWaxBaseInterface } from "./detailed/index.js";

// During bundle - this module will be replaced with the actual wasm module based on your environment
import MainModuleFunction from "wasm/lib/wax_module.js";

import wasmUrl from "wax_wasm_location.wasm";

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
  return constructHiveChainWithWasm(MainModuleFunction, {
    locateFile: (path: string, scriptDirectory: string) => {
      if (path === "wax.common.wasm")
        return wasmUrl;

      return scriptDirectory + path;
    }
  }, options);
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
  return constructWaxFoundationWithWasm(MainModuleFunction, {
    locateFile: (path: string, scriptDirectory: string) => {
      if (path === "wax.common.wasm")
        return wasmUrl;

      return scriptDirectory + path;
    }
  }, options);
};
