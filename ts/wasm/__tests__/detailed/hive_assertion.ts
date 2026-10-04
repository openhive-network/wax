import { expect } from '@playwright/test';

import { test } from '../assets/jest-helper';
import type { WaxAssertionError } from '../../dist/bundle';

import type { claim_account, operation } from '../../dist/bundle';
import type { IWasmGlobals, IWaxGlobals } from '../assets/globals';

test.describe('Wax tests verifying unique assertion exceptions from hive', () => {

  const txValidate = async ({ chain, wax }: { chain: IWaxGlobals["chain"]; wax: IWaxGlobals["wax"] }, testedOp: operation) => {
    // Create transaction
    const tx = chain.createTransactionWithTaPoS('04c507a8c7fe5be96be64ce7c86855e1806cbde3', '2023-11-09T21:51:27');
    tx.pushOperation(testedOp);

    try {
      tx.validate();
    }
    catch (e) {
      if(e && typeof e === "object") {
        const error: object = e as object;
        if(e instanceof wax.WaxAssertionError) {
          const caughtAssertion: WaxAssertionError = error as WaxAssertionError;
          if (caughtAssertion.category === "protocol") {
            return {
              detectedError: {
                source: caughtAssertion.category,
                expression: caughtAssertion.raw.extension.assertion_expression || "Unknown assertion expression",
                context: caughtAssertion.extras.context,
                hash: caughtAssertion.assertHash
              }
            };
          }
        }
        const errorStr = JSON.stringify(error);
        return { detectedError: {message: errorStr} };
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
    // claim_account_operation::validate() checks the fee through the shared validate_asset_type()
    // helper (hive 477d717460e7), so the expression and hash name the helper's assertion and
    // the operation-specific message arrives as its context.
    expect(retVal.detectedError).toStrictEqual({
      source: "protocol",
      expression: "is_asset_type( asset, symbol)",
      context: "Account claiming fee must be HIVE",
      hash: "7633970631494007356"
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
              context: objectMsg.stack[0].data.context,
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

    // claim_account_operation::validate() checks the fee through the shared validate_asset_type()
    // helper (hive 477d717460e7), so the expression and hash name the helper's assertion and
    // the operation-specific message arrives as its context.
    expect(retVal.detectedError).toStrictEqual({
      type: "cpp::wax_protocol_assertion",
      expression: "is_asset_type( asset, symbol)",
      context: "Account claiming fee must be HIVE",
      hash: "7633970631494007356"
    });
  });
});