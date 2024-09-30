import type { IBeekeeperUnlockedWallet, TPublicKey } from "@hiveio/beekeeper";

// @ts-expect-error ts(6133) Type WaxError is used in JSDoc
import type { WaxError } from "./errors";
import type { operation, transaction } from "./protocol";
import type { EManabarType } from "./detailed/chain_api";
import type { HiveApiTypes, HiveRestApiTypes } from "./detailed/chain_api_data";
import type { IWaxExtendableFormatter } from "./detailed/formatters/types";
import type { ApiOperation, ApiTransaction, NaiAsset } from "./detailed";
import type { EAssetName } from "./detailed/base_api";
import type { TTransactionRequiredAuthorities } from './detailed';
import type Long from "long";
import type { OperationBase } from "./detailed/operation_base";
import type { BlogPostOperation, ReplyOperation, DefineRecurrentTransferOperation, RecurrentTransferRemovalOperation, UpdateProposalOperation, WitnessSetPropertiesOperation } from "./detailed/complex_operations";
import type { ResourceCreditsOperation, CommunityOperation, FollowOperation, TAccountName } from './detailed/hive_apps_operations';

export type TNaiAssetConvertible = number | string | BigInt | Long;

export type TNaiAssetSource = TNaiAssetConvertible | NaiAsset;

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
export type TBlockHash = string;

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
}

interface ITransactionBase {

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
   * @throws {WaxError} on any Wax WASM related error
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
   * @param {IBeekeeperUnlockedWallet} wallet unlocked wallet to be used for decryption
   *
   * @returns {transaction} protobuf transaction object
   *
   * @throws {WaxError} on any Wax API-related error including validation error
   */
  decrypt(wallet: IBeekeeperUnlockedWallet): transaction;

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
   * Signs the transaction using given public key. Applies the transaction expiration time
   *
   * Encrypts operations if any were created using {@link IEncryptingTransaction} interface
   *
   * @param {IBeekeeperUnlockedWallet} wallet unlocked wallet to be used for signing
   * @param {TPublicKey} publicKey publicKey for signing (should be available in the wallet)
   *
   * @returns {THexString} transaction signature signed using given key
   *
   * @throws {WaxError} on any Wax API-related error or no public key found in the unlocked wallet or wallet is locked
   */
  sign(wallet: IBeekeeperUnlockedWallet, publicKey: TPublicKey): THexString;

/**
   * Adds your signature to the internal signatures array inside underlying transaction.
   *
   * @param {THexString} signature signature to add
   *
   * @returns {THexString} added transaction signature
   *
 */
  sign(signature: THexString): THexString;

  /**
   * Checks if underlying transaction has been already signed at least one time (after {@link sign})
   *
   * @returns {boolean} either true or false based on the signatures amount
   */
  isSigned(): boolean;

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
 * const tx = new waxFoundation.Transaction();
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
   * Pushes given operation to the operations array in the transaction
   * This can also add **multiple** operations to the transaction using a straightforward complex operation interface.
   *
   * We provide a standard set of factories with our implementation, but you can also create custom factories by extending the {@link OperationBase} class.
   *
   * @param {operation | OperationBase} op operation to append to the transaction (can be hive apps operation)
   * or Class instance for a complex operation that will produce operations including given params
   *
   * @see Complex operations:
   *  {@link BlogPostOperation} Creates a blog post. It requires the category on blog post to be set,
   *  {@link ReplyOperation} Creates a reply to a comment or a blog post. It requiers parent author and parent permlink to be set,
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
   * @example Building recurrent transfer with pair id and automaically generated removal
   * ```typescript
   *  tx.pushOperation(new DefineRecurrentTransferOperation({
   *    from: "initminer",
   *    to: "gtg",
   *    pairId: 100
   *  }));
   * ```
   *
   * @returns {ITransaction} current transaction instance
   *
   * @throws {WaxError} on any Wax API-related error
   */
  pushOperation(op: operation | OperationBase): ITransaction;

  /**
   * Starts encryption chain
   *
   * Remember that in order to encrypt operations with given {@link mainEncryptionKey} and optional {@link otherEncryptionKey}
   * you have to import those keys into the wallet passed to the {@link ITransactionBase.sign} method
   *
   * @param {TPublicKey} mainEncryptionKey First key to encrypt operations
   * @param {?TPublicKey} otherEncryptionKey Optional second key to encrypt operations
   *
   * @returns {IEncryptingTransaction} current transaction instance
   */
 startEncrypt(mainEncryptionKey: TPublicKey, otherEncryptionKey?: TPublicKey): IEncryptingTransaction;
}

