import type { IHiveChainInterface, IWaxOptionsChain } from "../interfaces.js";

import { HiveChainApi } from "./chain_api.js";
import MainModuleFunction from "../wax_module.web.js";
import { DEFAULT_WAX_OPTIONS } from "./base.web.js";

export const DEFAULT_WAX_OPTIONS_CHAIN: IWaxOptionsChain = {
  ...DEFAULT_WAX_OPTIONS,
  apiEndpoint: "https://api.hive.blog"
}

/**
 * Creates a Wax Hive chain instance
 *
 * @param {?Partial<IWaxOptionsChain>} options wax options
 *
 * @returns {Promise<IHiveChainInterface>} Wax Hive chain API Instance
 *
 * @throws {import("../errors").WaxError} on any Wax API-related error
 */
export const createHiveChain = async(
  options: Partial<IWaxOptionsChain> = {}
): Promise<IHiveChainInterface> => {
  const waxProvider = await MainModuleFunction();

  const apiOptions: IWaxOptionsChain = { ...DEFAULT_WAX_OPTIONS_CHAIN, ...options };

  const api = new HiveChainApi(waxProvider, apiOptions.chainId, apiOptions.apiEndpoint);

  return api;
};
