import { Type } from "class-transformer"
import { IsNumber, ValidateNested } from "class-validator"

import type { ITransactionBuilder } from "../../../interfaces";

import { ApiTransaction } from "../types/transaction.js";
import { WaxError } from "../../../errors.js";

export class BroadcastTransactionRequest {
  public constructor(trx?: ITransactionBuilder) {
    if(typeof trx === 'undefined')
      return;

    if(!trx.isSigned())
      throw new WaxError('Transaction requires at least one signature.');

    this.trx = Object.assign(new ApiTransaction(), JSON.parse(trx.toApi()));
  }

  @ValidateNested()
  @Type(() => ApiTransaction)
  public trx!: ApiTransaction;

  @IsNumber()
  public max_block_age: number = -1;
}

export class BroadcastTransactionResponse {}
