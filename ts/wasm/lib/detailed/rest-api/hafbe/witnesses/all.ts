const witnessSortKeys = ['witness', 'rank', 'url', 'votes', 'votes_daily_change', 'voters_num',
  'voters_num_daily_change', 'price_feed', 'bias', 'block_size', 'signing_key', 'version'] as const;

type TWitnessSortKeys = typeof witnessSortKeys[number];

const directionKeys = ['asc', 'desc'] as const;

type TDirectionKeys = typeof directionKeys[number];

export interface GetAllWitnessesRequest {
  'result-limit'?: number;

  'offset'?: number;

  sort?: TWitnessSortKeys;

  direction?: TDirectionKeys;
}
