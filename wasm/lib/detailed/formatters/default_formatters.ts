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

    if(options.asset.formatAmount) {
      // Amount can be larger than the MAX_SAFE_INTEGER, so we have to format BigInt to parts, extract the fraction part from the amount and then join all of the parts together
      const formatted = Intl.NumberFormat(options.asset.locales as string, { minimumFractionDigits: 1 }).formatToParts(BigInt(source.amount.slice(0, -source.precision)));
      const decimalIndex = formatted.findIndex(pred => pred.type === "decimal");
      const integer = (decimalIndex === -1 ? formatted : formatted.slice(0, decimalIndex)).reduce((prev, curr) => prev + curr.value, "") || "0";
      const decimal = formatted[decimalIndex]?.value || ".";
      const fraction = source.amount.slice(-source.precision).padStart(source.precision, "0");

      amount = `${integer}${decimal}${fraction}`;
    }

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
