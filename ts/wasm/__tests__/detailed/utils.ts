import { expect } from "@playwright/test";
import { test } from "../assets/jest-helper";
import { objectToQueryString } from "../../dist/lib/detailed/util/query_string";
import { calculateExpiration, dateFromString, dateToUnixTimestamp, ensureUnixTimestamp } from "../../dist/lib/detailed/util/expiration_parser";
import { deepEqual } from "../../dist/lib/detailed/util/equal";
import { assignDefault } from "../../dist/lib/detailed/util/iterate";
import { WaxError } from "../../dist/lib/detailed/errors";

test.describe("Utility functions test", () => {
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
});

test.describe("Expiration parser test", () => {
  const referenceTime = new Date("2024-03-15T12:00:00.000Z");

  test("Should parse a date string without the zone designator as UTC", () => {
    expect(dateFromString("2024-03-15T12:00:00").toISOString()).toEqual("2024-03-15T12:00:00.000Z");
  });

  test("Should parse a date string with the Z zone designator as UTC", () => {
    expect(dateFromString("2024-03-15T12:00:00Z").toISOString()).toEqual("2024-03-15T12:00:00.000Z");
  });

  test("Should convert a date string and a Date to the same unix timestamp", () => {
    expect(dateToUnixTimestamp("2024-03-15T12:00:00")).toEqual(1710504000);
    expect(dateToUnixTimestamp(referenceTime)).toEqual(1710504000);
  });

  test("Should round sub-second precision when converting to a unix timestamp", () => {
    expect(dateToUnixTimestamp(new Date(1710504000499))).toEqual(1710504000);
    expect(dateToUnixTimestamp(new Date(1710504000500))).toEqual(1710504001);
  });

  test("Should return a number timestamp unchanged", () => {
    expect(ensureUnixTimestamp(1710504000)).toEqual(1710504000);
    expect(ensureUnixTimestamp(0)).toEqual(0);
  });

  test("Should convert a string or Date timestamp to unix seconds", () => {
    expect(ensureUnixTimestamp("2024-03-15T12:00:00")).toEqual(1710504000);
    expect(ensureUnixTimestamp("2024-03-15T12:00:00Z")).toEqual(1710504000);
    expect(ensureUnixTimestamp(referenceTime)).toEqual(1710504000);
  });

  test("Should calculate an absolute expiration from a date string", () => {
    expect(calculateExpiration("2024-03-15T13:00:00", referenceTime).toISOString()).toEqual("2024-03-15T13:00:00.000Z");
  });

  test("Should calculate an absolute expiration from a Date", () => {
    const expiration = calculateExpiration(new Date("2024-03-15T13:00:00.000Z"), referenceTime);

    expect(expiration.toISOString()).toEqual("2024-03-15T13:00:00.000Z");
  });

  test("Should treat a number expiration as milliseconds since the epoch", () => {
    expect(calculateExpiration(1710507600000, referenceTime).toISOString()).toEqual("2024-03-15T13:00:00.000Z");
  });

  test("Should calculate a relative expiration in seconds from the reference time", () => {
    expect(calculateExpiration("+30s", referenceTime).toISOString()).toEqual("2024-03-15T12:00:30.000Z");
    expect(calculateExpiration("+45", referenceTime).toISOString()).toEqual("2024-03-15T12:00:45.000Z");
  });

  test("Should calculate a relative expiration in minutes from the reference time", () => {
    expect(calculateExpiration("+5m", referenceTime).toISOString()).toEqual("2024-03-15T12:05:00.000Z");
  });

  test("Should calculate a relative expiration in hours from the reference time", () => {
    expect(calculateExpiration("+2h", referenceTime).toISOString()).toEqual("2024-03-15T14:00:00.000Z");
  });

  test("Should calculate a relative expiration from the current time when no reference is given", () => {
    const before = Date.now();
    const expiration = calculateExpiration("+1m").getTime();
    const after = Date.now();

    expect(expiration).toBeGreaterThanOrEqual(before + 60_000);
    expect(expiration).toBeLessThanOrEqual(after + 60_000);
  });

  test("Should throw WaxError on a relative expiration without a number", () => {
    expect(() => calculateExpiration("+m", referenceTime)).toThrow(WaxError);
    expect(() => calculateExpiration("+m", referenceTime)).toThrow("Invalid expiration time offset");
  });
});

