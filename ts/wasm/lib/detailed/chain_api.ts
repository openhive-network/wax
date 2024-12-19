import type { IBeekeeperUnlockedWallet } from "@hiveio/beekeeper";
import type { IHiveChainInterface, IManabarData, ITransaction, IOnlineTransaction, TTimestamp, TPublicKey, TWaxExtended, TBlockHash, TWaxRestExtended, TDeepWaxApiRequestPartial } from "./interfaces";
import type { MainModule, MapStringUInt16, wax_authority, wax_authorities } from "../wax_module";
import { ApiAuthority, BroadcastTransactionRequest, type ApiAccount, type ApiManabar, type ApiTransaction, type ApiWitness, type RcAccount } from "./api";

import { WaxError } from "./errors.js";
import { safeWasmCall } from './util/wasm_errors.js';
import { ONE_HUNDRED_PERCENT, WaxBaseApi } from "./base_api.js";
import { HiveApiTypes, HiveRestApiTypes } from "./chain_api_data.js";
import { iterate } from "./util/iterate.js";
import { OnlineTransaction} from "./online_transaction";
import { dateFromString } from "./util/expiration_parser.js";

import Long from "long";
import { ApiCaller, TRequestInterceptor, TResponseInterceptor } from "./util/api_caller";

import { TAccountName } from "./hive_apps_operations";

export enum EManabarType {
  UPVOTE = 0,
  DOWNVOTE = 1,
  RC = 2
}

export type TChainReferenceData = {
  head_block_id: TBlockHash,
  head_block_time: Date
};

export enum EChainApiType {
  JSON_RPC = "json_rpc",
  REST = "rest"
}

export type TAccountAuthorityCollection = Map<TAccountName, [wax_authorities, TPublicKey]>;

export class HiveChainApi extends WaxBaseApi implements IHiveChainInterface {
  public get restApi () {
    return this.restApiCaller.createApiCaller() as unknown as IHiveChainInterface['restApi'];
  }

  public get api () {
    return this.jsonRpcApiCaller.createApiCaller() as unknown as IHiveChainInterface['api'];
  }

  private jsonRpcApiCaller: ApiCaller;
  private restApiCaller: ApiCaller;

  private taposCache: TChainReferenceData = { head_block_id: '', head_block_time: new Date(Date.now()) };
  private lastTaposCacheUpdate: number = 0; /// last timestamp of taposCache update (in milliseconds)

  public constructor(
    public readonly wax: MainModule,
    public readonly chainId: string,
    apiEndpoint: string,
    restApiEndpoint: string,
    public readonly originator: HiveChainApi|null) {
    super(wax, chainId);

    this.jsonRpcApiCaller = new ApiCaller(EChainApiType.JSON_RPC, apiEndpoint, iterate({}, HiveApiTypes), 'POST', (path, newValue, found) => {
      if (this.originator !== null) // Propagate the change to the originator
        return found ||= this.originator.jsonRpcApiCaller.setEndpointUrlForPath(path, newValue, found);

      return found || false;
    }, data => { // Rewrite request data to JSON-RPC format
        data.data = JSON.stringify({
        jsonrpc: "2.0",
        method: data.paths.join('.'),
        params: data.data,
        id: 1
      });
      data.url = '';

      return data;
    }, data => { // Rewrite response data to JSON-RPC format
      if (typeof data.response === "object" && "result" in data.response)
        data.response = data.response.result;
      else
        throw new WaxError(`Invalid response from API: ${JSON.stringify(data.response)}`);

      return data;
    });
    this.restApiCaller = new ApiCaller(EChainApiType.REST, restApiEndpoint, iterate({}, HiveRestApiTypes), 'GET', (path, newValue, found) => {
      if (this.originator !== null) // Propagate the change to the originator
        return found ||= this.originator.restApiCaller.setEndpointUrlForPath(path, newValue, found);

      return found || false;
    });
  }

  public async broadcast(transaction: ApiTransaction | ITransaction | IOnlineTransaction): Promise<void> {
    const toBroadcast: object = "toApiJson" in transaction ? transaction.toApiJson() : transaction;

    if ("performOnChainVerification" in transaction)
      await transaction.performOnChainVerification();

    const request = new BroadcastTransactionRequest();
    request.trx = toBroadcast as ApiTransaction;

    await this.api.network_broadcast_api.broadcast_transaction(request);
  }

  public withProxy(requestInterceptor: TRequestInterceptor, responseInterceptor: TResponseInterceptor): HiveChainApi {
    const newInstance = this.extend();
    newInstance.jsonRpcApiCaller.requestInterceptor = requestInterceptor;
    newInstance.jsonRpcApiCaller.responseInterceptor = responseInterceptor;
    newInstance.restApiCaller.requestInterceptor = requestInterceptor;
    newInstance.restApiCaller.responseInterceptor = responseInterceptor;

    return newInstance;
  }

  public set endpointUrl(endpoint: string) {
    this.jsonRpcApiCaller.defaultEndpointUrl = endpoint;

    if(this.originator !== null)
      this.originator.jsonRpcApiCaller.defaultEndpointUrl = endpoint;
  }

  public get endpointUrl(): string {
    return this.jsonRpcApiCaller.defaultEndpointUrl;
  }

  public extend<YourApi>(extendedHiveApiData?: YourApi): HiveChainApi & TWaxExtended<YourApi, this> {
    const newApi = new HiveChainApi(this.wax, this.chainId, this.jsonRpcApiCaller.defaultEndpointUrl, this.restApiCaller.defaultEndpointUrl, this);

    if(typeof extendedHiveApiData === "object")
      iterate(newApi.jsonRpcApiCaller.localTypes, extendedHiveApiData as object)

    return newApi as unknown as HiveChainApi & TWaxExtended<YourApi, this>;
  }

