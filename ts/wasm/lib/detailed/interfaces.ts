// @ts-expect-error ts(6133) Type WaxError is used in JSDoc
import type { WaxError } from "./errors";
import type { operation, transaction } from "./protocol";
import type { EManabarType } from "./chain_api";
import type { HiveApiTypes, HiveRestApiTypes } from "./chain_api_data";
import type { IWaxExtendableFormatter } from "./formatters/types";
import type { ApiOperation, ApiTransaction, NaiAsset } from ".";
import type { EAssetName } from "./base_api";
import type { TTransactionRequiredAuthorities } from '.';
import type { OperationBase } from "./operation_base";
import type { BlogPostOperation, AccountAuthorityUpdateOperation, ReplyOperation, DefineRecurrentTransferOperation, RecurrentTransferRemovalOperation, UpdateProposalOperation, WitnessSetPropertiesOperation } from "./complex_operations";
import type { ResourceCreditsOperation, CommunityOperation, FollowOperation, TAccountName } from './hive_apps_operations';
import type { IChainConfig } from "../build_wasm/config";
import { ISignatureProvider, IOnlineSignatureProvider } from "./extensions/signatures";
import type { IVerifyAuthorityTrace } from "./verify_authority_trace_interface";

export type TSignature = string;
export type TPublicKey = string;

export type { IChainConfig };

export * from "./verify_authority_trace_interface";

export type {TAccountName};

export type TNaiAssetConvertible = number | string | bigint;

export type TNaiAssetSource = TNaiAssetConvertible | NaiAsset;

export type TTimestamp = Date | number | string;

export interface IBinaryViewBaseNode {
  key: string;
  offset: number;
  size: number;
}

export interface IBinaryViewScalarNode extends IBinaryViewBaseNode {
  type: "scalar";
  value: string;
}

export interface IBinaryViewArrayNode extends IBinaryViewBaseNode {
  type: "array";
  length: number;
  children: IBinaryViewNode[];
  value: string;
}

export interface IBinaryViewObjectNode extends IBinaryViewBaseNode {
  type: "object";
  children: IBinaryViewNode[];
  value?: string;
}

export type IBinaryViewNode = IBinaryViewScalarNode | IBinaryViewArrayNode | IBinaryViewObjectNode;

export interface IBinaryViewOutputData {
  binary: string;
  offsets: IBinaryViewNode[];
}

/**
 * String in hex format
 */
export type THexString = string;

/**
 * Block id type
 *
 * 20 byte string or hex string describing 20 byte array
 */
export type TBlockHash = string;

export interface IManabarData {
  /**
   * Current manabar value
   *
   * @type {bigint}
   */
  current: bigint;

  /**
   * Maximum manabar value
   *
   * @type {bigint}
   */
  max: bigint;

  /**
   * Percent of manabar load with two digits of precision, safely calculated based on the {@link current} and {@link max} values
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

  /**
   * The path to the WASM file. It can be a relative path or an absolute URL
   * If not specified, the default path is used: "./build/beekeeper_wasm.common.wasm" (may change if bundled)
   *
   * Note: You can also specify a base64 encoded string of the WASM file to be used directly when inlining
   *
   * @type {string}
   */
  wasmLocation?: string;
}

export interface IPrivateKeyData {
  associatedPublicKey: string;
  wifPrivateKey: string;
}

export interface IBrainKeyData extends IPrivateKeyData {
  brainKey: string;
}

export interface IWaxOptionsChain extends IWaxOptions {
  /**
   * Endpoint for all of the API requests
   *
   * @default "https://api.hive.blog/"
   * @type {string}
   */
  apiEndpoint: string;

  /**
   * Endpoint for all of the REST API requests
   *
   * @default "https://api.syncad.com"
   * @type {string}
   */
  restApiEndpoint: string;

  /**
   * Timeout for all of the API requests in milliseconds.
   * Set to 0 to disable timeout
   *
   * @default 2_000
   * @type {number}
   */
  apiTimeout: number;
}

export interface ITransactionBase {

  /**
   * Generates digest of the transaction for signing (HF26 serialization form is used).
   *
   * @type {THexString} digest of the transaction for signing in hex form
   *
   * @throws {WaxError} on any Wax API-related error
   */
  get sigDigest(): THexString;

  /**
   * Generates digest of the transaction for signing (legacy serialization form is used).
   *
   * @type {THexString} digest of the transaction for signing in hex form
   *
   * @throws {WaxError} on any Wax API-related error
   *
   * @deprecated
   */
  get legacy_sigDigest(): THexString;

  /**
   * Retrieves the set of account names (not authorities!) that are impacted by a whole transaction.
   *
   * If you want to list impacted accounts per operation, use {@link IWaxBaseInterface.operationGetImpactedAccounts} instead.
   *
   * @returns {Set<TAccountName>} A set containing the account names that are impacted by the current transaction
   *
   * @throws {WaxError} on any Wax WASM-related error
   */
  get impactedAccounts(): Set<TAccountName>;

  /**
   * Generates id of the transaction (HF26 serialization form is used).
   *
   * @type {TTransactionId} id of the transaction in hex form
   *
   * @throws {WaxError} on any Wax API-related error
   */
  get id(): TTransactionId;

  /**
   * Generates id of the transaction (legacy serialization form is used).
   *
   * @type {TTransactionId} id of the transaction in hex form
   *
   * @throws {WaxError} on any Wax API-related error
   *
   * @deprecated
   */
  get legacy_id(): TTransactionId;

  /**
   * Returns signature keys from the transaction signatures
   *
   * @type {Array<THexString>} list of all the public keys that were used to sign the transaction
   *
   * @throws {WaxError} on any Wax API-related error
   */
  get signatureKeys(): Array<THexString>;

  /**
   * Returns signature keys from the transaction signatures (legacy serialization form is used).
   *
   * @type {Array<THexString>} list of all the public keys that were used to sign the transaction
   *
   * @throws {WaxError} on any Wax API-related error
   *
   * @deprecated
   */
  get legacy_signatureKeys(): Array<THexString>;

  /**
   * Decrypts all underlying encrypted operations
   *
   * @param {ISignatureProvider} wallet unlocked wallet to be used for decryption
   *
   * @returns {transaction} protobuf transaction object
   *
   * @throws {WaxError} on any Wax API-related error including validation error
   */
  decrypt(wallet: ISignatureProvider): transaction;

