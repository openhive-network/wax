import type { IOnlineEncryptionProvider, IOnlineSignatureProvider, ITransaction, TPublicKey, TRole } from "@hiveio/wax";
import type { MetaMaskInpageProvider, RequestArguments } from "@metamask/providers";
import { getSnapsProvider } from "./provider.js";

type MetamaskSnapData = {
  permissionName: string;
  id: string;
  version: string;
  initialPermissions: Record<string, unknown>;
};
type MetamaskSnapsResponse = Record<string, MetamaskSnapData>;

// We do not extend from WaxError to avoid runtime dependencies, such as: /vite or /web - without it we can import only types
export class WaxMetaMaskProviderError extends Error {}

/**
 * The Hive Wallet snap origin to use.
 * Will default to the local hosted snap if no value is provided in environment.
 */
export const defaultSnapOrigin = `npm:@hiveio/metamask-snap`; // local:http://localhost:8080

/**
 * The Hive Wallet snap version to use.
 * 1.6.0 is the latest, audited version of the snap as of June 2025.
 */
export const defaultSnapVersion: string | undefined = '1.6.0';

/**
 * Check if a snap ID is a local snap ID.
 *
 * @param snapId - The snap ID.
 * @returns True if it's a local Snap, or false otherwise.
 */
const isLocalSnap = (snapId: string) => snapId.startsWith('local:');

