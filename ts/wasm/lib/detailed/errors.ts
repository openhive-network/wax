import type { TAccountName } from "./hive_apps_operations/index.js";
import type { TInterceptorRequestOptions } from "./util/api_caller.js";
import type { IDetailedResponseData } from "./util/request_helper.js";
import { CxxExceptionData } from "./cxx_exception_data.js";

export class WaxError extends Error {
  constructor(message?: string, source?: Error) {
    super(message, { cause: source });
    this.name = "WaxError";
  }
}

/**
 * Raised when a transport-level error occurs (timeout, connection refused, DNS failure, etc.).
 */
export class WaxCommunicationError extends WaxError {
  constructor(message?: string, source?: Error) {
    super(message, source);
    this.name = "WaxCommunicationError";
  }
}

/**
 * Base class for C++ assertion errors raised by the Hive protocol or chain layer.
 *
 * Subclasses cover common "what went wrong" cases (invalid account name, insufficient
 * balance, invalid asset, etc.). Assertions that do not match any subclass are raised
 * as `WaxAssertionError` itself; callers can inspect `category`, `subjectType` and
 * `subject` to identify the exact assertion.
 */
export class WaxAssertionError extends WaxError {
  public readonly raw: CxxExceptionData;
  private readonly _category: string;

  constructor(raw: CxxExceptionData, category?: string) {
    const resolvedCategory = category ?? raw.category;
    super(raw.formattedMessage(resolvedCategory));
    this.raw = raw;
    this._category = resolvedCategory;
    this.name = "WaxAssertionError";
  }

  /** Origin of the assertion: `"protocol"` or `"chain"`. */
  public get category(): string { return this._category; }

  /** Kind of the value that failed validation (e.g. `"account_name"`, `"asset"`, `"balance"`). */
  public get subjectType(): string { return this.raw.subjectType; }

  /** The value that failed the assertion. */
  public get subject(): unknown { return this.raw.subject; }

  /** Additional fields from the top-level C++ stack frame. */
  public get extras(): Record<string, any> { return this.raw.extras; }

  /** Hash identifying the specific C++ assertion site. */
  public get assertHash(): string { return this.raw.assertHash; }
}

/** Raised when an assertion cannot be classified by category or subject type. */
export class WaxUnhandledAssertionError extends WaxAssertionError {
  constructor(raw: CxxExceptionData, category?: string) {
    super(raw, category);
    this.name = "WaxUnhandledAssertionError";
  }
}

/** Raised when an account name is invalid (too short, too long, bad characters, etc.). */
export class WaxInvalidAccountNameError extends WaxAssertionError {
  constructor(raw: CxxExceptionData, category?: string) {
    super(raw, category);
    this.name = "WaxInvalidAccountNameError";
  }

  /** The invalid account name, if available from the assertion data. */
  public get accountName(): string | undefined {
    return typeof this.subject === "string" ? this.subject : undefined;
  }
}

/** Raised when a permlink is invalid. */
export class WaxInvalidPermlinkError extends WaxAssertionError {
  constructor(raw: CxxExceptionData, category?: string) {
    super(raw, category);
    this.name = "WaxInvalidPermlinkError";
  }

  /** The invalid permlink, if available from the assertion data. */
  public get permlink(): string | undefined {
    return typeof this.subject === "string" ? this.subject : undefined;
  }
}

/** Raised when an asset is invalid (wrong type, zero/negative amount, bad precision, etc.). */
export class WaxInvalidAssetError extends WaxAssertionError {
  constructor(raw: CxxExceptionData, category?: string) {
    super(raw, category);
    this.name = "WaxInvalidAssetError";
  }

  /** The invalid asset value, if available from the assertion data. */
  public get asset(): unknown { return this.subject; }
}

/** Raised when a fee does not match the required value. */
export class WaxInvalidFeeError extends WaxAssertionError {
  constructor(raw: CxxExceptionData, category?: string) {
    super(raw, category);
    this.name = "WaxInvalidFeeError";
  }

  /** The invalid fee value, if available from the assertion data. */
  public get fee(): unknown { return this.subject; }
}

/** Raised when an account has insufficient balance for the requested operation. */
export class WaxInsufficientBalanceError extends WaxAssertionError {
  constructor(raw: CxxExceptionData, category?: string) {
    super(raw, category);
    this.name = "WaxInsufficientBalanceError";
  }

  /** Balance actually available at the time of the assertion. */
  public get available(): unknown { return this.subject; }

  /** Account whose balance was checked, if reported. */
  public get account(): string | undefined {
    const account = this.extras.account;
    return typeof account === "string" ? account : undefined;
  }
}

export class WaxChainApiError extends WaxError {
  constructor(
    message: string,
    public readonly request: TInterceptorRequestOptions,
    public readonly response: Partial<IDetailedResponseData<any>>,
    cause?: Error
  ) {
    super(message, cause);
  }
}

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
}
