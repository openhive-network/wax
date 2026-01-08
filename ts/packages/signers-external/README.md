# @hiveio/wax-signers-external

External wallet signature provider for Hive blockchain. Stores encrypted private keys in external cloud storage and provides transaction signing capabilities.

## Installation

```bash
npm install @hiveio/wax-signers-external
```

## Quick Start

This example is specific only for Google Drive which is currently the only supported storage provider.
See [`signers-external` TypeScript example in Wax repo](https://gitlab.syncad.com/hive/wax/-/blob/develop/examples/ts/signers-external/README.md) for storage provider configuration details.

```typescript
import { createWaxFoundation } from '@hiveio/wax';
import { createExternalWallet } from '@hiveio/wax-signers-external';

const wax = await createWaxFoundation();

const wallet = await createExternalWallet(
  wax,
  /**
   * Token provider callback function
   * This function should return a valid Google OAuth2 access token
   * The callback will be invoked before each API call to ensure fresh tokens
  */
  async () => getStorageAuthToken(),
  /** Callback function to query for storage password or provide cached encryption key.
   *  @param missingStorageFile if true, it should enforce query for new password
   *  @returns Either a password (which will be used to derive encryption key) or the encryption key WIF directly
  */
  async (missingFile) => ({ password })
);

// Store and use keys
const content = await wallet.createForHiveKey('posting', 'myaccount', '5J...');
const signedTx = await myTransaction.sign(content);

await wallet.close();
```

Supports `AsyncDisposable` for automatic cleanup:

```typescript
await using wallet = await createExternalWallet(wax, tokenProvider, passwordProvider);
const content = await wallet.loadForHiveKey('myaccount', 'posting');
```

## Key Types

**Hive Role Keys**: `posting`, `active`, `owner`, `memo`

**Custom Keys**: Arbitrary keys identified by alias string, useful for application-specific signing.

## Storage Providers

| Provider | Enum Value | Description |
|----------|------------|-------------|
| Google Drive | `EStorageProviders.GOOGLE_DRIVE` | Stores wallet in app-private folder |

## Error Handling

```typescript
import { WaxExternalSignatureProviderError } from '@hiveio/wax-signers-external';

try {
  const content = await wallet.loadForHiveKey('alice', 'posting');
} catch (error) {
  if (error instanceof WaxExternalSignatureProviderError) {
    // Handle: KEY_NOT_FOUND, DECRYPTION_FAILED, etc.
  }
}
```

## License

SEE LICENSE IN [LICENSE.md](LICENSE.md)
