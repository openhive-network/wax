import { z } from 'zod';

import { WaxExternalSignatureProviderError } from "./errors.js";

// Define version constants
const DATA_FORMAT_VERSIONS = {
  V1: '1.0.0',
  V2: '2.0.0',
} as const;

const ENCRYPTED_FORMAT_VERSIONS = {
  V1: '1.0.0-encrypted',
} as const;

/**
 * Current version of the wallet data format.
 * All new saved data will use this version
 */
export const WALLET_DATA_FORMAT_VERSION = DATA_FORMAT_VERSIONS.V2;

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

const HiveAuthorityCategory = strictDefinition({
  account: z.string(),
  roleDefinitions: HiveRoleAssociativeArray
});

// Version 1.0.0 schema - involves basic Hive roles and their data
const WalletDataV1Schema = strictDefinition({
  version: z.literal(DATA_FORMAT_VERSIONS.V1),
  hive: HiveAuthorityCategory
});

// Future version example - Version 2.0.0 (with key storage for general purpose application/chain)
const WalletDataV2Schema = WalletDataV1Schema.extend({
  version: z.literal(DATA_FORMAT_VERSIONS.V2),
  generalPurposeKeys: z.record(z.string(), KeyEntrySchema).optional()
}).strict();

// Union of all versions
const WalletDataSchema = z.union([
  WalletDataV2Schema, // Try newest first
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

export type IWalletDataV1 = z.infer<typeof WalletDataV1Schema>;
export type IWalletDataV2 = z.infer<typeof WalletDataV2Schema>;

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
  // Try V2 first (newest)
  const v2Result = WalletDataV2Schema.safeParse(data);
  if (v2Result.success)
    return v2Result.data;

  // Try V1
  const v1Result = WalletDataV1Schema.safeParse(data);
  if (v1Result.success)
    return v1Result.data; /// TODO maybe try to do immediate migration to V2 format?

  // If no version matches, throw detailed error
  const finalResult = WalletDataSchema.safeParse(data);
  if (!finalResult.success) {
    throw new WaxExternalSignatureProviderError(
      /// TODO error msg seems to be broken somehow
      `Failed to parse wallet data: ${z.prettifyError(finalResult.error)}`
    );
  }

  throw new Error(`Unknown wallet data version. Got data: ${JSON.stringify(finalResult.data)}`);
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
 * Creates an empty wallet data structure in V2 format
 *
 * @param accountName - The Hive account name for the wallet
 * @returns Empty wallet data structure in V2 format
 */
export const createEmptyWalletData = (accountName: string): IWalletDataV2 => {
  return {
    version: WALLET_DATA_FORMAT_VERSION,
    hive: {
      account: accountName,
      roleDefinitions: {}
    }
  };
};

/**
 * Updates wallet data with a new role key entry
 * If the wallet file doesn't exist or is empty, creates a new wallet data structure
 * If the wallet exists, merges the new role while preserving other roles
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
): IWalletDataV2 => {
  const walletData: IWalletDataV2 = existingData
    ? (existingData.version === WALLET_DATA_FORMAT_VERSION
        ? existingData as IWalletDataV2
        : {
            version: WALLET_DATA_FORMAT_VERSION,
            hive: existingData.hive
          })
    : createEmptyWalletData(accountName);

  // Update the specific role
  walletData.hive.roleDefinitions[role] = {
    privateKey,
    ...(publicKey && { publicKey })
  };

  return walletData;
};

/**
 * Removes a role key entry from wallet data
 *
 * @param existingData - Existing wallet data
 * @param role - The role to remove (posting, active, owner, memo)
 * @returns Updated wallet data structure with the role removed
 */
export const removeWalletRole = (
  existingData: IWalletData,
  role: 'posting' | 'active' | 'owner' | 'memo'
): IWalletDataV2 => {
  const walletData: IWalletDataV2 = existingData.version === WALLET_DATA_FORMAT_VERSION
    ? { ...existingData as IWalletDataV2 }
    : {
        version: WALLET_DATA_FORMAT_VERSION,
        hive: { ...existingData.hive }
      };

  // Create new roleDefinitions without the specified role
  const { [role]: _removed, ...remainingRoles } = walletData.hive.roleDefinitions;
  walletData.hive.roleDefinitions = remainingRoles;

  return walletData;
};

// Usage example with type narrowing
export function processWalletData(rawData: unknown) {
  const result = parseWalletData(rawData);

  // TypeScript knows the shape based on discriminated union
  if (result.version === DATA_FORMAT_VERSIONS.V2) {
    // Access V2-specific fields
    console.log(`Wallet contains: ${Object.keys(result.generalPurposeKeys!).length} general purpose key definitions`);
    console.log(`Wallet contains Hive authority definition: ${result.hive}`);
  } else if (result.version === DATA_FORMAT_VERSIONS.V1) {
    // V1 data
    console.log(`Wallet contains only Hive authority definition: ${result.hive}`);
  }

  return result;
}

const negativeParse = (rawData: unknown) => {
try {
  parseWalletData(rawData);
}
catch(e) {
  console.log(`Error caught: `, e);
}
}

// Example usage:

const exampleV1 = {
  version: '1.0.0',
  hive: {
    account: "small.minion",
    roleDefinitions: {
      posting: { privateKey: 'xxx' },
//      active: [],
      //"owner": [],
      //"memo": []
    }
  }
};


const exampleV2: IWalletDataV2 = {
  version: '2.0.0',
  hive: exampleV1.hive,
  generalPurposeKeys: {}
};

const badExampleV1 = {
  version: '1.0.0',
  dupa: 10,
  hive: {
    account: "small.minion",
    roleDefinitions: {
      posting: { privateKey: 'xxx' },
//      active: [],
      //"owner": [],
      //"memo": []
    }
  }
};

const badExample = {
  version: '2.0.1',
  hive: exampleV1.hive
};

const badExample3 = {
  version: '1.0.0',
  hive: {
    account: "small.minion",
    generalPurposeKeys: {},
    roleDefinitions: {
      posting: [{ privateKey: 'xxx' }],
//      active: [],
      //"owner": [],
      //"memo": []
    }
  }
};

// Automatic version detection
const result1 = parseWalletData(exampleV1);
console.log(result1.version, JSON.stringify(result1.hive)); // 'v1'

const result2 = parseWalletData(exampleV2);
console.log(result2.version); // 'v2'

negativeParse(badExampleV1);
negativeParse(badExample3);
negativeParse(badExample);
