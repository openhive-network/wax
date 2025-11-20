import { IBeekeeperUnlockedWallet, TPublicKey } from "@hiveio/beekeeper";
import { AEncryptionProvider, IHiveChainInterface, ISignatureTransaction, TRole, TSignature } from "@hiveio/wax";
import { WaxExternalSignatureProviderError } from "./errors.js";

import type { IWalletData } from "./wallet_zod_versioning.js";
import { parseWalletData, updateWalletRole } from "./wallet_zod_versioning.js";

export abstract class AStorageProviderBase {
  abstract get (name: string): Promise<string>;

  abstract save (name: string, data: string): Promise<void>;

  abstract delete (name: string): Promise<void>;

  abstract exists (name: string): Promise<boolean>;
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

    const parsedData: IWalletData = parseWalletData(JSON.parse(rawData));

    const key = parsedData.hive.roleDefinitions[role];

    if (!key)
      throw new WaxExternalSignatureProviderError(`No key found for role: ${role}`, undefined, 'KEY_NOT_FOUND');

    const publicKey = await wallet.importKey(key.privateKey);
    return new ExternalSignatureProvider(publicKey, wallet, chain);
  }

  public static async createWalletFor (
    chain: IHiveChainInterface,
    fileName: string,
    storage: AStorageProviderBase,
    wallet: IBeekeeperUnlockedWallet,
    role: TRole,
    accountName: string,
    privateKey: string
  ): Promise<ExternalSignatureProvider> {
    if (!chain.isValidAccountName(accountName))
      throw new WaxExternalSignatureProviderError(`Invalid account name: ${accountName}`, undefined, 'INVALID_ACCOUNT_NAME');

    const publicKey = await wallet.importKey(privateKey);

    let existingData: IWalletData | undefined;

    try {
      if (await storage.exists(fileName)) {
        const rawData = await storage.get(fileName);

        existingData = parseWalletData(JSON.parse(rawData));
      }
    } catch (error) {
      existingData = undefined;
    }

    const walletData = updateWalletRole(existingData, accountName, role, privateKey, publicKey);

    await storage.save(fileName, JSON.stringify(walletData));

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
