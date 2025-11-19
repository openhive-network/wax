import type { IBinaryViewArrayNode, IBinaryViewNode, IBinaryViewOutputData, IBrainKeyData, IHiveAssetData, IManabarData, IPrivateKeyData, ITransaction, IWaxBaseInterface, TBlockHash, THexString, TNaiAssetConvertible, TNaiAssetSource, TPublicKey, TTimestamp } from "./interfaces";
import type { binary_data_node, json_price, MainModule, protocol_foundation, VectorBinaryDataNode, VectorString, witness_set_properties_data, wax_authorities } from "../build_wasm/wax.common";
import type { IChainConfig } from "../build_wasm/config";
import type { ApiOperation, LegacyApiTransaction, NaiAsset } from "./api";

import { ApiTransaction } from "./api";
import type { TAccountName } from "./hive_apps_operations";
import { comment_options, operation, transaction } from "./protocol";

import { WaxError } from './errors.js';
import { matchesHiveProtocolType } from "./util/proto_type_utils";
import { Transaction } from "./transaction.js";

import { WaxFormatter } from "./formatters/waxify.js";

import { isNaiAsset } from "./util/asset_util.js";

import type { AccountAuthorityUpdateOperation } from "./complex_operations"; // only for TypeDoc purposes :-(
import { ISignatureProvider } from "./extensions/signatures";
import { WasmManager } from "./util/wasm_errors";
import { ensureUnixTimestamp } from "./util";

const PERCENT_VALUE_DOUBLE_PRECISION = 100;
export const ONE_HUNDRED_PERCENT = BigInt(100) * BigInt(PERCENT_VALUE_DOUBLE_PRECISION);

export enum EAssetName {
  HIVE = "HIVE",
  HBD = "HBD",
  VESTS = "VESTS"
}

class BlockchainDefaultInitializer {
  public static defaultCommentOptions(protocol: protocol_foundation): comment_options {
    const opResult = JSON.parse(protocol.cpp_get_default_comment_options_operation());

    return comment_options.fromJSON(opResult);
  }
};

export class WaxBaseApi implements IWaxBaseInterface {
  public readonly protocol: protocol_foundation;

  public readonly ASSETS: Readonly<Record<EAssetName, NaiAsset>>;
  private readonly blockChainDefaultCommentOptions: comment_options;

  public constructor(
    public readonly wasmManager: WasmManager,
    public readonly wax: MainModule,
    public readonly chainId: string
  ) {
    this.protocol = new wax.protocol_foundation();
    this.blockChainDefaultCommentOptions = BlockchainDefaultInitializer.defaultCommentOptions(this.protocol);

    this.ASSETS = {
      [EAssetName.HBD]: this.hbdSatoshis(0),
      [EAssetName.HIVE]: this.hiveSatoshis(0),
      [EAssetName.VESTS]: this.vestsSatoshis(0)
    };
  }

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
    const opHandle = this.wasmManager.safeWasmCall(() => this.protocol.cpp_create_operation_handle(operation, !matchesHiveProtocolType(operation)));

    const result = this.wasmManager.safeWasmCall(() => this.protocol.cpp_op_binary(opHandle, isHf26Serialization));

