import createBeekeeper, { IBeekeeperInstance, IBeekeeperUnlockedWallet } from "@hiveio/beekeeper";
import { IHiveChainInterface, TRole } from "@hiveio/wax";
import { WaxExternalSignatureProviderError } from "./errors.js";
import { ExternalWalletSigner } from "./external-wallet-signer.js";

import type { IWalletData } from "./wallet_zod_versioning.js";
import {
  parseWalletData,
  updateWalletRole,
  removeWalletRole
} from "./wallet_zod_versioning.js";
import { GoogleStorageProvider, TokenProvider } from "./storage-providers/google-storage-provider.js";
import { EncryptionKeyManager } from "./encryption-key-manager.js";

// Re-export for backwards compatibility
export { AStorageProviderBase } from "./storage-provider-base.js";
export { ExternalWalletSigner } from "./external-wallet-signer.js";

export enum EStorageProviders {
  GOOGLE_DRIVE
}

/**
 * Result of loading wallet from storage
 */
export interface IWalletLoadResult {
  accountName: string;
  roles: TRole[];
}

/**
 * Public key information for wallet keys
 */
export type TPublicKeyInfo =
  | { type: 'hive'; role: TRole; publicKey: string }
  | { type: 'custom'; keyName: string; publicKey: string };

/**
 * External signature provider factory that manages wallet data in external storage (e.g., Google Drive).
 *
 * This class handles:
 * - Wallet creation and key management for different Hive roles (posting, active, owner, memo)
 * - Custom general-purpose key management for non-Hive use cases
 * - Loading existing wallets from storage
 * - Creating ExternalWalletSigner instances for transaction signing and encryption
 * - Querying wallet state and key existence through methods (similar to Beekeeper's approach)
 *
 * Encryption Model:
 * - Wallet data is encrypted using a key derived from user's recovery password
 * - The derived encryption key is stored in localStorage for automatic decryption on the same device
 * - On a new device, the user must provide their recovery password to derive the encryption key
 *
 * Key Access Pattern:
 * Unlike exposing raw data structures, this provider follows Beekeeper's pattern of providing
 * method-based access to wallet data:
 * - Use hasWallet() to check if wallet exists
 * - Use hasRole() / hasCustomKey() to check for specific keys
 * - Use getPublicKey() / getCustomPublicKey() to retrieve individual public keys
 * - Use hasMatchingPrivateKey() to verify key ownership
 * - Use getPublicKeys() to get all keys with their metadata
 *
 * Usage:
 * ```typescript
 * // Check if recovery password is needed (e.g., on new device)
 * let provider: ExternalSignatureProvider;
 *
 * if (ExternalSignatureProvider.needsRecoveryPassword('wallet.json')) {
 *   // No encryption key in localStorage - prompt user for recovery password
 *   const recoveryPassword = await promptUserForRecoveryPassword();
 *   provider = new ExternalSignatureProvider(chain, 'wallet.json', tokenProvider, recoveryPassword);
 * } else {
 *   // Encryption key available - no password needed
 *   provider = new ExternalSignatureProvider(chain, 'wallet.json', tokenProvider);
 * }
 *
 * // Check if wallet exists
 * if (await provider.hasWallet()) {
 *   const accountName = await provider.getAccountName();
 *
 *   // Check for specific role
 *   if (await provider.hasRole('posting')) {
 *     const pubKey = await provider.getPublicKey('posting');
 *     console.log(`Posting key: ${pubKey}`);
 *   }
 * }
 *
 * // Create a new wallet with a Hive role key
 * // User must provide their recovery password for encryption
 * const signer = await provider.createWalletFor('posting', 'myaccount', 'private-key', 'user-recovery-password');
 * await signer.signTransaction(tx);
 *
 * // Or load an existing wallet and switch to a role
 * await provider.loadWallet();
 * const activeSigner = await provider.for('active');
 * await activeSigner.signTransaction(tx);
 *
 * // Create and use custom keys
 * const customSigner = await provider.createCustomKey('my-app-key', 'myaccount', 'private-key', 'App signing key', 'user-recovery-password');
 * await customSigner.signTransaction(tx);
 *
 * // Check if a specific public key exists
 * const hasKey = await provider.hasMatchingPrivateKey('STM123...');
 *
 * // Get all public keys
 * const allKeys = await provider.getPublicKeys();
 * for (const keyInfo of allKeys) {
 *   if (keyInfo.type === 'hive') {
 *     console.log(`${keyInfo.role}: ${keyInfo.publicKey}`);
 *   } else {
 *     console.log(`${keyInfo.keyName}: ${keyInfo.publicKey}`);
 *   }
 * }
 * ```
 */
