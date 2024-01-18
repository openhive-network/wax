import type { ApiTransaction, NaiAsset } from "../api";
import type { IWaxCustomFormatter, IWaxFormatterOptions } from "./types";
import type { IWaxBaseInterface } from "../../interfaces";

import { WaxFormatable } from "../decorators/formatters";
import { DeepReadonly } from "./types";

export class DefaultFormatters implements IWaxCustomFormatter {
  public constructor(
    public readonly options: IWaxFormatterOptions,
    private readonly wax: IWaxBaseInterface
  ) {}

  @WaxFormatable({ matchProperty: "nai" })
  public assetFormatter(source: DeepReadonly<NaiAsset>): string {
    const { amount, symbol } = this.wax.getAsset(source);

    if(this.options.asset.appendTokenName)
      return `${amount} ${symbol}`;

    return amount;
  }

  @WaxFormatable({ matchProperty: "operations" })
  public transactionFormatter(source: DeepReadonly<ApiTransaction>, target: object): string | object {
    if(!this.options.transaction.displayAsId)
      return target;

    const { id } = this.wax.TransactionBuilder.fromApi(source);

    return id;
  }
}
