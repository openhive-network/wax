import type { IOnlineEncryptionProvider, IOnlineSignatureProviderSignTransaction, ITransaction, TAccountName, TPublicKey, TRole } from "@hiveio/wax";

import { getWallet } from '@peakd/hive-wallet-sdk'

// @peakd/hive-wallet-sdk fails to provide this type import
type KeyRole = Parameters<typeof PeakVaultProvider['peakVaultWallet']['signTx']>[2];

const mapRoles: Record<TRole, KeyRole | undefined> = {
  active: 'active',
  posting: 'posting',
  owner: undefined,
  memo: 'memo'
};

const PEAKVAULT_WALLET_ID: Parameters<typeof getWallet>[0] = 'peakvault';

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
  private readonly role: KeyRole;

  private static peakVaultWallet: Awaited<ReturnType<typeof getWallet>>;

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

  public async encryptData(buffer: string, recipient: TPublicKey): Promise<string> {
    if (!PeakVaultProvider.peakVaultWallet)
      PeakVaultProvider.peakVaultWallet = await getWallet(PEAKVAULT_WALLET_ID);

    const encryptionResult = await PeakVaultProvider.peakVaultWallet.encodeWithKeys(this.accountName, "memo", [recipient], buffer);

    return encryptionResult.result[0];
  }

  public async decryptData(buffer: string): Promise<string> {
    if (!PeakVaultProvider.peakVaultWallet)
      PeakVaultProvider.peakVaultWallet = await getWallet(PEAKVAULT_WALLET_ID);

    const data = await PeakVaultProvider.peakVaultWallet.decode(this.accountName, buffer, "memo");

    return data.result as unknown as string;
  }

  public async signTransaction(transaction: ITransaction): Promise<void> {
    if (!PeakVaultProvider.peakVaultWallet)
      PeakVaultProvider.peakVaultWallet = await getWallet(PEAKVAULT_WALLET_ID);

    const data = await PeakVaultProvider.peakVaultWallet.signTx(this.accountName, JSON.parse(transaction.toLegacyApi()), this.role);

    for(const sig of data.result.signatures)
      transaction.sign(sig);
  }
}

export default PeakVaultProvider;
