import type { IBinaryViewArrayNode, IBinaryViewNode, IBinaryViewOutputData, IBrainKeyData, IHiveAssetData, IManabarData, IPrivateKeyData, ITransaction, IWaxBaseInterface, TBlockHash, THexString, TNaiAssetConvertible, TNaiAssetSource, TPublicKey, TTimestamp } from "./interfaces";
import type { binary_data_node, json_price, MainModule, proto_protocol, protocol, result, VectorBinaryDataNode, VectorString, witness_set_properties_data, wax_authorities } from "../build_wasm/wax.common";
import type { IChainConfig } from "../build_wasm/config";
import type { ApiOperation, NaiAsset } from "./api";

import { ApiTransaction } from "./api";
import type { TAccountName } from "./hive_apps_operations";
import { operation, transaction } from "./protocol";

import { WaxError, WaxPrivateKeyLeakDetectedException } from './errors.js';
import { safeWasmCall, TWaxStdExceptionData } from "./util/wasm_errors.js";
import { JSON_stringify_operation, JSON_stringify_transaction, matchesHiveProtocolType } from "./util/proto_type_utils";
import { Transaction } from "./transaction.js";
import Long from "long";

import { WaxFormatter } from "./formatters/waxify.js";

import { isNaiAsset } from "./util/asset_util.js";

import type { AccountAuthorityUpdateOperation } from "./complex_operations"; // only for TypeDoc purposes :-(
import { IEncryptionProvider, ILegacyEncryptionProvider, IOnlineEncryptionProvider } from "./extensions/signatures";

const PERCENT_VALUE_DOUBLE_PRECISION = 100;
export const ONE_HUNDRED_PERCENT = 100 * PERCENT_VALUE_DOUBLE_PRECISION;

export enum EAssetName {
  HIVE = "HIVE",
  HBD = "HBD",
  VESTS = "VESTS"
}

export class WaxBaseApi implements IWaxBaseInterface {
  public proto: proto_protocol;
  public protocol: protocol;

  public readonly ASSETS: Readonly<Record<EAssetName, NaiAsset>>;

  public readonly formatter = WaxFormatter.create(this);
  public get waxify() {
    return this.formatter.waxify.bind(this.formatter);
  }

  public parseBinaryMetadataChildren(data: VectorBinaryDataNode): IBinaryViewNode[] {
    const offsets: IBinaryViewNode[] = [];

    for(let i = 0; i < data.size(); ++i) {
      const node = data.get(i) as binary_data_node;

      offsets.push({
        key: node.key as string,
        type: node.type as IBinaryViewNode["type"],
        offset: node.offset,
        size: node.size,
        value: (node.value as string).length === 0 ? undefined : node.value as string,
        length: (node.type === "array" ? node.length : undefined) as IBinaryViewArrayNode["length"],
        children: node.type === "scalar" ? undefined : this.parseBinaryMetadataChildren(node.children) as any
      } as IBinaryViewNode);
    }

    return offsets;
  };

  public operationBinaryViewMetadata(operation: operation | ApiOperation, isHf26Serialization = true): IBinaryViewOutputData {
    let result;

    const stringifiedOperation = JSON_stringify_operation(operation);
    if (matchesHiveProtocolType(operation))
      result = safeWasmCall(() => this.protocol.cpp_generate_binary_operation_metadata(stringifiedOperation, isHf26Serialization));
    else
      result = safeWasmCall(() => this.proto.cpp_generate_binary_operation_metadata(stringifiedOperation, isHf26Serialization));

    return {
      binary: result.binary as string,
      offsets: this.parseBinaryMetadataChildren(result.offsets) as IBinaryViewNode[]
    };
  }

  public operationGetImpactedAccounts(op: operation | ApiOperation): Set<TAccountName> {
    let vector: VectorString;

    const stringifiedOperation = JSON_stringify_operation(op);

    if (matchesHiveProtocolType(op))
      vector = safeWasmCall(() => this.protocol.cpp_operation_get_impacted_accounts(stringifiedOperation));
    else
      vector = safeWasmCall(() => this.proto.cpp_operation_get_impacted_accounts(stringifiedOperation));

    const resultingSet = new Set<TAccountName>();

    for(let i = 0; i < vector.size(); ++i) {
      const collectedAccountName = vector.get(i) as TAccountName;
      resultingSet.add(collectedAccountName);
    }

    return resultingSet;
  }

