import EventEmitter from "events";
import { WaxError } from "../../errors.js";
import { type WaxChainCommonApiCaller } from "../util/api_caller.js";
import { HiveEndpoint, type IHiveEndpoint, type INewUpDownEvent, type THiveEndpointData } from "./endpoint.js";
import { type IDetailedResponseData, type IRequestOptions } from "../util/request_helper.js";
import { defaultCalcScores } from "./math.js";
import { EChainApiType } from "../chain_api.js";

const INITIAL_CHECKER_INTERVAL_MS = 10_000;

const GATHER_STATS_FROM_PREVIOUS_CALLS_AMOUNT = 10;

export interface IScoredEndpoint {
  endpointUrl: string;
  /** 0 - 1 */
  score: number;
  down: boolean;
};

export type TCalculateScoresFunction = (data: Readonly<Array<[string, Array<THiveEndpointData>]>>) => Array<IScoredEndpoint>;

export class HealthChecker extends EventEmitter {
  private id: number = 0;

  private readonly endpointSubscription: Map<string, (data: INewUpDownEvent) => void> = new Map();

  private readonly endpoints: Map<number, HiveEndpoint> = new Map();
  private readonly endpointStats: Map<string, Array<THiveEndpointData>> = new Map();

  private isRunning = false;
  private timeoutInterval?: NodeJS.Timeout;

  private lastBest?: string;

  private cachedScoredList: Array<IScoredEndpoint> = [];

  public get best (): string | undefined {
    return this.lastBest;
  }

  public list(): Array<IScoredEndpoint> {
    return this.cachedScoredList;
  }

  public static readonly DefaultJsonRpcEndpoints: Readonly<Array<string>> = [
    "https://api.hive.blog"
  ];

  public static readonly DefaultRestApiEndpoints: Readonly<Array<string>> = [
    "https://api.syncad.com"
  ];

  private async ensureRunning(): Promise<void> {
    if (this.isRunning)
      return;

    await this.stop(); // Ensure that we are not running multiple intervals - race condition prevention
    if (this.timeoutInterval === undefined) // Ensure no race condition with the stop function when multiple threads call ensureRunning function
      this.timeoutInterval = setTimeout(() => { void this.performChecks(INITIAL_CHECKER_INTERVAL_MS); }, INITIAL_CHECKER_INTERVAL_MS);
    this.isRunning = true;
  }

