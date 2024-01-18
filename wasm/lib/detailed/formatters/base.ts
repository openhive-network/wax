import { DeepPartial, IWaxFormatter, IWaxFormatterOptions } from "./types";

export const DEFAULT_FORMATTER_OPTIONS: IWaxFormatterOptions = {
  asset: {
    appendTokenName: true
  },
  transaction: {
    displayAsId: true
  },
  createDefaultFormatteres: true
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

  public abstract handleProperty(source: object, target: object, property: string): string | undefined;

  private traverseTemplateValue(source: object, target: object, key: string | number, value: any): void {
    if(typeof value !== "object")
      return;

    for (const childKey in value) {
      this.traverseTemplateValue(source[key], value, childKey, value[childKey]);

      const result = this.handleProperty(source[key], value, childKey);

      if(typeof result !== "undefined")
        target[key] = result;
    }
  }

  private formatParser(value: unknown): string {
    if(typeof value !== "object")
      return String(value);

    const source = structuredClone(value) as object;

    for(const key in value) {
      this.traverseTemplateValue(source, value, key, value[key]);

      const result = this.handleProperty(source, value, key);

      if(typeof result === "object")
        return JSON.stringify(result);
      else if(typeof result !== "undefined")
        return String(result);
    }

    return JSON.stringify(value);
  }

  public format(strings: TemplateStringsArray, ...args: unknown[]): string {
    return strings.reduce((prev: string, curr: string, index: number) => {
      return prev + curr + (index in args ? this.formatParser(args[index]) : "");
    }, "");
  }
}
