import { strict as assert } from 'assert';

import Module from '../../build_wasm/wax_wasm.js';

const vote_operation = {
  type: "vote_operation",
  value: {
    voter: "otom",
    author: "c0ff33a",
    permlink: "ewxhnjbj",
    weight: 2200
  }
};

const transaction = JSON.stringify({
  ref_block_num: 34559,
  ref_block_prefix: 1271006404,
  expiration: "2021-12-13T11:31:33",
  operations: [
    vote_operation
  ],
  extensions: []
});

const protoOps = [
  {
    vote: {
      voter: "otom",
      author: "c0ff33a",
      permlink: "ewxhnjbj",
      weight: 2200
    }
  }
];

const protoTx = JSON.stringify({
  ref_block_num: 34559,
  ref_block_prefix: 1271006404,
  expiration: "2021-12-13T11:31:33",
  operations: protoOps,
  extensions: []
});

const protoRecurrentTransferOperation = JSON.stringify({
  recurrent_transfer: {
    // Note: Those values are named from and to in proto definitions, but are later transformed. We do not have access to the proto transformers here, so we have to hardcode it.
    // If you want to test how the transformers work, please see our examples
    from: "alice",
    to: "harry",
    amount: { nai: "@@000000021", precision: 3, amount: "10" },
    memo: "it is only memo",
    recurrence: 3 * 24 * 60 * 60,
    executions: 3,
    extensions: [ { recurrent_transfer_pair_id: { pair_id: 0 } }, { void_t: {} } ]
  }
});

const negate = (value) => {
  const low = ~((value % (2**32)) | 0);
  const high = ~((value / (2**32)) | 0);

  let a48 = high >>> 16;
  let a32 = high & 0xFFFF;
  let a16 = low >>> 16;
  let a00 = low & 0xFFFF;

  let c48 = 0, c32 = 0, c16 = 0, c00 = 0;
  c00 += a00 + 1;
  c16 += c00 >>> 16;
  c00 &= 0xFFFF;
  c16 += a16 + (1 >>> 16);
  c32 += c16 >>> 16;
  c16 &= 0xFFFF;
  c32 += a32;
  c48 += c32 >>> 16;
  c32 &= 0xFFFF;
  c48 += a48;
  c48 &= 0xFFFF;

  return [
    (c16 << 16) | c00,
    (c48 << 16) | c32
  ];
};

const numToHighLow = (value) => {
  if (value < 0)
    return negate(-value);

  return [
    (value % (2**32)) | 0,
    (value / (2**32)) | 0
  ];
};