export class ExternalSignatureProvider {
  readonly #chain: IHiveChainInterface;
  readonly #fileName: string;
  readonly #storage: GoogleStorageProvider;

  #beekeeper: IBeekeeperInstance | undefined;
  #wallet: IBeekeeperUnlockedWallet | undefined;

  // Recovery password stored in memory for encryption operations
  #recoveryPassword: string | undefined;

  /**
   * Checks if recovery password is required to create an instance.
   * Returns true if encryption key is not available in localStorage.
   *
   * Use this before creating an ExternalSignatureProvider instance to determine
   * if you need to prompt the user for their recovery password.
   *
   * @param fileName - Name of the wallet file in storage
   * @returns True if recovery password will be required in constructor
   *
   * @example
   * ```typescript
   * if (ExternalSignatureProvider.needsRecoveryPassword('wallet.json')) {
   *   const recoveryPassword = await promptUserForRecoveryPassword();
   *   provider = new ExternalSignatureProvider(chain, 'wallet.json', tokenProvider, recoveryPassword);
   * } else {
   *   provider = new ExternalSignatureProvider(chain, 'wallet.json', tokenProvider);
   * }
   * ```
   */
  public static needsRecoveryPassword(fileName: string): boolean {
    return !EncryptionKeyManager.hasEncryptionKey(fileName);
  }

  /**
   * Creates a new ExternalSignatureProvider instance
   *
   * @param chain - The Hive chain interface for validation and crypto operations
   * @param fileName - Name of the wallet file in storage
   * @param tokenProvider - Callback function that returns a fresh OAuth token for storage access
   * @param recoveryPassword - Optional recovery password (required if encryption key not in localStorage)
   * @throws {WaxExternalSignatureProviderError} If encryption key not available and no recovery password provided
   */
  public constructor (
    chain: IHiveChainInterface,
    fileName: string,
    tokenProvider: TokenProvider,
    recoveryPassword?: string
  ) {
    this.#chain = chain;
    this.#fileName = fileName;
    this.#storage = new GoogleStorageProvider(tokenProvider);
    this.#recoveryPassword = recoveryPassword;
  }

  private async initBeekeeperWallet (): Promise<void> {
    if (this.#wallet)
      return;

    this.#beekeeper = await createBeekeeper({ inMemory: true, enableLogs: false, unlockTimeout: 365 * 24 * 60 * 60 * 1000 });

    const session = this.#beekeeper.createSession('external-signer-session');

    this.#wallet = (await session.createWallet('external-signer-wallet')).wallet;
  }

  /**
   * Encrypts wallet data using a key derived from recovery password.
   *
   * @param walletData - The wallet data to encrypt
   * @param encryptionKeyWif - Encryption key WIF (derived from recovery password)
   * @returns Encrypted data as string
   */
  private async encryptWalletData(
    walletData: IWalletData,
    encryptionKeyWif: string
  ): Promise<string> {
    await this.initBeekeeperWallet();

    // Import key to get public key
    const encryptionPublicKey = await this.#wallet!.importKey(encryptionKeyWif);

    // Convert wallet data to JSON
    const walletJson = JSON.stringify(walletData);

    // Encrypt with the key using Beekeeper (using same key for both sides)
    const encrypted = this.#wallet!.encryptData(
      walletJson,
      encryptionPublicKey
    );

    return encrypted;
  }

