// This is a workaround for https://github.com/microsoft/playwright/issues/18282#issuecomment-1612266345
import { defineConfig } from '@playwright/test';
import { IWaxedTest } from './wasm/__tests__/assets/jest-helper';

export default defineConfig<IWaxedTest>({
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
