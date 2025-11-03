import { expect, test } from '@playwright/test';

const waitForServerReady = async (url: string, interval: number = 1000, attempts: number = 10): Promise<void> => {
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

    await waitForServerReady("http://localhost:3000");

    await page.goto("http://localhost:3000", { waitUntil: "load" });
  });

  test('WASM should be properly loaded during development', async ({ page }) => {
    // Wait for wax to be loaded
    await page.waitForSelector("#version");
    await page.waitForSelector("#version-client");

    const result = await page.evaluate(async() => {
      return [
        document.getElementById("version")?.textContent,
        document.getElementById("version-client")?.textContent,
      ];
    });

    console.log("Got wax versions:", result);

    // Wax should be loaded
    expect(result[0]).toBe(result[1]);
    expect(result[0]).toMatch(/[0-9]+\.[0-9]+\.[a-z0-9\-]+/);
    expect(result[1]).toMatch(/[0-9]+\.[0-9]+\.[a-z0-9\-]+/);
  });

  test('SSR Should work', async ({ page }) => {
    // Wait for wax to be loaded
    await page.waitForSelector("#version");

    const data = await fetch('http://localhost:3000');
    const html = await data.text();

    const regex = /<div id="version">([0-9]+\.[0-9]+\.[\.a-zA-Z0-9\-]+)<\/div>/g;
    const match = regex.exec(html);
    const version = match ? match[1] : null;

    console.log("Got wax versions:", version);

    expect(version).toBeTruthy();
  });
});
