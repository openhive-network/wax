import { type IWaxOptionsChain, type IHiveChainInterface } from "./index.js";

import { WasmManager } from "./util/wasm_errors.js";
import { HiveChainApi } from "./chain_api.js";
import type waxmodule from "../build_wasm/wax.common.js";
import type { IOptionalModuleArgs } from "./module_types.js";
import { DEFAULT_WAX_OPTIONS } from "./base.js";
import { assignDefault } from "./util/iterate.js";

const API_CALL_TIMEOUT_MS = 2_000;

export const DEFAULT_WAX_OPTIONS_CHAIN: IWaxOptionsChain = {
  ...DEFAULT_WAX_OPTIONS,
  apiEndpoint: "https://api.hive.blog",
  restApiEndpoint: "https://api.syncad.com",
  apiTimeout: API_CALL_TIMEOUT_MS,
  waxApiCaller: undefined
}

// We have to keep wasmFn as any because createHiveChain is exported and will require wasmFn to have a type of module, we do not want to expose
export const createHiveChain = async(wasmFn: typeof waxmodule, ModuleExt: IOptionalModuleArgs = {}, options: Partial<IWaxOptionsChain> = {}): Promise<IHiveChainInterface> => {
  const wasmManager = new WasmManager(wasmFn, ModuleExt);
  const waxModule = await wasmManager.module;

  const apiOptions = assignDefault(DEFAULT_WAX_OPTIONS_CHAIN, options);

  const api = new HiveChainApi(wasmManager, waxModule, {
    chainId: apiOptions.chainId,
    apiEndpoint: apiOptions.apiEndpoint,
    restApiEndpoint: apiOptions.restApiEndpoint,
    apiTimeout: apiOptions.apiTimeout,
    waxApiCaller: apiOptions.waxApiCaller
  }, null);

  return api;
};
