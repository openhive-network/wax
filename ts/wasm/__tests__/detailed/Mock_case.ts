import { expect } from "@playwright/test";
import { test } from "../assets/jest-helper";

test.describe("Selector check: an upper-case test module", () => {
  test("fails on purpose", () => {
    expect(1, "selector-check mutation").toBe(2);
  });
});
