import { AEncryptionProvider, ISignatureTransaction, type IWaxBaseInterface, TAccountName, TPublicKey, TRole, TSignature } from "@hiveio/wax";
import { BeekeeperProvider  } from "@hiveio/wax-signers-beekeeper";
import createBeekeeper, { IBeekeeperInstance, IBeekeeperUnlockedWallet } from "@hiveio/beekeeper";
import { TokenProvider as AuthTokenProvider, GoogleStorageProvider } from "../storage-providers/google-storage-provider.js";
import { AStorageProviderBase } from "../storage-provider-base.js";
import type { IExternalWallet, IExternalWalletContent, IExternalWalletHiveRoleKeyInfo, IExternalWalletCustomKeyInfo } from "../interfaces.js";
import { WaxExternalSignatureProviderError } from "../errors.js";
import type { IWalletKeyEntry, IWalletDataV2 } from "../wallet_zod_versioning.js";
import { createEmptyWalletData, migrateWalletData } from "../wallet_zod_versioning.js";

/**
 * Storage encryption credentials - either a password to derive key from, or the derived WIF key itself
 */
export type TStorageEncryptionCredentials =
  | { password: string }
  | { encryptionKey: string };

/** Callback function to query for storage password or provide cached encryption key.
 *  @param missingStorageFile if true, it should enforce query for new password
 *  @returns Either a password (which will be used to derive encryption key) or the encryption key WIF directly
*/
export type TStoragePasswordProvider = (missingStorageFile: boolean) => Promise<TStorageEncryptionCredentials>;

export enum EStorageProviders {
  GOOGLE_DRIVE,
  /// TODO - maybe some other implementations in the future?
};

type TBeekeeperInfo = {
  beekeeperInstance: IBeekeeperInstance;
  wallet: IBeekeeperUnlockedWallet;
};

const initInternalBeekeeperWallet = async (beekeeperWalletName: string): Promise<TBeekeeperInfo> => {
  const beekeeper = await createBeekeeper({ inMemory: true, enableLogs: false, unlockTimeout: 365 * 24 * 60 * 60 * 1000 });

  const session = beekeeper.createSession(Math.random().toString());
  const { wallet } = await session.createWallet(beekeeperWalletName);

  return { beekeeperInstance: beekeeper, wallet };
};

class WalletContent extends AEncryptionProvider implements IExternalWalletContent {
  private constructor (
    private readonly mainWallet: ExternalWallet,
    private readonly keyStorage: TBeekeeperInfo,
    private readonly beekeeperProvider: BeekeeperProvider,
    private readonly publicKey: TPublicKey,
    private readonly hiveAccount?: TAccountName,
    private readonly hiveRole?: TRole,
    private readonly customKeyAlias?: string
  ) {
    super();
  }

  private static async create (
    data: IWalletKeyEntry,
    mainWallet: ExternalWallet,
    hiveAccount?: TAccountName,
    hiveRole?: TRole,
    customKeyAlias?: string
  ): Promise<WalletContent> {
    const beekeeperInfo = await initInternalBeekeeperWallet('wallet-content');
    const importedPublicKey = await beekeeperInfo.wallet.importKey(data.privateKey);
    const publicKeyToReference = data.publicKey ?? importedPublicKey; /// choose explicit one if provided
    const beekeeperProvider = await BeekeeperProvider.for(mainWallet.wax, beekeeperInfo.wallet, publicKeyToReference);

    return new WalletContent(mainWallet, beekeeperInfo, beekeeperProvider, publicKeyToReference, hiveAccount, hiveRole, customKeyAlias);
  }

  public static async createForHiveRole (
    accountName: TAccountName,
    role: TRole,
    keyInfo: IWalletKeyEntry,
    mainWallet: ExternalWallet
  ): Promise<WalletContent> {
    return await WalletContent.create(keyInfo, mainWallet, accountName, role);
  }

  public static async createForCustomKey (
    customKeyAlias: string,
    keyInfo: IWalletKeyEntry,
    mainWallet: ExternalWallet
  ): Promise<WalletContent> {
    return await WalletContent.create(keyInfo, mainWallet, undefined, undefined, customKeyAlias);
  }

