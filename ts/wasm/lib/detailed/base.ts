import type { IWaxBaseInterface, IWaxOptions } from "./index.js";

import { safeAsyncWasmCall } from "./util/wasm_errors.js";
import { WaxBaseApi } from "./base_api.js";

export const DEFAULT_WAX_OPTIONS: IWaxOptions = {
  chainId: "beeab0de00000000000000000000000000000000000000000000000000000000"
};

// We have to keep wasmFn as any because createWaxFoundation is exported and will require wasmFn to have a type of module, we do not want to expose
export const createWaxFoundation = async(wasmFn: any, ModuleExt: Partial<Record<string, any>> = {}, options: Partial<IWaxOptions> = {}): Promise<IWaxBaseInterface> => {
  const waxProvider = await safeAsyncWasmCall(() => wasmFn(ModuleExt));

  const apiOptions: IWaxOptions = { ...DEFAULT_WAX_OPTIONS, ...options };

  const api = new WaxBaseApi(waxProvider, apiOptions.chainId);

  return api;
};
