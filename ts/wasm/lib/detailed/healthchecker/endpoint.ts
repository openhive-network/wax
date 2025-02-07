import { type HealthChecker } from "./healthchecker.js";
import { type IDetailedResponseData } from "../util/request_helper.js";
import { EChainApiType } from "../chain_api.js";
import { WaxHealthCheckerEndpointUrlError, WaxRequestTimeoutError, WaxNon_2XX_3XX_ResponseCodeError, WaxRequestAbortedByUser, WaxHealthCheckerValidatorFailedError } from "./errors.js";

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
  readonly endpointUrls: Readonly<Set<string>>;

  /**
   * Unique identifier for this endpoint
   * Can be used upon validationerror parsing to properly identify the endpoint
   */
  readonly id: number;

  /**
   * Adds new endpoint url to the list of urls to check
   * @param {string} endpointUrl url to add
   */
  addEndpointUrl(endpointUrl: string): void;

  /**
   * Removes endpoint url from the list of urls to check
   * @param {string} endpointUrl url to remove
   * @returns {boolean} true if endpoint was removed, false if it was not found
   */
  removeEndpointUrl(endpointUrl: string): boolean;

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

export type TErrorReason = "timeout" | "servererror" | "validationerror" | "userabort" | "other";

export interface IHiveEndpointDataBase {
  endpointUrl: string;
}

export interface IHiveEndpointDataDown extends IHiveEndpointDataBase {
  up: false;
  reason: TErrorReason;
}
export interface IHiveEndpointDataUp extends IHiveEndpointDataBase {
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
    public readonly endpointUrls: Readonly<Set<string>>,
    private readonly caller: (apiUrl: string) => Promise<IDetailedResponseData<any>>) {
  }

  public addEndpointUrl(endpointUrl: string): void {
    this.endpointUrls.add(endpointUrl);
  }

  public removeEndpointUrl(endpointUrl: string): boolean {
    return this.endpointUrls.delete(endpointUrl);
  }

  public async performCheck(): Promise<void> {
    const resultPromises: Array<Promise<any>> = [];

    // We copy the endpointUrl values here into a new array so it doesn't change during the loop
    for(const url of [...this.endpointUrls.values()])
      resultPromises.push(this.verifyUponUrl(url));

    const results = await Promise.allSettled(resultPromises);

    for (let i = 0; i < results.length; ++i) {
      const result = results[i];

      if (result.status === "rejected")
        this.checker.emit("error", new WaxHealthCheckerEndpointUrlError(result.reason instanceof Error ? result.reason : new Error(String(result.reason)), this.endpointUrls[i]));
    }
  }

  private async verifyUponUrl(endpointUrl: string): Promise<void> {
    try {
      const stats = await this.caller(endpointUrl);

      const data: IHiveEndpointDataUp = {
        endpointUrl,
        up: true,
        latency: stats.end - stats.start
      };

      if (this.down.has(endpointUrl)) {
        this.checker.emit("statechanged", { data, apiCallerId: this.apiCallerId, paths: this.paths, endpointUrl, up: true } satisfies INewUpDownEvent);
        this.down.delete(endpointUrl);
      }

      this.checker.emit("stats", data);
      this.up.set(endpointUrl, data);
    } catch (error) {
      let reason: TErrorReason = "other";
      if (error instanceof WaxRequestTimeoutError)
        reason = "timeout";
      else if (error instanceof WaxNon_2XX_3XX_ResponseCodeError)
        reason = "servererror";
      else if (error instanceof WaxRequestAbortedByUser)
        reason = "userabort";
      else if (error instanceof WaxHealthCheckerValidatorFailedError)
        reason = "validationerror";

      const data: IHiveEndpointDataDown = {
        endpointUrl,
        reason,
        up: false
      };

      if (this.up.has(endpointUrl)) {
        this.checker.emit("statechanged", { data, apiCallerId: this.apiCallerId, paths: this.paths, endpointUrl, up: false } satisfies INewUpDownEvent);
        this.up.delete(endpointUrl);
      }

      this.checker.emit("stats", data);
      this.down.set(endpointUrl, data);

      throw new WaxHealthCheckerEndpointUrlError(error instanceof Error ? error : new Error(String(error)), endpointUrl);
    }
  }
}
