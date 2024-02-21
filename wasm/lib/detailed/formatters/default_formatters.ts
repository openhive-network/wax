import type { ApiTransaction, NaiAsset } from "../api";
import type { DeepReadonly, IFormatFunctionArguments, IWaxCustomFormatter, IWaxFormatterOptions } from "./types";
import type { IWaxBaseInterface } from "../../interfaces";
import type { custom_json, transaction } from "../../protocol";

import { WaxFormattable } from "../decorators/formatters";
import { VESTS } from "../util";
import { ECommunityOperationActions } from "../custom_jsons/community";

export class DefaultFormatters implements IWaxCustomFormatter {
  public constructor(
    private readonly wax: IWaxBaseInterface
  ) {}

  private formatPostId(author: string, permlink: string): string {
    return `@${author}/${permlink}`;
  }

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
  public transactionFormatter({ options, source, target }: IFormatFunctionArguments<ApiTransaction | transaction>): string | any {
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
  public rcOperationFormatter({ options, source }: IFormatFunctionArguments<custom_json>): string {
    const json = JSON.parse(source.json);

    const [ , { from, delegatees, max_rc } ] = json;

    if(max_rc.toString() === "0")
      return `Account ${from} removed delegation for account${delegatees.length > 1 ? "s" : ""}: ${delegatees.join(", ")}`;

    const rc = this.formatNai(options, { ...VESTS, amount: max_rc });

    return `Account ${from} delegated ${rc} to account${delegatees.length > 1 ? "s" : ""}: ${delegatees.join(", ")}`;
  }

  @WaxFormattable({ matchProperty: "id", matchValue: "community" })
  public communityOperationFormatter({ target, source }: IFormatFunctionArguments<custom_json>): string | any {
    const json = JSON.parse(source.json);

    // We do not have access to the entire transaction body, holding operation to be formatted, so we have to rely on the account(s) in custom_json_operation auths
    const accounts = [ ...(source.required_auths || []), ...(source.required_posting_auths || []) ];
    const accountsStr = `Account${accounts.length > 1 ? "s" : ""} ${accounts.join(", ")}`;

    const [ type, data ] = json;
    switch(type) {
      case ECommunityOperationActions.FLAG_POST:
        return `${accountsStr} flagged post "${this.formatPostId(data.account, data.permlink)}" on community ${data.community}`;
      case ECommunityOperationActions.MUTE_POST:
        return `${accountsStr} muted post "${this.formatPostId(data.account, data.permlink)}" on community ${data.community}`;
      case ECommunityOperationActions.PIN_POST:
        return `${accountsStr} pinned post "${this.formatPostId(data.account, data.permlink)}" on community ${data.community}`;
      case ECommunityOperationActions.SET_USER_TITLE:
        return `${accountsStr} set account ${data.account} title to "${data.title}" on community ${data.community}`;
      case ECommunityOperationActions.SUBSCRIBE:
        return `${accountsStr} subscribed to community ${data.community}`;
      case ECommunityOperationActions.UNMUTE_POST:
        return `${accountsStr} unmuted post "${this.formatPostId(data.account, data.permlink)}" on community ${data.community}`;
      case ECommunityOperationActions.UNPIN_POST:
        return `${accountsStr} unpinned post "${this.formatPostId(data.account, data.permlink)}" from community ${data.community}`;
      case ECommunityOperationActions.UNSUBSCRIBE:
        return `${accountsStr} unsubscribed from community ${data.community}`;
      case ECommunityOperationActions.UPDATE_PROPS:
        return `${accountsStr} updated community ${data.community} properties`;
      default:
        return target;
    }
  }
}
