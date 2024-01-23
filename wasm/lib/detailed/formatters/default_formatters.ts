import type { ApiTransaction, NaiAsset } from "../api";
import type { IFormatFunctionArguments, IWaxCustomFormatter } from "./types";
import type { IWaxBaseInterface } from "../../interfaces";

import { WaxFormattable } from "../decorators/formatters";

export class DefaultFormatters implements IWaxCustomFormatter {
  public constructor(
    private readonly wax: IWaxBaseInterface
  ) {}

  @WaxFormattable({ matchProperty: "nai" })
  public assetFormatter({ options, source }: IFormatFunctionArguments<NaiAsset>): string {
    const { amount, symbol } = this.wax.getAsset(source);

    if(options.asset.appendTokenName)
      return `${amount} ${symbol}`;

    return amount;
  }

  @WaxFormattable({ matchProperty: "operations" })
  public transactionFormatter({ options, source, target }: IFormatFunctionArguments<ApiTransaction>): string | object {
    if(!options.transaction.displayAsId)
      return target;

    const { id } = this.wax.TransactionBuilder.fromApi(source);

    return id;
  }
}
