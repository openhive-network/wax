# External Wallet (Google Drive) Example

This example demonstrates the usage of `@hiveio/wax-signers-external` package for managing Hive private keys stored securely in Google Drive.

## Features Demonstrated

- **Wallet Initialization** - Connect to Google Drive storage with OAuth authentication
- **Hive Role Keys** - Create and load keys for Hive accounts (posting, active, owner, memo)
- **Custom Keys** - Store arbitrary private keys with custom aliases
- **Transaction Signing** - Sign Hive transactions with stored keys
- **Encryption/Decryption** - Encrypt and decrypt data using wallet keys
- **Key Enumeration** - List all stored keys in the wallet

## Prerequisites

### Google OAuth Token

This example requires a Google OAuth 2.0 access token with the `drive.appdata` scope. Follow these steps:

1. Go to [Google OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)
2. In **Step 1**, enter the scope: `https://www.googleapis.com/auth/drive.appdata`
3. Click **"Authorize APIs"** and sign in with your Google account
4. In **Step 2**, click **"Exchange authorization code for tokens"**
5. Copy the **Access token** (it will be valid for ~1 hour)

> ⚠️ **Note**: The OAuth Playground token expires after approximately 1 hour. For production applications, implement proper OAuth 2.0 flow with token refresh.

## Running the Example

```bash
# Install dependencies
pnpm install

# Start development server with Parcel
pnpm serve
```

Open the URL shown in the terminal (usually <http://localhost:1234>) in your browser.

## Usage Flow

### 1. Enter OAuth Token

Paste your Google OAuth access token from the OAuth Playground.

### 2. Set Wallet Password

Enter a password that will be used to encrypt your wallet data. This password is required every time you open the wallet (unless you cache the encryption key).

### 3. Initialize Wallet

Click **"Initialize Wallet"** to connect to Google Drive and create/load your wallet file.

### 4. Manage Keys

- **Create Hive Key**: Store a new Hive account key (posting, active, owner, or memo)
- **Load Hive Key**: Load an existing key from the wallet
- **Create Custom Key**: Store any private key with a custom alias
- **Load Custom Key**: Load a custom key by its alias

### 5. Perform Operations

- **Sign Transaction**: Signs a sample vote transaction with the loaded key
- **Encrypt/Decrypt**: Encrypt a message and decrypt it back

## API Reference

### `createExternalWallet(waxBase, authProvider, storagePasswordProvider, storageFileName?, storage?)`

Creates an external wallet instance.

```typescript
import { createWaxFoundation } from '@hiveio/wax';
import { createExternalWallet } from '@hiveio/wax-signers-external';

const wax = await createWaxFoundation();

const wallet = await createExternalWallet(
  wax,
  () => oauthToken,  // TokenProvider - returns OAuth access token
  async (missingFile) => ({ password: 'my-password' }),  // TStoragePasswordProvider
  'wallet.json'  // Optional: custom storage file name
);
```

### `IExternalWallet` Interface

```typescript
// Create/load keys
await wallet.createForHiveKey('posting', 'accountname', 'privateKeyWif');
await wallet.loadForHiveKey('accountname', 'posting');
await wallet.createForCustomKey('my-key', 'privateKeyWif', 'description');
await wallet.loadForCustomKey('my-key');

// Get encryption key for caching
const encryptionKeyWif = wallet.getEncryptionKeyWif();

// Close wallet
await wallet.close();
```

### `IExternalWalletContent` Interface

```typescript
// Sign transactions
await walletContent.signTransaction(transaction);

// Encrypt/decrypt data
const encrypted = await walletContent.encryptData(buffer, recipientPublicKey);
const decrypted = await walletContent.decryptData(encrypted);

// Enumerate keys
for (const key of walletContent.enumStoredHiveKeys('accountname')) {
  console.log(key.role, key.publicKey);
}

for (const key of walletContent.enumStoredCustomKeys()) {
  console.log(key.customAlias, key.publicKey);
}

// Remove keys
await walletContent.removeKey(publicKey);
await walletContent.clearContents(false);
```

## Security Notes

- The wallet file is encrypted using the password you provide
- Keys are stored in Google Drive's app-specific data folder (hidden from the user)
- The encryption key WIF can be cached locally for convenience, but this trades security for usability
- In production, implement proper OAuth 2.0 flow and secure token storage

## Limitations

- OAuth tokens from the Playground expire after ~1 hour
- This example does not include token refresh mechanism
- Google Drive API rate limits may apply

## Related Packages

- `@hiveio/wax` - Core Wax library
- `@hiveio/wax-signers-beekeeper` - Local wallet signer
- `@hiveio/wax-signers-keychain` - Hive Keychain browser extension signer
- `@hiveio/wax-signers-peakvault` - Peak Vault browser extension signer
