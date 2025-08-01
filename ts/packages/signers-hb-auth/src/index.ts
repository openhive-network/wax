import type { IOnlineSignatureProvider, ITransaction, TRole } from "@hiveio/wax";

import { type OfflineClient, type OnlineClient } from "@hiveio/hb-auth";

// We do not extend from WaxError to avoid runtime dependencies, such as: /vite or /web - without it we can import only types
export class WaxHBAuthProviderError extends Error {}

/**
 * Wax transaction signature provider using the hb-auth.
 *
 * @example
 * ```
 * const provider = HBAuthProvider.for(hbAuthClient, "gtg", "posting");
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
class HBAuthProvider implements IOnlineSignatureProvider {
  private constructor(
    public readonly client: OnlineClient | OfflineClient,
    public readonly username: string,
    public readonly role: TRole
  ) {}

  public static for(client: OnlineClient | OfflineClient, username: string, role: TRole): HBAuthProvider {
    if (role !== 'active' && role !== 'owner' && role !== 'posting')
      throw new WaxHBAuthProviderError(`Invalid role: ${role}`);

    return new HBAuthProvider(client, username, role);
  }

  public async signTransaction(transaction: ITransaction): Promise<void> {
    const signature = await this.client.sign(this.username, transaction.sigDigest, this.role as 'active' | 'owner' | 'posting');

    transaction.addSignature(signature);
  }
}

export interface WaxHBAuthProviderCreator {
  /**
   * We assume you already called #initialize() on the client and client has imported the keys.
   *
   * @param client - The hb-auth client instance.
   * @param username - The username to sign the transaction with
   * @param role - The role to sign the transaction with
   */
  for(client: OnlineClient | OfflineClient, username: string, role: TRole): HBAuthProvider;
}

export default HBAuthProvider as WaxHBAuthProviderCreator;
