import { Type } from "class-transformer";
import { IsBoolean, ValidateNested, IsEnum } from "class-validator";
import { TTransactionPackType, ApiTransaction } from "../types"

export class VerifyAuthorityRequest {
  @ValidateNested()
  @Type(() => ApiTransaction)
  public trx!: ApiTransaction;

  @IsEnum(TTransactionPackType)
  public pack: TTransactionPackType = TTransactionPackType.HF_26;
};

export class VerifyAuthorityResponse {
  @IsBoolean()
  public valid: boolean = false;
};
