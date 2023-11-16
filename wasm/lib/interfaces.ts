import type { IBeekeeperUnlockedWallet, TPublicKey } from "@hive/beekeeper";

import type { operation, transaction } from "./protocol";
import type { HiveApiTypes } from "./detailed/chain_api_data";

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
   * @param {operation} op operation to append to the transaction
   *
   * @returns {ITransactionBuilder} current transaction builder instance
   *
   * @throws {import("./errors").WaxError} on any Wax API-related error
   */
  push(op: operation): ITransactionBuilder;

  /**
   * Generates digest of the transaction for signing
   *
   * @type {THexString} digest of the transaction for signing in hex form
   *
   * @throws {import("./errors").WaxError} on any Wax API-related error
   */
  get sigDigest(): THexString;

  /**
   * Generates id of the transaction
   *
   * @type {TTransactionId} id of the transaction in hex form
   *
   * @throws {import("./errors").WaxError} on any Wax API-related error
   */
  get id(): TTransactionId;

  /**
   * Validates current transaction. Throws on error
   *
   * @throws {import("./errors").WaxError} on any Wax API-related error including validation error
   */
  validate(): void;

  /**
   * Converts transaction object into the protobuf JSON string
   *
   * @returns {string} protobuf JSON string
   *
   * @throws {import("./errors").WaxError} on any Wax API-related error including validation error
   */
  toString(): string;

  /**
   * Signs the transaction using given public key. Applies the transaction expiration time
   *
   * Note: Only the first call to {@link toApi}, {@link toString}, {@link sigDigest}, {@link id}, {@link validate}, {@link build} or {@link sign}
   *       will apply the expiration times (relative or absolute) to ensure validity of all of the signatures
   *
   * @param {IBeekeeperUnlockedWallet} wallet unlocked wallet to be used for signing (overrides default Wax Base wallet)
   * @param {TPublicKey} publicKey publicKey for signing (should be available in the wallet)
   *
   * @returns {THexString} transaction signature signed using given key
   *
   * @throws {import("./errors").WaxError} on any Wax API-related error or no public key found in the unlocked wallet or wallet is locked
   */
  sign(wallet: IBeekeeperUnlockedWallet, publicKey: TPublicKey): THexString;

  /**
   * Signs the transaction using given public key and returns the proto transaction. Applies the transaction expiration time
   *
   * Note: Only the first call to {@link toApi}, {@link toString}, {@link sigDigest}, {@link id}, {@link validate}, {@link build} or {@link sign}
   *       will apply the expiration times (relative or absolute) to ensure validity of all of the signatures
   *
   * @param {IBeekeeperUnlockedWallet} wallet unlocked wallet to be used for signing (overrides default Wax Base wallet)
   * @param {TPublicKey} publicKey publicKey for signing (should be available in the wallet)
   *
   * @returns {transaction} signed protobuf transaction object
   *
   * @throws {import("./errors").WaxError} on any Wax API-related error or no public key found in the unlocked wallet or wallet is locked
   */
  build(wallet: IBeekeeperUnlockedWallet, publicKey: TPublicKey): transaction;

  /**
   * Returns the proto transaction. Applies the transaction expiration time.
   *
   * Note: Only the first call to {@link toApi}, {@link toString}, {@link sigDigest}, {@link id}, {@link validate}, {@link build} or {@link sign}
   *       will apply the expiration times (relative or absolute) to ensure validity of all of the signatures
   *
   * @returns {transaction} transaction
   *
   * @throws {import("./errors").WaxError} on any Wax API-related error or no public key found in the unlocked wallet or wallet is locked
   */
  build(): transaction;

  /**
   * Converts the created transaction into the Hive API-form string
   *
   * @returns {string} transaction in Hive API-form
   *
   * @throws {import("./errors").WaxError} on any Wax API-related error
   */
  toApi(): string;
}

export interface ITransactionBuilderConstructor {
  /**
   * Constructs a new Transaction Builder object with given data
   *
   * @param {TBlockHash} taposBlockId reference block id (can be head block id) for TaPoS
   * @param {TTimestamp} expirationTime expiration time for the transaction. Applies upon the {@link ITransactionBuilder#build} call.
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
   * @returns {ITransactionBuilder} transaction builder containing ready to sign transaction (or to convert to protobuf structure using {@link ITransactionBuilder#build})
   *
   * @throws {import("./errors").WaxError} on any Wax API-related error
   */
  fromApi(transactionObject: string | object): ITransactionBuilder;
}

export interface IWaxBaseInterface {
  get TransactionBuilder(): ITransactionBuilderConstructor;

  /**
   * Deletes the created wax proto_protocol instance
   */
  delete(): void;
}

/**
 * @internal
 */
export type ApiData<T extends keyof typeof HiveApiTypes> = YourApiData<typeof HiveApiTypes[T]>;

/**
 * @internal
 */
export type YourApiData<YourTypes> = {
  [P in keyof YourTypes]: YourTypes[P] extends { params: new () => infer ParamsType; result: new () => infer ResultType; }
    ? (params: ParamsType) => Promise<ResultType>
    : never;
};

/**
 * @internal
 */
export interface IHiveApi {
  account_by_key_api: ApiData<'account_by_key_api'>;
  block_api: ApiData<'block_api'>;
  database_api: ApiData<'database_api'>;
  network_broadcast_api: ApiData<'network_broadcast_api'>;
}

export interface IHiveChainInterface extends IWaxBaseInterface {
  /**
   * Same as {@link IWaxBaseInterface#TransactionBuilder}, but pulls the reference block data from the remote
   *
   * @param {?TTimestamp} expirationTime expiration time for the transaction. Applies upon the {@link ITransactionBuilder#build} call.
   *                                     Can be either any argument parsable by the {@link Date} constructor or relative time in seconds, minutes or hours
   *                                     (remember maximum expiration time for the transaction in mainnet is 1 hour), e.g.:
   *                                     `1699550966300` `"2023-11-09T17:29:30.028Z"` `new Date()` `"+10s"` `+30m` `+1h`. Defaults to `+1m`
   *
   * @returns {ITransactionBuilder} ready to use transaction builder interface
   *
   * @throws {import("./errors").WaxError} on any Wax API-related error
   * @throws {import("./errors").WaxChainApiError} on any Hive API-related error
   */
  getTransactionBuilder(expirationTime?: TTimestamp): Promise<ITransactionBuilder>;

  /**
   * Extends hive chain interface with your custom API definitions
   *
   * @param extendedHiveApiData your custom api definitions
   *
   * @returns Wax Hive chain instance containing extended api
   */
  extend<YourApi, YourData extends { [k in keyof YourApi]: YourApiData<YourApi[k]> }>(extendedHiveApiData: YourApi): (IHiveChainInterface & { api: IHiveApi & YourData });

  api: IHiveApi;
}