  public transactionGetImpactedAccounts(transaction: transaction | ApiTransaction): Set<TAccountName> {
    let vector: VectorString;

    const resultingSet = new Set<TAccountName>();

    if(transaction.operations.length === 0)
      return resultingSet;

    const stringifiedTransaction = JSON_stringify_transaction(transaction);
    if (matchesHiveProtocolType(transaction))
      vector = safeWasmCall(() => this.protocol.cpp_transaction_get_impacted_accounts(stringifiedTransaction));
    else
      vector = safeWasmCall(() => this.proto.cpp_transaction_get_impacted_accounts(stringifiedTransaction));

    for(let i = 0; i < vector.size(); ++i)
      resultingSet.add(vector.get(i) as TAccountName);

    return resultingSet;
  }

  private assertAssetSymbol(requiredSymbolType: EAssetName[] | EAssetName, asset: NaiAsset): NaiAsset {
    const stringifyAsset = (assetType: EAssetName) => `"${this.ASSETS[assetType].nai}" (${assetType}) with precision: ${this.ASSETS[assetType].precision}`;

    const assets = Array.isArray(requiredSymbolType) ? requiredSymbolType : [ requiredSymbolType ];

    for (const symbolType of assets)
      if (this.ASSETS[symbolType].nai === asset.nai && this.ASSETS[symbolType].precision === asset.precision)
        return asset;

    throw new WaxError(`Invalid asset provided: "${JSON.stringify(asset)}". Expected asset symbol(s): "${assets.map(stringifyAsset).join(" or ")}".`);
  }

  // Public for our internal usage among i.e. complex operation sinks or formatters (this method is not exposed in the IWaxBaseInterface)
  public createAssetWithRequiredSymbol(requiredSymbolType: EAssetName[] | EAssetName, asset: TNaiAssetSource): NaiAsset {
    if (isNaiAsset(asset))
      return this.assertAssetSymbol(requiredSymbolType, asset as NaiAsset);

    if(Array.isArray(requiredSymbolType))
      throw new WaxError(`Cannot deduce the asset type when multiple available: ${requiredSymbolType.join(", ")} when passing non-asset value: "${asset.toString()}"`);

    return this.getNaiAssetForAssetName(requiredSymbolType, asset as TNaiAssetConvertible);
  }

  public estimateHiveCollateral(currentMedianHistoryBase: TNaiAssetSource, currentMedianHistoryQuote: TNaiAssetSource, currentMinHistoryBase: TNaiAssetSource, currentMinHistoryQuote: TNaiAssetSource, hbdAmountToGet: TNaiAssetSource): NaiAsset {
    const currentMedianHistory: json_price = {
      base: this.createAssetWithRequiredSymbol(EAssetName.HBD, currentMedianHistoryBase),
      quote: this.createAssetWithRequiredSymbol(EAssetName.HIVE, currentMedianHistoryQuote)
    };

    const currentMinHistory: json_price = {
      base: this.createAssetWithRequiredSymbol(EAssetName.HBD, currentMinHistoryBase),
      quote: this.createAssetWithRequiredSymbol(EAssetName.HIVE, currentMinHistoryQuote)
    };

    const actualHbdAmountToGet = this.createAssetWithRequiredSymbol(EAssetName.HBD, hbdAmountToGet);

    return safeWasmCall(() => this.proto.cpp_estimate_hive_collateral(currentMedianHistory, currentMinHistory, actualHbdAmountToGet) as NaiAsset);
  }

  public deserializeWitnessProps(serializedWitnessProps: Array<[string, string]>): witness_set_properties_data {
    const map = new this.wax.MapStringString();
    for (const [key, serializedValue] of serializedWitnessProps)
      map.set(key, serializedValue);

    return safeWasmCall(() => this.proto.cpp_deserialize_witness_set_properties(map))
  }

