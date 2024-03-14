import type { TWaxCustomFormatterConstructor, IWaxFormatterOptions, TFormatFunction, IWaxExtendableFormatter, DeepPartial } from "./types";
import type { IWaxBaseInterface } from "../../interfaces";

import { WaxFormatterBase } from "./base";
import { DefaultFormatters } from "./default_formatters";
import Long from "long";

export interface IMatchersData {
  matchValues: Map<string, TFormatFunction>;
  matchInstanceOf?: { new(...args: any[]): any };
  defaultFormatter?: TFormatFunction;
}

export interface IInstancesData {
  formatFn: TFormatFunction;
  matchInstanceOf: { new(...args: any[]): any };
}

export class WaxFormatter extends WaxFormatterBase implements IWaxExtendableFormatter {
  private matchers: Map<string, IMatchersData> = new Map();
  private instances: Array<IInstancesData> = new Array();

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
        matchInstanceOf: value.matchInstanceOf,
        matchValues: new Map([ ...value.matchValues, ...(instance.matchers.get(key)?.matchValues ?? []) ])
      })
    for(const { formatFn, matchInstanceOf } of this.instances) {
      const pred = instance.instances.find(obj => obj.matchInstanceOf === matchInstanceOf);

      if(typeof pred === "object")
        pred.formatFn = formatFn;
      else
        instance.instances.push({ matchInstanceOf, formatFn });
    }
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
      const explicitProp = Reflect.getMetadata("wax:formatter:explicitprop", formatter, key) as boolean | undefined;
      const matchedPropertyValue = Reflect.getMetadata("wax:formatter:propvalue", formatter, key) as any | undefined;
      const matchInstanceOf = Reflect.getMetadata("wax:formatter:instanceof", formatter, key) as { new(...args: any[]): any } | undefined;

      if(!explicitProp && typeof matchInstanceOf === "function") { // Match only by the instance if requested
        const pred = newFormatter.instances.find(obj => obj.matchInstanceOf === matchInstanceOf);

        if(typeof pred === "object")
          pred.formatFn = formatter[key].bind(formatter);
        else
          newFormatter.instances.push({ matchInstanceOf, formatFn: formatter[key].bind(formatter) });
      } else if(typeof matchedProperty === "string") {
        const matched = newFormatter.matchers.get(matchedProperty);

        const overrideFormatterForMatcher = () => {
          const matchValues = new Map();

          return newFormatter.matchers.set(
            matchedProperty,
            {
              matchValues,
              matchInstanceOf,
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
  protected handleInstanceOf(source: object, target: any, property: string): any | undefined {
    const isInstance = (value: any, prop: string) => typeof value === "object" && value[prop] !== null && Object.getPrototypeOf(value[prop]) !== Object.prototype && !Array.isArray(value[prop]);

    // If source is a plain object then do not waste time iterating
    if (!isInstance(source, property) && !isInstance(target, property))
      return;

    for(const { formatFn, matchInstanceOf } of this.instances)
      if(source[property] instanceof matchInstanceOf || target[property] instanceof matchInstanceOf)
        return formatFn({
          options: this.options,
          source,
          target
        });
  }

  /**
   * @internal
   */
  protected handleProperty(source: object, target: any, property: string): any | undefined {
    const matched = this.matchers.get(property);

    // If no matchers found, then iterate over instances to match
    if(typeof matched === "undefined")
      return this.handleInstanceOf(source, target, property);

    const matchValues = matched?.matchValues.get(source[property]) ?? matched?.defaultFormatter;

    if(typeof matchValues === "function" && typeof matched?.matchInstanceOf === "function" && !(typeof source === "object" && source[property] instanceof matched.matchInstanceOf))
      return;

    return matchValues?.({
      options: this.options,
      source,
      target
    });
  }
}
