import { expect, test } from '@playwright/test';

const waitForServerReady = async (url: string, interval: number = 100, attempts: number = 10): Promise<void> => {
  console.log(`Awaiting a server: ${url}...`);

  for (let count = 0; count < attempts; ++count) {
    try {
      console.log(`Trying to connect ${count}/${attempts})`);

      const response = await fetch(url, {
        method: "GET",
        signal: AbortSignal.timeout(interval)
      });

      if (response.ok && response.status === 200) {
        console.log(`Connected successfully (${count}/${attempts}). Exiting.`);
        return;
      }
    }
    catch (error) {
      if (typeof error !== "object" || !(error instanceof Error))
        console.log(`Caught an UNKNOWN error (${JSON.stringify(error)})`);
      else
      if (error.name === "TimeoutError")
        console.log(`Caught a TIMEOUT error (${JSON.stringify(error)})`);
      else
      if (error.name === "AbortError")
        console.log(`Caught an ABORT error (${JSON.stringify(error)})`);
    }

    console.log(`Waiting for ${interval} ms...)`);
    await new Promise(resolve => { setTimeout(resolve, interval); });
  }

  console.log(`Still down - bailing out.`);
};

test.describe('Proper WASM Wax loading on playwright ', () => {
  test.beforeEach(async ({ page }) => {
    /// use >> marker for each texts printed in the browser context
    page.on('console', msg => {
      console.log('>>', msg.type(), msg.text());
    });

    await waitForServerReady("http://localhost:5173");

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
