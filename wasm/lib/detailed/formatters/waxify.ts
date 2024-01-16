import type { TWaxCustomFormatterConstructor, IWaxFormatterOptions, TFormatFunction, IWaxExtendableFormatter } from "./types";
import type { IHiveChainInterface } from "../../interfaces";

import { WaxFormatterBase } from "./base";
import { DefaultFormatters } from "./default_formatters";

export class WaxFormatter extends WaxFormatterBase implements IWaxExtendableFormatter {
  private matchers: Map<string, TFormatFunction> = new Map();

  public constructor(
    protected readonly wax: IHiveChainInterface,
    options?: Partial<IWaxFormatterOptions>
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
    return this.extend(DefaultFormatters);
  }

  public extend(formatterConstructor: TWaxCustomFormatterConstructor, options?: Partial<IWaxFormatterOptions>): WaxFormatter {
    const newFormatter = new WaxFormatter(this.wax, { ...(options ?? {}), createDefaultFormatteres: false });
    newFormatter.matchers = new Map(this.matchers);

    const formatter = new formatterConstructor(newFormatter.options);

    for(const key of Object.getOwnPropertyNames(formatterConstructor.prototype)) {
      const matchedProperty = Reflect.getMetadata("wax:formatter:prop", formatter, key) as string | undefined;

      if(typeof matchedProperty === "string")
        newFormatter.matchers.set(matchedProperty, formatter[key].bind(formatter));
    }

    return newFormatter;
  }

  /**
   * @internal
   */
  public handleProperty(target: object, property: string): string | undefined {
    const matched = this.matchers.get(property);

    return matched?.(target);
  }
}
