import type { IHiveChainInterface, IWaxBaseInterface, ISignatureTransaction, TAccountName, TRole, TSignature } from "@hiveio/wax";
import { AEncryptionProvider } from "@hiveio/wax";

import type { IBeekeeperUnlockedWallet, TPublicKey } from "@hiveio/beekeeper";

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
 * await provider.signTransaction(tx);
 *
 * // broadcast
 * await chain.broadcast(tx);
 * ```
 */
export class BeekeeperProvider extends AEncryptionProvider {
  private constructor(
    private readonly base: IWaxBaseInterface,
    private readonly wallet: IBeekeeperUnlockedWallet,
    private readonly publicKey: TPublicKey
  ) {
    super();
  }

  public static for(chainOrBase: IHiveChainInterface | IWaxBaseInterface, wallet: IBeekeeperUnlockedWallet, publicKeyOrAccount: TPublicKey | TAccountName, role?: TRole): BeekeeperProvider | Promise<BeekeeperProvider> {
    if (role === undefined)
      return new BeekeeperProvider(chainOrBase, wallet, publicKeyOrAccount);

    return (chainOrBase as IHiveChainInterface).api.database_api.find_accounts({ accounts: [publicKeyOrAccount], delayed_votes_active: false }).then(({ accounts: [ account ] }) => {
      if (account === undefined)
        return Promise.reject(new WaxBeekeeperProviderError(`Account ${publicKeyOrAccount} not found`));

      const actualRole = role === "memo" ? "memo_key" : role;

      return account[actualRole] ? new BeekeeperProvider(chainOrBase, wallet, role === "memo" ? account.memo_key : account[role].key_auths[0][0]) : Promise.reject(new WaxBeekeeperProviderError(`Account ${publicKeyOrAccount} does not have ${role} key`));
    });
  }

  /**
   * Encrypts data using the Beekeeper.
   *
   * @param content The string to encrypt.
   * @param recipient The public key of the recipient to encrypt the data for. The recipient should be a valid public key, starting with "STM".
   * @returns A string containing the encrypted data. The string starts with the `#` prefix.
   * @throws on any error from the Beekeeper invocation.
   */
  public async encryptData(content: string, recipient: TPublicKey): Promise<string> {
    return this.base.encrypt(this.wallet, content, this.publicKey, recipient);
  }

  /**
   * Decrypts data using the Beekeeper.
   *
   * @param content The string to decrypt. The string should start with the `#` prefix.
   * @returns The decrypted data as a string.
   * @throws on any error from the Beekeeper invocation.
   */
  public async decryptData(content: string): Promise<string> {
    return this.base.decrypt(this.wallet, content);
  }

  /**
   * Generates signatures for given transaction using the Beekeeper.
   *
   * @param transaction The transaction to sign. The transaction should be created using the Wax Hive chain instance.
   * @throws on any error from the Beekeeper invocation.
   */
  protected async generateSignatures(transaction: ISignatureTransaction): Promise<TSignature[]> {
    const signature = this.wallet.signDigest(this.publicKey, transaction.sigDigest);

    return [signature];
  }
};

export interface WaxBeekeeperProviderCreator {
  /**
   * Creates a new instance of the BeekeeperProvider for signing transactions.
   *
   * @param base The Hive base interface to use for encryption.
   * @param wallet The unlocked Beekeeper wallet instance.
   * @param publicKey The public key to use for signing transactions. This should be a valid public key, starting with "STM".
   * @throws on any error from the Beekeeper invocation.
   */
  for(base: IWaxBaseInterface, wallet: IBeekeeperUnlockedWallet, publicKey: TPublicKey): BeekeeperProvider;
  /**
   * Creates a new instance of the BeekeeperProvider for signing transactions using an account name and role.
   *
   * @param chain The Hive chain interface to use for fetching the account details.
   * @param wallet The unlocked Beekeeper wallet instance.
   * @param account The account name to use for signing transactions. This should be a valid Wax account name.
   * @param role The role to use for signing transactions. Should be one of the valid roles: "owner", "active", "posting", or "memo".
   * @returns A promise that resolves to an instance of the BeekeeperProvider that can be used to sign transactions.
   * @throws on any error from the Wax invocation.
   */
  for(chain: IHiveChainInterface, wallet: IBeekeeperUnlockedWallet, account: TAccountName, role: TRole): Promise<BeekeeperProvider>;
}

export default BeekeeperProvider as WaxBeekeeperProviderCreator;