import { WaxError } from "../../errors.js";
import { IDetailedResponseData, type IRequestOptions } from "../util/request_helper.js";
import { IHiveEndpoint } from "./endpoint.js";

export class WaxHealthCheckerEndpointUrlError extends WaxError {
  constructor(
    public readonly originator: Error,
    public readonly endpointUrl: string
  ) {
    super(originator.message);
  }
}

export class WaxHealthCheckerError extends WaxError {
  constructor(
    public readonly originator: Error,
    public readonly apiEndpoint: IHiveEndpoint
  ) {
    super(`Health checker error: ${originator.message}`);
  }
}

export class WaxHealthCheckerValidatorFailedError<T extends (object | string) = string> extends WaxError {
  public constructor(public readonly request: IRequestOptions, public readonly response: Partial<IDetailedResponseData<T>>) {
    super(`Validator did not pass on api: "${request.method} ${request.endpoint + request.url}"`);
  }
}

export class WaxRequestError extends WaxError {}

export class WaxNon_2XX_3XX_ResponseCodeError<T extends (object | string) = string> extends WaxRequestError {
  public constructor(public readonly request: IRequestOptions, public readonly response: Partial<IDetailedResponseData<T>>) {
    super(`Received non 2xx-3xx http response code while requesting given resource "${request.method} ${request.endpoint + request.url}": #${response.status!}`);
  }
}

export class WaxUnknownRequestError<T extends (object | string) = string> extends WaxRequestError {
  public constructor(public readonly request: IRequestOptions, public readonly response: Partial<IDetailedResponseData<T>>) {
    super(`Unknown request error caught (possible network or CORS error): "${request.method} ${request.endpoint + request.url}"`);
  }
}

export class WaxRequestTimeoutError<T extends (object | string) = string> extends WaxRequestError {
  public constructor(public readonly request: IRequestOptions, public readonly response: Partial<IDetailedResponseData<T>>) {
    super(`Request timed out: "${request.method} ${request.endpoint + request.url}"`);
  }
}

export class WaxRequestAbortedByUser<T extends (object | string) = string> extends WaxRequestError {
  public constructor(public readonly request: IRequestOptions, public readonly response: Partial<IDetailedResponseData<T>>) {
    super(`Request aborted by user action (browser stop button, closing tab, etc.): "${request.method} ${request.endpoint + request.url}"`);
  }
}
