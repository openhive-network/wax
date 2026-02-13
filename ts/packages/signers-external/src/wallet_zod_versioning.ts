import { z } from 'zod';

import { WaxExternalSignatureProviderError } from "./errors.js";

// Define version constants
export const DATA_FORMAT_VERSIONS = {
  V1: '1.0.0',
  V2: '2.0.0',
  V3: '3.0.0',
} as const;

const ENCRYPTED_FORMAT_VERSIONS = {
  V1: '1.0.0-encrypted',
} as const;

/**
 * Current version of the wallet data format.
 * All new saved data will use this version
 */
export const WALLET_DATA_FORMAT_VERSION = DATA_FORMAT_VERSIONS.V3;

/**
 * Current version of the encrypted wallet wrapper format.
 * All new encrypted wallets will use this version
 */
export const ENCRYPTED_WALLET_FORMAT_VERSION = ENCRYPTED_FORMAT_VERSIONS.V1;

const strictDefinition = <T extends z.ZodRawShape>(shape: T) => {
  return z.object(shape).strict();
}


// Define the role type
//const RoleSchema = z.enum(['posting', 'active', 'owner', 'memo']);

// Base schemas
const KeyEntrySchema = strictDefinition({
  privateKey: z.string(),
  publicKey: z.string().optional(),
  description: z.string().optional() /// Optional description of given key, just to note its purpose
});

/// we can't use z.record because it enforces presence of all keys
const HiveRoleAssociativeArray = strictDefinition({
    posting: KeyEntrySchema.optional(),
    active: KeyEntrySchema.optional(),
    owner: KeyEntrySchema.optional(),
    memo: KeyEntrySchema.optional(),
  });

// V1/V2: Single-account hive authority
const HiveAuthorityCategory = strictDefinition({
  account: z.string(),
  roleDefinitions: HiveRoleAssociativeArray
});

// V3: Per-account data (roleDefinitions only, account name is the map key)
const HiveAccountData = strictDefinition({
  roleDefinitions: HiveRoleAssociativeArray
});

// V3: Multi-account hive authority (accounts keyed by name)
const HiveMultiAccountCategory = strictDefinition({
  accounts: z.record(z.string(), HiveAccountData)
});

// Version 1.0.0 schema - involves basic Hive roles and their data
const WalletDataV1Schema = strictDefinition({
  version: z.literal(DATA_FORMAT_VERSIONS.V1),
  hive: HiveAuthorityCategory
});

// Version 2.0.0 (with key storage for general purpose application/chain)
const WalletDataV2Schema = WalletDataV1Schema.extend({
  version: z.literal(DATA_FORMAT_VERSIONS.V2),
  generalPurposeKeys: z.record(z.string(), KeyEntrySchema).optional()
}).strict();

// Version 3.0.0 - multi-account support (accounts keyed by name)
const WalletDataV3Schema = strictDefinition({
  version: z.literal(DATA_FORMAT_VERSIONS.V3),
  hive: HiveMultiAccountCategory,
  generalPurposeKeys: z.record(z.string(), KeyEntrySchema).optional()
});

// Union of all versions
const WalletDataSchema = z.union([
  WalletDataV3Schema, // Try newest first
  WalletDataV2Schema,
  WalletDataV1Schema,
]);

// Encrypted wallet wrapper schema - V1
const EncryptedWalletV1Schema = strictDefinition({
  encrypted: z.literal(ENCRYPTED_FORMAT_VERSIONS.V1),
  encryptionMetadata: strictDefinition({
    hasAutoKey: z.boolean(), // Whether auto-key layer is present
    timestamp: z.number() // When the wallet was encrypted
  }),
  payload: z.string() // Base64-encoded encrypted wallet data
});

// Union of all encrypted versions
const EncryptedWalletSchema = z.union([
  EncryptedWalletV1Schema
]);

// Storage format can be either encrypted or plain wallet data
const StorageDataSchema = z.union([
  EncryptedWalletSchema,
  WalletDataSchema
]);

// TypeScript types inferred from Zod schemas
export type IWalletKeyEntry = z.infer<typeof KeyEntrySchema>;
export type IWalletHiveAuthorityCategory = z.infer<typeof HiveAuthorityCategory>;
export type IWalletHiveAccountData = z.infer<typeof HiveAccountData>;

export type IWalletDataV1 = z.infer<typeof WalletDataV1Schema>;
export type IWalletDataV2 = z.infer<typeof WalletDataV2Schema>;
export type IWalletDataV3 = z.infer<typeof WalletDataV3Schema>;

/**
 * Wallet data structure stored by ExternalSignatureProvider
 * This defines the format of data saved to storage providers
 */
export type IWalletData = z.infer<typeof WalletDataSchema>;

/**
 * Encrypted wallet wrapper format
 */
export type IEncryptedWalletV1 = z.infer<typeof EncryptedWalletV1Schema>;
export type IEncryptedWallet = z.infer<typeof EncryptedWalletSchema>;

/**
 * Storage format - can be either encrypted or plain wallet data
 */
export type IStorageData = z.infer<typeof StorageDataSchema>;

