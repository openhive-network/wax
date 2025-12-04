export { GoogleStorageProvider, type TokenProvider, GoogleDriveError } from "./storage-providers/google-storage-provider.js";
export type { IWalletData, IWalletKeyEntry, IWalletDataV1, IWalletDataV2, IWalletHiveAuthorityCategory } from "./wallet_zod_versioning.js";
export { parseWalletData, createEmptyWalletData, removeWalletRole, WALLET_DATA_FORMAT_VERSION } from "./wallet_zod_versioning.js";
export { WaxExternalSignatureProviderError } from "./errors.js";

export { createExternalWallet } from "./detailed/external-wallet.js";
export type { IExternalWallet, IExternalWalletContent, IExternalWalletHiveRoleKeyInfo, IExternalWalletCustomKeyInfo, IExternalWalletKeyInfo } from "./interfaces.js";
export type { TStorageEncryptionCredentials, TStoragePasswordProvider } from "./detailed/external-wallet.js";
