import { ConsoleMessage, chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';
import { Parcel } from '@parcel/core';

import * as proto_sign_transaction from './proto_sign_transaction.example.js';
import * as proto_validate_api_response from './proto_validate_api_response.example.js';
import * as visitor from './visitor.example.js';

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

const bundlers = [ new Parcel(configFor('wax')), new Parcel(configFor('beekeeper')) ];

(async () => {
  console.debug('Bundling');
  await Promise.all(bundlers.map(parcel => parcel.run()));
  console.info('Bundled');

  const browser = await chromium.launch({
    headless: true
  });
  const page = await browser.newPage();
  page.on('console', (msg: ConsoleMessage) => {
    console.log('>>', msg.type(), msg.text())
  });

  const open = async (what: string) => {
    console.debug(`Opening ${what}`);
    await page.goto(`file://${__dirname}/dist/${what}.html`);
    await page.waitForURL(`**/${what}.html`, { waitUntil: 'load' });
  };

  await open('wax');
  await page.evaluate(visitor.evaluate);

  await open('wax');
  await page.evaluate(proto_validate_api_response.evaluate);

  await open('beekeeper');
  await page.evaluate(proto_sign_transaction.evaluate);

  await browser.close();

  console.debug('Done running examples');
})().catch((error: unknown) => {
  console.error(error);

  process.exit(1);
});