  public enumStoredHiveKeys (account: TAccountName, role?: TRole): Iterable<IExternalWalletHiveRoleKeyInfo> {
    if (
      this.hiveAccount !== undefined &&
      this.hiveRole !== undefined &&
      this.hiveAccount === account &&
      (role === undefined || this.hiveRole === role)
    ) return [{
        publicKey: this.publicKey,
        role: this.hiveRole,
        account: this.hiveAccount
      }];

    return [];
  }

  public enumStoredCustomKeys (): Iterable<IExternalWalletCustomKeyInfo> {
    if (this.customKeyAlias === undefined)
      return [];

    return [{
      publicKey: this.publicKey,
      customAlias: this.customKeyAlias
    }];
  }

  private removeHiveRole (
    walletData: IWalletDataV2,
    publicKey: TPublicKey,
    accountName?: string,
    role?: TRole
  ): void {
    if (role) {
      if (accountName)
        if (walletData.hive.account !== accountName)
          throw new Error(`Provided account name is different than found in storage.`)

      const roleDef = walletData.hive.roleDefinitions[role];

      if (!roleDef)
        throw new Error(`No key found for role ${role} in storgae.`)

      const rolePublicKey = this.mainWallet.wax.calculatePublicKey(roleDef.privateKey);

      if (rolePublicKey !== publicKey)
        throw new Error(`Provided public key ${publicKey} is different than found for role ${role}.`);

      delete walletData.hive.roleDefinitions[role];
    } else {
      for (const role of Object.keys(walletData.hive.roleDefinitions)) {
        const roleDef = walletData.hive.roleDefinitions[role];

        const rolePublicKey = this.mainWallet.wax.calculatePublicKey(roleDef.privateKey);

        if (rolePublicKey === publicKey)
          delete walletData.hive.roleDefinitions[role];
      }
    }
  }

  private removeCustomKey (
    walletData: IWalletDataV2,
    publicKey: TPublicKey,
    customAlias?: string
  ): void {
    if (customAlias) {
      if (!walletData.generalPurposeKeys)
        throw new Error('No general purpose keys found');

      const entry = walletData.generalPurposeKeys?.[customAlias];

      if (!entry)
        throw new Error(`No key found for custom alias ${customAlias} in storage.`);

      const entryPublicKey = this.mainWallet.wax.calculatePublicKey(entry.privateKey);

      if (entryPublicKey !== publicKey)
        throw new Error(`Provided public key ${publicKey} is different than found for alias ${customAlias}.`);

      delete walletData.generalPurposeKeys[customAlias];
    } else {
      if (walletData.generalPurposeKeys !== undefined) {
        for (const alias of Object.keys(walletData.generalPurposeKeys)) {
          const entry = walletData.generalPurposeKeys[alias];
          const entryPublicKey = this.mainWallet.wax.calculatePublicKey(entry.privateKey);
          if (entryPublicKey === publicKey)
            delete walletData.generalPurposeKeys[alias];
        }
      }
    }
  }

  public async removeKey (keyInfo: TPublicKey | IExternalWalletHiveRoleKeyInfo | IExternalWalletCustomKeyInfo): Promise<void> {
    const walletData = await this.mainWallet.reloadStorageFile(false);

    if (typeof keyInfo === 'string') {
      if (walletData.hive.roleDefinitions !== undefined)
        this.removeHiveRole(walletData, keyInfo);

      if (walletData.generalPurposeKeys !== undefined)
        this.removeCustomKey(walletData, keyInfo);
    } else if ('account' in keyInfo && 'role' in keyInfo) {
      if (walletData.hive.account === keyInfo.account && walletData.hive.roleDefinitions !== undefined)
        this.removeHiveRole(walletData, keyInfo.publicKey, keyInfo.account, keyInfo.role)
    } else if ('customAlias' in keyInfo) {
      if (walletData.generalPurposeKeys !== undefined)
        this.removeCustomKey(walletData, keyInfo.publicKey, keyInfo.customAlias);
    }

    await this.mainWallet.saveStorageFile(walletData);
  }

