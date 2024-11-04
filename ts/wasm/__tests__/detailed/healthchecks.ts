import { ChromiumBrowser, ConsoleMessage, chromium } from 'playwright';
import { expect } from '@playwright/test';

import { test } from '../assets/jest-helper';
import { IScoredEndpoint } from '../../dist/bundle/index-full';

let browser!: ChromiumBrowser;

test.describe('Wax object interface chain tests', () => {
  test.beforeAll(async () => {
    browser = await chromium.launch({
      headless: true
    });
  });

  test.beforeEach(async({ page }) => {
    page.on('console', (msg: ConsoleMessage) => {
      console.log('>>', msg.type(), msg.text())
    });

    await page.goto("http://localhost:8080/wasm/__tests__/assets/test.html", { waitUntil: "load" });
  });

  test('Should be able to create endpoint healthchecker', async ({ waxTest }) => {
    const testEndpoint = "https://api.hive.blog";

    const retVal = await waxTest(({ wax, chain }, testEndpoint) => {
      return new Promise<string>((resolve, reject) => {
        const hc = new wax.HealthChecker();

        hc.on("newbest", ({ endpointUrl }) => { hc.unregisterAll(); resolve(endpointUrl); }); // New best endpoint url
        hc.on("data", (data: Array<IScoredEndpoint>) => { console.log(JSON.stringify(data)); }); // New data from all endpoint checks - scores ready
        hc.on("error", error => { hc.unregisterAll(); reject(error);}); // Error handled

        hc.register(chain.api.block_api.get_block, { block_num: 1 }, data => data.block?.previous === "0000000000000000000000000000000000000000", [testEndpoint]);
      });
    }, testEndpoint);

    expect(retVal).toStrictEqual("https://api.hive.blog");
   });

  test('Should be able to create endpoint healthchecker and retrieve data 2 times', async ({ waxTest }) => {
    const testEndpoint = "https://api.hive.blog";

    const retVal = await waxTest(({ wax, chain }, testEndpoint) => {
      return new Promise<string>((resolve, reject) => {
        const hc = new wax.HealthChecker();

        let i = 0;

        hc.on("data", (data: Array<IScoredEndpoint>) => {
          ++i;

          if (i === 2) {
            hc.unregisterAll();
            resolve(data[0].endpointUrl);
          }
        });
        hc.on("error", error => { hc.unregisterAll(); reject(error);}); // Error handled

        hc.register(chain.api.block_api.get_block, { block_num: 1 }, data => data.block?.previous === "0000000000000000000000000000000000000000", [testEndpoint]);
      });
    }, testEndpoint);

    expect(retVal).toStrictEqual("https://api.hive.blog");
  });

   test('Should be able to create REST call healthchecker (common enpdoint)', async ({ waxTest }) => {
    const testEndpoint = "https://api.syncad.com";

    const retVal = await waxTest(({ wax, chain }, testEndpoint) => {
      return new Promise<string>((resolve, reject) => {
        const hc = new wax.HealthChecker([testEndpoint]);

        hc.on("newbest", ({ endpointUrl }) => {
          console.log(`REST common endpoint test found new best endpoint: ${endpointUrl}`);
          hc.unregisterAll();
          resolve(endpointUrl);
          }); // New best endpoint url
        hc.on("data", (data: Array<IScoredEndpoint>) => {
          const scoredData = JSON.stringify(data);
          console.log(`REST common endpoint test, acquired stats: ${scoredData}`);
          }); // New data from all endpoint checks - scores ready
        hc.on("error", (error) => {hc.unregisterAll(); reject(error);}); // Error handled

        hc.register(chain.restApi['hafbe-api'].operationTypeCounts, { "result-limit": 1 }, data => data[0].block_num !== 1);
      });
    }, testEndpoint);

    expect(retVal).toStrictEqual("https://api.syncad.com");
   });

   test('Should be able to create REST endpoint healthchecker (explicit endpoint)', async ({ waxTest }) => {
    const testEndpoint = "https://api.syncad.com";

    const retVal = await waxTest(({ wax, chain }, testEndpoint) => {
      return new Promise<string>((resolve, reject) => {
        const hc = new wax.HealthChecker();

        hc.on("newbest", ({ endpointUrl }) => {
          console.log(`REST explicit endpoint test found new best endoint: ${endpointUrl}`);
          hc.unregisterAll();
          resolve(endpointUrl);
          }); // New best endpoint url
        hc.on("data", (data: Array<IScoredEndpoint>) => {
          const scoredData = JSON.stringify(data);
          console.log(`REST explicit endpoint test, acquired stats: ${scoredData}`);
          }); // New data from all endpoint checks - scores ready
        hc.on("error", (error) => {hc.unregisterAll(); reject(error);}); // Error handled

        hc.register(chain.restApi['hafbe-api'].operationTypeCounts, { "result-limit": 1 }, data => data[0].block_num !== 1, [testEndpoint]);
      });
    }, testEndpoint);

    expect(retVal).toStrictEqual("https://api.syncad.com");
   });

   test('Should be able to handle multithreaded calls - should not exceed the timeout', async ({ waxTest }) => {
    const testEndpoint = "https://api.hive.blog";

    // This test can take up 30 seconds per testing environment (web + node = ~60s)
    test.setTimeout(60_000);

    const retVal = await waxTest(({ wax, chain }, testEndpoint) => {
      return new Promise<string>(async(resolve, reject) => {
        const hc = new wax.HealthChecker([testEndpoint]);

        hc.on("error", (error) => {hc.unregisterAll(); reject(error);}); // Error handled

        hc.register(chain.api.block_api.get_block, { block_num: 1 }, data => data.block?.previous === "0000000000000000000000000000000000000000", [testEndpoint]),
        hc.register(chain.api.block_api.get_block_header, { block_num: 1 }, data => data.header.previous === "0000000000000000000000000000000000000000", [testEndpoint]),
        hc.register(chain.api.block_api.get_block_range, { starting_block_num: 1, count: 1 }, data => data.blocks[0]?.previous === "0000000000000000000000000000000000000000", [testEndpoint])
        await new Promise(newDataRes => hc.on('data', newDataRes ));
        await new Promise(promiseRes => setTimeout(promiseRes, 10_000));
        hc.unregisterAll();
        hc.unregisterAll();
        hc.unregisterAll();
        // Register again and wait for data
        hc.register(chain.api.block_api.get_block, { block_num: 1 }, data => data.block?.previous === "0000000000000000000000000000000000000000", [testEndpoint]);
        // This should result in a new best endpoint
        hc.on("data", (data: Array<IScoredEndpoint>) => { hc.unregisterAll(); resolve(data[0].endpointUrl); });
      });
    }, testEndpoint);

    expect(retVal).toStrictEqual("https://api.hive.blog");
   });

  test.afterAll(async () => {
    await browser.close();
  });
});
