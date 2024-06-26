import { IsDateString, IsHexadecimal, IsNumber, IsOptional, IsString, Validate, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { NaiAsset } from "../types/asset.js";
import { IsNumberOrStringNumber } from "../../decorators/is_number_or_number_string.js";

export class GetDynamicGlobalPropertiesRequest {}

export class GetDynamicGlobalPropertiesResponse {
  @IsNumber()
  public id!: number;

  @IsNumber()
  public head_block_number!: number;

  @IsHexadecimal()
  public head_block_id!: string;

  @IsDateString()
  public time!: string;

  @IsString()
  public current_witness!: string;

  @Validate(IsNumberOrStringNumber)
  public total_pow!: string | number;

  @IsNumber()
  public num_pow_witnesses!: number;

  @Type(() => NaiAsset)
  @ValidateNested()
  public virtual_supply!: NaiAsset;

  @Type(() => NaiAsset)
  @ValidateNested()
  public current_supply!: NaiAsset;

  @Type(() => NaiAsset)
  @ValidateNested()
  public confidential_supply!: NaiAsset;

  @Type(() => NaiAsset)
  @ValidateNested()
  public init_hbd_supply!: NaiAsset;

  @Type(() => NaiAsset)
  @ValidateNested()
  public current_hbd_supply!: NaiAsset;

  @IsNumber()
  public current_remove_threshold!: number;

  @Type(() => NaiAsset)
  @ValidateNested()
  public confidential_hbd_supply!: NaiAsset;

  @Type(() => NaiAsset)
  @ValidateNested()
  public total_vesting_fund_hive!: NaiAsset;

  @Type(() => NaiAsset)
  @ValidateNested()
  public total_vesting_shares!: NaiAsset;

  @Type(() => NaiAsset)
  @ValidateNested()
  public total_reward_fund_hive!: NaiAsset;

  @IsString()
  public total_reward_shares2!: string;

  @Type(() => NaiAsset)
  @ValidateNested()
  public pending_rewarded_vesting_shares!: NaiAsset;

  @Type(() => NaiAsset)
  @ValidateNested()
  public pending_rewarded_vesting_hive!: NaiAsset;

  @IsNumber()
  public hbd_interest_rate!: number;

  @IsNumber()
  public hbd_print_rate!: number;

  @IsNumber()
  public maximum_block_size!: number;

  @Validate(IsNumberOrStringNumber)
  public mid_voting_seconds!: number | string;

  @IsNumber()
  public min_recurrent_transfers_recurrence!: number;

  @IsNumber()
  @IsOptional()
  public required_actions_partition_percent?: number;

  @IsNumber()
  public current_aslot!: number;

  @IsString()
  public recent_slots_filled!: string;

  @IsNumber()
  public participation_count!: number;

  @IsNumber()
  public last_irreversible_block_num!: number;

  @IsNumber()
  public max_consecutive_recurrent_transfer_failures!: number;

  @IsNumber()
  public max_open_recurrent_transfers!: number;

  @IsNumber()
  public max_recurrent_transfer_end_date!: number;

  @IsOptional()
  @IsNumber()
  public target_votes_per_period?: number;

  @IsNumber()
  public delegation_return_period!: number;

  @IsNumber()
  public reverse_auction_seconds!: number;

  @IsNumber()
  public available_account_subsidies!: number;

  @IsNumber()
  public hbd_stop_percent!: number;

  @IsNumber()
  public hbd_start_percent!: number;

  @IsDateString()
  public next_daily_maintenance_time!: string;

  @IsDateString()
  public next_maintenance_time!: string;

  @IsDateString()
  public last_budget_time!: string;

  @IsNumber()
  public content_reward_percent!: number;

  @IsNumber()
  public vesting_reward_percent!: number;

  @IsOptional()
  @IsNumber()
  public sps_fund_percent?: number;

  @Type(() => NaiAsset)
  @ValidateNested()
  public sps_interval_ledger!: NaiAsset;

  @IsNumber()
  public downvote_pool_percent!: number;

  @Validate(IsNumberOrStringNumber)
  public early_voting_seconds!: number | string;

  @Type(() => NaiAsset)
  @ValidateNested()
  public smt_creation_fee!: NaiAsset;
}
