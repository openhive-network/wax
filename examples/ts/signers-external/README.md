# External Wallet Example (Google Drive)

Demonstrates `@hiveio/wax-signers-external` with Google Drive storage.

## Running the Example

```bash
# Install dependencies
pnpm install

# Start development server with Parcel
pnpm serve
```

Open the URL shown in the terminal (usually <http://localhost:1234>) in your browser.

## Google Drive OAuth Setup

### Quick Test (OAuth Playground)

For quick testing, use [Google OAuth 2.0 Playground](https://developers.google.com/oauthplayground/):

1. Enter scope: `https://www.googleapis.com/auth/drive.appdata`
2. Click **"Authorize APIs"** and sign in
3. Click **"Exchange authorization code for tokens"**
4. Copy the access token (valid ~1 hour)

### Production Setup

#### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Google Drive API**:
   - Navigate to **APIs & Services > Library**
   - Search for "Google Drive API" and enable it

#### 2. Configure OAuth Consent Screen

1. Go to **APIs & Services > OAuth consent screen**
2. Choose **External** user type (or Internal for Google Workspace)
3. Fill required fields:
   - App name
   - User support email
   - Developer contact email
4. Add scope: `https://www.googleapis.com/auth/drive.appdata`
5. Add test users if in testing mode

#### 3. Create OAuth Credentials

1. Go to **APIs & Services > Credentials**
2. Click **Create Credentials > OAuth client ID**
3. Select application type:
   - **Web application** for browser apps
   - **Desktop app** for Node.js/Electron
4. Configure authorized redirect URIs (e.g., `http://localhost:3000/callback`)
5. Save your **Client ID** and **Client Secret**

#### 4. Token Provider

Your app needs to provide access tokens to the wallet. Here's a minimal Express.js server with complete OAuth flow:

```typescript
// server.ts
import express from 'express';
import cookieParser from 'cookie-parser';
import { google } from 'googleapis';

const app = express();
app.use(cookieParser());

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const REDIRECT_URI = 'http://localhost:3000/callback';

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Step 1: Redirect user to Google login
app.get('/auth', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/drive.appdata'],
    prompt: 'consent'
  });
  res.redirect(url);
});

// Step 2: Handle OAuth callback
app.get('/callback', async (req, res) => {
  const { tokens } = await oauth2Client.getToken(req.query.code as string);

  if (tokens.refresh_token) {
    res.cookie('google_refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000  // 30 days
    });
  }

  res.redirect('/');
});

// Step 3: Endpoint for wallet's tokenProvider
app.get('/api/token', async (req, res) => {
  const refreshToken = req.cookies.google_refresh_token;
  if (!refreshToken)
    return res.status(401).json({ error: 'Not authenticated' });

  oauth2Client.setCredentials({ refresh_token: refreshToken });
  const { token } = await oauth2Client.getAccessToken();
  res.json({ accessToken: token });
});

app.get('/', (req, res) => {
  const isAuth = !!req.cookies.google_refresh_token;
  res.send(isAuth ? '<a href="/api/token">Login with Google</a>' : '<a href="/auth">Login with Google</a>');
});

app.listen(3000, () => console.log('http://localhost:3000'));
```

Then in your frontend, use the token provider with the wallet:

```typescript
import { createWaxFoundation } from '@hiveio/wax';
import { createExternalWallet } from '@hiveio/wax-signers-external';

const wax = await createWaxFoundation();

const tokenProvider = async () => {
  const res = await fetch('http://localhost:3000/api/token', { credentials: 'include' });
  const { accessToken } = await res.json();
  return accessToken;
};

const wallet = await createExternalWallet(
  wax,
  tokenProvider,
  async (missingStorageFile) => {
    const password = prompt(missingStorageFile ? 'Create wallet password:' : 'Enter wallet password:');
    return { password: password! };
  }
);

// Store a key
const content = await wallet.createForHiveKey('posting', 'myaccount', '5JPrivateKeyWIF...');

// Sign a transaction
const tx = await wax.createTransaction();
tx.pushOperation({
  vote: { voter: 'myaccount', author: 'author', permlink: 'post', weight: 10000 }
});
const signedTx = await tx.sign(content);

await wallet.close();
```

## Example Usage Flow

1. Enter OAuth token (from Playground or your OAuth implementation)
2. Set wallet encryption password
3. Click **Initialize Wallet**
4. Create/load Hive keys or custom keys
5. Sign transactions or encrypt/decrypt data

## Security Notes

- Wallet data is encrypted with your password before upload
- Keys are stored in Google Drive's `appDataFolder` (hidden, app-only access)
- Never expose `client_secret` in frontend code
- Store refresh tokens securely (encrypted, server-side)
- Consider caching `wallet.getEncryptionKeyWif()` for better UX

## Related

- [Package documentation](../../../ts/packages/signers-external/README.md)
- [@hiveio/wax](https://www.npmjs.com/package/@hiveio/wax)
