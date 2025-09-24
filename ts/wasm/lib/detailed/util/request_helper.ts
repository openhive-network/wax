import { WaxNon_2XX_3XX_ResponseCodeError, WaxRequestAbortedByUser, WaxRequestTimeoutError, WaxUnknownRequestError } from "../healthchecker/errors.js";

export interface ISingleJitterData {
  loaded: number;
  timestamp: number;
}

export interface IDetailedResponseData<T extends (object | string) = string> {
  start: number;
  startUpload?: number;
  jitterUploadData?: Array<ISingleJitterData>;
  endUpload?: number;
  jitterDownloadData?: Array<ISingleJitterData>;
  endReceive?: number;
  end: number;
  status: number;
  response: T;
}

export interface IRequestOptions {
  endpoint: string;
  url: string;
  method: "GET" | "POST" | string;
  timeout: number;
  data?: string | object;
  /**
   * @default `"text"`
   */
  responseType?: "text" | "json";
  /**
   * X-Wax-Api-Caller header value for the request
   */
  waxApiCaller?: string;
}

export class RequestHelper {
  private async requestHandler<T extends (object | string)>(config: IRequestOptions): Promise<IDetailedResponseData<T>> {
    const runningData: Partial<IDetailedResponseData<T>> = {
      start: Date.now(),
      startUpload: undefined,
      jitterUploadData: [],
      endUpload: undefined,
      jitterDownloadData: [],
      endReceive: undefined,
      end: undefined,
      status: undefined,
      response: undefined
    };

    try {
      const finalUrl = config.endpoint + config.url;

      const headers = new Headers();

      if (typeof config.data !== "undefined")
        headers.set('content-type', 'application/json');

      if (config.waxApiCaller)
        headers.set('x-wax-api-caller', config.waxApiCaller);

      const response = await fetch(finalUrl, {
        headers: headers.has('content-type') || headers.has('user-agent') || headers.has('x-wax-api-caller') ? headers : undefined,
        method: config.method,
        signal: config.timeout === 0 ? undefined : AbortSignal.timeout(config.timeout),
        body: typeof config.data === "object" ? JSON.stringify(config.data) : config.data
      });

      runningData.status = response.status;

      if(response.status < 200 || response.status > 399)
        throw new WaxNon_2XX_3XX_ResponseCodeError<T>(config, runningData);

      if(config.responseType === "json")
        runningData.response = await response.json() as T;
      else
        runningData.response = await response.text() as T;

      runningData.end = Date.now();

      return runningData as IDetailedResponseData<T>;
    } catch (error) {
      if (typeof error !== "object" || !(error instanceof Error))
        throw new WaxUnknownRequestError<T>(config, runningData);

      if (error.name === "TimeoutError")
        throw new WaxRequestTimeoutError<T>(config, runningData);
      else if (error.name === "AbortError")
        throw new WaxRequestAbortedByUser<T>(config, runningData);

      throw new WaxUnknownRequestError<T>(config, runningData, error);
    }
  }

  /**
   * Requests given resource with timings
   *
   * @param {IRequestOptions} config request data
   * @returns {IDetailedResponseData<TResponse>} data for the account retrieval
   *
   * @throws {WaxNon_2XX_3XX_ResponseCodeError} HTTP Response code is not in range 200-399 (inclusive)
   */
  public async request<TResponse extends (object | string) = string>(config: IRequestOptions): Promise<IDetailedResponseData<TResponse>> {
    return await this.requestHandler(config);
  }
}
