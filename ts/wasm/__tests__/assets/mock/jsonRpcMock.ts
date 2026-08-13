import type { IJsonRpcMockData } from "../api-mock";
import sunnyvo from "./data/sunnyvo";
import steem from "./data/steem";
import initminer from "./data/initminer";
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
import largeinput from "./data/largeinput";

// Note: database_api.get_dynamic_global_properties is fetched and cached
// at mock server startup (see start-proxy-mock-server.ts) to keep in sync
// with the real API. This static fallback is only used if that fetch fails.
const dgpoFallback = {
  jsonrpc: "2.0",
  result: {
    id: 0,
    head_block_id: "0000000100000000000000000000000000000000",
    head_block_number: 1,
    time: "2030-01-01T00:00:00",
    current_witness: "initminer",
    total_pow: 0,
    num_pow_witnesses: 0,
    virtual_supply: { amount: "0", precision: 3, nai: "@@000000021" },
    current_supply: { amount: "0", precision: 3, nai: "@@000000021" },
    init_hbd_supply: { amount: "0", precision: 3, nai: "@@000000013" },
    current_hbd_supply: { amount: "0", precision: 3, nai: "@@000000013" },
    total_vesting_fund_hive: { amount: "0", precision: 3, nai: "@@000000021" },
    total_vesting_shares: { amount: "0", precision: 6, nai: "@@000000037" },
    total_reward_fund_hive: { amount: "0", precision: 3, nai: "@@000000021" },
    total_reward_shares2: "0",
    pending_rewarded_vesting_shares: { amount: "0", precision: 6, nai: "@@000000037" },
    pending_rewarded_vesting_hive: { amount: "0", precision: 3, nai: "@@000000021" },
    hbd_interest_rate: 0,
    hbd_print_rate: 10000,
    maximum_block_size: 65536,
    current_aslot: 0,
    recent_slots_filled: "340282366920938463463374607431768211455",
    participation_count: 128,
    last_irreversible_block_num: 0,
    vote_power_reserve_rate: 10,
    delegation_return_period: 432000,
    reverse_auction_seconds: 0,
    available_account_subsidies: 0,
    hbd_stop_percent: 2000,
    hbd_start_percent: 2000,
    next_maintenance_time: "2030-01-01T00:00:00",
    last_budget_time: "2030-01-01T00:00:00",
    next_daily_maintenance_time: "2030-01-01T00:00:00",
    content_reward_percent: 6500,
    vesting_reward_percent: 1500,
    proposal_fund_percent: 1000,
    dhf_interval_ledger: { amount: "0", precision: 3, nai: "@@000000013" },
    downvote_pool_percent: 2500,
    current_remove_threshold: 200,
    early_voting_seconds: 86400,
    mid_voting_seconds: 172800,
    max_consecutive_recurrent_transfer_failures: 10,
    max_recurrent_transfer_end_date: 730,
    min_recurrent_transfers_recurrence: 24,
    max_open_recurrent_transfers: 255
  },
  id: 1
};

export default {
  "database_api.get_dynamic_global_properties": () => dgpoFallback,
  "condenser_api.get_active_votes": (params: Record<string, any>) => {
    if (params[0] === "malformed")
      return {
        error: {
          code: -32602,
          data: 12333333,
          message: 123
        },
        id: 1,
        jsonrpc: '2.0'
      };

    if (params[0] === "nodata")
      return {
        error: undefined,
        id: 1,
        jsonrpc: '2.0'
      };

    if (params[0] === "appspecific" && params[1] === "com.chrome.devtools.json")
      return {
        error: {
          code: -32602,
          data: 'Post appspecific/com.chrome.devtools.json does not exist',
          message: 'Invalid parameters'
        },
        id: 1,
        jsonrpc: '2.0'
      };

    return;
  },
  "database_api.find_accounts": (params: Record<string, any>) => {
    const { accounts } = params;

    if (accounts === undefined || !Array.isArray(accounts) || accounts.length === 0)
      return;

    if (accounts.length === 1 && accounts[0] === 'toolargeinputitis')
      return largeinput;

    if (accounts.length === 1 && accounts[0] === 'sunnyvo')
      return sunnyvo;

    if (accounts.length === 1 && accounts[0] === 'steem')
      return steem;

    if (accounts.length === 1 && accounts[0] === 'initminer')
      return initminer;

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
