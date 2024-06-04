import type { IBeekeeperUnlockedWallet, TPublicKey } from "@hiveio/beekeeper";
import type { IHiveAssetData, IManabarData, ITransactionBuilderConstructor, IWaxBaseInterface, THexString } from "../interfaces";
import type { MainModule, proto_protocol, result, witness_set_properties_data, witness_set_properties_serialized } from "../wax_module";
import type { NaiAsset } from "./api";

import { WaxError } from '../errors.js';
import { TransactionBuilder } from "./transaction_builder.js";
import Long from "long";

import { WaxFormatter } from "./formatters/waxify";

const PERCENT_VALUE_DOUBLE_PRECISION = 100;
export const ONE_HUNDRED_PERCENT = 100 * PERCENT_VALUE_DOUBLE_PRECISION;

export enum EAssetName {
  HIVE = "HIVE",
  HBD = "HBD",
  VESTS = "VESTS"
}

export class WaxBaseApi implements IWaxBaseInterface {
  public proto: proto_protocol;

  public readonly ASSETS: Readonly<Record<EAssetName, NaiAsset>>;

  public readonly formatter = WaxFormatter.create(this);
  public get waxify() {
    return this.formatter.waxify.bind(this.formatter);
  }

  public serializeWitnessProps(witnessProps: witness_set_properties_data): witness_set_properties_serialized {
    return this.proto.cpp_serialize_witness_set_properties(witnessProps);
  }

  public hive(amount: number | string | BigInt | Long): NaiAsset {
    const long = Long.fromString(amount.toString());

    return this.proto.cpp_hive(long.low, long.high) as NaiAsset;
  }

  public hbd(amount: number | string | BigInt | Long): NaiAsset {
    const long = Long.fromString(amount.toString());

    return this.proto.cpp_hbd(long.low, long.high) as NaiAsset;
  }

  public vests(amount: number | string | BigInt | Long): NaiAsset {
    const long = Long.fromString(amount.toString());

    return this.proto.cpp_vests(long.low, long.high) as NaiAsset;
  }

  public vestsToHp(vests: number | string | BigInt | Long, totalVestingFundHive: number | string | BigInt | Long, totalVestingShares: number | string | BigInt | Long): NaiAsset {
    return this.proto.cpp_vests_to_hp(this.vests(vests), this.hive(totalVestingFundHive), this.vests(totalVestingShares)) as NaiAsset;
  }

  public hbdToHive(hbd: number | string | BigInt | Long, base: number | string | BigInt | Long, quote: number | string | BigInt | Long): NaiAsset {
    return this.proto.cpp_hbd_to_hive(this.hbd(hbd), this.hbd(base), this.hive(quote)) as NaiAsset;
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
    this.ASSETS = {
      [EAssetName.HBD]: this.hbd(0),
      [EAssetName.HIVE]: this.hive(0),
      [EAssetName.VESTS]: this.vests(0)
    };
  }

  public get TransactionBuilder(): ITransactionBuilderConstructor {
    return Object.assign(
      TransactionBuilder.bind(undefined, this),
      {
        fromApi: TransactionBuilder.fromApi.bind(undefined, this)
      }
    );
  }

  public getAsset(nai: NaiAsset): IHiveAssetData {
    const symbol = this.proto.cpp_asset_symbol(nai);
    const amount = this.proto.cpp_asset_value(nai);

    return {
      symbol,
      amount
    };
  }

  public get addressPrefix(): string {
    return this.proto.cpp_get_address_prefix() as string;
  }

  public getVersion(): string {
    return process.env.npm_package_version as string;
  }

  public getPublicKeyFromSignature(sigDigest: THexString, signature: THexString): THexString {
    return this.extract(this.proto.cpp_get_public_key_from_signature(sigDigest, signature));
  }

  public encrypt(wallet: IBeekeeperUnlockedWallet, content: string, mainEncryptionKey: TPublicKey, otherEncryptionKey?: TPublicKey, nonce?: number): string {
    const encrypted = wallet.encryptData(content, mainEncryptionKey, otherEncryptionKey, nonce);

    return this.proto.cpp_crypto_memo_dump_string({
      content: encrypted,
      from: mainEncryptionKey,
      to: otherEncryptionKey ?? mainEncryptionKey
    });
  }

  public decrypt(wallet: IBeekeeperUnlockedWallet, encrypted: string): string {
    const data = this.proto.cpp_crypto_memo_from_string(encrypted);

    return wallet.decryptData(data.content as string, data.from as string, data.to as string);
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

  public calculateCurrentManabarValue(now: number, maxManaLH: number | string | Long, currentManaLH: number | string | Long, lastUpdateTime: number): IManabarData {
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

  public calculateManabarFullRegenerationTime(now: number, maxManaLH: number | string | Long, currentManaLH: number | string | Long, lastUpdateTime: number): number {
    if(typeof maxManaLH !== "object")
      maxManaLH = Long.fromString(maxManaLH.toString(), true);

    if(typeof currentManaLH !== "object")
      currentManaLH = Long.fromString(currentManaLH.toString(), true);

    if(maxManaLH.equals(0))
      return Math.floor(Date.now() / 1000);

    return Number.parseInt(this.extract(this.proto.cpp_calculate_manabar_full_regeneration_time(now, maxManaLH.low, maxManaLH.high, currentManaLH.low, currentManaLH.high, lastUpdateTime)));
  }

  public delete(): void {
    this.proto.delete();
  }
}
