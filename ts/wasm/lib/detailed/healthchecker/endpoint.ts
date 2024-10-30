import { type HealthChecker } from "./healthchecker.js";
import { type IDetailedResponseData } from "../util/request_helper.js";
import { EChainApiType } from "../chain_api.js";
import { WaxHealthCheckerEndpointUrlError } from "../../../lib/errors.js";

export interface IHiveEndpoint {
  /**
   * @example ['block_api', 'get_block_header']
   * @example ['hafbe-api', 'operation-type-counts']
   */
  readonly paths: string[];

  /**
   * @example 'json_rpc'
   * @example 'rest'
   */
  readonly apiCallerId: EChainApiType;

  /**
   * Endpoints that will be checked
   */
  readonly endpointUrls: Readonly<Array<string>>;

  /**
   * Lists sorted endpoint url statuses (latency in descending order)
   */
  list(): Array<THiveEndpointData>;
}

export interface INewUpDownEvent {
  data: THiveEndpointData;
  paths: string[];
  apiCallerId: EChainApiType;
  endpointUrl: string;
  up: boolean;
}
export interface INewBestEvent {
  best: string;
  apiType: string;
  apiEndpoint: string;
}

export interface IHiveEndpointDataDown {
  endpointUrl: string;
  up: false;
}
export interface IHiveEndpointDataUp {
  endpointUrl: string;
  up: true;
  latency: number;
}
export type THiveEndpointData = IHiveEndpointDataDown | IHiveEndpointDataUp;

export class HiveEndpoint implements IHiveEndpoint {
  private readonly up: Map<string, IHiveEndpointDataUp> = new Map();
  private readonly down: Map<string, IHiveEndpointDataDown> = new Map();

  public list(): Array<THiveEndpointData> {
    return [...[...this.up.values()].sort((a, b) => a.latency - b.latency), ...this.down.values()];
  }

  public constructor(
    private readonly checker: HealthChecker,
    public readonly id: number,
    public readonly apiCallerId: EChainApiType,
    public readonly paths: string[],
    public readonly endpointUrls: Readonly<Array<string>>,
    private readonly caller: (apiUrl: string) => Promise<IDetailedResponseData<any>>) {
  }

  public async performCheck(): Promise<void> {
    for(const endpointUrl of this.endpointUrls)
      try {
        const stats = await this.caller(endpointUrl);

        const data: IHiveEndpointDataUp = {
          endpointUrl,
          up: true,
          latency: stats.end - stats.start
        };

        if(this.down.has(endpointUrl)) {
          this.checker.emit("statechanged", { data, apiCallerId: this.apiCallerId, paths: this.paths, endpointUrl, up: true } satisfies INewUpDownEvent );
          this.down.delete(endpointUrl);
        }

        this.checker.emit("stats", data);
        this.up.set(endpointUrl, data);
      } catch (error) {
        const data: IHiveEndpointDataDown = {
          endpointUrl,
          up: false
        };

        if(this.up.has(endpointUrl)) {
          this.checker.emit("statechanged", { data, apiCallerId: this.apiCallerId, paths: this.paths, endpointUrl, up: false } satisfies INewUpDownEvent );
          this.up.delete(endpointUrl);
        }

        this.checker.emit("stats", data);
        this.down.set(endpointUrl, data);

        throw new WaxHealthCheckerEndpointUrlError(error instanceof Error ? error : new Error(String(error)), endpointUrl);
      }
  }
}