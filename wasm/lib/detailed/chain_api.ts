import type { IHiveApi, IHiveChainInterface, IManabarData, ITransactionBuilder, TTimestamp, TWaxExtended } from "../interfaces";
import type { ApiAccount, ApiManabar, MainModule, RcAccount } from "../index";

import { instanceToPlain, plainToInstance } from "class-transformer";
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
  public api!: IHiveApi;

  private localTypes = HiveApiTypes;

  public constructor(
    public readonly wax: MainModule,
    public readonly chainId: string,
    private readonly apiEndpoint: string
  ) {
    super(wax, chainId);

    this.initializeApi();
  }

  private initializeApi(): void {
    const checkStatus = (response: Response) => {
      if(response.status >= 200 && response.status < 300)
        return response;

      throw Object.assign(new Error(response.statusText), { response });
    };

    const parseJSON = (response: Response) => response.json();

    this.api = new Proxy({} as IHiveApi, {
      get: (_target: any, propertyParent: string, _receiver: any) => {
        return new Proxy({}, {
          get: (_target: any, property: string, _receiver: any) => {
            if(typeof this.localTypes[propertyParent] !== 'object')
              throw new WaxError(`Api "${propertyParent}" has not been implemented yet or does not exist`);

            return async(params: object) => {
              const method = `${propertyParent}.${property}`;

              if(typeof this.localTypes[propertyParent][property] !== 'object')
                throw new WaxError(`Method "${method}" has not been implemented yet or does not exist`);

              await validateOrReject(instanceToPlain(this.localTypes[propertyParent][property].params, params));

              const data = await fetch(this.apiEndpoint, {
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

              if(typeof data.result !== 'object')
                throw new WaxChainApiError('No result found in the Hive API response', data);

              const result = plainToInstance(this.localTypes[propertyParent][property].result, data.result) as object;

              await validateOrReject(result);

              return result;
            };
          }
        });
      }
    });
  }

  public extend<YourApi>(extendedHiveApiData: YourApi): TWaxExtended<YourApi> {
    const newApi = new HiveChainApi(this.wax, this.chainId, this.apiEndpoint);

    newApi.localTypes = { ...newApi.localTypes, ...extendedHiveApiData };

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

  private async findAccount(accountName: string): Promise<ApiAccount> {
    const { accounts: [ account ] } = await this.api.database_api.find_accounts({ accounts: [ accountName ] });
    if(typeof account === "undefined")
      throw new WaxError(`No such account on chain with given name: "${accountName}"`);

    return account;
  }

  public async calculateCurrentManabarValueForAccount(accountName: string, manabarType: EManabarType = EManabarType.UPVOTE): Promise<IManabarData> {
    const account = await this.findAccount(accountName);
    const dgpo = await this.api.database_api.get_dynamic_global_properties({});

    let manabar: ApiManabar;
    let max: string | number | Long;

    if(manabarType === EManabarType.RC) {
      ({ rc_manabar: manabar, max_rc: max } = await this.getRcManabarForAccount(accountName));
    } else {
      manabar = manabarType === EManabarType.UPVOTE ? account.voting_manabar : account.downvote_manabar;
      max = Long.fromValue(account.post_voting_power.amount);

      if(manabarType === EManabarType.DOWNVOTE)
        max = max.multiply(dgpo.downvote_pool_percent).divide(ONE_HUNDRED_PERCENT);
    }

    return super.calculateCurrentManabarValue(
      Math.round(new Date(`${dgpo.time}Z`).getTime() / 1000), // Convert API time to seconds
      max,
      manabar.current_mana,
      manabar.last_update_time
    );
  }

  public async calculateManabarFullRegenerationTimeForAccount(accountName: string, manabarType: EManabarType = EManabarType.UPVOTE): Promise<Date> {
    const account = await this.findAccount(accountName);
    const dgpo = await this.api.database_api.get_dynamic_global_properties({});

    let manabar: ApiManabar;
    let max: string | number;

    if(manabarType === EManabarType.RC) {
      ({ rc_manabar: manabar, max_rc: max } = await this.getRcManabarForAccount(accountName));
    } else {
      manabar = manabarType === EManabarType.UPVOTE ? account.voting_manabar : account.downvote_manabar;
      max = account.post_voting_power.amount;
    }

    const time = super.calculateManabarFullRegenerationTime(
      Math.round(new Date(`${dgpo.time}Z`).getTime() / 1000), // Convert API time to seconds
      max,
      manabar.current_mana,
      manabar.last_update_time
    );

    return new Date(time * 1000);
  }
}
