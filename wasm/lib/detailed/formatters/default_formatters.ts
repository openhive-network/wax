import type { ApiTransaction, NaiAsset } from "../api";
import type { IFormatFunctionArguments, IWaxCustomFormatter } from "./types";
import type { IWaxBaseInterface } from "../../interfaces";
import type { transaction } from "../../protocol";

import { WaxFormattable } from "../decorators/formatters";

export class DefaultFormatters implements IWaxCustomFormatter {
  public constructor(
    private readonly wax: IWaxBaseInterface
  ) {}

  @WaxFormattable({ matchProperty: "nai" })
  public assetFormatter({ options, source }: IFormatFunctionArguments<NaiAsset>): string {
    let { amount, symbol } = this.wax.getAsset(source);

    if(options.asset.formatAmount)
      amount = this.wax.formatter.formatNumber(amount, undefined, options.asset.locales as string);

    if(options.asset.appendTokenName)
      return `${amount} ${symbol}`;

    return amount;
  }

  @WaxFormattable({ matchProperty: "operations" })
  public transactionFormatter({ options, source, target }: IFormatFunctionArguments<ApiTransaction | transaction>): string | object {
    if(!options.transaction.displayAsId)
      return target;

    let id: string;

    if((source.operations.length > 0 && "type" in source.operations[0]) || (source.extensions.length > 0 && "type" in source.extensions[0]))
      ({ id } = this.wax.TransactionBuilder.fromApi(source));
    else
      ({ id } = new this.wax.TransactionBuilder(source as transaction));

    return id;
  }
}
