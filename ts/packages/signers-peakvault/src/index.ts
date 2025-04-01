import type { IOnlineEncryptionProvider, IOnlineSignatureProviderSignTransaction, ITransaction, TAccountName, TPublicKey, TRole } from "@hiveio/wax";

const mapRoles: Record<TRole, string | undefined> = {
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
 * await tx.sign(provider);
 *
 * // broadcast
 * await chain.broadcast(tx);
 * ```
 */
class PeakVaultProvider implements IOnlineSignatureProviderSignTransaction, IOnlineEncryptionProvider {
  private readonly role: string;

  private constructor(
    private readonly accountName: TAccountName,
    role: TRole
  ) {
    if (!mapRoles[role])
      throw new Error(`Role ${role} is not supported by the Wax signature provider: ${PeakVaultProvider.name}`);

    this.role = mapRoles[role];
  }

  public isOnline = true as const;

  public static for(accountName: TAccountName, role: TRole): PeakVaultProvider {
    return new PeakVaultProvider(accountName, role);
  }

  private ensurePeakVaultInstalled(): void {
    if (typeof window !== "object" || typeof (window as any).peakvault !== "object")
      throw new WaxPeakVaultProviderError(`PeakVault is not installed`);
  }

  public async encryptData(buffer: string, recipient: TPublicKey): Promise<string> {
    this.ensurePeakVaultInstalled();

    const response = await (window as any).peakvault.requestEncodeWithKeys(this.accountName, "memo", [recipient], buffer.startsWith("#") ? buffer : `#${buffer}`);

    return response.result[0];
  }

  public async decryptData(buffer: string): Promise<string> {
    this.ensurePeakVaultInstalled();

    const response = await (window as any).peakvault.requestDecode(this.accountName, buffer, "memo");

    return response.result;
  }

  public async signTransaction(transaction: ITransaction): Promise<void> {
    this.ensurePeakVaultInstalled();

    const response = await (window as any).peakvault.requestSignTx(this.accountName, JSON.parse(transaction.toLegacyApi()), this.role);

    for(const signature of response.result.signatures)
      transaction.sign(signature);
  }
}

export default PeakVaultProvider;
