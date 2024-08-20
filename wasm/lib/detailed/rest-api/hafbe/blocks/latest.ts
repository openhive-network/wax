import { Type } from "class-transformer";
import { IsArray, IsNumber, IsString, ValidateNested } from "class-validator";

export class GetLatestBlocksRequest {
  @IsNumber()
  public 'result-limit'!: number;
}

export class OpsCount {
  @IsNumber()
  public count!: number;

  @IsNumber()
  public op_type_id!: number;
}

export class GetLatestBlocksResponse {
  @IsNumber()
  public block_num!: number;

  @IsString()
  public witness!: string;

  @Type(() => OpsCount)
  @ValidateNested({ each: true })
  @IsArray()
  public ops_count!: OpsCount[];
}
