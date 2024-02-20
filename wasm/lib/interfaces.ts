import type { IBeekeeperUnlockedWallet, TPublicKey } from "@hive/beekeeper";

// @ts-expect-error ts(6133) Type WaxError is used in JSDoc
import type { WaxError } from "./errors";
import type { operation, transaction } from "./protocol";
import type { EManabarType } from "./detailed/chain_api";
import type { HiveApiTypes } from "./detailed/chain_api_data";
import type { IWaxExtendableFormatter } from "./detailed/formatters/types";
import type { IHiveAppsOperation, NaiAsset } from "./detailed";
import type Long from "long";

export type TTimestamp = Date | number | string;

/**
 * String in hex format
 */
export type THexString = string;

/**
 * Block id type
 *
 * 20 byte string or hex string describing 20 byte array
 */
export type TBlockHash = ArrayBuffer | Uint8Array | Uint8ClampedArray | Int8Array | string;

export interface IManabarData {
  /**
   * Current manabar value
   *
   * @type {Long}
   */
  current: Long;

  /**
   * Maximum manabar value
   *
   * @type {Long}
   */
  max: Long;

  /**
   * Percent of manabar load with two digits of precision, safely calculated based on the {@link current} and {@link max} values (prevents 64-bit Long precision overflow)
   *
   * @type {number}
   */
  percent: number;
}

/**
 * Transaction id type
 *
 * 20 byte string or hex string describing 20 byte array
 */
export type TTransactionId = string;

export interface IWaxOptions {
  chainId: string;
}

export interface IWaxOptionsChain extends IWaxOptions {
  /**
   * Endpoint for all of the API requests
   *
   * @default "https://api.hive.blog/"
   * @type {string}
   */
  apiEndpoint: string;
}

export interface ITransactionBuilder {
  /**
   * Pushes given operation to the operations array in the transaction
   *
   * @param {operation | IHiveAppsOperation} op operation to append to the transaction (can be hive apps operation)
   *
   * @returns {ITransactionBuilder} current transaction builder instance
   *
   * @throws {WaxError} on any Wax API-related error
   */
  push(op: operation | IHiveAppsOperation): ITransactionBuilder;

  /**
   * Generates digest of the transaction for signing
   *
   * @type {THexString} digest of the transaction for signing in hex form
   *
   * @throws {WaxError} on any Wax API-related error
   */
  get sigDigest(): THexString;

  /**
   * Generates id of the transaction
   *
   * @type {TTransactionId} id of the transaction in hex form
   *
   * @throws {WaxError} on any Wax API-related error
   */
  get id(): TTransactionId;

  /**
   * Returns signature keys from the transaction signatures
   *
   * @type {Array<THexString>} list of all the public keys that were used to sign the transaction
   *
   * @throws {WaxError} on any Wax API-related error
   */
  get signatureKeys(): Array<THexString>;

  /**
   * Validates current transaction. Throws on error
   *
   * @throws {WaxError} on any Wax API-related error including validation error
   */
  validate(): void;

  /**
   * Converts transaction object into the protobuf JSON string
   *
   * @returns {string} protobuf JSON string
   *
   * @throws {WaxError} on any Wax API-related error including validation error
   */
  toString(): string;

  /**
   * Signs the transaction using given public key. Applies the transaction expiration time
   *
   * Note: Only the first call to {@link toApi}, {@link toString}, {@link sigDigest}, {@link id}, {@link signatureKeys}, {@link validate}, {@link build} or {@link sign}
   *       will apply the expiration times (relative or absolute) to ensure validity of all of the signatures
   *
   * @param {IBeekeeperUnlockedWallet} wallet unlocked wallet to be used for signing (overrides default Wax Base wallet)
   * @param {TPublicKey} publicKey publicKey for signing (should be available in the wallet)
   *
   * @returns {THexString} transaction signature signed using given key
   *
   * @throws {WaxError} on any Wax API-related error or no public key found in the unlocked wallet or wallet is locked
   */
  sign(wallet: IBeekeeperUnlockedWallet, publicKey: TPublicKey): THexString;

