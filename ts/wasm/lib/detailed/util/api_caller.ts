import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";
import { WaxChainApiError } from "../../../lib/errors";
import { type TWaxRestApiRequest } from "../../../lib/interfaces";
import { extractBracedStrings } from "../rest-api/utils.js";
import { objectToQueryString } from "./query_string.js";
import { type IDetailedResponseData, type IRequestOptions, RequestHelper } from "./request_helper.js";

export type TInterceptorRequestOptions = IRequestOptions & { paths: string[]; apiCallerId: string };

export type TRequestInterceptor = (data: TInterceptorRequestOptions) => IRequestOptions;
export type TResponseInterceptor = (data: IDetailedResponseData<any>) => IDetailedResponseData<any>;

/**
 * Helper base type to describe common parts of WaxChain API callers
 */
export type WaxChainCommonApiCaller = ((params: object) => Promise<any>) & {
  apiCallerId: string;
  paths: string[];
  realPaths: string[];
  lastMethod: string;
  config: TWaxRestApiRequest<any, any> | undefined;
  withProxy: (requestInterceptor: TRequestInterceptor, responseInterceptor: TResponseInterceptor) => (params: object) => Promise<any>;
};

export type TRestChainCaller = ((params: object) => Promise<any>) & {
  _target: WaxChainCommonApiCaller;
};

export class ApiCaller extends RequestHelper {
  public requestInterceptor: TRequestInterceptor = (data: TInterceptorRequestOptions) => data;
  public responseInterceptor: TResponseInterceptor = (data: IDetailedResponseData<any>) => data;

  /**
   * @param id Unique identifier of the API caller - may be used in interceptors for originator identification
   * @param defaultEndpointUrl Prefix URL for all API calls
   * @param localTypes Default set of API types
   * @param defaultMethod Default method to be called. Default is 'GET'
   * @param changeEndpointUrlFn Method called upon new endpoint URL to be set
   * @param staticRequestInterceptor Static request interceptor that is always called upon API requests
   *  and cannot be changed by the user by any other methods. Note: This interceptor takes precedence over {@link requestInterceptor}
   *  If you wish to set request interceptor outside the constructor, use {@link requestInterceptor} instead.
   * @param staticResponseInterceptor Static response interceptor that is always called upon API requests
   *  and cannot be changed by the user by any other methods. Note: This interceptor takes precedence over {@link responseInterceptor}
   *  If you wish to set response interceptor outside the constructor, use {@link responseInterceptor} instead.
   */
  public constructor(
    public readonly id: string,
    public defaultEndpointUrl: string,
    public readonly localTypes: Record<string, any> = {},
    public readonly defaultMethod: string = 'GET',
    private readonly changeEndpointUrlFn: (path: string[], newValue: string | undefined, found: boolean) => boolean = () => true,
    private readonly staticRequestInterceptor: (data: TInterceptorRequestOptions) => TInterceptorRequestOptions = (data: TInterceptorRequestOptions) => data,
    private readonly staticResponseInterceptor: TResponseInterceptor = (data: IDetailedResponseData<any>) => data
  ) {
    super();
  }

  private static readonly EndpointUrlKey = "endpointUrl";
  private static readonly TargetKey = "_target";

  public setEndpointUrlForPath(path: string[], newValue: string | undefined, found = false): boolean {
    const obj = this.getRestTypeFromPath(path);

    found ||= this.changeEndpointUrlFn(path, newValue, found);

    return Boolean(obj[ApiCaller.EndpointUrlKey] = newValue ?? this.defaultEndpointUrl);
  }

  private getEndpointUrlForRestApi(path: string[]): string {
    let foundApi: string | undefined;

    // Do not use getRestTypeFromPath as we need to extract any parent-level ApiCaller.EndpointUrlKey-s
    let currObj: Record<string, any> = this.localTypes;
    if (currObj[ApiCaller.EndpointUrlKey] !== undefined)
      foundApi = currObj[ApiCaller.EndpointUrlKey];
    for (const appendPath of path) {
      if (currObj[appendPath as keyof typeof currObj] === undefined)
        currObj[appendPath as keyof typeof currObj] = {}; // Create a blank object, so configuration such as endpointUrl can be set

      currObj = currObj[appendPath as keyof typeof currObj];
      if (currObj[ApiCaller.EndpointUrlKey] !== undefined)
        foundApi = currObj[ApiCaller.EndpointUrlKey];
    }

    return foundApi ?? this.defaultEndpointUrl;
  }
  private getRestTypeFromPath(path: string[]): object {
    let currObj: Record<string, any> = this.localTypes;
    for (const appendPath of path) {
      if (currObj[appendPath as keyof typeof currObj] === undefined)
        currObj[appendPath as keyof typeof currObj] = {}; // Create a blank object, so configuration such as endpointUrl can be set

      currObj = currObj[appendPath as keyof typeof currObj];
    }

    return currObj;
  }