  public serializeWitnessProps(witnessProps: witness_set_properties_data): Record<string, string> {
    const propsSerialized = safeWasmCall(() => this.proto.cpp_serialize_witness_set_properties(witnessProps));
    const propsKeys = propsSerialized.keys();

    const keys: string[] = [];
    for(let i = 0; i < propsKeys.size(); ++i)
      keys.push(propsKeys.get(i) as string);

    const props: Record<string, string> = {};

    for(const key of keys)
      props[key] = propsSerialized.get(key) as string;

    return props;
  }

  public convertTransactionToBinaryForm(transaction: ApiTransaction, stripToUnsignedTransaction: boolean = false): THexString {
    const tx = this.createTransactionFromJson(transaction);

    const conversionResult = safeWasmCall(() => this.proto.cpp_serialize_transaction(tx.toString(), stripToUnsignedTransaction));

    return this.extract(conversionResult);
  }

  public convertTransactionFromBinaryForm(transaction: THexString): ApiTransaction {
    const conversionResult = safeWasmCall(() => this.protocol.cpp_deserialize_transaction(transaction));

    return JSON.parse(this.extract(conversionResult));
  }

  private naiAssetToLong(amount: number, precision: number): Long {
    let satoshisValue = Long.fromNumber(amount).multiply(10 ** precision);

    const [ , frac ] = amount.toString().split('.') as [string, string | undefined];
    if (frac)
      satoshisValue = satoshisValue.add(frac.substring(0, precision) + '0'.repeat(Math.max(0, precision - frac.length)));

    return satoshisValue;
  }

  public hiveCoins(amount: number): NaiAsset {
    return this.hiveSatoshis(this.naiAssetToLong(amount, this.ASSETS.HIVE.precision));
  }

  public hbdCoins(amount: number): NaiAsset {
    return this.hbdSatoshis(this.naiAssetToLong(amount, this.ASSETS.HBD.precision));
  }

  public vestsCoins(amount: number): NaiAsset {
    return this.vestsSatoshis(this.naiAssetToLong(amount, this.ASSETS.VESTS.precision));
  }

  public hive(amount: TNaiAssetConvertible): NaiAsset {
    return this.hiveSatoshis(amount);
  }

  public hbd(amount: TNaiAssetConvertible): NaiAsset {
    return this.hbdSatoshis(amount);
  }

  public vests(amount: TNaiAssetConvertible): NaiAsset {
    return this.vestsSatoshis(amount);
  }

  public hiveSatoshis(amount: TNaiAssetConvertible): NaiAsset {
    const long = Long.fromString(amount.toString());

    return safeWasmCall(() => this.proto.cpp_hive(long.low, long.high) as NaiAsset);
  }

  public hbdSatoshis(amount: TNaiAssetConvertible): NaiAsset {
    const long = Long.fromString(amount.toString());

    return safeWasmCall(() => this.proto.cpp_hbd(long.low, long.high) as NaiAsset);
  }

  public vestsSatoshis(amount: TNaiAssetConvertible): NaiAsset {
    const long = Long.fromString(amount.toString());

    return safeWasmCall(() => this.proto.cpp_vests(long.low, long.high) as NaiAsset);
  }

  public vestsToHp(vests: TNaiAssetSource, totalVestingFundHive: TNaiAssetSource, totalVestingShares: TNaiAssetSource): NaiAsset {
    const vestsAsset = this.createAssetWithRequiredSymbol(EAssetName.VESTS, vests);
    const totalVestingFundHiveAsset = this.createAssetWithRequiredSymbol(EAssetName.HIVE, totalVestingFundHive);
    const totalVestingSharesAsset = this.createAssetWithRequiredSymbol(EAssetName.VESTS, totalVestingShares);

    return safeWasmCall(() => this.proto.cpp_vests_to_hp(vestsAsset, totalVestingFundHiveAsset, totalVestingSharesAsset) as NaiAsset);
  }

  public hpToVests(hive: TNaiAssetSource, totalVestingFundHive: TNaiAssetSource, totalVestingShares: TNaiAssetSource): NaiAsset {
    const hiveAsset = this.createAssetWithRequiredSymbol(EAssetName.HIVE, hive);
    const totalVestingFundHiveAsset = this.createAssetWithRequiredSymbol(EAssetName.HIVE, totalVestingFundHive);
    const totalVestingSharesAsset = this.createAssetWithRequiredSymbol(EAssetName.VESTS, totalVestingShares);

    return safeWasmCall(() => this.proto.cpp_hp_to_vests(hiveAsset, totalVestingFundHiveAsset, totalVestingSharesAsset) as NaiAsset);
  }

