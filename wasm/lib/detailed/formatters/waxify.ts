import type { TWaxCustomFormatterConstructor, IWaxFormatterOptions, TFormatFunction, IWaxExtendableFormatter, DeepPartial } from "./types";
import type { IWaxBaseInterface } from "../../interfaces";

import { WaxFormatterBase } from "./base";
import { DefaultFormatters } from "./default_formatters";
import Long from "long";

export interface IMatchersData {
  matchValues: Map<string, TFormatFunction>;
  defaultFormatter?: TFormatFunction;
}

export class WaxFormatter extends WaxFormatterBase implements IWaxExtendableFormatter {
  private matchers: Map<string, IMatchersData> = new Map();

  private constructor(
    protected readonly wax: IWaxBaseInterface,
    options?: DeepPartial<IWaxFormatterOptions>
  ) {
    super(options);
  }

  public static create(
    wax: IWaxBaseInterface,
    options?: DeepPartial<IWaxFormatterOptions>
  ) {
    const instance = new WaxFormatter(wax, options);

    if(instance.options?.createDefaultFormatters)
      return instance.extend(DefaultFormatters, options);

    return instance;
  }

  private cloneMatchersTo(instance: WaxFormatter): void {
    for(const [ key, value ] of this.matchers)
      instance.matchers.set(key, {
        defaultFormatter: value.defaultFormatter,
        matchValues: new Map([ ...value.matchValues, ...(instance.matchers.get(key)?.matchValues ?? []) ])
      })
  }

  // Similar thing could be achieved using Intl.NumberFormat interface only, but it does not allow dynamic precision and precision larger than 20, which HIVE may provide in the SMTs
  public formatNumber(amount: string | number | BigInt | Long, precision?: number, locales?: string | string[]): string {
    if(Number.isNaN(amount))
      amount = 0;

    // Every possible type of the amount variable has a toString() method which assures immutability of our numeric value (with fraction part)
    amount = amount.toString();
    const isFloat = amount.indexOf(".");
    const floatEnd = isFloat === -1 ? amount.length : isFloat;

    // Amount can be larger than the MAX_SAFE_INTEGER, so we have to format BigInt to parts, remove the fraction part from the amount and then join all of the parts together
    // (Even though we are removing the fraction part from the value, we are setting minimumFractionDigits option to 1 to extract the decimal character)
    const formatted = Intl.NumberFormat(locales as string, { minimumFractionDigits: 1 }).formatToParts(BigInt(amount.slice(0, floatEnd)));
    const decimalIndex = formatted.findIndex(pred => pred.type === "decimal");
    // Join all of the parts of the formatted BigInt value or fallback to "0"
    const integer = (decimalIndex === -1 ? formatted : formatted.slice(0, decimalIndex)).reduce((prev, curr) => prev + curr.value, "") || "0";
    if(precision === 0 || (isFloat === -1 && typeof precision === "undefined"))
      return integer; // We do not want the decimal character when there is no fraction part

    const decimal = formatted[decimalIndex]?.value || ".";
    // Retrieve the fraction part from the stringified amount variable and pad zeros if it is necessary
    let fraction = amount.slice(floatEnd + 1, typeof precision === "undefined" ? undefined : floatEnd + 1 + precision);
    if(typeof precision === "number")
      fraction = fraction.padEnd(precision, "0");

    return `${integer}${decimal}${fraction}`;
  }

  public extend(formatterConstructor: TWaxCustomFormatterConstructor | DeepPartial<IWaxFormatterOptions>, options?: DeepPartial<IWaxFormatterOptions>): WaxFormatter {
    options = structuredClone(("prototype" in formatterConstructor) ? (options ?? {}) : formatterConstructor);

    if(!("prototype" in formatterConstructor)) {
      const instance = new WaxFormatter(this.wax, options);

      this.cloneMatchersTo(instance);

      return instance;
    }

    const newFormatter = new WaxFormatter(this.wax, { ...options, createDefaultFormatters: false });
    this.cloneMatchersTo(newFormatter);

    const formatter = new formatterConstructor(this.wax);

    for(const key of Object.getOwnPropertyNames(formatterConstructor.prototype)) {
      const matchedProperty = Reflect.getMetadata("wax:formatter:prop", formatter, key) as string | undefined;
      const matchedPropertyValue = Reflect.getMetadata("wax:formatter:propvalue", formatter, key) as any | undefined;

      if(typeof matchedProperty === "string") {
        const matched = newFormatter.matchers.get(matchedProperty);

        const overrideFormatterForMatcher = () => {
          const matchValues = new Map();

          return newFormatter.matchers.set(
            matchedProperty,
            {
              matchValues,
              defaultFormatter: typeof matchedPropertyValue === "undefined" ? formatter[key].bind(formatter) : undefined
            }
          );
        };

        if(typeof matched === "undefined") {
          overrideFormatterForMatcher();

          if(typeof matchedPropertyValue !== "undefined")
            newFormatter.matchers.get(matchedProperty)!.matchValues.set(matchedPropertyValue, formatter[key].bind(formatter));
        } else if(typeof matchedPropertyValue !== "undefined")
          matched!.matchValues.set(matchedPropertyValue, formatter[key].bind(formatter));
        else
          overrideFormatterForMatcher();
      }

    }

    return newFormatter;
  }

  /**
   * @internal
   */
  protected handleProperty(source: object, target: object, property: string): string | undefined {
    const matched = this.matchers.get(property);

    const matchValues = matched?.matchValues.get(source[property]) ?? matched?.defaultFormatter;

    return matchValues?.({
      options: this.options,
      source,
      target
    });
  }
}
