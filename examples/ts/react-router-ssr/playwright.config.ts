// This is a workaround for https://github.com/microsoft/playwright/issues/18282#issuecomment-1612266345
import { defineConfig } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: "wax_react_ssr_testsuite",
      testDir: "./__tests__"
    }
  ],
  // Run your local dev server before starting the tests
  webServer: {
    command: 'npm run dev',
    url: "http://127.0.0.1:3000",
    timeout: 120 * 1000,
    reuseExistingServer: false
  }
});
