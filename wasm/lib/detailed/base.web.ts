import type { IWaxBaseInterface, IWaxOptions } from "../interfaces.js";

import { WaxBaseApi } from "./base_api.js";
import MainModuleFunction from "../wax_module.web.js";

export const DEFAULT_WAX_OPTIONS: IWaxOptions = {
  chainId: "beeab0de00000000000000000000000000000000000000000000000000000000"
};

/**
 * Creates a Wax Hive base instance
 *
 * @param {?Partial<IWaxOptions>} options wax options
 *
 * @returns {Promise<IWaxBaseInterface>} Wax Hive Base API Instance
 *
 * @throws {import("../errors").WaxError} on any Wax API-related error
 */
export const createWaxFoundation = async(
  options: Partial<IWaxOptions> = {}
): Promise<IWaxBaseInterface> => {
  const waxProvider = await MainModuleFunction();

  const apiOptions: IWaxOptions = { ...DEFAULT_WAX_OPTIONS, ...options };

  const api = new WaxBaseApi(waxProvider, apiOptions.chainId);

  return api;
};
