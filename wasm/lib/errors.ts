/**
 * @internal
 */
export class WaxError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WaxError";
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
    this.name = "WaxChainApiError";
  }
}
