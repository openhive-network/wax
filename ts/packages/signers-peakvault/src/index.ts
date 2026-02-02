import type { ISignatureTransaction, TAccountName, TBinaryBuffer, TPublicKey, TRole, TSignature } from "@hiveio/wax";
import { AEncryptionProvider } from "@hiveio/wax";

type KeyRole = string;

const mapRoles: Record<TRole, KeyRole | undefined> = {
  active: 'active',
  posting: 'posting',
  owner: undefined,
  memo: 'memo'
};

export class WaxPeakVaultProviderError extends Error {}

/**
 * Wax transaction signature provider using the Peak Vault.
 *
 * @example
 * ```
 * const provider = PeakVaultProvider.for("myaccount", "active");
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
class PeakVaultProvider extends AEncryptionProvider {
  private readonly role: KeyRole;

  private constructor(
    private readonly accountName: TAccountName,
    role: TRole
  ) {
    super();
    if (!mapRoles[role])
      throw new Error(`Role ${role} is not supported by the Wax signature provider: ${PeakVaultProvider.name}`);

    this.role = mapRoles[role];
  }

  /**
   * Creates a new instance of the PeakVaultProvider for signing transactions.
   *
   * @param accountName The account name to use for signing transactions. This should be a valid Wax account name.
   * @param role The role to use for signing transactions. Should be one of the valid roles: "active", "posting", or "memo".
   * @returns An instance of the PeakVaultProvider that can be used to sign transactions.
   */
  public static for(accountName: TAccountName, role: TRole): PeakVaultProvider {
    return new PeakVaultProvider(accountName, role);
  }

  /**
   * @returns Either True or False if the supported extension (Peak Vault) is installed, false otherwise.
   */
  public static isExtensionInstalled(): boolean {
    return typeof window === "object" && typeof (window as any).peakvault === "object";
  }

  private static ensurePeakVaultInstalled(): void {
    if (!PeakVaultProvider.isExtensionInstalled())
      throw new WaxPeakVaultProviderError(`Peak Vault is not installed`);
  }

  /**
   * Encrypts data using the Peak Vault extension. Uses currently selected role for decryption.
   *
   * Note: If a recipient is a user account name, the encryption is done using your memo key!
   * PeakVault does not allow encrypting for other users using your active/posting keys.
   * If you need such functionality, use the public key as recipient.
   *
   * @param buffer The buffer to encrypt. Cannot be binary, as PeakVault does not suport such feature.
   *               PeakVault also does not support encrypting binary buffer for others.
   *               The string should start with the `#` prefix.
   * @param recipient The public key of the recipient to encrypt the data for or the account name.
   * @returns A string containing the encrypted data. The string starts with the `#` prefix.
   * @throws on any error from the Peak Vault invocation.
   */
  public async encryptData(buffer: string | TBinaryBuffer, recipient: TPublicKey | TAccountName): Promise<string> {
    PeakVaultProvider.ensurePeakVaultInstalled();

    if (typeof buffer !== "string") {
      throw new WaxPeakVaultProviderError(`Only string buffers are supported for Peak Vault encryption`);
    }

    let result: string;

    if (recipient === this.accountName) {
      const response = await (window as any).peakvault.requestSignBuffer(this.accountName, this.role, buffer);

      result = response.result;
    } else if (recipient.startsWith("STM")) {
      const response = await (window as any).peakvault.requestEncodeWithKeys(this.accountName, this.role, [recipient], buffer.startsWith("#") ? buffer : `#${buffer}`);

      result = response.result[0];
    } else {
      const response = await (window as any).peakvault.requestEncode(this.accountName, recipient, buffer.startsWith("#") ? buffer : `#${buffer}`);

      result = response.result;
    }

    return result;
  }

  /**
   * Decrypts data using the Peak Vault extension. Uses currently selected role for decryption.
   *
   * @param buffer The string to decrypt. The string should start with the `#` prefix.
   * @returns The decrypted data as a string.
   * @throws on any error from the Peak Vault invocation.
   */
  public async decryptData(buffer: string): Promise<string> {
    PeakVaultProvider.ensurePeakVaultInstalled();

    const response = await (window as any).peakvault.requestDecode(this.accountName, buffer, this.role);

    return response.result;
  }

  /**
   * Generates signatures for given transaction transaction using the Peak Vault extension.
   *
   * @param transaction The transaction to sign. The transaction should be created using the Wax Hive chain instance.
   * @throws on any error from the Peak Vault invocation.
   */
  protected async generateSignatures(transaction: ISignatureTransaction): Promise<TSignature[]> {
    PeakVaultProvider.ensurePeakVaultInstalled();
    const data = await (window as any).peakvault.requestSignTx(this.accountName, JSON.parse(transaction.toLegacyApi()), this.role);
    return data.result.signatures;
  }
}

export default PeakVaultProvider;