  /**
   * Returns required authority accounts from the transaction
   *
   * @type {TTransactionRequiredAuthorities} list of all possible authority types
   *
   * @throws {WaxError} on any Wax API-related error
   */
  get requiredAuthorities(): TTransactionRequiredAuthorities;

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
   * Checks if underlying transaction has been already signed at least one time (after {@link ITransaction.sign})
   *
   * @returns {boolean} either true or false based on the signatures amount
   */
  isSigned(): boolean;

  /**
   * Retrieves transaction binary view packed "AST" data (in same form as in the block_log)
   *
   * @returns {IBinaryViewOutputData} binary view metadata
   */
  get binaryViewMetadata(): IBinaryViewOutputData;

  /**
   * Retrieves transaction binary view packed "AST" data (in same form as in the block_log) (legacy serialization form is used).
   *
   * @returns {IBinaryViewOutputData} binary view metadata
   *
   * @deprecated
   */
  get legacy_binaryViewMetadata(): IBinaryViewOutputData;

  /**
   * Fills up constructed transaction object basing on preconfigured TAPOS. Also applies the transaction expiration time.
   * @returns {transaction} protobuf transaction object
   */
  get transaction(): transaction;

  /**
   * Converts the created transaction into the Hive API-form string
   *
   * @returns {string} transaction in Hive API-form
   *
   * @throws {WaxError} on any Wax API-related error
   */
  toApi(): string;

  /**
   * Converts the created transaction into the Hive API-form JSON
   *
   * @returns {ApiTransaction} transaction in Hive API-form
   *
   * @throws {WaxError} on any Wax API-related error
   */
  toApiJson(): ApiTransaction;

  /**
   * Starts encryption chain
   *
   * Remember that in order to encrypt operations with given {@link mainEncryptionKey} and optional {@link otherEncryptionKey}
   * you have to import those keys into the wallet passed to the {@link ITransaction.sign} method
   *
   * @param {TPublicKey} mainEncryptionKey First key to encrypt operations
   * @param {TPublicKey} [otherEncryptionKey] Optional second key to encrypt operations
   *
   * @returns {this & IEncryptingTransaction<this>} current transaction instance
   */
 startEncrypt(mainEncryptionKey: TPublicKey, otherEncryptionKey?: TPublicKey): this & IEncryptingTransaction<this>;

  /**
   * Converts the created transaction into the Hive API-legacy form JSON string.
   *
   * Legacy form differs in few aspects to regular (HF26) one:
   * - for operations type/value dictionary object is replaced by array tuple, where first item points operation type and second operation body
   * - asset values are encoded in their legacy form having specified token names after amount values, i.e. 1.000 HIVE
   *
   * Transaction legacy form (even it has shorter JSON code for the first look) is much more error prone, like also
   * produces **larger binary serialization output**, what is directly stored in blocks. Binary form is the input for signature generation too.
   * In general, preferred way of generating transactions is HF-26 form (default in this library).
   *
   * This method is added only for convenience and better cooperation to other transaction processing tools accepting only this form.
   *
   * @returns {string} transaction in Legacy Hive API-form
   *
   * @throws {WaxError} on any Wax API-related error
   *
   * @deprecated
   */
  toLegacyApi(): string;

  /**
   * Allows to serialize underlying transaction to HF26 specific binary form, then return it as hexstring.
   * @param {boolean} [stripToUnsignedTransaction] optional flag to strip the transaction to unsigned form (without signature container).
   *        This form can be useful for external transaction hash calculation.
   */
  toBinaryForm(stripToUnsignedTransaction?: boolean): THexString;

  /**
   * Pushes given operation to the operations array in the transaction
   * This can also add **multiple** operations to the transaction using a straightforward complex operation interface.
   *
   * We provide a standard set of factories with our implementation, but you can also create custom factories by extending the {@link OperationBase} class.
   *
   * @param {operation | OperationBase} op operation to append to the transaction (can be hive apps operation)
   * or Class instance for a complex operation that will produce operations including given params
   *
   * @see Complex operations:
   *  {@link AccountAuthorityUpdateOperation} Creates an account authority update operation
   *  {@link BlogPostOperation} Creates a blog post. It requires the category on blog post to be set,
   *  {@link ReplyOperation} Creates a reply to a comment or a blog post. It requires parent author and parent permlink to be set,
   *  {@link DefineRecurrentTransferOperation} Creates or updates a recurrent transfer. It requires the amount to be set and to be non-zero, otherwise the removal will be generated automatically,
   *  {@link RecurrentTransferRemovalOperation} Creates an operation removing existing recurrent transfer
   *  {@link UpdateProposalOperation} Creates an update proposal operation. You can optionally set the end date of the proposal,
   *  {@link WitnessSetPropertiesOperation} Creates a witness set properties operation with automatic data serialization,
   *
   * @see Hive Apps operations:
   *  {@link CommunityOperation} Allows to manipulate the community options,
   *  {@link FollowOperation} Allows to manipulate the follow options,
   *  {@link ResourceCreditsOperation} Allows to delegate or remove delegation of resource credits to given account(s),
   *
   * @example Building blog post
   * ```typescript
   *  tx.pushOperation(new BlogPostOperation({
   *    category: "test-category",
   *    author: "gtg",
   *    title: "Post with category",
   *    body: "Post with category",
   *    permlink: "post-with-category",
   *    tags: ["spam"],
   *    description: "Post with category"
   *  }));
   * ```
   *
   * @example Building recurrent transfer with pair id and automatically generated removal
   * ```typescript
   *  tx.pushOperation(new DefineRecurrentTransferOperation({
   *    from: "initminer",
   *    to: "gtg",
   *    pairId: 100
   *  }));
   * ```
   *
   * @returns {this} current transaction instance
   *
   * @throws {WaxError} on any Wax API-related error
   */
  pushOperation(op: operation | OperationBase): this;
}

