import { DeepPartial, DeepReadonly, IWaxFormatter, IWaxFormatterOptions } from "./types";

export const DEFAULT_FORMATTER_OPTIONS: IWaxFormatterOptions = {
  asset: {
    displayAsNai: false,
    appendTokenName: true,
    formatAmount: true
  },
  transaction: {
    displayAsId: true
  },
  createDefaultFormatters: true
};

export abstract class WaxFormatterBase implements IWaxFormatter {
  public readonly options: IWaxFormatterOptions = {} as IWaxFormatterOptions;

  public constructor(options?: DeepPartial<IWaxFormatterOptions>) {
    for(const prop in DEFAULT_FORMATTER_OPTIONS)
      if(typeof DEFAULT_FORMATTER_OPTIONS[prop] === "object")
        this.options[prop] = { ...DEFAULT_FORMATTER_OPTIONS[prop], ...(options?.[prop] ?? {}) };
      else
        this.options[prop] = options?.[prop] ?? DEFAULT_FORMATTER_OPTIONS[prop];
  }

  protected abstract handleProperty(source: object, target: any, property: string): any | undefined;

  private traverseTemplateValue(source: DeepReadonly<object>, target: object, key: string | number): void {
    if(typeof source[key] !== "object")
      return;

    const originalTarget = target[key];

    for (const childKey in source[key]) {
      this.traverseTemplateValue(source[key], originalTarget, childKey);

      const result = this.handleProperty(source[key], originalTarget, childKey);

      if(typeof target === "object" && typeof result !== "undefined" && Object.isExtensible(target[key]))
        target[key] = result;
    }
  }

  private rawDataParser(value: unknown): any {
    if(typeof value !== "object" || value === null)
      return value;

    const target = structuredClone(value) as object;

    for(const key in value) {
      this.traverseTemplateValue(value, target, key);

      const result = this.handleProperty(value, target, key);

      if(typeof result !== "undefined")
        return result;
    }

    return target;
  }

  private formatParser(value: unknown): string {
    const result = this.rawDataParser(value);

    if(typeof result === "object")
      return JSON.stringify(result);

    return String(result);
  }

  public format<I = any, R = any>(data: I): R {
    return this.rawDataParser(data);
  }

  public waxify(strings: TemplateStringsArray, ...args: unknown[]): string {
    return strings.reduce((prev: string, curr: string, index: number) => {
      return prev + curr + (index in args ? this.formatParser(args[index]) : "");
    }, "");
  }
}
