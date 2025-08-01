import type { IOnlineSignatureProvider, ITransaction, TAccountName, TPublicKey, TRole } from "@hiveio/wax";

type KeyRole = string;

const mapRoles: Record<TRole, KeyRole | undefined> = {
  active: 'active',
  posting: 'posting',
  owner: undefined,
  memo: 'memo'
};

// We do not extend from WaxError to avoid runtime dependencies, such as: /vite or /web - without it we can import only types
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
class PeakVaultProvider implements IOnlineSignatureProvider {
  private readonly role: KeyRole;

  private constructor(
    private readonly accountName: TAccountName,
    role: TRole
  ) {
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
   * Encrypts data using the Peak Vault extension.
   *
   * @param buffer The string to encrypt. The string should start with the `#` prefix.
   * @param recipient The public key of the recipient to encrypt the data for. The recipient should be a valid public key, starting with "STM".
   * @returns A string containing the encrypted data. The string starts with the `#` prefix.
   * @throws on any error from the Peak Vault invocation.
   */
  public async encryptData(buffer: string, recipient: TPublicKey): Promise<string> {
    PeakVaultProvider.ensurePeakVaultInstalled();

    const response = await (window as any).peakvault.requestEncodeWithKeys(this.accountName, "memo", [recipient], buffer.startsWith("#") ? buffer : `#${buffer}`);

    return response.result[0];
  }

  /**
   * Decrypts data using the Peak Vault extension.
   *
   * @param buffer The string to decrypt. The string should start with the `#` prefix.
   * @returns The decrypted data as a string.
   * @throws on any error from the Peak Vault invocation.
   */
  public async decryptData(buffer: string): Promise<string> {
    PeakVaultProvider.ensurePeakVaultInstalled();

    const response = await (window as any).peakvault.requestDecode(this.accountName, buffer, "memo");

    return response.result;
  }

  /**
   * Signs a transaction using the Peak Vault extension.
   *
   * @param transaction The transaction to sign. The transaction should be created using the Wax Hive chain instance.
   * @throws on any error from the Peak Vault invocation.
   */
  public async signTransaction(transaction: ITransaction): Promise<void> {
    PeakVaultProvider.ensurePeakVaultInstalled();

    const data = await (window as any).peakvault.requestSignTx(this.accountName, JSON.parse(transaction.toLegacyApi()), this.role);

    for(const sig of data.result.signatures)
      transaction.addSignature(sig);
  }
}

export default PeakVaultProvider;
