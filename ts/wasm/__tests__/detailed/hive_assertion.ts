import { expect } from '@playwright/test';

import { test } from '../assets/jest-helper';
import type { WaxProtocolAssertionError } from '../../dist/bundle';

import type { claim_account, operation } from '../../dist/bundle';
import type { IWasmGlobals, IWaxGlobals } from '../assets/globals';

test.describe('Wax tests verifying unique assertion exceptions from hive', () => {

  const txValidate = async ({ chain, wax }: { chain: IWaxGlobals["chain"]; wax: IWaxGlobals["wax"] }, testedOp: operation) => {
    // Create transaction
    const tx = await chain.createTransaction();
    tx.pushOperation(testedOp);

    try {
      tx.validate();
    }
    catch (e) {
      if(e && typeof e === "object") {
        const error: object = e as object;
        if(e instanceof wax.WaxProtocolAssertionError) {
          const caughtAssertion: WaxProtocolAssertionError = error as WaxProtocolAssertionError;
          // To extract assertion expression we need object form of message json.
          const objectMsg = JSON.parse(caughtAssertion.message);
          return {
            detectedError: {
              source: "protocol",
              expression: objectMsg.extension.assertion_expression || "Unknown assertion expression",
              hash: caughtAssertion.assertionHash
            }
          };
        } else {
          const errorStr = JSON.stringify(error);
          return { detectedError: {message: errorStr} };
        }
      }

      throw new Error("Unexpected error type caught: " + e);
    }

    throw new Error("No error detected");
  };

  test('Expecting assertion evaluating invalid operation', async ({ waxTest }) => {
    // Validate invalid claim_account operation
    const testedOp: claim_account = {
      creator: "user123",
      fee: { nai: "@@000000013", amount: "1", precision: 3 },
      extensions: []
    };
    const op: operation = { claim_account_operation: testedOp };
    const retVal = await waxTest(txValidate, op);
    expect(retVal.detectedError).toStrictEqual({
      source: "protocol",
      expression: "is_asset_type( fee, HIVE_SYMBOL ) && \"Account claiming fee must be HIVE\"",
      hash: "14687464191050907756"
    });

    // Validate another invalid operation to trigger a different assertion ...
  });
});

test.describe('WASM Protocol assertions', () => {
  const validateOperation = async ({ protocol, provider }: { protocol: IWasmGlobals["protocol"]; provider: IWasmGlobals["provider"] }, testedOp: operation) => {
    // Create transaction
    const handle = protocol.cpp_create_operation_handle(testedOp, false);

    try {
      protocol.cpp_op_validate(handle);
    }
    catch (e) {
      console.log(`WaxBaseApi: C++ exception thrown during initialization: ${e}`);
      const d = provider.getExceptionMessage(e);
      console.log(`Received error details from getExceptionMessage:\nexception-type: ${d[0]},\nexception-message: ${d[1]}`);
      if(e && typeof e === "object") {
        const error: object = e as object;
        try {
          // To extract assertion expression we need object form of message json.
          const objectMsg = JSON.parse(d[1]);
          return {
            detectedError: {
              type: d[0],
              expression: objectMsg.extension.assertion_expression || "Unknown assertion expression",
              hash: objectMsg.assert_hash || "Unknown assertion hash"
            }
          };
        }
        catch (e2) {
          const errorStr = JSON.stringify(error);
          return { detectedError: {message: errorStr} };
        }
      }

      throw new Error("Unexpected error type caught: " + e);
    }

    throw new Error("No error detected");
  };

  test('Testing getExceptionMessage as wasmTest', async ({ wasmTest }) => {
    // Validate invalid claim_account operation
    const retVal = await wasmTest(validateOperation, {
      "type": "claim_account_operation",
      "value": {
        "creator": "user123",
        "fee": { "nai": "@@000000013", "amount": "1", "precision": 3 }
      }
    } as operation);

    expect(retVal.detectedError).toStrictEqual({
      type: "cpp::wax_protocol_assertion",
      expression: "is_asset_type( fee, HIVE_SYMBOL ) && \"Account claiming fee must be HIVE\"",
      hash: "14687464191050907756"
    });
  });
});