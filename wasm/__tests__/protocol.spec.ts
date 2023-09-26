import puppeteer, { Browser, Page } from 'puppeteer';
import path from 'path';

import type MainModule from '../lib/wax';
declare var Module: typeof MainModule;

(async () => {
})();

describe('WASM Protocol', async() => {
  let browser!: Browser;
  let page!: Page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: 'new'
    });

    page = await browser.newPage();
    page.on('console', msg => console.log('>>', msg.text));

    await page.addScriptTag({ path: path.join(__dirname, '../../build_wasm/wax_wasm.js'), type: 'module' });
  });

  it('Should have global module', async () => {
    await page.evaluate(() => {
      console.assert(typeof Module === 'object');
    });
  });

  it('Should be able to create instance of protocol', async () => {
    await page.evaluate(async () => {
      const provider = await Module();

      new provider.protocol();
    });
  });

  afterAll(async() => {
    await browser.close();
  });
});