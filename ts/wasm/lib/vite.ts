export * from "./detailed/index.js";

import { createHiveChain as constructHiveChainWithWasm, createWaxFoundation as constructWaxFoundationWithWasm, type IWaxOptions, type IWaxOptionsChain, type IHiveChainInterface, type IWaxBaseInterface } from "./detailed/index.js";

// During bundle - this module will be replaced with the actual wasm module based on your environment
import MainModuleFunction from "wasm/lib/wax_module.js";

const moduleArgs = (async () => {
  // Resolve WASM url only for Nuxt client (first condition) or Vite client (second condition)
  if ((import.meta as any).client || (!("client" in import.meta) && typeof (import.meta as any).env === "object" && "SSR" in (import.meta as any).env)) {
      const resolvedUrl = (await import('wax.common.wasm?url')).default;

      return {
          locateFile: (path, scriptDirectory) => {
              if (path === "wax.common.wasm")
                  return resolvedUrl;
              return scriptDirectory + path;
          }
      };
  } else {
      return {};
  }
})();

/**
 * Creates a Wax Hive chain instance
 *
 * @param {?Partial<IWaxOptionsChain>} options wax options
 *
 * @returns {Promise<IHiveChainInterface>} Wax Hive chain API Instance
 *
 * @throws {WaxError} on any Wax API-related error
 */
export const createHiveChain = async(options: Partial<IWaxOptionsChain> = {}): Promise<IHiveChainInterface> => {
  return constructHiveChainWithWasm(MainModuleFunction, Object.assign({}, await moduleArgs), options);
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
export const createWaxFoundation = async(options: Partial<IWaxOptions> = {}): Promise<IWaxBaseInterface> => {
  return constructWaxFoundationWithWasm(MainModuleFunction, Object.assign({}, await moduleArgs), options);
};
