import type { IJsonRpcMockData } from "../api-mock";
import sunnyvo from "./data/sunnyvo";
import steem from "./data/steem";
import data4nonexistingAccount from "./data/data4nonexistingaccount";
import andablackwidow from "./data/andablackwidow";
import sunnyvoAccounts from "./data/sunnyvoAccounts";
import directSigners_5 from "./data/directSigners_5";
import directSigners_6 from "./data/directSigners_6";
import alice from "./data/alice";

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
    if (accounts.length === 1 && accounts[0] === 'andablackwidow')
      return andablackwidow;

    if (accounts.length === 4 && accounts[0] === 'ecency.app' && accounts[1] === 'hive.blog' && accounts[2] === 'steemauto' && accounts[3] === 'threespeak')
      return sunnyvoAccounts;

    if (accounts.length === 5 && accounts[0] === 'ecency' && accounts[1] === 'ecency.stats' && accounts[2] === 'esteem.app' && accounts[3] === 'esteemapp' && accounts[4] === 'good-karma')
      return directSigners_5;

    if (accounts.length === 6 && accounts[0] === 'ecency' && accounts[1] === 'ecency.stats' && accounts[2] === 'ecency.waves' && accounts[3] === 'esteem.app' && accounts[4] === 'esteemapp' && accounts[5] === 'good-karma')
      return directSigners_6;

    if (accounts.length === 1 && accounts[0] === 'alice')
      return alice;

    return;
  }
} satisfies IJsonRpcMockData;
