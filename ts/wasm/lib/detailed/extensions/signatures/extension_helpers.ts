import type { IOnlineEncryptionProvider, IOnlineSignatureProvider } from './index';
import type { ISignatureTransaction, TAccountName, TPublicKey, TSignature } from '../../interfaces';

/**
 * Helper class encapsulating transaction signing flow. Derived class must implement signature generation logic.
 */
export abstract class ASignatureProvider implements IOnlineSignatureProvider {
  public async signTransaction(transaction: ISignatureTransaction): Promise<void> {
    // Calls the provider-specific signature generation logic
    const signatures = await this.generateSignatures(transaction);

    for(const sig of signatures)
      transaction.addSignature(sig);
  }

    /// Generates the signatures for the given transaction in a way specific to given provider..
  protected abstract generateSignatures(transaction: ISignatureTransaction): Promise<TSignature[]>;
};

export type TBinaryBuffer = ArrayBufferLike | ArrayBufferView | Uint8Array;

/**
 * Helper class encapsulating transaction signing and encryption flow. Derived class must implement signature
 * generation logic like also methods related to data encryption.
 */
export abstract class AEncryptionProvider extends ASignatureProvider
                                          implements IOnlineEncryptionProvider {
  public async signTransaction(transaction: ISignatureTransaction): Promise<void> {
    await transaction.performOperationEncryption?.(this);
    /// Call the base implementation to complete transaction signing flow
    await super.signTransaction(transaction);
  }

  /// Provider specific implementation of data encryption
  public abstract encryptData(buffer: string | TBinaryBuffer, recipient: TPublicKey | TAccountName, nonce?: number): Promise<string>;

  /// Provider specific implementation of data decryption
  public abstract decryptData(buffer: string): Promise<string>;
};