/**
 * Transaction allows you to push simple operations (as inline objects)
 * or use dedicated operation factories
 * (to create more complex operations or multiple blockchain transactions for specific scenarios)
 * into underlying transaction.
 * Furthermore, it allows to perform analysis of the transaction
 * by examining its id (hash),
 * evaluating the digest to calculate signatures
 * or extracting public keys involved in the attached signatures.
 *
 * Example usage:
 * @example Base transaction usage
 * ```typescript
 * const tx = await waxFoundation.createTransaction();
 *
 * tx.pushOperation({
 *   vote: {
 *     voter: "otom",
 *     author: "c0ff33a",
 *     permlink: "ewxhnjbj",
 *     weight: 2200
 *   }
 * });
 * ```
 */
export interface ITransaction extends ITransactionBase {
  /**
   * Signs the transaction using given public key. Applies the transaction expiration time
   *
   * Encrypts operations if any were created using {@link IEncryptingTransaction} interface
   *
   * @param {ISignatureProvider} wallet unlocked wallet to be used for signing
   * @param {TPublicKey} publicKey publicKey for signing (should be available in the wallet)
   *
   * @returns {THexString} transaction signature signed using given key
   *
   * @throws {WaxError} on any Wax API-related error or no public key found in the unlocked wallet or wallet is locked
   */
  sign(wallet: ISignatureProvider, publicKey: TPublicKey): THexString;

 /**
   * Adds your signature to the internal signatures array inside underlying transaction.
   *
   * @param {THexString} signature signature to add
   *
   * @returns {THexString} added transaction signature
   *
 */
  sign(signature: THexString): THexString;
}

/**
 * Same as {@link ITransaction}, but marks operations as encrypted using given keys, which will be encrypted upon
 * {@link ITransaction.sign}.
 *
 * Note: We are not able to encrypt all operations.
 * We are currently supporting:
 * - Encryption of `body` in comment operation
 * - Encryption of `json` in custom_json operation
 * - Encryption of `memo` in transfer operation
 * - Encryption of `memo` in transfer_to_savings operation
 * - Encryption of `memo` in transfer_from_savings operation
 * - Encryption of `memo` in recurrent_transfer operation
 *
 * @example Base encrypting transaction usage
 * ```typescript
 * const tx = await waxFoundation.createTransaction();
 *
 * tx.startEncrypt(myPublicKey).pushOperation({
 *    transfer: {
 *      amount: chain.hive(100),
 *      from_account: "gtg",
 *      to_account: "initminer",
 *      memo: "This should be encrypted"
 *    }
 * }).stopEncrypt();
 * ```
 */
export interface IEncryptingTransaction<StopEncryptResult extends ITransactionBase> {
  /**
   * Stops encryption chain
   *
   * Note: This call is optional if you are not going to push any other decrypted operations
   *
   * @returns {StopEncryptResult} current transaction instance
   */
  stopEncrypt(): StopEncryptResult;
};

/**
 * Extends {@link ITransaction} interface by functionality which requires online chain access (i.e. accessing account
 * authority to prevent private keys leak).
 */
export interface IOnlineTransaction extends ITransactionBase {
  /**
   * Allows to perform transaction checks which require additional access to chain APIs i.e. to retrieve account data.
   *
   * Supported checks:
   *
   * - [x] private key leakage prevention
   * - [ ] new authority definition validation (prevent creation of cycles, extending chain limits specific to authority verification, referencing nonexisting accounts)
   *
   * @throws {WaxError} when any of supported checks failed.
   */
  performOnChainVerification(): Promise<void>;

  /**
   * Allows to generate authority verification trace for the currently loaded/built transaction.
   * Transaction should be already signed, otherwise the function throws.
   * The authority trace process requires online access to the chain APIs to retrieve account data.
   *
   * @param {boolean} [useLegacySerialization] optional flag to force using legacy (pre HF26) serialization mode on processed transaction
   * @param {ITransaction} externalTx optional external transaction to be used for authority verification trace generation. If omitted, defaults to HF26
   */
  generateAuthorityVerificationTrace(useLegacySerialization?: boolean, externalTx?: ITransaction): Promise<IVerifyAuthorityTrace>;

  /**
   * Signs the transaction using given public key. Applies the transaction expiration time
   *
   * Encrypts operations if any were created using {@link IEncryptingTransaction} interface
   *
   * @param {IOnlineSignatureProvider} wallet unlocked wallet to be used for signing
   * @returns {Promise<void>} resolves when the wallet finished signing (signature(s) appended internally)
   *
   * @throws {WaxError} on any Wax API-related error or no public key found in the unlocked wallet or wallet is locked
   */
  sign(wallet: IOnlineSignatureProvider): Promise<void>;

  /**
   * Signs the transaction using given public key. Applies the transaction expiration time
   *
   * Encrypts operations if any were created using {@link IEncryptingTransaction} interface
   *
   * @param {ISignatureProvider} wallet unlocked wallet to be used for signing
   * @param {TPublicKey} publicKey publicKey for signing (should be available in the wallet)
   *
   * @returns {THexString} transaction signature signed using given key
   *
   * @throws {WaxError} on any Wax API-related error or no public key found in the unlocked wallet or wallet is locked
   */
  sign(wallet: ISignatureProvider, publicKey: TPublicKey): THexString;

