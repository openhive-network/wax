import type { IBeekeeperUnlockedWallet, TPublicKey } from "@hive/beekeeper";

// @ts-expect-error ts(6133) Type WaxError is used in JSDoc
import type { WaxError } from "./errors";
import type { ArticleBuilder, ReplyBuilder, RecurrentTransferBuilder, RecurrentTransferPairIdBuilder, UpdateProposalBuilder } from "./detailed/operation_factories";
import type { CommunityOperationBuilder, FollowOperationBuilder, ResourceCreditsOperationBuilder } from "./detailed/custom_jsons";
import type { operation, transaction } from "./protocol";
import type { EManabarType } from "./detailed/chain_api";
import type { HiveApiTypes } from "./detailed/chain_api_data";
import type { IWaxExtendableFormatter } from "./detailed/formatters/types";
import type { HiveAppsOperation, NaiAsset } from "./detailed";
import type { EAssetName } from "./detailed/base_api";
import type Long from "long";
import { IBuiltHiveAppsOperation, OperationBuilder } from "./detailed/operation_builder";

export type TInterfaceOperationBuilder<T> = T extends OperationBuilder ? (Omit<T, 'build'|'push'> & { api: IWaxBaseInterface }) : never;

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

interface ITransactionBuilderBase {

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
   * Encrypts operations if any were created using {@link IEncryptingTransactionBuilder} interface
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
   * Encrypts operations if any were created using {@link IEncryptingTransactionBuilder} interface
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
 * Default Transaction Builder interface for adding operations, using builders and retrieving base information about transaction,
 * like id, sigDigest and signingKeys. Example usage:
 *
 * @example Base transaction builder usage
 * ```typescript
 * const tx = new waxFoundation.TransactionBuilder();
 *
 * tx.push({
 *   vote: {
 *     voter: "otom",
 *     author: "c0ff33a",
 *     permlink: "ewxhnjbj",
 *     weight: 2200
 *   }
 * });
 * ```
 */
export interface ITransactionBuilder extends ITransactionBuilderBase {
  /**
   * Pushes given operation to the operations array in the transaction
   *
   * @param {operation | IBuiltHiveAppsOperation | HiveAppsOperation} op operation to append to the transaction (can be hive apps operation)
   *
   * @returns {ITransactionBuilder} current transaction builder instance
   *
   * @throws {WaxError} on any Wax API-related error
   */
  push(op: operation | IBuiltHiveAppsOperation | HiveAppsOperation<any>): ITransactionBuilder;

  /**
   * Starts encryption chain
   *
   * Remember that in order to encrypt operations with given {@link mainEncryptionKey} and optional {@link otherEncryptionKey}
   * you have to import those keys into the wallet passed to the {@link ITransactionBuilderBase.sign} or {@link ITransactionBuilderBase.build} method
   *
   * @param {TPublicKey} mainEncryptionKey First key to encrypt operations
   * @param {?TPublicKey} otherEncryptionKey Optional second key to encrypt operations
   *
   * @returns {IEncryptingTransactionBuilder} current transaction builder instance
   */
  startEncrypt(mainEncryptionKey: TPublicKey, otherEncryptionKey?: TPublicKey): IEncryptingTransactionBuilder;

  /**
   * Uses given builder to construct operations and push them to the current instance of the transaction builder
   *
   * @param {TBuilder} builderConstructor Builder constructor (class)
   * @param {(builder: TInterfaceOperationBuilder<InstanceType<TBuilder>) => void} builderFn Lambda function for your builder configuration
   * @param {ConstructorParameters<TBuilder>} constructorArgs Optional arguments to pass to the builder constructor
   *
   * @returns {ITransactionBuilder} current transaction builder instance
   *
   * @throws {WaxError} on any Wax API-related error
   *
   * @see Operation factories: {@link ArticleBuilder}, {@link ReplyBuilder}, {@link RecurrentTransferPairIdBuilder}, {@link RecurrentTransferBuilder}, {@link UpdateProposalBuilder}
   * @see Hive Apps operation builders: {@link CommunityOperationBuilder}, {@link FollowOperationBuilder}, {@link ResourceCreditsOperationBuilder}
   *
   * @example Building article
   * ```typescript
   *  tx.useBuilder(ArticleBuilder, builder => {
   *      builder.setCategory('blog');
   *  }, 'gtg', 'My first post', '# Hello world!');
   * ```
   */
  useBuilder<TBuilder extends new (...args: any[]) => any>(
    builderConstructor: TBuilder,
    builderFn: (builder: TInterfaceOperationBuilder<InstanceType<TBuilder>>) => void,
    ...constructorArgs: ConstructorParameters<TBuilder>
  ): ITransactionBuilder;
}

/**
 * Same as {@link ITransactionBuilder}, but marks operations as encrypted using given keys, which will be encrypted upon
 * {@link ITransactionBuilderBase.sign} or {@link ITransactionBuilderBase.build}.
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
 * @example Base encrypting transaction builder usage
 * ```typescript
 * const tx = new waxFoundation.TransactionBuilder();
 *
 * tx.startEncrypt(myPublicKey).push({
 *    transfer: {
 *      amount: chain.hive(100),
 *      from_account: "gtg",
 *      to_account: "initminer",
 *      memo: "This should be encrypted"
 *    }
 * }).stopEncrypt();
 * ```
 */
export interface IEncryptingTransactionBuilder extends ITransactionBuilderBase {
  /**
   * Pushes given operation to the operations array in the transaction
   *
   * @param {operation | IBuiltHiveAppsOperation | HiveAppsOperation} op operation to append to the transaction (can be hive apps operation)
   *
   * @returns {IEncryptingTransactionBuilder} current transaction builder instance
   *
   * @throws {WaxError} on any Wax API-related error
   */
  push(op: operation | IBuiltHiveAppsOperation | HiveAppsOperation<any>): IEncryptingTransactionBuilder;

