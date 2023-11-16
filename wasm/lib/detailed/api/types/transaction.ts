import { IsNumber, Min, IsDateString, IsObject, MinLength, IsString } from "class-validator";

export class ApiTransaction {
  @IsNumber()
  @Min(1) // Should be initialized
  public ref_block_num!: number;

  @IsNumber()
  @Min(1) // Should be initialized
  public ref_block_prefix!: number;

  @IsDateString()
  public expiration!: string;

  @IsObject({ each: true })
  @MinLength(1) // Api requires at least one operation
  public operations: object[] = [];

  @IsObject({ each: true })
  public extensions: object[] = [];

  @IsString({ each: true })
  @MinLength(1) // Api requires at least one signature
  public signatures: string[] = [];
}
