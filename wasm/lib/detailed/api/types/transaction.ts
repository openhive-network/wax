import { IsNumber, Min, IsDateString, IsObject, ArrayNotEmpty, IsString } from "class-validator";

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
  @ArrayNotEmpty() // Api requires at least one operation
  public operations: object[] = [];

  @IsObject({ each: true })
  public extensions: object[] = [];

  @IsString({ each: true })
  @ArrayNotEmpty() // Api requires at least one signature
  public signatures: string[] = [];
}
