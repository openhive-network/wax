import createBeekeeper, { IBeekeeperInstance, IBeekeeperUnlockedWallet } from "@hiveio/beekeeper";
import { IHiveChainInterface, TRole } from "@hiveio/wax";
import { WaxExternalSignatureProviderError } from "./errors.js";
import { ExternalWalletSigner } from "./external-wallet-signer.js";

import type { IWalletData } from "./wallet_zod_versioning.js";
import { parseWalletData, updateWalletRole, removeWalletRole } from "./wallet_zod_versioning.js";
import { GoogleStorageProvider, TokenProvider } from "./storage-providers/google-storage-provider.js";

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
 * Information about wallet without loading keys into memory
 */
export interface IWalletInfo {
  exists: boolean;
  accountName?: string;
  roles?: TRole[];
}

/**
 * External signature provider factory that manages wallet data in external storage (e.g., Google Drive).
 *
 * This class handles:
 * - Wallet creation and key management for different Hive roles (posting, active, owner, memo)
 * - Loading existing wallets from storage
 * - Creating ExternalWalletSigner instances for transaction signing and encryption
 *
 * Usage:
 * ```typescript
 * const provider = new ExternalSignatureProvider(chain, 'wallet.json', async () => {
 *   const response = await fetch('/api/token');
 *   return (await response.json()).token;
 * });
 *
 * // Create a new wallet with a key and get a signer
 * const signer = await provider.createWalletFor('posting', 'myaccount', 'private-key');
 * await signer.signTransaction(tx);
 *
 * // Or load an existing wallet and switch to a role
 * await provider.loadWallet();
 * const activeSigner = await provider.for('active');
 * await activeSigner.signTransaction(tx);
 * ```
 */
export class ExternalSignatureProvider {
  readonly #chain: IHiveChainInterface;
  readonly #fileName: string;
  readonly #storage: GoogleStorageProvider;

  #beekeeper: IBeekeeperInstance | undefined;
  #wallet: IBeekeeperUnlockedWallet | undefined;

  /**
   * Creates a new ExternalSignatureProvider instance
   *
   * @param chain - The Hive chain interface for validation and crypto operations
   * @param fileName - Name of the wallet file in storage
   * @param tokenProvider - Callback function that returns a fresh OAuth token for storage access
   */
  public constructor (chain: IHiveChainInterface, fileName: string, tokenProvider: TokenProvider) {
    this.#chain = chain;
    this.#fileName = fileName;
    this.#storage = new GoogleStorageProvider(tokenProvider);
  }