  public hbdToHive(hbd: TNaiAssetSource, base: TNaiAssetSource, quote: TNaiAssetSource): NaiAsset {
    const hbdAsset = this.createAssetWithRequiredSymbol(EAssetName.HBD, hbd as NaiAsset);
    const baseAsset = this.createAssetWithRequiredSymbol(EAssetName.HBD, base as NaiAsset);
    const quoteAsset = this.createAssetWithRequiredSymbol(EAssetName.HIVE, quote as NaiAsset);

    return safeWasmCall(() => this.proto.cpp_hbd_to_hive(hbdAsset, baseAsset, quoteAsset) as NaiAsset);
  }

  public hiveToHbd(amount: TNaiAssetSource, base: TNaiAssetSource, quote: TNaiAssetSource): NaiAsset {
    const amountAsset = this.createAssetWithRequiredSymbol(EAssetName.HIVE, amount);
    const baseAsset = this.createAssetWithRequiredSymbol(EAssetName.HBD, base);
    const quoteAsset = this.createAssetWithRequiredSymbol(EAssetName.HIVE, quote);

    return safeWasmCall(() => this.proto.cpp_hive_to_hbd(amountAsset, baseAsset, quoteAsset) as NaiAsset);
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
    this.proto = safeWasmCall(() => new wax.proto_protocol());
    this.protocol = safeWasmCall(() => new wax.protocol());
    this.ASSETS = {
      [EAssetName.HBD]: this.hbdSatoshis(0),
      [EAssetName.HIVE]: this.hiveSatoshis(0),
      [EAssetName.VESTS]: this.vestsSatoshis(0)
    };
  }

  public isValidAccountName(name: string): boolean {
    return safeWasmCall(() => this.proto.cpp_is_valid_account_name(name));
  }

  public createTransactionFromProto(protoTransaction: transaction): ITransaction {
    return new Transaction(this, protoTransaction);
  }

  public createTransactionFromJson(transactionObject: string | object | ApiTransaction): ITransaction {
    return Transaction.fromApi(this, transactionObject);
  }

  public createTransactionWithChainReferenceData(taposBlockId: TBlockHash, chainHeadBlockTime?: Date, expirationTime?: TTimestamp): ITransaction {
    return new Transaction(this, taposBlockId, chainHeadBlockTime, expirationTime);
  }

  public createTransactionWithTaPoS(taposBlockId: TBlockHash, expirationTime?: TTimestamp): ITransaction {
    return new Transaction(this, taposBlockId, undefined, expirationTime);
  }

  private getNaiAssetForAssetName(assetName: EAssetName, assetSource: TNaiAssetConvertible): NaiAsset {
    switch (assetName) {
      case EAssetName.HIVE:
        return this.hiveSatoshis(assetSource);
      case EAssetName.HBD:
        return this.hbdSatoshis(assetSource);
      case EAssetName.VESTS:
        return this.vestsSatoshis(assetSource);
      default:
        throw new WaxError(`Invalid asset name provided: "${assetName}". Expected one of: "${Object.keys(EAssetName).join(", ")}".`);
    }
  }

  public getAsset(nai: NaiAsset): IHiveAssetData {
    const symbol = safeWasmCall(() => this.proto.cpp_asset_symbol(nai));
    const amount = safeWasmCall(() => this.proto.cpp_asset_value(nai));

    return {
      symbol,
      amount
    };
  }

  public get addressPrefix(): string {
    return this.config.HIVE_ADDRESS_PREFIX;
  }

  public getVersion(): string {
    return process.env.npm_package_version as string;
  }

  public getPublicKeyFromSignature(sigDigest: THexString, signature: THexString): THexString {
    const publicKey = safeWasmCall(() => this.proto.cpp_get_public_key_from_signature(sigDigest, signature));

    return this.extract(publicKey);
  }

