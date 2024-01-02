import { Min, Max, IsDateString, IsInt, IsObject, ArrayNotEmpty, IsString } from "class-validator";

export class ApiTransaction {
  @IsInt()
  @Min(0) // Should be set to min/max. uint16 value
  @Max(65535)
  public ref_block_num!: number;

  @IsInt()
  @Min(-2147483648)
  @Max(2147483647)
  public ref_block_prefix!: number;

  @IsDateString()
  public expiration!: string;

  @IsObject({ each: true })
  @ArrayNotEmpty() // Api requires at least one operation
  public operations: object[] = [];

  @IsObject({ each: true })
  public extensions: object[] = [];

  @IsString({ each: true })
  public signatures: string[] = [];
}
