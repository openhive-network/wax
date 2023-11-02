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
   * @returns {transaction} signed transaction
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
}

export interface ITransactionBuilderConstructor {
  /**
   * Constructs a new Transaction Builder object with given data
   *
   * @param {TBlockHash} taposBlockId reference block id (can be head block id) for TaPoS
   * @param {TTimestamp} expirationTime expiration time for the transaction
   */
  new(taposBlockId: TBlockHash, expirationTime: TTimestamp): ITransactionBuilder;
}

export interface IWaxBaseInterface {
  get TransactionBuilder(): ITransactionBuilderConstructor;

  /**
   * Deletes the created wax proto_protocol instance
   */
  delete(): void;
}
