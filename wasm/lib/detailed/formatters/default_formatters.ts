import type { ApiTransaction, NaiAsset } from "../api";
import type { IWaxFormatterOptions } from "./types";
import type { IWaxBaseInterface } from "../../interfaces";

import { WaxFormatable } from "../decorators/formatters";

export class DefaultFormatters {
  public constructor(
    public readonly options: IWaxFormatterOptions,
    private readonly wax: IWaxBaseInterface
  ) {}

  @WaxFormatable({ matchProperty: "nai" })
  public assetFormatter(value: NaiAsset): string {
    const { amount, symbol } = this.wax.getAsset(value);

    if(this.options.asset.appendTokenName)
      return `${amount} ${symbol}`;

    return amount;
  }

  @WaxFormatable({ matchProperty: "operations" })
  public transactionFormatter(value: ApiTransaction): string {
    const { id } = this.wax.TransactionBuilder.fromApi(value);

    return id;
  }
}
