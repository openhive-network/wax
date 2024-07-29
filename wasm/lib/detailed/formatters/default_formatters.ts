import type { ApiTransaction, NaiAsset } from "../api";
import type { DeepReadonly, IFormatFunctionArguments, IWaxCustomFormatter, IWaxFormatterOptions } from "./types";
import type { IWaxBaseInterface } from "../../interfaces";
import type { custom_json, transaction, witness_set_properties } from "../../protocol";

import { WaxFormattable } from "../decorators/formatters";
import { CommunityOperation, ECommunityOperationActions, EFollowActions, EFollowOperationActions, FollowOperation, ReblogOperation, ResourceCreditsOperation } from "../custom_jsons";
import { WaxBaseApi } from "../base_api";

export class DefaultFormatters implements IWaxCustomFormatter {
  public constructor(
    private readonly wax: IWaxBaseInterface
  ) {}

  private formatNai(options: DeepReadonly<IWaxFormatterOptions>, source: Readonly<NaiAsset>): string | NaiAsset {
    if(options.asset.displayAsNai)
      return source;

    let { amount, symbol } = this.wax.getAsset(source);

    if(options.asset.formatAmount)
      amount = this.wax.formatter.formatNumber(amount, undefined, options.asset.locales as string);

    if(options.asset.appendTokenName)
      return `${amount} ${symbol}`;

    return amount;
  }

  @WaxFormattable({ matchProperty: "nai" })
  public assetFormatter({ options, source }: IFormatFunctionArguments<NaiAsset>): string | NaiAsset {
    return this.formatNai(options, source);
  }

  @WaxFormattable({ matchProperty: "operations" })
  public transactionFormatter({ options, source }: IFormatFunctionArguments<ApiTransaction | transaction>): string | void {
    if(!options.transaction.displayAsId)
      return;

    let id: string;

    if((source.operations.length > 0 && "type" in source.operations[0]) || (source.extensions.length > 0 && "type" in source.extensions[0]))
      ({ id } = this.wax.Transaction.fromApi(source));
    else
      ({ id } = new this.wax.Transaction(source as transaction));

    return id;
  }

  @WaxFormattable({ matchProperty: "id", matchValue: "rc" })
  public rcOperationFormatter({ source }: IFormatFunctionArguments<custom_json>): ResourceCreditsOperation | void {
    try {
      const json = JSON.parse(source.json);

      const [ , { from, delegatees, max_rc } ] = json;
      const maxRc = max_rc.toString();

      const rc = this.wax.vests(maxRc);

      // Ensure that from is a string and delegatees is an array
      if(typeof from === "string" && Array.isArray(delegatees))
        return new ResourceCreditsOperation(
          from,
          rc,
          delegatees
        );
    } catch {}
  }

  @WaxFormattable({ matchProperty: "id", matchValue: "community" })
  public communityOperationFormatter({ source }: IFormatFunctionArguments<custom_json>): CommunityOperation | void {
    try {
      const json = JSON.parse(source.json);

      // We do not have access to the entire transaction body, holding operation to be formatted, so we have to rely on the account(s) in custom_json_operation auths
      const accounts = [ ...(source.required_auths || []), ...(source.required_posting_auths || []) ];

      const [ type, data ] = json;

      // Ensure that community and type are strings
      if(typeof data.community === "string" && typeof type === "string")
        return new CommunityOperation(
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
  public followOperationFormatter({ source }: IFormatFunctionArguments<custom_json>): ReblogOperation | FollowOperation | void {
    try {
      const json = JSON.parse(source.json);

      const [ type, data ] = json;

      // Return the reblog operation if detected and ensure all of its properties have a valid type
      if(type === EFollowOperationActions.REBLOG && typeof data.account === "string" && typeof data.author === "string" && typeof data.permlink === "string")
        return new ReblogOperation(data.account, data.author, data.permlink);

      const { follower, following, what: [ what ] } = data;

      const followingParsed = Array.isArray(following) ? following : [ following ];

      // Check the integrity of the custom operation
      if(typeof what === "string" && typeof follower === "string")
        return new FollowOperation(what as EFollowActions, follower, followingParsed);
    } catch {}
  }

  @WaxFormattable({ matchProperty: "props" })
  public witnessSetPropertiesPropsFormatter({ source }: IFormatFunctionArguments<witness_set_properties>): witness_set_properties | void {
    try {
      // Make sure we are deserializing the proper operation
      if (!("owner" in source))
        return;

      const props: Array<[string, string]> = [];

      if (Array.isArray(source.props)) // API type
        props.push(...source.props);
      else // Protobuf type
        for (const key in source.props)
          props.push([key, source.props[key]]);

      const deserialized = (this.wax as WaxBaseApi).deserializeWitnessProps(props);

      return { // Rewrite the operation with the deserialized props
        extensions: [...(source.extensions || [])],
        owner: source.owner,
        props: deserialized as Record<string, any>
      };
    } catch {}
  }
}
