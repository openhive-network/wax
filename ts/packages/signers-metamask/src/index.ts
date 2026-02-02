import type { ISignatureTransaction, TBinaryBuffer, TPublicKey, TRole, TSignature } from "@hiveio/wax";
import { AEncryptionProvider } from "@hiveio/wax";

import type { MetaMaskInpageProvider, RequestArguments } from "@metamask/providers";
import { getSnapsProvider } from "./provider.js";

type MetamaskSnapData = {
  permissionName: string;
  id: string;
  version: string;
  initialPermissions: Record<string, unknown>;
};
type MetamaskSnapsResponse = Record<string, MetamaskSnapData>;

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
export class MetaMaskProvider extends AEncryptionProvider {
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

  get #selectedKeyIndex() {
    if (this.#addressIndex !== undefined) {
      return {
        accountIndex: this.#accountIndex,
        addressIndex: this.#addressIndex,
      };
    }

    return {
      role: this.#role,
      accountIndex: this.#accountIndex,
    };
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

  readonly #accountIndex: number;
  readonly #role?: TRole;
  readonly #addressIndex?: number;

  /**
   * @param accountIndex The index of the account to use for signing transactions. Defaults to 0.
   * @param role The role to use for signing transactions. If not provided, it will be implicitly determined from the transaction.
   */
  private constructor(
    accountIndex: number,
    role: TRole | number
  ) {
    super();

    this.#accountIndex = accountIndex;
    if (typeof role === "number") {
      this.#role = undefined;
      this.#addressIndex = role;
    } else {
      this.#role = role;
      this.#addressIndex = undefined;
    }
  }

  readonly #publicKeyCache = new Map<TRole | number, TPublicKey>();

  /**
   * @internal method to make requests to the MetaMask provider.
   */
  private request(method: RequestArguments['method'], params?: RequestArguments['params']) {
    return MetaMaskProvider.#provider.request(params ? { method, params } : { method });
  }

  /**
   * Generates signatures for given transaction using the Hive Wallet MetaMask integration.
   * Automatically detects the required authorities from the transaction and signs it using the Hive Wallet snap.
   *
   * @param transaction The transaction to sign. Should be an instance of {@link ITransaction}, created by Wax library.
   *
   * @throws on any error from the Hive Wallet invocation.
   */
  protected async generateSignatures(transaction: ISignatureTransaction): Promise<TSignature[]> {
    const response = await this.invokeSnap('hive_signTransaction', { transaction: transaction.toApi(), keys: [this.#selectedKeyIndex] }) as any;

    return response.signatures;
  }

  /**
   * Connects to the MetaMask provider and returns a {@link MetaMaskProvider} instance.
   *
   * Knowledge Base: https://github.com/openhive-network/metamask-snap/wiki/KB#on-chain-usage
   *
   * @note This method caches the MetaMask connection for optimization.
   * @note For security reasons, when you call this method multiple times with different snap origin it will fail, so users wouldn't silently switch to a different inpage provider or snap.
   *
   * @param accountIndex The index of the account to use for signing transactions. Should be 0 if you want to use the default account.
   * @param role The role to use for signing transactions (Can be a custom address index - number).
   * @param snapOrigin The origin of the snap to use. Defaults to the npm audit-approved snap. Can be changed in order to test local snap development.
   *
   * @throws on any error from the Hive Wallet invocation.
   */
  public static async for(accountIndex: number, role: TRole | number, snapOrigin: string = defaultSnapOrigin): Promise<MetaMaskProvider> {
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
   * @param buffer The buffer to encrypt. Can be binary.
   * @param recipient The public key of the recipient to encrypt the buffer for.
   * The recipient should be a valid public key in the format expected by the Hive Wallet - Starting with "STM".
   * @returns The encrypted buffer as a string, starting with the `#` prefix.
   * @throws on any error from the Hive Wallet invocation.
   */
  public async encryptData(buffer: string | TBinaryBuffer, recipient: TPublicKey): Promise<string> {
    const encryptBuffer = typeof buffer === "string" ? buffer : Array.from(new Uint8Array(buffer as ArrayBuffer));

    const response = await this.invokeSnap('hive_encrypt', { buffer: encryptBuffer, firstKey: this.#selectedKeyIndex, secondKey: recipient }) as any;

    return response.buffer;
  }

  /**
   * Gets the public keys for the given roles from the Hive Wallet.
   *
   * @param roles The roles to get the public keys for. Should be an array of TRole.
   * @returns A record of {@link TRole} to {@link TPublicKey}, where each role is mapped to its corresponding public key.
   * @throws on any error from the Hive Wallet invocation or unsupported role.
   */
  public async getPublicKeys<R extends Array<TRole | number>>(...roles: R): Promise<{ [key in R[number]]: TPublicKey }> {
    const keysRecord = Object.fromEntries(([...(new Set(roles))]).map(role => [role, undefined])) as unknown as Record<R[number], TPublicKey>;

    for(const role in keysRecord) {
      const cachedKey = this.#publicKeyCache.get(role as R[number]);
      if (cachedKey)
        keysRecord[role as R[number]] = cachedKey;
    }

    const missingRoles = Object.entries(keysRecord).filter(([, key]) => !key).map(([role]) => role as R[number]);

    // All keys are already cached so return the cached keys
    if (missingRoles.length === 0)
      return keysRecord;

    // This will fail if any of the requested roles is not supported
    const response = await this.invokeSnap('hive_getPublicKeys', { keys: missingRoles.map(role => {
      if (typeof role === "number") {
        return {
          accountIndex: this.#accountIndex,
          addressIndex: role,
        };
      } else {
        return {
          role: role,
          accountIndex: this.#accountIndex,
        };
      }
    }) }) as any;

    // Update the cache with the new keys
    for(const key of response.publicKeys) {
      keysRecord[key.role] = key.publicKey;
      this.#publicKeyCache.set(key.role, key.publicKey);
    }

    return keysRecord;
  }

  /**
   * Gets the public key for the given role from the Hive Wallet.
   *
   * @param role The role or custom address index to get the public key for. Should be a valid role.
   * @returns The public key for the given role.
   */
  public async getPublicKey(role: TRole | number): Promise<TPublicKey> {
    // Check if the key is already cached
    const key = this.#publicKeyCache.get(role);
    if (key)
      return key;

    const { [role]: publicKey } = await this.getPublicKeys(role);

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
    const response = await this.invokeSnap('hive_decrypt', { buffer, firstKey: this.#selectedKeyIndex }) as any;

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
  public async invokeSnap(method: RequestArguments['method'], params?: RequestArguments['params']): Promise<unknown> {
    if (!this.isSnapInstalled)
      throw new WaxMetaMaskProviderError('The snap is not installed');

    return this.request('wallet_invokeSnap', {
      snapId: MetaMaskProvider.#snapOrigin,
      request: params ? { method, params } : { method },
    });
  }
}

export default MetaMaskProvider;
