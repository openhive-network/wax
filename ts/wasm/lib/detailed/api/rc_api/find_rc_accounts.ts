import { Type } from "class-transformer";
import { IsString, Validate, ValidateNested } from "class-validator";

import { ApiManabar, NaiAsset } from "../types/index.js";
import { IsNumberOrStringNumber } from "../../decorators/is_number_or_number_string.js";

export class FindRcAccountsRequest {
  @IsString({ each: true })
  public accounts!: string[];
}

export class RcAccount {
  @IsString()
  public account!: string;

  @Type(() => ApiManabar)
  @ValidateNested()
  public rc_manabar!: ApiManabar;

  @Type(() => NaiAsset)
  @ValidateNested()
  public max_rc_creation_adjustment!: NaiAsset;

  @Validate(IsNumberOrStringNumber)
  public max_rc!: string | number;
}

export class FindRcAccountsResponse {
  @Type(() => RcAccount)
  @ValidateNested({ each: true })
  public rc_accounts!: Array<RcAccount>;
}
