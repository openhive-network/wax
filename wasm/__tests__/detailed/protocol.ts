import { ChromiumBrowser, ConsoleMessage, chromium } from 'playwright';
import { test, expect } from '@playwright/test';

import { ErrorCodes } from "../assets/data.protocol";
import { result as resultT } from '../../lib/wax';

let browser!: ChromiumBrowser;

test.describe('WASM Protocol', () => {
  test.beforeAll(async () => {
    browser = await chromium.launch({
      headless: true
    });
  });

  test.beforeEach(async({ page }) => {
    page.on('console', (msg: ConsoleMessage) => {
      console.log('>>', msg.type(), msg.text())
    });

    await page.goto(`http://localhost:8080/wasm/__tests__/assets/test.html`);
    await page.waitForURL('**/test.html', { waitUntil: 'load' });

    await page.evaluate(async (ErrorCodes) => {
      const provider = await wax();
      const protocol = new provider.protocol();

      Object.defineProperties(window, {
        protocol: {
          get() {
            return protocol;
          }
        },
        provider: {
          get() {
            return provider;
          }
        },
        /// Helper function for transforming result type to the node-understandable type (value.value is a non-serialable function)
        transform: {
          get() {
            return (result: resultT) => {
              const value = result.value === provider.error_code.ok ? ErrorCodes.OK : ErrorCodes.FAIL;

              return {
                ...result,
                value
              };
            };
          }
        }
      });
    }, ErrorCodes);
  });

  test('Should be able to generate random key pair', async ({ page }) => {
    const retVal = await page.evaluate(() => {
      return transform(protocol.cpp_generate_private_key());
    });

    expect(retVal.value).toBe(ErrorCodes.OK);
    expect(retVal.exception_message).toHaveLength(0);
  });

  test.afterAll(async () => {
    await browser.close();
  });
});
