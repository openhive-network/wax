import { parseWalletData, DATA_FORMAT_VERSIONS, IWalletDataV2 } from "./wallet_zod_versioning.js";

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
