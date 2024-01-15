import type { IWaxFormatter, IWaxFormatterOptions, TFormatFunction } from "./types";
import type { IHiveChainInterface } from "../../interfaces";
import type { ApiBlock, ApiTransaction, NaiAsset } from "../api";

import { WaxFormatterBase } from "./base";

export class WaxFormatter extends WaxFormatterBase implements IWaxFormatter {
  protected readonly matchers: Map<string, TFormatFunction> = new Map();

  public constructor(
    protected readonly wax: IHiveChainInterface,
    options?: IWaxFormatterOptions
  ) {
    super(options);
  }

  /**
   * Initializes the internal {@link matchers} map and ensures
   * that the base types are defined for properties handling 
   */
  public init(): WaxFormatter { // XXX: Maybe all base matchers initializers should be moved from the init function
    this.matchers.set("transactions", ((value: ApiBlock): string => value.block_id) as TFormatFunction);
    // TODO: Add support for wax utility functions like get_num_from_block or tx_id
    this.matchers.set("operations", ((value: ApiTransaction): string => String(value.ref_block_num)) as TFormatFunction);
    this.matchers.set("nai", ((value: NaiAsset): string => // TODO: Add long.js support
      `${(Number.parseInt(value.amount)/Math.pow(10, value.precision)).toFixed(value.precision)} HIVE`
      ) as TFormatFunction);
    // TODO: Add support for operations and extensions as separate matchers
    this.matchers.set("type", (value: any): string => 
        value.type === "transfer_operation"
            ? `Account ${value.value.from} transferred ${this.matchers.get("nai")!(value.value.amount)} to ${value.value.to}`
            : "Unknown operation!"
    );

    return this;
  }

  public handleProperty(target: object, property: string): string | undefined {
    const matched = this.matchers.get(property);

    return matched?.(target);
  }
}
