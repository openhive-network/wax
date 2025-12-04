export class WaxExternalSignatureProviderError extends Error {
  public code?: string;

  public constructor(message: string, cause?: Error, code?: string) {
    super(message, { cause });
    this.code = code;
  }
};

