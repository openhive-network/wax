import type { IBeekeeperUnlockedWallet, TPublicKey } from "@hiveio/beekeeper";
import type { IBrainKeyData, IHiveAssetData, IManabarData, IPrivateKeyData, ITransaction, IWaxBaseInterface, TBlockHash, THexString, TTimestamp } from "../interfaces";
import type { MainModule, proto_protocol, result, witness_set_properties_data } from "../wax_module";
import type { NaiAsset } from "./api";

import { WaxError } from '../errors.js';
import { Transaction } from "./transaction_builder.js";
import Long from "long";

import { WaxFormatter } from "./formatters/waxify.js";

import { isNaiAsset } from "./util/asset_util.js";
import { transaction } from "../protocol";

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

  public deserializeWitnessProps(serializedWitnessProps: Array<[string, string]>): witness_set_properties_data {
    const map = new this.wax.MapStringString();
    for (const [key, serializedValue] of serializedWitnessProps)
      map.set(key, serializedValue);

    return this.proto.cpp_deserialize_witness_set_properties(map);
  }

  public serializeWitnessProps(witnessProps: witness_set_properties_data): Record<string, string> {
    const propsSerialized = this.proto.cpp_serialize_witness_set_properties(witnessProps);
    const propsKeys = propsSerialized.keys();

    const keys: string[] = [];
    for(let i = 0; i < propsKeys.size(); ++i)
      keys.push(propsKeys.get(i) as string);

    const props: Record<string, string> = {};

    for(const key of keys)
      props[key] = propsSerialized.get(key) as string;

    return props;
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

  public vestsToHp(vests: number | string | BigInt | Long | NaiAsset, totalVestingFundHive: number | string | BigInt | Long | NaiAsset, totalVestingShares: number | string | BigInt | Long | NaiAsset): NaiAsset {
    const vestsAsset = isNaiAsset(vests) ? vests as NaiAsset : this.vests(vests as number | string | BigInt | Long);
    const totalVestingFundHiveAsset = isNaiAsset(totalVestingFundHive) ? totalVestingFundHive as NaiAsset : this.hive(totalVestingFundHive as number | string | BigInt | Long);
    const totalVestingSharesAsset = isNaiAsset(totalVestingShares) ? totalVestingShares as NaiAsset : this.vests(totalVestingShares as number | string | BigInt | Long);

    if (vestsAsset.nai !== this.ASSETS.VESTS.nai)
      throw new WaxError('Invalid asset type for vests');

    if (totalVestingFundHiveAsset.nai !== this.ASSETS.HIVE.nai)
      throw new WaxError('Invalid asset type for totalVestingFundHive');

    if (totalVestingSharesAsset.nai !== this.ASSETS.VESTS.nai)
      throw new WaxError('Invalid asset type for totalVestingShares');

    return this.proto.cpp_vests_to_hp(vestsAsset, totalVestingFundHiveAsset, totalVestingSharesAsset) as NaiAsset;
  }

  public hbdToHive(hbd: number | string | BigInt | Long | NaiAsset, base: number | string | BigInt | Long | NaiAsset, quote: number | string | BigInt | Long | NaiAsset): NaiAsset {
    const hbdAsset = isNaiAsset(hbd) ? hbd as NaiAsset : this.hbd(hbd as number | string | BigInt | Long);
    const baseAsset = isNaiAsset(base) ? base as NaiAsset : this.hbd(base as number | string | BigInt | Long);
    const quoteAsset = isNaiAsset(quote) ? quote as NaiAsset : this.hive(quote as number | string | BigInt | Long);

    if (hbdAsset.nai !== this.ASSETS.HBD.nai)
      throw new WaxError('Invalid asset type for HBD');

    if (baseAsset.nai !== this.ASSETS.HBD.nai)
      throw new WaxError('Invalid asset type for base');

    if (quoteAsset.nai !== this.ASSETS.HIVE.nai)
      throw new WaxError('Invalid asset type for quote');

    return this.proto.cpp_hbd_to_hive(hbdAsset, baseAsset, quoteAsset) as NaiAsset;
  }

  public hiveToHbd(amount: number | string | BigInt | Long | NaiAsset, base: number | string | BigInt | Long | NaiAsset, quote: number | string | BigInt | Long | NaiAsset): NaiAsset {
    const amountAsset = isNaiAsset(amount) ? amount as NaiAsset : this.hive(amount as number | string | BigInt | Long);
    const baseAsset = isNaiAsset(base) ? base as NaiAsset : this.hbd(base as number | string | BigInt | Long);
    const quoteAsset = isNaiAsset(quote) ? quote as NaiAsset : this.hive(quote as number | string | BigInt | Long);

    if (amountAsset.nai !== this.ASSETS.HIVE.nai)
      throw new WaxError('Invalid asset type for HBD');

    if (baseAsset.nai !== this.ASSETS.HBD.nai)
      throw new WaxError('Invalid asset type for base');

    if (quoteAsset.nai !== this.ASSETS.HIVE.nai)
      throw new WaxError('Invalid asset type for quote');

    return this.proto.cpp_hive_to_hbd(amountAsset, baseAsset, quoteAsset) as NaiAsset;
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

  public createTransactionFromProto(protoTransaction: transaction): ITransaction {
    return new Transaction(this, protoTransaction);
  }

  public createTransactionFromJson(transactionObject: string | object): ITransaction {
    return Transaction.fromApi(this, transactionObject);
  }

  public createTransactionWithTaPoS(taposBlockId: TBlockHash, expirationTime?: TTimestamp): ITransaction {
    return new Transaction(this, taposBlockId, expirationTime);
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

  public suggestBrainKey(): IBrainKeyData {
    const data = this.proto.cpp_suggest_brain_key();

    return {
      associatedPublicKey: data.associated_public_key as string,
      brainKey: data.brain_key as string,
      wifPrivateKey: data.wif_private_key as string
    };
  }

  public getPrivateKeyFromPassword(account: string, role: string, password: string): IPrivateKeyData {
    const data = this.proto.cpp_generate_private_key_password_based(account, role, password);

    return {
      associatedPublicKey: data.associated_public_key as string,
      wifPrivateKey: data.wif_private_key as string
    };
  }

  public calculateAccountHp(vests: number | string | BigInt | Long | NaiAsset, totalVestingFundHive: number | string | BigInt | Long | NaiAsset, totalVestingShares: number | string | BigInt | Long | NaiAsset): NaiAsset {
    const vestsAsset = isNaiAsset(vests) ? vests as NaiAsset : this.vests(vests as number | string | BigInt | Long);
    const totalVestingFundHiveAsset = isNaiAsset(totalVestingFundHive) ? totalVestingFundHive as NaiAsset : this.hive(totalVestingFundHive as number | string | BigInt | Long);
    const totalVestingSharesAsset = isNaiAsset(totalVestingShares) ? totalVestingShares as NaiAsset : this.vests(totalVestingShares as number | string | BigInt | Long);

    if (vestsAsset.nai !== this.ASSETS.VESTS.nai)
      throw new WaxError('Invalid asset type for vests');

    if (totalVestingFundHiveAsset.nai !== this.ASSETS.HIVE.nai)
      throw new WaxError('Invalid asset type for totalVestingFundHive');

    if (totalVestingSharesAsset.nai !== this.ASSETS.VESTS.nai)
      throw new WaxError('Invalid asset type for totalVestingShares');

    return this.proto.cpp_calculate_account_hp(vestsAsset, totalVestingFundHiveAsset, totalVestingSharesAsset) as NaiAsset;
  }

  public calculateWitnessVotesHp(votes: number, totalVestingFundHive: number | string | BigInt | Long | NaiAsset, totalVestingShares: number | string | BigInt | Long | NaiAsset): NaiAsset {
    const totalVestingFundHiveAsset = isNaiAsset(totalVestingFundHive) ? totalVestingFundHive as NaiAsset : this.hive(totalVestingFundHive as number | string | BigInt | Long);
    const totalVestingSharesAsset = isNaiAsset(totalVestingShares) ? totalVestingShares as NaiAsset : this.vests(totalVestingShares as number | string | BigInt | Long);

    if (totalVestingFundHiveAsset.nai !== this.ASSETS.HIVE.nai)
      throw new WaxError('Invalid asset type for totalVestingFundHive');

    if (totalVestingSharesAsset.nai !== this.ASSETS.VESTS.nai)
      throw new WaxError('Invalid asset type for totalVestingShares');

    return this.proto.cpp_calculate_witness_votes_hp(votes, votes, totalVestingFundHiveAsset, totalVestingSharesAsset) as NaiAsset;
  }

  public calculateHpApr(headBlockNum: number, vestingRewardPercent: number, virtualSupply: number | string | BigInt | Long | NaiAsset, totalVestingFundHive: number | string | BigInt | Long | NaiAsset): number {
    const virtualSupplyAsset = isNaiAsset(virtualSupply) ? virtualSupply as NaiAsset : this.hive(virtualSupply as number | string | BigInt | Long);
    const totalVestingFundHiveAsset = isNaiAsset(totalVestingFundHive) ? totalVestingFundHive as NaiAsset : this.hive(totalVestingFundHive as number | string | BigInt | Long);

    return Number.parseFloat(this.extract(this.proto.cpp_calculate_hp_apr(headBlockNum, vestingRewardPercent, virtualSupplyAsset, totalVestingFundHiveAsset)));
  }

  public delete(): void {
    this.proto.delete();
  }
}

