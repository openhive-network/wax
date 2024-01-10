import { test, expect } from '@playwright/test';

import { numToHighLow, protoTx, protoVoteOp, transaction, vote_operation } from "../assets/data.proto-protocol";

import MainModuleFunction, { MainModule, proto_protocol as proto_protocolT, protocol as protocolT } from "../../lib/node";

let error_code: MainModule['error_code'];
let proto_protocol: proto_protocolT;
let protocol: protocolT;

let privateKey!: string;

test.describe('WASM Proto Protocol for Node.js', () => {
  test.beforeAll(async () => {
    let protoClass: MainModule['proto_protocol'];
    let protocolClass: MainModule['protocol'];

    ({ error_code, proto_protocol: protoClass, protocol: protocolClass } = await MainModuleFunction());

    proto_protocol = new protoClass();
    protocol = new protocolClass();
  });

  test('Should be able to generate random private key', () => {
    const retVal = proto_protocol.cpp_generate_private_key();

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.value).toBe(error_code.ok);

    privateKey = retVal.content as string;
  });

  test('Should be able to calculate public key', () => {
    const retVal = proto_protocol.cpp_calculate_public_key(privateKey);

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.value).toBe(error_code.ok);
    expect(retVal.content).toMatch(/^[1-9A-HJ-NP-Za-km-z]+$/m);
  });

  test('Should be able to calculate the transaction id', () => {
    const retVal = proto_protocol.cpp_calculate_transaction_id(protoTx);

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.value).toBe(error_code.ok);
    expect(retVal.content).toBe("da8ca54c9c3acad06915ae9d93988c367f5cd164");
  });

  test('Should be able to serialize the transaction', () => {
    const retVal = proto_protocol.cpp_serialize_transaction(protoTx);

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.value).toBe(error_code.ok);
    expect(retVal.content).toBe("ff86c404c24b152fb7610100046f746f6d076330666633336108657778686e6a626a98080000");
  });

  test('Should be able to calculate sig digest of the transaction', () => {
    const retVal = proto_protocol.cpp_calculate_sig_digest(protoTx, "beeab0de00000000000000000000000000000000000000000000000000000000");

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.value).toBe(error_code.ok);
    expect(retVal.content).toBe("1394412814ea3e444f65c46f075e15b9b82e6bea9241319b02743a8e593219e1");
  });

  test('Should be able to validate example operation', () => {
    const retVal = proto_protocol.cpp_validate_operation(JSON.stringify(protoVoteOp));

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.value).toBe(error_code.ok);
  });

  test('Should not crash the program - transaction validation', () => {
    proto_protocol.cpp_validate_transaction("{}");
  });

  test('Should not crash the program - operation validation', () => {
    proto_protocol.cpp_validate_operation("{}");
  });

  test('Should be able to validate example transaction', () => {
    const retVal = proto_protocol.cpp_validate_transaction(protoTx);

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.value).toBe(error_code.ok);
  });

  test('Should be able to calculate manabar full regeneration time', () => {
    const retVal = proto_protocol.cpp_calculate_manabar_full_regeneration_time(0, ...numToHighLow(100), ...numToHighLow(100), 0);

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.value).toBe(error_code.ok);
    expect(retVal.content).toBe("0");
  });

  test('Should be able to calculate the current manabar full regeneration time', () => {
    const retVal = proto_protocol.cpp_calculate_current_manabar_value(0, ...numToHighLow(100), ...numToHighLow(100), 0);

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.value).toBe(error_code.ok);
    expect(retVal.content).toBe("100");
  });

  test('Should be able to create Hive in NAI form', () => {
    const retVal = proto_protocol.cpp_hive(...numToHighLow(10));

    expect(retVal).toEqual({
      nai: "@@000000021",
      precision: 3,
      amount: "10"
    });
  });

  test('Should be able to create Hive in NAI form - large integer', () => {
    const retVal = proto_protocol.cpp_hive(...numToHighLow(10000000000));

    expect(retVal).toEqual({
      nai: "@@000000021",
      precision: 3,
      amount: "10000000000"
    });
  });

  test('Should be able to create HBD in NAI form', () => {
    const retVal = proto_protocol.cpp_hbd(...numToHighLow(Number.MAX_SAFE_INTEGER + 1));

    expect(retVal).toEqual({
      nai: "@@000000013",
      precision: 3,
      amount: `${Number.MAX_SAFE_INTEGER + 1}`
    });
  });

  test('Should be able to create VESTS in NAI form', () => {
    const retVal = proto_protocol.cpp_vests(...numToHighLow(Number.MIN_SAFE_INTEGER));

    expect(retVal).toEqual({
      nai: "@@000000037",
      precision: 6,
      amount: `${Number.MIN_SAFE_INTEGER}`
    });
  });

  test('Should be able to create custom general asset in NAI form', () => {
    const retVal = proto_protocol.cpp_general_asset(3200000035, ...numToHighLow(10));

    expect(retVal).toEqual({
      nai: "@@000000021",
      precision: 3,
      amount: "10"
    });
  });

  test('Should be able to convert api schema to proto schema without data loss - basic operation', () => {
    const retVal = proto_protocol.cpp_api_to_proto(JSON.stringify(vote_operation));

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.value).toBe(error_code.ok);
    expect(JSON.parse(retVal.content as string)).toEqual(protoVoteOp);
  });

  test('Should be able to convert api schema to proto schema without data loss - basic transaction', () => {
    const retVal = proto_protocol.cpp_api_to_proto(transaction);

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.value).toBe(error_code.ok);
    expect(JSON.parse(retVal.content as string)).toEqual(JSON.parse(protoTx));
  });

  test('Should be able to convert proto schema to api schema without data loss - basic operation', () => {
    const retVal = proto_protocol.cpp_proto_to_api(JSON.stringify(protoVoteOp));

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.value).toBe(error_code.ok);
    expect(JSON.parse(retVal.content as string)).toEqual(vote_operation);
  });

  test('Should be able to convert proto schema to api schema without data loss - basic transaction', () => {
    const retVal = proto_protocol.cpp_proto_to_api(protoTx);

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.value).toBe(error_code.ok);
    expect(JSON.parse(retVal.content as string)).toEqual(JSON.parse(transaction));
  });

  test('Should be able to perform multiple bidirectional conversion - basic operation', () => {
    const toProto1 = proto_protocol.cpp_api_to_proto(JSON.stringify(vote_operation));

    expect(toProto1.exception_message).toHaveLength(0);
    expect(toProto1.value).toBe(error_code.ok);

    const toApi = proto_protocol.cpp_proto_to_api(toProto1.content);

    expect(toApi.exception_message).toHaveLength(0);
    expect(toApi.value).toBe(error_code.ok);

    const toProto2 = proto_protocol.cpp_api_to_proto(toApi.content);

    expect(toProto2.exception_message).toHaveLength(0);
    expect(toProto2.value).toBe(error_code.ok);

    expect(JSON.parse(toProto1.content as string)).toEqual(JSON.parse(toProto2.content as string));
  });

  test('Should be able to perform multiple bidirectional conversion - basic transaction', () => {
    const toApi1 = proto_protocol.cpp_proto_to_api(protoTx);

    expect(toApi1.exception_message).toHaveLength(0);
    expect(toApi1.value).toBe(error_code.ok);

    const toProto = proto_protocol.cpp_api_to_proto(toApi1.content);

    expect(toProto.exception_message).toHaveLength(0);
    expect(toProto.value).toBe(error_code.ok);

    const toApi2 = proto_protocol.cpp_proto_to_api(toProto.content);

    expect(toApi1.exception_message).toHaveLength(0);
    expect(toApi1.value).toBe(error_code.ok);

    expect(JSON.parse(toApi1.content as string)).toEqual(JSON.parse(toApi2.content as string));
  });

  test('Should be able to validate basic operation after transforming from api schema to proto schema', () => {
    const toProto = proto_protocol.cpp_api_to_proto(JSON.stringify(vote_operation));

    expect(toProto.exception_message).toHaveLength(0);
    expect(toProto.value).toBe(error_code.ok);

    const retVal = proto_protocol.cpp_validate_operation(toProto.content);

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.value).toBe(error_code.ok);
  });

  test('Should be able to validate basic transaction after transforming from api schema to proto schema', () => {
    const toProto = proto_protocol.cpp_api_to_proto(transaction);

    expect(toProto.exception_message).toHaveLength(0);
    expect(toProto.value).toBe(error_code.ok);

    const retVal = proto_protocol.cpp_validate_transaction(toProto.content);

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.value).toBe(error_code.ok);
  });

  test('Should be able to validate basic operation by the standard protocol after transforming from proto schema to api schema', () => {
    const toApi = proto_protocol.cpp_proto_to_api(JSON.stringify(protoVoteOp));

    expect(toApi.exception_message).toHaveLength(0);
    expect(toApi.value).toBe(error_code.ok);

    const retVal = protocol.cpp_validate_operation(toApi.content);

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.value).toBe(error_code.ok);
  });

  test('Should be able to validate basic transaction by the standard protocol after transforming from proto schema to api schema', () => {
    const toApi = proto_protocol.cpp_proto_to_api(protoTx);

    expect(toApi.exception_message).toHaveLength(0);
    expect(toApi.value).toBe(error_code.ok);

    const retVal = protocol.cpp_validate_transaction(toApi.content);

    expect(retVal.exception_message).toHaveLength(0);
    expect(retVal.value).toBe(error_code.ok);
  });
});