 /**
   * Adds your signature to the internal signatures array inside underlying transaction.
   *
   * @param {THexString} signature signature to add
   *
   * @returns {THexString} added transaction signature
   *
 */
  sign(signature: THexString): THexString;
};

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
  readonly ASSETS: Readonly<Record<EAssetName, NaiAsset>>;

  readonly formatter: IWaxExtendableFormatter;
  readonly waxify: IWaxExtendableFormatter['waxify'];

  /**
   * Retrieves the public key address prefix
   *
   * @returns {string} public key prefix
   */
  get addressPrefix (): string;

  /**
   * Check if given account name is valid, which means it follows given rules:
   * - Names must comply with RFC 1035 grammar
   * - All letters must be lowercase
   * - Length is between (inclusive) HIVE_MIN_ACCOUNT_NAME_LENGTH and HIVE_MAX_ACCOUNT_NAME_LENGTH. See: {@link config}
   *
   * @param {string} name account name to be checked
   * @returns {boolean} true if account name is valid, false otherwise
   */
  isValidAccountName(name: string): boolean;

  /**
   * Retrieves the set of account names (not authorities!) that are impacted by a given operation.
   *
   * @param {operation | ApiOperation} operation The operation object which could be either a protobuf operation or operation returned from the Hive Nodes API
   * @returns {Set<TAccountName>} A set containing the account names that are impacted by the given operation.
   *
   * @throws {WaxError} on any Wax WASM-related error
   */
  operationGetImpactedAccounts(operation: operation | ApiOperation): Set<TAccountName>;

  /**
   * Retrieves given operation binary view packed "AST" data (in same form as in the block_log)
   *
   * @param {operation | ApiOperation} operation The operation object which could be either a protobuf operation or operation returned from the Hive Nodes API
   * @param {boolean} [isHf26Serialization] A flag indicating if serialization should be done in HF26 form or legacy form (defaults to `true` - hf26 type)
   *
   * @returns {IBinaryViewOutputData} binary view metadata
   *
   * @throws {WaxError} on any Wax WASM-related error
   */
  operationBinaryViewMetadata(operation: operation | ApiOperation, isHf26Serialization?: boolean): IBinaryViewOutputData;

  /**
   * Retrieves the bundled package version string
   *
   * @returns {string} application version
   */
  getVersion(): string;

  /**
   * Holds the protocol configuration for the current chain
   */
  get config(): IChainConfig;

  /**
   * Retrieves asset amount and symbol from the api data
   *
   * @param {NaiAsset} nai API asset
   * @returns {IHiveAssetData} asset data
   */
  getAsset(nai: NaiAsset): IHiveAssetData;

  /**
   * Estimate hive collateral
   *
   * @param {TNaiAssetSource} currentMedianHistoryBase Base for Current median price retrieved by `get_feed_history`
   * @param {TNaiAssetSource} currentMedianHistoryQuote Quote for Current median price retrieved by `get_feed_history`
   * @param {TNaiAssetSource} currentMinHistoryBase Base for Current minimal price retrieved by `get_feed_history`
   * @param {TNaiAssetSource} currentMinHistoryQuote Quote for Current minimal price retrieved by `get_feed_history`
   * @param {TNaiAssetSource} hbdAmountToGet HBD asset used to get HIVE asset
   *
   * @returns {NaiAsset} value in HIVE asset
   *
   * @throws {WaxError} on any Wax WASM-related error
   */
  estimateHiveCollateral(currentMedianHistoryBase: TNaiAssetSource, currentMedianHistoryQuote: TNaiAssetSource, currentMinHistoryBase: TNaiAssetSource, currentMinHistoryQuote: TNaiAssetSource, hbdAmountToGet: TNaiAssetSource): NaiAsset;

  /**
   * Retrieves HIVE in nai form with given amount
   *
   * Note: This function works with precision and only accepts JS Double-precision floating-point format (IEEE 754),
   * which does not support numbers greater than 2^53 - 1 or less than -(2^53 - 1).
   * If you want to pass large number values, use {@link hiveSatoshis} instead.
   *
   * @example Inputs: `1000`, `1000.2`, `1000.300`
   *
   * @param {number} amount amount of HIVE
   * @returns {NaiAsset} HIVE in nai form
   * @throws {WaxError} on any Wax WASM-related error
   */
  hiveCoins(amount: number): NaiAsset;

  /**
   * Retrieves HBD in nai form with given amount
   *
   * Note: This function works with precision and only accepts JS Double-precision floating-point format (IEEE 754),
   * which does not support numbers greater than 2^53 - 1 or less than -(2^53 - 1).
   * If you want to pass large number values, use {@link hbdSatoshis} instead.
   *
   * @example Inputs: `1000`, `1000.2`, `1000.300`
   *
   * @param {number} amount amount of HBD
   * @returns {NaiAsset} HBD in nai form
   * @throws {WaxError} on any Wax WASM-related error
   */
  hbdCoins(amount: number): NaiAsset;

  /**
   * Retrieves VESTS in nai form with given amount
   *
   * Note: This function works with precision and only accepts JS Double-precision floating-point format (IEEE 754),
   * which does not support numbers greater than 2^53 - 1 or less than -(2^53 - 1).
   * If you want to pass large number values, use {@link vestsSatoshis} instead.
   *
   * @example Inputs: `1000`, `1000.2`, `1000.300`, `1000.000005`
   *
   * @param {number} amount amount of VESTS
   * @returns {NaiAsset} VESTS in nai form
   * @throws {WaxError} on any Wax WASM-related error
   */
  vestsCoins(amount: number): NaiAsset;

  /**
   * Retrieves HIVE in nai form with given amount
   *
   * Note: This function only accepts integer values.
   * If you want to pass fractional number values, use {@link hiveCoins} instead.
   * This function copies the input value to the output `amount` property without any conversion - adds just a `nai` id.
   *
   * @example Input: `10000`, `"10000000000000000"`, `BigInt("10000000000000000")`
   *
   * @param {TNaiAssetConvertible} amount amount of HIVE
   * @returns {NaiAsset} HIVE in nai form
   * @throws {WaxError} on any Wax WASM-related error
   */
  hiveSatoshis(amount: TNaiAssetConvertible): NaiAsset;

  /**
   * Retrieves HBD in nai form with given amount
   *
   * Note: This function only accepts integer values.
   * If you want to pass fractional number values, use {@link hbdCoins} instead.
   * This function copies the input value to the output `amount` property without any conversion - adds just a `nai` id.
   *
   * @example Input: `10000`, `"10000000000000000"`, `BigInt("10000000000000000")`
   *
   * @param {TNaiAssetConvertible} amount amount of HBD
   * @returns {NaiAsset} HBD in nai form
   * @throws {WaxError} on any Wax WASM-related error
   */
  hbdSatoshis(amount: TNaiAssetConvertible): NaiAsset;

  /**
   * Retrieves VESTS in nai form with given amount
   *
   * Note: This function only accepts integer values.
   * If you want to pass fractional number values, use {@link vestsCoins} instead.
   * This function copies the input value to the output `amount` property without any conversion - adds just a `nai` id.
   *
   * @example Input: `10000`, `"10000000000000000"`, `BigInt("10000000000000000")`
   *
   * @param {TNaiAssetConvertible} amount amount of VESTS
   * @returns {NaiAsset} VESTS in nai form
   * @throws {WaxError} on any Wax WASM-related error
   */
  vestsSatoshis(amount: TNaiAssetConvertible): NaiAsset;

  /**
   * Retrieves HIVE in nai form with given amount
   *
   * Note: This function only accepts integer values.
   * If you want to pass fractional number values, use {@link hiveCoins} instead.
   * This function copies the input value to the output `amount` property without any conversion - adds just a `nai` id.
   *
   * @example Input: `10000`, `"10000000000000000"`, `BigInt("10000000000000000")`
   *
   * @param {TNaiAssetConvertible} amount amount of HIVE
   * @returns {NaiAsset} HIVE in nai form
   *
   * @deprecated Use {@link hiveSatoshis} or {@link hiveCoins} instead
   * @throws {WaxError} on any Wax WASM-related error
   */
  hive(amount: TNaiAssetConvertible): NaiAsset;

  /**
   * Retrieves HBD in nai form with given amount
   *
   * Note: This function only accepts integer values.
   * If you want to pass fractional number values, use {@link hbdCoins} instead.
   * This function copies the input value to the output `amount` property without any conversion - adds just a `nai` id.
   *
   * @example Input: `10000`, `"10000000000000000"`, `BigInt("10000000000000000")`
   *
   * @param {TNaiAssetConvertible} amount amount of HBD
   * @returns {NaiAsset} HBD in nai form
   *
   * @deprecated Use {@link hbdSatoshis} or {@link hbdCoins} instead
   * @throws {WaxError} on any Wax WASM-related error
   */
  hbd(amount: TNaiAssetConvertible): NaiAsset;

  /**
   * Retrieves VESTS in nai form with given amount
   *
   * Note: This function only accepts integer values.
   * If you want to pass fractional number values, use {@link vestsCoins} instead.
   * This function copies the input value to the output `amount` property without any conversion - adds just a `nai` id.
   *
   * @example Input: `10000`, `"10000000000000000"`, `BigInt("10000000000000000")`
   *
   * @param {TNaiAssetConvertible} amount amount of VESTS
   * @returns {NaiAsset} VESTS in nai form
   *
   * @deprecated Use {@link vestsSatoshis} or {@link vestsCoins} instead
   * @throws {WaxError} on any Wax WASM-related error
   */
  vests(amount: TNaiAssetConvertible): NaiAsset;

  /**
   * Converts VESTS to HP in nai form
   * @param {TNaiAssetSource} vests VESTS asset
   * @param {TNaiAssetSource} totalVestingFundHive HIVE asset total vesting fund
   * @param {TNaiAssetSource} totalVestingShares VESTS asset total shares
   * @returns {NaiAsset} HP in nai form
   * @throws {WaxError} on any Wax WASM-related error
   */
  vestsToHp(vests: TNaiAssetSource, totalVestingFundHive: TNaiAssetSource, totalVestingShares: TNaiAssetSource): NaiAsset

  /**
   * Converts HP to VESTS in nai form
   * @param {TNaiAssetSource} hive HIVE asset
   * @param {TNaiAssetSource} totalVestingFundHive HIVE asset total vesting fund
   * @param {TNaiAssetSource} totalVestingShares VESTS asset total shares
   * @returns {NaiAsset} VESTS in nai form
   * @throws {WaxError} on any Wax WASM-related error
   */
  hpToVests(hive: TNaiAssetSource, totalVestingFundHive: TNaiAssetSource, totalVestingShares: TNaiAssetSource): NaiAsset;

  /**
   * Converts HBD to HIVE in nai form
   * @param {TNaiAssetSource} hbd HBD asset
   * @param {TNaiAssetSource} base HBD asset price base
   * @param {TNaiAssetSource} quote HIVE asset price quote
   * @returns {NaiAsset} HIVE in nai form
   * @throws {WaxError} on any Wax WASM-related error
   */
  hbdToHive(hbd: TNaiAssetSource, base: TNaiAssetSource, quote: TNaiAssetSource): NaiAsset;

  /**
   * Converts given amount of HIVE asset to HBD (nai form)
   * @param {TNaiAssetSource} amount HIVE asset
   * @param {TNaiAssetSource} base HBD asset price base taken i.e. from database_api.get_current_price_feed call
   * @param {TNaiAssetSource} quote HIVE asset price quote taken i.e. from database_api.get_current_price_feed call
   * @returns {NaiAsset} HBD in nai form
   * @throws {WaxError} on any Wax WASM-related error
   */
  hiveToHbd(amount: TNaiAssetSource, base: TNaiAssetSource, quote: TNaiAssetSource): NaiAsset;

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
   * Suggests a safe brain key to use for creating your account.
   * Returns a brain key and the corresponding private key and public key.
   * Brain key is a long passphrase that provides enough entropy to generate cryptographic
   * keys. This function will suggest a suitably random string that should
   * be easy to write down (and, with effort, memorize).
   *
   * @returns {IBrainKeyData} Brain key data
   *
   * @throws {WaxError} on any Wax API-related error
   */
  suggestBrainKey(): IBrainKeyData;

  /**
   * Derives private key for a given role from so-called Master Password
   *
   * @param {string} account the name of the account to retrieve key for
   * @param {string} role active | owner | posting | memo
   * @param {string} password the Master Password to derive key from
   *
   * @returns {IPrivateKeyData} Generated private key along with the associated public key in WIF format
   * @throws {WaxError} on any Wax API-related error
   */
  getPrivateKeyFromPassword(account: string, role: string, password: string): IPrivateKeyData;

  /**
   * Allows to convert raw private key to WIF format.
   * @param {THexString} rawPrivateKey 32 bytes buffer (64 characters hex string) representing private key secret
   * @returns WIF formatted private key
   * @throws {WaxError} on any Wax WASM-related error
   */
  convertRawPrivateKeyToWif(rawPrivateKey: THexString): string;

  /**
   * Allows to convert raw public key to WIF format.
   * @param {THexString} rawPublicKey 33 or 65 bytes buffer (doubled characters hex string) representing compressed or uncompressed public key data
   * @returns WIF formatted public key (including prefix)
   * @throws {WaxError} on any Wax WASM-related error
   */
  convertRawPublicKeyToWif(rawPublicKey: THexString): string;

  /**
   * Encrypts given data using two keys and dumps result to the encrypted string in `#encrypted` format
   *
   * @param {ISignatureProvider} wallet Wallet with imported {@link mainEncryptionKey} and {@link otherEncryptionKey} keys
   * @param {string} content Content to be encoded
   * @param {TPublicKey} mainEncryptionKey First key to encrypt operations
   * @param {TPublicKey} [otherEncryptionKey] Optional second key to encrypt operations
   * @param {number} [nonce] optional nonce to be explicitly specified for encryption
   *
   * @returns {string} Encrypted content
   * @throws {WaxError} on any Wax WASM-related error
   */
  encrypt(wallet: ISignatureProvider, content: string, mainEncryptionKey: TPublicKey, otherEncryptionKey?: TPublicKey, nonce?: number): string;

  /**
   * Decrypts given data from the encrypted string in `#encrypted` format
   *
   * @param {ISignatureProvider} wallet Wallet with imported encryption keys
   * @param {string} encrypted Content to be decoded
   *
   * @returns {string} Decoded content
   * @throws {WaxError} on any Wax WASM-related error
   */
  decrypt(wallet: ISignatureProvider, encrypted: string): string;

  /**
   * Calculates current manabar value for Hive account based on given arguments
   *
   * @param {number} now head block time. Can be obtained using time property from dynamic global properties
   * @param {TNaiAssetConvertible} maxMana maximum account mana. Should equal post_voting_power.amount from the find_account API call for upvotes.
   *                                       For downvotes remember to multiply this value by downvote_pool_percent from the dynamic global properties API call.
   *                                       For rc manabar calculations use max_rc value from the rc_accounts API call.
   * @param {TNaiAssetConvertible} currentMana current account mana. Should equal voting_manabar.current_mana from the find_account API call for upvotes or downvote_manabar.current_mana for downvotes
   *                                           For rc manabar calculations use rc_manabar value from the rc_accounts API call
   * @param {number} lastUpdateTime last update of the current account mana. Should equal voting_manabar.last_update_time from the find_account API call for upvotes or downvote_manabar.current_mana for downvotes
   *                                For rc manabar calculations use rc_manabar value from the rc_accounts API call
   *
   * @returns {IManabarData} Manabar data
   * @throws {WaxError} on any Wax WASM related error
   */
  calculateCurrentManabarValue(now: number, maxMana: TNaiAssetConvertible, currentMana: TNaiAssetConvertible, lastUpdateTime: number): IManabarData;

  /**
   * Calculates full regeneration time of the manabar value for Hive account based on given arguments
   *
   * @param {number} now head block time. Can be obtained using time property from dynamic global properties
   * @param {TNaiAssetConvertible} maxMana maximum account mana. Should equal post_voting_power.amount from the find_account API call for upvotes.
   *                                       For downvotes remember to multiply this value by downvote_pool_percent from the dynamic global properties API call.
   *                                       For rc manabar calculations use max_rc value from the rc_accounts API call.
   * @param {TNaiAssetConvertible} currentMana current account mana. Should equal voting_manabar.current_mana from the find_account API call for upvotes or downvote_manabar.current_mana for downvotes
   *                                           For rc manabar calculations use rc_manabar value from the rc_accounts API call
   * @param {number} lastUpdateTime last update of the current account mana. Should equal voting_manabar.last_update_time from the find_account API call for upvotes or downvote_manabar.current_mana for downvotes
   *                                For rc manabar calculations use rc_manabar value from the rc_accounts API call
   *
   * @returns {number} Full regeneration timestamp (in seconds)
   * @throws {WaxError} on any Wax WASM related error
   */
  calculateManabarFullRegenerationTime(now: number, maxMana: TNaiAssetConvertible, currentMana: TNaiAssetConvertible, lastUpdateTime: number): number;

  /**
   * Calculates account HP based on given vests, total vesting fund HIVE and total vesting shares
   *
   * @param {TNaiAssetSource} vests VESTS asset
   * @param {TNaiAssetSource} totalVestingFundHive HIVE asset total vesting fund
   * @param {TNaiAssetSource} totalVestingShares VESTS asset total shares
   * @returns {NaiAsset} HP in nai form
   * @throws {WaxError} on any Wax WASM related error
   */
  calculateAccountHp(vests: TNaiAssetSource, totalVestingFundHive: TNaiAssetSource, totalVestingShares: TNaiAssetSource): NaiAsset;

  /**
   * Calculates witness votes HP based on given votes (expressed in VESTS), total vesting fund HIVE and total vesting shares
   *
   * @param {TNaiAssetSource} votes power of witness votes (assumed in VESTS asset)
   * @param {TNaiAssetSource} totalVestingFundHive HIVE asset total vesting fund
   * @param {TNaiAssetSource} totalVestingShares VESTS asset total shares
   * @returns {NaiAsset} HP in nai form
   * @throws {WaxError} on any Wax WASM related error
   */
  calculateWitnessVotesHp(votes: TNaiAssetSource, totalVestingFundHive: TNaiAssetSource, totalVestingShares: TNaiAssetSource): NaiAsset;

  /**
   * Calculate current HP APR
   *
   * @param {number} headBlockNum head block number
   * @param {number} vestingRewardPercent vesting reward percent
   * @param {TNaiAssetSource} virtualSupply virtual supply
   * @param {TNaiAssetSource} totalVestingFundHive HIVE asset total vesting fund HIVE
   * @returns {number} HP APR percent with 2 decimals
   * @throws {WaxError} on any Wax WASM related error
   */
  calculateHpApr(headBlockNum: number, vestingRewardPercent: number, virtualSupply: TNaiAssetSource, totalVestingFundHive: TNaiAssetSource): number;

  /**
   * Constructs a new Transaction object with ready protobuf transaction
   *
   * @param {transaction} protoTransaction protobuf transaction
   */
  createTransactionFromProto(protoTransaction: transaction): ITransaction;

  /**
   * Converts Hive API-form transaction in JSON form to our transaction
   *
   * @param {string|object|ApiTransaction} transactionObject transaction object to be converted
   *
   * @returns {ITransaction} transaction containing ready to sign transaction (or to convert to protobuf structure using {@link ITransaction.transaction} property)
   *
   * @throws {WaxError} on any Wax API-related error
   */
  createTransactionFromJson(transactionObject: string | object | ApiTransaction): ITransaction;

  /**
   * Constructs a new Transaction object with given data
   *
   * @param {TBlockHash} taposBlockId reference block id (can be head block id) for TaPoS
   * @param {TTimestamp} [expirationTime] expiration time for the transaction. Applies upon the {@link ITransaction.sign} call or reading {@link ITransaction.transaction} property.
   *                                    Can be either any argument parsable by the Date constructor or relative time in seconds, minutes or hours
   *                                    (remember maximum expiration time for the transaction in mainnet is 1 hour), e.g.:
   *                                    `1699550966300` `"2023-11-09T17:29:30.028Z"` `new Date()` `"+10s"` `+30m` `+1h`.
   *                                    Expiration time will be applied when calling any non-push-related method in {@link ITransaction}
   *
   * @returns {ITransaction} ready to use transaction interface allowing to fill transaction with its contents like Hive operations
   *
   * @throws {WaxError} on any Wax API-related error
   *
   */
  createTransactionWithTaPoS(taposBlockId: TBlockHash, expirationTime?: TTimestamp): ITransaction;

  /**
   * Converts given transaction from Hive API-form JSON to HF26 specific binary form
   *
   * @param {ApiTransaction} transaction transaction in Hive API-form JSON
   * @param {boolean} [stripToUnsignedTransaction] optional flag to strip the transaction to unsigned form (without signature container).
   *        This form can be useful for external transaction hash calculation.
   * @returns {THexString} transaction in hexstring
   * @throws {WaxError} on any Wax WASM-related error
   */
  convertTransactionToBinaryForm(transaction: ApiTransaction, stripToUnsignedTransaction?: boolean): THexString;

  /**
   * Converts given transaction from HF26 specific binary form to Hive API-form JSON
   *
   * @param {THexString} transaction transaction in hexstring
   *
   * @returns {ApiTransaction} transaction in Hive API-form JSON
   * @throws {WaxError} on any Wax WASM-related error
   */
  convertTransactionFromBinaryForm(transaction: THexString): ApiTransaction;

  /**
   * Deletes the created wax proto_protocol instance
   * @throws {WaxError} on any Wax WASM-related error
   */
  delete(): void;
}

