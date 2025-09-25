import { expect } from '@playwright/test';

import { test } from '../assets/jest-helper';

test.describe('Wax object interface chain REST API tests', () => {
  test('Should be able to call basic REST API endpoint', async ({ waxTest }) => {
    const retVal = await waxTest.dynamic(async({ chain }) => {
      const blocks = await chain.restApi['hafbe-api'].operationTypeCounts({ "result-limit": 1 });

      return blocks;
    });

    expect(retVal.length).toBeGreaterThan(0);
    expect(typeof retVal[0].block_num).toBe("number");
    expect(typeof retVal[0].witness).toBe("string");
    expect(retVal[0].operations.length).toBeGreaterThan(0);
    expect(typeof retVal[0].operations[0].op_count).toBe("number");
    expect(typeof retVal[0].operations[0].op_type_id).toBe("number");
  });

  test('Should be able to extend and perform REST API calls', async ({ waxTest }) => {
    const retVal = await waxTest.dynamic(async({ chain }) => {
      class TransactionByIdRequest {
        public transactionId!: string;
      }

      class DummyResponse {
        public transaction_json!: object;
      }

      const extended = chain.extendRest({
        'hafah-api': {
          transactions: {
            transactionId: {
              params: TransactionByIdRequest,
              result: DummyResponse,
              urlPath: "{transactionId}"
            }
          }
        }
      });

      const blocks = await extended.restApi['hafah-api'].transactions.transactionId({ transactionId: "954f6de36e6715d128fa8eb5a053fc254b05ded0" });

      return blocks;
    });

    expect(typeof retVal).toBe("object");
    expect(typeof retVal.transaction_json).toBe("object");
    expect(retVal.transaction_json !== null).toBeTruthy();
  });

  test('Should be able to extend and perform REST API calls returning array of array', async ({ waxTest }) => {
    const retVal = await waxTest.dynamic(async({ chain }) => {
      class RestGetOperationKeysParamsReq{
        public typeId!: number;
      }

      const extended = chain.extendRest({
        'hafah-api': {
          operationTypes: {
            urlPath: 'operation-types',
            typeId: {
              urlPath: '{typeId}',
              keys: {
                params: RestGetOperationKeysParamsReq,
                result: Array<string>,
                responseArray: true
              },
            }
          }
        }
      });

      const operations = await extended.restApi['hafah-api'].operationTypes.typeId.keys({ typeId: 1 });

      return operations;
    });

    expect(Array.isArray(retVal)).toBeTruthy();
    expect(Array.isArray(retVal[0])).toBeTruthy();
  });

  test('Should be able to extend and perform REST API calls returning INT', async ({ waxTest }) => {
    const retVal = await waxTest.dynamic(async({ chain }) => {
      const extended = chain.extendRest({
        'hafah-api': {
          headblock: {
            params: undefined,
            result: Number
          }
        }
      });

      const blockNum: number = await extended.restApi['hafah-api'].headblock();

      return blockNum;
    });

    expect(typeof retVal).toBe("number");
  });

  test('Should be able to call concurrently same REST API multiple times with same URL', async ({ waxTest }) => {
    const urls = await waxTest(async({ chain }) => {
      const extended = chain.extendRest({
        'hafah-api': {
          headblock: {
            params: undefined,
            result: Number
          }
        }
      });

      const getPromise = () => new Promise((resolve, reject) => {
        let requestUrl: string;

        ((extended.restApi['hafah-api'].headblock as any)._target.withProxy(data => { requestUrl = data.url; return data; }, data => data)() as Promise<any>).then(() => {
          resolve(requestUrl);
        }).catch(reject);
      });

      const urls = await Promise.all([
        getPromise(),
        getPromise(),
        getPromise(),
        getPromise(),
        getPromise()
      ]);

      return urls;
    });

    expect(urls.every(node => node === urls[0])).toBeTruthy();
  });

  test('Should be able to extend REST API, then extend standard API and keep all of the types', async ({ waxTest }) => {
    const retVal = await waxTest(async({ chain }) => {
      // First extend REST API
      const extended1 = chain.extendRest({
        a: {
          b: {
            params: undefined,
            result: undefined
          }
        }
      });

      // Then extend standard Node API - types from extended REST API should be preserved
      const extended2 = extended1.extend({
        a: {
          b: {
            params: {},
            result: {}
          }
        }
      })

      // This is more of a "static" compilation test - should compile successfully - tests if types has not been dropped
      return typeof extended2.restApi.a.b;
    });

    expect(retVal).toBe("function");
  });

  test('Should be able to extend REST API via interfaces', async ({ waxTest }) => {
    const retVal = await waxTest(async({ chain }) => {
      // First extend REST API using interfaces only
      const extended1 = chain.extendRest<{
        'hafah-api': {
          headblock: {
            params: undefined,
            result: number
          }
        }
      }>();

      // Then extend REST API using interfaces and providing additional urlPath data
      const extended2 = extended1.extendRest<{
        'hafah-api': {
          transactions: {
            transactionId: {
              params: { transactionId: string; };
              result: { transaction_json: object; };
            }
          }
        }
      }>({
        'hafah-api': {
          transactions: {
            transactionId: {
              urlPath: "{transactionId}"
            }
          }
        }
      });

      const getPromise1 = () => new Promise((resolve, reject) => {
        let requestUrl: string;

        ((extended2.restApi['hafah-api'].headblock as any)._target.withProxy(data => { requestUrl = data.endpoint + data.url; return data; }, data => data)() as Promise<any>).then(() => {
          resolve(requestUrl);
        }).catch(reject);
      });

      const getPromise2 = () => new Promise((resolve, reject) => {
        let requestUrl: string;

        ((extended2.restApi['hafah-api'].transactions.transactionId as any)._target.withProxy(data => { requestUrl = data.endpoint + data.url; return data; }, data => data)({
          transactionId: "954f6de36e6715d128fa8eb5a053fc254b05ded0"
        }) as Promise<any>).then(() => {
          resolve(requestUrl);
        }).catch(reject);
      });

      const urls = await Promise.all([
        getPromise1(),
        getPromise2()
      ]);

      return urls;
    });

    expect(retVal).toStrictEqual([
      "https://api.hive.blog/hafah-api/headblock",
      "https://api.hive.blog/hafah-api/transactions/954f6de36e6715d128fa8eb5a053fc254b05ded0"
    ]);
  });

  test('Should be able to properly override using urlPath for trailing slash URL', async ({ waxTest }) => {
    const retVal = await waxTest(async({ chain }) => {
      // First extend REST API using interfaces only
      const extended1 = chain.extendRest<{
        'hivesense-api': {
          params: undefined,
          result: boolean
        }
      }>({
        'hivesense-api': {
          urlPath: 'hivesense-api/'
        }
      });

      const getPromise1 = async () => {
        let requestUrl: string | undefined = undefined;

        try {
          await ((extended1.restApi['hivesense-api'] as any)._target.withProxy(data => { requestUrl = data.endpoint + data.url; return data; }, data => data)() as Promise<any>);
        } catch {}

        return requestUrl ?? "(could not determine API endpoint)";
      };

      return getPromise1();
    });

    expect(retVal).toStrictEqual(
      "https://api.hive.blog/hivesense-api/" // Note: Non-standard trailing slash at the end
    );
  });

  test('Should be able to set REST API endpoint URL', async ({ waxTest }) => {
    const url1 = "https://best.honey.provider";

    const retVal = await waxTest(async({ chain }, url1) => {
      chain.restApi.endpointUrl = url1;

      return chain.restApi.endpointUrl;
    }, url1);

    expect(retVal).toBe(url1);
  });

  test('Should be able to create a callable top-level rest api', async ({ waxTest }) => {
    const retVal = await waxTest(async({ chain }) => {
      const extended = chain.extendRest<{
        a: {
          params: undefined;
          result: string;

          b: {
            params: undefined;
            result: number;
          }
        }
      }>();

      try {
        await extended.restApi.a(); // Compilation should fail here before running if callable top-level is not possible
        await extended.restApi.a.b(); // If something went wrong, also this should fail
      } catch {}

      return [typeof extended.restApi.a, typeof extended.restApi.a.b];
    });

    expect(retVal).toStrictEqual(["function", "function"]);
  });

  test('Should be able to set REST API endpoint URL on different APIs', async ({ waxTest }) => {
    const url1 = "https://best.honey.provider";
    const url2 = "https://other.honey.provider";

    const retVal = await waxTest(async({ chain }, url1, url2) => {
      chain.restApi['hafbe-api'].witnesses.endpointUrl = url1;
      chain.restApi['hafbe-api'].witnesses.accountName.endpointUrl = url2;

      return [chain.restApi.endpointUrl, chain.restApi['hafbe-api'].witnesses.endpointUrl, chain.restApi['hafbe-api'].witnesses.accountName.endpointUrl];
    }, url1, url2);

    expect(retVal).toStrictEqual(["https://api.hive.blog", url1, url2]);
  });
});
