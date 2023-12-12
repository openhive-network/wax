import type { TPublicKey } from "@hive/beekeeper";
import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsDateString, IsNumber, IsNumberString, IsString, Validate, ValidateNested } from "class-validator";

import { NaiAsset } from "./asset.js";
import { IsNumberOrStringNumber } from "../../decorators/is_number_or_number_string.js";
import { IsPublicKey } from "../../decorators/is_public_key.js";
import { IsAuth } from "../../decorators/is_auth.js";

export class ApiAccountAuth {
  @IsString()
  public "0"!: string;

  @IsNumber()
  public "1"!: number;
}

export class ApiKeyAuth {
  @Validate(IsPublicKey)
  public "0"!: TPublicKey;

  @IsNumber()
  public "1"!: number;
}

export class ApiDelayedVote {
  @IsDateString()
  public time!: string;

  @Validate(IsNumberOrStringNumber)
  public val!: number | string;
}

export class ApiAuthority {
  @IsNumber()
  public weight_threshold!: number;

  @IsArray()
  @Type(() => ApiAccountAuth)
  @Validate(IsAuth)
  public account_auths!: Array<ApiAccountAuth>;

  @IsArray()
  @Type(() => ApiKeyAuth)
  @Validate(IsAuth)
  public key_auths!: Array<ApiKeyAuth>;
}

export class ApiManabar {
  @Validate(IsNumberOrStringNumber)
  public current_mana!: string | number;

  @IsNumber()
  public last_update_time!: number;
}

export class ApiAccount {
  @IsNumber()
  public id!: number;

  @IsString()
  public name!: string;

  @Type(() => ApiAuthority)
  @ValidateNested()
  public owner!: ApiAuthority;

  @Type(() => ApiAuthority)
  @ValidateNested()
  public active!: ApiAuthority;

  @Type(() => ApiAuthority)
  @ValidateNested()
  public posting!: ApiAuthority;

  @Validate(IsPublicKey)
  public memo_key!: TPublicKey;

  @IsString()
  public json_metadata!: string;

  @IsString()
  public posting_json_metadata!: string;

  @IsString()
  public proxy!: string;

  @IsDateString()
  public previous_owner_update!: string;

  @IsDateString()
  public last_owner_update!: string;

  @IsDateString()
  public last_account_update!: string;

  @IsDateString()
  public created!: string;

  @IsBoolean()
  public mined!: boolean;

  @IsString()
  public recovery_account!: string;

  @IsDateString()
  public last_account_recovery!: string;

  @IsString()
  public reset_account!: string;

  @IsNumber()
  public comment_count!: number;

  @IsNumber()
  public lifetime_vote_count!: number;

  @IsNumber()
  public post_count!: number;

  @IsBoolean()
  public can_vote!: boolean;

  @Type(() => ApiManabar)
  @ValidateNested()
  public voting_manabar!: ApiManabar;

  @Type(() => ApiManabar)
  @ValidateNested()
  public downvote_manabar!: ApiManabar;

  @Type(() => NaiAsset)
  @ValidateNested()
  public balance!: NaiAsset;

  @Type(() => NaiAsset)
  @ValidateNested()
  public savings_balance!: NaiAsset;

  @Type(() => NaiAsset)
  @ValidateNested()
  public hbd_balance!: NaiAsset;

  @IsNumberString()
  public hbd_seconds!: string;

  @IsDateString()
  public hbd_seconds_last_update!: string;

  @IsDateString()
  public hbd_last_interest_payment!: string;

  @Type(() => NaiAsset)
  @ValidateNested()
  public savings_hbd_balance!: NaiAsset;

  @IsNumberString()
  public savings_hbd_seconds!: string;

  @IsDateString()
  public savings_hbd_seconds_last_update!: string;

  @IsDateString()
  public savings_hbd_last_interest_payment!: string;

  @IsNumber()
  public savings_withdraw_requests!: number;

  @Type(() => NaiAsset)
  @ValidateNested()
  public reward_hbd_balance!: NaiAsset;

  @Type(() => NaiAsset)
  @ValidateNested()
  public reward_hive_balance!: NaiAsset;

  @Type(() => NaiAsset)
  @ValidateNested()
  public reward_vesting_balance!: NaiAsset;

  @Type(() => NaiAsset)
  @ValidateNested()
  public reward_vesting_hive!: NaiAsset;

  @Type(() => NaiAsset)
  @ValidateNested()
  public vesting_shares!: NaiAsset;

  @Type(() => NaiAsset)
  @ValidateNested()
  public delegated_vesting_shares!: NaiAsset;

  @Type(() => NaiAsset)
  @ValidateNested()
  public received_vesting_shares!: NaiAsset;

  @Type(() => NaiAsset)
  @ValidateNested()
  public vesting_withdraw_rate!: NaiAsset;

  @Type(() => NaiAsset)
  @ValidateNested()
  public post_voting_power!: NaiAsset;

  @IsDateString()
  public next_vesting_withdrawal!: string;

  @IsNumber()
  public withdrawn!: number;

  @IsNumber()
  public to_withdraw!: number;

  @IsNumber()
  public withdraw_routes!: number;

  @IsNumber()
  public pending_transfers!: number;

  @IsNumber()
  public curation_rewards!: number;

  @IsNumber()
  public posting_rewards!: number;

  @Validate(IsNumberOrStringNumber, { each: true })
  public proxied_vsf_votes!: Array<string | number>;

  @IsNumber()
  public witnesses_voted_for!: number;

  @IsDateString()
  public last_post!: string;

  @IsDateString()
  public last_root_post!: string;

  @IsDateString()
  public last_post_edit!: string;

  @IsDateString()
  public last_vote_time!: string;

  @IsNumber()
  public post_bandwidth!: number;

  @IsNumber()
  public pending_claimed_accounts!: number;

  @IsNumber()
  public open_recurrent_transfers!: number;

  @IsBoolean()
  public is_smt!: boolean;

  @Type(() => ApiDelayedVote)
  @ValidateNested()
  public delayed_votes!: ApiDelayedVote;

  @IsDateString()
  public governance_vote_expiration_ts!: string;
}