const my_entrypoint = async() => {
  const provider = await Module();
  /** @type {import("../../build_wasm/wax.d.ts").protocol} */
  const instance = new provider.protocol();

  const testLib = (instance_, name, ...args) => {
    console.debug(`\nTesting ${instance_.constructor.name}::${name}`);

    const result = instance_[name](...args);

    if(result.value !== provider.error_code.ok || result.exception_message.length > 0) {
      console.error(`Failed. Error message: "${result.exception_message}"`);
      console.log('Data:', ...args);
      assert.ok(false);
    }

    console.info(`>> ${result.content}`);
    return result.content;
  };

  const privateKey = testLib(instance, "cpp_generate_private_key");
  assert.ok(privateKey); // Test if string is valid

  const publicKey = testLib(instance, "cpp_calculate_public_key", privateKey);
  assert.match(publicKey, /^[1-9A-HJ-NP-Za-km-z]+$/m); // test base58 string

  const txId = testLib(instance, "cpp_calculate_transaction_id", transaction);
  assert.equal(txId, "da8ca54c9c3acad06915ae9d93988c367f5cd164"); // Check if transaction ids match

  const serialized = testLib(instance, "cpp_serialize_transaction", transaction);
  assert.equal(serialized, "ff86c404c24b152fb7610100046f746f6d076330666633336108657778686e6a626a980800"); // check serialized hex

  const sigDigest = testLib(instance, "cpp_calculate_sig_digest", transaction, "beeab0de00000000000000000000000000000000000000000000000000000000");
  assert.equal(sigDigest, "1394412814ea3e444f65c46f075e15b9b82e6bea9241319b02743a8e593219e1");

  testLib(instance, "cpp_validate_operation", JSON.stringify(vote_operation)); // validate single operation in json format

  testLib(instance, "cpp_validate_transaction", transaction); // validate entire transaction

  testLib(instance, "cpp_calculate_manabar_full_regeneration_time", 0, ...numToHighLow(100), ...numToHighLow(100), 0);

  testLib(instance, "cpp_calculate_current_manabar_value", 0, ...numToHighLow(100), ...numToHighLow(100), 0);

  assert.deepEqual(
    instance.cpp_general_asset(3200000035, ...numToHighLow(10)),
    {
      nai: "@@000000021",
      precision: 3,
      amount: "10"
    }
  );

  assert.deepEqual(
    instance.cpp_hive(...numToHighLow(10)),
    {
      nai: "@@000000021",
      precision: 3,
      amount: "10"
    }
  );

  assert.deepEqual(
    instance.cpp_hive(...numToHighLow(10000000000)),
    {
      nai: "@@000000021",
      precision: 3,
      amount: "10000000000"
    }
  );

  assert.deepEqual(
    instance.cpp_hbd(...numToHighLow(Number.MAX_SAFE_INTEGER + 1)),
    {
      nai: "@@000000013",
      precision: 3,
      amount: `${Number.MAX_SAFE_INTEGER + 1}`
    }
  );

  assert.deepEqual(
    instance.cpp_vests(...numToHighLow(Number.MIN_SAFE_INTEGER)),
    {
      nai: "@@000000037",
      precision: 6,
      amount: `${Number.MIN_SAFE_INTEGER}`
    }
  );

  /** @type {import("../../build_wasm/wax.d.ts").proto_protocol} */
  const protoInstance = new provider.proto_protocol();

  protoOps.forEach(op => void testLib(protoInstance, "cpp_validate_operation", JSON.stringify(op)));

  testLib(protoInstance, "cpp_validate_transaction", protoTx);

  protoInstance.cpp_validate_operation("{}"); // Test if no segfault occurs
  protoInstance.cpp_validate_transaction("{}"); // Test if no segfault occurs

  const txIdProto = testLib(protoInstance, "cpp_calculate_transaction_id", protoTx);
  assert.equal(txId, txIdProto);

  const serializedProto = testLib(protoInstance, "cpp_serialize_transaction", protoTx);
  assert.equal(serialized, serializedProto);

  const sigDigestProto = testLib(protoInstance, "cpp_calculate_sig_digest", protoTx, "beeab0de00000000000000000000000000000000000000000000000000000000");
  assert.equal(sigDigest, sigDigestProto);

  const parsedProtoTx = testLib(protoInstance, "cpp_api_to_proto", transaction);
  const parsedProtoOp = testLib(protoInstance, "cpp_api_to_proto", JSON.stringify(vote_operation));
  assert.deepEqual(JSON.parse(parsedProtoTx), JSON.parse(protoTx));
  assert.deepEqual(JSON.parse(parsedProtoOp), protoOps[0]);

  const parsedApiTx = testLib(protoInstance, "cpp_proto_to_api", protoTx);
  const parsedApiOp = testLib(protoInstance, "cpp_proto_to_api", JSON.stringify(protoOps[0]));
  assert.deepEqual(JSON.parse(parsedApiTx), JSON.parse(transaction));
  assert.deepEqual(JSON.parse(parsedApiOp), vote_operation);

  const extensionOperationTest = testLib(protoInstance, "cpp_proto_to_api", protoRecurrentTransferOperation);
  testLib(instance, "cpp_validate_operation", extensionOperationTest);

  const bidirectionalExtensionsTest = testLib(protoInstance, "cpp_api_to_proto", testLib(protoInstance, "cpp_proto_to_api", protoRecurrentTransferOperation));
  assert.deepEqual(JSON.parse(bidirectionalExtensionsTest), JSON.parse(protoRecurrentTransferOperation));
};

my_entrypoint()
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
