import type { ISignatureTransaction, TAccountName, TPublicKey, TRole, TSignature } from "@hiveio/wax";
import { AEncryptionProvider } from "@hiveio/wax";

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
 * await provider.signTransaction(tx);
 *
 * // broadcast
 * await chain.broadcast(tx);
 * ```
 */
class KeychainProvider extends AEncryptionProvider {
  private readonly role: KeychainKeyTypes;

  private constructor(
    private readonly accountName: TAccountName,
    role: TRole
  ) {
    super();
    if (!mapRoles[role])
      throw new Error(`Role ${role} is not supported by the Wax signature provider: ${KeychainProvider.name}`);

    this.role = mapRoles[role];
  }

  /**
   * Creates a new instance of the KeychainProvider for signing transactions.
   *
   * @param accountName The account name to use for signing transactions. This should be a valid Wax account name.
   * @param role The role to use for signing transactions. Should be one of the valid roles: "active", "posting", or "memo".
   * @returns An instance of the KeychainProvider that can be used to sign transactions.
   */
  public static for(accountName: TAccountName, role: TRole): KeychainProvider {
    return new KeychainProvider(accountName, role);
  }

  /**
   * @returns Either True or False if the supported extension (Keychain) is installed, false otherwise.
   */
  public static isExtensionInstalled(): boolean {
    return typeof window === "object" || typeof (window as any).hive_keychain === "object";
  }

  private static ensureKeychainInstalled(): void {
    if (!(KeychainProvider.isExtensionInstalled()))
      throw new WaxKeychainProviderError(`Keychain is not installed`);
  }

  /**
   * Encrypts data using the Keychain extrension.
   *
   * @param buffer The string to encrypt.
   * @param recipient The public key of the recipient to encrypt the data for. The recipient should be a valid public key, starting with "STM".
   * @returns A string containing the encrypted data. The string starts with the `#` prefix.
   *
   * @throws on any error from the Keychain invocation.
   */
  public async encryptData(buffer: string, recipient: TPublicKey): Promise<string> {
    KeychainProvider.ensureKeychainInstalled();

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

  /**
   * Decrypts data using the Keychain extension.
   *
   * @param buffer The string to decrypt. The string should start with the `#` prefix.
   * @returns The decrypted data as a string.
   * @throws on any error from the Keychain invocation.
   */
  public async decryptData(buffer: string): Promise<string> {
    KeychainProvider.ensureKeychainInstalled();

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

  /**
   * Generates signatures for given transaction using the Keychain extension.
   *
   * @param transaction The transaction to sign. The transaction should be created using the Wax Hive chain instance.
   * @throws on any error from the Keychain invocation.
   */
  protected async generateSignatures(transaction: ISignatureTransaction): Promise<TSignature[]> {
    KeychainProvider.ensureKeychainInstalled();

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

    return data.result.signatures;
  }
}

export default KeychainProvider;
