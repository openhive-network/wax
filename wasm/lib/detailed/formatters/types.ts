import type { WaxFormatable } from "../decorators/formatters";

export type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>;
} : T;

type DeepReadonly<T> =
    T extends (infer R)[] ? DeepReadonlyArray<R> :
    T extends Function ? T :
    T extends object ? DeepReadonlyObject<T> :
    T;

interface DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> {}

type DeepReadonlyObject<T> = {
    readonly [P in keyof T]: DeepReadonly<T[P]>;
};

export interface IWaxFormatterOptions {
  asset: {
    /**
     * Appends token name after asset amount (e.g. `1.100 HIVE`)
     *
     * @default true
     */
    appendTokenName: boolean;
  };
  /**
   * Initializes formatter class with default wax formatters
   *
   * @default true
   */
  createDefaultFormatteres: boolean;
}

export type TFormatFunction = (value: object) => (string | undefined);

/**
 * Classes implementing this interface denote that they are ready to handle tagged templates
 */
export interface IWaxFormatter {
  /**
   * Formats given text based on arguments structure
   *
   * @param {TemplateStringsArray} strings raw strings
   * @param {unknown[]} args arguments to be parsed using custom wax formatters
   *
   * @example format`Hello, ${"alice"}! My account value is ${naiObject}`
   */
  format(strings: TemplateStringsArray, ...args: unknown[]): string;

  /**
   * Options for the formatter
   */
  readonly options: DeepReadonly<IWaxFormatterOptions>;
}

export interface IWaxCustomFormatter {
  [key: string]: TFormatFunction | any;
}

export type TWaxCustomFormatterConstructor = ({
  new(options: IWaxFormatterOptions): IWaxCustomFormatter;
}) | ({
  new(): IWaxCustomFormatter;
});

/**
 * Classes implementing this interface denote that they are ready to handle tagged templates
 */
export interface IWaxExtendableFormatter extends IWaxFormatter {
  /**
   * Allows users to extend the default wax formatter using custom user-defined formatters with {@link WaxFormatable}
   *
   * @param {TWaxCustomFormatterConstructor} formatterConstructor constructable formatter object
   * @param {?Partial<IWaxFormatterOptions>} options formatter options
   * @returns {WaxFormatter} extended formatter class
   */
  extend(formatterConstructor: TWaxCustomFormatterConstructor, options?: Partial<IWaxFormatterOptions>): IWaxFormatter;
}
