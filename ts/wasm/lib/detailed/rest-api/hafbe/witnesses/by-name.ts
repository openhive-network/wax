export interface GetWitnessesByNameRequest {
  accountName: string;
}

export interface SingleWitnessResponse {
  witnes: string;
  rank: number;
  url: string;
  vests: string;
  vests_hive_power: number;
  votes_daily_change: string;
  votes_daily_change_hive_power: string;
  voters_num: number;
  voters_num_daily_change: number;
  price_feed: number;
  bias: number;
  feed_updated_at: string;
  block_size: number;
  signing_key: string;
  version: string;
  missed_blocks: number;
  hbd_interest_rate: number;
}
