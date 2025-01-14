import type { IJsonRpcMockData } from "../api-mock";
import sunnyvo from "./data/sunnyvo";
import steem from "./data/steem";

export default {
  "database_api.find_accounts": (params: Record<string, any>) => {
    const { accounts } = params;

    if (accounts === undefined || !Array.isArray(accounts) || accounts.length === 0)
      return;

    if (accounts.length === 1 && accounts[0] === 'sunnyvo')
      return sunnyvo;

    if (accounts.length === 1 && accounts[0] === 'steem')
      return steem;

    return;
  }
} satisfies IJsonRpcMockData;
