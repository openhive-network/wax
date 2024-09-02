import { IsNumber, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { ApiBlockHeader } from "../types/block.js";

export class GetBlockHeaderRequest {
  @IsNumber()
  @Min(0)
  public block_num!: number;
}

export class GetBlockHeaderResponse {
  @ValidateNested()
  @Type(() => ApiBlockHeader)
  public header!: ApiBlockHeader;
}
