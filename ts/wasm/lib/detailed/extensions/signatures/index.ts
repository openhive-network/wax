import type { TPublicKey, TSignature, THexString, ITransaction, TAccountName } from "../../interfaces";
import type { TBinaryBuffer } from "./extension_helpers";

export interface ISignatureProvider {
  /**
   * Signs a transaction by signing a digest of the transaction
   *
   * @param {TPublicKey} publicKey public key in WIF format to match the private key in the underlying container. It will be used to sign the provided data
   * @param {THexString} sigDigest digest of a transaction in hex format
   *
   * @returns {TSignature} signed data in hex format
   */
  signDigest(publicKey: TPublicKey, sigDigest: THexString): TSignature;
  /**
   * Encrypts given data for a specific entity and returns the encrypted message
   *
   * @param {string} content Content to be encrypted
   * @param {TPublicKey} key public key to find the private key in the underlying container and encrypt the data
   * @param {TPublicKey} [anotherKey] other public key to find the private key in the underlying container and encrypt the data (optional - use if the message is to encrypt for somebody else)
   * @param {number} [nonce] optional nonce to be explicitly specified for encryption
   *
   * @returns {string} base58 encrypted buffer
   */
  encryptData(content: string, key: TPublicKey, anotherKey?: TPublicKey, nonce?: number): string;
  /**
   * Decrypts given data from a specific entity and returns the decrypted message
   *
   * @param {string} content Base58 content to be decrypted
   * @param {TPublicKey} key public key to find the private key in the underlying container and decrypt the data
   * @param {TPublicKey} [anotherKey] other public key to find the private key in the underlying container and decrypt the data (optional - use if the message was encrypted for somebody else)
   *
   * @returns {string} decrypted buffer
   */
  decryptData(content: string, key: TPublicKey, anotherKey?: TPublicKey): string;
};

export interface IOnlineEncryptionProvider {
  /**
   * Encrypts data
   *
   * @param buffer The string or binary buffer to encrypt.
   * @param recipient The public key of the recipient to encrypt the data for, or its account name - if supported by the signer.
   * @returns A string containing the encrypted data.
   */
  encryptData(buffer: string | TBinaryBuffer, recipient: TPublicKey | TAccountName): Promise<string>

  /**
   * Decrypts data
   *
   * @param buffer The string to decrypt.
   * @returns The decrypted data as a string.
   */
  decryptData(buffer: string): Promise<string>;
}

export interface IOnlineSignatureProvider {
  /**
   * Signs a transaction by signing a digest of the transaction
   *
   * @param {ITransaction} transaction transaction to be signed
   *
   * @returns {Promise<void>} resolves when the wallet finished signing (signature(s) appended internally)
   */
  signTransaction(transaction: ITransaction): Promise<void>;
};

export * from "./extension_helpers";