import type { IHiveChainInterface } from "../interfaces.js";
import type { MainModule } from "../index.js";

import { WaxBaseApi } from "./base_api.js";

export class HiveChainApi extends WaxBaseApi implements IHiveChainInterface {
  public constructor(
    public readonly wax: MainModule,
    public readonly chainId: string
  ) {
    super(wax, chainId);
  }
}
