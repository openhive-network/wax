import { IsNumber, Max, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { ApiBlock } from "../types/block.js";

export class GetBlockRangeRequest {
  @IsNumber()
  @Min(0)
  public starting_block_num!: number;

  @IsNumber()
  @Min(0)
  @Max(1000)
  public count!: number;
}

export class GetBlockRangeResponse {
  @ValidateNested({ each: true })
  @Type(() => ApiBlock)
  public blocks!: Array<ApiBlock>;
}
