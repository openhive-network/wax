import type { IHiveChainInterface, IWaxOptions } from "../interfaces.js";

import { HiveChainApi } from "./chain_api.js";
import MainModuleFunction from "../wax_module.js";
import { DEFAULT_WAX_OPTIONS } from "./base.js";

/**
 * Creates a Wax Hive chain instance
 *
 * @param {?Partial<IWaxOptions>} options wax options
 *
 * @returns {Promise<IHiveChainInterface>} Wax Hive chain API Instance
 *
 * @throws {import("../errors").WaxError} on any Wax API-related error
 */
export const createHiveChain = async(
  options: Partial<IWaxOptions> = {}
): Promise<IHiveChainInterface> => {
  const waxProvider = await MainModuleFunction();

  const apiOptions: IWaxOptions = { ...DEFAULT_WAX_OPTIONS, ...options };

  const api = new HiveChainApi(waxProvider, apiOptions.chainId);

  return api;
};