  /**
   * Checks if underlying transaction has been already signed at least one time (after {@link sign} or {@link build})
   *
   * @returns {boolean} either true or false based on the signatures amount
   */
  isSigned(): boolean;

  /**
   * Signs the transaction using given public key and returns the proto transaction. Applies the transaction expiration time
   *
   * Note: Only the first call to {@link toApi}, {@link toString}, {@link sigDigest}, {@link id}, {@link signatureKeys}, {@link validate}, {@link build} or {@link sign}
   *       will apply the expiration times (relative or absolute) to ensure validity of all of the signatures
   *
   * @param {IBeekeeperUnlockedWallet} wallet unlocked wallet to be used for signing (overrides default Wax Base wallet)
   * @param {TPublicKey} publicKey publicKey for signing (should be available in the wallet)
   *
   * @returns {transaction} signed protobuf transaction object
   *
   * @throws {WaxError} on any Wax API-related error or no public key found in the unlocked wallet or wallet is locked
   */
  build(wallet: IBeekeeperUnlockedWallet, publicKey: TPublicKey): transaction;

  /**
   * Adds your signature to the internal signatures array and returns the proto transaction. Applies the transaction expiration time
   *
   * Note: Only the first call to {@link toApi}, {@link toString}, {@link sigDigest}, {@link id}, {@link signatureKeys}, {@link validate}, {@link build} or {@link sign}
   *       will apply the expiration times (relative or absolute) to ensure validity of all of the signatures
   *
   * @param {THexString} signature signature to add
   *
   * @returns {transaction} signed protobuf transaction object
   *
   * @throws {WaxError} on any Wax API-related error or no public key found in the unlocked wallet or wallet is locked
   */
  build(signature: THexString): transaction;

  /**
   * Returns the proto transaction. Applies the transaction expiration time.
   *
   * Note: Only the first call to {@link toApi}, {@link toString}, {@link sigDigest}, {@link id}, {@link signatureKeys}, {@link validate}, {@link build} or {@link sign}
   *       will apply the expiration times (relative or absolute) to ensure validity of all of the signatures
   *
   * @returns {transaction} transaction
   *
   * @throws {WaxError} on any Wax API-related error or no public key found in the unlocked wallet or wallet is locked
   */
  build(): transaction;

  /**
   * Converts the created transaction into the Hive API-form string
   *
   * @returns {string} transaction in Hive API-form
   *
   * @throws {WaxError} on any Wax API-related error
   */
  toApi(): string;
}

export interface ITransactionBuilderConstructor {
  /**
   * Constructs a new Transaction Builder object with given data
   *
   * @param {TBlockHash} taposBlockId reference block id (can be head block id) for TaPoS
   * @param {TTimestamp} expirationTime expiration time for the transaction. Applies upon the {@link ITransactionBuilder.build} call.
   *                                    Can be either any argument parsable by the {@link Date} constructor or relative time in seconds, minutes or hours
   *                                    (remember maximum expiration time for the transaction in mainnet is 1 hour), e.g.:
   *                                    `1699550966300` `"2023-11-09T17:29:30.028Z"` `new Date()` `"+10s"` `+30m` `+1h`
   */
  new(taposBlockId: TBlockHash, expirationTime: TTimestamp): ITransactionBuilder;

  /**
   * Constructs a new Transaction Builder object with ready protobuf transaction
   *
   * @param {transaction} protoTransaction protobuf transaction
   */
  new(protoTransaction: transaction): ITransactionBuilder;

  /**
   * Converts Hive API-form transaction in JSON form to our transaction builder
   *
   * @param {string|object} transactionObject transaction object to be converted
   *
   * @returns {ITransactionBuilder} transaction builder containing ready to sign transaction (or to convert to protobuf structure using {@link ITransactionBuilder.build})
   *
   * @throws {WaxError} on any Wax API-related error
   */
  fromApi(transactionObject: string | object): ITransactionBuilder;
}

