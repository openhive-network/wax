import { ChromiumBrowser, ConsoleMessage, chromium } from "playwright";
import { expect } from "@playwright/test";
import { test } from "../assets/jest-helper";
import { objectToQueryString } from "../../dist/lib/detailed/util/query_string";

let browser!: ChromiumBrowser;

test.describe("Utility functions test", () => {
  test.beforeAll(async () => {
    browser = await chromium.launch({
      headless: true,
    });
  });

  test.beforeEach(async ({ page }) => {
    page.on("console", (msg: ConsoleMessage) => {
      console.log(">>", msg.type(), msg.text());
    });

    await page.goto("http://localhost:8080/wasm/__tests__/assets/test.html", {
      waitUntil: "load",
    });
  });

  test("Should be able to convert empty object to a correct query string", () => {
    const params = {};

    const decoded = "";
    const encoded = "";

    const querified = objectToQueryString(params);
    expect(querified).toEqual(encoded);
    expect(decodeURIComponent(querified)).toEqual(decoded);
  });

  test("Should be able to convert single parameter to a correct query string", () => {
    const params = {
      name: "John"
    };

    const decoded = "name=John";
    const encoded = "name=John";

    const querified = objectToQueryString(params);
    expect(querified).toEqual(encoded);
    expect(decodeURIComponent(querified)).toEqual(decoded);
  });

  test("Should be able to convert object with multiple parameters to a correct query string", () => {
    const params = {
      name: "John",
      age: 30,
      interests: ["music", "movies", "sports"],
      location: { city: "New York", country: "USA" },
      isStudent: false,
      nullValue: null,
      undefinedValue: undefined,
    };

    const decoded =
      'name=John&age=30&interests=music,movies,sports&location={"city":"New York","country":"USA"}&isStudent=false';
    const encoded =
      "name=John&age=30&interests=music,movies,sports&location=%7B%22city%22%3A%22New%20York%22%2C%22country%22%3A%22USA%22%7D&isStudent=false";

    const querified = objectToQueryString(params);
    expect(querified).toEqual(encoded);
    expect(decodeURIComponent(querified)).toEqual(decoded);
  });

  test.afterAll(async () => {
    await browser.close();
  });
});
