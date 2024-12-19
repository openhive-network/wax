import { Type } from "class-transformer";
import { IsBoolean, IsOptional, IsString, ValidateNested } from "class-validator";

import { ApiWitness} from "../types/index.js";

export class FindWitnessesRequest {
  @IsString({ each: true })
  public owners!: string[];

  @IsOptional()
  @IsBoolean()
  public delayed_votes_active?: boolean = true;
}

export class FindWitnessesResponse {
  @Type(() => ApiWitness)
  @ValidateNested({ each: true })
  public witnesses!: Array<ApiWitness>;
}
