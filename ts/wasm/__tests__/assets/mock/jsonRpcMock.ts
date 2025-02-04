import type { IJsonRpcMockData } from "../api-mock";
import sunnyvo from "./data/sunnyvo";
import steem from "./data/steem";
import data4nonexistingAccount from "./data/data4nonexistingaccount";

export default {
  "database_api.find_accounts": (params: Record<string, any>) => {
    const { accounts } = params;

    if (accounts === undefined || !Array.isArray(accounts) || accounts.length === 0)
      return;

    if (accounts.length === 1 && accounts[0] === 'sunnyvo')
      return sunnyvo;

    if (accounts.length === 1 && accounts[0] === 'steem')
      return steem;

    if (accounts.length === 1 && accounts[0] === '0steem')
      return data4nonexistingAccount;

    return;
  }
} satisfies IJsonRpcMockData;