export interface IHiveAssetData {
  /**
   * Asset amount
   *
   * @example "1.100"
   */
  amount: string;

  /**
   * Asset symbol
   *
   * @example "HIVE"
   */
  symbol: string;
}

export interface IWaxBaseInterface {
  get TransactionBuilder(): ITransactionBuilderConstructor;

  readonly formatter: IWaxExtendableFormatter;
  readonly waxify: IWaxExtendableFormatter['waxify'];

  /**
   * Retrieves asset amount and symbol from the api data
   *
   * @param {NaiAsset} nai API asset
   * @returns {IHiveAssetData} asset data
   */
  getAsset(nai: NaiAsset): IHiveAssetData;

  /**
   * Retrieves the public key in wif format from the given sig digest and signature in hexadecimal format
   *
   * @param {THexString} sigDigest digest data in hexadecimal format
   * @param {THexString} signature signature in hexadecimal format
   *
   * @returns {THexString} public key used in the signature
   *
   * @throws {WaxError} on any Wax API-related error
   */
  getPublicKeyFromSignature(sigDigest: THexString, signature: THexString): THexString;

  /**
   * Calculates current manabar value for Hive account based on given arguments
   *
   * @param {number} now head block time. Can be obtained using time property from dynamic global properties
   * @param {number | string | Long} maxManaLH maximum account mana. Should equal post_voting_power.amount from the find_account API call for upvotes.
   *                                           For downvotes remember to multiply this value by downvote_pool_percent from the dynamic global properties API call.
   *                                           For rc manabar calculations use max_rc value from the rc_accounts API call.
   * @param {number | string | Long} currentManaLH current account mana. Should equal voting_manabar.current_mana from the find_account API call for upvotes or downvote_manabar.current_mana for downvotes
   *                                               For rc manabar calculations use rc_manabar value from the rc_accounts API call
   * @param {number} lastUpdateTime last update of the current account mana. Should equal voting_manabar.last_update_time from the find_account API call for upvotes or downvote_manabar.current_mana for downvotes
   *                                               For rc manabar calculations use rc_manabar value from the rc_accounts API call
   *
   * @returns {IManabarData} Manabar data
   */
  calculateCurrentManabarValue(now: number, maxManaLH: number | string | Long, currentManaLH: number | string | Long, lastUpdateTime: number): IManabarData;

  /**
   * Calculates full regeneration time of the manabar value for Hive account based on given arguments
   *
   * @param {number} now head block time. Can be obtained using time property from dynamic global properties
   * @param {number | string | Long} maxManaLH maximum account mana. Should equal post_voting_power.amount from the find_account API call for upvotes.
   *                                           For downvotes remember to multiply this value by downvote_pool_percent from the dynamic global properties API call.
   *                                           For rc manabar calculations use max_rc value from the rc_accounts API call.
   * @param {number | string | Long} currentManaLH current account mana. Should equal voting_manabar.current_mana from the find_account API call for upvotes or downvote_manabar.current_mana for downvotes
   *                                               For rc manabar calculations use rc_manabar value from the rc_accounts API call
   * @param {number} lastUpdateTime last update of the current account mana. Should equal voting_manabar.last_update_time from the find_account API call for upvotes or downvote_manabar.current_mana for downvotes
   *                                               For rc manabar calculations use rc_manabar value from the rc_accounts API call
   *
   * @returns {number} Full regeneration timestamp (in seconds)
   */
  calculateManabarFullRegenerationTime(now: number, maxManaLH: number | string | Long, currentManaLH: number | string | Long, lastUpdateTime: number): number;

  /**
   * Deletes the created wax proto_protocol instance
   */
  delete(): void;
}

/**
 * @internal
 */
