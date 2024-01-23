import type { TWaxCustomFormatterConstructor, IWaxFormatterOptions, TFormatFunction, IWaxExtendableFormatter, DeepPartial } from "./types";
import type { IWaxBaseInterface } from "../../interfaces";

import { WaxFormatterBase } from "./base";
import { DefaultFormatters } from "./default_formatters";

export interface IMatchersData {
  matchValues: Map<string, TFormatFunction>;
  defaultFormatter: TFormatFunction;
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
          const defaultFormatter = formatter[key].bind(formatter);

          return newFormatter.matchers.set(
            matchedProperty,
            {
              matchValues,
              defaultFormatter
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
