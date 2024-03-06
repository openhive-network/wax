import { Type } from "class-transformer";
import { IsBoolean, ValidateNested } from "class-validator";
import { ApiTransaction } from "../types"

export class VerifyAuthorityRequest {
  @ValidateNested()
  @Type(() => ApiTransaction)
  public trx!: ApiTransaction;
};

export class VerifyAuthorityResponse {
  @IsBoolean()
  public valid: boolean = false;
};
