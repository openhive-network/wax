import { Type } from "class-transformer";
import { IsDateString, IsHexadecimal, IsObject, IsString, Validate, ValidateNested } from "class-validator";

import { ApiTransaction } from "./transaction.js";
import { IsPublicKey } from "../../decorators/is_public_key.js";

export class ApiBlockHeader {
  @IsHexadecimal()
  public previous!: string;

  @IsDateString()
  public timestamp!: string;

  @IsString()
  public witness!: string;

  @IsHexadecimal()
  public transaction_merkle_root!: string;

  @IsObject({ each: true })
  public extensions: object[] = [];
}

export class ApiBlock extends ApiBlockHeader {
  @IsHexadecimal()
  public witness_signature!: string;

  @ValidateNested({ each: true })
  @Type(() => ApiTransaction)
  public transactions: Array<ApiTransaction> = [];

  @IsHexadecimal()
  public block_id!: string;

  @Validate(IsPublicKey)
  public signing_key!: string;

  @IsHexadecimal({ each: true })
  public transaction_ids: string[] = [];
}
