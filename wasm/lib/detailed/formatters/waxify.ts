import type { TWaxCustomFormatterConstructor, IWaxFormatterOptions, TFormatFunction, IWaxExtendableFormatter, DeepPartial, IWaxCustomFormatter } from "./types";
import type { IWaxBaseInterface } from "../../interfaces";

import { WaxFormatterBase } from "./base";
import { DefaultFormatters } from "./default_formatters";

export interface IMatchersData {
  matchValues: Map<string, TFormatFunction>;
  proxy: Record<string, TFormatFunction> & {
    default: TFormatFunction;
    matchValues: Map<string, TFormatFunction>;
  };
}

export class WaxFormatter extends WaxFormatterBase implements IWaxExtendableFormatter {
  private matchers: Map<string, IMatchersData> = new Map();

  public constructor(
    protected readonly wax: IWaxBaseInterface,
    options?: DeepPartial<IWaxFormatterOptions>
  ) {
    super(options);

    if(this.options.createDefaultFormatteres)
      this.init();
  }

  /**
   * Initializes the internal {@link matchers} map and ensures
   * that the base types are defined for properties handling
   */
  public init(): WaxFormatter {
    const formatter = this.extend(DefaultFormatters);

    this.matchers = formatter.matchers;

    return formatter;
  }

  public extend(formatterConstructor: TWaxCustomFormatterConstructor | DeepPartial<IWaxFormatterOptions>, options?: DeepPartial<IWaxFormatterOptions>): WaxFormatter {
    let newFormatter: WaxFormatter;
    let formatter: IWaxCustomFormatter;

    if("prototype" in formatterConstructor) {
      newFormatter = new WaxFormatter(this.wax, { ...(options ?? {}), createDefaultFormatteres: false });
      newFormatter.matchers = new Map(this.matchers);
    } else {
      newFormatter = new WaxFormatter(this.wax, formatterConstructor);
      formatterConstructor = DefaultFormatters;
    }

    formatter = new formatterConstructor(newFormatter.options, this.wax);

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
              proxy: new Proxy({
                matchValues,
                default: formatter[key].bind(formatter),
              }, {
                get(target: IMatchersData["proxy"], prop: string): TFormatFunction | undefined {
                  const valueToMatch = target.matchValues.get(prop);

                  if(typeof valueToMatch === "undefined")
                    return target.default;

                  return valueToMatch;
                }
              }) as IMatchersData["proxy"]
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

    return matched?.proxy[source[property]](source, target);
  }
}
