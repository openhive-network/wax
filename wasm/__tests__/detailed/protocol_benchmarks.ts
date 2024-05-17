import fs from 'node:fs';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import WaxModule, { protocol } from '../../dist/lib/wax_module.js';
import { test } from '../assets/jest-helper';
import { numToHighLow, specificBenchmarkTransaction, vote_operation } from "../assets/data.protocol";
import { createHiveChain, IHiveChainInterface } from '../../dist/bundle/web-full';
import { MainModule } from '../../dist/lib/wax_module.js';

interface IBenchmarkData {
  functionName: string;
  totalCallsCount: number;
  totalTime: number;
  averageTime: number;
}

let totalExecutingTime = 0;

let provider!: MainModule;
let protocol!: protocol;
let chain!: IHiveChainInterface;

let transaction!: string;

const __dirname = dirname(fileURLToPath(import.meta.url));
const statBundle = fs.statSync(path.resolve(__dirname, '../bundle/web-full.js'));

const collectedBenchmarkData: (IBenchmarkData | string)[] = [
  `web-full.js file size: ${statBundle.size} bytes`
];

const utilFunctionTest = (functionName: string, totalCallsCount: number, functionToTest: () => number): void => {
  const start = Date.now();

  functionToTest();

  const tookMs = Date.now() - start;
  totalExecutingTime += tookMs;

  const averageTime = +(tookMs / totalCallsCount).toFixed(3);

  collectedBenchmarkData.push({
    functionName: functionName,
    totalCallsCount: totalCallsCount,
    totalTime: tookMs,
    averageTime: averageTime
  });

  console.log(
    `${functionName} executing time for 1_500 function calls: ${tookMs} ms`,
    `${functionName} average executing time for one function call: ${averageTime} ms`
  );
}