test.describe("Deep equality test", () => {
  test("Should compare primitives by value and type", () => {
    expect(deepEqual(1, 1)).toBe(true);
    expect(deepEqual("a", "a")).toBe(true);
    expect(deepEqual(1, 2)).toBe(false);
    expect(deepEqual(1, "1")).toBe(false);
    expect(deepEqual(0, false)).toBe(false);
  });

  test("Should handle null and undefined", () => {
    expect(deepEqual(null, null)).toBe(true);
    expect(deepEqual(undefined, undefined)).toBe(true);
    expect(deepEqual(null, undefined)).toBe(false);
    expect(deepEqual(null, {})).toBe(false);
    expect(deepEqual({}, null)).toBe(false);
  });

  test("Should compare nested objects regardless of key order", () => {
    const left = { a: 1, b: { c: [1, 2, { d: "x" }], e: null } };
    const right = { b: { e: null, c: [1, 2, { d: "x" }] }, a: 1 };

    expect(deepEqual(left, right)).toBe(true);
  });

  test("Should detect a differing nested value", () => {
    const left = { a: 1, b: { c: [1, 2, { d: "x" }] } };
    const right = { a: 1, b: { c: [1, 2, { d: "y" }] } };

    expect(deepEqual(left, right)).toBe(false);
  });

  test("Should detect missing and extra keys", () => {
    expect(deepEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
    expect(deepEqual({ a: 1, b: 2 }, { a: 1 })).toBe(false);
    expect(deepEqual({ a: 1, b: undefined }, { a: 1, c: undefined })).toBe(false);
  });

  test("Should compare arrays by length and element order", () => {
    expect(deepEqual([1, [2, 3]], [1, [2, 3]])).toBe(true);
    expect(deepEqual([1, 2], [1, 2, 3])).toBe(false);
    expect(deepEqual([1, 2], [2, 1])).toBe(false);
  });

  test("Should not treat an array as equal to an object with index keys", () => {
    expect(deepEqual([1, 2], { 0: 1, 1: 2 })).toBe(false);
  });

  // Bug: deepEqual only checks Array.isArray on its first argument, so an object
  // with index keys compares equal to an array when passed first.
  test.fail("Should not treat an object with index keys as equal to an array", () => {
    expect(deepEqual({ 0: 1, 1: 2 }, [1, 2])).toBe(false);
  });
});

test.describe("Assign default test", () => {
  test("Should fill only the missing keys", () => {
    const target: Partial<{ a: number; b: string; c: boolean }> = { a: 5 };

    const result = assignDefault({ a: 1, b: "default", c: true }, target);

    expect(result).toBe(target);
    expect(result).toEqual({ a: 5, b: "default", c: true });
  });

  test("Should keep falsy values that are set in the target", () => {
    const result = assignDefault({ a: 1, b: "default", c: true }, { a: 0, b: "", c: false });

    expect(result).toEqual({ a: 0, b: "", c: false });
  });

  test("Should fill missing keys of nested objects", () => {
    const defaults = { name: "x", nested: { timeout: 1000, retries: 3, deep: { flag: true } } };

    const result = assignDefault(defaults, { nested: { retries: 5, deep: {} } });

    expect(result).toEqual({ name: "x", nested: { timeout: 1000, retries: 5, deep: { flag: true } } });
  });

  test("Should take a whole nested object from the defaults when the target lacks it", () => {
    const defaults = { name: "x", nested: { timeout: 1000 } };

    const result = assignDefault(defaults, { name: "y" });

    expect(result).toEqual({ name: "y", nested: { timeout: 1000 } });
  });

  test("Should return the defaults when the target is not an object", () => {
    const defaults = { a: 1 };

    expect(assignDefault(defaults, undefined as any)).toBe(defaults);
  });
});