  private async stop(): Promise<void> {
    if (!this.isRunning)
      return;

    this.isRunning = false;

    // If no further actions scheduled and there is no processing involved, we can stop immediately
    if (this.timeoutInterval !== undefined) {
      clearTimeout(this.timeoutInterval);

      this.timeoutInterval = undefined;
    } else // Otherwise we need to wait for the last processing to finish
      await new Promise(resolve => { this.once('stopped' as any, resolve); });
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
   * await hc.register(chain.api.block_api.get_block, { block_num: 1 });
   * ```
   */
  public constructor(
    public readonly defaultEndpoints: Readonly<Array<string>> | undefined = undefined,
    private readonly calculateScoresFunction: TCalculateScoresFunction = defaultCalcScores) {
    super();

    this.on('stats', (data: THiveEndpointData) => {
      this.pushEndpointData(data);
    });
  }

  /**
   * Registers the checker to the healthcheck intervals
   *
   * @param {TFn} endpointToCheck Function to check (e.g. `chain.api.block_api.get_block`)
   * @param {Parameters<TFn>[0]} toSend param to {@link endpointToCheck}
   * @param {(data: Awaited<ReturnType<TFn>>) => boolean} validator optional validator for fields. Return true to pass validation and false to fail
   * @param {?string[]} testOnEndpoints explicit list of endpoints. If not provided defaults to {@link defaultEndpoints}
   *
   * @returns {IHiveEndpoint} hive endpoint to check
   *
   * @example
   * ```ts
   * const hc = new wax.HealthChecker();
   *
   * await hc.register(chain.api.block_api.get_block, { block_num: 1 }, data => data.block?.previous === "0000000000000000000000000000000000000000", ["api.openhive.network"]);
   * ```
   */
  public async register<TFn extends (...args: any) => any>(
    endpointToCheck: TFn,
    toSend: Parameters<TFn>[0],
    validator?: (data: Awaited<ReturnType<TFn>>) => boolean,
    testOnEndpoints?: string[]
  ): Promise<IHiveEndpoint> {
    if(!("withProxy" in endpointToCheck) || !("paths" in endpointToCheck) || !("apiCallerId" in endpointToCheck))
      throw new WaxError('Specified endpoint does not belong to the wax API interface');

    const apiType = endpointToCheck.apiCallerId as EChainApiType;
    const paths = endpointToCheck.paths as string[];

    const endpoints = (testOnEndpoints === undefined || testOnEndpoints.length === 0) ? (this.defaultEndpoints === undefined ?
        (apiType === EChainApiType.JSON_RPC ? HealthChecker.DefaultJsonRpcEndpoints : HealthChecker.DefaultRestApiEndpoints)
      : this.defaultEndpoints
    ) : testOnEndpoints;

    const hiveEndpointObject = new HiveEndpoint(this, this.id++, apiType, paths, endpoints, async (endpointToTest: string) => {
      let timings!: IDetailedResponseData<any>;

      const requestInterceptor = (data: IRequestOptions): IRequestOptions => {
        data.endpoint = endpointToTest;
        return data;
      };

      const responseInterceptor = (data: IDetailedResponseData<any>): IDetailedResponseData<any> => {
        timings = data;
        return data;
      };

      const returned = await (endpointToCheck as unknown as WaxChainCommonApiCaller).withProxy(requestInterceptor, responseInterceptor)(toSend);

      if(validator !== undefined)
        if(!validator(returned))
          throw new WaxError(`Validator did not pass on api '${apiType}': "${paths.join('/')}" using endpoint: "${endpointToTest}"`);

      return timings;
    });

    this.endpoints.set(hiveEndpointObject.id, hiveEndpointObject);

    await this.ensureRunning();

    return hiveEndpointObject;
  }

  /**
   * Unregisters the checker from the healthcheck intervals
   *
   * @param {IHiveEndpoint} api api to unregister
   * @returns {boolean} either true or false if api has been unregistered succesfully
   */
  public async unregister(api: IHiveEndpoint): Promise<boolean> {
    const endpoint = this.endpoints.get((api as HiveEndpoint).id);

    if(endpoint === undefined)
      return false;

    this.endpoints.delete((api as HiveEndpoint).id);

    if (this.endpoints.size === 0)
      await this.stop();

    return true;
  }

  /**
   * Unregisters the checker from all of the healthcheck intervals
   */
  public async unregisterAll(): Promise<void> {
    const registrationKeys = this.endpoints.keys();
    for(const key of registrationKeys)
      await this.unregister({ id: key } as HiveEndpoint);
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
   * await hc.register(chain.api.block_api.get_block, { block_num: 1 });
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

    this.on("statechanged", listener);

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

    this.off("statechanged", subscription);

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
    if(results.length === GATHER_STATS_FROM_PREVIOUS_CALLS_AMOUNT)
      results.splice(0, 1);

    results.push(data);
  }

  private calculateCachedScored(): Array<IScoredEndpoint> {
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

  private async performChecks (previousTimeoutMs: number): Promise<void> {
    let scheduleChecksAfterMs = previousTimeoutMs;

    try {
      const start = Date.now();

      await Promise.allSettled([...this.endpoints.values()].map(endpoint => endpoint.performCheck()));

      scheduleChecksAfterMs = Math.max((Date.now() - start) * 2, INITIAL_CHECKER_INTERVAL_MS);
    } catch(error) { // function performCheck should not throw, but we should handle all kind of unexpected errors especially that performChecks function is called by the interval
      this.emit("error", error);
    }

    if (this.isRunning)
      this.timeoutInterval = setTimeout(() => { void this.performChecks(scheduleChecksAfterMs); }, scheduleChecksAfterMs);
    else
      this.emit('stopped');

    this.cachedScoredList = this.calculateCachedScored();

    this.emit('data', this.cachedScoredList);
  }
}
