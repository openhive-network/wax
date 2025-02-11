import EventEmitter from "events";
import { WaxError } from "../errors.js";
import { WaxHealthCheckerError, WaxHealthCheckerValidatorFailedError } from "./errors.js";
import { TRestChainCaller, type TRequestInterceptor, type TResponseInterceptor } from "../util/api_caller.js";
import { HiveEndpoint, type IHiveEndpointDataBase, type IHiveEndpoint, type INewUpDownEvent, type THiveEndpointData, type TErrorReason } from "./endpoint.js";
import { IRequestOptions, type IDetailedResponseData } from "../util/request_helper.js";
import { defaultCalcScores } from "./math.js";
import { EChainApiType } from "../chain_api.js";

const INITIAL_CHECKER_INTERVAL_MS = 10_000;
const PERFORM_CHECK_INTERVAL_MS = 1_000;

const GATHER_STATS_FROM_PREVIOUS_CALLS_AMOUNT = 10;

export interface IScoredEndpointUp extends IHiveEndpointDataBase {
  score: number;
  /**
   * Note: Latencies are listed in a way that the last element is the newest in history
   */
  latencies: number[];
  up: true;
}

export interface IScoredEndpointDown extends IHiveEndpointDataBase {
  score: 0;
  up: false;
  lastErrorReason: TErrorReason;
}

export type TScoredEndpoint = IScoredEndpointDown | IScoredEndpointUp;

export type TCalculateScoresFunction = (data: Readonly<Array<[string, Array<THiveEndpointData>]>>) => Array<TScoredEndpoint>;

interface IHealthCheckerEvents {
  'newbest': (endpoint: TScoredEndpoint) => void | Promise<void>;
  'newup': (endpoint: TScoredEndpoint) => void | Promise<void>;
  'newdown': (endpoint: TScoredEndpoint) => void | Promise<void>;
  'data': (endpoints: Array<TScoredEndpoint>, collectedLatenciesMaxLength?: number) => void | Promise<void>;
  'error': (error: WaxHealthCheckerError) => void | Promise<void>;
  'validationerror': (error: WaxHealthCheckerValidatorFailedError) => void | Promise<void>;
}

export declare interface HealthChecker {
  on<U extends keyof IHealthCheckerEvents>(
    event: U, listener: IHealthCheckerEvents[U]
  ): this;

  once<U extends keyof IHealthCheckerEvents>(
    event: U, listener: IHealthCheckerEvents[U]
  ): this;

  off<U extends keyof IHealthCheckerEvents>(
    event: U, listener: IHealthCheckerEvents[U]
  ): this;
}

export class HealthChecker extends EventEmitter {
  private id: number = 0;

  private readonly endpointSubscription: Map<string, (data: INewUpDownEvent) => void> = new Map();

  private readonly endpoints: Map<number, HiveEndpoint> = new Map();
  private readonly endpointStats: Map<string, Array<THiveEndpointData>> = new Map();

  private intervalId?: NodeJS.Timeout;
  private nextScheduledCheck: number | undefined;

  private lastBest?: string;

  private cachedScoredList: Array<TScoredEndpoint> = [];

  private cachedScoredListLimit: number = GATHER_STATS_FROM_PREVIOUS_CALLS_AMOUNT;

  public get best (): string | undefined {
    return this.lastBest;
  }

  public list(): Array<TScoredEndpoint> {
    return this.cachedScoredList;
  }

  public static readonly DefaultJsonRpcEndpoints: Readonly<Array<string>> = [
    "https://api.hive.blog"
  ];

  public static readonly DefaultRestApiEndpoints: Readonly<Array<string>> = [
    "https://api.syncad.com"
  ];

  /**
   * Adds URL to endpoints matching given criteria
   *
   * @param {string} endpointUrl Endpoint URL to add
   * @param {EChainApiType} type Type of the endpoint
   */
  public addEndpointUrl(endpointUrl: string, type: EChainApiType): void {
    for(const endpoint of this.endpoints.values())
      if (type === endpoint.apiCallerId)
        endpoint.addEndpointUrl(endpointUrl);
  }

