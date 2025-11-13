import { IBeekeeperUnlockedWallet, TPublicKey } from "@hiveio/beekeeper";
import { AEncryptionProvider, IHiveChainInterface, ISignatureTransaction, TRole, TSignature } from "@hiveio/wax";
import packageJson from "../package.json" with { type: "json" };

export abstract class AStorageProviderBase {
  abstract get (name: string): Promise<string>;

  abstract save (name: string, data: string): Promise<void>;

  abstract delete (name: string): Promise<void>;

  abstract exists (name: string): Promise<boolean>;
}

/**
 * Current version of the wallet data format
 * Uses the package version from package.json
 */
export const WALLET_DATA_FORMAT_VERSION = packageJson.version;

/**
 * Structure of a single key entry in the wallet
 */
export interface IWalletKeyEntry {
  privateKey: string;
  publicKey?: string;
}

/**
 * Wallet data structure stored by ExternalSignatureProvider
 * This defines the format of data saved to storage providers
 */
export interface IWalletData {
  /** Format version for backward compatibility */
  version: string;
  /** Keys indexed by role (posting, active, owner, memo) */
  keys: Partial<Record<TRole, IWalletKeyEntry>>;
  /** Optional metadata for future extensions */
  metadata?: Record<string, any>;
}

export class WaxExternalSignatureProviderError extends Error {
  public code?: string;

  public constructor(message: string, cause?: Error, code?: string) {
    super(message, { cause });
    this.code = code;
  }
}

export class ExternalSignatureProvider extends AEncryptionProvider {
  #publicKey: TPublicKey;
  #wallet: IBeekeeperUnlockedWallet;
  #chain: IHiveChainInterface;

  private constructor (publicKey: TPublicKey, wallet: IBeekeeperUnlockedWallet, chain: IHiveChainInterface) {
    super();

    this.#publicKey = publicKey;
    this.#wallet = wallet;
    this.#chain = chain;
  }

  public get publicKey(): TPublicKey {
    return this.#publicKey;
  }

  public static async for (
    chain: IHiveChainInterface,
    fileName: string,
    storage: AStorageProviderBase,
    wallet: IBeekeeperUnlockedWallet,
    role: TRole
  ): Promise<ExternalSignatureProvider> {
    const rawData = await storage.get(fileName);

    const parsedData: IWalletData = JSON.parse(rawData);

    // Validate format version
    if (!parsedData.version)
      throw new WaxExternalSignatureProviderError('Invalid wallet data: missing version field', undefined, 'INVALID_FORMAT');

    const keys = parsedData.keys;

    const key = keys[role];

    if (!key)
      throw new WaxExternalSignatureProviderError(`No key found for role: ${role}`, undefined, 'KEY_NOT_FOUND');

    const publicKey = await wallet.importKey(key.privateKey);

    return new ExternalSignatureProvider(publicKey, wallet, chain);
  }

  public async encryptData (buffer: string, recipient: TPublicKey): Promise<string> {
    return this.#chain.encrypt(this.#wallet, buffer, this.#publicKey, recipient);
  }

  public async decryptData (content: string): Promise<string> {
    return this.#chain.decrypt(this.#wallet, content);
  }

  protected async generateSignatures (transaction: ISignatureTransaction): Promise<TSignature[]> {
    const signature = this.#wallet.signDigest(this.#publicKey, transaction.sigDigest);

    return [signature];
  }
}
