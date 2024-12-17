import { ChromiumBrowser, ConsoleMessage, chromium } from 'playwright';
import { expect } from '@playwright/test';

import { test } from '../assets/jest-helper';
import { numToHighLow, transaction, serialization_sensitive_transaction, witness_properties, vote_operation, required_authorities_transaction, transfer_operation, posting_authority_transaction, posting_delegated_authority_transaction, singleNestLevelAuthorityDelegationTransaction } from "../assets/data.protocol";
import { binary_data_node, json_price, VectorBinaryDataNode } from '../../dist/lib/wax_module';
import { binaryDataHf26Transfer, binaryDataHf26TransferOperation, binaryDataHf26Vote, binaryDataLegacyTransfer, binaryDataLegacyTransferOperation } from '../assets/data.binary';
import { wax_authority } from '../../dist/lib/build_wasm/wax.common';

let browser!: ChromiumBrowser;

let privateKey!: string;

const parseBinaryChildren = (data: VectorBinaryDataNode) => {
  const offsets: Array<Omit<binary_data_node, 'length' | 'children'> & { length?: number; children?: binary_data_node[]; }> = [];

  for(let i = 0; i < data.size(); ++i) {
    const node = data.get(i) as binary_data_node;

    offsets.push({
      key: node.key as string,
      type: node.type as string,
      offset: node.offset,
      size: node.size,
      value: node.value as string,
      length: node.type === "array" ? node.length : undefined,
      children: node.type === "scalar" ? undefined : parseBinaryChildren(node.children) as any
    });
  }

  return offsets;
};

