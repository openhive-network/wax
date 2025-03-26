import type { IHiveChainInterface, ISignatureProviderSignTransaction, ITransaction, TAccountName, TRole } from "@hiveio/wax";

import type { IBeekeeperUnlockedWallet, TPublicKey } from "@hiveio/beekeeper";

// We do not extend from WaxError to avoid runtime dependencies, such as: /vite or /web - without it we can import only types
export class WaxBeekeeperProviderError extends Error {}

/**
 * Wax transaction signature provider using the Beekeeper.
 *
 * @example
 * ```
 * const provider = BeekeeperProvider.for(myWallet, "myaccount", "active", chain);
 *
 * // Create a transaction using the Wax Hive chain instance
 * const tx = await chain.createTransaction();
 *
 * // Perform some operations, e.g. pushing operations...
 *
 * // Sign the transaction
 * tx.sign(provider);
 *
 * // broadcast
 * await chain.broadcast(tx);
 * ```
 */
class BeekeeperProvider implements ISignatureProviderSignTransaction {
  private constructor(
    private readonly wallet: IBeekeeperUnlockedWallet,
    private readonly publicKey: TPublicKey
  ) {}

  public isOnline = false as const;

  public static for(wallet: IBeekeeperUnlockedWallet, publicKeyOrAccount: TPublicKey | TAccountName, role?: TRole, chain?: IHiveChainInterface): BeekeeperProvider | Promise<BeekeeperProvider> {
    if (role === undefined)
      return new BeekeeperProvider(wallet, publicKeyOrAccount);

    return chain!.api.database_api.find_accounts({ accounts: [publicKeyOrAccount], delayed_votes_active: false }).then(({ accounts: [ account ] }) => {
      if (account === undefined)
        return Promise.reject(new WaxBeekeeperProviderError(`Account ${publicKeyOrAccount} not found`));

      const actualRole = role === "memo" ? "memo_key" : role;

      return account[actualRole] ? new BeekeeperProvider(wallet, role === "memo" ? account.memo_key : account[role].key_auths[0][0]) : Promise.reject(new WaxBeekeeperProviderError(`Account ${publicKeyOrAccount} does not have ${role} key`));
    });
  }

  public signTransaction(transaction: ITransaction): void {
    transaction.sign(this.wallet, this.publicKey);
  }
}

export interface WaxBeekeeperProviderCreator {
  for(wallet: IBeekeeperUnlockedWallet, publicKey: TPublicKey): BeekeeperProvider;
  for(wallet: IBeekeeperUnlockedWallet, account: TAccountName, role: TRole, chain: IHiveChainInterface): Promise<BeekeeperProvider>;
}

export default BeekeeperProvider as WaxBeekeeperProviderCreator;