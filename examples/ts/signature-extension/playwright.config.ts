import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './__tests__',

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'npm run test:manual'
  }
});
