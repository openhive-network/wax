import type { IOnlineEncryptionProvider, IOnlineSignatureProviderSignTransaction, ITransaction, TAccountName, TPublicKey, TRole } from "@hiveio/wax";

const mapRoles: Record<TRole, string | undefined> = {
  active: "active",
  posting: "posting",
  owner: undefined,
  memo: "memo"
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
  private readonly role: string;

  private constructor(
    private readonly accountName: TAccountName,
    role: TRole
  ) {
    if (!mapRoles[role])
      throw new Error(`Role ${role} is not supported by the Wax signature provider: ${KeychainProvider.name}`);

    this.role = mapRoles[role];
  }

  public isOnline = true as const;

  public static for(accountName: TAccountName, role: TRole): KeychainProvider {
    return new KeychainProvider(accountName, role);
  }

  private ensureKeychainInstalled(): void {
    if (typeof window !== "object" || typeof (window as any).hive_keychain !== "object")
      throw new WaxKeychainProviderError(`Keychain is not installed`);
  }

  public async encryptData(buffer: string, recipient: TPublicKey): Promise<string> {
    this.ensureKeychainInstalled();

    const response = await new Promise((resolve, reject) => (window as any).hive_keychain.requestEncodeWithKeys(
      this.accountName,
      [recipient],
      buffer.startsWith("#") ? buffer : `#${buffer}`,
      "memo",
      (response: any) => {
        if (response.error)
          reject(response);
        else
          resolve(response);
      }
    )) as any;

    return Object.values(response.result)[0] as string;
  }

  public async decryptData(buffer: string): Promise<string> {
    this.ensureKeychainInstalled();

    const response = await new Promise((resolve, reject) => (window as any).hive_keychain.requestVerifyKey(
      this.accountName,
      buffer,
      "memo",
      (response: any) => {
        if (response.error)
          reject(response);
        else
          resolve(response);
      }
    )) as any;

    return response.result;
  }

  public async signTransaction(transaction: ITransaction): Promise<void> {
    this.ensureKeychainInstalled();

    const response = await new Promise((resolve, reject) => (window as any).hive_keychain.requestSignTx(
      this.accountName,
      JSON.parse(transaction.toLegacyApi()),
      this.role,
      (response: any) => {
        if (response.error)
          reject(response);
        else
          resolve(response);
      }
    )) as any;

    for(const signature of response.result.signatures)
      transaction.sign(signature);
  }
}

export default KeychainProvider;
