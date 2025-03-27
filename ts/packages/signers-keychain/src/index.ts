import type { IOnlineEncryptionProvider, IOnlineSignatureProviderSignTransaction, ITransaction, TAccountName, TPublicKey, TRole } from "@hiveio/wax";

import { KeychainKeyTypes, KeychainSDK } from "keychain-sdk";

const mapRoles: Record<TRole, KeychainKeyTypes | undefined> = {
  active: KeychainKeyTypes.active,
  posting: KeychainKeyTypes.posting,
  owner: undefined,
  memo: KeychainKeyTypes.memo
};

// We do not extend from WaxError to avoid runtime dependencies, such as: /vite or /web - without it we can import only types
export class WaxKeychainProviderError extends Error {}

/**
 * Wax transaction signature provider using the Keychain SDK.
 *
 * @example
 * ```
 * const provider = KeychainProvider.for("myaccount", "active");
 *
 * // Create a transaction using the Wax Hive chain instance
 * const tx = await chain.createTransaction();
 *
 * // Perform some operations, e.g. pushing operations...
 *
 * // Sign the transaction
 * await tx.sign(provider);
 *
 * // broadcast
 * await chain.broadcast(tx);
 * ```
 */
class KeychainProvider implements IOnlineSignatureProviderSignTransaction, IOnlineEncryptionProvider {
  private readonly role: KeychainKeyTypes;

  private static keychain: KeychainSDK;

  private constructor(
    private readonly accountName: TAccountName,
    role: TRole
  ) {
    if (!mapRoles[role])
      throw new Error(`Role ${role} is not supported by the Wax signature provider: ${KeychainProvider.name}`);

    if(!KeychainProvider.keychain)
      KeychainProvider.keychain = new KeychainSDK(window);

    this.role = mapRoles[role];
  }

  public isOnline = true as const;

  public static for(accountName: TAccountName, role: TRole): KeychainProvider {
    return new KeychainProvider(accountName, role);
  }

  public async encryptData(buffer: string, recipient: TPublicKey): Promise<string> {
    if (!(await KeychainProvider.keychain.isKeychainInstalled()))
      throw new WaxKeychainProviderError(`Keychain is not installed`);

    const encryptionResult = await KeychainProvider.keychain.encodeWithKeys({
      method: KeychainKeyTypes.memo,
      username: this.accountName,
      message: buffer,
      publicKeys: [recipient]
    });

    return Object.values(encryptionResult.result as any)[0] as string;
  }

  public async decryptData(buffer: string): Promise<string> {
    if (!(await KeychainProvider.keychain.isKeychainInstalled()))
      throw new WaxKeychainProviderError(`Keychain is not installed`);

    const data = await KeychainProvider.keychain.decode({
      message: buffer,
      method: KeychainKeyTypes.memo,
      username: this.accountName
    });

    return data.result as unknown as string;
  }

  public async signTransaction(transaction: ITransaction): Promise<void> {
    if (!(await KeychainProvider.keychain.isKeychainInstalled()))
      throw new WaxKeychainProviderError(`Keychain is not installed`);

    const data = await KeychainProvider.keychain.signTx({
      method: this.role,
      username: this.accountName,
      tx: JSON.parse(transaction.toLegacyApi())
    });

    for(const sig of data.result.signatures)
      transaction.sign(sig);
  }
}

export default KeychainProvider;