  public encrypt(provider: ILegacyEncryptionProvider, content: string, mainEncryptionKey: TPublicKey, otherEncryptionKey?: TPublicKey, nonce?: number): string;
  public encrypt(provider: IEncryptionProvider, content: string, recipient: TPublicKey): string;
  public encrypt(provider: IOnlineEncryptionProvider, content: string, recipient: TPublicKey): Promise<string>;
  public encrypt(provider: IEncryptionProvider | ILegacyEncryptionProvider | IOnlineEncryptionProvider, content: string, mainEncryptionKey: TPublicKey, otherEncryptionKey?: TPublicKey, nonce?: number): string | Promise<string> {
    if ("isOnline" in provider) {
      return provider.encryptData(content, mainEncryptionKey);
    } else
      return safeWasmCall(() => this.proto.cpp_crypto_memo_dump_string({
        content: provider.encryptData(content, mainEncryptionKey, otherEncryptionKey, nonce),
        from: mainEncryptionKey,
        to: otherEncryptionKey ?? mainEncryptionKey
      }));
  }

  private cachedConfig: IChainConfig | undefined;

  public get config(): IChainConfig {
    if (this.cachedConfig === undefined) {
      // XXX: This should be an overloaded call with default parameters
      const config = safeWasmCall(() => this.protocol.cpp_get_hive_protocol_config(this.chainId));

      const configToSave = {} as IChainConfig;
      const configKeys = config.keys();
      for(let i = 0; i < configKeys.size(); ++i) {
        const key = configKeys.get(i) as string;

        configToSave[key] = config.get(key) as string;
      }
      this.cachedConfig = configToSave;
    }

    return this.cachedConfig;
  }


  public decrypt(provider: IEncryptionProvider, encrypted: string): string;
  public decrypt(provider: ILegacyEncryptionProvider, encrypted: string): string;
  public decrypt(provider: IOnlineEncryptionProvider, encrypted: string): Promise<string>;
  public decrypt(provider: IOnlineEncryptionProvider | ILegacyEncryptionProvider | IEncryptionProvider, encrypted: string): string | Promise<string> {
    const data = safeWasmCall(() => this.proto.cpp_crypto_memo_from_string(encrypted));

    return provider.decryptData(data.content as string, data.from as string, data.to as string);
  }

/**
   * Allows to scan given text content for references to private keys or account passwords basing on provided account authority information.
   *
   * @remarks This call atm **should be not exposed** to the Wax public interface, as it directly {@link wax_authorities} uses internal type,
   * which is generated from the C++ code and it is very inconvenient in direct TS usage. If we want to expose this method, we should define
   * actual WaxAuthorities interface, operating on native JS containers (Array/Map). Best reuse such type with
   * {@link AccountAuthorityUpdateOperation} implementation.
   *
   * @param content text to be scanned
   * @param account name of account being protected against security leak
   * @param accountAuthorities account authority definition (to retrieve public keys)
   * @param memoKey memo public key
   * @param otherKeys optional list of keys to be checked
   *
   * @throws {WaxError} on found private key references
   *
   * @internal
   *
   */
  public scanForMatchingPrivateKeys(content: string, account: string, accountAuthorities: wax_authorities, memoKey: TPublicKey, otherKeys?: TPublicKey[]): void {
    const actualOtherKeys: VectorString = new this.wax.VectorString();

    if(otherKeys !== undefined) {
      for(const key of otherKeys)
        actualOtherKeys.push_back(key);
    }

    safeWasmCall(()=>this.proto.cpp_scan_text_for_matching_private_keys(content, account, accountAuthorities, memoKey, actualOtherKeys),
      (e: TWaxStdExceptionData): void => {
        if(e.msg === "Detected private key leak.") {
          const json = e.data as {public_key: string, authority_role: string};
          throw new WaxPrivateKeyLeakDetectedException(e.msg, json.public_key, account, json.authority_role);
        }
      }
    );
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
    const maxMana: Long = typeof maxManaLH === "object" ? maxManaLH : Long.fromValue(maxManaLH, true);
    const currentMana: Long = typeof currentManaLH === "object" ? currentManaLH : Long.fromValue(currentManaLH, true);

    if(maxMana.equals(0))
      return {
        max: maxMana,
        current: Long.ZERO,
        percent: 100
      };

    const manabarValue = safeWasmCall(() => this.proto.cpp_calculate_current_manabar_value(now, maxMana.low, maxMana.high, currentMana.low, currentMana.high, lastUpdateTime));

    const current = Long.fromString(this.extract(manabarValue), true);

    const percent = this.calculateManabarPercent(current, maxMana);

    return {
      max: maxMana,
      current,
      percent
    };
  }