  public extendRest<YourRestApi>(extendedHiveRestApiData?: TDeepWaxApiRequestPartial<YourRestApi>): HiveChainApi & TWaxRestExtended<YourRestApi, this> {
    const newApi = new HiveChainApi(this.wax, this.chainId, this.jsonRpcApiCaller.defaultEndpointUrl, this.restApiCaller.defaultEndpointUrl, this);

    if(typeof extendedHiveRestApiData === "object")
      iterate(newApi.restApiCaller.localTypes, extendedHiveRestApiData as object);

    return newApi as unknown as HiveChainApi & TWaxRestExtended<YourRestApi, this>;
  }

  public async createTransaction(expirationTime?: TTimestamp): Promise<IOnlineTransaction> {
    const chainReferenceData = await this.acquireChainReferenceData(3000);

    const transaction = new OnlineTransaction(this, chainReferenceData, expirationTime); 
    return transaction;
  }

  private async acquireChainReferenceData(taposLiveness: number): Promise<TChainReferenceData> {
    const now = Date.now();
    if ((now - this.lastTaposCacheUpdate) >= taposLiveness) {
      const { head_block_id, time } = await this.api.database_api.get_dynamic_global_properties({});
      this.taposCache = { head_block_id: head_block_id, head_block_time: dateFromString(time) };
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

  private async findAccountsNoThrow(...accountNames: string[]): Promise<Array<ApiAccount>> {
    const { accounts } = await this.api.database_api.find_accounts({ accounts: accountNames });
    return accounts;
  }

  private async findAccounts(...accountNames: string[]): Promise<Array<ApiAccount>> {
    const accounts = await this.findAccountsNoThrow(...accountNames);
    if(accounts.length !== accountNames.length) {
      const notFoundAccounts = accounts.map(node => node.name).filter(node => !accountNames.includes(node));

      throw new WaxError(`No such account(s) on chain with given name(s): "${notFoundAccounts.join(', ')}"`);
    }

    return accounts;
  }

  private async findWitnessAccountsNoThrow(...witnessNames: string[]): Promise<Array<ApiWitness>> {
    const { witnesses } = await this.api.database_api.find_witnesses({ owners: witnessNames }); 
    return witnesses;
  }

  private async findWitnessAccounts(...witnessNames: string[]): Promise<Array<ApiWitness>> {
    const accounts = await this.findWitnessAccountsNoThrow(...witnessNames);
    if(accounts.length !== witnessNames.length) {
      const notFoundAccounts = accounts.map(node => node.owner).filter(node => !witnessNames.includes(node));

      throw new WaxError(`No such witness(s) on chain with given name(s): "${notFoundAccounts.join(', ')}"`);
    }

    return accounts;
  }

  private async findAccount(accountName: string): Promise<ApiAccount> {
    const [ account ] = await this.findAccounts(accountName);

    return account;
  }

  public transformApiAuthority(input: ApiAuthority): wax_authority {
    const transformEntries = (input: {"0": string; "1": number}[], storage: MapStringUInt16) => input.reduce((storage: MapStringUInt16, data): MapStringUInt16 => {
      storage.set(data[0], data[1]);
      return storage;
      }, storage);

      const retVal: wax_authority = {
        weight_threshold: input.weight_threshold,
        account_auths: transformEntries(input.account_auths, new this.wax.MapStringUInt16()),
        key_auths: transformEntries(input.key_auths, new this.wax.MapStringUInt16())
      };

      return retVal;
  }

  public async collectAccountAuthorities(throwIfMissing: boolean, ...accountNames: string[]): Promise<TAccountAuthorityCollection> {
    if(accountNames.length === 0)
      return new Map();

    const accountData = throwIfMissing ? await this.findAccounts(...accountNames) : await this.findAccountsNoThrow(...accountNames);

    const retVal = new Map<TAccountName, [wax_authorities, TPublicKey]>();

    for(let i = 0; i < accountData.length; ++i) {
      const name = accountData[i].name;
      const owner = accountData[i].owner;
      const active = accountData[i].active;
      const posting = accountData[i].posting;

      const account_authority: wax_authorities = {
        owner: this.transformApiAuthority(owner),
        active: this.transformApiAuthority(active),
        posting: this.transformApiAuthority(posting)
      };

      retVal.set(name, [account_authority, accountData[i].memo_key]);
    }

    return retVal;
  }

  public async collectWitnessSigningKeys(throwIfMissing: boolean, ...accountNames: string[]): Promise<Map<TAccountName, TPublicKey>> { 
    if(accountNames.length === 0)
      return new Map();

    const accountData = throwIfMissing ? await this.findWitnessAccounts(...accountNames) : await this.findWitnessAccountsNoThrow(...accountNames);

    const retVal = new Map<TAccountName, TPublicKey>();

    for(let i = 0; i < accountData.length; ++i)
      retVal.set(accountData[i].owner, accountData[i].signing_key);

    return retVal;
  }

  public async encryptForAccounts(wallet: IBeekeeperUnlockedWallet, content: string, fromAccount: string, toAccount: string): Promise<string> {
    let from: string, to: string;

    ([ { memo_key: from }, { memo_key: to } ] = await this.findAccounts(...[... new Set([ fromAccount, toAccount ])]));

    if(to === undefined)
      to = from;

    const encrypted = wallet.encryptData(content, from, to);

    return safeWasmCall(() => this.proto.cpp_crypto_memo_dump_string({
      content: encrypted,
      from,
      to
    }));
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
