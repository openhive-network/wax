import { type IHiveEndpoint } from "./detailed";

/**
 * @internal
 */
export class WaxError extends Error {
  constructor(message: string) {
    super(message);
  }
}

/**
 * @internal
 */
export class WaxChainApiError extends WaxError {
  apiError: object;

  constructor(message: string, apiError: object) {
    super(`${message}: "${JSON.stringify(apiError)}"`);
    this.apiError = apiError;
  }
}

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
