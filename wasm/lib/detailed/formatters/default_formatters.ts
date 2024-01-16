import type { ApiOperation } from "../api";
import type { IWaxFormatterOptions } from "./types";
import { WaxFormatable } from "../decorators/formatters";

export class DefaultFormatters {
  public constructor(public readonly options: IWaxFormatterOptions) {}

  @WaxFormatable()
  public type(value: ApiOperation): string {
    return value.type;
  }
}
