import type { IBeekeeperUnlockedWallet } from "@hiveio/beekeeper";
import type { TDefaultHiveApi, IHiveChainInterface, IManabarData, ITransaction, TTimestamp, TWaxExtended, TBlockHash, TWaxRestExtended, TWaxRestApiRequest, TDeepWaxRestApiRequestPartial } from "../interfaces";
import type { MainModule } from "../wax_module";
import { BroadcastTransactionRequest, type ApiAccount, type ApiManabar, type ApiTransaction, type RcAccount } from "./api";

import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";

import { WaxError, WaxChainApiError } from "../errors.js";
import { ONE_HUNDRED_PERCENT, WaxBaseApi } from "./base_api.js";
import { HiveApiTypes, HiveRestApiTypes } from "./chain_api_data.js";
import { IDetailedResponseData, IRequestOptions, RequestHelper } from "./healthchecker/request_helper.js";
import { extractBracedStrings } from "./rest-api/utils.js";
import { iterate } from "./util/iterate.js";
import { Transaction } from "./transaction_builder.js";

import Long from "long";
import qs from 'qs';

export enum EManabarType {
  UPVOTE = 0,
  DOWNVOTE = 1,
  RC = 2
}

type TRequestInterceptor = (data: IRequestOptions) => IRequestOptions;
type TResponseInterceptor = (data: IDetailedResponseData<any>) => IDetailedResponseData<any>;

export type TChainCaller = ((params: object) => Promise<any>) & {
  apiType: string;
  withProxy: (requestInterceptor: TRequestInterceptor, responseInterceptor: TResponseInterceptor) => (params: object) => Promise<any>;
};

export type TRestChainCaller = ((params: object) => Promise<any>) & {
  paths: string[];
  withProxy: (requestInterceptor: TRequestInterceptor, responseInterceptor: TResponseInterceptor) => (params: object) => Promise<any>;
};

export class HiveChainApi extends WaxBaseApi implements IHiveChainInterface {
  public api!: TDefaultHiveApi;