  public createApiCaller(): TRestChainCaller {
    const that = this;
    const callFn = async function(params: object | undefined, requestInterceptor: TRequestInterceptor = that.requestInterceptor, responseInterceptor: TResponseInterceptor = that.responseInterceptor): Promise<any> {
      // Helper function to determine if we have to convert plain object to the instance of the given request or not
      const isPlainObj = (value: unknown) => !!value && Object.getPrototypeOf(value) === Object.prototype;

      if(typeof callFn.config === 'object' && callFn.config.params !== undefined && typeof params === "object")
        await validateOrReject(isPlainObj(params) ? plainToInstance(callFn.config.params, params) : params);

      let path = '/' + callFn.paths.filter(node => node.length).join('/');
      const allToReplace = extractBracedStrings(path);

      const finalizedRequestData = params === undefined ? undefined : structuredClone(params);

      if (typeof params === "object")
        for(const toReplace of allToReplace) {
          if (toReplace in (finalizedRequestData as object))
            path = path.replace(`{${toReplace}}`, String(params[toReplace as keyof typeof finalizedRequestData]));
          else
            throw new Error('No ' + toReplace + ' in request');

          delete (finalizedRequestData as object)[toReplace as keyof typeof finalizedRequestData];
        }

      const method = callFn.lastMethod;
      const isQueryStringOnlyRequest = method === 'GET' || method === 'DELETE';

      let queryString = '';
      if (isQueryStringOnlyRequest && finalizedRequestData !== undefined && Object.keys(finalizedRequestData).length > 0)
        queryString = '?' + objectToQueryString(finalizedRequestData as Record<string, any>);

      const body = isQueryStringOnlyRequest ? undefined : finalizedRequestData;

      const endpoint = that.getEndpointUrlForRestApi(callFn.realPaths);

      const url = path + queryString;

      const data = that.staticResponseInterceptor(responseInterceptor(await that.request<object>(requestInterceptor(that.staticRequestInterceptor({
        method,
        responseType: 'json',
        endpoint,
        url,
        data: body,
        paths: callFn.realPaths,
        apiCallerId: that.id
      }))))) as IDetailedResponseData<object>;
      let result: any = data.response;

      if(typeof callFn.config === 'object') {
        if(result === undefined && callFn.config.result !== undefined)
          throw new WaxChainApiError('No result found in the Hive API response', data);

        if (callFn.config.result !== undefined && callFn.config.result !== Number && callFn.config.result !== Boolean && callFn.config.result !== String) {
          // Parse any other result type which is a valid validator constructor
          result = plainToInstance(callFn.config.result, result) as object;

          if (Array.isArray(result))
            for(const node of result)
              await validateOrReject(node);
          else
            await validateOrReject(result);
        }
      }

      callFn.paths = [] as string[];
      callFn.realPaths = [] as string[];
      callFn.lastMethod = that.defaultMethod;
      callFn.config = undefined;

      return result;
    };
    callFn.apiCallerId = this.id;
    callFn.paths = [] as string[];
    callFn.realPaths = [] as string[];
    callFn.lastMethod = this.defaultMethod;
    callFn.config = undefined as TWaxRestApiRequest<any, any> | undefined;
    callFn.withProxy = (requestInterceptor: TRequestInterceptor, responseInterceptor: TResponseInterceptor) => (params: object) => callFn(params, requestInterceptor, responseInterceptor);

    const proxiedFunction = new Proxy(callFn, {
      get: (_target: any, property: string, _receiver: any): TRestChainCaller | WaxChainCommonApiCaller | string => {
        if(property === ApiCaller.EndpointUrlKey) {
          const restApiUrl = this.getEndpointUrlForRestApi(callFn.realPaths);

          callFn.paths = [] as string[];
          callFn.realPaths = [] as string[];
          callFn.lastMethod = this.defaultMethod;
          callFn.config = undefined;

          return restApiUrl;
        }

        if (property === ApiCaller.TargetKey)
          return callFn;

        const currObj: Record<string, any> = this.getRestTypeFromPath(callFn.realPaths);

        callFn.config = currObj[property];

        if (callFn.config?.urlPath === undefined)
          callFn.paths.push(property);
        else
          callFn.paths.push(callFn.config.urlPath);

        callFn.realPaths.push(property);

        if (callFn.config?.method !== undefined) {
          callFn.lastMethod = callFn.config.method;
        }

        return proxiedFunction;
      },
      set: (_target: any, property: string, newValue: any, _receiver: any) => {
        if(property === ApiCaller.EndpointUrlKey) {
          const setValue = this.setEndpointUrlForPath(callFn.realPaths, newValue);

          callFn.realPaths = [] as string[];
          callFn.paths = [] as string[];
          callFn.lastMethod = this.defaultMethod;
          callFn.config = undefined;

          return setValue;
        }


        return false;
      },
      apply: (_target: any, _thisArg: any, argumentsList: [object]) => {
        return callFn(...argumentsList);
      }
    });

    return proxiedFunction;
  }
}
