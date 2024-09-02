import { IsNumber, IsOptional, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { ApiBlock } from "../types/block.js";

export class GetBlockRequest {
  @IsNumber()
  @Min(0)
  public block_num!: number;
}

export class GetBlockResponse {
  @ValidateNested()
  @IsOptional()
  @Type(() => ApiBlock)
  public block?: ApiBlock;
}