  public get restApi () {
    const that = this;
    const callFn = async function(params: object | undefined, requestInterceptor: TRequestInterceptor = that.requestInterceptor, responseInterceptor: TResponseInterceptor = that.responseInterceptor): Promise<any> {
      // Helper function to determine if we have to convert plain object to the instance of the given request or not
      const isPlainObj = (value: unknown) => !!value && Object.getPrototypeOf(value) === Object.prototype;

      if(typeof callFn.config === 'object' && callFn.config.params !== undefined && typeof params === "object")
        await validateOrReject(isPlainObj(params) ? plainToInstance(callFn.config.params, params) : params);

      let path = '/' + callFn.paths.filter(node => node.length).join('/');
      const allToReplace = extractBracedStrings(path);

      const finalizedRequestData = params === undefined ? undefined : structuredClone(params);

      if (typeof params === "object")
        for(const toReplace of allToReplace) {
          if (toReplace in (finalizedRequestData as object))
            path = path.replace(`{${toReplace}}`, String(params[toReplace as keyof typeof finalizedRequestData]));
          else
            throw new Error('No ' + toReplace + ' in request');

          delete (finalizedRequestData as object)[toReplace as keyof typeof finalizedRequestData];
        }

      const method = callFn.lastMethod;
      const isQueryStringOnlyRequest = method === 'GET' || method === 'DELETE';

      let queryString = '';
      if (isQueryStringOnlyRequest && finalizedRequestData !== undefined && Object.keys(finalizedRequestData).length > 0)
        queryString = '?' + qs.stringify(finalizedRequestData);

      const body = isQueryStringOnlyRequest ? undefined : JSON.stringify(finalizedRequestData);

      const endpoint = that.getEndpointUrlForRestApi(callFn.realPaths);

      const url = endpoint + path + queryString;

      const data = responseInterceptor(await that.requestHelper.request<object>(requestInterceptor({
        method,
        responseType: 'json',
        url,
        data: body
      }))) as IDetailedResponseData<object>;
      let result: any = data.response;

      if(typeof callFn.config === 'object') {
        if(result === undefined && callFn.config.result !== undefined)
          throw new WaxChainApiError('No result found in the Hive API response', data);

        if (callFn.config.result !== undefined && callFn.config.result !== Number && callFn.config.result !== Boolean && callFn.config.result !== String) {
          // Parse any other result type which is a valid validator constructor
          result = plainToInstance(callFn.config.result, result) as object;

          if (Array.isArray(result))
            for(const node of result)
              await validateOrReject(node);
          else
            await validateOrReject(result);
        }
      }

      callFn.paths = [] as string[];
      callFn.realPaths = [] as string[];
      callFn.lastMethod = 'GET';
      callFn.config = undefined;

      return result;
    };
    callFn.paths = [] as string[];
    callFn.realPaths = [] as string[];
    callFn.lastMethod = "GET";
    callFn.config = undefined as TWaxRestApiRequest<any, any> | undefined;
    callFn[HiveChainApi.WithProxyKey] = (requestInterceptor: TRequestInterceptor, responseInterceptor: TResponseInterceptor) => (params: object) => callFn(params, requestInterceptor, responseInterceptor);

    const proxiedFunction = new Proxy(callFn, {
      get: (_target: any, property: string, _receiver: any): TRestChainCaller | string => {
        if(property === HiveChainApi.EndpointUrlKey) {
          const restApiUrl = this.getEndpointUrlForRestApi(callFn.realPaths);

          callFn.paths = [] as string[];
          callFn.realPaths = [] as string[];
          callFn.lastMethod = 'GET';
          callFn.config = undefined;

          return restApiUrl;
        }

        if (property === HiveChainApi.WithProxyKey)
          return callFn[HiveChainApi.WithProxyKey];

        const currObj: Record<string, any> = this.getRestTypeFromPath(callFn.realPaths);

        callFn.config = currObj[property];

        if (callFn.config?.urlPath === undefined)
          callFn.paths.push(property);
        else
          callFn.paths.push(callFn.config.urlPath);

        callFn.realPaths.push(property);

        if (callFn.config?.method !== undefined)
          callFn.lastMethod = callFn.config.method;

        return proxiedFunction;
      },
      set: (_target: any, property: string, newValue: any, _receiver: any) => {
        if(property === HiveChainApi.EndpointUrlKey) {
          const setValue = this.setEndpointUrlForRestApi(callFn.realPaths, newValue);

          callFn.realPaths = [] as string[];
          callFn.paths = [] as string[];
          callFn.lastMethod = 'GET';
          callFn.config = undefined;

          return setValue;
        }


        return false;
      },
      apply: (_target: any, _thisArg: any, argumentsList: [object]) => {
        return callFn(...argumentsList);
      }
    });

    return proxiedFunction;
  };

  private readonly requestHelper = new RequestHelper();

  private localTypes = {} as typeof HiveApiTypes;

  private localRestTypes = {} as typeof HiveRestApiTypes;

  private taposCache: TBlockHash = '';
  private lastTaposCacheUpdate: number = 0; /// last timestamp of taposCache update (in milliseconds)

  private static readonly EndpointUrlKey = "endpointUrl";

  private static readonly WithProxyKey = "withProxy";

  public constructor(
    public readonly wax: MainModule,
    public readonly chainId: string,
    private apiEndpoint: string,
    private restApiEndpoint: string,
    private readonly originator: HiveChainApi|null) {
    super(wax, chainId);

    // Create a deep copy of the object to assert the immutability of the next instances of the object
    for(const apiType in HiveApiTypes) {
      this.localTypes[apiType] = {};
      for(const endpoint in HiveApiTypes[apiType])
        this.localTypes[apiType] = { ...HiveApiTypes[apiType][endpoint] };
    }

    iterate(this.localRestTypes, HiveRestApiTypes);

    this.initializeApi();
  }

