import type { TAccountName } from "./hive_apps_operations/index.js";

export class WaxError extends Error
 {
  constructor(message?: string, source?: Error) {
    super(message, { cause: source });
    this.name = "WaxError";
  }
 }

export class WaxAssertionError extends WaxError {
  assertionHash: string;

  constructor(assertionHash: string, sourceJson: string) {
    super(sourceJson);
    this.assertionHash = assertionHash;
    this.name = "WaxAssertionError";
  }
};

export class WaxProtocolAssertionError extends WaxAssertionError {
  constructor(assertionHash: string, sourceJson: string) {
    super(assertionHash, sourceJson);
    this.name = "WaxProtocolAssertionError";
  }
};

export class WaxChainAssertionError extends WaxAssertionError {
  constructor(assertionHash: string, sourceJson: string) {
    super(assertionHash, sourceJson);
    this.name = "WaxChainAssertionError";
  }
};

export class WaxChainApiError extends WaxError {
  apiError: object;

  constructor(message: string, apiError: object) {
    super(`${message}: "${JSON.stringify(apiError)}"`);
    this.apiError = apiError;
  }
};

/**
 * Thrown when a private key leak is detected in the transaction.
 * To avoid additional privacy leaks in the messaging, reported error contains only a **public key** matching to detected private one like
 * also the account name and authority role related to such key.
 */
export class WaxPrivateKeyLeakDetectedException extends WaxError {
  constructor(msg: string, public readonly matchingPublicKey: string, public readonly account: TAccountName,
    public readonly authorityRole: string) {
    super(msg);
  }
};
