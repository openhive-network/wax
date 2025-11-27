import { AEncryptionProvider, IHiveChainInterface, ISignatureTransaction, TPublicKey, TSignature } from "@hiveio/wax";
import type { IBeekeeperUnlockedWallet } from "@hiveio/beekeeper";

/**
 * Represents a fully initialized wallet signer with a specific role active.
 * 
 * This class extends AEncryptionProvider and guarantees that:
 * - Beekeeper wallet is initialized
 * - Public key is available
 * - Account name is set
 * 
 * This eliminates the need for conditional checks in signing and encryption methods.
 * 
 * Instances are created by ExternalSignatureProvider's `for()` and `createWalletFor()` methods.
 */
export class ExternalWalletSigner extends AEncryptionProvider {
  readonly #chain: IHiveChainInterface;
  readonly #wallet: IBeekeeperUnlockedWallet;
  readonly #publicKey: TPublicKey;
  readonly #accountName: string;

  /**
   * Creates a new ExternalWalletSigner instance.
   * 
   * @internal This constructor should not be called directly. Use ExternalSignatureProvider.for() or createWalletFor() instead.
   * 
   * @param chain - The Hive chain interface for validation and crypto operations
   * @param wallet - Initialized Beekeeper wallet
   * @param publicKey - Public key for the active role
   * @param accountName - Hive account name
   */
  public constructor(
    chain: IHiveChainInterface,
    wallet: IBeekeeperUnlockedWallet,
    publicKey: TPublicKey,
    accountName: string
  ) {
    super();

    this.#chain = chain;
    this.#wallet = wallet;
    this.#publicKey = publicKey;
    this.#accountName = accountName;
  }

  /**
   * Returns the public key for the currently active role.
   * Guaranteed to be available (no conditional checks needed).
   */
  public get publicKey(): TPublicKey {
    return this.#publicKey;
  }

  /**
   * Returns the account name.
   * Guaranteed to be available (no conditional checks needed).
   */
  public get accountName(): string {
    return this.#accountName;
  }

  /**
   * Encrypts data using the active role's key.
   * 
   * @param buffer - Data to encrypt
   * @param recipient - Recipient's public key
   * @returns Encrypted data
   */
  public async encryptData(buffer: string, recipient: TPublicKey): Promise<string> {
    return this.#chain.encrypt(this.#wallet, buffer, this.#publicKey, recipient);
  }

  /**
   * Decrypts data using the active role's key.
   * 
   * @param content - Encrypted content to decrypt
   * @returns Decrypted data
   */
  public async decryptData(content: string): Promise<string> {
    return this.#chain.decrypt(this.#wallet, content);
  }

  /**
   * Generates signatures for a transaction using the active role's key.
   * 
   * @param transaction - Transaction to sign
   * @returns Array of signatures
   */
  protected async generateSignatures(transaction: ISignatureTransaction): Promise<TSignature[]> {
    const signature = this.#wallet.signDigest(this.#publicKey, transaction.sigDigest);
    return [signature];
  }
}
