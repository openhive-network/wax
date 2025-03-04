import type { NaiAsset } from "../types/asset.js";

export interface GetDynamicGlobalPropertiesRequest {}

export interface GetDynamicGlobalPropertiesResponse {
  id: number;
  head_block_number: number;
  head_block_id: string;
  time: string;
  current_witness: string;
  total_pow: string | number;
  num_pow_witnesses: number;
  virtual_supply: NaiAsset;
  current_supply: NaiAsset;
  confidential_supply: NaiAsset;
  init_hbd_supply: NaiAsset;
  current_hbd_supply: NaiAsset;
  current_remove_threshold: number;
  confidential_hbd_supply: NaiAsset;
  total_vesting_fund_hive: NaiAsset;
  total_vesting_shares: NaiAsset;
  total_reward_fund_hive: NaiAsset;
  total_reward_shares2: string;
  pending_rewarded_vesting_shares: NaiAsset;
  pending_rewarded_vesting_hive: NaiAsset;
  hbd_interest_rate: number;
  hbd_print_rate: number;
  maximum_block_size: number;
  mid_voting_seconds: number | string;
  min_recurrent_transfers_recurrence: number;
  required_actions_partition_percent?: number;
  current_aslot: number;
  recent_slots_filled: string;
  participation_count: number;
  last_irreversible_block_num: number;
  max_consecutive_recurrent_transfer_failures: number;
  max_open_recurrent_transfers: number;
  max_recurrent_transfer_end_date: number;
  target_votes_per_period?: number;
  delegation_return_period: number;
  reverse_auction_seconds: number;
  available_account_subsidies: number;
  hbd_stop_percent: number;
  hbd_start_percent: number;
  next_daily_maintenance_time: string;
  next_maintenance_time: string;
  last_budget_time: string;
  content_reward_percent: number;
  vesting_reward_percent: number;
  sps_fund_percent?: number;
  sps_interval_ledger: NaiAsset;
  downvote_pool_percent: number;
  early_voting_seconds: number | string;
  smt_creation_fee: NaiAsset;
}
