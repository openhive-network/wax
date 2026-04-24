/**
 * Parsed C++ exception data bridged from WASM. Pure data model — not an exception.
 *
 * The underlying JSON payload uses snake_case; getters expose camelCase equivalents
 * for the derived values (category, subjectType, subject, extras). Raw snake_case
 * fields remain on the typed `stack` / `extension` members for direct inspection.
 */

export interface IStackContext {
  level: string;
  file: string;
  line: number;
  method: string;
  hostname: string;
  thread_name: string;
  timestamp?: string;
}

export interface IStackFrame {
  context: IStackContext;
  format: string;
  data: Record<string, any>;
}

export interface IExtensionData {
  assertion_expression: string;
}

export class CxxExceptionData {
  constructor(
    public readonly assertHash: string,
    public readonly code: number,
    public readonly message: string,
    public readonly name: string,
    public readonly stack: readonly IStackFrame[],
    public readonly extension: IExtensionData,
  ) {}

  /** Origin of the assertion: `"protocol"`, `"chain"`, or `"unknown"`. */
  public get category(): string {
    for (const frame of this.stack) {
      const value = frame.data.category;
      if (typeof value === "string")
        return value;
    }
    return "unknown";
  }

  /**
   * Kind of the value that failed validation (e.g. `"account_name"`, `"asset"`, `"balance"`).
   * Returns `"none"` when the top frame does not carry a subject, `"any"` when a subject is
   * present but no specific subject_type was recorded.
   */
  public get subjectType(): string {
    const extras = this.extras;
    if (!("subject" in extras))
      return "none";
    const value = extras.subject_type;
    return typeof value === "string" ? value : "any";
  }

  /** The value that failed the assertion (e.g. the invalid account name). */
  public get subject(): unknown {
    return this.stack.length > 0 ? this.stack[0].data.subject : undefined;
  }

  /** Additional fields from the top-level C++ stack frame. */
  public get extras(): Record<string, any> {
    return this.stack.length > 0 ? this.stack[0].data : {};
  }

  public formattedMessage(): string {
    let msg = this.combineMessage();
    if (msg.length === 0)
      msg = `${this.message}: ${this.extension.assertion_expression}`;

    const categoryTitle = this.category.length > 0
      ? this.category[0].toUpperCase() + this.category.slice(1)
      : this.category;
    let out = `[${categoryTitle} Error] ${msg}`;

    const context = this.stack.length > 0 ? this.stack[0].data.context : undefined;
    if (context !== undefined && context !== null)
      out += ` (${context})`;

    return out;
  }

  public toString(): string {
    return this.formattedMessage();
  }

  private combineMessage(): string {
    if (this.stack.length === 0)
      return "";
    const fmt = this.stack[0].format;
    const data = this.stack[0].data;
    try {
      return interpolate(fmt, data).trim();
    } catch {
      return fmt.trim();
    }
  }
}

/**
 * Replace `${key}` placeholders in `fmt` with values from `data`.
 * Missing keys leave the placeholder untouched (Python fallback returns the raw format;
 * here we keep missing placeholders visible for diagnostic value).
 */
function interpolate(fmt: string, data: Record<string, any>): string {
  return fmt.replace(/\$\{([^}]+)\}/g, (match, key: string) => {
    if (!(key in data))
      return match;
    const value = data[key];
    return value === null || value === undefined ? match : String(value);
  });
}

/** Parse raw exception data (JSON string or already-parsed object) into CxxExceptionData. */
export function parseCxxExceptionData(raw: string | Record<string, any>): CxxExceptionData {
  const obj: Record<string, any> = typeof raw === "string" ? JSON.parse(raw) : raw;

  if (typeof obj.assert_hash !== "string")
    throw new Error("CxxExceptionData: missing or invalid 'assert_hash'");
  if (typeof obj.code !== "number")
    throw new Error("CxxExceptionData: missing or invalid 'code'");
  if (typeof obj.message !== "string")
    throw new Error("CxxExceptionData: missing or invalid 'message'");
  if (typeof obj.name !== "string")
    throw new Error("CxxExceptionData: missing or invalid 'name'");
  if (!Array.isArray(obj.stack))
    throw new Error("CxxExceptionData: missing or invalid 'stack'");
  if (typeof obj.extension !== "object" || obj.extension === null)
    throw new Error("CxxExceptionData: missing or invalid 'extension'");

  return new CxxExceptionData(
    obj.assert_hash,
    obj.code,
    obj.message,
    obj.name,
    obj.stack as IStackFrame[],
    obj.extension as IExtensionData,
  );
}