/**
 * @internal
 */
export type JsonRpcApiData<T extends keyof typeof HiveApiTypes> = YourApiData<typeof HiveApiTypes[T]>;

export type TWaxApiRequest<TReq, TRes> = {
  readonly params: TReq;
  readonly result: TRes;
  readonly responseArray?: boolean;
  readonly method?: string;
  readonly urlPath?: string
};

export type TDeepWaxApiRequestPartial<T> = T extends object ? {
  [P in keyof T]?: TDeepWaxApiRequestPartial<T[P]>;
} & Omit<TWaxApiRequest<any, any>, 'params' | 'result'> : T;

/**
 * @internal
 */
export type YourApiData<YourTypes> = {
  readonly [P in keyof YourTypes]:
  // First check for value type
  (YourTypes[P] extends object ? (
    // Check if isArray is set to true and request type
    YourTypes[P] extends { readonly params: infer ParamsType; readonly result: infer ResultType; responseArray: boolean }
    ? ((ParamsType extends undefined ? (() => Promise<(ResultType extends (new (...args: any) => infer ResultTypeConstr) ? (
      ResultTypeConstr extends Number ? number : (ResultTypeConstr extends Boolean ? boolean : (ResultTypeConstr extends String ? string : ResultTypeConstr))
    )[] : (
      ResultType extends Number ? number : (ResultType extends Boolean ? boolean : (ResultType extends String ? string : ResultType))
    )[])>) : (params: (ParamsType extends (new (...args: any) => infer ParamsTypeConstr) ? ParamsTypeConstr : ParamsType)) => Promise<(ResultType extends (new (...args: any) => Readonly<infer ResultTypeConstr>) ? (
      ResultTypeConstr extends Number ? number : (ResultTypeConstr extends Boolean ? boolean : (ResultTypeConstr extends String ? string : ResultTypeConstr))
    )[] : (
      ResultType extends Number ? number : (ResultType extends Boolean ? boolean : (ResultType extends String ? string : ResultType))
    )[])>) & {
      /**
       * New url to set per REST API. Pass `undefined` to switch back to default endpoint URL specified in the chain configuration ({@link IWaxOptionsChain.restApiEndpoint})
       */
      set endpointUrl (newUrl: string | undefined);
      /**
       * Retrieves the url used for calls to the specified REST API
       */
      get endpointUrl (): string;
    } & (Omit<YourApiData<YourTypes[P]>, keyof TWaxApiRequest<any, any>>))
    : (
      // Check if isArray is not present, but request type
      YourTypes[P] extends { readonly params: infer ParamsType; readonly result: infer ResultType }
      ? ((ParamsType extends undefined ? (() => Promise<(ResultType extends (new (...args: any) => infer ResultTypeConstr) ? (
        ResultTypeConstr extends Number ? number : (ResultTypeConstr extends Boolean ? boolean : (ResultTypeConstr extends String ? string : ResultTypeConstr))
      ) : (
        ResultType extends Number ? number : (ResultType extends Boolean ? boolean : (ResultType extends String ? string : ResultType))
      ))>) : (params: (ParamsType extends (new (...args: any) => infer ParamsTypeConstr) ? ParamsTypeConstr : ParamsType)) => Promise<(ResultType extends (new (...args: any) => Readonly<infer ResultTypeConstr>) ? (
        ResultTypeConstr extends Number ? number : (ResultTypeConstr extends Boolean ? boolean : (ResultTypeConstr extends String ? string : ResultTypeConstr))
      ) : (
        ResultType extends Number ? number : (ResultType extends Boolean ? boolean : (ResultType extends String ? string : ResultType))
      ))>) & {
        /**
         * New url to set per REST API. Pass `undefined` to switch back to default endpoint URL specified in the chain configuration ({@link IWaxOptionsChain.restApiEndpoint})
         */
        set endpointUrl (newUrl: string | undefined);
        /**
         * Retrieves the url used for calls to the specified REST API
         */
        get endpointUrl (): string;
      } & (Omit<YourApiData<YourTypes[P]>, keyof TWaxApiRequest<any, any>>))
      : (YourApiData<YourTypes[P]> & {
        /**
         * New url to set per REST API. Pass `undefined` to switch back to default endpoint URL specified in the chain configuration ({@link IWaxOptionsChain.restApiEndpoint})
         */
        set endpointUrl (newUrl: string | undefined);
        /**
         * Retrieves the url used for calls to the specified REST API
         */
        get endpointUrl (): string;
      }) // Perform nested check
    )
  ) : never);
} & {
  /**
   * New url to set per API. Pass `undefined` to switch back to default endpoint URL specified in the chain configuration ({@link IWaxOptionsChain.restApiEndpoint})
   */
  set endpointUrl (newUrl: string | undefined);
  /**
   * Retrieves the url used for calls to the specified API
   */
  get endpointUrl (): string;
};