  public async clearContents (removeWalletStorage: boolean): Promise<void> {
    if (removeWalletStorage)
      await this.mainWallet.deleteStorageFile();
    else
      await this.mainWallet.createStorageFile();
  }

  public async encryptData (buffer: string, recipient: TPublicKey): Promise<string> {
    return await this.beekeeperProvider.encryptData(buffer, recipient);
  }

  public async decryptData (buffer: string): Promise<string> {
    return await this.beekeeperProvider.decryptData(buffer);
  }

  protected async generateSignatures (transaction: ISignatureTransaction): Promise<TSignature[]> {
    const signature = this.keyStorage.wallet.signDigest(this.publicKey, transaction.sigDigest);

    return [signature];
  }
};

class ExternalWallet implements IExternalWallet {
  private constructor (
    public readonly wax: IWaxBaseInterface,
    private readonly fileName: string,
    private readonly storageProvider: AStorageProviderBase,
    private readonly storageEncryptionPublicKey: TPublicKey,
    private readonly storageEncryptor: TBeekeeperInfo,
    private readonly encryptionKeyWif: string,
    public isDisposed: boolean = false
  ) {}

  public static async createWallet (
    waxBase: IWaxBaseInterface,
    authProvider: AuthTokenProvider,
    storagePasswordProvider: TStoragePasswordProvider,
    storageFileName: string = 'wallet.json',
    storageKind: EStorageProviders = EStorageProviders.GOOGLE_DRIVE
  ): Promise<ExternalWallet> {
    if(storageKind !== EStorageProviders.GOOGLE_DRIVE)
      throw new WaxExternalSignatureProviderError('Selected unsupported type of external storage');

    const storage = new GoogleStorageProvider(authProvider);
    /// Immediately perform access to enforce authentication
    const filePresent = await storage.exists(storageFileName);
    /// Ask for password or get already saved encryption key from client side
    const credentials = await storagePasswordProvider(filePresent === false);

    // Get encryption key WIF - either use provided key or derive from password
    let encryptionKeyWif: string;
    if ('encryptionKey' in credentials) {
      // Client provided the encryption key directly - use it
      encryptionKeyWif = credentials.encryptionKey;
    } else {
      // Client provided a password - derive the encryption key
      const encryptionKey = waxBase.getPrivateKeyFromPassword('dummyaccount', 'posting', credentials.password);
      encryptionKeyWif = encryptionKey.wifPrivateKey;
    }

    const storageEncryptor = await initInternalBeekeeperWallet('encryption-key-store');
    const encryptionPublicKey = await storageEncryptor.wallet.importKey(encryptionKeyWif);

    const wallet = new ExternalWallet(waxBase, storageFileName, storage, encryptionPublicKey, storageEncryptor, encryptionKeyWif);

    return wallet;
  }

  public async loadForHiveKey(accountName: TAccountName, role: TRole): Promise<IExternalWalletContent> {
    const data = await this.reloadStorageFile(false);

    if(data.hive.account !== accountName)
      throw new WaxExternalSignatureProviderError(`No key found for account: ${accountName}`, undefined, 'KEY_NOT_FOUND');

    if(data.hive.roleDefinitions[role] === undefined)
      throw new WaxExternalSignatureProviderError(`No key found for account role: ${accountName}@${role}`, undefined, 'KEY_NOT_FOUND');

    const keyEntry = data.hive.roleDefinitions[role];

    return await WalletContent.createForHiveRole(accountName, role, keyEntry, this);
  }

  public async createForHiveKey(role: TRole, accountName: TAccountName, privateKey: string): Promise<IExternalWalletContent> {
    const data = await this.reloadStorageFile(true);

    data.hive.account = accountName;
    data.hive.roleDefinitions[role] = {privateKey};

    const keyEntry = data.hive.roleDefinitions[role];

    await this.saveStorageFile(data);

    return await WalletContent.createForHiveRole(accountName, role, keyEntry, this);
  }

