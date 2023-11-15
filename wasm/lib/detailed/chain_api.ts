import type { IHiveApi, IHiveChainInterface, ITransactionBuilder, TTimestamp } from "../interfaces";
import type { MainModule } from "../index";

import axios, { Axios } from "axios";
import { instanceToPlain, plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";

import { WaxError, WaxChainApiError } from "../errors.js";
import { WaxBaseApi } from "./base_api.js";
import { HiveApiTypes } from "./chain_api_data.js";

export class HiveChainApi extends WaxBaseApi implements IHiveChainInterface {
  public api!: IHiveApi;

  public constructor(
    public readonly wax: MainModule,
    public readonly chainId: string,
    private readonly apiEndpoint: string
  ) {
    super(wax, chainId);

    this.initializeApi();
  }

  private initializeApi(): void {
    const axios = this.createAxios();

    this.api = new Proxy({} as IHiveApi, {
      get(_target: any, propertyParent: string, _receiver: any) {
        return new Proxy({}, {
          get(_target: any, property: string, _receiver: any) {
            if(typeof HiveApiTypes[propertyParent] !== 'object')
              throw new WaxError(`Api "${propertyParent}" has not been implemented yet or does not exist`);

            return async(params: object) => {
              const method = `${propertyParent}.${property}`;

              if(typeof HiveApiTypes[propertyParent][property] !== 'object')
                throw new WaxError(`Method "${method}" has not been implemented yet or does not exist`);

              await validateOrReject(instanceToPlain(HiveApiTypes[propertyParent][property].params, params));

              const { data } = await axios.post('/', {
                jsonrpc: "2.0",
                method,
                params,
                id: 1
              });

              if(typeof data.error === 'object')
                throw new WaxChainApiError('Error sending request to the Hive API', data.error);

              if(typeof data.result !== 'object')
                throw new WaxChainApiError('No result found in the Hive API response', data);

              const result = plainToInstance(HiveApiTypes[propertyParent][property].result, data.result) as object;

              await validateOrReject(result);

              return result;
            };
          }
        });
      }
    });
  }

  private createAxios(): Axios {
    return axios.create({ baseURL: this.apiEndpoint, responseType: "json" });
  }

  public async getTransactionBuilder(expirationTime?: TTimestamp): Promise<ITransactionBuilder> {
    const { head_block_id } = await this.api.database_api.get_dynamic_global_properties({});

    const builder = new super.TransactionBuilder(head_block_id, expirationTime ?? "+1m");

    return builder;
  }
}
