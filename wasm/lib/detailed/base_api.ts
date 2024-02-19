import type { IHiveAssetData, IManabarData, ITransactionBuilderConstructor, IWaxBaseInterface, THexString } from "../interfaces";
import type { MainModule, proto_protocol, result } from "../wax_module";
import type { NaiAsset } from "./api";

import { WaxError } from '../errors.js';
import { TransactionBuilder } from "./transaction_builder.js";
import Long from "long";

import { WaxFormatter } from "./formatters/waxify";

const PERCENT_VALUE_DOUBLE_PRECISION = 100;
export const ONE_HUNDRED_PERCENT = 100 * PERCENT_VALUE_DOUBLE_PRECISION;

export class WaxBaseApi implements IWaxBaseInterface {
  public proto: proto_protocol;

  public readonly formatter = WaxFormatter.create(this);
  public get waxify() {
    return this.formatter.waxify.bind(this.formatter);
  }

  public extract(res: result): string {
    if(res.value !== this.wax.error_code.ok)
      throw new WaxError(`Wax API error: "${String(res.exception_message as string)}"`);

    return res.content as string;
  }

  public constructor(
    public readonly wax: MainModule,
    public readonly chainId: string
  ) {
    this.proto = new wax.proto_protocol();
  }

  get TransactionBuilder(): ITransactionBuilderConstructor {
    return Object.assign(
      TransactionBuilder.bind(undefined, this),
      {
        fromApi: TransactionBuilder.fromApi.bind(undefined, this)
      }
    );
  }

  getAsset(nai: NaiAsset): IHiveAssetData {
    const symbol = this.proto.cpp_asset_symbol(nai);
    const amount = this.proto.cpp_asset_value(nai);

    return {
      symbol,
      amount
    };
  }

  public getPublicKeyFromSignature(sigDigest: THexString, signature: THexString): THexString {
    return this.extract(this.proto.cpp_get_public_key_from_signature(sigDigest, signature));
  }

  private calculateManabarPercent(current: Long, max: Long): number {
    if(max.isZero())
      return 0;

    // Prevent int64 overflow before calculations
    if(Long.MAX_UNSIGNED_VALUE.divide(ONE_HUNDRED_PERCENT).lessThan(max)) {
      max = max.divide(ONE_HUNDRED_PERCENT);
      current = current.divide(ONE_HUNDRED_PERCENT);
    }

    const percent = current.multiply(ONE_HUNDRED_PERCENT).divide(max).toNumber() / PERCENT_VALUE_DOUBLE_PRECISION;

    return percent;
  }

  calculateCurrentManabarValue(now: number, maxManaLH: number | string | Long, currentManaLH: number | string | Long, lastUpdateTime: number): IManabarData {
    if(typeof maxManaLH !== "object")
      maxManaLH = Long.fromValue(maxManaLH, true);

    if(typeof currentManaLH !== "object")
      currentManaLH = Long.fromValue(currentManaLH, true);

    if(maxManaLH.equals(0))
      return {
        max: maxManaLH,
        current: Long.ZERO,
        percent: 100
      };

    const current = Long.fromString(this.extract(this.proto.cpp_calculate_current_manabar_value(now, maxManaLH.low, maxManaLH.high, currentManaLH.low, currentManaLH.high, lastUpdateTime)), true);

    const percent = this.calculateManabarPercent(current, maxManaLH);

    return {
      max: maxManaLH,
      current,
      percent
    };
  }

  calculateManabarFullRegenerationTime(now: number, maxManaLH: number | string | Long, currentManaLH: number | string | Long, lastUpdateTime: number): number {
    if(typeof maxManaLH !== "object")
      maxManaLH = Long.fromString(maxManaLH.toString(), true);

    if(typeof currentManaLH !== "object")
      currentManaLH = Long.fromString(currentManaLH.toString(), true);

    if(maxManaLH.equals(0))
      return Math.floor(Date.now() / 1000);

    return Number.parseInt(this.extract(this.proto.cpp_calculate_manabar_full_regeneration_time(now, maxManaLH.low, maxManaLH.high, currentManaLH.low, currentManaLH.high, lastUpdateTime)));
  }

  delete(): void {
    this.proto.delete();
  }
}
