import { createHash } from "node:crypto";
import fs from "node:fs";

import { expect, test } from "@playwright/test";

import type { ICspSignersResult } from "../assets/csp-signers";

const PAGE_URL = "http://localhost:8080/wasm/__tests__/assets/csp.html";

/**
 * The policy a page without 'unsafe-eval' serves. The inline import map is the only inline script,
 * allowed by its hash, as an inline script can't be allowed by 'self'.
 */
const strictScriptPolicy = (): string => {
  const html = fs.readFileSync("wasm/__tests__/assets/csp.html", "utf-8");
  const importMap = /<script type="importmap">([\s\S]*?)<\/script>/.exec(html);
  if (importMap === null)
    throw new Error("csp.html has no import map");

  const importMapHash = createHash("sha256").update(importMap[1]).digest("base64");

  return `script-src 'self' 'wasm-unsafe-eval' 'sha256-${importMapHash}'`;
};

test.describe("Signers under a Content Security Policy without 'unsafe-eval'", () => {
  test("Should initialize beekeeper, import a key and sign through the beekeeper signer", async ({ page }) => {
    const policy = strictScriptPolicy();
    await page.route(PAGE_URL, async route => {
      const response = await route.fetch();
      await route.fulfill({ response, headers: { ...response.headers(), "content-security-policy": policy } });
    });

    const cspConsoleErrors: string[] = [];
    page.on("console", message => {
      if (message.type() === "error" && message.text().includes("Content Security Policy"))
        cspConsoleErrors.push(message.text());
    });

    await page.goto(PAGE_URL, { waitUntil: "load" });
    const body = page.locator("body[data-result]");
    await expect(body).toHaveCount(1, { timeout: 30000 });
    const result = JSON.parse((await body.getAttribute("data-result"))!) as ICspSignersResult;

    expect(result.evalBlocked).toBe(true);
    expect(result.error).toBeUndefined();
    expect(result.violations).toEqual([]);
    expect(cspConsoleErrors).toEqual([]);
    expect(result.publicKey).toBe("STM5RqVBAVNp5ufMCetQtvLGLJo7unX9nyCBMMrTXRWQ9i1Zzzizh");
    expect(result.signatures).toEqual([
      "1f936a9963b3b065e25d40d69fb93cff077e539e7e2eb383537717589830f9a4a949882a448e5ba7c48c5b016caed7260d75f6cf8a8f3adba506b7c2f3a54cba7e"
    ]);
    expect(result.decrypted).toBe("CSP control message");
  });
});