test.describe('WASM Protocol benchmarks', () => {
  test.beforeAll(async () => {
    provider = await WaxModule();
    protocol = new provider.protocol();
    chain = await createHiveChain();

    transaction = JSON.stringify(new chain.TransactionBuilder("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48").push(specificBenchmarkTransaction).build());
  });

  test('Should be able to generate random private key', () =>  {
    let noDiscard = 0;

    utilFunctionTest('Generate private key', 1_500, () => {
      for(let i = 0; i < 1500; ++i)
        noDiscard += (protocol.cpp_generate_private_key().content as string).length % 10 + i;

      return noDiscard;
    });

    console.log(noDiscard);
  });

  test('Should be able to calculate public key', () => {
    const privateKey = protocol.cpp_generate_private_key().content as string;

    let noDiscard = 0;

    utilFunctionTest('Calculate public key', 15_000, () => {
      for(let i = 0; i < 15_000; ++i)
        noDiscard += (protocol.cpp_calculate_public_key(privateKey).content as string).length % 10 + i;

      return noDiscard;
    });

    console.log(noDiscard);
  });

  test('Should be able to calculate the transaction id', () => {
    let noDiscard = 0;

    utilFunctionTest('Calculate transaction id', 7_500, () => {
      for(let i = 0; i < 7_500; ++i)
        noDiscard += (protocol.cpp_calculate_transaction_id(transaction).content as string).length % 10 + i;

      return noDiscard;
    });

    console.log(noDiscard);
  });

  test('Should be able to serialize the transaction', () => {
    let noDiscard = 0;

    utilFunctionTest('Serialize transaction', 7_500, () => {
      for(let i = 0; i < 7_500; ++i)
        noDiscard += (protocol.cpp_serialize_transaction(transaction).content as string).length % 10 + i;

      return noDiscard;
    });

    console.log(noDiscard);
  });

  test('Should be able to calculate sig digest of the transaction', async () => {
    let noDiscard = 0;

    utilFunctionTest('Calculate sig digest', 7_500, () => {
      for(let i = 0; i < 7_500; ++i)
        noDiscard += (protocol.cpp_calculate_sig_digest(transaction, 'beeab0de00000000000000000000000000000000000000000000000000000000').content as string).length % 10 + i;

      return noDiscard;
    });

    console.log(noDiscard);
  });

  test('Should be able to validate example operation', () => {
    let noDiscard = 0;

    utilFunctionTest('Validate operation', 100_000, () => {
      for(let i = 0; i < 100_000; ++i)
        noDiscard += (protocol.cpp_validate_operation(JSON.stringify(vote_operation)).content as string).length % 10 + i;

      return noDiscard;
    });

    console.log(noDiscard);
  });

  test('Should be able to validate example transaction', () => {
    let noDiscard = 0;

    utilFunctionTest('Validate transaction', 7_500, () => {
      for(let i = 0; i < 7_500; ++i)
        noDiscard += (protocol.cpp_validate_transaction(transaction).content as string).length % 10 + i;

      return noDiscard;
    });

    console.log(noDiscard);
  });

  test('Should be able to calculate manabar full regeneration time', () => {
    let noDiscard = 0;

    utilFunctionTest('Calculate manabar full regeneration time', 2_000_000, () => {
      for(let i = 0; i < 2_000_000; ++i)
        noDiscard += (protocol.cpp_calculate_manabar_full_regeneration_time(0 + i, ...numToHighLow(100_000), ...numToHighLow(100_000), 0).content as string).length % 10;

      return noDiscard;
    });

    console.log(noDiscard);
  });

  test('Should be able to calculate the current manabar full regeneration time', () => {
    let noDiscard = 0;

    utilFunctionTest('Calculate current manabar value', 3_000_000, () => {
      for(let i = 0; i < 3_000_000; ++i)
        noDiscard += (protocol.cpp_calculate_current_manabar_value(0 + i, ...numToHighLow(100_000), ...numToHighLow(100_000), 0).content as string).length % 10;

      return noDiscard;
    });

    console.log(noDiscard);
  });

  test('Should be able to create Hive in NAI form', () => {
    let noDiscard = 0;

    utilFunctionTest('Create HIVE in NAI form', 2_000_000, () => {
      for(let i = 0; i < 2_000_000; ++i)
        noDiscard += (protocol.cpp_hive(...numToHighLow(100 + i)).amount as string).length % 10;

      return noDiscard;
    });

    console.log(noDiscard);
  });

  test('Should be able to create HBD in NAI form', () => {
    let noDiscard = 0;

    utilFunctionTest('Create HBD in NAI form', 2_000_000, () => {
      for(let i = 0; i < 2_000_000; ++i)
        noDiscard += (protocol.cpp_hbd(...numToHighLow(100 + i)).amount as string).length % 10;

      return noDiscard;
    });

    console.log(noDiscard);
  });

  test('Should be able to create VESTS in NAI form', () => {
    let noDiscard = 0;

    utilFunctionTest('Create VESTS in NAI form', 2_000_000, () => {
      for(let i = 0; i < 2_000_000; ++i)
        noDiscard += (protocol.cpp_vests(...numToHighLow(100 + i)).amount as string).length % 10;

      return noDiscard;
    });

    console.log(noDiscard);
  });

  test('Should be able to create custom general asset in NAI form', () => {
    let noDiscard = 0;

    utilFunctionTest('Create custom asset in NAI form', 2_000_000, () => {
      for(let i = 0; i < 2_000_000; ++i)
        noDiscard += Number(protocol.cpp_general_asset(3200000035, ...numToHighLow(10 + i)).amount);

      return noDiscard;
    });

    console.log(noDiscard);
  });

  test('Should be able to calculate HP APR', () => {
    const virtual_supply = protocol.cpp_hive(...numToHighLow(530_656_835_180));
    const total_vesting_fund_hive = protocol.cpp_hive(...numToHighLow(173_009_633_181));
    let noDiscard = 0;

    utilFunctionTest('Calculate HP APR', 300_000, () => {
      for(let i = 0; i < 300_000; ++i)
        noDiscard += (protocol.cpp_calculate_hp_apr(1_000_000 + i, 1_500, virtual_supply, total_vesting_fund_hive).content as string).length % 10;

      return noDiscard;
    });

    console.log(noDiscard);
  });

  test('Should be able to calculate account hp', () => {
    const vests = protocol.cpp_vests(...numToHighLow(1_100_000_000));
    const total_vesting_fund_hive = protocol.cpp_hive(...numToHighLow(100_000_000_000));
    const total_vesting_shares = protocol.cpp_vests(...numToHighLow(100_000));
    let noDiscard = 0;

    utilFunctionTest('Calculate account hp', 300_000, () => {
      for(let i = 0; i < 300_000; ++i)
        noDiscard += (protocol.cpp_calculate_account_hp(vests, total_vesting_fund_hive, total_vesting_shares).amount as string).length % 10 + i;

      return noDiscard;
    });

    console.log(noDiscard);
  });

  test('Should be able to calculate witness vote hp', () => {
    const total_vesting_fund_hive = protocol.cpp_hive(...numToHighLow(100_000));
    const total_vesting_shares = protocol.cpp_vests(...numToHighLow(100_000_000_000));
    let noDiscard = 0;

    utilFunctionTest('Calculate witness vote hp', 300_000, () => {
      for(let i = 0; i < 15_000; ++i)
        noDiscard += (protocol.cpp_calculate_witness_votes_hp(...numToHighLow(1_100_000_000 + i), total_vesting_fund_hive, total_vesting_shares).amount as string).length % 10;

      return noDiscard;
    });

    console.log(noDiscard);
  });

  test('Should be able to calculate inflation rate for block', () => {
    let noDiscard = 0;

    utilFunctionTest('Calculate inflation rate', 5_000_000, () => {
      for(let i = 0; i < 250_000; ++i)
        noDiscard += (protocol.cpp_calculate_inflation_rate_for_block(1_000_000 + i).content as string).length % 10;

      return noDiscard;
    });

    console.log(noDiscard);
  });

  test.afterAll(async () => {
    const benchmarkDataPath = path.resolve(__dirname, '../../__tests__/detailed/benchmark-data');

    if(!fs.existsSync(benchmarkDataPath))
      fs.mkdirSync(benchmarkDataPath);

    fs.writeFileSync(path.resolve(benchmarkDataPath, `benchmark-data-${Date.now()}.json`), JSON.stringify(collectedBenchmarkData, undefined, 2));

    console.log(`Total execution time: ${totalExecutingTime / 1000} s`);
  });
});
