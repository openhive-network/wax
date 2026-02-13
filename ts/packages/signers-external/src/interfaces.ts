import type { AEncryptionProvider, IOnlineEncryptionProvider, TAccountName, TPublicKey, TRole } from "@hiveio/wax";

export interface IExternalWalletKeyInfo {
  publicKey: TPublicKey;
  description?: string;
};

export interface IExternalWalletHiveRoleKeyInfo extends IExternalWalletKeyInfo {
  role: TRole;
  account: TAccountName;
};

export interface IExternalWalletCustomKeyInfo extends IExternalWalletKeyInfo {
  customAlias: string;
};

/**
 * Represents a wallet contents loaded from external storage.
 */
export interface IExternalWalletContent extends IOnlineEncryptionProvider, AEncryptionProvider {
  enumStoredHiveKeys(account: TAccountName, role?: TRole): Iterable<IExternalWalletHiveRoleKeyInfo>;
  enumStoredCustomKeys(): Iterable<IExternalWalletCustomKeyInfo>;

  /**
   * Allows to remove all private keys matching given public one. Storage file is immediately synced to external storage.
   * @param publicKey public key identifying matching private keys to be removed.
   */
  removeKey(publicKey: TPublicKey): Promise<void>;
  /**
   * Allows to remove all private keys matching specified Hive Role key info. Storage file is immediately synced to external storage.
   * @param keyInfo key data needed to identify private key(s) to be removed.
   */
  removeKey(keyInfo: IExternalWalletHiveRoleKeyInfo): Promise<void>;
  /**
   * Allows to remove all private keys matching specified Custom key info. Storage file is immediately synced to external storage.
   * @param keyInfo key data needed to identify private key(s) to be removed.
   */
  removeKey(keyInfo: IExternalWalletCustomKeyInfo): Promise<void>;

  /**
   * Allows to remove all stored keys. Storage file is immediately synced to external storage.
   * @param removeWalletStorage - allows also to clear whole wallet storage, including locally saved encryption password.
   */
  clearContents(removeWalletStorage: boolean): Promise<void>;
};

/**
 * Represents a wallet storing its contents in the external storage - i.e. google drive.
 *
 * Use createExternalWallet function to create instance of this interface.
 *
 * You can use using construct to perform automatic resource management on cleanup.
 */
export interface IExternalWallet extends AsyncDisposable {
  /**
   * Loads contents for the specified Hive role from the underlying wallet file.
   * Returns an IExternalWalletContent instance initialized with data specific to pointed Hive account role.
   *
   * @param accountName - The Hive account name
   * @param role - The optional Hive role to load keys storage for (posting, active, owner, or memo). If ommitted, contents for all stored Hive roles will be loaded.
   * @returns IExternalWalletContent instance ready for signing and encryption
   * @throws {WaxExternalSignatureProviderError} If the custom key is not found in the wallet
   */
  loadForHiveKey(accountName: TAccountName, role?: TRole): Promise<IExternalWalletContent>;

  /**
   * Creates a wallet storage specific to given Hive role & account to save a provided private key.
   * Useful for scenarios when there was no wallet storage at all, or it didn't exist yet for specified role.
   *
   * @param role - The Hive role to create keys storage for (posting, active, owner, or memo)
   * @param accountName - The Hive account name
   * @param privateKey - The private key to store for this role
   * @returns IExternalWalletContent instance ready for signing and management of held keys
   * @throws {WaxExternalSignatureProviderError} If the account name is invalid or recovery password missing
   */
  createForHiveKey(role: TRole, accountName: TAccountName, privateKey: string): Promise<IExternalWalletContent>;

  /**
   * Loads contents for the specified custom key from the wallet file.
   * Returns an ExternalWalletSigner instance with the custom key active.
   *
   * @param customKeyAlias The custom key alias to load data for. Passed name cannot match Hive standard names like owner, active, posting, memo.
   * @returns IExternalWalletContent instance ready for signing and encryption
   * @throws {WaxExternalSignatureProviderError} If the custom key is not found in the wallet
   */
  loadForCustomKey(customKeyAlias: string): Promise<IExternalWalletContent>;

  /**
   * Creates or updates a wallet with a custom general-purpose key.
   * If the wallet file exists, the custom key is added/updated while preserving other keys.
   * If the wallet file doesn't exist, a new wallet is created.
   * Returns an IExternalWalletContent instance having saved specified custom key.
   *
   * @param customKeyAlias - The name/identifier for this custom key. Passed name cannot match Hive standard names like owner, active, posting, memo.
   * @param privateKey - The private key
   * @param description - Optional description of the key's purpose
   * @returns IExternalWalletContent instance ready for signing
   * @throws {WaxExternalSignatureProviderError} If the account name is invalid or recovery password missing
   */
  createForCustomKey(customKeyAlias: string, privateKey: string, description?: string): Promise<IExternalWalletContent>;

  /**
   * Returns the names of all Hive accounts stored in the wallet.
   *
   * @returns Array of account names found in the wallet
   */
  enumStoredAccounts(): Promise<TAccountName[]>;

  /**
   * Returns all configured roles for a specific Hive account in the wallet.
   *
   * @param accountName - The Hive account name to check
   * @returns Array of roles configured for this account (posting, active, owner, memo)
   */
  enumStoredRolesForAccount(accountName: TAccountName): Promise<TRole[]>;

  /**
   * Returns all custom (general-purpose) keys stored in the wallet.
   *
   * @returns Array of custom key info (alias, publicKey, description)
   */
  enumStoredCustomKeys(): Promise<Array<{ customAlias: string; publicKey: TPublicKey; description?: string }>>;

  /**
   * Allows to explicitly free all resources allocated to store data in memory.
   */
  close(): Promise<void>;

  /**
   * Gets the encryption key WIF used for wallet data encryption.
   * This allows the app to store the derived key in localStorage for automatic decryption.
   *
   * @returns The WIF encryption key
   */
  getEncryptionKeyWif(): string;
};