  public async broadcast(transaction: ApiTransaction | object | Transaction): Promise<void> {
    const toBroadcast: object = "target" in transaction ? transaction.toApiJson() : transaction;

    const request = new BroadcastTransactionRequest();
    request.trx = toBroadcast as ApiTransaction;

    await this.api.network_broadcast_api.broadcast_transaction(request);
  }

  private requestInterceptor: (data: IRequestOptions) => IRequestOptions = (data: IRequestOptions) => data;
  private responseInterceptor: (data: IDetailedResponseData<any>) => IDetailedResponseData<any> = (data: IDetailedResponseData<any>) => data;

  public withProxy(requestInterceptor: TRequestInterceptor, responseInterceptor: TResponseInterceptor): HiveChainApi {
    const newInstance = this.extend();
    newInstance.requestInterceptor = requestInterceptor;
    newInstance.responseInterceptor = responseInterceptor;

    return newInstance;
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

  private getRestTypeFromPath(path: string[]): object {
    let currObj: Record<string, any> = this.localRestTypes;
    for (const appendPath of path) {
      if (currObj[appendPath as keyof typeof currObj] === undefined)
        currObj[appendPath as keyof typeof currObj] = {}; // Create a blank object, so configuration such as endpointUrl can be set

      currObj = currObj[appendPath as keyof typeof currObj];
    }

    return currObj;
  }

  private getEndpointUrlForRestApi(path: string[]): string {
    let foundApi: string | undefined;

    // Do not use getRestTypeFromPath as we need to extract any parent-level HiveChainApi.EndpointUrlKey-s
    let currObj: Record<string, any> = this.localRestTypes;
    if (currObj[HiveChainApi.EndpointUrlKey] !== undefined)
      foundApi = currObj[HiveChainApi.EndpointUrlKey];
    for (const appendPath of path) {
      if (currObj[appendPath as keyof typeof currObj] === undefined)
        currObj[appendPath as keyof typeof currObj] = {}; // Create a blank object, so configuration such as endpointUrl can be set

      currObj = currObj[appendPath as keyof typeof currObj];
      if (currObj[HiveChainApi.EndpointUrlKey] !== undefined)
        foundApi = currObj[HiveChainApi.EndpointUrlKey];
    }

    return foundApi ?? this.restApiEndpoint;
  }
  private setEndpointUrlForRestApi(path: string[], newValue: string | undefined, found = false): boolean {
    const obj = this.getRestTypeFromPath(path);

    if(this.originator !== null)
      found ||= this.originator.setEndpointUrlForRestApi(path, newValue, found);

    return Boolean(obj[HiveChainApi.EndpointUrlKey] = newValue ?? this.restApiEndpoint);
  }

  private initializeApi(): void {
    this.api = new Proxy({} as TDefaultHiveApi, {
      get: (_target: any, propertyParent: string, _receiver: any) => {
        return new Proxy({}, {
          set: (_target: any, property: string, newValue: any, _receiver: any) => {
            if(property === HiveChainApi.EndpointUrlKey)
              return this.setEndpointUrlForApi(propertyParent, newValue);

            return false;
          },
          get: (_target: any, property: string, _receiver: any): TChainCaller | string => {
            /* // We want to let users extend wax with interfaces only and those are not compiled into JS objects, so this assertion is no longer suitable for us:
            if(typeof this.localTypes[propertyParent] !== 'object')
              throw new WaxError(`Api "${propertyParent}" has not been implemented yet or does not exist`);
            */

            if(property === HiveChainApi.EndpointUrlKey)
              return this.getEndpointUrlForApi(propertyParent);

            const performCall = async(params: object, requestInterceptor: TRequestInterceptor = this.requestInterceptor, responseInterceptor: TResponseInterceptor = this.responseInterceptor): Promise<any> => {
              const method = `${propertyParent}.${property}`;

              /* // We want to let users extend wax with interfaces only and those are not compiled into JS objects, so this assertion is no longer suitable for us:
                if(typeof this.localTypes[propertyParent][property] !== 'object')
                  throw new WaxError(`Method "${method}" has not been implemented yet or does not exist`);
              */

              // Helper function to determine if we have to convert plain object to the instance of the given request or not
              const isPlainObj = (value: unknown) => !!value && Object.getPrototypeOf(value) === Object.prototype;

              if(typeof this.localTypes[propertyParent]?.[property] === 'object')
                await validateOrReject(isPlainObj(params) ? plainToInstance(this.localTypes[propertyParent][property].params, params) : params);

              const data = responseInterceptor(await this.requestHelper.request<{ error?: object; result?: object; }>(requestInterceptor({
                method: 'POST',
                responseType: 'json',
                url: this.getEndpointUrlForApi(propertyParent),
                data: JSON.stringify({
                  jsonrpc: "2.0",
                  method,
                  params,
                  id: 1
                })
              }))) as IDetailedResponseData<{ error?: object | undefined; result: object; }>;

              if(typeof data.response.error === 'object')
                throw new WaxChainApiError('Error sending request to the Hive API', data.response.error);

              let result = data.response.result;

              if(typeof this.localTypes[propertyParent]?.[property] === 'object' && !Array.isArray(result)) {
                if(typeof result !== 'object')
                  throw new WaxChainApiError('No result found in the Hive API response', data);

                result = plainToInstance(this.localTypes[propertyParent][property].result, result) as object;

                await validateOrReject(result);
              }

              return result;
            };

            const caller: TChainCaller = function(params: object) { return performCall(params); };
            Object.defineProperty(caller, "name", { value: property }); // Dynamically set function name to the property we are calling
            caller.apiType = propertyParent;
            caller[HiveChainApi.WithProxyKey] = (requestInterceptor: TRequestInterceptor, responseInterceptor: TResponseInterceptor) => (params: object) => performCall(params, requestInterceptor, responseInterceptor);

            return caller;
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

  public extend<YourApi>(extendedHiveApiData?: YourApi): HiveChainApi & TWaxExtended<YourApi, this> {
    const newApi = new HiveChainApi(this.wax, this.chainId, this.apiEndpoint, this.restApiEndpoint, this);

    if(typeof extendedHiveApiData === "object")
      for(const methodName in extendedHiveApiData)
        newApi.localTypes[methodName as keyof TWaxExtended<YourApi>] = {
          ...(newApi.localTypes[methodName as keyof typeof newApi['localTypes']] ?? {}),
          ...extendedHiveApiData[methodName]
        };

    return newApi as unknown as HiveChainApi & TWaxExtended<YourApi, this>;
  }

  public extendRest<YourRestApi>(extendedHiveRestApiData?: TDeepWaxRestApiRequestPartial<YourRestApi>): HiveChainApi & TWaxRestExtended<YourRestApi, this> {
    const newApi = new HiveChainApi(this.wax, this.chainId, this.apiEndpoint, this.restApiEndpoint, this);

    if(typeof extendedHiveRestApiData === "object")
      iterate(newApi.localRestTypes, extendedHiveRestApiData as object);

    return newApi as unknown as HiveChainApi & TWaxRestExtended<YourRestApi, this>;
  }

  public async createTransaction(expirationTime?: TTimestamp): Promise<ITransaction> {
    const head_block_id = await this.acquireTaposData(3000);

    const builder = super.createTransactionWithTaPoS(head_block_id, expirationTime ?? "+1m");

    return builder;
  }

  private async acquireTaposData(taposLiveness: number): Promise<TBlockHash> {
    const now = Date.now();
    if ((now - this.lastTaposCacheUpdate) >= taposLiveness) {
      const { head_block_id } = await this.api.database_api.get_dynamic_global_properties({});
      this.taposCache = head_block_id;
      this.lastTaposCacheUpdate = now;
    }

    return this.taposCache;
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
