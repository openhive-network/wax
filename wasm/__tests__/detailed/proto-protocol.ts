import { ChromiumBrowser, ConsoleMessage, chromium } from 'playwright';
import { test, expect } from '@playwright/test';

import { ErrorCodes, numToHighLow, protoTx, transaction, protoVoteOp, vote_operation } from "../assets/data.proto-protocol";
import { result as resultT } from '../../lib/wax';

let browser!: ChromiumBrowser;

let privateKey!: string;

test.describe('WASM Proto Protocol', () => {
  test.beforeAll(async () => {
    browser = await chromium.launch({
      headless: true
    });
  });

  test.beforeEach(async({ page }) => {
    page.on('console', (msg: ConsoleMessage) => {
      console.log('>>', msg.type(), msg.text())
    });

    await page.goto(`http://localhost:8080/wasm/__tests__/assets/test.html`);
    await page.waitForURL('**/test.html', { waitUntil: 'load' });

    await page.evaluate(async (ErrorCodes) => {
      const provider = await wax();
      const protocol = new provider.protocol();
      const proto_protocol = new provider.proto_protocol();

      Object.defineProperties(window, {
        protocol: {
          get() {
            return protocol;
          }
        },
        proto_protocol: {
          get() {
            return proto_protocol;
          }
        },
        provider: {
          get() {
            return provider;
          }
        },
        /// Helper function for transforming result type to the node-understandable type (value.value is a non-serialable function)
        transform: {
          get() {
            return (result: resultT) => {
              const value = result.value === provider.error_code.ok ? ErrorCodes.OK : ErrorCodes.FAIL;

              return {
                ...result,
                value
              };
            };
          }
        }
      });
    }, ErrorCodes);
  });

  test('Should be able to generate random private key', async ({ page }) => {
    const retVal = await page.evaluate(() => {
      return transform(proto_protocol.cpp_generate_private_key());
    });

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.value).toBe(ErrorCodes.OK);

    privateKey = retVal.content as string;
  });

  test('Should be able to calculate public key', async ({ page }) => {
    const retVal = await page.evaluate((privateKey) => {
      return transform(proto_protocol.cpp_calculate_public_key(privateKey));
    }, privateKey);

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.value).toBe(ErrorCodes.OK);
    expect(retVal.content).toMatch(/^[1-9A-HJ-NP-Za-km-z]+$/m);
  });

  test('Should be able to calculate the transaction id', async ({ page }) => {
    const retVal = await page.evaluate((transaction) => {
      return transform(proto_protocol.cpp_calculate_transaction_id(transaction));
    }, protoTx);

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.value).toBe(ErrorCodes.OK);
    expect(retVal.content).toBe("da8ca54c9c3acad06915ae9d93988c367f5cd164");
  });

  test('Should be able to serialize the transaction', async ({ page }) => {
    const retVal = await page.evaluate((transaction) => {
      return transform(proto_protocol.cpp_serialize_transaction(transaction));
    }, protoTx);

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.value).toBe(ErrorCodes.OK);
    expect(retVal.content).toBe("ff86c404c24b152fb7610100046f746f6d076330666633336108657778686e6a626a98080000");
  });

  test('Should be able to calculate sig digest of the transaction', async ({ page }) => {
    const retVal = await page.evaluate((transaction) => {
      return transform(proto_protocol.cpp_calculate_sig_digest(transaction, "beeab0de00000000000000000000000000000000000000000000000000000000"));
    }, protoTx);

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.value).toBe(ErrorCodes.OK);
    expect(retVal.content).toBe("1394412814ea3e444f65c46f075e15b9b82e6bea9241319b02743a8e593219e1");
  });

  test('Should be able to validate example operation', async ({ page }) => {
    const retVal = await page.evaluate((operation) => {
      return transform(proto_protocol.cpp_validate_operation(operation));
    }, JSON.stringify(protoVoteOp));

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.value).toBe(ErrorCodes.OK);
  });

  test('Should not crash the program - transaction validation', async ({ page }) => {
    await page.evaluate(() => {
      proto_protocol.cpp_validate_transaction("{}");
    });
  });

  test('Should not crash the program - operation validation', async ({ page }) => {
    await page.evaluate(() => {
      proto_protocol.cpp_validate_operation("{}");
    });
  });

  test('Should be able to validate example transaction', async ({ page }) => {
    const retVal = await page.evaluate((transaction) => {
      return transform(proto_protocol.cpp_validate_transaction(transaction));
    }, protoTx);

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.value).toBe(ErrorCodes.OK);
  });

  test('Should be able to calculate manabar full regeneration time', async ({ page }) => {
    const retVal = await page.evaluate((args: number[]) => {
      return transform(proto_protocol.cpp_calculate_manabar_full_regeneration_time(args[0], args[1], args[2], args[3], args[4], args[5]));
    }, [ 0, ...numToHighLow(100), ...numToHighLow(100), 0 ]);

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.value).toBe(ErrorCodes.OK);
    expect(retVal.content).toBe("0");
  });

  test('Should be able to calculate the current manabar full regeneration time', async ({ page }) => {
    const retVal = await page.evaluate((args: number[]) => {
      return transform(proto_protocol.cpp_calculate_current_manabar_value(args[0], args[1], args[2], args[3], args[4], args[5]));
    }, [ 0, ...numToHighLow(100), ...numToHighLow(100), 0 ]);

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.value).toBe(ErrorCodes.OK);
    expect(retVal.content).toBe("100");
  });

  test('Should be able to create Hive in NAI form', async ({ page }) => {
    const retVal = await page.evaluate((args: number[]) => {
      return proto_protocol.cpp_hive(args[0], args[1]);
    }, numToHighLow(10));

    expect(retVal).toEqual({
      nai: "@@000000021",
      precision: 3,
      amount: "10"
    });
  });

  test('Should be able to create Hive in NAI form - large integer', async ({ page }) => {
    const retVal = await page.evaluate((args: number[]) => {
      return proto_protocol.cpp_hive(args[0], args[1]);
    }, numToHighLow(10000000000));

    expect(retVal).toEqual({
      nai: "@@000000021",
      precision: 3,
      amount: "10000000000"
    });
  });

  test('Should be able to create HBD in NAI form', async ({ page }) => {
    const retVal = await page.evaluate((args: number[]) => {
      return proto_protocol.cpp_hbd(args[0], args[1]);
    }, numToHighLow(Number.MAX_SAFE_INTEGER + 1));

    expect(retVal).toEqual({
      nai: "@@000000013",
      precision: 3,
      amount: `${Number.MAX_SAFE_INTEGER + 1}`
    });
  });

  test('Should be able to create VESTS in NAI form', async ({ page }) => {
    const retVal = await page.evaluate((args: number[]) => {
      return proto_protocol.cpp_vests(args[0], args[1]);
    }, numToHighLow(Number.MIN_SAFE_INTEGER));

    expect(retVal).toEqual({
      nai: "@@000000037",
      precision: 6,
      amount: `${Number.MIN_SAFE_INTEGER}`
    });
  });

  test('Should be able to create custom general asset in NAI form', async ({ page }) => {
    const retVal = await page.evaluate((args: number[]) => {
      return proto_protocol.cpp_general_asset(3200000035, args[0], args[1]);
    }, numToHighLow(10));

    expect(retVal).toEqual({
      nai: "@@000000021",
      precision: 3,
      amount: "10"
    });
  });

  test('Should be able to convert api schema to proto schema without data loss - basic operation', async ({ page }) => {
    const retVal = await page.evaluate((operation) => {
      return transform(proto_protocol.cpp_api_to_proto(operation));
    }, JSON.stringify(vote_operation));

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.value).toBe(ErrorCodes.OK);
    expect(JSON.parse(retVal.content as string)).toEqual(protoVoteOp);
  });

  test('Should be able to convert api schema to proto schema without data loss - basic transaction', async ({ page }) => {
    const retVal = await page.evaluate((transaction) => {
      return transform(proto_protocol.cpp_api_to_proto(transaction));
    }, transaction);

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.value).toBe(ErrorCodes.OK);
    expect(JSON.parse(retVal.content as string)).toEqual(JSON.parse(protoTx));
  });

  test('Should be able to convert proto schema to api schema without data loss - basic operation', async ({ page }) => {
    const retVal = await page.evaluate((operation) => {
      return transform(proto_protocol.cpp_proto_to_api(operation));
    }, JSON.stringify(protoVoteOp));

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.value).toBe(ErrorCodes.OK);
    expect(JSON.parse(retVal.content as string)).toEqual(vote_operation);
  });

  test('Should be able to convert proto schema to api schema without data loss - basic transaction', async ({ page }) => {
    const retVal = await page.evaluate((transaction) => {
      return transform(proto_protocol.cpp_proto_to_api(transaction));
    }, protoTx);

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.value).toBe(ErrorCodes.OK);
    expect(JSON.parse(retVal.content as string)).toEqual(JSON.parse(transaction));
  });

  test('Should be able to perform multiple bidirectional conversion - basic operation', async ({ page }) => {
    const toProto1 = await page.evaluate((operation) => {
      return transform(proto_protocol.cpp_api_to_proto(operation));
    }, JSON.stringify(vote_operation));

    expect(toProto1.exception_message).toHaveLength(0);
    expect(toProto1.value).toBe(ErrorCodes.OK);

    const toApi = await page.evaluate((operation) => {
      return transform(proto_protocol.cpp_proto_to_api(operation));
    }, toProto1.content);

    expect(toApi.exception_message).toHaveLength(0);
    expect(toApi.value).toBe(ErrorCodes.OK);

    const toProto2 = await page.evaluate((operation) => {
      return transform(proto_protocol.cpp_api_to_proto(operation));
    }, toApi.content);

    expect(toProto2.exception_message).toHaveLength(0);
    expect(toProto2.value).toBe(ErrorCodes.OK);

    expect(JSON.parse(toProto1.content as string)).toEqual(JSON.parse(toProto2.content as string));
  });

  test('Should be able to perform multiple bidirectional conversion - basic transaction', async ({ page }) => {
    const toApi1 = await page.evaluate((transaction) => {
      return transform(proto_protocol.cpp_proto_to_api(transaction));
    }, protoTx);

    expect(toApi1.exception_message).toHaveLength(0);
    expect(toApi1.value).toBe(ErrorCodes.OK);

    const toProto = await page.evaluate((transaction) => {
      return transform(proto_protocol.cpp_api_to_proto(transaction));
    }, toApi1.content);

    expect(toProto.exception_message).toHaveLength(0);
    expect(toProto.value).toBe(ErrorCodes.OK);

    const toApi2 = await page.evaluate((transaction) => {
      return transform(proto_protocol.cpp_proto_to_api(transaction));
    }, toProto.content);

    expect(toApi1.exception_message).toHaveLength(0);
    expect(toApi1.value).toBe(ErrorCodes.OK);

    expect(JSON.parse(toApi1.content as string)).toEqual(JSON.parse(toApi2.content as string));
  });

  test('Should be able to validate basic operation after transforming from api schema to proto schema', async ({ page }) => {
    const toProto = await page.evaluate((operation) => {
      return transform(proto_protocol.cpp_api_to_proto(operation));
    }, JSON.stringify(vote_operation));

    expect(toProto.exception_message).toHaveLength(0);
    expect(toProto.value).toBe(ErrorCodes.OK);

    const retVal = await page.evaluate((operation) => {
      return transform(proto_protocol.cpp_validate_operation(operation));
    }, toProto.content);

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.value).toBe(ErrorCodes.OK);
  });

  test('Should be able to validate basic transaction after transforming from api schema to proto schema', async ({ page }) => {
    const toProto = await page.evaluate((transaction) => {
      return transform(proto_protocol.cpp_api_to_proto(transaction));
    }, transaction);

    expect(toProto.exception_message).toHaveLength(0);
    expect(toProto.value).toBe(ErrorCodes.OK);

    const retVal = await page.evaluate((transaction) => {
      return transform(proto_protocol.cpp_validate_transaction(transaction));
    }, toProto.content);

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.value).toBe(ErrorCodes.OK);
  });

  test('Should be able to validate basic operation by the standard protocol after transforming from proto schema to api schema', async ({ page }) => {
    const toApi = await page.evaluate((operation) => {
      return transform(proto_protocol.cpp_proto_to_api(operation));
    }, JSON.stringify(protoVoteOp));

    expect(toApi.exception_message).toHaveLength(0);
    expect(toApi.value).toBe(ErrorCodes.OK);

    const retVal = await page.evaluate((operation) => {
      return transform(protocol.cpp_validate_operation(operation));
    }, toApi.content);

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.value).toBe(ErrorCodes.OK);
  });

  test('Should be able to validate basic transaction by the standard protocol after transforming from proto schema to api schema', async ({ page }) => {
    const toApi = await page.evaluate((transaction) => {
      return transform(proto_protocol.cpp_proto_to_api(transaction));
    }, protoTx);

    expect(toApi.exception_message).toHaveLength(0);
    expect(toApi.value).toBe(ErrorCodes.OK);

    const retVal = await page.evaluate((transaction) => {
      return transform(protocol.cpp_validate_transaction(transaction));
    }, toApi.content);

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.value).toBe(ErrorCodes.OK);
  });

  test.afterAll(async () => {
    await browser.close();
  });
});