export type TDefaultRestApi = YourApiData<typeof HiveRestApiTypes>;

export type TDefaultJsonRpcApi = Readonly<{
  account_by_key_api: JsonRpcApiData<'account_by_key_api'>;
  block_api: JsonRpcApiData<'block_api'>;
  database_api: JsonRpcApiData<'database_api'>;
  network_broadcast_api: JsonRpcApiData<'network_broadcast_api'>;
  rc_api: JsonRpcApiData<'rc_api'>;
}>;

export type TWaxExtended<YourApi, PreviousCHain extends IHiveChainInterface = IHiveChainInterface> = PreviousCHain & { readonly api: TDefaultJsonRpcApi & YourApiData<YourApi> };

export type TWaxRestExtended<YourRestApi, PreviousCHain extends IHiveChainInterface = IHiveChainInterface> = PreviousCHain & { readonly restApi: TDefaultRestApi & YourApiData<YourRestApi> };

export interface IHiveChainInterface extends IWaxBaseInterface {
  /**
   * Broadcast transaction to the selected during Wax Chain initialization Hive Node
   *
   * @param {ApiTransaction|ITransaction|IOnlineTransaction} transaction Transaction object to be broadcasted.
   * If online-transaction is provided, additionally `performOnChainVerification` method is called.
   *
   * @throws {WaxError} on any Wax API-related error
   */
  broadcast(transaction: ApiTransaction | ITransaction | IOnlineTransaction): Promise<void>;

