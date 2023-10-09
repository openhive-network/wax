import { ConsoleMessage, chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';
import { Parcel } from '@parcel/core';

declare type ExamplesWindow = typeof window & typeof globalThis & { exampleFinished?: true };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configFor = (name: string) => ({
  entries: path.resolve(__dirname, `assets/${name}.html`),
  defaultConfig: '@parcel/config-default',
  mode: 'production',
  env: {
    NODE_ENV: 'production'
  }
});

(async () => {
  const browser = await chromium.launch({
    headless: true
  });
  const page = await browser.newPage();
  page.on('console', (msg: ConsoleMessage) => {
    console.log('>>', msg.type(), msg.text())
  });

  const open = async (what: string) => {
    console.debug(`Opening '${what}'`);
    const bundle = new Parcel(configFor(what));
    await bundle.run();
    console.debug('Bundled');
    await page.goto(`file://${__dirname}/dist/${what}.html`);
    await page.waitForURL(`**/${what}.html`, { waitUntil: 'load' });
    // Set maximum examples execution time to 3 seconds. Fail after that time
    await page.waitForFunction(() => (window as ExamplesWindow).exampleFinished === true, undefined, { timeout: 3000 });
    console.debug('Done');
  };

  await open('visitor.example');
  await open('proto_validate_api_response.example');
  await open('proto_sign_transaction.example');

  await browser.close();

  console.debug('Done running examples');
})().catch((error: unknown) => {
  console.error(error);

  process.exit(1);
});