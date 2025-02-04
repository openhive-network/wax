// This is a workaround for https://github.com/microsoft/playwright/issues/18282#issuecomment-1612266345
import { defineConfig } from '@playwright/test';
import { IWaxedTest } from './wasm/__tests__/assets/jest-helper';

export default defineConfig<IWaxedTest>({
  fullyParallel: true,
  reporter: [
    ['junit', { outputFile: 'results.xml' }],
    ['json',  { outputFile: 'results.json' }]
  ],
  projects: [
    {
      name: "wax_testsuite",
      testDir: "./wasm/dist"
    },
    {
      name: "wax_testsuite_custom_chain_options",
      testDir: "./wasm/dist",
      testMatch: "hive_chain_custom_opts*",
      use:
      {
        config: {
          apiEndpoint: "https://api.hive.blog/",
          restApiEndpoint: "https://api.syncad.com/",
          chainId: "beeab0de00000000000000000000000000000000000000000000000000000000"
        }
      }
    },
    {
      name: "wax_custom_chain_online_tx",
      testDir: "./wasm/dist",
      testMatch: "custom_chain_online_tx*",
      use:
      {
        config: {
          apiEndpoint: "https://api.fake.openhive.network/",
          restApiEndpoint: "https://api.fake.openhive.network/", /// really not yet supported but ignored in this test group
          chainId: "42"
        }
      }
    },
    {
      name: "wax_regression_tests",
      testDir: "./wasm/dist",
      testMatch: "regression_hive_operations*"
    },
    {
      name: "healthchecker_tests",
      testDir: "./wasm/dist",
      testMatch: "healthchecks*"
    },
    {
      name: "wax_testsuite_protocol_benchmarks",
      testDir: "./wasm/dist",
      testMatch: "protocol_benchmarks*"
    },
    {
      name: "wax_operation_factories",
      testDir: "./wasm/dist",
      testMatch: "complex_operations*"
    },
    {
      name: "wax_encrypted_operations",
      testDir: "./wasm/dist",
      testMatch: "encrypted_operations*"
    },
    {
      name: "wax_non_encrypted_operations",
      testDir: "./wasm/dist",
      testMatch: "non_encrypted_operations*"
    },
    {
      name: "wax_utils",
      testDir: "./wasm/dist/detailed",
      testMatch: "utils*"
    },
    {
      name: 'wax_mock_tests',
      testDir: './wasm/dist',
      testMatch: 'mock*',
      use:
      {
        config: {
          apiEndpoint: "http://localhost:8000/",
          restApiEndpoint: "https://unusedendpoint/",
          chainId: "beeab0de00000000000000000000000000000000000000000000000000000000"
        }
      }

    }
  ],
  // Run your local dev server before starting the tests
  webServer: {
    command: 'npx http-server'
  }
});
