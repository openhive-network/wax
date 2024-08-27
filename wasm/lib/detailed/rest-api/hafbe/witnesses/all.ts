import { IsIn, IsNumber } from "class-validator";

const witnessSortKeys = ['witness', 'rank', 'url', 'votes', 'votes_daily_change', 'voters_num',
  'voters_num_daily_change', 'price_feed', 'bias', 'block_size', 'signing_key', 'version'] as const;

type TWitnessSortKeys = typeof witnessSortKeys[number];

const directionKeys = ['asc', 'desc'] as const;

type TDirectionKeys = typeof directionKeys[number];

export class GetAllWitnessesRequest {
  @IsNumber()
  public 'result-limit'?: number = 100;

  @IsNumber()
  public 'offset'?: number = 0;

  @IsIn(witnessSortKeys)
  public sort?: TWitnessSortKeys = 'votes';

  @IsIn(directionKeys)
  public direction?: TDirectionKeys = 'desc';
}
