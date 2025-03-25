import { defineConfig, devices } from '@playwright/test';

import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pathToExtension = path.join(__dirname, "./__tests__/extensions/Hive-Keychain");

console.log(`Effective extension directory: ${pathToExtension}`);


export default defineConfig({
  testDir: './__tests__',

  projects: [
    {
      name: 'keychain signing tests',
      use: { ...devices['Desktop Chrome'], channel: 'chromium',
        launchOptions: {
          args: [
            `--load-extension=${pathToExtension}`
            ,`--disable-extensions-except=${pathToExtension}`
          ],
          ignoreDefaultArgs: ['--disable-component-extensions-with-background-pages'],
        },
      },
    },
  ],

  webServer: {
    command: 'npm run test:manual',
    "url": "http://localhost:1234",
    "timeout": 120*1000,
    "reuseExistingServer": false
  }
});