// Automatic version detection and parsing
export const parseWalletData = (data: unknown): IWalletData => {
  // Try V3 first (newest)
  const v3Result = WalletDataV3Schema.safeParse(data);
  if (v3Result.success)
    return v3Result.data;

  // Try V2
  const v2Result = WalletDataV2Schema.safeParse(data);
  if (v2Result.success)
    return v2Result.data;

  // Try V1
  const v1Result = WalletDataV1Schema.safeParse(data);
  if (v1Result.success)
    return v1Result.data;

  // If no version matches, throw detailed error
  const finalResult = WalletDataSchema.safeParse(data);
  if (!finalResult.success) {
    throw new WaxExternalSignatureProviderError(
      `Failed to parse wallet data: ${z.prettifyError(finalResult.error)}`
    );
  }

  throw new Error(`Unknown wallet data version. Got data: ${JSON.stringify(finalResult.data)}`);
}

/**
 * Migrates wallet data from any older version to V3 format.
 * V1 → V3: Converts single-account hive structure to multi-account map, adds empty generalPurposeKeys.
 * V2 → V3: Converts single-account hive structure to multi-account map, preserves generalPurposeKeys.
 */
export const migrateWalletData = (data: unknown): IWalletDataV3 => {
  const parsedData = parseWalletData(data);

  if (parsedData.version === DATA_FORMAT_VERSIONS.V3)
    return parsedData;

  // V1 or V2 — both have single-account hive structure
  const singleAccountData = parsedData as IWalletDataV1 | IWalletDataV2;
  const accounts: Record<string, IWalletHiveAccountData> = {};

  // Only add account entry if account name is non-empty
  if (singleAccountData.hive.account) {
    accounts[singleAccountData.hive.account] = {
      roleDefinitions: singleAccountData.hive.roleDefinitions
    };
  }

  const migratedData: IWalletDataV3 = {
    version: DATA_FORMAT_VERSIONS.V3,
    hive: { accounts },
    generalPurposeKeys: ('generalPurposeKeys' in singleAccountData
      ? singleAccountData.generalPurposeKeys
      : undefined) ?? {}
  };

  return migratedData;
}

/**
 * Parses storage data - handles both encrypted and plain formats
 * Returns an object indicating whether data is encrypted and the parsed content
 */
export const parseStorageData = (data: unknown): {
  isEncrypted: boolean;
  data: IEncryptedWallet | IWalletData
} => {
  // Try encrypted format first
  const encryptedResult = EncryptedWalletSchema.safeParse(data);
  if (encryptedResult.success) {
    return { isEncrypted: true, data: encryptedResult.data };
  }

  // Try plain wallet data
  const walletResult = WalletDataSchema.safeParse(data);
  if (walletResult.success) {
    return { isEncrypted: false, data: walletResult.data };
  }

  // If neither matches, throw detailed error
  const finalResult = StorageDataSchema.safeParse(data);
  if (!finalResult.success) {
    throw new WaxExternalSignatureProviderError(
      `Failed to parse storage data: ${z.prettifyError(finalResult.error)}`
    );
  }

  throw new Error(`Unknown storage data format. Got data: ${JSON.stringify(finalResult.data)}`);
}

/**
 * Checks if storage data is encrypted
 */
export const isEncryptedWallet = (data: unknown): boolean => {
  const encryptedResult = EncryptedWalletSchema.safeParse(data);
  return encryptedResult.success;
}

/**
 * Creates an empty wallet data structure in V3 format
 *
 * @returns Empty wallet data structure in V3 format
 */
export const createEmptyWalletData = (): IWalletDataV3 => {
  return {
    version: WALLET_DATA_FORMAT_VERSION,
    hive: {
      accounts: {}
    }
  };
};

/**
 * Updates wallet data with a new role key entry for a specific account
 * If the wallet file doesn't exist or is empty, creates a new wallet data structure
 * If the wallet exists, merges the new role while preserving other accounts and roles
 *
 * @param existingData - Existing wallet data (undefined if wallet doesn't exist)
 * @param accountName - The Hive account name
 * @param role - The role to update (posting, active, owner, memo)
 * @param privateKey - The private key for this role
 * @param publicKey - Optional public key (will be stored if provided)
 * @returns Updated wallet data structure
 */
export const updateWalletRole = (
  existingData: IWalletData | undefined,
  accountName: string,
  role: 'posting' | 'active' | 'owner' | 'memo',
  privateKey: string,
  publicKey?: string
): IWalletDataV3 => {
  const walletData: IWalletDataV3 = existingData
    ? migrateWalletData(existingData)
    : createEmptyWalletData();

  // Ensure account entry exists
  if (!walletData.hive.accounts[accountName])
    walletData.hive.accounts[accountName] = { roleDefinitions: {} };

  // Update the specific role
  walletData.hive.accounts[accountName].roleDefinitions[role] = {
    privateKey,
    ...(publicKey && { publicKey })
  };

  return walletData;
};

/**
 * Removes a role key entry from wallet data for a specific account
 *
 * @param existingData - Existing wallet data
 * @param accountName - The Hive account name
 * @param role - The role to remove (posting, active, owner, memo)
 * @returns Updated wallet data structure with the role removed
 */
export const removeWalletRole = (
  existingData: IWalletData,
  accountName: string,
  role: 'posting' | 'active' | 'owner' | 'memo'
): IWalletDataV3 => {
  const walletData = migrateWalletData(existingData);

  const accountData = walletData.hive.accounts[accountName];
  if (!accountData)
    return walletData;

  // Create new roleDefinitions without the specified role
  const { [role]: _removed, ...remainingRoles } = accountData.roleDefinitions;
  accountData.roleDefinitions = remainingRoles;

  // Remove account entry if no roles remain
  if (Object.keys(accountData.roleDefinitions).length === 0)
    delete walletData.hive.accounts[accountName];

  return walletData;
};
