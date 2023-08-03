import { strict as assert } from 'assert';

import Module from '../../build_wasm/wax_wasm.mjs';

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

const numToHighLow = num => [
  (num | 0) & 0xFFFFFFFF,
  ((num | 0) / 0x100000000) | 0
];

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
};

my_entrypoint()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
