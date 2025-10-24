import { WaxError } from "../errors.js";
import { IDetailedResponseData, type IRequestOptions } from "../util/request_helper.js";
import { IHiveEndpoint } from "./endpoint.js";

export class WaxHealthCheckerError extends WaxError {
  constructor(
    cause: Error,
    public readonly apiEndpoint: IHiveEndpoint,
    public readonly apiUrl?: string
  ) {
    super(`Health checker error: ${cause.message}`, cause);
  }
}

export class WaxHealthCheckerValidatorFailedError<T extends (object | string) = string> extends WaxError {
  public constructor(
    public readonly failedReason: string,
    public readonly apiEndpoint: IHiveEndpoint,
    public readonly request: IRequestOptions,
    public readonly response: Partial<IDetailedResponseData<T>>
  ) {
    super(`Validator did not pass on api: "${request.method} ${request.endpoint + request.url}": "${failedReason}"`);
  }
}

export class WaxRequestError<T extends (object | string) = string> extends WaxError
 {
  public constructor(
    public readonly request: IRequestOptions,
    public readonly response: Partial<IDetailedResponseData<T>>,
    message?: string,
    source?: Error
  ) {
    super(message, source);
  }
}

export class WaxMalformedJsonError<T extends (object | string) = string> extends WaxRequestError<T> {
  public constructor(request: IRequestOptions, response: Partial<IDetailedResponseData<T>>) {
    super(request, response, `Received malformed JSON while requesting given resource "${request.method} ${request.endpoint + request.url}": #${response.status!}`);
  }
}

export class WaxNon_2XX_3XX_ResponseCodeError<T extends (object | string) = string> extends WaxRequestError<T> {
  public constructor(request: IRequestOptions, response: Partial<IDetailedResponseData<T>>) {
    super(request, response, `Received non 2xx-3xx http response code while requesting given resource "${request.method} ${request.endpoint + request.url}": #${response.status!}`);
  }
}

export class WaxUnknownRequestError<T extends (object | string) = string> extends WaxRequestError<T> {
  public constructor(request: IRequestOptions, response: Partial<IDetailedResponseData<T>>, cause?: Error) {
    super(request, response, `Unknown request error caught (possible network or CORS error): "${request.method} ${request.endpoint + request.url}"`, cause);
  }
}

export class WaxRequestTimeoutError<T extends (object | string) = string> extends WaxRequestError<T> {
  public constructor(request: IRequestOptions, response: Partial<IDetailedResponseData<T>>) {
    super(request, response, `Request timed out: "${request.method} ${request.endpoint + request.url}"`);
  }
}

export class WaxRequestAbortedByUser<T extends (object | string) = string> extends WaxRequestError<T> {
  public constructor(request: IRequestOptions, response: Partial<IDetailedResponseData<T>>) {
    super(request, response, `Request aborted by user action (browser stop button, closing tab, etc.): "${request.method} ${request.endpoint + request.url}"`);
  }
}