  /**
   * Removes URL from endpoints matching given criteria
   * @param {string} endpointUrl Endpoint URL to remove
   * @param type Type of the endpoint
   */
  public removeEndpointUrl(endpointUrl: string, type: EChainApiType): void {
    for(const endpoint of this.endpoints.values())
      if (type === endpoint.apiCallerId)
        endpoint.removeEndpointUrl(endpointUrl, false);

    this.clearUnusedEndpointUrlsFromStats();
  }

  private ensureRunning(): void {
    if(this.nextScheduledCheck === undefined)
      this.nextScheduledCheck = Date.now();

    if(this.intervalId === undefined)
      this.intervalId = setInterval(this.performChecks.bind(this), PERFORM_CHECK_INTERVAL_MS);
  }

  private stop(): void {
    clearInterval(this.intervalId);
    this.intervalId = undefined;
    this.nextScheduledCheck = undefined;
  }

  /**
   * Creates a new HealthChecker instance.
   *
   * @param {?Readonly<Array<string>>} defaultEndpoints default endpoints for checkers.
   *  If `undefined` (default) uses {@link DefaultEndpoints} for json rpc or {@link DefaultRestApiEndpoints} for rest api
   *
   * @example
   * ```ts
   * const hc = new wax.HealthChecker();
   *
   * hc.on("newbest", ({ endpointUrl }) => { setEndpoint(endpointUrl); });
   * hc.on("data", (endpointsScored) => { console.log(endpointsScored); });
   *
   * // Remember to handle error event to prevent unhandled promise rejection
   * hc.on("error", error => { console.error(error); });
   *
   * hc.register(chain.api.block_api.get_block, { block_num: 1 });
   * ```
   */
  public constructor(
    public readonly defaultEndpoints: Readonly<Array<string>> | undefined = undefined,
    private readonly calculateScoresFunction: TCalculateScoresFunction = defaultCalcScores) {
    super();

    this.on('stats' as any, (data: THiveEndpointData) => {
      this.pushEndpointData(data);
    });

    // clearunused event is our internal event
    this.on('clearunused' as any, () => {
      this.clearUnusedEndpointUrlsFromStats();
    });
  }

  /**
   * Returns the endpoint by id if exists
   * @param {number} id - Id of the endpoint
   * @returns {IHiveEndpoint | undefined} endpoint if found, undefined otherwise
   */
  public getEndpoint(id: number): IHiveEndpoint | undefined {
    return this.endpoints.get(id);
  }

  /**
   * @returns {IterableIterator<IHiveEndpoint>} iterator for all registered endpoints
   */
  public [Symbol.iterator](): IterableIterator<IHiveEndpoint> {
    return this.endpoints.values();
  }

