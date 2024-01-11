import { test, expect } from '@playwright/test';

import { numToHighLow, serialization_sensitive_transaction, transaction, vote_operation } from "../assets/data.proto-protocol";

import MainModuleFunction, { MainModule, protocol as protocolT } from "../../dist/lib/wax_module.node";

let error_code: MainModule['error_code'];
let protocol: protocolT;

let privateKey!: string;

test.describe('WASM Protocol for Node.js', () => {
  test.beforeAll(async () => {
    let protocolClass: MainModule['protocol'];

    ({ error_code, protocol: protocolClass } = await MainModuleFunction());

    protocol = new protocolClass();
  });

  test('Should be able to generate random private key', () => {
    const retVal = protocol.cpp_generate_private_key();

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.value).toBe(error_code.ok);

    privateKey = retVal.content as string;
  });

  test('Should be able to calculate public key', () => {
    const retVal = protocol.cpp_calculate_public_key(privateKey);

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.value).toBe(error_code.ok);
    expect(retVal.content).toMatch(/^[1-9A-HJ-NP-Za-km-z]+$/m);
  });

  test('Should be able to calculate the transaction id', () => {
    const retVal = protocol.cpp_calculate_transaction_id(transaction);

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.value).toBe(error_code.ok);
    expect(retVal.content).toBe("da8ca54c9c3acad06915ae9d93988c367f5cd164");
  });

  test('Should be able to calculate the legacy transaction id of the serialization sensitive transaction', () => {
    const retVal = protocol.cpp_calculate_legacy_transaction_id(serialization_sensitive_transaction);

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.value).toBe(error_code.ok);
    expect(retVal.content).toBe("7f34699e9eea49d1bcc10c88f96e38897839ece3"); /// See Hive mainnet block 80021416
  });

  test('Should be able to calculate the HF26 transaction id of the serialization sensitive transaction', () => {
    const retVal = protocol.cpp_calculate_transaction_id(serialization_sensitive_transaction);

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.value).toBe(error_code.ok);
    expect(retVal.content).toBe("3725c81634f152011e2043eb7119911b953d4267"); /// See Hive mainnet block 80021416
  });

  test('Should be able to serialize the transaction', () => {
    const retVal = protocol.cpp_serialize_transaction(transaction);

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.value).toBe(error_code.ok);
    expect(retVal.content).toBe("ff86c404c24b152fb7610100046f746f6d076330666633336108657778686e6a626a98080000");
  });

  test('Should be able to calculate sig digest of the transaction', () => {
    const retVal = protocol.cpp_calculate_sig_digest(transaction, "beeab0de00000000000000000000000000000000000000000000000000000000");

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.value).toBe(error_code.ok);
    expect(retVal.content).toBe("1394412814ea3e444f65c46f075e15b9b82e6bea9241319b02743a8e593219e1");
  });

  test('Should be able to validate example operation', () => {
    const retVal = protocol.cpp_validate_operation(JSON.stringify(vote_operation));

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.value).toBe(error_code.ok);
  });

  test('Should be able to validate example transaction', () => {
    const retVal = protocol.cpp_validate_transaction(transaction);

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.value).toBe(error_code.ok);
  });

  test('Should be able to calculate manabar full regeneration time', () => {
    const retVal = protocol.cpp_calculate_manabar_full_regeneration_time(0, ...numToHighLow(100), ...numToHighLow(100), 0);

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.value).toBe(error_code.ok);
    expect(retVal.content).toBe("0");
  });

  test('Should be able to calculate the current manabar full regeneration time', () => {
    const retVal = protocol.cpp_calculate_current_manabar_value(0, ...numToHighLow(100), ...numToHighLow(100), 0);

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.value).toBe(error_code.ok);
    expect(retVal.content).toBe("100");
  });

  test('Should be able to create Hive in NAI form', () => {
    const retVal = protocol.cpp_hive(...numToHighLow(10));

    expect(retVal).toEqual({
      nai: "@@000000021",
      precision: 3,
      amount: "10"
    });
  });

  test('Should be able to create Hive in NAI form - large integer', () => {
    const retVal = protocol.cpp_hive(...numToHighLow(10000000000));

    expect(retVal).toEqual({
      nai: "@@000000021",
      precision: 3,
      amount: "10000000000"
    });
  });

  test('Should be able to create HBD in NAI form', () => {
    const retVal = protocol.cpp_hbd(...numToHighLow(Number.MAX_SAFE_INTEGER + 1));

    expect(retVal).toEqual({
      nai: "@@000000013",
      precision: 3,
      amount: `${Number.MAX_SAFE_INTEGER + 1}`
    });
  });

  test('Should be able to create VESTS in NAI form', () => {
    const retVal = protocol.cpp_vests(...numToHighLow(Number.MIN_SAFE_INTEGER));

    expect(retVal).toEqual({
      nai: "@@000000037",
      precision: 6,
      amount: `${Number.MIN_SAFE_INTEGER}`
    });
  });

  test('Should be able to create custom general asset in NAI form', () => {
    const retVal = protocol.cpp_general_asset(3200000035, ...numToHighLow(10));

    expect(retVal).toEqual({
      nai: "@@000000021",
      precision: 3,
      amount: "10"
    });
  });
});
