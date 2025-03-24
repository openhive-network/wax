import { chromium, test as base, type BrowserContext } from "@playwright/test";
import { dirname } from "path";
import { fileURLToPath } from "url";

import { type TTestAccountAuthorityData, prepareTestingEnvironemnt } from "../../common-data"; 

export const test = base.extend<{
  context: BrowserContext,
  extensionId: string
  ,baseDirectoryPath: string
  ,testedAccountAuthorityData: TTestAccountAuthorityData
}>({
  context: async ({}, use) => {
    console.log('Launched browser');
    const browserContext = await chromium.launchPersistentContext('', { headless: typeof process.env.PLAYWRIGHT_HEADLESS === "undefined" });

    console.log('Before use browserContext');
    await use(browserContext);

    console.log('Attempting to close browserContext');
    await browserContext.close();
  },
  extensionId: async ({ context }, use) => {
    let [background] = context.serviceWorkers();
    if (!background)
      background = await context.waitForEvent('serviceworker');

    const extensionId = background.url().split('/')[2];
    await use(extensionId);
  },
  baseDirectoryPath: async ({}, use) => {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    await use(__dirname);
  },
  testedAccountAuthorityData: async ({}, use) => {
    const data = await prepareTestingEnvironemnt();
    await use(data);
  }
});
