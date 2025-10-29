import type { NaiAsset } from "../types/asset.js";

export interface GetWitnessScheduleRequest {}

export interface GetWitnessScheduleResponse {
  id: number;
  current_virtual_time: string;
  next_shuffle_block_num: number;
  current_shuffled_witnesses: Array<string>;
  num_scheduled_witnesses: number;
  elected_weight: number;
  timeshare_weight: number;
  miner_weight: number;
  witness_pay_normalization_factor: number;
  median_props: {
    account_creation_fee: NaiAsset;
    maximum_block_size: number;
    hbd_interest_rate: number;
    account_subsidy_budget: number;
    account_subsidy_decay: number;
  };
  majority_version: string;
  max_voted_witnesses: number;
  max_miner_witnesses: number;
  max_runner_witnesses: number;
  hardfork_required_witnesses: number;
  account_subsidy_rd: {
    resource_unit: number;
    budget_per_time_unit: number;
    pool_eq: number;
    max_pool_size: number;
    decay_params: {
      decay_per_time_unit: number;
      decay_per_time_unit_denom_shift: number;
    };
    min_decay: number;
  };
  account_subsidy_witness_rd: {
    resource_unit: number;
    budget_per_time_unit: number;
    pool_eq: number;
    max_pool_size: number;
    decay_params: {
      decay_per_time_unit: number;
      decay_per_time_unit_denom_shift: number;
    };
    min_decay: number;
  };
  min_witness_account_subsidy_decay: number;
}