/**
 * Wax transaction signature provider using the Hive Wallet MetaMask integration.
 *
 * Knowledge Base: https://github.com/openhive-network/metamask-snap/wiki/KB#on-chain-usage
 *
 * @example
 * ```
 * const provider = MetaMaskProvider.for(0);
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
export class MetaMaskProvider implements IOnlineSignatureProvider, IOnlineEncryptionProvider {
  /**
   * Indicates either the snap is installed or not.
   * If you want to install or reinstall the snap, use {@link installSnap}
   */
  public get isSnapInstalled() {
    return !!MetaMaskProvider.#currentSnap;
  }

  /**
   * Indicates if the MetaMask Flask development version is detected.
   */
  public get isFlaskDetected() {
    return MetaMaskProvider.#isFlaskDetected;
  }

  /**
   * Indicates either the snap is local or not.
   */
  public get isLocalSnap() {
    return isLocalSnap(MetaMaskProvider.#snapOrigin);
  }

  /**
   * @internal The MetaMask provider instance. This is usually obtained from `window.ethereum` in the browser.
   */
  static #provider: MetaMaskInpageProvider;

  /**
   * @internal Indicates if the MetaMask Flask development version is detected.
   */
  static #isFlaskDetected: boolean;

  /**
   * @internal The current snap data if it is installed, or null if not.
   */
  static #currentSnap: MetamaskSnapData | null = null;

  /**
   * @internal The origin of the snap to use.
   */
  static #snapOrigin: string;

  /**
   * @param accountIndex The index of the account to use for signing transactions. Defaults to 0.
   * @param role The role to use for signing transactions. If not provided, it will be implicitly determined from the transaction.
   */
  private constructor(
    private readonly accountIndex: number,
    private readonly role: TRole | undefined
  ) {}

  private readonly publicKeyCache = new Map<TRole, TPublicKey>();

  /**
   * @internal method to make requests to the MetaMask provider.
   */
  private request(method: RequestArguments['method'], params?: RequestArguments['params']) {
    return MetaMaskProvider.#provider.request(params ? { method, params } : { method });
  }

  /**
   * Signs a transaction using the Hive Wallet MetaMask integration.
   * Automatically detects the required authorities from the transaction and signs it using the Hive Wallet snap.
   *
   * @param transaction The transaction to sign. Should be an instance of {@link ITransaction}, created by Wax library.
   *
   * @throws WaxMetaMaskProviderError if no authorities are required to sign the transaction.
   * @throws on any error from the Hive Wallet invocation.
   */
  public async signTransaction(transaction: ITransaction): Promise<void> {
    const authorities = new Set<TRole>();

    if (this.role) {
      authorities.add(this.role);
    } else {
      const requiredAuthorities = transaction.requiredAuthorities;
      for(const auth in requiredAuthorities)
        if (!!requiredAuthorities[auth].length || !!requiredAuthorities[auth].size)
          authorities.add(auth as TRole);
    }

    if (authorities.size === 0)
      throw new WaxMetaMaskProviderError('No authorities to sign the transaction');

    transaction.performOperationEncryption(this);

    const response = await this.invokeSnap('hive_signTransaction', { transaction: transaction.toApi(), keys: [...authorities].map(role => ({ role, accountIndex: this.accountIndex })) }) as any;

    for(const signature of response.signatures)
      transaction.addSignature(signature);
  }

  /**
   * Connects to the MetaMask provider and returns a {@link MetaMaskProvider} instance.
   *
   * Knowledge Base: https://github.com/openhive-network/metamask-snap/wiki/KB#on-chain-usage
   *
   * @note This method caches the MetaMask connection for optimization.
   * @note For security reasons, when you call this method multiple times with different snap origin it will fail, so users wouldn't silently switch to a different inpage provider or snap.
   *
   * @param accountIndex The index of the account to use for signing transactions. Defaults to 0.
   * @param role The role to use for signing transactions. If not provided, it will be implicitly determined from the transaction.
   * @param snapOrigin The origin of the snap to use. Defaults to the npm audit-approved snap. Can be changed in order to test local snap development.
   * @throws on any error from the Hive Wallet invocation.
   */
  public static async for(accountIndex: number = 0, role?: TRole | undefined, snapOrigin: string = defaultSnapOrigin): Promise<MetaMaskProvider> {
    if (!MetaMaskProvider.#snapOrigin) {
      // Get the provider - this will be the MetaMask provider if it is installed
      const provider = await getSnapsProvider();
      if (!provider)
        throw new Error("Could not retrieve the provider. Make sure you have a wallet installed.");

      MetaMaskProvider.#provider = provider;

      // Check for client version - detect if we are using metamask flask development version
      const clientVersion = await MetaMaskProvider.#provider.request({ method: 'web3_clientVersion' });
      MetaMaskProvider.#isFlaskDetected = (clientVersion as string[])?.includes('flask');

      // Check if the snap is already installed
      const snaps = await MetaMaskProvider.#provider.request({ method: 'wallet_getSnaps' }) as MetamaskSnapsResponse;
      MetaMaskProvider.#currentSnap = snaps[snapOrigin] ?? null;

      MetaMaskProvider.#snapOrigin = snapOrigin;
    }

    if (MetaMaskProvider.#snapOrigin !== snapOrigin)
      throw new WaxMetaMaskProviderError(`The snap origin is already set to "${MetaMaskProvider.#snapOrigin}". You cannot change it to ${snapOrigin} after the first call.`);

    // Provide all of the data to our MetaMaskProvider wrapper exposing the public API
    return new MetaMaskProvider(accountIndex, role);
  }

  /**
   * @returns Either True or False if the supported extension (MetaMask) is installed, false otherwise.
   */
  public static async isExtensionInstalled(): Promise<boolean> {
    return await getSnapsProvider() !== null;
  }

  /**
   * Encrypts the given buffer using the Hive Wallet.
   *
   * @param buffer The buffer to encrypt. Should be a string.
   * @param recipient The public key of the recipient to encrypt the buffer for.
   * The recipient should be a valid public key in the format expected by the Hive Wallet - Starting with "STM".
   * @returns The encrypted buffer as a string, starting with the `#` prefix.
   * @throws on any error from the Hive Wallet invocation.
   */
  public async encryptData(buffer: string, recipient: TPublicKey): Promise<string> {
    const response = await this.invokeSnap('hive_encrypt', { buffer, firstKey: { role: "memo" as TRole, accountIndex: this.accountIndex }, secondKey: recipient }) as any;

    return response.buffer;
  }

  /**
   * Gets the public keys for the given roles from the Hive Wallet.
   *
   * @param roles The roles to get the public keys for. Should be an array of TRole.
   * @returns A record of {@link TRole} to {@link TPublicKey}, where each role is mapped to its corresponding public key.
   * @throws on any error from the Hive Wallet invocation or unsupported role.
   */
  public async getPublicKeys<Roles extends TRole[]>(...roles: Roles): Promise<{ [Role in Roles[number]]: TPublicKey }> {
    const keysRecord = Object.fromEntries(([...(new Set(roles))]).map(role => [role, undefined])) as unknown as { [Role in Roles[number]]: TPublicKey };

    for(const role in keysRecord) {
      const cachedKey = this.publicKeyCache.get(role as TRole);
      if (cachedKey)
        keysRecord[role as TRole] = cachedKey;
    }

    const missingRoles = Object.entries(keysRecord).filter(([, key]) => !key).map(([role]) => role as TRole);

    // All keys are already cached so return the cached keys
    if (missingRoles.length === 0)
      return keysRecord;

    // This will fail if any of the requested roles is not supported
    const response = await this.invokeSnap('hive_getPublicKeys', { keys: missingRoles.map(role => ({ role, accountIndex: this.accountIndex })) }) as any;

    // Update the cache with the new keys
    for(const key of response.publicKeys) {
      keysRecord[key.role] = key.publicKey;
      this.publicKeyCache.set(key.role, key.publicKey);
    }

    return keysRecord;
  }

  /**
   * Gets the public key for the given role from the Hive Wallet.
   *
   * @param role The role to get the public key for. Should be a valid role.
   * @returns The public key for the given role.
   */
  public async getPublicKey(role: TRole): Promise<TPublicKey> {
    // Check if the key is already cached
    const key = this.publicKeyCache.get(role);
    if (key)
      return key;

    // This will fail if the requested role is not supported
    const response = await this.invokeSnap('hive_getPublicKey', { keys: [{ role, accountIndex: this.accountIndex }] }) as any;

    const publicKey = response.publicKeys[0].publicKey;

    // Update the cache with the new key
    this.publicKeyCache.set(role, publicKey);

    return publicKey;
  }

  /**
   * Decrypts the given encrypted buffer using the Hive Wallet.
   *
   * @param buffer The encrypted buffer to decrypt. Should start with the `#` prefix.
   * @returns The decrypted buffer as a string.
   * @throws on any error from the Hive Wallet invocation.
   */
  public async decryptData(buffer: string): Promise<string> {
    const response = await this.invokeSnap('hive_decrypt', { buffer, firstKey: { role: "memo" as TRole, accountIndex: this.accountIndex } }) as any;

    return response.buffer;
  }

  /**
   * Request the Hive Wallet snap to be installed or reinstalled.
   * You can check if snap is installed using {@link isSnapInstalled}
   *
   * @param version The version of the Hive Wallet to install. If not provided, the default Hive Wallet version will be used.
   * @throws on any error from the Hive Wallet invocation.
   */
  public async installSnap(version: string | undefined = defaultSnapVersion) {
    const snaps = await this.request('wallet_requestSnaps', {
      [MetaMaskProvider.#snapOrigin]: (typeof version === "undefined" || version.length === 0) ? {} : { version }
    }) as MetamaskSnapsResponse;

    MetaMaskProvider.#currentSnap = snaps[MetaMaskProvider.#snapOrigin]!;
  }

  /**
   * Invokes the snap method with the given parameters.
   * In order to call this method, you should install the snap first, see {@link isSnapInstalled} and {@link installSnap}.
   *
   * @note This method is intented mainly for development purposes and backward compatibility, so please use it with caution.
   *
   * @param method The method to invoke on the snap (e.g. `"hive_signTransaction"`).
   * @param params The parameters to pass to the snap method. Should be compatible with the snap's API.
   * @throws on any error from the Hive Wallet invocation.
   */
  public async invokeSnap(method: RequestArguments['method'], params?: RequestArguments['params']) {
    if (!this.isSnapInstalled)
      throw new WaxMetaMaskProviderError('The snap is not installed');

    return this.request('wallet_invokeSnap', {
      snapId: MetaMaskProvider.#snapOrigin,
      request: params ? { method, params } : { method },
    });
  }
}

export default MetaMaskProvider;
