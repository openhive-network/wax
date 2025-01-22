import { expect, test } from '@playwright/test';

test.describe('Proper WASM Wax loading on playwright ', () => {
  test.beforeEach(async ({ page }) => {
    /// use >> marker for each texts printed in the browser context
    page.on('console', msg => {
      console.log('>>', msg.type(), msg.text());
    });

    await page.goto("http://localhost:5173", { waitUntil: "load" });
  });

  test('WASM should be properly loaded during development', async ({ page }) => {
    // Wait for wax to be loaded
    await page.waitForFunction(() => typeof (window as any).waxLoaded !== "undefined");

    const result = await page.evaluate(async() => {
      return (window as any).waxLoaded; // This value is set by this app in App.vue after successfull wax initialization
    });

    // Wax should be loaded
    expect(result).toBe(true);
  });
});
