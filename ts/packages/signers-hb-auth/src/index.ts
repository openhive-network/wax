import type { IOnlineSignatureProvider, ITransaction } from "@hiveio/wax";

import { type OfflineClient, type OnlineClient } from "@hiveio/hb-auth";

// We do not extend from WaxError to avoid runtime dependencies, such as: /vite or /web - without it we can import only types
export class WaxHBAuthProviderError extends Error {}

/**
 * Wax transaction signature provider using the hb-auth.
 *
 * @example
 * ```
 * const provider = HBAuthProvider.for(hbAuthClient);
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
class HBAuthProvider implements IOnlineSignatureProvider {
  private constructor(
    public readonly client: OnlineClient | OfflineClient,
    public readonly username?: string
  ) {}

  public static for(client: OnlineClient | OfflineClient, username?: string): HBAuthProvider {
    return new HBAuthProvider(client, username);
  }

  public async signTransaction(transaction: ITransaction): Promise<void> {
    const requiredAuthorities = transaction.requiredAuthorities;

    const signatures: string[] = [];

    const digest = transaction.sigDigest;

    for(const auth in requiredAuthorities)
      if (auth !== "other")
        for(const actor of requiredAuthorities[auth])
          if (this.username === undefined || actor === this.username)
            signatures.push(await this.client.sign(actor, digest, auth as 'posting' | 'active' | 'owner'));

    if (signatures.length === 0)
      throw new WaxHBAuthProviderError(`Failed to sign the transaction`);

    for(const signature of signatures)
      transaction.sign(signature);
  }
}

export interface WaxHBAuthProviderCreator {
  /**
   * We assume you already called #initialize() on the client and client has imported the keys.
   *
   * @param client - The hb-auth client instance.
   * @param username - The username to sign the transaction with. If not provided - every user imported to the hb-auth will be allowed to sign the transaction.
   */
  for(client: OnlineClient | OfflineClient, username?: string): HBAuthProvider;
}

export default HBAuthProvider as WaxHBAuthProviderCreator;
