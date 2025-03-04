import { NaiAsset } from "./asset.js";
import type { TPublicKey } from "../../interfaces";

export interface ApiAccountAuth {
  "0": string;
  "1": number;
}

export interface ApiKeyAuth {
  "0": TPublicKey;
  "1": number;
}

export interface ApiDelayedVote {
  time: string;
  val: number | string;
}

export interface ApiAuthority {
  weight_threshold: number;
  account_auths: Array<ApiAccountAuth>;
  key_auths: Array<ApiKeyAuth>;
}

export interface ApiManabar {
  current_mana: string | number;
  last_update_time: number;
}

export interface ApiAccount {
  id: number;
  name: string;
  owner: ApiAuthority;
  active: ApiAuthority;
  posting: ApiAuthority;
  memo_key: TPublicKey;
  json_metadata: string;
  posting_json_metadata: string;
  proxy: string;
  previous_owner_update: string;
  last_owner_update: string;
  last_account_update: string;
  created: string;
  mined: boolean;
  recovery_account: string;
  last_account_recovery: string;
  reset_account: string;
  comment_count: number;
  lifetime_vote_count: number;
  post_count: number;
  can_vote: boolean;
  voting_manabar: ApiManabar;
  downvote_manabar: ApiManabar;
  balance: NaiAsset;
  savings_balance: NaiAsset;
  hbd_balance: NaiAsset;
  hbd_seconds: string;
  hbd_seconds_last_update: string;
  hbd_last_interest_payment: string;
  savings_hbd_balance: NaiAsset;
  savings_hbd_seconds: string;
  savings_hbd_seconds_last_update: string;
  savings_hbd_last_interest_payment: string;
  savings_withdraw_requests: number;
  reward_hbd_balance: NaiAsset;
  reward_hive_balance: NaiAsset;
  reward_vesting_balance: NaiAsset;
  reward_vesting_hive: NaiAsset;
  vesting_shares: NaiAsset;
  delegated_vesting_shares: NaiAsset;
  received_vesting_shares: NaiAsset;
  vesting_withdraw_rate: NaiAsset;
  post_voting_power: NaiAsset;
  next_vesting_withdrawal: string;
  withdrawn: number | string;
  to_withdraw: number | string;
  withdraw_routes: number;
  pending_transfers: number;
  curation_rewards: number | string;
  posting_rewards: number | string;
  proxied_vsf_votes: Array<string | number>;
  witnesses_voted_for: number;
  last_post: string;
  last_root_post: string;
  last_post_edit: string;
  last_vote_time: string;
  post_bandwidth: number;
  pending_claimed_accounts: number | string;
  open_recurrent_transfers: number;
  is_smt: boolean;
  delayed_votes: ApiDelayedVote[];
  governance_vote_expiration_ts: string;
}