  /**
   * Decrypts wallet data using encryption key.
   * Tries to load key from localStorage first, otherwise derives from recovery password.
   *
   * @param encryptedData - The encrypted wallet data
   * @param recoveryPassword - Optional recovery password (if encryption key not available)
   * @returns Decrypted wallet data
   */
  private async decryptWalletData(
    encryptedData: string,
    recoveryPassword?: string
  ): Promise<IWalletData> {
    await this.initBeekeeperWallet();

    // Try to load encryption key from localStorage
    let encryptionKeyWif = EncryptionKeyManager.loadEncryptionKey(this.#fileName);

    // If no stored key, try to derive from recovery password
    if (!encryptionKeyWif) {
      const password = recoveryPassword || this.#recoveryPassword;

      if (!password) {
        throw new WaxExternalSignatureProviderError(
          'No decryption key available. Please provide recovery password.',
          undefined,
          'RECOVERY_PASSWORD_REQUIRED'
        );
      }

      encryptionKeyWif = EncryptionKeyManager.deriveKeyFromPassword(this.#chain, password);
    }

    const encryptionPublicKey = await this.#wallet!.importKey(encryptionKeyWif);

    try {
      // Decrypt using the encryption key
      const decrypted = this.#wallet!.decryptData(
        encryptedData,
        encryptionPublicKey
      );

      return parseWalletData(JSON.parse(decrypted));
    } catch (error) {
      throw new WaxExternalSignatureProviderError(
        'Failed to decrypt wallet data. Invalid password or corrupted data.',
        error instanceof Error ? error : undefined,
        'DECRYPTION_FAILED'
      );
    }
  }



  /**
   * Switches to the specified role, loading its key from the wallet file.
   * Returns an ExternalWalletSigner instance with the role's key active.
   *
   * @param role - The role to activate (posting, active, owner, or memo)
   * @param recoveryPassword - Optional recovery password (required if encryption key not available)
   * @returns ExternalWalletSigner instance ready for signing and encryption
   * @throws {WaxExternalSignatureProviderError} If the role's key is not found in the wallet
   */
  public async for (role: TRole, recoveryPassword?: string): Promise<ExternalWalletSigner> {
    await this.initBeekeeperWallet();

    const rawData = await this.#storage.get(this.#fileName);

    const parsedData: IWalletData = await this.decryptWalletData(rawData, recoveryPassword);

    const key = parsedData.hive.roleDefinitions[role];

    if (!key)
      throw new WaxExternalSignatureProviderError(`No key found for role: ${role}`, undefined, 'KEY_NOT_FOUND');

    const publicKey = await this.#wallet!.importKey(key.privateKey);

    return new ExternalWalletSigner(this.#chain, this.#wallet!, publicKey, parsedData.hive.account);
  }

  /**
   * Creates or updates a wallet with a key for the specified role.
   * Derives encryption key from recovery password and stores it in localStorage.
   *
   * @param role - The role to create/update (posting, active, owner, or memo)
   * @param accountName - The Hive account name
   * @param privateKey - The private key for this role
   * @param recoveryPassword - Recovery password for wallet encryption (required for new wallets)
   * @returns ExternalWalletSigner instance ready for signing
   * @throws {WaxExternalSignatureProviderError} If the account name is invalid or recovery password missing
   */
  public async createWalletFor (
    role: TRole,
    accountName: string,
    privateKey: string,
    recoveryPassword?: string
  ): Promise<ExternalWalletSigner> {
    if (!this.#chain.isValidAccountName(accountName))
      throw new WaxExternalSignatureProviderError(`Invalid account name: ${accountName}`, undefined, 'INVALID_ACCOUNT_NAME');

    await this.initBeekeeperWallet();

    const publicKey = await this.#wallet!.importKey(privateKey);

    let existingData: IWalletData | undefined;
    let encryptionKeyWif: string;

    // Determine which password to use
    const password = recoveryPassword || this.#recoveryPassword;

    // Try to load existing wallet
    try {
      if (await this.#storage.exists(this.#fileName)) {
        const rawData = await this.#storage.get(this.#fileName);
        existingData = await this.decryptWalletData(rawData, password);
      }
    } catch (error) {
      // If decryption fails and no recovery password provided, throw error
      if (!password) {
        throw new WaxExternalSignatureProviderError(
          'Existing wallet is encrypted but no recovery password provided',
          error instanceof Error ? error : undefined,
          'RECOVERY_PASSWORD_REQUIRED'
        );
      }
      throw error;
    }

    // Check if we have encryption key in localStorage or derive from password
    const existingKey = EncryptionKeyManager.loadEncryptionKey(this.#fileName);

    if (existingKey) {
      encryptionKeyWif = existingKey;
    } else {
      if (!password) {
        throw new WaxExternalSignatureProviderError(
          'Recovery password is required to create wallet encryption key',
          undefined,
          'RECOVERY_PASSWORD_REQUIRED'
        );
      }
      encryptionKeyWif = EncryptionKeyManager.deriveKeyFromPassword(this.#chain, password);
      EncryptionKeyManager.storeEncryptionKey(this.#fileName, encryptionKeyWif);
      this.#recoveryPassword = password;
    }

    const walletData = updateWalletRole(existingData, accountName, role, privateKey, publicKey);

    // Encrypt wallet data
    const encryptedData = await this.encryptWalletData(walletData, encryptionKeyWif);
    await this.#storage.save(this.#fileName, encryptedData);

    return new ExternalWalletSigner(this.#chain, this.#wallet!, publicKey, accountName);
  }

  /**
   * Loads the wallet from storage and imports all keys into Beekeeper.
   * Does NOT set an active role - call `for()` to select which role to use.
   *
   * @param recoveryPassword - Optional recovery password (required if encryption key not available)
   * @returns Object containing the account name and list of available roles
   * @throws {WaxExternalSignatureProviderError} If wallet file doesn't exist or is invalid
   */
  public async loadWallet (recoveryPassword?: string): Promise<IWalletLoadResult> {
    if (!await this.#storage.exists(this.#fileName))
      throw new WaxExternalSignatureProviderError('Wallet file not found', undefined, 'WALLET_NOT_FOUND');

    await this.initBeekeeperWallet();

    const rawData = await this.#storage.get(this.#fileName);
    const parsedData: IWalletData = await this.decryptWalletData(rawData, recoveryPassword);

    if (!parsedData.hive.account)
      throw new WaxExternalSignatureProviderError('Wallet data missing account name', undefined, 'INVALID_WALLET_DATA');

    const roles: TRole[] = ['posting', 'active', 'owner', 'memo'];
    const loadedRoles: TRole[] = [];

    // Load Hive role keys
    for (const role of roles) {
      const roleData = parsedData.hive.roleDefinitions[role];
      if (!roleData) continue;

      await this.#wallet!.importKey(roleData.privateKey);
      loadedRoles.push(role);
    }

    // Load custom keys if wallet is V2
    if (parsedData.version === '2.0.0' && parsedData.generalPurposeKeys) {
      for (const keyData of Object.values(parsedData.generalPurposeKeys)) {
        await this.#wallet!.importKey(keyData.privateKey);
      }
    }

    if (loadedRoles.length === 0)
      throw new WaxExternalSignatureProviderError('Wallet has no keys', undefined, 'WALLET_EMPTY');

    // If we successfully loaded with recovery password on a new device,
    // derive and store encryption key for future use
    const password = recoveryPassword || this.#recoveryPassword;
    if (password && !EncryptionKeyManager.hasEncryptionKey(this.#fileName)) {
      const encryptionKeyWif = EncryptionKeyManager.deriveKeyFromPassword(this.#chain, password);
      EncryptionKeyManager.storeEncryptionKey(this.#fileName, encryptionKeyWif);
      this.#recoveryPassword = password;
    }

    return {
      accountName: parsedData.hive.account,
      roles: loadedRoles
    };
  }

  /**
   * Checks if the wallet file exists in storage.
   *
   * @returns True if wallet exists and is valid, false otherwise
   */
  public async hasWallet (): Promise<boolean> {
    try {
      if (!await this.#storage.exists(this.#fileName))
        return false;

      const rawData = await this.#storage.get(this.#fileName);

      let parsedData: IWalletData;
      try {
        parsedData = parseWalletData(JSON.parse(rawData));
      } catch {
        return false;
      }

      if (!parsedData.hive.account)
        return false;

      // Check if wallet has at least one key (either Hive role or custom)
      const hasHiveKeys = (['posting', 'active', 'owner', 'memo'] as const).some(
        role => !!parsedData.hive.roleDefinitions[role]
      );

      const hasCustomKeys = parsedData.version === '2.0.0' &&
        !!parsedData.generalPurposeKeys &&
        Object.keys(parsedData.generalPurposeKeys).length > 0;

      return hasHiveKeys || hasCustomKeys;
    } catch {
      return false;
    }
  }

  /**
   * Gets the account name from the wallet.
   *
   * @param recoveryPassword - Optional recovery password (required if encryption key not available)
   * @returns The account name stored in the wallet
   * @throws {WaxExternalSignatureProviderError} If wallet doesn't exist
   */
  public async getAccountName (recoveryPassword?: string): Promise<string> {
    if (!await this.#storage.exists(this.#fileName))
      throw new WaxExternalSignatureProviderError('Wallet file not found', undefined, 'WALLET_NOT_FOUND');

    const rawData = await this.#storage.get(this.#fileName);
    const parsedData: IWalletData = await this.decryptWalletData(rawData, recoveryPassword);

    if (!parsedData.hive.account)
      throw new WaxExternalSignatureProviderError('Wallet data missing account name', undefined, 'INVALID_WALLET_DATA');

    return parsedData.hive.account;
  }

  /**
   * Checks if a specific Hive role key exists in the wallet.
   *
   * @param role - The role to check for
   * @param recoveryPassword - Optional recovery password (required if encryption key not available)
   * @returns True if the role key exists in the wallet
   */
  public async hasRole (role: TRole, recoveryPassword?: string): Promise<boolean> {
    try {
      if (!await this.#storage.exists(this.#fileName))
        return false;

      const rawData = await this.#storage.get(this.#fileName);
      const parsedData: IWalletData = await this.decryptWalletData(rawData, recoveryPassword);

      return !!parsedData.hive.roleDefinitions[role];
    } catch {
      return false;
    }
  }

  /**
   * Checks if a specific custom key exists in the wallet.
   *
   * @param keyName - The name of the custom key to check for
   * @param recoveryPassword - Optional recovery password (required if encryption key not available)
   * @returns True if the custom key exists in the wallet
   */
  public async hasCustomKey (keyName: string, recoveryPassword?: string): Promise<boolean> {
    try {
      if (!await this.#storage.exists(this.#fileName))
        return false;

      const rawData = await this.#storage.get(this.#fileName);
      const parsedData: IWalletData = await this.decryptWalletData(rawData, recoveryPassword);

      return parsedData.version === '2.0.0' &&
        !!parsedData.generalPurposeKeys &&
        !!parsedData.generalPurposeKeys[keyName];
    } catch {
      return false;
    }
  }

  /**
   * Deletes the wallet file from storage.
   * Also clears local state (Beekeeper, active key, account name, encryption key).
   */
  public async deleteWallet (): Promise<void> {
    if (await this.#storage.exists(this.#fileName))
      await this.#storage.delete(this.#fileName);

    // Clear encryption key from localStorage
    EncryptionKeyManager.clearEncryptionKey(this.#fileName);

    if (this.#beekeeper) {
      await this.#beekeeper.delete();
      this.#beekeeper = undefined;
    }

    this.#wallet = undefined;
    this.#recoveryPassword = undefined;
  }

  /**
   * Removes a specific role's key from the wallet.
   * The key will be removed from storage, but other roles remain intact.
   *
   * @param role - The role to remove (posting, active, owner, or memo)
   * @param recoveryPassword - Optional recovery password (required if encryption key not available)
   * @throws {WaxExternalSignatureProviderError} If wallet doesn't exist or role not found
   */
  public async removeKey (role: TRole, recoveryPassword?: string): Promise<void> {
    if (!await this.#storage.exists(this.#fileName))
      throw new WaxExternalSignatureProviderError('Wallet file not found', undefined, 'WALLET_NOT_FOUND');

    const rawData = await this.#storage.get(this.#fileName);
    const parsedData: IWalletData = await this.decryptWalletData(rawData, recoveryPassword);

    if (!parsedData.hive.roleDefinitions[role])
      throw new WaxExternalSignatureProviderError(`No key found for role: ${role}`, undefined, 'KEY_NOT_FOUND');

    const updatedData = removeWalletRole(parsedData, role);

    // Get encryption key from localStorage or derive from password
    const password = recoveryPassword || this.#recoveryPassword;
    let encryptionKeyWif = EncryptionKeyManager.loadEncryptionKey(this.#fileName);

    if (!encryptionKeyWif) {
      if (!password) {
        throw new WaxExternalSignatureProviderError(
          'Recovery password required to save wallet changes',
          undefined,
          'RECOVERY_PASSWORD_REQUIRED'
        );
      }
      encryptionKeyWif = EncryptionKeyManager.deriveKeyFromPassword(this.#chain, password);
      EncryptionKeyManager.storeEncryptionKey(this.#fileName, encryptionKeyWif);
    }

    const encryptedData = await this.encryptWalletData(updatedData, encryptionKeyWif);
    await this.#storage.save(this.#fileName, encryptedData);
  }

  /**
   * Switches to the specified custom key, loading it from the wallet file.
   * Returns an ExternalWalletSigner instance with the custom key active.
   *
   * @param keyName - The name/identifier of the custom key to activate
   * @param recoveryPassword - Optional recovery password (required if encryption key not available)
   * @returns ExternalWalletSigner instance ready for signing and encryption
   * @throws {WaxExternalSignatureProviderError} If the custom key is not found in the wallet
   */
  public async forCustom (keyName: string, recoveryPassword?: string): Promise<ExternalWalletSigner> {
    await this.initBeekeeperWallet();

    const rawData = await this.#storage.get(this.#fileName);

    const parsedData: IWalletData = await this.decryptWalletData(rawData, recoveryPassword);

    // Check if wallet is V2 and has generalPurposeKeys
    if (parsedData.version !== '2.0.0' || !parsedData.generalPurposeKeys || !parsedData.generalPurposeKeys[keyName])
      throw new WaxExternalSignatureProviderError(`No custom key found: ${keyName}`, undefined, 'KEY_NOT_FOUND');

    const key = parsedData.generalPurposeKeys[keyName];

    const publicKey = await this.#wallet!.importKey(key.privateKey);

    return new ExternalWalletSigner(this.#chain, this.#wallet!, publicKey, parsedData.hive.account);
  }

  /**
   * Creates or updates a wallet with a custom general-purpose key.
   * If the wallet file exists, the custom key is added/updated while preserving other keys.
   * If the wallet file doesn't exist, a new wallet is created.
   * Returns an ExternalWalletSigner instance with the created custom key active.
   *
   * @param keyName - The name/identifier for this custom key
   * @param accountName - The Hive account name (required for new wallets)
   * @param privateKey - The private key
   * @param description - Optional description of the key's purpose
   * @param recoveryPassword - Recovery password for wallet encryption (required for new wallets)
   * @returns ExternalWalletSigner instance ready for signing
   * @throws {WaxExternalSignatureProviderError} If the account name is invalid or recovery password missing
   */
  public async createCustomKey (
    keyName: string,
    accountName: string,
    privateKey: string,
    description?: string,
    recoveryPassword?: string
  ): Promise<ExternalWalletSigner> {
    if (!this.#chain.isValidAccountName(accountName))
      throw new WaxExternalSignatureProviderError(`Invalid account name: ${accountName}`, undefined, 'INVALID_ACCOUNT_NAME');

    await this.initBeekeeperWallet();

    const publicKey = await this.#wallet!.importKey(privateKey);

    let existingData: IWalletData | undefined;
    let encryptionKeyWif: string;

    // Determine which password to use
    const password = recoveryPassword || this.#recoveryPassword;

    // Try to load existing wallet
    try {
      if (await this.#storage.exists(this.#fileName)) {
        const rawData = await this.#storage.get(this.#fileName);
        existingData = await this.decryptWalletData(rawData, password);
      }
    } catch (error) {
      // If decryption fails and no recovery password provided, throw error
      if (!password) {
        throw new WaxExternalSignatureProviderError(
          'Existing wallet is encrypted but no recovery password provided',
          error instanceof Error ? error : undefined,
          'RECOVERY_PASSWORD_REQUIRED'
        );
      }
      throw error;
    }

    // Check if we have encryption key in localStorage or derive from password
    const existingKey = EncryptionKeyManager.loadEncryptionKey(this.#fileName);

    if (existingKey) {
      encryptionKeyWif = existingKey;
    } else {
      if (!password) {
        throw new WaxExternalSignatureProviderError(
          'Recovery password is required to create wallet encryption key',
          undefined,
          'RECOVERY_PASSWORD_REQUIRED'
        );
      }
      encryptionKeyWif = EncryptionKeyManager.deriveKeyFromPassword(this.#chain, password);
      EncryptionKeyManager.storeEncryptionKey(this.#fileName, encryptionKeyWif);
      this.#recoveryPassword = password;
    }

    // Create or update wallet data with custom key
    let walletData: IWalletData;

    if (existingData) {
      // Use existing data
      walletData = existingData;
    } else {
      // Create new V2 wallet with empty custom keys
      walletData = {
        version: '2.0.0',
        hive: {
          account: accountName,
          roleDefinitions: {}
        },
        generalPurposeKeys: {}
      };
    }

    // Ensure wallet is V2 and has generalPurposeKeys
    if (walletData.version !== '2.0.0') {
      walletData = {
        version: '2.0.0',
        hive: walletData.hive,
        generalPurposeKeys: {}
      };
    }

    if (!walletData.generalPurposeKeys) {
      walletData.generalPurposeKeys = {};
    }

    // Update the specific custom key
    walletData.generalPurposeKeys[keyName] = {
      privateKey,
      publicKey,
      ...(description && { description })
    };

    const encryptedData = await this.encryptWalletData(walletData, encryptionKeyWif);
    await this.#storage.save(this.#fileName, encryptedData);

    return new ExternalWalletSigner(this.#chain, this.#wallet!, publicKey, accountName);
  }

  /**
   * Removes a specific custom key from the wallet.
   * The key will be removed from storage, but other keys remain intact.
   *
   * @param keyName - The name/identifier of the custom key to remove
   * @param recoveryPassword - Optional recovery password (required if encryption key not available)
   * @throws {WaxExternalSignatureProviderError} If wallet doesn't exist or custom key not found
   */
  public async removeCustomKey (keyName: string, recoveryPassword?: string): Promise<void> {
    if (!await this.#storage.exists(this.#fileName))
      throw new WaxExternalSignatureProviderError('Wallet file not found', undefined, 'WALLET_NOT_FOUND');

    const rawData = await this.#storage.get(this.#fileName);
    const parsedData: IWalletData = await this.decryptWalletData(rawData, recoveryPassword);

    // Ensure wallet is V2 and has generalPurposeKeys
    if (parsedData.version !== '2.0.0' || !parsedData.generalPurposeKeys)
      throw new WaxExternalSignatureProviderError('No custom keys found in wallet', undefined, 'KEY_NOT_FOUND');

    if (!parsedData.generalPurposeKeys[keyName])
      throw new WaxExternalSignatureProviderError(`Custom key not found: ${keyName}`, undefined, 'KEY_NOT_FOUND');

    // Create updated wallet data without the specified key
    const { [keyName]: _removed, ...remainingKeys } = parsedData.generalPurposeKeys;
    const updatedData = {
      ...parsedData,
      generalPurposeKeys: remainingKeys
    };

    // Get encryption key from localStorage or derive from password
    const password = recoveryPassword || this.#recoveryPassword;
    let encryptionKeyWif = EncryptionKeyManager.loadEncryptionKey(this.#fileName);

    if (!encryptionKeyWif) {
      if (!password) {
        throw new WaxExternalSignatureProviderError(
          'Recovery password required to save wallet changes',
          undefined,
          'RECOVERY_PASSWORD_REQUIRED'
        );
      }
      encryptionKeyWif = EncryptionKeyManager.deriveKeyFromPassword(this.#chain, password);
      EncryptionKeyManager.storeEncryptionKey(this.#fileName, encryptionKeyWif);
    }

    const encryptedData = await this.encryptWalletData(updatedData, encryptionKeyWif);
    await this.#storage.save(this.#fileName, encryptedData);
  }

  /**
   * Gets the public key for a specific Hive role from the wallet.
   *
   * @param role - The role to get the public key for
   * @param recoveryPassword - Optional recovery password (required if encryption key not available)
   * @returns The public key for the specified role
   * @throws {WaxExternalSignatureProviderError} If wallet doesn't exist or role not found
   */
  public async getPublicKey (role: TRole, recoveryPassword?: string): Promise<string> {
    if (!await this.#storage.exists(this.#fileName))
      throw new WaxExternalSignatureProviderError('Wallet file not found', undefined, 'WALLET_NOT_FOUND');

    const rawData = await this.#storage.get(this.#fileName);
    const parsedData: IWalletData = await this.decryptWalletData(rawData, recoveryPassword);

    const roleData = parsedData.hive.roleDefinitions[role];
    if (!roleData)
      throw new WaxExternalSignatureProviderError(`No key found for role: ${role}`, undefined, 'KEY_NOT_FOUND');

    // If public key is stored, use it; otherwise derive it from private key
    if (roleData.publicKey)
      return roleData.publicKey;

    // Temporarily import the key to get the public key
    await this.initBeekeeperWallet();
    return await this.#wallet!.importKey(roleData.privateKey);
  }

  /**
   * Gets the public key for a specific custom key from the wallet.
   *
   * @param keyName - The name of the custom key to get the public key for
   * @param recoveryPassword - Optional recovery password (required if encryption key not available)
   * @returns The public key for the specified custom key
   * @throws {WaxExternalSignatureProviderError} If wallet doesn't exist or custom key not found
   */
  public async getCustomPublicKey (keyName: string, recoveryPassword?: string): Promise<string> {
    if (!await this.#storage.exists(this.#fileName))
      throw new WaxExternalSignatureProviderError('Wallet file not found', undefined, 'WALLET_NOT_FOUND');

    const rawData = await this.#storage.get(this.#fileName);
    const parsedData: IWalletData = await this.decryptWalletData(rawData, recoveryPassword);

    // Check if wallet is V2 and has generalPurposeKeys
    if (parsedData.version !== '2.0.0' || !parsedData.generalPurposeKeys || !parsedData.generalPurposeKeys[keyName])
      throw new WaxExternalSignatureProviderError(`Custom key not found: ${keyName}`, undefined, 'KEY_NOT_FOUND');

    const keyData = parsedData.generalPurposeKeys[keyName];

    // If public key is stored, use it; otherwise derive it from private key
    if (keyData.publicKey)
      return keyData.publicKey;

    // Temporarily import the key to get the public key
    await this.initBeekeeperWallet();
    return await this.#wallet!.importKey(keyData.privateKey);
  }

  /**
   * Checks if the wallet has a private key matching the given public key.
   * Works for both Hive role keys and custom keys.
   *
   * @param publicKey - The public key to check for
   * @param recoveryPassword - Optional recovery password (required if encryption key not available)
   * @returns True if a matching private key exists in the wallet
   * @throws {WaxExternalSignatureProviderError} If wallet doesn't exist
   */
  public async hasMatchingPrivateKey (publicKey: string, recoveryPassword?: string): Promise<boolean> {
    if (!await this.#storage.exists(this.#fileName))
      throw new WaxExternalSignatureProviderError('Wallet file not found', undefined, 'WALLET_NOT_FOUND');

    const rawData = await this.#storage.get(this.#fileName);
    const parsedData: IWalletData = await this.decryptWalletData(rawData, recoveryPassword);

    // Check Hive role keys
    const roles: TRole[] = ['posting', 'active', 'owner', 'memo'];
    for (const role of roles) {
      const roleData = parsedData.hive.roleDefinitions[role];
      if (!roleData) continue;

      if (roleData.publicKey === publicKey)
        return true;

      // If public key not stored, derive it from private key to check
      if (!roleData.publicKey) {
        await this.initBeekeeperWallet();
        const derivedPublicKey = await this.#wallet!.importKey(roleData.privateKey);
        if (derivedPublicKey === publicKey)
          return true;
      }
    }

    // Check custom keys if wallet is V2
    if (parsedData.version === '2.0.0' && parsedData.generalPurposeKeys) {
      for (const keyData of Object.values(parsedData.generalPurposeKeys)) {
        if (keyData.publicKey === publicKey)
          return true;

        // If public key not stored, derive it from private key to check
        if (!keyData.publicKey) {
          await this.initBeekeeperWallet();
          const derivedPublicKey = await this.#wallet!.importKey(keyData.privateKey);
          if (derivedPublicKey === publicKey)
            return true;
        }
      }
    }

    return false;
  }

  /**
   * Gets all public keys from the wallet with their metadata.
   * Returns an array of key information objects.
   *
   * @param recoveryPassword - Optional recovery password (required if encryption key not available)
   * @returns Array of key info objects (Hive roles and custom keys)
   * @throws {WaxExternalSignatureProviderError} If wallet doesn't exist
   */
  public async getPublicKeys (recoveryPassword?: string): Promise<TPublicKeyInfo[]> {
    if (!await this.#storage.exists(this.#fileName))
      throw new WaxExternalSignatureProviderError('Wallet file not found', undefined, 'WALLET_NOT_FOUND');

    const rawData = await this.#storage.get(this.#fileName);
    const parsedData: IWalletData = await this.decryptWalletData(rawData, recoveryPassword);

    const keys: TPublicKeyInfo[] = [];

    // Get Hive role keys
    const roles: TRole[] = ['posting', 'active', 'owner', 'memo'];
    for (const role of roles) {
      const roleData = parsedData.hive.roleDefinitions[role];
      if (!roleData) continue;

      let publicKey: string;
      if (roleData.publicKey) {
        publicKey = roleData.publicKey;
      } else {
        await this.initBeekeeperWallet();
        publicKey = await this.#wallet!.importKey(roleData.privateKey);
      }

      keys.push({ type: 'hive', role, publicKey });
    }

    // Get custom keys if wallet is V2
    if (parsedData.version === '2.0.0' && parsedData.generalPurposeKeys) {
      for (const [keyName, keyData] of Object.entries(parsedData.generalPurposeKeys)) {
        let publicKey: string;
        if (keyData.publicKey) {
          publicKey = keyData.publicKey;
        } else {
          await this.initBeekeeperWallet();
          publicKey = await this.#wallet!.importKey(keyData.privateKey);
        }

        keys.push({ type: 'custom', keyName, publicKey });
      }
    }

    return keys;
  }

  /**
   * Destroys the provider instance, cleaning up Beekeeper and clearing all state.
   * Call this when you're done using the provider to free resources.
   */
  public async destroy (): Promise<void> {
    if (this.#beekeeper) {
      await this.#beekeeper.delete();
      this.#beekeeper = undefined;
    }

    this.#wallet = undefined;
    this.#recoveryPassword = undefined;
  }

  /**
   * Checks if encryption key is available for automatic decryption.
   *
   * @returns True if encryption key exists in localStorage
   */
  public hasEncryptionKey (): boolean {
    return EncryptionKeyManager.hasEncryptionKey(this.#fileName);
  }

  /**
   * Clears the encryption key from localStorage.
   * After calling this, recovery password will be required for wallet access.
   * Useful when user wants to "log out" from current device.
   */
  public clearEncryptionKey (): void {
    EncryptionKeyManager.clearEncryptionKey(this.#fileName);
  }
}