  public async loadForCustomKey(customKeyAlias: string): Promise<IExternalWalletContent> {
    const data = await this.reloadStorageFile(false);

    const keyEntry = data.generalPurposeKeys?.[customKeyAlias];

    if(keyEntry === undefined)
      throw new WaxExternalSignatureProviderError(`No key found for custom key alias: ${customKeyAlias}`, undefined, 'KEY_NOT_FOUND');

    return await WalletContent.createForCustomKey(customKeyAlias, keyEntry, this);
  }

  public async createForCustomKey(customKeyAlias: string, privateKey: string, description?: string): Promise<IExternalWalletContent> {
    const data = await this.reloadStorageFile(true);

    if (data.generalPurposeKeys === undefined)
      data.generalPurposeKeys = {};
    data.generalPurposeKeys[customKeyAlias] = { privateKey, description };

    await this.saveStorageFile(data);

    const keyEntry = data.generalPurposeKeys?.[customKeyAlias];

    return await WalletContent.createForCustomKey(customKeyAlias, keyEntry, this);
  }

  public async close(): Promise<void> {
    if (this.isDisposed)
      return;

    this.storageEncryptor.wallet.close();
    await this.storageEncryptor.beekeeperInstance.delete();
  }

  public async [Symbol.asyncDispose](): Promise<void> {
    await this.close();
  }

  /**
   * Gets the encryption key WIF used for wallet data encryption.
   * This allows the app to store the derived key in localStorage for automatic decryption.
   *
   * @returns The WIF encryption key
   */
  public getEncryptionKeyWif(): string {
    return this.encryptionKeyWif;
  }

  public async reloadStorageFile (allowCreation: boolean): Promise<IWalletDataV2> {
    if (allowCreation) {
      if (await this.storageProvider.exists(this.fileName) === false)
        return await this.createStorageFile();
    }
    const rawData = await this.storageProvider.get(this.fileName);
    try {
      // Decrypt using the encryption key
      const decrypted = this.storageEncryptor!.wallet.decryptData(rawData, this.storageEncryptionPublicKey);
      return migrateWalletData(JSON.parse(decrypted));
    } catch (error) {
      throw new WaxExternalSignatureProviderError(
        'Failed to decrypt wallet data. Invalid password or corrupted data.',
        error instanceof Error ? error : undefined,
        'DECRYPTION_FAILED'
      );
    }
  }

  public async saveStorageFile (data: IWalletDataV2): Promise<void> {
    const rawData = JSON.stringify(data);
    const encrypted = this.storageEncryptor!.wallet.encryptData(rawData, this.storageEncryptionPublicKey);
    await this.storageProvider.save(this.fileName, encrypted);
  }

  public async deleteStorageFile (): Promise<void> {
    await this.storageProvider.delete(this.fileName);
  }

  public async createStorageFile (): Promise<IWalletDataV2> {
    const newData = createEmptyWalletData('');
    await this.saveStorageFile(newData);
    return newData;
  }
};

/**
 * Allows to create an instance of external wallet, which can next provide storage to save/retrieve keys and sign transactions.
 *
 * Successfully completing this function leads to flow:
 * - completed authentication by authProvider call which will provide new or existing (cached OAuth token giving access to the storage provider APIs)
 * - provided or restored from local storage wallet password (used to encrypt its data).
 *
 * @param waxBase: IWaxBaseInterface - base wax interface to perform cryptographic actions
 * @param authProvider - a callback to be called when user session should be initialized to connect to external storage provider (i.e. GoogleDrive)
 * @param storagePasswordProvider - a callback function which will be called when storage password was not found in the local storage of browser/device running this component
 * @param storageFileName - optional file name to be created/referenced on the external storage
 * @param storage - optional external storage provider kind (in case of future extensions supporting different implementations)
 */
export const createExternalWallet = async (
  waxBase: IWaxBaseInterface,
  authProvider: AuthTokenProvider,
  storagePasswordProvider: TStoragePasswordProvider,
  storageFileName?: string,
  storage?: EStorageProviders
): Promise<IExternalWallet> => {
  return await ExternalWallet.createWallet(waxBase, authProvider, storagePasswordProvider, storageFileName, storage);
};
