import { Type } from "class-transformer"
import { IsNumber, ValidateNested } from "class-validator"

import type { ITransactionBuilder } from "../../../interfaces";

import { transaction } from "../../../protocol.js";
import { ApiTransaction } from "../types/transaction.js";

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
