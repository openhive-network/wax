
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

  test('Should test throw 0', async () => {
    const { protocol } = await createWasmTestFor('node');

    expect(() => {
      try {
        protocol.cpp_throws(0);
      } catch(error) {
        const e: Error = error as Error;
        console.error(`name: ${e.name}, message: ${e.message}, stack: ${e.stack ? e.stack : "Missing stacktrace"}`);

        throw error;
      }
    }).toThrow();
  });

  test('Should test throw 1', async () => {
    const { protocol } = await createWasmTestFor('node');

    expect(() => {
      try {
        protocol.cpp_throws(1);
      } catch(error) {
        const e: Error = error as Error;
        console.error(`name: ${e.name}, message: ${e.message}, stack: ${e.stack ? e.stack : "Missing stacktrace"}`);

        throw error;
      }
    }).toThrow();
  });

  test('Should test throw 2', async () => {
    const { protocol } = await createWasmTestFor('node');

    expect(() => {
      try {
        protocol.cpp_throws(2);
      } catch(error) {
        const e: Error = error as Error;
        console.error(`name: ${e.name}, message: ${e.message}, stack: ${e.stack ? e.stack : "Missing stacktrace"}`);

        throw error;
      }
    }).toThrow();
  });

  test('Should test throw 3', async () => {
    const { protocol } = await createWasmTestFor('node');

    expect(() => {
      try {
        protocol.cpp_throws(3);
      } catch(error) {
        const e: Error = error as Error;
        console.error(`name: ${e.name}, message: ${e.message}, stack: ${e.stack ? e.stack : "Missing stacktrace"}`);

        throw error;
      }
    }).toThrow();
  });

  test('Should test throw 4', async () => {
    const { protocol, provider } = await createWasmTestFor('node');

    expect(() => {
      try {
        protocol.cpp_throws(4);
      } catch(error) {
        console.error(provider.getExceptionMessage(error));
        const e: Error = error as Error;
        console.error(`name: ${e.name}, message: ${e.message}, stack: ${e.stack ? e.stack : "Missing stacktrace"}`);

        throw error;
      }
    }).toThrow();
  });

  test('Should test getExceptionMessage with fc::assert_exception', async () => {
    const { protocol, provider } = await createWasmTestFor('node');

    expect(() => {
      try {
        protocol.cpp_throws(4);
      } catch(error) {
        const tuple = provider.getExceptionMessage(error);
        //console.error(`Here you are: ${tuple}`);
        //console.error(`Here you are: ${tuple[0]}, ${tuple[1]}`);
        const assertionObject = JSON.parse(tuple[1]);
        const assertionHash: string = assertionObject.assert_hash;
        //const hae: WaxAssertionError = new WaxAssertionError(assertionHash, tuple[1]);
        //console.error(`name: ${hae.name}, assertionHash: ${hae.assertionHash}, sourceJson: ${hae.message}`);
        console.error(`assertionHash: ${assertionHash}, sourceJson: ${tuple[1]}`);

        throw error;
      }
    }).toThrow();
  });

});
