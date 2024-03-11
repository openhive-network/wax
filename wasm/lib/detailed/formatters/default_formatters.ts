import type { ApiTransaction, NaiAsset } from "../api";
import type { DeepReadonly, IFormatFunctionArguments, IWaxCustomFormatter, IWaxFormatterOptions } from "./types";
import type { IWaxBaseInterface } from "../../interfaces";
import type { custom_json, transaction } from "../../protocol";

import { WaxFormattable } from "../decorators/formatters";
import { ECommunityOperationActions, EFollowActions, EFollowOperationActions, ICommunityProps, TAccountName } from "../custom_jsons";

export class FormattedRcOperation {
  public constructor(
    public readonly from: TAccountName,
    public readonly rc: NaiAsset,
    public readonly delegatees: Array<TAccountName>
  ) {}
}

export type TCommunityRules = {
  action: ECommunityOperationActions.FLAG_POST | ECommunityOperationActions.MUTE_POST | ECommunityOperationActions.UNMUTE_POST;
  account: TAccountName;
  permlink: string;
  notes: string;
} | {
  action: ECommunityOperationActions.PIN_POST | ECommunityOperationActions.UNPIN_POST;
  account: TAccountName;
  permlink: string;
} | {
  action: ECommunityOperationActions.SUBSCRIBE | ECommunityOperationActions.UNSUBSCRIBE;
} | {
  action: ECommunityOperationActions.SET_USER_TITLE;
  account: TAccountName;
  title: string;
} | {
  action: ECommunityOperationActions.UPDATE_PROPS;
  props: Readonly<ICommunityProps>;
}

export class FormattedCommunityOperation {
  public constructor(
    public readonly accounts: Array<TAccountName>,
    public readonly community: string,
    public readonly data: TCommunityRules
  ) {}
}

export class FormattedReblogOperation {
  public constructor(
    public readonly account: TAccountName,
    public readonly author: TAccountName,
    public readonly permlink: string
  ) {}
}

export class FormattedFollowOperation {
  public constructor(
    public readonly action: EFollowActions,
    public readonly follower: TAccountName,
    public readonly following: Array<TAccountName>
  ) {}
}

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
  public transactionFormatter({ options, source }: IFormatFunctionArguments<ApiTransaction | transaction>): string | void {
    if(!options.transaction.displayAsId)
      return;

    let id: string;

    if((source.operations.length > 0 && "type" in source.operations[0]) || (source.extensions.length > 0 && "type" in source.extensions[0]))
      ({ id } = this.wax.TransactionBuilder.fromApi(source));
    else
      ({ id } = new this.wax.TransactionBuilder(source as transaction));

    return id;
  }

  @WaxFormattable({ matchProperty: "id", matchValue: "rc" })
  public rcOperationFormatter({ source }: IFormatFunctionArguments<custom_json>): FormattedRcOperation | void {
    try {
      const json = JSON.parse(source.json);

      const [ , { from, delegatees, max_rc } ] = json;
      const maxRc = max_rc.toString();

      const rc = this.wax.vests(maxRc);

      // Ensure that from is a string and delegatees is an array
      if(typeof from === "string" && Array.isArray(delegatees))
        return new FormattedRcOperation(
          from,
          rc,
          delegatees
        );
    } catch {}
  }

  @WaxFormattable({ matchProperty: "id", matchValue: "community" })
  public communityOperationFormatter({ source }: IFormatFunctionArguments<custom_json>): FormattedCommunityOperation | void {
    try {
      const json = JSON.parse(source.json);

      // We do not have access to the entire transaction body, holding operation to be formatted, so we have to rely on the account(s) in custom_json_operation auths
      const accounts = [ ...(source.required_auths || []), ...(source.required_posting_auths || []) ];

      const [ type, data ] = json;

      // Ensure that community and type are strings
      if(typeof data.community === "string" && typeof type === "string")
        return new FormattedCommunityOperation(
          accounts,
          data.community,
          {
            action: type as ECommunityOperationActions,
            account: typeof data.account === "string" ? data.account : undefined,
            permlink: typeof data.permlink === "string" ? data.permlink : undefined,
            title: typeof data.title === "string" ? data.title : undefined,
            props: typeof data.props === "object" ? data.props : undefined,
            notes: typeof data.notes === "string" ? data.notes : undefined
          }
        );
    } catch {}
  }

  @WaxFormattable({ matchProperty: "id", matchValue: "follow" })
  public followOperationFormatter({ source }: IFormatFunctionArguments<custom_json>): FormattedReblogOperation | FormattedFollowOperation | void {
    try {
      const json = JSON.parse(source.json);

      const [ type, data ] = json;

      // Return the reblog operation if detected and ensure all of its properties have a valid type
      if(type === EFollowOperationActions.REBLOG && typeof data.account === "string" && typeof data.author === "string" && typeof data.permlink === "string")
        return new FormattedReblogOperation(data.account, data.author, data.permlink);

      const { follower, following, what: [ what ] } = data;

      const followingParsed = Array.isArray(following) ? following : [ following ];

      // Check the integrity of the custom operation
      if(typeof what === "string" && typeof follower === "string")
        return new FormattedFollowOperation(what as EFollowActions, follower, followingParsed);
    } catch {}
  }
}
