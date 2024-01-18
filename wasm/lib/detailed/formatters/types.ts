import type { IWaxBaseInterface } from "../../interfaces";
import type { WaxFormatable } from "../decorators/formatters";
import type { ITransactionBuilderConstructor } from "../../interfaces";

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
  createDefaultFormatteres: boolean;
}

/**
 * Formatter function that receives input value for the matched property and returns the formatted output
 * Remember that this function takes two arguments. The first one is for data parsing, e.g. for transactions
 * parsing using {@link ITransactionBuilderConstructor["fromApi"]}. That data should mantain immutable.
 *
 * The second argument is the target working argument which should be returned from the formatter function
 * if your options specify to ignore given formatting.
 *
 * @param {DeepReadonly<object>} source readonly unchanged input value for parsing raw data
 * @param {object} target formatter data that might have been previously changed by other formatters
 *
 * @returns {string | any} desired formatted output data
 *
 * @example Default formatter for transaction
 * ```typescript
 * ;@WaxFormatable({ matchProperty: "operations" })
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
export type TFormatFunction = (source: DeepReadonly<object>, target: object) => (string | any);

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
   * @example Formatting data
   * ```typescript
   * format`Hello, ${"alice"}! My account value is ${naiObject}`
   * ```
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
  new(options: IWaxFormatterOptions, wax: IWaxBaseInterface): IWaxCustomFormatter;
}) | ({
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
  extend(formatterConstructor: TWaxCustomFormatterConstructor, options?: Partial<IWaxFormatterOptions>): IWaxExtendableFormatter;

  /**
   * Allows users to extend the default wax formatter using given options
   *
   * @param {?Partial<IWaxFormatterOptions>} options formatter options
   * @returns {WaxFormatter} extended formatter class
   */
  extend(options: Partial<IWaxFormatterOptions>): IWaxExtendableFormatter;
}
