export * from "./detailed/index.js";

import { createHiveChain as constructHiveChainWithWasm, createWaxFoundation as constructWaxFoundationWithWasm, type IWaxOptions, type IWaxOptionsChain, type IHiveChainInterface, type IWaxBaseInterface } from "./detailed/index.js";

// During bundle - this module will be replaced with the actual wasm module based on your environment
import MainModuleFunction from "wasm/lib/wax_module.js";

// This will be empty when SSR is disabled (client-side), but enable static import for SSR
import possibleFs from 'node:fs/promises';

const isSSR = typeof (import.meta as any).env === "object" && (import.meta as any).env.SSR;

import resolvedUrl from 'wax.common.wasm?url';

const moduleArgs = (async () => {
  let wasmBinary: Buffer | undefined;

  if (isSSR)
    wasmBinary = await possibleFs.readFile('wax.common.wasm');

  return {
    wasmBinary,
    locateFile: (path: string, scriptDirectory: string) => {
      if (path === "wax.common.wasm")
        return resolvedUrl as unknown as string;

      return scriptDirectory + path;
    }
  };
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