  /**
   * Stops encryption chain
   *
   * Note: This call is optional if you are not going to push any other decrypted operations
   *
   * @returns {ITransactionBuilder} current transaction builder instance
   */
  stopEncrypt(): ITransactionBuilder;

  /**
   * Uses given builder to construct operations and push them to the current instance of the transaction builder
   *
   * @param {TBuilder} builderConstructor Builder constructor (class)
   * @param {(builder: TInterfaceOperationBuilder<InstanceType<TBuilder>) => void} builderFn Lambda function for your builder configuration
   * @param {ConstructorParameters<TBuilder>} constructorArgs Optional arguments to pass to the builder constructor
   *
   * @returns {IEncryptingTransactionBuilder} current transaction builder instance
   *
   * @throws {WaxError} on any Wax API-related error
   *
   * @see Operation factories: {@link ArticleBuilder}, {@link ReplyBuilder}, {@link RecurrentTransferPairIdBuilder}, {@link RecurrentTransferBuilder}, {@link UpdateProposalBuilder}
   * @see Hive Apps operation builders: {@link CommunityOperationBuilder}, {@link FollowOperationBuilder}, {@link ResourceCreditsOperationBuilder}
   *
   * @example Building article
   * ```typescript
   *  tx.useBuilder(ArticleBuilder, builder => {
   *      builder.setCategory('blog');
   *  }, 'gtg', 'My first post', '# Hello world!');
   * ```
   */
  useBuilder<TBuilder extends new (...args: any[]) => any>(
    builderConstructor: TBuilder,
    builderFn: (builder: TInterfaceOperationBuilder<InstanceType<TBuilder>>) => void,
    ...constructorArgs: ConstructorParameters<TBuilder>
  ): IEncryptingTransactionBuilder;
}

export interface ITransactionBuilderConstructor {
  /**
   * Constructs a new Transaction Builder object with given data
   *
   * @param {TBlockHash} taposBlockId reference block id (can be head block id) for TaPoS
   * @param {TTimestamp} expirationTime expiration time for the transaction. Applies upon the {@link ITransactionBuilder.build} call.
   *                                    Can be either any argument parsable by the {@link Date} constructor or relative time in seconds, minutes or hours
   *                                    (remember maximum expiration time for the transaction in mainnet is 1 hour), e.g.:
   *                                    `1699550966300` `"2023-11-09T17:29:30.028Z"` `new Date()` `"+10s"` `+30m` `+1h`.
   *                                    Expiration time will be applied when calling any non-push-related method in {@link ITransactionBuilder}
   *
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

  readonly ASSETS: Readonly<Record<EAssetName, NaiAsset>>;

  readonly formatter: IWaxExtendableFormatter;
  readonly waxify: IWaxExtendableFormatter['waxify'];

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
   * Retrieves HIVE in nai form with given amount
   * @param {number | string | BigInt | Long} amount amount of HIVE
   * @returns {NaiAsset} HIVE in nai form
   */
  hive(amount: number | string | BigInt | Long): NaiAsset;

  /**
   * Retrieves HBD in nai form with given amount
   * @param {number | string | BigInt | Long} amount amount of HBD
   * @returns {NaiAsset} HBD in nai form
   */
  hbd(amount: number | string | BigInt | Long): NaiAsset;

  /**
   * Retrieves VESTS in nai form with given amount
   * @param {number | string | BigInt | Long} amount amount of VESTS
   * @returns {NaiAsset} VESTS in nai form
   */
  vests(amount: number | string | BigInt | Long): NaiAsset;

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
   * Encrypts given data using two keys and dumps result to the encrypted string in `#encrypted` format
   *
   * @param {IBeekeeperUnlockedWallet} wallet Wallet with imported {@link from} and {@link to} keys
   * @param {string} content Content to be encoded
   * @param {TPublicKey} from first public key used for encryption
   * @param {?TPublicKey} to second public key used for encryption
   *
   * @returns {string} Encrypted content
   */
  encrypt(wallet: IBeekeeperUnlockedWallet, content: string, from: TPublicKey, to?: TPublicKey): string;

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
   *                                     `1699550966300` `"2023-11-09T17:29:30.028Z"` `new Date()` `"+10s"` `+30m` `+1h`. Defaults to `+1m`.
   *                                     Expiration time will be applied when calling any non-push-related method in {@link ITransactionBuilder}
   *
   * @returns {ITransactionBuilder} ready to use transaction builder interface
   *
   * @throws {WaxError} on any Wax API-related error
   * @throws {WaxChainApiError} on any Hive API-related error
   */
  getTransactionBuilder(expirationTime?: TTimestamp): Promise<ITransactionBuilder>;

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