/**
 * Same as {@link ITransaction}, but marks operations as encrypted using given keys, which will be encrypted upon
 * {@link ITransactionBase.sign}.
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
 * const tx = new waxFoundation.Transaction();
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
export interface IEncryptingTransaction extends ITransactionBase {
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
   *  {@link BlogPostOperation} Creates a blog post. It requires the category on blog post to be set,
   *  {@link ReplyOperation} Creates a reply to a comment or a blog post. It requiers parent author and parent permlink to be set,
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
   * @example Building recurrent transfer with pair id and automaically generated removal
   * ```typescript
   *  tx.pushOperation(new DefineRecurrentTransferOperation({
   *    from: "initminer",
   *    to: "gtg",
   *    pairId: 100
   *  }));
   * ```
   *
   * @returns {IEncryptingTransaction} current transaction instance
   *
   * @throws {WaxError} on any Wax API-related error
   */
  pushOperation(op: operation | OperationBase): IEncryptingTransaction;

  /**
   * Stops encryption chain
   *
   * Note: This call is optional if you are not going to push any other decrypted operations
   *
   * @returns {ITransaction} current transaction instance
   */
  stopEncrypt(): ITransaction;
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
   * Retrieves the set of account names (not authorities!) that are impacted by a given operation.
   *
   * @param {operation | ApiOperation} operation The operation object which could be either a protobuf opereation or operation returned from the Hive Nodes API
   * @returns {Set<TAccountName>} A set containing the account names that are impacted by the given operation.
   *
   * @throws {WaxError} on any Wax WASM related error
   */
  operationGetImpactedAccounts(operation: operation | ApiOperation): Set<TAccountName>;

  /**
   * Retrieves the bundled package version string
   *
   * @returns {string} application version
   */
  getVersion(): string;

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
   */
  vests(amount: TNaiAssetConvertible): NaiAsset;

  /**
   * Converts VESTS to HP in nai form
   * @param {NaiAsset} vests VESTS asset
   * @param {NaiAsset} totalVestingFundHive HIVE assest total vesting fund
   * @param {NaiAsset} totalVestingShares VESTS asset total shares
   */
  vestsToHp(vests: TNaiAssetSource, totalVestingFundHive: TNaiAssetSource, totalVestingShares: TNaiAssetSource): NaiAsset

  /**
   * Converts HBD to HIVE in nai form
   * @param {NaiAsset} hbd HBD asset
   * @param {NaiAsset} base HBD asset price base
   * @param {NaiAsset} quote HIVE asset price quote
   * @returns {NaiAsset} HIVE in nai form
   */
  hbdToHive(hbd: TNaiAssetSource, base: TNaiAssetSource, quote: TNaiAssetSource): NaiAsset;

  /**
   * Converts given amount of HIVE asset to HBD (nai form)
   * @param {NaiAsset} amount HIVE asset
   * @param {NaiAsset} base HBD asset price base taken i.e. from database_api.get_current_price_feed call
   * @param {NaiAsset} quote HIVE asset price quote taken i.e. from database_api.get_current_price_feed call
   * @returns {NaiAsset} HBD in nai form
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
   * @returns {IPrivateKeyData} Genrated private key along with the associated public key in WIF format
   *
   * @throws {WaxError} on any Wax API-related error
   */
  getPrivateKeyFromPassword(account: string, role: string, password: string): IPrivateKeyData;

  /**
   * Encrypts given data using two keys and dumps result to the encrypted string in `#encrypted` format
   *
   * @param {IBeekeeperUnlockedWallet} wallet Wallet with imported {@link mainEncryptionKey} and {@link otherEncryptionKey} keys
   * @param {string} content Content to be encoded
   * @param {TPublicKey} mainEncryptionKey First key to encrypt operations
   * @param {?TPublicKey} otherEncryptionKey Optional second key to encrypt operations
   * @param {?number} nonce optional nonce to be explicitly specified for encryption
   *
   * @returns {string} Encrypted content
   */
  encrypt(wallet: IBeekeeperUnlockedWallet, content: string, mainEncryptionKey: TPublicKey, otherEncryptionKey?: TPublicKey, nonce?: number): string;

  /**
   * Decrypts given data from the encrypted string in `#encrypted` format
   *
   * @param {IBeekeeperUnlockedWallet} wallet Wallet with imported encryption keys
   * @param {string} encrypted Content to be decoded
   *
   * @returns {string} Decoded content
   */
  decrypt(wallet: IBeekeeperUnlockedWallet, encrypted: string): string;

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
   * Calculates account HP based on given vests, total vesting fund HIVE and total vesting shares
   *
   * @param {TNaiAssetSource} vests VESTS asset
   * @param {TNaiAssetSource} totalVestingFundHive HIVE asset total vesting fund
   * @param {TNaiAssetSource} totalVestingShares VESTS asset total shares
   * @returns {NaiAsset} HP in nai form
   */
  calculateAccountHp(vests: TNaiAssetSource, totalVestingFundHive: TNaiAssetSource, totalVestingShares: TNaiAssetSource): NaiAsset;

  /**
   * Calculates witness votes HP based on given votes, total vesting fund HIVE and total vesting shares
   *
   * @param {number} votes witness votes
   * @param {TNaiAssetSource} totalVestingFundHive HIVE asset total vesting fund
   * @param {TNaiAssetSource} totalVestingShares VESTS asset total shares
   * @returns {NaiAsset} HP in nai form
   */
  calculateWitnessVotesHp(votes: number, totalVestingFundHive: TNaiAssetSource, totalVestingShares: TNaiAssetSource): NaiAsset;

  /**
   * Calculate current HP APR
   *
   * @param {number} headBlockNum head block number
   * @param {number} vestingRewardPercent vesting reward percent
   * @param {TNaiAssetSource} virtualSupply virtual supply
   * @param {TNaiAssetSource} totalVestingFundHive HIVE asset total vesting fund HIVE
   * @returns {number} HP APR percent with 2 decimals
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
   * @param {?TTimestamp} expirationTime expiration time for the transaction. Applies upon the {@link ITransaction.sign} call or reading {@link ITransaction.transaction} property.
   *                                    Can be either any argument parsable by the {@link Date} constructor or relative time in seconds, minutes or hours
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
   * Deletes the created wax proto_protocol instance
   */
  delete(): void;
}

