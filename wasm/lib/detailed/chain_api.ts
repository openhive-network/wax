import type { IBeekeeperUnlockedWallet } from "@hive/beekeeper";
import type { TDefaultHiveApi, IHiveChainInterface, IManabarData, ITransactionBuilder, TTimestamp, TWaxExtended } from "../interfaces";
import type { MainModule } from "../wax_module";
import type { ApiAccount, ApiManabar, RcAccount } from "./api";

import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";

import { WaxError, WaxChainApiError } from "../errors.js";
import { ONE_HUNDRED_PERCENT, WaxBaseApi } from "./base_api.js";
import { HiveApiTypes } from "./chain_api_data.js";

import Long from "long";

export enum EManabarType {
  UPVOTE = 0,
  DOWNVOTE = 1,
  RC = 2
}

export class HiveChainApi extends WaxBaseApi implements IHiveChainInterface {
  public api!: TDefaultHiveApi;

  private localTypes = {} as typeof HiveApiTypes;

  private static readonly EndpointUrlKey = "endpointUrl";

  public constructor(
    public readonly wax: MainModule,
    public readonly chainId: string,
    private apiEndpoint: string,
    private readonly originator: HiveChainApi|null
  ) {
    super(wax, chainId);

    // Create a deep copy of the object to assert the immutability of the next instances of the object
    for(const apiType in HiveApiTypes) {
      this.localTypes[apiType] = {};
      for(const endpoint in HiveApiTypes[apiType])
        this.localTypes[apiType] = { ...HiveApiTypes[apiType][endpoint] };
    }

    this.initializeApi();
  }

  private getEndpointUrlForApi(apiType: string): string {
    return this.localTypes[apiType]?.[HiveChainApi.EndpointUrlKey] ?? this.apiEndpoint;
  }
  private setEndpointUrlForApi(apiType: string, newValue: string | undefined, found = false): boolean {
    const api = this.localTypes[apiType];

    if(this.originator !== null)
      found ||= this.originator.setEndpointUrlForApi(apiType, newValue, found);

    if(api === undefined)
      return found;

    return Boolean(api[HiveChainApi.EndpointUrlKey] = newValue ?? this.apiEndpoint);
  }

  private initializeApi(): void {
    const checkStatus = (response: Response) => {
      if(response.status >= 200 && response.status < 300)
        return response;

      throw new WaxChainApiError(response.statusText, response );
    };

    const parseJSON = (response: Response) => response.json();

    this.api = new Proxy({} as TDefaultHiveApi, {
      get: (_target: any, propertyParent: string, _receiver: any) => {
        return new Proxy({}, {
          set: (_target: any, property: string, newValue: any, _receiver: any) => {
            if(property === HiveChainApi.EndpointUrlKey)
              return this.setEndpointUrlForApi(propertyParent, newValue);

            return false;
          },
          get: (_target: any, property: string, _receiver: any) => {
            /* // We want to let users extend wax with interfaces only and those are not compiled into JS objects, so this assertion is no longer suitable for us:
            if(typeof this.localTypes[propertyParent] !== 'object')
              throw new WaxError(`Api "${propertyParent}" has not been implemented yet or does not exist`);
            */

            if(property === HiveChainApi.EndpointUrlKey)
              return this.getEndpointUrlForApi(propertyParent);

            return async(params: object) => {
              const method = `${propertyParent}.${property}`;

              /* // We want to let users extend wax with interfaces only and those are not compiled into JS objects, so this assertion is no longer suitable for us:
                if(typeof this.localTypes[propertyParent][property] !== 'object')
                  throw new WaxError(`Method "${method}" has not been implemented yet or does not exist`);
              */

              // Helper function to determine if we have to convert plain object to the instance of the given request or not
              const isPlainObj = (value: unknown) => !!value && Object.getPrototypeOf(value) === Object.prototype;

              if(typeof this.localTypes[propertyParent]?.[property] === 'object')
                await validateOrReject(isPlainObj(params) ? plainToInstance(this.localTypes[propertyParent][property].params, params) : params);

              const data = await fetch(this.getEndpointUrlForApi(propertyParent), {
                method: "POST",
                body: JSON.stringify({
                  jsonrpc: "2.0",
                  method,
                  params,
                  id: 1
                })
              }).then(checkStatus)
                .then(parseJSON);

              if(typeof data.error === 'object')
                throw new WaxChainApiError('Error sending request to the Hive API', data.error);

              let result = data.result;

              if(typeof this.localTypes[propertyParent]?.[property] === 'object' && !Array.isArray(result)) {
                if(typeof result !== 'object')
                  throw new WaxChainApiError('No result found in the Hive API response', data);

                result = plainToInstance(this.localTypes[propertyParent][property].result, result) as object;

                await validateOrReject(result);
              }

              return result;
            };
          }
        });
      }
    });
  }

