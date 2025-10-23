import type { IHiveChainInterface, IManabarData, ITransaction, IOnlineTransaction, TTimestamp, TPublicKey, TWaxExtended, TBlockHash, TWaxRestExtended, TDeepWaxApiRequestPartial, IWaxOptionsChain, TNaiAssetConvertible } from "./interfaces";
import type { MainModule, MapStringUInt16, wax_authority, wax_authorities } from "../build_wasm/wax.common";
import { ApiAuthority, ApiWitness, type ApiAccount, type ApiManabar, type ApiTransaction, type RcAccount } from "./api";

import { WaxError, WaxChainApiError } from "./errors.js";
import { ONE_HUNDRED_PERCENT, WaxBaseApi } from "./base_api.js";
import { HiveApiTypes, HiveRestApiTypes } from "./chain_api_data.js";
import { iterate } from "./util/iterate.js";
import { OnlineTransaction} from "./online_transaction";
import { dateFromString } from "./util/expiration_parser.js";

import { ApiCaller, TRequestInterceptor, TResponseInterceptor } from "./util/api_caller";

import { TAccountName } from "./hive_apps_operations";
import { ISignatureProvider } from "./extensions/signatures";
import { WasmManager } from "./util/wasm_errors";

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

  private readonly apiTimeout: number;

  public constructor(
    wasmManager: WasmManager,
    wax: MainModule,
    config: IWaxOptionsChain,
    public readonly originator: HiveChainApi|null
  ) {
    super(wasmManager, wax, config.chainId);

    this.apiTimeout = config.apiTimeout;

    this.jsonRpcApiCaller = new ApiCaller(EChainApiType.JSON_RPC, config.apiEndpoint, this.apiTimeout, iterate(originator ? structuredClone(originator.jsonRpcApiCaller.localTypes) : {}, HiveApiTypes), 'POST', (path, newValue, found) => {
      if (this.originator !== null) // Propagate the change to the originator
        return found ||= this.originator.jsonRpcApiCaller.setEndpointUrlForPath(path, newValue, found);

      return found || false;
    }, config.waxApiCaller, data => { // Rewrite request data to JSON-RPC format
        data.data = JSON.stringify({
        jsonrpc: "2.0",
        method: data.paths.join('.'),
        params: data.data,
        id: 1
      });
      data.url = '';

      return data;
    }, data => { // Rewrite response data to JSON-RPC format
      if (typeof data.response === "object") {
        if ("result" in data.response) {
          data.response = data.response.result;
          return data;
        }

        if ("error" in data.response && typeof data.response.error === "object" && "data" in data.response.error) {
          // Possibly an exception that we can recognize & repackage.
          this.wasmManager.safeWasmCall(() => this.protocol.cpp_transform_api_error_response_into_exception(JSON.stringify(data.response.error.data)));
        }
      }

      throw new WaxChainApiError(`Invalid response from chain API`, data.response);
    });

    this.restApiCaller = new ApiCaller(EChainApiType.REST, config.restApiEndpoint, this.apiTimeout, iterate(originator ? structuredClone(originator.restApiCaller.localTypes) : {}, HiveRestApiTypes), 'GET', (path, newValue, found) => {
      if (this.originator !== null) // Propagate the change to the originator
        return found ||= this.originator.restApiCaller.setEndpointUrlForPath(path, newValue, found);

      return found || false;
    }, config.waxApiCaller);
  }

  public async broadcast(transaction: ApiTransaction | ITransaction | IOnlineTransaction): Promise<void> {
    const toBroadcast: object = "toApiJson" in transaction ? transaction.toApiJson() : transaction;

    if ("performOnChainVerification" in transaction)
      await transaction.performOnChainVerification();

    await this.api.network_broadcast_api.broadcast_transaction({
      max_block_age: -1,
      trx: toBroadcast as ApiTransaction
    });
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
    const newApi = new HiveChainApi(this.wasmManager, this.wax, {
      chainId: this.chainId,
      apiEndpoint: this.jsonRpcApiCaller.defaultEndpointUrl,
      restApiEndpoint: this.restApiCaller.defaultEndpointUrl,
      apiTimeout: this.apiTimeout,
      waxApiCaller: this.jsonRpcApiCaller.defaultWaxApiCaller,
    }, this);

    if(typeof extendedHiveApiData === "object")
      iterate(newApi.jsonRpcApiCaller.localTypes, extendedHiveApiData as object)

    return newApi as unknown as HiveChainApi & TWaxExtended<YourApi, this>;
  }

  public extendRest<YourRestApi>(extendedHiveRestApiData?: TDeepWaxApiRequestPartial<YourRestApi>): HiveChainApi & TWaxRestExtended<YourRestApi, this> {
    const newApi = new HiveChainApi(this.wasmManager, this.wax, {
      chainId: this.chainId,
      apiEndpoint: this.jsonRpcApiCaller.defaultEndpointUrl,
      restApiEndpoint: this.restApiCaller.defaultEndpointUrl,
      apiTimeout: this.apiTimeout,
      waxApiCaller: this.jsonRpcApiCaller.defaultWaxApiCaller,
    }, this);

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
    const { accounts } = await this.api.database_api.find_accounts({ accounts: accountNames, delayed_votes_active: true });
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
    const { witnesses } = await this.api.database_api.find_witnesses({ owners: witnessNames, delayed_votes_active: true });
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

  public async encryptForAccounts(wallet: ISignatureProvider, content: string, fromAccount: string, toAccount: string): Promise<string> {
    let from: string, to: string;

    ([ { memo_key: from }, { memo_key: to } ] = await this.findAccounts(...[... new Set([ fromAccount, toAccount ])]));

    if(to === undefined)
      to = from;

    const encrypted = wallet.encryptData(content, from, to);

    return this.wasmManager.safeWasmCall(() => this.protocol.cpp_crypto_memo_dump_string({
      content: encrypted,
      from,
      to
    }));
  }

  private async getManabarDataArguments(accountName: string, manabarType: EManabarType): Promise<Parameters<WaxBaseApi['calculateCurrentManabarValue']>> {
    const dgpo = await this.api.database_api.get_dynamic_global_properties({});

    let manabar: ApiManabar;
    let max: TNaiAssetConvertible;

    if(manabarType === EManabarType.RC) {
      ({ rc_manabar: manabar, max_rc: max } = await this.getRcManabarForAccount(accountName));
    } else {
      const account = await this.findAccount(accountName);

      manabar = manabarType === EManabarType.UPVOTE ? account.voting_manabar : account.downvote_manabar;
      max = BigInt(account.post_voting_power.amount);

      if(manabarType === EManabarType.DOWNVOTE) {
        const downvotePoolPercent = BigInt(dgpo.downvote_pool_percent);
        if(max / ONE_HUNDRED_PERCENT > ONE_HUNDRED_PERCENT)
          max = (max / ONE_HUNDRED_PERCENT) * downvotePoolPercent;
        else
          max = (max * downvotePoolPercent) / ONE_HUNDRED_PERCENT;
      }
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

    if (args[1] === 0n)
      return new Date();

    const time = super.calculateManabarFullRegenerationTime(
      ...args
    );

    return new Date(time * 1000);
  }
}