test.describe('WASM Protocol', () => {
  test.beforeAll(async () => {
    browser = await chromium.launch({
      headless: true
    });
  });

  test.beforeEach(async({ page }) => {
    page.on('console', (msg: ConsoleMessage) => {
      console.log('>>', msg.type(), msg.text())
    });

    await page.goto("http://localhost:8080/wasm/__tests__/assets/test.html", { waitUntil: "load" });
  });

  test('Should be able to get authority trace for direct sign', async ({ wasmTest }) => {
    const signatureDecodedPublicKeys = ['STM7UEziXTT9CMCTLvSpWsS974XiYCGSb9jP3ycriAXFFoQVWxzZK'];

    const retVal = await wasmTest(({ provider, protocol }, posting_authority_transaction, signatureDecodedPublicKeys) => {
      const pubKeysVector = new provider.VectorString();

      for(const key of signatureDecodedPublicKeys)
        pubKeysVector.push_back(key);

      const keysMap = new provider.MapStringUInt16();
      keysMap.set('STM7UEziXTT9CMCTLvSpWsS974XiYCGSb9jP3ycriAXFFoQVWxzZK', 1);

      const accountsMap = new provider.MapStringUInt16();
      accountsMap.set('gtg', 1);

      const expectedWitnessKey = 'STM7UEziXTT9CMCTLvSpWsS974XiYCGSb9jP3ycriAXFFoQVWxzZK';

      const expectedOwner: wax_authority = { weight_threshold: 10, account_auths: accountsMap, key_auths: keysMap };
      const expectedActive: wax_authority = { weight_threshold: 5, account_auths: accountsMap, key_auths: keysMap };
      const expectedPosting: wax_authority = { weight_threshold: 1, account_auths: accountsMap, key_auths: keysMap };

      class MyImplementation {
        getAuthority (account: string, role: string): wax_authority {
          console.log(`Querying for authority role: ${role} of account: ${account}`);

          if (role === 'owner')
            return expectedOwner;

          if (role === 'active')
            return expectedActive;

          return expectedPosting;
        }

        getWitnessPublicKey (account: string): string {
          console.log(`Querying for witness: ${account} signing key`);

          return expectedWitnessKey;
        }
      }

      const impl = provider.IAccountAuthorityProvider.implement(new MyImplementation());

      const reqAuths = protocol.cpp_collect_transaction_required_authorities(posting_authority_transaction);

      const trace = protocol.cpp_trace_authority_verification(reqAuths, pubKeysVector, impl)

      console.log(JSON.stringify([expectedOwner, expectedActive, expectedPosting]));

      const transformVectorToArray = (vector: any) => new Array(vector.size()).fill(0).map((_, i) => vector.get(i));

      return {
        ...trace,
        final_authority_path: transformVectorToArray(trace.final_authority_path),
        root: {
          ...trace.root,
          visited_entries: transformVectorToArray(trace.root.visited_entries)
        }
      }
    }, posting_authority_transaction, signatureDecodedPublicKeys);

    expect(retVal).toStrictEqual({
      "final_authority_path": [
        {
          "flags": 0,
          "processed_entry": "andablackwidow",
          "processed_role": "posting",
          "recursion_depth": 0,
          "threshold": 1,
          "visited_entries": {},
          "weight": 0
        }
      ],
      "root": {
        "flags": 0,
        "processed_entry": "andablackwidow",
        "processed_role": "posting",
        "recursion_depth": 0,
        "threshold": 1,
        "visited_entries": [],
        "weight": 0
      },
      "verification_status": 0
    });
  });

  test('Should be able to get authority trace for delegated sign', async ({ wasmTest }) => {
    const signatureDecodedPublicKeys = ['STM8WWUYHMdHLgEHidYCztswzfZCViA16EqGkAxt7RG4dWwDpFtCF'];

    const retVal = await wasmTest(({ provider, protocol }, posting_delegated_authority_transaction, signatureDecodedPublicKeys) => {
      const pubKeysVector = new provider.VectorString();

      for(const key of signatureDecodedPublicKeys)
        pubKeysVector.push_back(key);

      const tattooworldKeysMap = new provider.MapStringUInt16();
      tattooworldKeysMap.set('STM5txaAE5dF7JCJPtrEJbiLSi831jZrXgfZhj4PVHqGHvu7C3FWt', 1);

      const tattooworldAccountsMap = new provider.MapStringUInt16();
      tattooworldAccountsMap.set('ecency.app', 1);
      tattooworldAccountsMap.set('peakd.app', 1);
      tattooworldAccountsMap.set('leofinance', 1);
      tattooworldAccountsMap.set('threespeak', 1);
      tattooworldAccountsMap.set('steemauto', 1);

      const leofinanceKeysMap = new provider.MapStringUInt16();
      leofinanceKeysMap.set('STM57hDwzvNYEYfL4wLj9REhaRgiNxdFt232SxVzPwZYPqiH2ZfNW', 1);

      const leofinanceAccountsMap = new provider.MapStringUInt16();
      leofinanceAccountsMap.set('hivesigner', 1);
      leofinanceAccountsMap.set('steem.leo', 1);
      leofinanceAccountsMap.set('peakd.app', 1);
      leofinanceAccountsMap.set('leofinance', 1);
      leofinanceAccountsMap.set('threespeak', 1);
      leofinanceAccountsMap.set('steemauto', 1);

      const steemautoKeysMap = new provider.MapStringUInt16();
      steemautoKeysMap.set('STM8WWUYHMdHLgEHidYCztswzfZCViA16EqGkAxt7RG4dWwDpFtCF', 1);

      const steemautoAccountsMap = new provider.MapStringUInt16();
      steemautoAccountsMap.set('steemauto', 1);

      const expectedWitnessKey = 'STM7UEziXTT9CMCTLvSpWsS974XiYCGSb9jP3ycriAXFFoQVWxzZK';

      const expectedTattooworldPosting: wax_authority = { weight_threshold: 1, account_auths: tattooworldAccountsMap, key_auths: tattooworldKeysMap };
      const expectedLeofinancePosting: wax_authority = { weight_threshold: 1, account_auths: leofinanceAccountsMap, key_auths: leofinanceKeysMap };
      const expectedSteemautoPosting: wax_authority = { weight_threshold: 1, account_auths: steemautoAccountsMap, key_auths: steemautoKeysMap };

      const randomAuthority: wax_authority = { weight_threshold: 1, account_auths: new provider.MapStringUInt16(), key_auths: new provider.MapStringUInt16() };

      class MyImplementation {
        getAuthority (account: string, role: string): wax_authority {
          console.log(`Querying for authority role: ${role} of account: ${account}`);

          if (account === 'tattooworld')
            return expectedTattooworldPosting;

          if (account === 'leofinance')
            return expectedLeofinancePosting;

          if (account === 'steemauto')
            return expectedSteemautoPosting

          return randomAuthority;
        }

        getWitnessPublicKey (account: string): string {
          console.log(`Querying for witness: ${account} signing key`);

          return expectedWitnessKey;
        }
      }

      const impl = provider.IAccountAuthorityProvider.implement(new MyImplementation());

      const reqAuths = protocol.cpp_collect_transaction_required_authorities(posting_delegated_authority_transaction);

      const trace = protocol.cpp_trace_authority_verification(reqAuths, pubKeysVector, impl)

      const transformVectorToArray = (vector: any) => new Array(vector.size()).fill(0).map((_, i) => vector.get(i));

      return {
        ...trace,
        final_authority_path: transformVectorToArray(trace.final_authority_path),
        root: {
          ...trace.root,
          visited_entries: transformVectorToArray(trace.root.visited_entries)
        }
      }
    }, posting_delegated_authority_transaction, signatureDecodedPublicKeys);

    expect(retVal).toStrictEqual({
      "final_authority_path": [
        {
          "flags": 0,
          "processed_entry": "tattooworld",
          "processed_role": "posting",
          "recursion_depth": 0,
          "threshold": 1,
          "visited_entries": {},
          "weight": 0
        },
        {
          "flags": 0,
          "processed_entry": "leofinance",
          "processed_role": "posting",
          "recursion_depth": 1,
          "threshold": 1,
          "visited_entries": {},
          "weight": 1
        },
        {
          "flags": 0,
          "processed_entry": "steemauto",
          "processed_role": "posting",
          "recursion_depth": 2,
          "threshold": 1,
          "visited_entries": {},
          "weight": 1
        }
      ],
      "root": {
        "flags": 0,
        "processed_entry": "tattooworld",
        "processed_role": "posting",
        "recursion_depth": 0,
        "threshold": 1,
        "visited_entries": [],
        "weight": 0
      },
      "verification_status": 0
    });
  });

  test('Should be able to get authority trace for delegated sign with single nest level', async ({ wasmTest }) => {
    const signatureDecodedPublicKeys = ['STM8WWUYHMdHLgEHidYCztswzfZCViA16EqGkAxt7RG4dWwDpFtCF'];

    const retVal = await wasmTest(({ provider, protocol }, singleNestLevelAuthorityDelegationTransaction, signatureDecodedPublicKeys) => {
      const pubKeysVector = new provider.VectorString();

      for(const key of signatureDecodedPublicKeys)
        pubKeysVector.push_back(key);

      const sunnyvoKeysMap = new provider.MapStringUInt16();
      sunnyvoKeysMap.set('STM8jRobEtRCFUXmNXuf46RsomxHQoPase9KXZf1QjPcXSUH7MQrD', 1);

      const sunnyvoAccountsMap = new provider.MapStringUInt16();
      sunnyvoAccountsMap.set('ecency.app', 1);
      sunnyvoAccountsMap.set('hive.blog', 1);
      sunnyvoAccountsMap.set('threespeak', 1);
      sunnyvoAccountsMap.set('steemauto', 1);

      const steemautoKeysMap = new provider.MapStringUInt16();
      steemautoKeysMap.set('STM8WWUYHMdHLgEHidYCztswzfZCViA16EqGkAxt7RG4dWwDpFtCF', 1);

      const steemautoAccountsMap = new provider.MapStringUInt16();
      steemautoAccountsMap.set('steemauto', 1);

      const expectedWitnessKey = 'STM7UEziXTT9CMCTLvSpWsS974XiYCGSb9jP3ycriAXFFoQVWxzZK';

      const expectedSunnyvoPosting: wax_authority = { weight_threshold: 1, account_auths: sunnyvoAccountsMap, key_auths: sunnyvoKeysMap };
      const expectedSteemautoPosting: wax_authority = { weight_threshold: 1, account_auths: steemautoAccountsMap, key_auths: steemautoKeysMap };

      const randomAuthority: wax_authority = { weight_threshold: 1, account_auths: new provider.MapStringUInt16(), key_auths: new provider.MapStringUInt16() };

      class MyImplementation {
        getAuthority (account: string, role: string): wax_authority {
          console.log(`Querying for authority role: ${role} of account: ${account}`);

          if (account === 'sunnyvo')
            return expectedSunnyvoPosting;

          if (account === 'steemauto')
            return expectedSteemautoPosting

          return randomAuthority;
        }

        getWitnessPublicKey (account: string): string {
          console.log(`Querying for witness: ${account} signing key`);

          return expectedWitnessKey;
        }
      }

      const impl = provider.IAccountAuthorityProvider.implement(new MyImplementation());

      const reqAuths = protocol.cpp_collect_transaction_required_authorities(singleNestLevelAuthorityDelegationTransaction);

      const trace = protocol.cpp_trace_authority_verification(reqAuths, pubKeysVector, impl)

      const transformVectorToArray = (vector: any) => new Array(vector.size()).fill(0).map((_, i) => vector.get(i));

      return {
        ...trace,
        final_authority_path: transformVectorToArray(trace.final_authority_path),
        root: {
          ...trace.root,
          visited_entries: transformVectorToArray(trace.root.visited_entries)
        }
      }
    }, singleNestLevelAuthorityDelegationTransaction, signatureDecodedPublicKeys);

    expect(retVal).toStrictEqual({
      "final_authority_path": [
        {
          "flags": 0,
          "processed_entry": "sunnyvo",
          "processed_role": "posting",
          "recursion_depth": 0,
          "threshold": 1,
          "visited_entries": {},
          "weight": 0
        },
        {
          "flags": 0,
          "processed_entry": "steemauto",
          "processed_role": "posting",
          "recursion_depth": 1,
          "threshold": 1,
          "visited_entries": {},
          "weight": 1
        }
      ],
      "root": {
        "flags": 0,
        "processed_entry": "sunnyvo",
        "processed_role": "posting",
        "recursion_depth": 0,
        "threshold": 1,
        "visited_entries": [],
        "weight": 0
      },
      "verification_status": 0
    });
  });

  test('Should be able to generate random private key', async ({ wasmTest }) => {
    const retVal = await wasmTest.dynamic(({ protocol }) => {
      return protocol.cpp_generate_private_key();
    });

    expect(retVal.exception_message).toHaveLength(0);

    privateKey = retVal.content as string;
  });
  test('Should be able to generate binary metadata information - tx with vote operation', async ({ wasmTest }) => {
    const retVal = await wasmTest.dynamic(({ protocol }, transaction, parseChildrenFn) => {
      const values = protocol.cpp_generate_binary_transaction_metadata(transaction, true);

      const parseBinaryChildren = eval(parseChildrenFn);

      return {
        binary: values.binary,
        offsets: parseBinaryChildren(values.offsets)
      }
    }, required_authorities_transaction, parseBinaryChildren.toString());

    expect(retVal.binary).toBe('3c4b51ee947fd5fada5701000a74616f746568313232310a6f7a63686172746172747f757364737465656d2d6274632d6461696c792d706f6c6f6e6965782d626974747265782d746563686e6963616c2d616e616c797369732d6d61726b65742d7265706f72742d7570646174652d34362d676c6173732d68616c662d66756c6c2d6275742d7468652d626f74746c652d732d6c6566742d656d7074792d736570741027010001202bd7ff67ba97db6b5fecb389ca279e0c98db9a49fd9f49acea63ea523ed35ac602933e9bbb0916b6ee137b5550cbe1ae4594c52a27d1505b1adb53f8b37d3fb3');
    expect(retVal.offsets).toStrictEqual(binaryDataHf26Vote);
  });
  test('Should be able to generate binary metadata information using hf26 pack type - tx with transfer', async ({ wasmTest }) => {
    const retVal = await wasmTest.dynamic(({ protocol }, transaction, parseChildrenFn) => {
      const values = protocol.cpp_generate_binary_transaction_metadata(transaction, true);

      const parseBinaryChildren = eval(parseChildrenFn);

      return {
        binary: values.binary,
        offsets: parseBinaryChildren(values.offsets)
      }
    }, serialization_sensitive_transaction, parseBinaryChildren.toString());

    expect(retVal.binary).toBe('a70783341cd8b4564d650102086f6e65706c7573370b6b727970746f67616d6573e0930400000000002320bcbe1b526f6c6c20756e64657220353020346434333462643934333631360000');
    expect(retVal.offsets).toStrictEqual(binaryDataHf26Transfer);
  });

  test('Should be able to generate binary metadata information using legacy pack type - tx with transfer', async ({ wasmTest }) => {
    const retVal = await wasmTest.dynamic(({ protocol }, transaction, parseChildrenFn) => {
      const values = protocol.cpp_generate_binary_transaction_metadata(transaction, false);

      const parseBinaryChildren = eval(parseChildrenFn);

      return {
        binary: values.binary,
        offsets: parseBinaryChildren(values.offsets)
      }
    }, serialization_sensitive_transaction, parseBinaryChildren.toString());

    expect(retVal.binary).toBe('a70783341cd8b4564d650102086f6e65706c7573370b6b727970746f67616d6573e09304000000000003535445454d00001b526f6c6c20756e64657220353020346434333462643934333631360000');
    expect(retVal.offsets).toStrictEqual(binaryDataLegacyTransfer);
  });
  test('Should be able to generate binary metadata information using hf26 pack type - single transfer operation', async ({ wasmTest }) => {
    const retVal = await wasmTest.dynamic(({ protocol }, operation, parseChildrenFn) => {
      const values = protocol.cpp_generate_binary_operation_metadata(JSON.stringify(operation), true);

      const parseBinaryChildren = eval(parseChildrenFn);

      return {
        binary: values.binary,
        offsets: parseBinaryChildren(values.offsets)
      }
    }, transfer_operation, parseBinaryChildren.toString());

    expect(retVal.binary).toBe('02086f6e65706c7573370b6b727970746f67616d6573e0930400000000002320bcbe1b526f6c6c20756e6465722035302034643433346264393433363136');
    expect(retVal.offsets).toStrictEqual(binaryDataHf26TransferOperation);
  });

  test('Should be able to generate binary metadata information using legacy pack type - single transfer operation', async ({ wasmTest }) => {
    const retVal = await wasmTest.dynamic(({ protocol }, operation, parseChildrenFn) => {
      const values = protocol.cpp_generate_binary_operation_metadata(JSON.stringify(operation), false);

      const parseBinaryChildren = eval(parseChildrenFn);

      return {
        binary: values.binary,
        offsets: parseBinaryChildren(values.offsets)
      }
    }, transfer_operation, parseBinaryChildren.toString());

    expect(retVal.binary).toBe('02086f6e65706c7573370b6b727970746f67616d6573e09304000000000003535445454d00001b526f6c6c20756e6465722035302034643433346264393433363136');
    expect(retVal.offsets).toStrictEqual(binaryDataLegacyTransferOperation);
  });

  test('Should be able to generate random private key using password', async ({ wasmTest }) => {
    const retVal = await wasmTest(({ protocol }) => {
      return protocol.cpp_generate_private_key_password_based("gtg", "active", "verysecurepassword");
    });

    expect(retVal.associated_public_key).toBe("STM6JswFatSixhR9AMUP38rtpMVAagTvxGYu7d8i2JUK1QZDkPbH3");
    expect(retVal.wif_private_key).toBe("5J89tdX8b1wQJHcqDMDVn1UwvtiYFK53PQEgG5gL5oCEk83Us12");
  });

  test('Should be able to suggest brain key', async ({ wasmTest }) => {
    const retVal = await wasmTest.dynamic(({ protocol }) => {
      return protocol.cpp_suggest_brain_key();
    });

    expect(retVal.associated_public_key).toHaveLength(53);
    expect((retVal.brain_key as string).length).toBeGreaterThan(0);
    expect(retVal.wif_private_key).toHaveLength(51);
  });

  test('Should be able to calculate public key', async ({ wasmTest }) => {
    const retVal = await wasmTest(({ protocol }, privateKey) => {
      return protocol.cpp_calculate_public_key(privateKey);
    }, privateKey);

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.content).toMatch(/^[1-9A-HJ-NP-Za-km-z]+$/m);
  });

  test('Should be able to calculate the transaction id', async ({ wasmTest }) => {
    const retVal = await wasmTest(({ protocol }, transaction) => {
      return protocol.cpp_calculate_transaction_id(transaction);
    }, transaction);

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.content).toBe("da8ca54c9c3acad06915ae9d93988c367f5cd164");
  });

  test('Should be able to calculate the legacy transaction id of the serialization sensitive transaction', async ({ wasmTest }) => {
    const retVal = await wasmTest(({ protocol }, serialization_sensitive_transaction) => {
      return protocol.cpp_calculate_legacy_transaction_id(serialization_sensitive_transaction);
    }, serialization_sensitive_transaction);

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.content).toBe("7f34699e9eea49d1bcc10c88f96e38897839ece3"); /// See Hive mainnet block 80021416
  });

  test('Should be able to calculate the HF26 transaction id of the serialization sensitive transaction', async ({ wasmTest }) => {
    const retVal = await wasmTest(({ protocol }, serialization_sensitive_transaction) => {
      return protocol.cpp_calculate_transaction_id(serialization_sensitive_transaction);
    }, serialization_sensitive_transaction);

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.content).toBe("3725c81634f152011e2043eb7119911b953d4267"); /// See Hive mainnet block 80021416
  });

  test('Should be able to serialize the transaction', async ({ wasmTest }) => {
    const retVal = await wasmTest(({ protocol }, transaction) => {
      return protocol.cpp_serialize_transaction(transaction);
    }, transaction);

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.content).toBe("ff86c404c24b152fb7610100046f746f6d076330666633336108657778686e6a626a98080000");
  });

  test('Should be able to calculate sig digest of the transaction', async ({ wasmTest }) => {
    const retVal = await wasmTest(({ protocol }, transaction) => {
      return protocol.cpp_calculate_sig_digest(transaction, "beeab0de00000000000000000000000000000000000000000000000000000000");
    }, transaction);

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.content).toBe("1394412814ea3e444f65c46f075e15b9b82e6bea9241319b02743a8e593219e1");
  });

  test('Should be able to calculate legacy sig digest of the transaction', async ({ wasmTest }) => {
    const retVal = await wasmTest(({ protocol }, serialization_sensitive_transaction) => {
      return protocol.cpp_calculate_legacy_sig_digest(serialization_sensitive_transaction, "beeab0de00000000000000000000000000000000000000000000000000000000");
    }, serialization_sensitive_transaction);

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.content).toBe("7fbd09ff2c3a90acfc59adce5abffdaa3fc95e33160c5ac237f0f4366f90e2fe");
  });

  test('Should be able to get required authorities for the transaction', async ({ wasmTest }) => {
    const serializedRequiredAuthorities = await wasmTest(({ protocol }, required_authorities_transaction) => {
      const reqAuths = protocol.cpp_collect_transaction_required_authorities(required_authorities_transaction);

      const postingSize = reqAuths.posting_accounts.size();
      const ownerSize = reqAuths.owner_accounts.size();
      const activeSize = reqAuths.active_accounts.size();
      const otherSize = reqAuths.other_authorities.size();

      const reqPostingAuth = reqAuths.posting_accounts.get(0);

      return {
        postingSize,
        ownerSize,
        activeSize,
        otherSize,
        reqPostingAuth
      };
    }, required_authorities_transaction);

    const { postingSize, ownerSize, activeSize, otherSize, reqPostingAuth } = serializedRequiredAuthorities;

    expect(postingSize).toBe(1);
    expect(ownerSize).toBe(0);
    expect(activeSize).toBe(0);
    expect(otherSize).toBe(0);

    expect(reqPostingAuth).toBe('taoteh1221');
  });

  test('Should be able to get hive::protocol config', async ({ wasmTest }) => {
    const hiveProtocolConfig = await wasmTest(({ protocol }) => {
      const hiveProtocolConfig = protocol.cpp_get_hive_protocol_config("beeab0de00000000000000000000000000000000000000000000000000000000");

      const hiveProtocolConfigKeys = hiveProtocolConfig.keys();

      const keys: string[] = [];
      for (let i = 0; i < hiveProtocolConfigKeys.size(); ++i)
        keys.push(hiveProtocolConfigKeys.get(i) as string);

      const retValue: Record<string, string> = {};

      for (const key of keys)
        retValue[key] = hiveProtocolConfig.get(key) as string;

      return retValue;
    });

    expect(hiveProtocolConfig.HBD_SYMBOL).toBe("@@000000013");
    expect(hiveProtocolConfig.HIVE_DEFAULT_ACCOUNT_SUBSIDY_DECAY).toBe("347321");
    expect(hiveProtocolConfig.HIVE_INIT_PUBLIC_KEY).toBe("STM8GC13uCZbP44HzMLV6zPZGwVQ8Nt4Kji8PapsPiNq1BK153XTX");
  });

  test('Should be able to validate example operation', async ({ wasmTest }) => {
    const retVal = await wasmTest(({ protocol }, operation) => {
      return protocol.cpp_validate_operation(operation);
    }, JSON.stringify(vote_operation));

    expect(retVal.exception_message).toHaveLength(0);
  });

  test('Should be able to get impacted accounts from example operation', async ({ wasmTest }) => {
    const retVal = await wasmTest(({ protocol }, operation) => {
      const vector = protocol.cpp_operation_get_impacted_accounts(operation);

      // Convert VectorString to JS-array
      return new Array(vector.size()).fill("").map((_, i) => vector.get(i));
    }, JSON.stringify(vote_operation));

    expect(retVal).toStrictEqual(["c0ff33a", "otom"]);
  });

  test('Should be able to get impacted accounts from example transaction', async ({ wasmTest }) => {
    const retVal = await wasmTest(({ protocol }, transaction) => {
      const vector = protocol.cpp_transaction_get_impacted_accounts(transaction);

      // Convert VectorString to JS-array
      return new Array(vector.size()).fill("").map((_, i) => vector.get(i));
    }, transaction);

    expect(retVal).toStrictEqual(["c0ff33a", "otom"]);
  });

  test('Should be able to validate example transaction', async ({ wasmTest }) => {
    const retVal = await wasmTest(({ protocol }, transaction) => {
      return protocol.cpp_validate_transaction(transaction);
    }, transaction);

    expect(retVal.exception_message).toHaveLength(0);
  });

  test('Should be able to calculate manabar full regeneration time', async ({ wasmTest }) => {
    const retVal = await wasmTest(({ protocol }, ...args) => {
      return protocol.cpp_calculate_manabar_full_regeneration_time(...args);
    }, 0, ...numToHighLow(100), ...numToHighLow(100), 0);

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.content).toBe("0");
  });

  test('Should be able to calculate manabar full regeneration time (relaxed)', async ({ wasmTest }) => {
    const retVal = await wasmTest(({ protocol }, ...args) => {
      return protocol.cpp_calculate_manabar_full_regeneration_time(...args);
    }, 0, ...numToHighLow(100), ...numToHighLow(100), 10);

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.content).toBe("10");
  });

  test('Should be able to calculate the current manabar value', async ({ wasmTest }) => {
    const retVal = await wasmTest(({ protocol }, ...args) => {
      return protocol.cpp_calculate_current_manabar_value(...args);
    }, 0, ...numToHighLow(100), ...numToHighLow(100), 0);

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.content).toBe("100");
  });

  test('Should be able to calculate the current manabar value (relaxed)', async ({ wasmTest }) => {
    const retVal = await wasmTest(({ protocol }, ...args) => {
      return protocol.cpp_calculate_current_manabar_value(...args);
    }, 0, ...numToHighLow(100), ...numToHighLow(100), 10);

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.content).toBe("100");
  });

  test('Should be able to create Hive in NAI form', async ({ wasmTest }) => {
    const retVal = await wasmTest(({ protocol }, ...args) => {
      return protocol.cpp_hive(...args);
    }, ...numToHighLow(10));

    expect(retVal).toEqual({
      nai: "@@000000021",
      precision: 3,
      amount: "10"
    });
  });

  test('Should be able to create Hive in NAI form - large integer', async ({ wasmTest }) => {
    const retVal = await wasmTest(({ protocol }, ...args) => {
      return protocol.cpp_hive(...args);
    }, ...numToHighLow(10000000000));

    expect(retVal).toEqual({
      nai: "@@000000021",
      precision: 3,
      amount: "10000000000"
    });
  });

  test('Should be able to create HBD in NAI form', async ({ wasmTest }) => {
    const retVal = await wasmTest(({ protocol }, ...args) => {
      return protocol.cpp_hbd(...args);
    }, ...numToHighLow(Number.MAX_SAFE_INTEGER + 1));

    expect(retVal).toEqual({
      nai: "@@000000013",
      precision: 3,
      amount: `${Number.MAX_SAFE_INTEGER + 1}`
    });
  });

  test('Should be able to create VESTS in NAI form', async ({ wasmTest }) => {
    const retVal = await wasmTest(({ protocol }, ...args) => {
      return protocol.cpp_vests(...args);
    }, ...numToHighLow(Number.MIN_SAFE_INTEGER));

    expect(retVal).toEqual({
      nai: "@@000000037",
      precision: 6,
      amount: `${Number.MIN_SAFE_INTEGER}`
    });
  });

  test('Should be able to create custom general asset in NAI form', async ({ wasmTest }) => {
    const retVal = await wasmTest(({ protocol }, ...args) => {
      return protocol.cpp_general_asset(3200000035, ...args);
    }, ...numToHighLow(10));

    expect(retVal).toEqual({
      nai: "@@000000021",
      precision: 3,
      amount: "10"
    });
  });

  test('Should be able to calculate HP APR 1', async ({ wasmTest }) => {
    const retVal = await wasmTest(({ protocol }, ...args) => {
      const virtual_supply = protocol.cpp_hive(args[2], args[3]);
      const total_vesting_fund_hive = protocol.cpp_hive(args[4], args[5]);
      return protocol.cpp_calculate_hp_apr(args[0], args[1], virtual_supply, total_vesting_fund_hive);
    }, 1_000_000, 1_500, ...numToHighLow(530_656_835_180), ...numToHighLow(173_009_633_181));

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.content).toEqual("4.48");
  });

  test('Should be able to calculate HP APR 2', async ({ wasmTest }) => {
    const retVal = await wasmTest(({ protocol }, ...args) => {
      const virtual_supply = protocol.cpp_hive(args[2], args[3]);
      const total_vesting_fund_hive = protocol.cpp_hive(args[4], args[5]);
      return protocol.cpp_calculate_hp_apr(args[0], args[1], virtual_supply, total_vesting_fund_hive);
    }, 82_779_364, 1_500, ...numToHighLow(530_656_835_180), ...numToHighLow(173_009_633_181));

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.content).toEqual("2.97");
  });

  test('Should be able to calculate account hp 1', async ({ wasmTest }) => {
    const retVal = await wasmTest(({ protocol }, ...args) => {
      const vests = protocol.cpp_vests(args[0], args[1]);
      const total_vesting_fund_hive = protocol.cpp_hive(args[2], args[3]);
      const total_vesting_shares = protocol.cpp_vests(args[4], args[5]);
      return protocol.cpp_calculate_account_hp(vests, total_vesting_fund_hive, total_vesting_shares);
    }, ...numToHighLow(1_100_000_000), ...numToHighLow(100_000), ...numToHighLow(100_000_000_000));

    expect(retVal).toEqual({
      nai: "@@000000021",
      precision: 3,
      amount: "1100"
    });
  });

  test('Should be able to calculate account hp 2', async ({ wasmTest }) => {
    const retVal = await wasmTest(({ protocol }, ...args) => {
      const vests = protocol.cpp_vests(args[0], args[1]);
      const total_vesting_fund_hive = protocol.cpp_hive(args[2], args[3]);
      const total_vesting_shares = protocol.cpp_vests(args[4], args[5]);
      return protocol.cpp_calculate_account_hp(vests, total_vesting_fund_hive, total_vesting_shares);
    }, ...numToHighLow(2_268_225_009_295_472), ...numToHighLow(173_009_633_181), ...numToHighLow("300729442281783339"));

    expect(retVal).toEqual({
      nai: "@@000000021",
      precision: 3,
      amount: "1304909734"
    });
  });

  test('Should be able to calculate witness votes hp 1', async ({ wasmTest }) => {
    const retVal = await wasmTest(({ protocol }, ...args) => {
      const total_vesting_fund_hive = protocol.cpp_hive(args[2], args[3]);
      const total_vesting_shares = protocol.cpp_vests(args[4], args[5]);
      return protocol.cpp_calculate_witness_votes_hp(args[0], args[1], total_vesting_fund_hive, total_vesting_shares);
    }, ...numToHighLow(1_100_000_000), ...numToHighLow(100_000), ...numToHighLow(100_000_000_000));

    expect(retVal).toEqual({
      nai: "@@000000021",
      precision: 3,
      amount: "1100"
    });
  });

  test('Should be able to calculate witness votes hp 2', async ({ wasmTest }) => {
    const retVal = await wasmTest(({ protocol }, ...args) => {
      const total_vesting_fund_hive = protocol.cpp_hive(args[2], args[3]);
      const total_vesting_shares = protocol.cpp_vests(args[4], args[5]);
      return protocol.cpp_calculate_witness_votes_hp(args[0], args[1], total_vesting_fund_hive, total_vesting_shares);
    }, ...numToHighLow("142103996686715320"), ...numToHighLow(173_009_633_181), ...numToHighLow("300729442281783339"));

    expect(retVal).toEqual({
      nai: "@@000000021",
      precision: 3,
      amount: "81752422223"
    });
  });

  test('Should be able to calculate inflation rate for block 1_000_000', async ({ wasmTest }) => {
    const retVal = await wasmTest(({ protocol }, block_num) => {
      return protocol.cpp_calculate_inflation_rate_for_block(block_num);
    }, 1_000_000);

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.content).toBe("974");
  });

  test('Should be able to calculate inflation rate for block 7_000_000', async ({ wasmTest }) => {
    const retVal = await wasmTest(({ protocol }, block_num) => {
      return protocol.cpp_calculate_inflation_rate_for_block(block_num);
    }, 7_000_000);

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.content).toBe("950");
  });

  test('Should be able to calculate inflation rate for block 9_000_000', async ({ wasmTest }) => {
    const retVal = await wasmTest(({ protocol }, block_num) => {
      return protocol.cpp_calculate_inflation_rate_for_block(block_num);
    }, 9_000_000);

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.content).toBe("942");
  });

  test('Should be able to serialize witness properties and retrieve serialized data', async ({ wasmTest }) => {
    const retVal = await wasmTest(({ protocol }, witness_properties) => {
      const propsSerialized = protocol.cpp_serialize_witness_set_properties(witness_properties);

      const propsKeys = propsSerialized.keys();

      const keys: string[] = [];
      for(let i = 0; i < propsKeys.size(); ++i)
        keys.push(propsKeys.get(i) as string);

      const props: Record<string, string> = {};

      for(const key of keys)
        props[key] = propsSerialized.get(key) as string;

      return props;
    }, witness_properties);

    expect(retVal).toStrictEqual({
      account_creation_fee: "88130000000000002320bcbe",
      account_subsidy_budget: "1d030000",
      account_subsidy_decay: "b94c0500",
      hbd_exchange_rate: "64000000000000000320bcbe64000000000000002320bcbe",
      hbd_interest_rate: "e803",
      key: "02472d6eb6d691b6de8b103b51ebdf4e128a523946d8cd03d6ded91b1497ee2e83",
      maximum_block_size: "00000200",
      new_signing_key: "02cf69b1f999d133ebbe178a8b4bbf4da356b264dfdc843b1c740378bff8f65b33",
      url: "0f68747470733a2f2f686976652e696f"
    });
  });

  test('Should be able to serialize witness properties and then deserialize', async ({ wasmTest }) => {
    const retVal = await wasmTest(({ protocol }, witness_properties) => {
      const propsSerialized = protocol.cpp_serialize_witness_set_properties(witness_properties);

      const props = protocol.cpp_deserialize_witness_set_properties(propsSerialized);

      return props;
    }, witness_properties);

    expect(retVal).toStrictEqual(witness_properties);
  });

  test('Should be able to estimate hive collateral', async ({ wasmTest }) => {
    const retVal = await wasmTest(({ protocol }, ...args) => {
      const current_median_history_base = protocol.cpp_hbd(args[0], args[1]);
      const current_median_history_quote = protocol.cpp_hive(args[2], args[3]);

      const current_min_history_base = protocol.cpp_hbd(args[4], args[5]);
      const current_min_history_quote = protocol.cpp_hive(args[6], args[7]);

      const current_median_history:json_price = {base:current_median_history_base, quote:current_median_history_quote};
      const current_min_history:json_price = {base:current_min_history_base, quote:current_min_history_quote};

      const hbd_amount_to_get = protocol.cpp_hbd(args[8], args[9]);

      return protocol.cpp_estimate_hive_collateral(current_median_history, current_min_history, hbd_amount_to_get);
    }, ...numToHighLow(201), ...numToHighLow(1000), ...numToHighLow(197), ...numToHighLow(1000), ...numToHighLow(100000));

    expect(retVal).toEqual({
      nai: "@@000000021",
      precision: 3,
      amount: "1065988"
    });
  });

  test.afterAll(async () => {
    await browser.close();
  });
});
