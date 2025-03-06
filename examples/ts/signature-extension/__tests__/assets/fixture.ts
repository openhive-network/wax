import { chromium, test as base, type BrowserContext } from "@playwright/test";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

export const test = base.extend<{
  context: BrowserContext,
  extensionId: string
}>({
  context: async ({}, use) => {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const pathToExtension = path.join(__dirname, "../extensions/Hive-Keychain-Chrome-Web-Store");

    const browserContext = await chromium.launchPersistentContext('', {
      headless: false,
      args: [
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
        '--headless=chromium'
      ],
      ignoreDefaultArgs: ['--disable-component-extensions-with-background-pages'],
    });

    await use(browserContext);

    await browserContext.close();
  },
  extensionId: async ({ context }, use) => {
    let [background] = context.serviceWorkers();
    if (!background)
      background = await context.waitForEvent('serviceworker');

    const extensionId = background.url().split('/')[2];
    await use(extensionId);
  },
});