export type ApiData<T extends keyof typeof HiveApiTypes> = YourApiData<typeof HiveApiTypes[T]>;

export type TWaxApiRequest<TReq, TRes> = { readonly params: TReq; readonly result: TRes; };

/**
 * @internal
 */
export type YourApiData<YourTypes> = {
  [P in keyof YourTypes]: YourTypes[P] extends { readonly params: new (...args: any) => Readonly<infer ParamsType>; readonly result: new (...args: any) => Readonly<infer ResultType>; }
    ? (params: ParamsType) => Promise<ResultType>
    : (YourTypes[P] extends { readonly params: infer ParamsType; readonly result: infer ResultType; } ? (params: ParamsType) => Promise<ResultType> : never);
};

/**
 * @internal
 */
export interface IHiveApi {
  account_by_key_api: Readonly<ApiData<'account_by_key_api'>>;
  block_api: Readonly<ApiData<'block_api'>>;
  database_api: Readonly<ApiData<'database_api'>>;
  network_broadcast_api: Readonly<ApiData<'network_broadcast_api'>>;
  rc_api: Readonly<ApiData<'rc_api'>>;
}

export type TWaxExtended<YourApi> = IHiveChainInterface & { api: IHiveApi & { [k in keyof YourApi]: Readonly<YourApiData<YourApi[k]>> } };

export interface IHiveChainInterface extends IWaxBaseInterface {
  /**
   * Same as {@link IWaxBaseInterface.TransactionBuilder}, but pulls the reference block data from the remote
   *
   * @param {?TTimestamp} expirationTime expiration time for the transaction. Applies upon the {@link ITransactionBuilder.build} call.
   *                                     Can be either any argument parsable by the {@link Date} constructor or relative time in seconds, minutes or hours
   *                                     (remember maximum expiration time for the transaction in mainnet is 1 hour), e.g.:
   *                                     `1699550966300` `"2023-11-09T17:29:30.028Z"` `new Date()` `"+10s"` `+30m` `+1h`. Defaults to `+1m`
   *
   * @returns {ITransactionBuilder} ready to use transaction builder interface
   *
   * @throws {WaxError} on any Wax API-related error
   * @throws {WaxChainApiError} on any Hive API-related error
   */
  getTransactionBuilder(expirationTime?: TTimestamp): Promise<ITransactionBuilder>;

  /**
   * Extends hive chain interface with your custom API definitions
   *
   * @param extendedHiveApiData your custom api definitions for use with class-validators and class-transformers
   *
   * @returns Wax Hive chain instance containing extended api
   */
  extend<YourApi>(extendedHiveApiData: YourApi): TWaxExtended<YourApi>;

  /**
   * Extends hive chain interface with your custom API definitions (allows you to call remote endpoints without response validation)
   *
   * @returns Wax Hive chain instance containing extended api
   */
  extend<YourApi>(): TWaxExtended<YourApi>;

  /**
   * Calculates current manabar value for Hive account based on given arguments
   *
   * @param {string} account account for which we want to calculate current manabar value
   * @param {?EManabarType} manabarType manabar type to calculate (can be upvote, downvote or rc manabar. Defaults to {@link EManabarType.UPVOTE})
   *
   * @returns {Promise<IManabarData>} Manabar data
   */
  calculateCurrentManabarValueForAccount(account: string, manabarType?: EManabarType): Promise<IManabarData>;

  /**
   * Calculates full regeneration time of the manabar value for Hive account based on given arguments
   *
   * @param {string} account account for which we want to calculate manabar full regeneration time
   * @param {?EManabarType} manabarType manabar type to calculate (can be upvote, downvote or rc manabar. Defaults to {@link EManabarType.UPVOTE})
   *
   * @returns {Promise<Date>} Full regeneration time
   */
  calculateManabarFullRegenerationTimeForAccount(account: string, manabarType?: EManabarType): Promise<Date>;

  readonly api: Readonly<IHiveApi>;
}