  /**
   * Registers the checker to the healthcheck intervals
   *
   * @param {TFn} endpointToCheck Function to check (e.g. `chain.api.block_api.get_block`)
   * @param {Parameters<TFn>[0]} toSend param to {@link endpointToCheck}
   * @param {(data: Awaited<ReturnType<TFn>>) => (true | string)} validator optional validator for fields. Return true to pass validation and string to fail with given message
   * @param {?string[]} testOnEndpoints explicit list of endpoints. If not provided defaults to {@link defaultEndpoints}
   *
   * @returns {IHiveEndpoint} hive endpoint to check
   *
   * @example
   * ```ts
   * const hc = new wax.HealthChecker();
   *
   * hc.register(chain.api.block_api.get_block, { block_num: 1 }, data => data.block?.previous === "0000000000000000000000000000000000000000", ["api.openhive.network"]);
   * ```
   */
  public register<TFn extends (...args: any) => any>(
    endpointToCheck: TFn,
    toSend: Parameters<TFn>[0],
    validator?: (data: Awaited<ReturnType<TFn>>) => (true | string),
    testOnEndpoints?: string[]
  ): IHiveEndpoint {
    const target = (endpointToCheck as unknown as TRestChainCaller)._target;

    if(!("withProxy" in target) || !("paths" in target) || !("apiCallerId" in target))
      throw new WaxError('Specified endpoint does not belong to the wax API interface');

    const apiType = target.apiCallerId as EChainApiType;
    const paths = target.paths as string[];

    const endpoints = (testOnEndpoints === undefined || testOnEndpoints.length === 0) ? (this.defaultEndpoints === undefined ?
        (apiType === EChainApiType.JSON_RPC ? HealthChecker.DefaultJsonRpcEndpoints : HealthChecker.DefaultRestApiEndpoints)
      : this.defaultEndpoints
    ) : testOnEndpoints;

    const hiveEndpointObject = new HiveEndpoint(this, this.id++, apiType, paths, new Set(endpoints), async (endpointToTest: string) => {
      let timings!: IDetailedResponseData<any>;

      let request: IRequestOptions;

      const requestInterceptor: TRequestInterceptor = data => {
        data.endpoint = endpointToTest;
        request = data;
        return data;
      };

      const responseInterceptor: TResponseInterceptor = data => {
        timings = data;
        return data;
      };

      const returned = await target.withProxy(requestInterceptor, responseInterceptor)(toSend);

      if(validator !== undefined && typeof timings === "object") {
        const validatorResult = validator(returned);

        if(validatorResult !== true) {
          const error = new WaxHealthCheckerValidatorFailedError(validatorResult, hiveEndpointObject, request!, timings!);

          this.emit("validationerror", error);

          throw error;
        }
      }

      return timings;
    });

    this.endpoints.set(hiveEndpointObject.id, hiveEndpointObject);

    if (this.endpoints.size === 1)
      this.ensureRunning();

    this.calculateCachedScoredListSize();

    return hiveEndpointObject;
  }

  private calculateCachedScoredListSize(): void {
    let limit = GATHER_STATS_FROM_PREVIOUS_CALLS_AMOUNT;

    const domainsCount: Record<string, number> = {};

    for(const endpoint of this.endpoints.values())
      for(const url of endpoint.endpointUrls)
        domainsCount[url] = (domainsCount[url] ?? 0) + 1;

    for(const count of Object.values(domainsCount))
      limit = Math.max(limit, count * 2);

    this.cachedScoredListLimit = limit;
  }

  private clearUnusedEndpointUrlsFromStats(): void {
    // Collect all currently used endpoint URLs from endpoints
    const endpointUrls = new Set<string>();
    for(const endpoint of this.endpoints.values())
      for(const url of endpoint.endpointUrls)
        endpointUrls.add(url);

    // Remove all unused endpoint URLs from stats
    for(const statUrl of this.endpointStats.keys())
      if(!endpointUrls.has(statUrl))
        this.endpointStats.delete(statUrl);

    this.calculateCachedScoredListSize();
  }

  /**
   * Unregisters the checker from the healthcheck intervals
   *
   * @param {IHiveEndpoint} api api to unregister
   * @param {?boolean} clearUnusedEndpointUrlsFromStats if true, clears unused endpoint urls from stats (defaults to true)
   * @returns {boolean} either true or false if api has been unregistered succesfully
   */
  public unregister(api: IHiveEndpoint, clearUnusedEndpointUrlsFromStats: boolean = true): boolean {
    const endpoint = this.endpoints.get((api as HiveEndpoint).id);

    if(endpoint === undefined)
      return false;

    this.endpoints.delete((api as HiveEndpoint).id);
    if (clearUnusedEndpointUrlsFromStats)
      this.clearUnusedEndpointUrlsFromStats();

    if (this.endpoints.size === 0)
      this.stop();

    return true;
  }

  /**
   * Unregisters the checker from all of the healthcheck intervals
   * @param {?boolean} clearUnusedEndpointUrlsFromStats if true, clears unused endpoint urls from stats (defaults to true)
   */
  public unregisterAll(clearUnusedEndpointUrlsFromStats: boolean = true): void {
    const registrationKeys = this.endpoints.values();
    for(const key of registrationKeys)
      this.unregister(key, false);

    if(clearUnusedEndpointUrlsFromStats)
      this.clearUnusedEndpointUrlsFromStats();
  }

