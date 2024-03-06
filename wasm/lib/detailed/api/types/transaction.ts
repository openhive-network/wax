import { Type } from "class-transformer";
import { Min, Max, IsDateString, IsInt, IsObject, IsString, ValidateNested } from "class-validator";

export class ApiOperation {
  @IsString()
  public type!: string;

  @IsObject()
  public value!: object;
}

export class ApiTransaction {
  @IsInt()
  @Min(0) // Should be set to min/max. uint16 value
  @Max(65535)
  public ref_block_num!: number;

  @IsInt()
  @Min(0)
  @Max(4294967295)
  public ref_block_prefix!: number;

  @IsDateString()
  public expiration!: string;

  @ValidateNested({ each: true })
  @Type(() => ApiOperation)
  public operations: Array<ApiOperation> = [];

  @IsObject({ each: true })
  public extensions: object[] = [];

  @IsString({ each: true })
  public signatures: string[] = [];
}
