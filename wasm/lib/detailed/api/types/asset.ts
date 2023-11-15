import { IsNumber, IsString, Validate } from "class-validator";

import { IsNaiString } from "../../decorators/is_nai_string.js";

export class NaiAsset {
  @IsString()
  public amount!: string;

  @IsNumber()
  public precision!: number;

  @Validate(IsNaiString)
  public nai!: string;
}
