import { IHiveChainInterface } from "@hiveio/wax";
import { WaxExternalSignatureProviderError } from "./errors.js";

// Constants for deterministic key derivation from password
const ENCRYPTION_ACCOUNT = 'wallet-encryption';
const ENCRYPTION_ROLE = 'encryption';

/**
 * Manages encryption keys for wallet data protection.
 *
 * Encryption key: WIF key derived from user's recovery password
 * - Stored in localStorage for automatic decryption on the same device
 * - On new device, user provides recovery password to derive the same key
 */
export class EncryptionKeyManager {
  private static readonly LOCAL_STORAGE_KEY_PREFIX = 'wax_external_signer_';
  private static readonly ENCRYPTION_KEY_SUFFIX = '_encryption_key_wif';

  /**
   * Derives an encryption key from recovery password.
   * Uses deterministic key derivation so the same password always produces the same key.
   *
   * @param chain - The Hive chain interface for key derivation
   * @param recoveryPassword - User's recovery password
   * @returns WIF private key string derived from password
   */
  public static deriveKeyFromPassword(chain: IHiveChainInterface, recoveryPassword: string): string {
    const keyData = chain.getPrivateKeyFromPassword(ENCRYPTION_ACCOUNT, ENCRYPTION_ROLE, recoveryPassword);
    return keyData.wifPrivateKey;
  }

  /**
   * Stores the encryption key WIF in localStorage for automatic decryption.
   *
   * @param fileName - Wallet file name (used as unique identifier)
   * @param keyWif - WIF private key to store
   */
  public static storeEncryptionKey(fileName: string, keyWif: string): void {
    const key = this.getLocalStorageKey(fileName);

    try {
      localStorage.setItem(key, keyWif);
    } catch (error) {
      throw new WaxExternalSignatureProviderError(
        'Failed to store encryption key in localStorage',
        error instanceof Error ? error : undefined,
        'LOCALSTORAGE_WRITE_FAILED'
      );
    }
  }

  /**
   * Retrieves the encryption key WIF from localStorage.
   *
   * @param fileName - Wallet file name (used as unique identifier)
   * @returns The WIF key if found, undefined otherwise
   */
  public static loadEncryptionKey(fileName: string): string | undefined {
    const key = this.getLocalStorageKey(fileName);

    try {
      return localStorage.getItem(key) ?? undefined;
    } catch (error) {
      // localStorage might not be available (SSR, privacy mode, etc.)
      return undefined;
    }
  }

  /**
   * Removes the encryption key from localStorage.
   * After calling this, user will need to provide recovery password again.
   *
   * @param fileName - Wallet file name (used as unique identifier)
   */
  public static clearEncryptionKey(fileName: string): void {
    const key = this.getLocalStorageKey(fileName);

    try {
      localStorage.removeItem(key);
    } catch (error) {
      // Ignore errors when clearing
    }
  }

  /**
   * Checks if an encryption key exists in localStorage.
   *
   * @param fileName - Wallet file name (used as unique identifier)
   * @returns True if encryption key exists
   */
  public static hasEncryptionKey(fileName: string): boolean {
    return this.loadEncryptionKey(fileName) !== undefined;
  }

  /**
   * Gets the localStorage key for storing encryption key.
   *
   * @param fileName - Wallet file name
   * @returns localStorage key
   */
  private static getLocalStorageKey(fileName: string): string {
    return `${this.LOCAL_STORAGE_KEY_PREFIX}${fileName}${this.ENCRYPTION_KEY_SUFFIX}`;
  }
}
