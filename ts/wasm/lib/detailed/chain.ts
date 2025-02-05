import { type IWaxOptionsChain, type IHiveChainInterface } from "./index.js";

import { safeAsyncWasmCall } from "./util/wasm_errors.js";
import { HiveChainApi } from "./chain_api.js";
import type waxmodule from "../build_wasm/wax.common.js";
import type { IOptionalModuleArgs } from "./module_types.js";
import { DEFAULT_WAX_OPTIONS } from "./base.js";

export const DEFAULT_WAX_OPTIONS_CHAIN: IWaxOptionsChain = {
  ...DEFAULT_WAX_OPTIONS,
  apiEndpoint: "https://api.hive.blog",
  restApiEndpoint: "https://api.syncad.com"
}

// We have to keep wasmFn as any because createHiveChain is exported and will require wasmFn to have a type of module, we do not want to expose
export const createHiveChain = async(wasmFn: typeof waxmodule, ModuleExt: IOptionalModuleArgs = {}, options: Partial<IWaxOptionsChain> = {}): Promise<IHiveChainInterface> => {
  const waxProvider = await safeAsyncWasmCall(() => wasmFn(ModuleExt));

  const apiOptions: IWaxOptionsChain = { ...DEFAULT_WAX_OPTIONS_CHAIN, ...options };

  const api = new HiveChainApi(waxProvider, apiOptions.chainId, apiOptions.apiEndpoint, apiOptions.restApiEndpoint, null);

  return api;
};