  /**
   * Allows to start transaction preparing process.
   *
   * Same as {@link IWaxBaseInterface.createTransactionWithTaPoS}, but pulls the reference block data from the remote
   *
   * @param {TTimestamp} [expirationTime] expiration time for the transaction. Applies upon the {@link ITransaction.sign} call or reading {@link ITransaction.transaction} property.
   *                                     Can be either any argument parsable by the Date constructor or relative time in seconds, minutes or hours
   *                                     (remember maximum expiration time for the transaction in mainnet is 1 hour), e.g.:
   *                                     `1699550966300` `"2023-11-09T17:29:30.028Z"` `new Date()` `"+10s"` `+30m` `+1h`. Defaults to `+1m`.
   *                                     Expiration time will be applied when calling any non-push-related method in {@link ITransaction}
   *
   * @returns {IOnlineTransaction} ready to use transaction interface allowing to fill transaction with its contents like Hive operations
   *
   * @throws {WaxError} on any Wax API-related error
   * @throws {WaxChainApiError} on any Hive API-related error
   */
  createTransaction(expirationTime?: TTimestamp): Promise<IOnlineTransaction>;

  /**
   * Encrypts given data using memo public keys of two accounts and dumps result to the encrypted string in `#encrypted` format
   *
   * @param {ISignatureProvider} wallet Wallet with imported {@link fromAccount} and {@link toAccount} memo public keys
   * @param {string} content Content to be encoded
   * @param {string} fromAccount first account to retrieve the memo public key used for encryption
   * @param {string} toAccount second account to retrieve the memo public key used for encryption
   *
   * @returns {Promise<string>} Encrypted content
   */
  encryptForAccounts(wallet: ISignatureProvider, content: string, fromAccount: string, toAccount: string): Promise<string>;

