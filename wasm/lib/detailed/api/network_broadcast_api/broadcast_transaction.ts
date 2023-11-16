import { Type } from "class-transformer"
import { IsDateString, IsNumber, IsObject, IsString, Min, MinLength, ValidateNested } from "class-validator"

import type { ITransactionBuilder } from "../../../interfaces";

import { transaction } from "../../../protocol.js";

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
  public operations: Array<object> = [];

  @IsObject({ each: true })
  public extensions: Array<object> = [];

  @IsString({ each: true })
  @MinLength(1) // Api requires at least one signature
  public signatures: Array<object> = [];
}

export class BroadcastTransactionRequest {
  public constructor(trx?: transaction | ITransactionBuilder) {
    if(typeof trx === 'undefined')
      return;

    if('toApi' in trx)
      this.trx = Object.assign(new ApiTransaction(), JSON.parse(trx.toApi()));
    else
      this.trx = Object.assign(new ApiTransaction(), transaction.toJSON(trx as transaction));
  }

  @ValidateNested()
  @Type(() => ApiTransaction)
  public trx!: ApiTransaction;

  @IsNumber()
  public max_block_age: number = -1;
}

export class BroadcastTransactionResponse {}