  public set endpointUrl(endpoint: string) {
    this.apiEndpoint = endpoint;

    if(this.originator !== null)
      this.originator.endpointUrl = endpoint;
  }

  public get endpointUrl(): string {
    return this.apiEndpoint;
  }

  public extend<YourApi>(extendedHiveApiData?: YourApi): TWaxExtended<YourApi> {
    const newApi = new HiveChainApi(this.wax, this.chainId, this.apiEndpoint, this);

    if(typeof extendedHiveApiData === "object")
      for(const methodName in extendedHiveApiData)
        newApi.localTypes[methodName as keyof TWaxExtended<YourApi>] = {
          ...(newApi.localTypes[methodName as keyof typeof newApi['localTypes']] ?? {}),
          ...extendedHiveApiData[methodName]
        };

    return newApi as unknown as TWaxExtended<YourApi>;
  }

  public async getTransactionBuilder(expirationTime?: TTimestamp): Promise<ITransactionBuilder> {
    const { head_block_id } = await this.api.database_api.get_dynamic_global_properties({});

    const builder = new super.TransactionBuilder(head_block_id, expirationTime ?? "+1m");

    return builder;
  }

  private async getRcManabarForAccount(accountName: string): Promise<RcAccount> {
    const { rc_accounts: [ account ] } = await this.api.rc_api.find_rc_accounts({ accounts: [ accountName ] });
    if(typeof account === "undefined")
      throw new WaxError(`No such account on chain with given name: "${accountName}"`);

    return account;
  }

  private async findAccounts(...accountNames: string[]): Promise<Array<ApiAccount>> {
    const { accounts } = await this.api.database_api.find_accounts({ accounts: accountNames });
    if(accounts.length !== accountNames.length) {
      const notFoundAccounts = accounts.map(node => node.name).filter(node => !accountNames.includes(node));

      throw new WaxError(`No such account(s) on chain with given name(s): "${notFoundAccounts.join(', ')}"`);
    }

    return accounts;
  }

  private async findAccount(accountName: string): Promise<ApiAccount> {
    const [ account ] = await this.findAccounts(accountName);

    return account;
  }

  public async encryptForAccounts(wallet: IBeekeeperUnlockedWallet, content: string, fromAccount: string, toAccount: string): Promise<string> {
    let from: string, to: string;

    ([ { memo_key: from }, { memo_key: to } ] = await this.findAccounts(...[... new Set([ fromAccount, toAccount ])]));

    if(to === undefined)
      to = from;

    const encrypted = wallet.encryptData(content, from, to);

    return this.proto.cpp_crypto_memo_dump_string({
      content: encrypted,
      from,
      to
    });
  }

  private async getManabarDataArguments(accountName: string, manabarType: EManabarType): Promise<Parameters<WaxBaseApi['calculateCurrentManabarValue']>> {
    const dgpo = await this.api.database_api.get_dynamic_global_properties({});

    let manabar: ApiManabar;
    let max: string | number | Long;

    if(manabarType === EManabarType.RC) {
      ({ rc_manabar: manabar, max_rc: max } = await this.getRcManabarForAccount(accountName));
    } else {
      const account = await this.findAccount(accountName);

      manabar = manabarType === EManabarType.UPVOTE ? account.voting_manabar : account.downvote_manabar;
      max = Long.fromValue(account.post_voting_power.amount);

      if(manabarType === EManabarType.DOWNVOTE)
        if(max.divide(ONE_HUNDRED_PERCENT).greaterThan(ONE_HUNDRED_PERCENT))
          max = max.divide(ONE_HUNDRED_PERCENT).multiply(dgpo.downvote_pool_percent);
        else
          max = max.multiply(dgpo.downvote_pool_percent).divide(ONE_HUNDRED_PERCENT);
    }

    return [
      Math.round(new Date(`${dgpo.time}Z`).getTime() / 1000), // Convert API time to seconds
      max,
      manabar.current_mana,
      manabar.last_update_time
    ];
  }

  public async calculateCurrentManabarValueForAccount(accountName: string, manabarType: EManabarType = EManabarType.UPVOTE): Promise<IManabarData> {
    const args = await this.getManabarDataArguments(accountName, manabarType);

    return super.calculateCurrentManabarValue(
      ...args
    );
  }

  public async calculateManabarFullRegenerationTimeForAccount(accountName: string, manabarType: EManabarType = EManabarType.UPVOTE): Promise<Date> {
    const args = await this.getManabarDataArguments(accountName, manabarType);

    if(Long.fromValue(args[1]).equals(Long.ZERO))
      return new Date();

    const time = super.calculateManabarFullRegenerationTime(
      ...args
    );

    return new Date(time * 1000);
  }
}
