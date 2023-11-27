import type { ITransactionBuilderConstructor, IWaxBaseInterface } from "../interfaces";
import type { MainModule, result } from "../wax_module";

import { WaxError } from '../errors.js';
import { TransactionBuilder } from "./transaction_builder.js";
import { proto_protocol } from "../wax_module.js";
import Long from "long";

export class WaxBaseApi implements IWaxBaseInterface {
  public proto: proto_protocol;

  public extract(res: result): string {
    if(res.value !== this.wax.error_code.ok)
      throw new WaxError(`Wax API error: "${String(res.exception_message as string)}"`);

    return res.content as string;
  }

  public constructor(
    public readonly wax: MainModule,
    public readonly chainId: string
  ) {
    this.proto = new wax.proto_protocol();
  }

  get TransactionBuilder(): ITransactionBuilderConstructor {
    return Object.assign(
      TransactionBuilder.bind(undefined, this),
      {
        fromApi: TransactionBuilder.fromApi.bind(undefined, this)
      }
    );
  }

  calculateCurrentManabarValue(now: number, maxManaLH: number | string | Long, currentManaLH: number | string | Long, lastUpdateTime: number): string {
    if(typeof maxManaLH !== "object")
      maxManaLH = Long.fromString(maxManaLH.toString());

    if(typeof currentManaLH !== "object")
      currentManaLH = Long.fromString(currentManaLH.toString());

    return this.extract(this.proto.cpp_calculate_current_manabar_value(now, maxManaLH.low, maxManaLH.high, currentManaLH.low, currentManaLH.high, lastUpdateTime));
  }

  calculateManabarFullRegenerationTime(now: number, maxManaLH: number | string | Long, currentManaLH: number | string | Long, lastUpdateTime: number): string {
    if(typeof maxManaLH !== "object")
      maxManaLH = Long.fromString(maxManaLH.toString());

    if(typeof currentManaLH !== "object")
      currentManaLH = Long.fromString(currentManaLH.toString());

    return this.extract(this.proto.cpp_calculate_manabar_full_regeneration_time(now, maxManaLH.low, maxManaLH.high, currentManaLH.low, currentManaLH.high, lastUpdateTime));
  }

  delete(): void {
    this.proto.delete();
  }
}
