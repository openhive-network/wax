import type { ISignatureTransaction, TAccountName, TPublicKey, TRole, TSignature, TBinaryBuffer } from "@hiveio/wax";
import { AEncryptionProvider, isPublicKey } from "@hiveio/wax";

type KeychainKeyTypes = string;

const mapRoles: Record<TRole, KeychainKeyTypes | undefined> = {
  active: "Active",
  posting: "Posting",
  owner: undefined,
  memo: "Memo"
};

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
    return typeof window === "object" && typeof (window as any).hive_keychain === "object";
  }

  private static ensureKeychainInstalled(): void {
    if (!(KeychainProvider.isExtensionInstalled()))
      throw new WaxKeychainProviderError(`Keychain is not installed`);
  }

  /**
   * Encrypts data using the Keychain extrension.
   *
   * @param buffer The buffer to encrypt. Can be binary, if encrypting for yourself.
   *               Keychain does not support encrypting binary buffer for others.
   *               The string should start with the `#` prefix.
   * @param recipient The public key of the recipient to encrypt the data for or the account name.
   * @returns A string containing the encrypted data. The string starts with the `#` prefix.
   *
   * @throws on any error from the Keychain invocation.
   */
  public async encryptData(buffer: string | TBinaryBuffer, recipient: TPublicKey | TAccountName, _nonce?: number): Promise<string> {
    KeychainProvider.ensureKeychainInstalled();

    const msg = typeof buffer === "string" ? buffer : JSON.stringify({type:"Buffer", data: Array.from(new Uint8Array(buffer as ArrayBuffer))});

    let response: string;

    try {
      if (recipient === this.accountName) {
        response = await new Promise<string>((resolve, reject) => (window as any).hive_keychain.requestSignBuffer(
          this.accountName,
          msg,
          this.role,
          (response: { error?: any; result: string}) => {
            if (response.error)
              reject(response);
            else
              resolve(response.result);
          }
        ));
      } else if (isPublicKey(recipient)) {
        response = await new Promise<string>((resolve, reject) => (window as any).hive_keychain.requestEncodeWithKeys(
          this.accountName,
          [recipient],
          msg[0] === '#' ? msg : `#${msg}`,
          this.role,
          (response: { error?: any; result: Record<string, string>}) => {
            if (response.error)
              reject(response);
            else
              resolve(response.result[recipient]);
          }
        )) as string;
      } else {
        response = await new Promise<string>((resolve, reject) => (window as any).hive_keychain.requestEncodeMessage(
          this.accountName,
          recipient,
          msg[0] === '#' ? msg : `#${msg}`,
          this.role,
          (response: { error?: any; result: string}) => {
            if (response.error)
              reject(response);
            else
              resolve(response.result);
          }
        )) as string;
      }

      return response;
    } catch (error) {
      if (typeof error === "object" && error !== null && "error" in error) {
        throw new WaxKeychainProviderError(`Keychain error: ${(error as any).message}`, { cause: error });
      }

      throw error;
    }
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

    try {
      const response = await new Promise((resolve, reject) => (window as any).hive_keychain.requestVerifyKey(
        this.accountName,
        buffer,
        this.role,
        (response: { error?: any; result: string}) => {
          if (response.error)
            reject(response);
          else
            resolve(response);
        }
      )) as any;

      return response.result;
    } catch (error) {
      if (typeof error === "object" && error !== null && "error" in error) {
        throw new WaxKeychainProviderError(`Keychain error: ${(error as any).message}`, { cause: error });
      }

      throw error;
    }
  }

  /**
   * Generates signatures for given transaction using the Keychain extension.
   *
   * @param transaction The transaction to sign. The transaction should be created using the Wax Hive chain instance.
   * @throws on any error from the Keychain invocation.
   */
  protected async generateSignatures(transaction: ISignatureTransaction): Promise<TSignature[]> {
    KeychainProvider.ensureKeychainInstalled();

    try {
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
    } catch (error) {
      if (typeof error === "object" && error !== null && "error" in error) {
        throw new WaxKeychainProviderError(`Keychain error: ${(error as any).message}`, { cause: error });
      }

      throw error;
    }
  }
}

export default KeychainProvider;
