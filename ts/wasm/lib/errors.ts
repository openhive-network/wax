export class WaxError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class WaxChainApiError extends WaxError {
  apiError: object;

  constructor(message: string, apiError: object) {
    super(`${message}: "${JSON.stringify(apiError)}"`);
    this.apiError = apiError;
  }
}
