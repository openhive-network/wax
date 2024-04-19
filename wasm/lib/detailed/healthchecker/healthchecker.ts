import EventEmitter from "events";
import { WaxError } from "../../errors.js";
import { type TChainCaller } from "../chain_api.js";
import { HiveEndpoint, type IHiveEndpoint, type INewUpDownEvent, type THiveEndpointData } from "./endpoint.js";
import { type IDetailedResponseData } from "./request_helper.js";
import { defaultCalcScores } from "./math.js";

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

  private lastBest?: string;

  private cachedScoredList: Array<IScoredEndpoint> = [];

  public get best (): string | undefined {
    return this.lastBest;
  }

  public list(): Array<IScoredEndpoint> {
    return this.cachedScoredList;
  }

  public static readonly DefaultEndpoints: Readonly<Array<string>> = [
    "api.hive.blog"
  ];

  /**
   * Creates a new HealthChecker instance.
   *
   * @param {?Readonly<Array<string>>} defaultEndpoints default endpoints for checkers. Defaults to {@link HealthChecker.DefaultEndpoints}
   *
   * @example
   * ```ts
   * const hc = new wax.HealthChecker();
   *
   * hc.on("newbest", ({ endpointUrl }) => { setEndpoint(endpointUrl); });
   * hc.on("data", (endpointsScored) => { console.log(endpointsScored); });
   *
   * hc.register(chain.api.block_api.get_block, { block_num: 1 });
   * ```
   */
  public constructor(
    public readonly defaultEndpoints: Readonly<Array<string>> = HealthChecker.DefaultEndpoints,
    private readonly calculateScoresFunction: TCalculateScoresFunction = defaultCalcScores
  ) {
    super();

    setTimeout(() => { void this.performChecks(INITIAL_CHECKER_INTERVAL_MS); }, INITIAL_CHECKER_INTERVAL_MS);

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
   * @param {?string[]} testOnEndpints explicit list of endpoints. If not provided defaults to {@link defaultEndpoints}
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
    validator?: (data: Awaited<ReturnType<TFn>>) => boolean,
    testOnEndpints?: string[]
  ): IHiveEndpoint {
    if(!("apiType" in endpointToCheck))
      throw new WaxError('Specified endpoint does not belong to the wax API interface');

    const apiType = endpointToCheck.apiType as string;

    const endpoints = (testOnEndpints === undefined || testOnEndpints.length === 0) ? this.defaultEndpoints : testOnEndpints;

    const hiveEndpointObject = new HiveEndpoint(this, this.id++, apiType, endpointToCheck?.name, endpoints, async(apiUrl: string) => {
      let timings!: IDetailedResponseData<any>;

      const returned = await (endpointToCheck as unknown as TChainCaller).withProxy(data => {
        data.url = apiUrl;
        return data;
      }, data => timings = data)(toSend);

      if(validator !== undefined)
        if(!validator(returned))
          throw new WaxError(`Validator did not pass on api: "${apiType}" using url: "${apiUrl}"`);

      return timings;
    });

    this.endpoints.set(hiveEndpointObject.id, hiveEndpointObject);

    return hiveEndpointObject;
  }

  /**
   * Unregisters the checker from the healthcheck intervals
   *
   * @param {IHiveEndpoint} api api to unregister
   * @returns {boolean} either true or false if api has been unregistered succesfully
   */
  public unregister(api: IHiveEndpoint): boolean {
    const endpoint = this.endpoints.get((api as HiveEndpoint).id);

    if(endpoint === undefined)
      return false;

    this.endpoints.delete((api as HiveEndpoint).id);

    return true;
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

    setTimeout(() => { void this.performChecks(scheduleChecksAfterMs); }, scheduleChecksAfterMs);

    this.cachedScoredList = this.calculateCachedScored();

    this.emit('data', this.cachedScoredList);
  }
}
