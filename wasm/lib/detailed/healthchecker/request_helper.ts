import { WaxNon_2XX_3XX_ResponseCodeError } from "./errors.js";

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
  url: string;
  method: "GET" | "POST" | string;
  data?: string;
  /**
   * @default `"text"`
   */
  responseType?: "text" | "json";
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

    const response = await fetch(config.url, { method: config.method, body: config.data });
    runningData.status = response.status;

    if(response.status < 200 || response.status > 399)
      throw new WaxNon_2XX_3XX_ResponseCodeError<T>(config, runningData);

    if(config.responseType === "json")
      runningData.response = await response.json() as T;
    else
      runningData.response = await response.text() as T;

    runningData.end = Date.now();

    return runningData as IDetailedResponseData<T>;
  }

  /**
   * Requests given resource with timings
   *
   * @param {IRequestOptions} config request data
   * @returns {IDetailedResponseData<TResponse>} data for the account retrieval
   *
   * @throws {WaxRequestHelperNetworkError} unknown network-related error occurred
   * @throws {WaxNon_2XX_3XX_ResponseCodeError} HTTP Response code is not in range 200-399 (inclusive)
   * @throws {WaxRequestHelperMaxRedirectsError} Exceeded maximum number of redirects defined in {@link IRequestOptions.maxRedirects}
   */
  public request<TResponse extends (object | string) = string>(config: IRequestOptions): Promise<IDetailedResponseData<TResponse>> {
    return this.requestHandler(config);
  }
}
