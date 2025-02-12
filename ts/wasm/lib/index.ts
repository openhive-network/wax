export * from "./detailed/index.js";

import { createHiveChain as constructHiveChainWithWasm, createWaxFoundation as constructWaxFoundationWithWasm, type IWaxOptions, type IWaxOptionsChain, type IHiveChainInterface, type IWaxBaseInterface } from "./detailed/index.js";

// During bundle - this module will be replaced with the actual wasm module based on your environment
import MainModuleFunction from "./build_wasm/wax.common.js";

// Polyfill for web workers in WASM
declare global {
  var WorkerGlobalScope: /* object extends */ EventTarget | undefined;
}
const ENVIRONMENT_IS_WORKER = typeof WorkerGlobalScope != 'undefined';

const getModuleExt = () => ({
  locateFile: (path, scriptDirectory) => {
    if (path === "wax.common.wasm")
        return (ENVIRONMENT_IS_WORKER ? new URL("./build_wasm/wax.common.wasm", self.location.href) : new URL("./build_wasm/wax.common.wasm",  import.meta.url)).href;
    return scriptDirectory + path;
  }
})

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