/**
 * @internal
 */
type ApiData<T extends keyof typeof HiveApiTypes> = YourApiData<typeof HiveApiTypes[T]>;

export type TWaxApiRequest<TReq, TRes> = { readonly params: TReq; readonly result: TRes; };

export type TDeepWaxRestApiRequestPartial<T> = T extends object ? {
  [P in keyof T]?: TDeepWaxRestApiRequestPartial<T[P]>;
} & Omit<TWaxRestApiRequest<any, any>, 'params' | 'result'> : T;

export type TWaxRestApiRequest<TReq, TRes> = {
  readonly params: TReq;
  readonly result: TRes;
  readonly responseArray?: boolean;
  readonly method?: string;
  readonly urlPath?: string
};

/**
 * @internal
 */
type YourApiRestData<YourTypes> = {
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
    } & (Omit<YourApiRestData<YourTypes[P]>, keyof TWaxRestApiRequest<any, any>>))
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
      } & (Omit<YourApiRestData<YourTypes[P]>, keyof TWaxRestApiRequest<any, any>>))
      : (YourApiRestData<YourTypes[P]> & {
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
   * New url to set per REST API. Pass `undefined` to switch back to default endpoint URL specified in the chain configuration ({@link IWaxOptionsChain.restApiEndpoint})
   */
  set endpointUrl (newUrl: string | undefined);
  /**
   * Retrieves the url used for calls to the specified REST API
   */
  get endpointUrl (): string;
};

/**
 * @internal
 */
type YourApiData<YourTypes> = {
  readonly [P in keyof YourTypes]: YourTypes[P] extends { readonly params: new (...args: any) => Readonly<infer ParamsType>; readonly result: new (...args: any) => Readonly<infer ResultType>; }
    ? (params: ParamsType) => Promise<ResultType>
    : (YourTypes[P] extends { readonly params: infer ParamsType; readonly result: infer ResultType; } ? (params: ParamsType) => Promise<ResultType> : never);
} & {
  /**
   * New url to set per API. Pass `undefined` to switch back to default endpoint URL specified in the chain configuration ({@link IWaxOptionsChain.apiEndpoint})
   */
  set endpointUrl (newUrl: string | undefined);
  /**
   * Retrieves the url used for calls to the specified API
   */
  get endpointUrl (): string;
};

export type TDefaultRestApi = YourApiRestData<typeof HiveRestApiTypes>;

export type TDefaultHiveApi = Readonly<{
  account_by_key_api: ApiData<'account_by_key_api'>;
  block_api: ApiData<'block_api'>;
  database_api: ApiData<'database_api'>;
  network_broadcast_api: ApiData<'network_broadcast_api'>;
  rc_api: ApiData<'rc_api'>;
}>;

export type TWaxExtended<YourApi, PreviousCHain extends IHiveChainInterface = IHiveChainInterface> = PreviousCHain & { readonly api: TDefaultHiveApi & { readonly [k in keyof YourApi]: YourApiData<YourApi[k]> } };

export type TWaxRestExtended<YourRestApi, PreviousCHain extends IHiveChainInterface = IHiveChainInterface> = PreviousCHain & { readonly restApi: TDefaultRestApi & { readonly [k in keyof YourRestApi]: YourApiRestData<YourRestApi[k]> } };

export interface IHiveChainInterface extends IWaxBaseInterface {
  /**
   * Broadcast transaction to the selected during Wax Chain initialization Hive Node
   *
   * @param {ApiTransaction|ITransaction} transaction Transaction object to be broadcasted
   *
   * @throws {WaxError} on any Wax API-related error
   */
  broadcast(transaction: ApiTransaction | ITransaction): Promise<void>;

  /**
   * Allows to start transaction preparing process.
   *
   * Same as {@link IWaxBaseInterface.createTransaction}, but pulls the reference block data from the remote
   *
   * @param {?TTimestamp} expirationTime expiration time for the transaction. Applies upon the {@link ITransaction.sign} call or reading {@link ITransaction.transaction} property.
   *                                     Can be either any argument parsable by the {@link Date} constructor or relative time in seconds, minutes or hours
   *                                     (remember maximum expiration time for the transaction in mainnet is 1 hour), e.g.:
   *                                     `1699550966300` `"2023-11-09T17:29:30.028Z"` `new Date()` `"+10s"` `+30m` `+1h`. Defaults to `+1m`.
   *                                     Expiration time will be applied when calling any non-push-related method in {@link ITransaction}
   *
   * @returns {ITransaction} ready to use transaction interface allowing to fill transaction with its contents like Hive operations
   *
   * @throws {WaxError} on any Wax API-related error
   * @throws {WaxChainApiError} on any Hive API-related error
   */
  createTransaction(expirationTime?: TTimestamp): Promise<ITransaction>;

  /**
   * Encrypts given data using memo public keys of two accounts and dumps result to the encrypted string in `#encrypted` format
   *
   * @param {IBeekeeperUnlockedWallet} wallet Wallet with imported {@link fromAccount} and {@link toAccount} memo public keys
   * @param {string} content Content to be encoded
   * @param {string} fromAccount first account to retrieve the memo public key used for encryption
   * @param {?string} toAccount second account to retrieve the memo public key used for encryption
   *
   * @returns {Promise<string>} Encrypted content
   */
  encryptForAccounts(wallet: IBeekeeperUnlockedWallet, content: string, fromAccount: string, toAccount?: string): Promise<string>;

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
   * @param extendedHiveApiData your custom api definitions for use with class-validators and class-transformers
   *
   * @returns Wax Hive chain instance containing extended api
   */
  extend<YourApi>(extendedHiveApiData: YourApi): TWaxExtended<YourApi, this>;

  /**
   * Extends hive chain interface with your custom REST API definitions
   *
   * @param extendedHiveRestApiData your custom Rest api definitions for use with class-validators and class-transformers
   *
   * @returns Wax Hive chain instance containing extended Rest api
   */
  extendRest<YourRestApi>(extendedHiveRestApiData?: TDeepWaxRestApiRequestPartial<YourRestApi>): TWaxRestExtended<YourRestApi, this>;

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

  readonly api: TDefaultHiveApi;

  readonly restApi: TDefaultRestApi;
}
