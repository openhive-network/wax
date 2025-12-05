
import { expect } from '@playwright/test';

import { realSerializedWitnessSetProperties, input_witness_properties } from "../assets/data.proto-protocol";

import { test } from '../assets/jest-helper';

test.describe('WASM Base tests', () => {
  // Base browser type test
  test('Should test on chromium', async ({ browser }) => {
    const browserType = browser.browserType();

    expect(browserType.name()).toBe('chromium');
  });

  // Base valid test html webpage test
  test('Should have a valid html test webpage', async ({ page }) => {
    const id = await page.$eval("body", n => n.getAttribute("id"))

    expect(id).toBe('waxbody');
  });

  test('Should be able to serialize witness props', async ({ wasmTest }) => {
    const retval = await wasmTest(({ protocol}, input_witness_properties) => {
      const serializedProps = protocol.cpp_serialize_witness_set_properties(input_witness_properties);
      return { key: serializedProps.get('key'), hbd_exchange_rate: serializedProps.get('hbd_exchange_rate') };
    }, input_witness_properties);

    expect(retval.key).toBe('029072da2e84ebd6eb520f944db3d1af718500b0f1ddf60e11e986f990acddd524');
    expect(retval.hbd_exchange_rate).toEqual('11010000000000000320bcbee8030000000000002320bcbe');
  });

  test('Should be able to deserialize witness props', async ({ wasmTest }) => {
    const retval = await wasmTest(({ protocol, provider }, realSerializedWitnessSetProperties) => {

      const map = new provider.MapStringString();
      for (const [key, serializedValue] of realSerializedWitnessSetProperties.value.props)
        map.set(key, serializedValue);

      const deserializedProps = protocol.cpp_deserialize_witness_set_properties(map);

      return { key: deserializedProps.key, hbd_exchange_rate: deserializedProps.hbd_exchange_rate };
    }, realSerializedWitnessSetProperties);

    expect(retval.key).toBe('STM5z76mjZJnTZHHZjgnFxFadTb1ztc6R7EuDgCzd6dNiv6ETB2tj');
    expect(retval.hbd_exchange_rate).toEqual({
      base: {
        amount: "273",
        nai: "@@000000013",
        precision: 3
      },
      quote: {
        amount: "1000",
        nai: "@@000000021",
        precision: 3
      }
    });
  });

  test('Should have global instance of protocol', async ({ wasmTest }) => {
    const moduleType = await wasmTest(({ protocol }) => {
      return typeof protocol;
    });

    expect(moduleType).toBe('object');
  });

  test('Should test throw 0 - Abort test - std::terminate called', async () => {
    const { protocol } = await createWasmTestFor('node');

    try {
      protocol.cpp_throws(0);
    } catch(error) {
      const e: Error = error as Error;
      // console.error(`name: ${e.name}, message: ${e.message}, stack: ${e.stack ? e.stack : "Missing stacktrace"}`);

      expect(e.message).toBe('unreachable');
      expect(e.name).toBe('RuntimeError');
      expect(e.stack).toBeDefined();

      return;
    }

    throw new Error('Expected exception was not thrown');
  });

  test('Should test throw 1 - throw const char*', async () => {
    const { protocol } = await createWasmTestFor('node');

    try {
      protocol.cpp_throws(1);
    } catch(error) {
      const e: Error = error as Error;
      // console.error(`name: ${e.name}, message: ${e.message}, stack: ${e.stack ? e.stack : "Missing stacktrace"}`);

      expect(e.message).toStrictEqual(['std::runtime_error', 'Nonstanard exception']);
      expect(e.name).toBe(undefined);
      expect(e.stack).toBeDefined();

      return;
    }

    throw new Error('Expected exception was not thrown');
  });

  test('Should test throw 2 - throw std::string', async () => {
    const { protocol } = await createWasmTestFor('node');

    try {
      protocol.cpp_throws(2);
    } catch(error) {
      const e: Error = error as Error;
      // console.error(`name: ${e.name}, message: ${e.message}, stack: ${e.stack ? e.stack : "Missing stacktrace"}`);

      expect(e.message).toStrictEqual(['std::runtime_error', 'Nonstanard exception']);
      expect(e.name).toBe(undefined);
      expect(e.stack).toBeDefined();

      return;
    }

    throw new Error('Expected exception was not thrown');
  });

  test('Should test throw 3 - throw std::runtime_error', async () => {
    const { protocol } = await createWasmTestFor('node');

    try {
      protocol.cpp_throws(3);
    } catch(error) {
      const e: Error = error as Error;
      // console.error(`name: ${e.name}, message: ${e.message}, stack: ${e.stack ? e.stack : "Missing stacktrace"}`);

      expect(e.message).toStrictEqual(['std::runtime_error', 'Hello, my exception!']);
      expect(e.name).toBe(undefined);
      expect(e.stack).toBeDefined();

      return;
    }

    throw new Error('Expected exception was not thrown');
  });

  test('Should test throw 4 - fail FC_ASSERT', async () => {
    const { protocol } = await createWasmTestFor('node');

    try {
      protocol.cpp_throws(4);
    } catch(error) {
      const e: Error = error as Error;
      // console.error(`name: ${e.name}, message: ${e.message}, stack: ${e.stack ? e.stack : "Missing stacktrace"}`);

      expect(e.message[0]).toStrictEqual('cpp::wax_protocol_assertion');
      expect(e.message[1]).toContain('"format":"Hello fc exception!","data":{}');
      expect(e.message[1]).toContain('"assert_hash":');
      expect(e.name).toBe(undefined);
      expect(e.stack).toBeDefined();

      return;
    }

    throw new Error('Expected exception was not thrown');
  });

  test('Should test getExceptionMessage with fc::assert_exception', async () => {
    const { protocol, provider } = await createWasmTestFor('node');

    try {
      protocol.cpp_throws(4);
    } catch(error) {
      const exMsg = provider.getExceptionMessage(error);
      // console.error(`name: ${e.name}, message: ${e.message}, stack: ${e.stack ? e.stack : "Missing stacktrace"}`);

      expect(exMsg[0]).toStrictEqual('cpp::wax_protocol_assertion');
      expect(exMsg[1]).toContain('"format":"Hello fc exception!","data":{}');
      expect(exMsg[1]).toContain('"assert_hash":');

      return;
    }

    throw new Error('Expected exception was not thrown');
  });

  test('Should test throw 5 - throw wax_unknown_assertion', async () => {
    const { protocol, provider } = await createWasmTestFor('node');

    try {
      protocol.cpp_throws(5);
    } catch(error) {
      const exMsg = provider.getExceptionMessage(error);
      // console.error(`name: ${e.name}, message: ${e.message}, stack: ${e.stack ? e.stack : "Missing stacktrace"}`);

      expect(exMsg[0]).toStrictEqual('cpp::wax_unknown_assertion');
      expect(exMsg[1]).toContain('"format":"Simulated assert exception","data":{}');
      expect(exMsg[1]).not.toContain('"assert_hash":'); // wax_unknown_assertion does not contain assert_hash by default

      return;
    }

    throw new Error('Expected exception was not thrown');
  });

  test('Should test throw 6 - throw external library exception - boost::bad_lexical_cast', async () => {
    const { protocol, provider } = await createWasmTestFor('node');

    try {
      protocol.cpp_throws(6);
    } catch(error) {
      const exMsg = provider.getExceptionMessage(error);
      // console.error(`name: ${e.name}, message: ${e.message}, stack: ${e.stack ? e.stack : "Missing stacktrace"}`);

      expect(exMsg[0]).toStrictEqual('boost::bad_lexical_cast');
      expect(exMsg[1]).toStrictEqual('bad lexical cast: source type value could not be interpreted as target');

      return;
    }

    throw new Error('Expected exception was not thrown');
  });

  test('Should calculate public key from private key', async ({ wasmTest }) => {
    const privateKey = "5JkFnXrLM2ap9t3AmAxBJvQHF7xSKtnTrCTginQCkhzU5S7ecPT";
    const expectedPublicKey = "STM5RqVBAVNp5ufMCetQtvLGLJo7unX9nyCBMMrTXRWQ9i1Zzzizh";

    const publicKey = await wasmTest(({ protocol }, privateKey) => {
      return protocol.cpp_calculate_public_key(privateKey);
    }, privateKey);

    expect(publicKey).toBe(expectedPublicKey);
  });

  test('Should throw error for invalid private key format', async ({ wasmTest }) => {
    const invalidPrivateKey = "invalid_key";

    try {
      await wasmTest(({ protocol }, invalidPrivateKey) => {
        return protocol.cpp_calculate_public_key(invalidPrivateKey);
      }, invalidPrivateKey);

      throw new Error('Expected exception was not thrown');
    } catch(error) {
      const e: Error = error as Error;

      expect(e.message[0]).toBeDefined();
      expect(e.message[1]).toContain('given string is not valid private key');
    }
  });
});
