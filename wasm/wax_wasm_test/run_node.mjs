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
    comment: {
      parent_permlink: "/",
      author: "alice",
      permlink: "/",
      title: "Best comment",
      body: "<span>comment</span>",
      json_metadata: "{}"
    }
  },
  {
    vote: {
      voter: "bob",
      author: "alice",
      permlink: "/",
      weight: 1
    }
  }
];

const protoTx = JSON.stringify({
  operations: protoOps
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
  const instance = new provider.protocol();

  const testLib = (name, ...args) => {
    console.debug(`\nTesting protocol::${name}`);

    const result = instance[name](...args);

    if(result.value !== provider.error_code.ok) {
      console.error(`Failed. Error message: "${result.exception_message}"`);
      assert.equal(false);
    }

    console.info(`>> ${result.content}`);
    return result.content;
  };

  const privateKey = testLib("cpp_generate_private_key");
  assert.ok(privateKey); // Test if string is valid

  const publicKey = testLib("cpp_calculate_public_key", privateKey);
  assert.match(publicKey, /^[1-9A-HJ-NP-Za-km-z]+$/m); // test base58 string

  const txId = testLib("cpp_calculate_transaction_id", transaction);
  assert.equal(txId, "da8ca54c9c3acad06915ae9d93988c367f5cd164"); // Check if transaction ids match

  const serialized = testLib("cpp_serialize_transaction", transaction);
  assert.equal(serialized, "ff86c404c24b152fb7610100046f746f6d076330666633336108657778686e6a626a980800"); // check serialized hex

  const sigDigest = testLib("cpp_calculate_sig_digest", transaction, "beeab0de00000000000000000000000000000000000000000000000000000000");
  assert.equal(sigDigest, "1394412814ea3e444f65c46f075e15b9b82e6bea9241319b02743a8e593219e1");

  testLib("cpp_validate_operation", JSON.stringify(vote_operation)); // validate single operation in json format

  testLib("cpp_validate_transaction", transaction); // validate entire transaction

  testLib("cpp_calculate_manabar_full_regeneration_time", 0, ...numToHighLow(100), ...numToHighLow(100), 0);

  testLib("cpp_calculate_current_manabar_value", 0, ...numToHighLow(100), ...numToHighLow(100), 0);

  protoOps.forEach(op => void testLib("cpp_validate_proto_operation", JSON.stringify(op)));

  testLib("cpp_validate_proto_transaction", protoTx);

  instance.cpp_validate_proto_operation("{}"); // Test if no segfault occurs
  instance.cpp_validate_proto_transaction("{}"); // Test if no segfault occurs

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
};

my_entrypoint()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
