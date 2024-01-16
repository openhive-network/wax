import type { WaxFormatable } from "../decorators/formatters";

export interface IWaxFormatterOptions {
  asset?: {
    displaySymbol?: boolean;
  };
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
   * @returns {WaxFormatter} extended formatter class
   */
  extend(formatterConstructor: TWaxCustomFormatterConstructor): IWaxFormatter;
}
