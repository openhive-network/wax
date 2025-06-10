import type { IHiveChainInterface, IOnlineSignatureProvider, ITransaction, TAccountName, TRole } from "@hiveio/wax";

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
 * await tx.sign(provider);
 *
 * // broadcast
 * await chain.broadcast(tx);
 * ```
 */
class BeekeeperProvider implements IOnlineSignatureProvider {
  private constructor(
    private readonly wallet: IBeekeeperUnlockedWallet,
    private readonly publicKey: TPublicKey
  ) {}

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

  /**
   * Encrypts data using the Beekeeper.
   *
   * @param content The string to encrypt. The string should start with the `#` prefix.
   * @param recipient The public key of the recipient to encrypt the data for. The recipient should be a valid public key, starting with "STM".
   * @returns A string containing the encrypted data. The string starts with the `#` prefix.
   * @throws on any error from the Beekeeper invocation.
   */
  public encryptData(content: string, recipient: TPublicKey): string {
    return this.wallet.encryptData(content, this.publicKey, recipient);
  }

  /**
   * Decrypts data using the Beekeeper.
   *
   * @param content The string to decrypt. The string should start with the `#` prefix.
   * @returns The decrypted data as a string.
   * @throws on any error from the Beekeeper invocation.
   */
  public decryptData(content: string): string {
    return this.wallet.decryptData(content, this.publicKey);
  }

  /**
   * Signs a transaction using the Beekeeper.
   *
   * @param transaction The transaction to sign. The transaction should be created using the Wax Hive chain instance.
   * @throws on any error from the Beekeeper invocation.
   */
  public async signTransaction(transaction: ITransaction): Promise<void> {
    transaction.sign(this.wallet, this.publicKey);
  }
}

export interface WaxBeekeeperProviderCreator {
  /**
   * Creates a new instance of the BeekeeperProvider for signing transactions.
   *
   * @param wallet The unlocked Beekeeper wallet instance.
   * @param publicKey The public key to use for signing transactions. This should be a valid public key, starting with "STM".
   * @throws on any error from the Beekeeper invocation.
   */
  for(wallet: IBeekeeperUnlockedWallet, publicKey: TPublicKey): BeekeeperProvider;
  /**
   * Creates a new instance of the BeekeeperProvider for signing transactions using an account name and role.
   *
   * @param wallet The unlocked Beekeeper wallet instance.
   * @param account The account name to use for signing transactions. This should be a valid Wax account name.
   * @param role The role to use for signing transactions. Should be one of the valid roles: "owner", "active", "posting", or "memo".
   * @param chain The Hive chain interface to use for fetching the account details.
   * @returns A promise that resolves to an instance of the BeekeeperProvider that can be used to sign transactions.
   * @throws on any error from the Wax invocation.
   */
  for(wallet: IBeekeeperUnlockedWallet, account: TAccountName, role: TRole, chain: IHiveChainInterface): Promise<BeekeeperProvider>;
}

export default BeekeeperProvider as WaxBeekeeperProviderCreator;