  private async initBeekeeperWallet (): Promise<void> {
    if (this.#wallet)
      return;

    this.#beekeeper = await createBeekeeper({ inMemory: true, enableLogs: false, unlockTimeout: 365 * 24 * 60 * 60 * 1000 });

    const session = this.#beekeeper.createSession('external-signer-session');

    this.#wallet = (await session.createWallet('external-signer-wallet')).wallet;
  }



  /**
   * Switches to the specified role, loading its key from the wallet file.
   * Returns an ExternalWalletSigner instance with the role's key active.
   *
   * @param role - The role to activate (posting, active, owner, or memo)
   * @returns ExternalWalletSigner instance ready for signing and encryption
   * @throws {WaxExternalSignatureProviderError} If the role's key is not found in the wallet
   */
  public async for (role: TRole): Promise<ExternalWalletSigner> {
    await this.initBeekeeperWallet();

    const rawData = await this.#storage.get(this.#fileName);

    const parsedData: IWalletData = parseWalletData(JSON.parse(rawData));

    const key = parsedData.hive.roleDefinitions[role];

    if (!key)
      throw new WaxExternalSignatureProviderError(`No key found for role: ${role}`, undefined, 'KEY_NOT_FOUND');

    const publicKey = await this.#wallet!.importKey(key.privateKey);

    return new ExternalWalletSigner(this.#chain, this.#wallet!, publicKey, parsedData.hive.account);
  }

  /**
   * Creates or updates a wallet with a key for the specified role.
   * If the wallet file exists, the role is added/updated while preserving other roles.
   * If the wallet file doesn't exist, a new wallet is created.
   * Returns an ExternalWalletSigner instance with the created role active.
   *
   * @param role - The role to create/update (posting, active, owner, or memo)
   * @param accountName - The Hive account name
   * @param privateKey - The private key for this role
   * @returns ExternalWalletSigner instance ready for signing and encryption
   * @throws {WaxExternalSignatureProviderError} If the account name is invalid
   */
  public async createWalletFor (
    role: TRole,
    accountName: string,
    privateKey: string
  ): Promise<ExternalWalletSigner> {
    if (!this.#chain.isValidAccountName(accountName))
      throw new WaxExternalSignatureProviderError(`Invalid account name: ${accountName}`, undefined, 'INVALID_ACCOUNT_NAME');

    await this.initBeekeeperWallet();

    const publicKey = await this.#wallet!.importKey(privateKey);

    let existingData: IWalletData | undefined;

    try {
      if (await this.#storage.exists(this.#fileName)) {
        const rawData = await this.#storage.get(this.#fileName);

        existingData = parseWalletData(JSON.parse(rawData));
      }
    } catch (error) {
      existingData = undefined;
    }

    const walletData = updateWalletRole(existingData, accountName, role, privateKey, publicKey);

    await this.#storage.save(this.#fileName, JSON.stringify(walletData));

    return new ExternalWalletSigner(this.#chain, this.#wallet!, publicKey, accountName);
  }

  /**
   * Loads the wallet from storage and imports all keys into Beekeeper.
   * Does NOT set an active role - call `for()` to select which role to use.
   *
   * @returns Object containing the account name and list of available roles
   * @throws {WaxExternalSignatureProviderError} If wallet file doesn't exist or is invalid
   */
  public async loadWallet (): Promise<IWalletLoadResult> {
    if (!await this.#storage.exists(this.#fileName))
      throw new WaxExternalSignatureProviderError('Wallet file not found', undefined, 'WALLET_NOT_FOUND');

    await this.initBeekeeperWallet();

    const rawData = await this.#storage.get(this.#fileName);
    const parsedData: IWalletData = parseWalletData(JSON.parse(rawData));

    if (!parsedData.hive.account)
      throw new WaxExternalSignatureProviderError('Wallet data missing account name', undefined, 'INVALID_WALLET_DATA');

    const roles: TRole[] = ['posting', 'active', 'owner', 'memo'];
    const loadedRoles: TRole[] = [];

    for (const role of roles) {
      const roleData = parsedData.hive.roleDefinitions[role];
      if (!roleData) continue;

      await this.#wallet!.importKey(roleData.privateKey);
      loadedRoles.push(role);
    }

    if (loadedRoles.length === 0)
      throw new WaxExternalSignatureProviderError('Wallet has no keys', undefined, 'WALLET_EMPTY');

    return {
      accountName: parsedData.hive.account,
      roles: loadedRoles
    };
  }

  /**
   * Gets information about the wallet without loading keys into memory.
   * Useful for checking if a wallet exists and what roles are available.
   *
   * @returns Wallet info object with exists flag, and optionally account name and roles
   */
  public async getWalletInfo (): Promise<IWalletInfo> {
    try {
      if (!await this.#storage.exists(this.#fileName))
        return { exists: false };

      const rawData = await this.#storage.get(this.#fileName);

      let parsedData: IWalletData;
      try {
        parsedData = parseWalletData(JSON.parse(rawData));
      } catch {
        return { exists: false };
      }

      if (!parsedData.hive.account)
        return { exists: false };

      const roles = (['posting', 'active', 'owner', 'memo'] as const).filter(
        role => !!parsedData.hive.roleDefinitions[role]
      );

      if (roles.length === 0)
        return { exists: false };

      return {
        exists: true,
        accountName: parsedData.hive.account,
        roles
      };
    } catch {
      return { exists: false };
    }
  }

  /**
   * Deletes the wallet file from storage.
   * Also clears local state (Beekeeper, active key, account name).
   */
  public async deleteWallet (): Promise<void> {
    if (await this.#storage.exists(this.#fileName))
      await this.#storage.delete(this.#fileName);

    if (this.#beekeeper) {
      await this.#beekeeper.delete();
      this.#beekeeper = undefined;
    }

    this.#wallet = undefined;
  }

  /**
   * Removes a specific role's key from the wallet.
   * The key will be removed from storage, but other roles remain intact.
   * If the removed role was the active role, the active key is cleared.
   *
   * @param role - The role to remove (posting, active, owner, or memo)
   * @throws {WaxExternalSignatureProviderError} If wallet doesn't exist or role not found
   */
  public async removeKey (role: TRole): Promise<void> {
    if (!await this.#storage.exists(this.#fileName))
      throw new WaxExternalSignatureProviderError('Wallet file not found', undefined, 'WALLET_NOT_FOUND');

    const rawData = await this.#storage.get(this.#fileName);
    const parsedData: IWalletData = parseWalletData(JSON.parse(rawData));

    if (!parsedData.hive.roleDefinitions[role])
      throw new WaxExternalSignatureProviderError(`No key found for role: ${role}`, undefined, 'KEY_NOT_FOUND');

    const updatedData = removeWalletRole(parsedData, role);

    await this.#storage.save(this.#fileName, JSON.stringify(updatedData));
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
  }
}
