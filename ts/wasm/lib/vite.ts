export * from "./detailed/index.js";

import { createHiveChain as constructHiveChainWithWasm, createWaxFoundation as constructWaxFoundationWithWasm, type IWaxOptions, type IWaxOptionsChain, type IHiveChainInterface, type IWaxBaseInterface } from "./detailed/index.js";

// During bundle - this module will be replaced with the actual wasm module based on your environment
import MainModuleFunction from "./build_wasm/wax.common.js";

const moduleLocation = (async () => {
  // Resolve WASM url only for Nuxt client (first condition) or Vite client (second condition)
  if ((import.meta as any).client || (!("client" in import.meta) && typeof (import.meta as any).env === "object" && "SSR" in (import.meta as any).env))
    return (await import('./build_wasm/wax.common.wasm' + '?url')).default;
})();

const getModuleExt = async(fileLocation?: string) => {
  // Warning: important change is moving conditional ternary expression outside of URL constructor call, what confused parcel analyzer.
  // Seems it must have simple variables & literals present to correctly translate code.
  const wasmFilePath = fileLocation ?? await moduleLocation;
  if (wasmFilePath === undefined)
    return {};

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
          if (path === "wax.common.wasm")
              return wasmFilePath;
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
export const createHiveChain = async(options: Partial<IWaxOptionsChain> = {}): Promise<IHiveChainInterface> => {
  const { wasmLocation, ...otherOptions } = options || {};

  return constructHiveChainWithWasm(MainModuleFunction, await getModuleExt(wasmLocation), otherOptions);
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
  const { wasmLocation, ...otherOptions } = options || {};

  return constructWaxFoundationWithWasm(MainModuleFunction, await getModuleExt(wasmLocation), otherOptions);
};
