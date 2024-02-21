import type { ApiTransaction, NaiAsset } from "../api";
import type { DeepReadonly, IFormatFunctionArguments, IWaxCustomFormatter, IWaxFormatterOptions } from "./types";
import type { IWaxBaseInterface } from "../../interfaces";
import type { custom_json, transaction } from "../../protocol";

import { WaxFormattable } from "../decorators/formatters";
import { VESTS } from "../util";

export class DefaultFormatters implements IWaxCustomFormatter {
  public constructor(
    private readonly wax: IWaxBaseInterface
  ) {}

  private formatNai(options: DeepReadonly<IWaxFormatterOptions>, source: Readonly<NaiAsset>): string {
    let { amount, symbol } = this.wax.getAsset(source);

    if(options.asset.formatAmount)
      amount = this.wax.formatter.formatNumber(amount, undefined, options.asset.locales as string);

    if(options.asset.appendTokenName)
      return `${amount} ${symbol}`;

    return amount;
  }

  @WaxFormattable({ matchProperty: "nai" })
  public assetFormatter({ options, source }: IFormatFunctionArguments<NaiAsset>): string {
    return this.formatNai(options, source);
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

  @WaxFormattable({ matchProperty: "id", matchValue: "rc" })
  public rcOperationFormatter({ options, source }: IFormatFunctionArguments<custom_json>): string | object {
    const json = JSON.parse(source.json);

    const [ , { from, delegatees, max_rc } ] = json;

    const rc = this.formatNai(options, { ...VESTS, amount: max_rc });

    return `Account ${from} delegated ${rc} to account${delegatees.length > 1 ? "s" : ""}: ${delegatees.join(", ")}`;
  }
}
