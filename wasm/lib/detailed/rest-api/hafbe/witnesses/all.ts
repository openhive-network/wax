import { IsDateString, IsIn, IsNumber, IsSemVer, IsString } from "class-validator";
import { IsPublicKey } from "../../../decorators/is_public_key.js";

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

export class GetAllWitnessesResponse {
  @IsString()
  public witnes!: string;

  @IsNumber()
  public rank!: number;

  @IsString()
  public url!: string;

  @IsString()
  public vests!: string;

  @IsNumber()
  public vests_hive_power!: number;

  @IsString()
  public votes_daily_change!: string;

  @IsString()
  public votes_daily_change_hive_power!: string;

  @IsNumber()
  public voters_num!: number;

  @IsNumber()
  public voters_num_daily_change!: number;

  @IsNumber()
  public price_feed!: number;

  @IsNumber()
  public bias!: number;

  @IsDateString()
  public feed_updated_at!: string;

  @IsNumber()
  public block_size!: number;

  @IsPublicKey()
  public signing_key!: string;

  @IsSemVer()
  public version!: string;

  @IsNumber()
  public missed_blocks!: number;

  @IsNumber()
  public hbd_interest_rate!: number;
}