  /**
   * Subscribes to the given endpoint and notifies via EventEmitter when the endpoint is either down or back up
   *
   * @param {string} endpointUrl endpoint to subscribe to
   *
   * @example
   * ```ts
   * const hc = new wax.HealthChecker();
   *
   * hc.subscribe(HealthChecker.DefaultEndpoints[0]);
   *
   * hc.on("newdown", ({ endpointUrl }) => { console.log(endpointUrl, 'is down. Changing endpoint url...'); });
   * hc.on("newup", ({ endpointUrl }) => { console.log(endpointUrl, 'is up. Changing to given endpoint...'); });
   *
   * // Remember to handle error event to prevent unhandled promise rejection
   * hc.on("error", error => { console.error(error); });
   *
   * hc.register(chain.api.block_api.get_block, { block_num: 1 });
   * ```
   */
  public subscribe(endpointUrl: string): void {
    const subscription = this.endpointSubscription.get(endpointUrl);

    // Already subscribed
    if(subscription !== undefined)
      return;

    const listener = (data: INewUpDownEvent) => {
      if(data.endpointUrl === endpointUrl)
        this.emit(data.up ? "newup" : "newdown", { endpointUrl });
    };

    this.on("statechanged" as any, listener);

    this.endpointSubscription.set(endpointUrl, listener);
  }

  /**
   * Unsubscribes from the given endpoint
   *
   * @param {string} endpointUrl endpoint to unsubscribe from
   *
   * @see {@link subscribe}
   */
  public unsubscribe(endpointUrl: string): void {
    const subscription = this.endpointSubscription.get(endpointUrl);

    if(subscription === undefined)
      return;

    this.off("statechanged" as any, subscription);

    this.endpointSubscription.delete(endpointUrl);
  }

  /**
   * Unsubscribes all the endpoint
   *
   * @see {@link subscribe}
   */
  public unsubscribeAll(): void {
    const subscriptionKeys = this.endpointSubscription.keys();
    for(const key of subscriptionKeys)
      this.unsubscribe(key);
  }

  private pushEndpointData(data: THiveEndpointData): void {
    const results = this.endpointStats.get(data.endpointUrl);

    if (results === undefined) {
      this.endpointStats.set(data.endpointUrl, [data]);
      return;
    }

    // Do not gather more data than required
    if(results.length >= this.cachedScoredListLimit)
      results.splice(0, results.length - this.cachedScoredListLimit + 1);

    results.push(data);
  }

  private calculateCachedScored(): Array<TScoredEndpoint> {
    if (this.endpointStats.size === 0)
      return [];

    const normalizedValues = this.calculateScoresFunction([...this.endpointStats.entries()]);

    if(this.lastBest !== normalizedValues[0].endpointUrl) {
      this.emit("newbest", normalizedValues[0]);
      this.lastBest = normalizedValues[0].endpointUrl;
    }

    // Add fully down endpoints at the end with the proper score - 0
    return normalizedValues;
  }

  private async performChecks (): Promise<void> {
    if (this.nextScheduledCheck === undefined) // Already processing
      return;
    if (this.nextScheduledCheck > Date.now()) // Not time yet
      return;
    this.nextScheduledCheck = undefined;

    const start = Date.now();

    const endpoints = [...this.endpoints.values()];

    const results = await Promise.allSettled(endpoints.map(endpoint => endpoint.performCheck()));

    for (let i = 0; i < results.length; ++i) {
      const result = results[i];

      if (result.status === "rejected")
        this.emit("error", new WaxHealthCheckerError(result.reason instanceof Error ? result.reason : new Error(String(result.reason)), endpoints[i]));
    }

    this.cachedScoredList = this.calculateCachedScored();

    this.emit('data', this.cachedScoredList, this.cachedScoredListLimit);

    this.nextScheduledCheck = Date.now() + Math.max((Date.now() - start) * 2, INITIAL_CHECKER_INTERVAL_MS);
  }
}
