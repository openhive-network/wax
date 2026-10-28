// This is a workaround for https://github.com/microsoft/playwright/issues/18282#issuecomment-1612266345
import { defineConfig } from '@playwright/test';
import type { IWaxedTest, IWaxedWorker } from './wasm/__tests__/assets/jest-helper';
import { API_REPLAY_PORT } from './wasm/__tests__/assets/api-traffic';

export default defineConfig<IWaxedTest, IWaxedWorker>({
  fullyParallel: true,
  timeout: 60000, // 60s timeout to handle CI load variability
  reporter: [
    ['junit', { outputFile: 'results.xml' }],
    ['json',  { outputFile: 'results.json' }]
  ],
  projects: [
    {
      name: "wax_testsuite",
      testDir: "./wasm/dist",
      use:
      {
        config: {
          apiEndpoint: "https://api.hive.blog",
          restApiEndpoint: "https://api.hive.blog",
          chainId: "beeab0de00000000000000000000000000000000000000000000000000000000"
        }
      }

    },
    {
      name: "wax_testsuite_custom_chain_options",
      testDir: "./wasm/dist",
      testMatch: "hive_chain_custom_opts*",
      use:
      {
        config: {
          apiEndpoint: "https://api.hive.blog/",
          restApiEndpoint: "https://api.hive.blog/",
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
          restApiEndpoint: "https://api.hive.blog/", /// really not yet supported but ignored in this test group
          chainId: "42"
        }
      }
    },
    {
      name: "wax_hive_assertion",
      testDir: "./wasm/dist",
      testMatch: "hive_assertion*",
    },
    {
      name: "wax_regression_tests",
      testDir: "./wasm/dist",
      testMatch: "regression_hive_operations*"
    },
    {
      // Checks behaviour of a live node, so it is not given recorded responses
      name: "healthchecker_tests",
      testDir: "./wasm/dist",
      testMatch: "healthchecks*",
      use:
      {
        liveApi: true
      }
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
      name: "wax_signers_csp",
      testDir: "./wasm/dist",
      testMatch: "signers_csp*"
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
      fullyParallel: false,
      use:
      {
        config: {
          apiEndpoint: "http://localhost:8000/",
          restApiEndpoint: "https://unusedendpoint/",
          chainId: "beeab0de00000000000000000000000000000000000000000000000000000000"
        }
      }

    },
    {
      name: "wax_api_caller_header_test",
      testDir: "./wasm/dist",
      testMatch: "wax_api_caller_header*",
      use:
      {
        config: {
          apiEndpoint: "https://api.hive.blog",
          restApiEndpoint: "https://api.hive.blog",
          chainId: "beeab0de00000000000000000000000000000000000000000000000000000000",
          waxApiCaller: "test-wax-client-v1.0"
        }
      }
    }
  ],
  webServer: [
    // Run your local dev server before starting the tests
    {
      command: 'npm run testserver'
    },
    // Serves the recorded API node responses, see wasm/__tests__/assets/api-traffic.ts
    {
      command: 'pnpm exec tsx wasm/__tests__/assets/start-api-replay-server.ts',
      port: API_REPLAY_PORT,
      stderr: 'pipe',
      gracefulShutdown: { signal: 'SIGINT', timeout: 2000 }
    }
  ]
});