  public calculateManabarFullRegenerationTime(now: number, maxManaLH: number | string | Long, currentManaLH: number | string | Long, lastUpdateTime: number): number {
    const maxMana: Long = typeof maxManaLH === "object" ? maxManaLH : Long.fromValue(maxManaLH, true);
    const currentMana: Long = typeof currentManaLH === "object" ? currentManaLH : Long.fromValue(currentManaLH, true);

    if(maxMana.equals(0))
      return Math.floor(Date.now() / 1000);

    const manabarRegenerationTime = safeWasmCall(() => this.proto.cpp_calculate_manabar_full_regeneration_time(now, maxMana.low, maxMana.high, currentMana.low, currentMana.high, lastUpdateTime));

    return Number.parseInt(this.extract(manabarRegenerationTime));
  }

  public suggestBrainKey(): IBrainKeyData {
    const data = safeWasmCall(() => this.proto.cpp_suggest_brain_key());

    return {
      associatedPublicKey: data.associated_public_key as string,
      brainKey: data.brain_key as string,
      wifPrivateKey: data.wif_private_key as string
    };
  }

  public getPrivateKeyFromPassword(account: string, role: string, password: string): IPrivateKeyData {
    const data = safeWasmCall(() => this.proto.cpp_generate_private_key_password_based(account, role, password));

    return {
      associatedPublicKey: data.associated_public_key as string,
      wifPrivateKey: data.wif_private_key as string
    };
  }

  public convertRawPrivateKeyToWif(rawPrivateKey: THexString): string {
    const wif = safeWasmCall(() => this.proto.cpp_convert_raw_private_key_to_wif(rawPrivateKey));
    return wif;
  }

  public convertRawPublicKeyToWif(rawPublicKey: THexString): string {
    const wif = safeWasmCall(() => this.proto.cpp_convert_raw_public_key_to_wif(rawPublicKey));
    return wif;
  }

  public calculateAccountHp(vests: TNaiAssetSource, totalVestingFundHive: TNaiAssetSource, totalVestingShares: TNaiAssetSource): NaiAsset {
    const vestsAsset = this.createAssetWithRequiredSymbol(EAssetName.VESTS, vests);
    const totalVestingFundHiveAsset = this.createAssetWithRequiredSymbol(EAssetName.HIVE, totalVestingFundHive);
    const totalVestingSharesAsset = this.createAssetWithRequiredSymbol(EAssetName.VESTS, totalVestingShares);
    return this.vestsToHp(vestsAsset, totalVestingFundHiveAsset, totalVestingSharesAsset);
  }

  public calculateWitnessVotesHp(votes: TNaiAssetSource, totalVestingFundHive: TNaiAssetSource, totalVestingShares: TNaiAssetSource): NaiAsset {
    const voteVests = this.createAssetWithRequiredSymbol(EAssetName.VESTS, votes);
    const totalVestingFundHiveAsset = this.createAssetWithRequiredSymbol(EAssetName.HIVE, totalVestingFundHive);
    const totalVestingSharesAsset = this.createAssetWithRequiredSymbol(EAssetName.VESTS, totalVestingShares);

    return this.vestsToHp(voteVests, totalVestingFundHiveAsset, totalVestingSharesAsset);
  }

  public calculateHpApr(headBlockNum: number, vestingRewardPercent: number, virtualSupply: TNaiAssetSource, totalVestingFundHive: TNaiAssetSource): number {
    const virtualSupplyAsset = this.createAssetWithRequiredSymbol(EAssetName.HIVE, virtualSupply);
    const totalVestingFundHiveAsset = this.createAssetWithRequiredSymbol(EAssetName.HIVE, totalVestingFundHive);

    const hpApr = safeWasmCall(() => this.proto.cpp_calculate_hp_apr(headBlockNum, vestingRewardPercent, virtualSupplyAsset, totalVestingFundHiveAsset));

    return Number.parseFloat(this.extract(hpApr));
  }

  public delete(): void {
    safeWasmCall(() => this.proto.delete());
    safeWasmCall(() => this.protocol.delete());
  }
}

