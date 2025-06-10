import type { IOnlineSignatureProvider, ITransaction, TAccountName, TRole } from "@hiveio/wax";

type KeychainKeyTypes = string;

const mapRoles: Record<TRole, KeychainKeyTypes | undefined> = {
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
class KeychainProvider implements IOnlineSignatureProvider {
  private readonly role: KeychainKeyTypes;

  private constructor(
    private readonly accountName: TAccountName,
    role: TRole
  ) {
    if (!mapRoles[role])
      throw new Error(`Role ${role} is not supported by the Wax signature provider: ${KeychainProvider.name}`);

    this.role = mapRoles[role];
  }

  public static for(accountName: TAccountName, role: TRole): KeychainProvider {
    return new KeychainProvider(accountName, role);
  }

  /**
   * @returns Either True or False if the supported extension (Keychain) is installed, false otherwise.
   */
  public static isExtensionInstalled(): boolean {
    return typeof window === "object" || typeof (window as any).hive_keychain === "object";
  }

  public async signTransaction(transaction: ITransaction): Promise<void> {
    if (!(KeychainProvider.isExtensionInstalled()))
      throw new WaxKeychainProviderError(`Keychain is not installed`);

    const data = await new Promise((resolve, reject) => (window as any).hive_keychain.requestSignTx(
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

    for(const sig of data.result.signatures)
      transaction.sign(sig);
  }
}

export default KeychainProvider;
