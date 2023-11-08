import type { IBeekeeperUnlockedWallet, TPublicKey } from "@hive/beekeeper";
import type { operation, transaction } from ".";

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
   * Signs the transaction using given public key
   *
   * @param {IBeekeeperUnlockedWallet} wallet unlocked wallet to be used for signing (overrides default Wax Base wallet)
   * @param {TPublicKey} publicKey publicKey for signing (should be available in the wallet passed using IWaxBaseInterface#useWallet or #useWallet)
   *
   * @returns {THexString} transaction signature signed using given key
   *
   * @throws {import("./errors").WaxError} on any Wax API-related error or no public key found in the unlocked wallet or wallet is locked
   */
  sign(wallet: IBeekeeperUnlockedWallet, publicKey: TPublicKey): THexString;

  /**
   * Signs the transaction using given public key and returns the proto transaction
   *
   * @param {IBeekeeperUnlockedWallet} wallet unlocked wallet to be used for signing (overrides default Wax Base wallet)
   * @param {TPublicKey} publicKey publicKey for signing (should be available in the wallet passed using IWaxBaseInterface#useWallet or #useWallet)
   *
   * @returns {transaction} signed protobuf transaction object
   *
   * @throws {import("./errors").WaxError} on any Wax API-related error or no public key found in the unlocked wallet or wallet is locked
   */
  build(wallet: IBeekeeperUnlockedWallet, publicKey: TPublicKey): transaction;

  /**
   * Returns the proto transaction
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
   * @param {TTimestamp} expirationTime expiration time for the transaction
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
   * @returns {ITransactionBuilder} transaction builder containing ready to sign transaction (or to convert to protobuf structure using ITransactionBuilder#build)
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
