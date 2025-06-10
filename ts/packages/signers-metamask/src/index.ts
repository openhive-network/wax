import type { IOnlineSignatureProvider, ITransaction, TPublicKey, TRole } from "@hiveio/wax";
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
 * await tx.sign(provider);
 *
 * // broadcast
 * await chain.broadcast(tx);
 * ```
 */
export class MetaMaskProvider implements IOnlineSignatureProvider {
  /**
   * Indicates either the snap is installed or not.
   * If you want to install or reinstall the snap, use {@link installSnap}
   */
  public get isSnapInstalled() {
    return !!this.currentSnap;
  }

  /**
   * Indicates if the MetaMask Flask development version is detected.
   */
  public readonly isFlaskDetected: boolean;

  /**
   * Indicates either the snap is local or not.
   */
  public readonly isLocalSnap: boolean;

  /**
   * @param provider The MetaMask provider instance. This is usually obtained from `window.ethereum` in the browser.
   * @param role The role to use for signing transactions. If not provided, it will be implicitly determined from the transaction.
   * @param isFlaskDetected Indicates if the MetaMask Flask development version is detected.
   * @param currentSnap The current snap data if it is installed, or null if not.
   * @param accountIndex The index of the account to use for signing transactions. Defaults to 0.
   * @param snapOrigin The origin of the snap to use. Defaults to the npm audit-approved snap. Can be changed in order to test local snap development.
   */
  private constructor(
    private readonly provider: MetaMaskInpageProvider,
    private readonly role: TRole | undefined,
    isFlaskDetected: boolean,
    private currentSnap: MetamaskSnapData | null = null,
    private readonly accountIndex: number = 0,
    private readonly snapOrigin: string = defaultSnapOrigin
  ) {
    this.isFlaskDetected = isFlaskDetected;
    this.isLocalSnap = isLocalSnap(snapOrigin);
  }

  /**
   * @internal method to make requests to the MetaMask provider.
   */
  private request(method: RequestArguments['method'], params?: RequestArguments['params']) {
    return this.provider.request(params ? { method, params } : { method });
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

    const response = await this.invokeSnap('hive_signTransaction', { transaction: transaction.toApi(), keys: [...authorities].map(role => ({ role, accountIndex: this.accountIndex })) }) as any;

    for(const signature of response.signatures)
      transaction.sign(signature);
  }

  /**
   * Connects to the MetaMask provider and returns a {@link MetaMaskProvider} instance.
   *
   * Knowledge Base: https://github.com/openhive-network/metamask-snap/wiki/KB#on-chain-usage
   *
   * @param accountIndex The index of the account to use for signing transactions. Defaults to 0.
   * @param role The role to use for signing transactions. If not provided, it will be implicitly determined from the transaction.
   * @param snapOrigin The origin of the snap to use. Defaults to the npm audit-approved snap. Can be changed in order to test local snap development.
   * @throws on any error from the Hive Wallet invocation.
   */
  public static async for(accountIndex: number = 0, role?: TRole | undefined, snapOrigin: string = defaultSnapOrigin): Promise<MetaMaskProvider> {
    // Get the provider - this will be the MetaMask provider if it is installed
    const provider = await getSnapsProvider();
    if (!provider)
      throw new Error("Could not retrieve the provider. Make sure you have a wallet installed.");

    // Check for client version - detect if we are using metamask flask development version
    const clientVersion = await provider.request({ method: 'web3_clientVersion' });
    const isFlaskDetected = (clientVersion as string[])?.includes('flask');

    // Check if the snap is already installed
    const snaps = await provider.request({ method: 'wallet_getSnaps' }) as MetamaskSnapsResponse;
    const installedSnap = snaps[snapOrigin] ?? null;

    // Provide all of the data to our MetaMaskProvider wrapper exposing the public API
    return new MetaMaskProvider(provider, role, isFlaskDetected, installedSnap, accountIndex, snapOrigin);
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
  public async encrypt(buffer: string, recipient: TPublicKey): Promise<string> {
    const response = await this.invokeSnap('hive_encrypt', { buffer, firstKey: { role: "memo" as TRole, accountIndex: this.accountIndex }, secondKey: recipient }) as any;

    return response.buffer;
  }

  /**
   * Decrypts the given encrypted buffer using the Hive Wallet.
   *
   * @param buffer The encrypted buffer to decrypt. Should start with the `#` prefix.
   * @returns The decrypted buffer as a string.
   * @throws on any error from the Hive Wallet invocation.
   */
  public async decrypt(buffer: string): Promise<string> {
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
      [this.snapOrigin]: (typeof version === "undefined" || version.length === 0) ? {} : { version }
    }) as MetamaskSnapsResponse;

    this.currentSnap = snaps[this.snapOrigin]!;
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
      snapId: this.snapOrigin,
      request: params ? { method, params } : { method },
    });
  }
}

export default MetaMaskProvider;
