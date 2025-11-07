import { IBeekeeperUnlockedWallet, TPublicKey } from "@hiveio/beekeeper";
import { AEncryptionProvider, IHiveChainInterface, ISignatureTransaction, TRole, TSignature } from "@hiveio/wax";
import { AStorageProviderBase } from "./types.js";

// Export types and storage providers
export { AStorageProviderBase } from "./types.js";
export { GoogleStorageProvider, GoogleDriveError } from "./storage-providers/google-storage-provider.js";

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

    const parsedData = JSON.parse(rawData);

    const key = parsedData[role];

    if (!key)
      throw new WaxExternalSignatureProviderError(`No key found for role: ${role}`);

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