  /**
   * Allows to override default endpoint URL used to call RPC APIs initially configured by {@link IWaxOptionsChain} passed to {@link createHiveChain} builder function.
   */
  set endpointUrl(endpoint: string);

  /**
   * Allows to query for endpoint url used to perform API calls.
   */
  get endpointUrl(): string;

  /**
   * Extends hive chain interface with your custom API definitions
   *
   * @template YourApi
   * @param {YourApi} extendedHiveApiData your custom api definitions for use with class-validators and class-transformers
   *
   * @returns Wax Hive chain instance containing extended api
   */
  extend<YourApi>(extendedHiveApiData: YourApi): TWaxExtended<YourApi, this>;

  /**
   * Extends hive chain interface with your custom REST API definitions
   *
   * @template YourRestApi
   * @param {TDeepWaxApiRequestPartial<YourRestApi>} [extendedHiveRestApiData] your custom Rest api definitions for use with class-validators and class-transformers
   *
   * @returns Wax Hive chain instance containing extended Rest api
   */
  extendRest<YourRestApi>(extendedHiveRestApiData?: TDeepWaxApiRequestPartial<YourRestApi>): TWaxRestExtended<YourRestApi, this>;

  /**
   * Extends hive chain interface with your custom API definitions (allows you to call remote endpoints without response validation)
   *
   * @template YourApi
   * @returns Wax Hive chain instance containing extended api
   */
  extend<YourApi>(): TWaxExtended<YourApi>;

  /**
   * Calculates current manabar value for Hive account based on given arguments
   *
   * @param {string} account account for which we want to calculate current manabar value
   * @param {EManabarType} [manabarType] manabar type to calculate (can be upvote, downvote or rc manabar. Defaults to {@link EManabarType.UPVOTE})
   *
   * @returns {Promise<IManabarData>} Manabar data
   */
  calculateCurrentManabarValueForAccount(account: string, manabarType?: EManabarType): Promise<IManabarData>;

  /**
   * Calculates full regeneration time of the manabar value for Hive account based on given arguments
   *
   * @param {string} account account for which we want to calculate manabar full regeneration time
   * @param {EManabarType} [manabarType] manabar type to calculate (can be upvote, downvote or rc manabar. Defaults to {@link EManabarType.UPVOTE})
   *
   * @returns {Promise<Date>} Full regeneration time
   */
  calculateManabarFullRegenerationTimeForAccount(account: string, manabarType?: EManabarType): Promise<Date>;

  readonly api: TDefaultJsonRpcApi;

  readonly restApi: TDefaultRestApi;
}