    return {
      binary: result.binary as string,
      offsets: this.parseBinaryMetadataChildren(result.offsets) as IBinaryViewNode[]
    };
  }

  public operationGetImpactedAccounts(op: operation | ApiOperation): Set<TAccountName> {
    const opHandle = this.wasmManager.safeWasmCall(() => this.protocol.cpp_create_operation_handle(op, !matchesHiveProtocolType(op)));

    const vector = this.wasmManager.safeWasmCall(() => this.protocol.cpp_op_impacted_accounts(opHandle));

    const resultingSet = new Set<TAccountName>();

    for(let i = 0; i < vector.size(); ++i) {
      const collectedAccountName = vector.get(i) as TAccountName;
      resultingSet.add(collectedAccountName);
    }

    return resultingSet;
  }

  public getDefaultCommentOptionsOperation(author: TAccountName, permlink: string): comment_options {
    const commentOptionOp = comment_options.fromPartial(this.blockChainDefaultCommentOptions);
    commentOptionOp.author = author;
    commentOptionOp.permlink = permlink;

    return commentOptionOp;
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

    return this.wasmManager.safeWasmCall(() => this.protocol.cpp_estimate_hive_collateral(currentMedianHistory, currentMinHistory, actualHbdAmountToGet) as NaiAsset);
  }

  public estimateHbdInterest(accountHdbSeconds: TNaiAssetConvertible, hbdSavingsBalance: TNaiAssetSource, lastCompoundingDate: TTimestamp, now: TTimestamp, interestRate: number): NaiAsset {
    const hdbSeconds = BigInt(accountHdbSeconds);
    const hbdSecondsLo = hdbSeconds & BigInt(0xFFFFFFFFFFFFFFFFn);
    const hbdSecondsHi = hdbSeconds >> 64n;

    const nowTimestamp = ensureUnixTimestamp(now);
    const lastCompoundingTimestamp = ensureUnixTimestamp(lastCompoundingDate);
    const hbdBalance = this.createAssetWithRequiredSymbol(EAssetName.HBD, hbdSavingsBalance);

    return this.wasmManager.safeWasmCall(() => this.protocol.cpp_evaluate_hbd_interest(hbdSecondsLo, hbdSecondsHi, nowTimestamp, hbdBalance,
       lastCompoundingTimestamp, interestRate) as NaiAsset);
  }

  public deserializeWitnessProps(serializedWitnessProps: Array<[string, string]>): witness_set_properties_data {
    const map = new this.wax.MapStringString();
    for (const [key, serializedValue] of serializedWitnessProps)
      map.set(key, serializedValue);

    return this.wasmManager.safeWasmCall(() => this.protocol.cpp_deserialize_witness_set_properties(map));
  }

  public serializeWitnessProps(witnessProps: witness_set_properties_data): Record<string, string> {
    const propsSerialized = this.wasmManager.safeWasmCall(() => this.protocol.cpp_serialize_witness_set_properties(witnessProps));
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

    return tx.toBinaryForm(stripToUnsignedTransaction);
  }

  public convertTransactionFromBinaryForm(transaction: THexString): ApiTransaction {
    const txHandle = this.wasmManager.safeWasmCall(() => this.protocol.cpp_deserialize_transaction(transaction));

    return JSON.parse(this.wasmManager.safeWasmCall(() => this.protocol.cpp_tx_to_json(txHandle))) as ApiTransaction;
  }

  private naiAssetToLong(amount: number, precision: number): bigint {
    const [ base, frac ] = amount.toString().split('.') as [string, string | undefined];
    let satoshisValue = BigInt(base) * BigInt(10 ** precision);
    if (frac)
      satoshisValue += BigInt(frac.substring(0, precision) + '0'.repeat(Math.max(0, precision - frac.length)));

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
    return this.wasmManager.safeWasmCall(() => this.protocol.cpp_hive(BigInt(amount)) as NaiAsset);
  }

  public hbdSatoshis(amount: TNaiAssetConvertible): NaiAsset {
    return this.wasmManager.safeWasmCall(() => this.protocol.cpp_hbd(BigInt(amount)) as NaiAsset);
  }

  public vestsSatoshis(amount: TNaiAssetConvertible): NaiAsset {
    return this.wasmManager.safeWasmCall(() => this.protocol.cpp_vests(BigInt(amount)) as NaiAsset);
  }

  public vestsToHp(vests: TNaiAssetSource, totalVestingFundHive: TNaiAssetSource, totalVestingShares: TNaiAssetSource): NaiAsset {
    const vestsAsset = this.createAssetWithRequiredSymbol(EAssetName.VESTS, vests);
    const totalVestingFundHiveAsset = this.createAssetWithRequiredSymbol(EAssetName.HIVE, totalVestingFundHive);
    const totalVestingSharesAsset = this.createAssetWithRequiredSymbol(EAssetName.VESTS, totalVestingShares);

    return this.wasmManager.safeWasmCall(() => this.protocol.cpp_vests_to_hp(vestsAsset, totalVestingFundHiveAsset, totalVestingSharesAsset) as NaiAsset);
  }

  public hpToVests(hive: TNaiAssetSource, totalVestingFundHive: TNaiAssetSource, totalVestingShares: TNaiAssetSource): NaiAsset {
    const hiveAsset = this.createAssetWithRequiredSymbol(EAssetName.HIVE, hive);
    const totalVestingFundHiveAsset = this.createAssetWithRequiredSymbol(EAssetName.HIVE, totalVestingFundHive);
    const totalVestingSharesAsset = this.createAssetWithRequiredSymbol(EAssetName.VESTS, totalVestingShares);

    return this.wasmManager.safeWasmCall(() => this.protocol.cpp_hp_to_vests(hiveAsset, totalVestingFundHiveAsset, totalVestingSharesAsset) as NaiAsset);
  }

  public hbdToHive(hbd: TNaiAssetSource, base: TNaiAssetSource, quote: TNaiAssetSource): NaiAsset {
    const hbdAsset = this.createAssetWithRequiredSymbol(EAssetName.HBD, hbd as NaiAsset);
    const baseAsset = this.createAssetWithRequiredSymbol(EAssetName.HBD, base as NaiAsset);
    const quoteAsset = this.createAssetWithRequiredSymbol(EAssetName.HIVE, quote as NaiAsset);

    return this.wasmManager.safeWasmCall(() => this.protocol.cpp_hbd_to_hive(hbdAsset, baseAsset, quoteAsset) as NaiAsset);
  }

  public hiveToHbd(amount: TNaiAssetSource, base: TNaiAssetSource, quote: TNaiAssetSource): NaiAsset {
    const amountAsset = this.createAssetWithRequiredSymbol(EAssetName.HIVE, amount);
    const baseAsset = this.createAssetWithRequiredSymbol(EAssetName.HBD, base);
    const quoteAsset = this.createAssetWithRequiredSymbol(EAssetName.HIVE, quote);

    return this.wasmManager.safeWasmCall(() => this.protocol.cpp_hive_to_hbd(amountAsset, baseAsset, quoteAsset) as NaiAsset);
  }

  public isValidAccountName(name: string): boolean {
    return this.wasmManager.safeWasmCall(() => this.protocol.cpp_is_valid_account_name(name));
  }

  public createTransactionFromProto(protoTransaction: transaction): ITransaction {
    return new Transaction(this, { protoTransaction });
  }

  public createTransactionFromJson(transactionData: string | object | ApiTransaction): ITransaction {
    return Transaction.fromApi(this, transactionData);
  }

  public createTransactionFromLegacyJson(transactionData: string | object | LegacyApiTransaction): ITransaction {
    const legacyTxStr = typeof transactionData === "string" ? transactionData : JSON.stringify(transactionData);
    const newTxStr = this.wasmManager.safeWasmCall(() => this.protocol.cpp_legacy_tx_to_json(legacyTxStr));

    return this.createTransactionFromJson(newTxStr);
  }

  public createTransactionWithChainReferenceData(taposBlockId: TBlockHash, headBlockTime?: Date, expirationTime?: TTimestamp): ITransaction {
    return new Transaction(this, { taposBlockId, headBlockTime, expirationTime });
  }

  public createTransactionWithTaPoS(taposBlockId: TBlockHash, expirationTime?: TTimestamp): ITransaction {
    return new Transaction(this, { taposBlockId, expirationTime });
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
    const symbol = this.wasmManager.safeWasmCall(() => this.protocol.cpp_asset_symbol(nai));
    const amount = this.wasmManager.safeWasmCall(() => this.protocol.cpp_asset_value(nai));

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
    const publicKey = this.wasmManager.safeWasmCall(() => this.protocol.cpp_get_public_key_from_signature(sigDigest, signature));

    return publicKey;
  }

  public encrypt(wallet: ISignatureProvider, content: string, mainEncryptionKey: TPublicKey, otherEncryptionKey?: TPublicKey, nonce?: number): string {
    const encrypted = wallet.encryptData(content, mainEncryptionKey, otherEncryptionKey, nonce);

    return this.wasmManager.safeWasmCall(() => this.protocol.cpp_crypto_memo_dump_string({
      content: encrypted,
      from: mainEncryptionKey,
      to: otherEncryptionKey ?? mainEncryptionKey
    }));
  }

  private cachedConfig: IChainConfig | undefined;

  public get config(): IChainConfig {
    if (this.cachedConfig === undefined) {
      // XXX: This should be an overloaded call with default parameters
      const config = this.wasmManager.safeWasmCall(() => this.protocol.cpp_get_hive_protocol_config(this.chainId));

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

  public decrypt(wallet: ISignatureProvider, encrypted: string): string {
    const data = this.wasmManager.safeWasmCall(() => this.protocol.cpp_crypto_memo_from_string(encrypted));

    return wallet.decryptData(data.content as string, data.from as string, data.to as string);
  }

/**
   * Allows to scan given text content for references to private keys or account passwords basing on provided account authority information.
   *
   * @remarks This call atm **should be not exposed** to the Wax public interface, as it directly {@link wax_authorities} uses internal type,
   * which is generated from the C++ code and it is very inconvenient in direct TS usage. If we want to expose this method, we should define
   * actual WaxAuthorities interface, operating on native JS containers (Array/Map). Best reuse such type with
   * {@link AccountAuthorityUpdateOperation} implementation.
   *
   * @param {string} content text to be scanned
   * @param {string} account name of account being protected against security leak
   * @param {wax_authorities} accountAuthorities account authority definition (to retrieve public keys)
   * @param {TPublicKey} memoKey memo public key
   * @param {TPublicKey[]} [otherKeys] optional list of keys to be checked
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

    this.wasmManager.safeWasmCall(() => this.protocol.cpp_scan_text_for_matching_private_keys(content, account, accountAuthorities, memoKey, actualOtherKeys));
  }

  private calculateManabarPercent(current: bigint, max: bigint): number {
    if(max === 0n)
      return 0;

    const percent = Number((current * ONE_HUNDRED_PERCENT) / max) / PERCENT_VALUE_DOUBLE_PRECISION;

    return percent;
  }

  public calculateCurrentManabarValue(now: number, maxMana: TNaiAssetConvertible, currentMana: TNaiAssetConvertible, lastUpdateTime: number): IManabarData {
    if(maxMana == 0) // Intentionally do not use type check comparison (`===`) for universal check between number, string and bigint
      return {
        max: BigInt(0),
        current: BigInt(0),
        percent: 100
      };

    const maxManaBigInt = BigInt(maxMana);
    const currentManaBigInt = BigInt(currentMana);

    const manabarValue = this.wasmManager.safeWasmCall(() => this.protocol.cpp_calculate_current_manabar_value(now, maxManaBigInt, currentManaBigInt, lastUpdateTime));

    const percent = this.calculateManabarPercent(manabarValue, maxManaBigInt);

    return {
      max: maxManaBigInt,
      current: manabarValue,
      percent
    };
  }

  public calculateManabarFullRegenerationTime(now: number, maxMana: TNaiAssetConvertible, currentMana: TNaiAssetConvertible, lastUpdateTime: number): number {
    if(maxMana == 0) // Intentionally do not use type check comparison (`===`) for universal check between number, string and bigint
      return Math.floor(Date.now() / 1000);

    const manabarRegenerationTime = this.wasmManager.safeWasmCall(() => this.protocol.cpp_calculate_manabar_full_regeneration_time(now, BigInt(maxMana), BigInt(currentMana), lastUpdateTime));

    return Number(manabarRegenerationTime);
  }

  public suggestBrainKey(): IBrainKeyData {
    const data = this.wasmManager.safeWasmCall(() => this.protocol.cpp_suggest_brain_key());

    return {
      associatedPublicKey: data.associated_public_key as string,
      brainKey: data.brain_key as string,
      wifPrivateKey: data.wif_private_key as string
    };
  }

  public getPrivateKeyFromPassword(account: string, role: string, password: string): IPrivateKeyData {
    const data = this.wasmManager.safeWasmCall(() => this.protocol.cpp_generate_private_key_password_based(account, role, password));

    return {
      associatedPublicKey: data.associated_public_key as string,
      wifPrivateKey: data.wif_private_key as string
    };
  }

  public convertRawPrivateKeyToWif(rawPrivateKey: THexString): string {
    const wif = this.wasmManager.safeWasmCall(() => this.protocol.cpp_convert_raw_private_key_to_wif(rawPrivateKey));
    return wif;
  }

  public convertRawPublicKeyToWif(rawPublicKey: THexString): string {
    const wif = this.wasmManager.safeWasmCall(() => this.protocol.cpp_convert_raw_public_key_to_wif(rawPublicKey));
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

    const hpApr = this.wasmManager.safeWasmCall(() => this.protocol.cpp_calculate_hp_apr(headBlockNum, vestingRewardPercent, virtualSupplyAsset, totalVestingFundHiveAsset));

    return Number.parseFloat(hpApr);
  }

  public delete(): void {
    this.wasmManager.safeWasmCall(() => this.protocol.delete());
  }
}

