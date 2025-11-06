import type { IJsonRpcMockData } from "../api-mock";
import sunnyvo from "./data/sunnyvo";
import steem from "./data/steem";
import data4nonexistingAccount from "./data/data4nonexistingaccount";
import andablackwidow from "./data/andablackwidow";
import sunnyvoAccounts from "./data/sunnyvoAccounts";
import directSigners_5 from "./data/directSigners_5";
import directSigners_6 from "./data/directSigners_6";
import alice from "./data/alice";
import hivebuzz from "./data/hivebuzz";
import guest4test8 from "./data/guest4test8";
import zero_max_block_age from "./data/zero_max_block_age";
import alphaManabar1 from "./data/vote.manabar-1";
import alphaManabar50 from "./data/vote.manabar-50";
import alphaManabar100 from "./data/vote.manabar-100";

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

    if (accounts.length === 1 && accounts[0] === 'hivebuzz')
      return hivebuzz;

    if (accounts.length === 1 && accounts[0] === 'guest4test8')
      return guest4test8;

    if (accounts.length === 1 && accounts[0] === 'alpha.manabar1')
      return alphaManabar1;

    if (accounts.length === 1 && accounts[0] === 'alpha.manabar50')
      return alphaManabar50;

    if (accounts.length === 1 && accounts[0] === 'alpha.manabar100')
      return alphaManabar100;

    return;
  },
  "network_broadcast_api.broadcast_transaction": (params: Record<string, any>) => {
    const { max_block_age } = params;

    if (max_block_age === undefined || !(typeof max_block_age === "number"))
      return;

    if (max_block_age === 0)
      return zero_max_block_age;

    return;
  }
} satisfies IJsonRpcMockData;
