import { WaxError } from "../../errors.js";
import { IDetailedResponseData, type IRequestOptions } from "./request_helper.js";

/**
 * @internal
 */
export class WaxNon_2XX_3XX_ResponseCodeError<T extends (object | string) = string> extends WaxError {
  public constructor(
    public readonly request: IRequestOptions,
    public readonly response: Partial<IDetailedResponseData<T>>
  ) {
    super(`Received non 2xx-3xx http response code while requesting given resource "${request.method} ${request.url}"`);
  }
}
