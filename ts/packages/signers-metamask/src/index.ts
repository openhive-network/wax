import type { IOnlineSignatureProviderSignTransaction, ITransaction, TPublicKey, TRole } from "@hiveio/wax";
import type { MetaMaskInpageProvider } from "@metamask/providers";
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
 * The snap origin to use.
 * Will default to the local hosted snap if no value is provided in environment.
 */
export const defaultSnapOrigin = `npm:@hiveio/metamask-snap`; // local:http://localhost:8080

export const defaultSnapVersion: string | undefined = '1.3.3';

/**
 * Check if a snap ID is a local snap ID.
 *
 * @param snapId - The snap ID.
 * @returns True if it's a local Snap, or false otherwise.
 */
export const isLocalSnap = (snapId: string) => snapId.startsWith('local:');


/**
 * Wax transaction signature provider using the MetaMask SDK.
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
export class MetaMaskProvider implements IOnlineSignatureProviderSignTransaction {
  /**
   * Indicates either the snap is installed or not.
   * If you want to install or reinstall the snap, use {@link installSnap}
   */
  public get isSnapInstalled() {
    return !!this.currentSnap;
  }

  /**
   * Indicates either the snap is local or not.
   */
  public readonly isLocalSnap = isLocalSnap(defaultSnapOrigin);

  public constructor(
    private readonly provider: MetaMaskInpageProvider,
    public readonly isFlaskDetected: boolean,
    private currentSnap: MetamaskSnapData | null = null,
    private readonly accountIndex: number = 0
  ) {}

  public isOnline = true as const;

  private request(method: string, params?: any) {
    return this.provider.request(params ? { method, params } : { method });
  }

  public async signTransaction(transaction: ITransaction): Promise<void> {
    const requiredAuthorities = transaction.requiredAuthorities;
    const authorities = new Set<TRole>();
    for(const auth in requiredAuthorities)
      if (!!requiredAuthorities[auth].length || !!requiredAuthorities[auth].size)
        authorities.add(auth as TRole);

    if (authorities.size === 0)
      throw new WaxMetaMaskProviderError('No authorities to sign the transaction');

    const response = await this.invokeSnap('hive_signTransaction', { transaction: transaction.toApi(), keys: [...authorities].map(role => ({ role, accountIndex: this.accountIndex })) }) as any;

    for(const signature of response.signatures)
      transaction.sign(signature);
  }

  /**
   * Connects to the metamask provider and returns a {@link MetaMaskProvider} instance.
   */
  public static async for(accountIndex: number = 0): Promise<MetaMaskProvider> {
    // Get the provider - this will be the MetaMask provider if it is installed
    const provider = await getSnapsProvider();
    if (!provider)
      throw new Error("Could not retrieve the provider. Make sure you have a wallet installed.");

    // Check for client version - detect if we are using metamask flask development version
    const clientVersion = await provider.request({ method: 'web3_clientVersion' });
    const isFlaskDetected = (clientVersion as string[])?.includes('flask');

    // Check if the snap is already installed
    const snaps = await provider.request({ method: 'wallet_getSnaps' }) as MetamaskSnapsResponse;
    const installedSnap = snaps[defaultSnapOrigin] ?? null;

    // Provide all of the data to our MetaMaskProvider wrapper exposing the public API
    return new MetaMaskProvider(provider, isFlaskDetected, installedSnap, accountIndex);
  }

  public async encrypt(buffer: string, recipient: TPublicKey): Promise<string> {
    const response = await this.invokeSnap('hive_encrypt', { buffer, firstKey: { role: "memo" as TRole, accountIndex: this.accountIndex }, secondKey: recipient }) as any;

    return response.buffer;
  }

  public async decrypt(buffer: string): Promise<string> {
    const response = await this.invokeSnap('hive_decrypt', { buffer, firstKey: { role: "memo" as TRole, accountIndex: this.accountIndex } }) as any;

    return response.buffer;
  }

  /**
   * Request the snap to be installed or reinstalled.
   * You can check if snap is installed using {@link isSnapInstalled}
   */
  public async installSnap(version: string | undefined = defaultSnapVersion) {
    const snaps = await this.request('wallet_requestSnaps', {
      [defaultSnapOrigin]: (typeof version === "undefined" || version.length === 0) ? {} : { version }
    }) as MetamaskSnapsResponse;

    this.currentSnap = snaps[defaultSnapOrigin]!;
  }

  /**
   * Invokes the snap method with the given parameters.
   * In order to call this method, you should install the snap first, see {@link isSnapInstalled}
   */
  public async invokeSnap(method: string, params?: any) {
    if (!this.isSnapInstalled)
      throw new WaxMetaMaskProviderError('The snap is not installed');

    return this.request('wallet_invokeSnap', {
      snapId: defaultSnapOrigin,
      request: params ? { method, params } : { method },
    });
  }
}

export default MetaMaskProvider;
