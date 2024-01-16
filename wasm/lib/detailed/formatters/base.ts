import { IWaxFormatter, IWaxFormatterOptions } from "./types";

export const DEFAULT_FORMATTER_OPTIONS: IWaxFormatterOptions = {
  asset: {
    displaySymbol: true
  }
};

export abstract class WaxFormatterBase implements IWaxFormatter {
  public readonly options: Readonly<IWaxFormatterOptions> = {};

  public constructor(options?: IWaxFormatterOptions) {
    for(const prop in DEFAULT_FORMATTER_OPTIONS)
      if(typeof DEFAULT_FORMATTER_OPTIONS[prop] === "object")
        this.options[prop] = { ...DEFAULT_FORMATTER_OPTIONS[prop], ...(options?.[prop] ?? {}) };
      else
        this.options[prop] = options?.[prop] ?? DEFAULT_FORMATTER_OPTIONS[prop];
  }

  public abstract handleProperty(target: object, property: string): string | undefined;

  private formatParser(value: unknown): string {
    if(typeof value !== "object")
      return String(value);

    for(const key in value) {
      const result = this.handleProperty(value, key);

      if(typeof result === "string")
        return result;
    }

    return JSON.stringify(value);
  }

  public format(strings: TemplateStringsArray, ...args: unknown[]): string {
    return strings.reduce((prev: string, curr: string, index: number) => {
      return prev + curr + (index in args ? this.formatParser(args[index]) : "");
    }, "");
  }
}
