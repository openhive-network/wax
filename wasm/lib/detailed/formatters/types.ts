import type { IWaxBaseInterface } from "../../interfaces";
import type { WaxFormattable } from "../decorators/formatters";
import type { ITransactionBuilderConstructor } from "../../interfaces";
import type Long from "long";

export type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>;
} : T;

export type DeepReadonly<T> =
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
    /**
     * Formats the output amount in human-readable format based on current localization settings of the user (e.g. `100'000'000.100 HIVE`)
     *
     * @default true
     */
    formatAmount: boolean;
    /**
     * Locales to be used when formatting the amount of the asset (defaults to the currently used locale by the user)
     *
     * @default undefined
     */
    locales?: string | string[];
  };
  transaction: {
    /**
     * Displays transactiona as its id (new format) instead of an object
     *
     * @default true
     */
    displayAsId: boolean;
  };
  /**
   * Initializes formatter class with default wax formatters
   *
   * @default true
   */
  createDefaultFormatters: boolean;
}

export interface IFormatFunctionArguments<T = object> {
  /**
   * Formatter options
   *
   * @type {DeepReadonly<IWaxFormatterOptions>}
   * @readonly
   */
  readonly options: DeepReadonly<IWaxFormatterOptions>;

  /**
   * Source readonly unchanged input value for parsing raw data
   *
   * @type {DeepReadonly<T>}
   * @readonly
   */
  readonly source: DeepReadonly<T>;

  /**
   * Target formatter data that might have been previously changed by other formatters
   *
   * @type {any}
   */
  target: any;
}

/**
 * Formatter function that receives input value for the matched property and returns the formatted output
 * Remember that this function takes two arguments. The first one is for data parsing, e.g. for transactions
 * parsing using {@link ITransactionBuilderConstructor["fromApi"]}. That data should mantain immutable.
 *
 * The second argument is the target working argument which should be returned from the formatter function
 * if your options specify to ignore given formatting.
 *
 * @param {IFormatFunctionArguments} args formatter function arguments
 *
 * @returns {string | any} desired formatted output data
 *
 * @example Default formatter for transaction
 * ```typescript
 * ;@WaxFormattable({ matchProperty: "operations" })
 * public transactionFormatter(source: DeepReadonly<ApiTransaction>, target: object): string | object {
 *   if(!this.options.transaction.displayAsId)
 *     return target;
 *
 *   const { id } = this.wax.TransactionBuilder.fromApi(source);
 *
 *   return id;
 * }
 * ```
 */
export type TFormatFunction<T = object> = (args: IFormatFunctionArguments<T>) => (string | any);

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
   * @returns {string} formatted data
   *
   * @example Formatting data
   * ```typescript
   * formatter.waxify`Hello, ${"alice"}! My account value is ${naiObject}`
   * ```
   */
  waxify(strings: TemplateStringsArray, ...args: unknown[]): string;

  /**
   * Formats given data based on formatter options
   *
   * @param {I} data raw data
   *
   * @returns {R} formatted data
   *
   * @example Formatting data
   * ```typescript
   * formatter.format(naiObject);
   * ```
   */
  format<I = any, R = any>(data: I): R;

  /**
   * Options for the formatter
   */
  readonly options: DeepReadonly<IWaxFormatterOptions>;
}

export interface IWaxCustomFormatter {
  [key: string]: TFormatFunction | any;
}

export type TWaxCustomFormatterConstructor = ({
  new(wax: IWaxBaseInterface): IWaxCustomFormatter;
}) | ({
  new(): IWaxCustomFormatter;
});

/**
 * Classes implementing this interface denote that they are ready to handle tagged templates
 */
export interface IWaxExtendableFormatter extends IWaxFormatter {
  /**
   * Allows users to extend the default wax formatter using custom user-defined formatters with {@link WaxFormattable}
   *
   * @param {TWaxCustomFormatterConstructor} formatterConstructor constructable formatter object
   * @param {?Partial<IWaxFormatterOptions>} options formatter options
   * @returns {WaxFormatter} extended formatter class
   */
  extend(formatterConstructor: TWaxCustomFormatterConstructor, options?: Partial<IWaxFormatterOptions>): IWaxExtendableFormatter;

  /**
   * Allows users to extend the default wax formatter using given options
   *
   * @param {?Partial<IWaxFormatterOptions>} options formatter options
   * @returns {WaxFormatter} extended formatter class
   */
  extend(options: Partial<IWaxFormatterOptions>): IWaxExtendableFormatter;

  /**
   * Formats numbers in given format
   *
   * @param {string | number | BigInt | Long} amount number to be formatted
   * @param {number} precision the exact precision of the given number (defaults to 0)
   * @param {string | string[] | undefined} locales A string with a BCP 47 language, or an array of such locale identifiers (defaults to undefined - current locale)
   *
   * @returns {string} formatted number
   */
  formatNumber(amount: string | number | BigInt | Long, precision?: number, locales?: string | string[]): string;
}
