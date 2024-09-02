import { Type } from "class-transformer";
import { IsBoolean, IsOptional, IsString, ValidateNested } from "class-validator";

import { ApiAccount } from "../types/index.js";

export class FindAccountsRequest {
  @IsString({ each: true })
  public accounts!: string[];

  @IsOptional()
  @IsBoolean()
  public delayed_votes_active?: boolean = true;
}

export class FindAccountsResponse {
  @Type(() => ApiAccount)
  @ValidateNested({ each: true })
  public accounts!: Array<ApiAccount>;
}
