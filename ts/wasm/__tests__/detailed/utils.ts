import { expect } from "@playwright/test";
import { test } from "../assets/jest-helper";
import { objectToQueryString } from "../../dist/lib/detailed/util/query_string";

test("Utility functions test", () => {
  test("objectToQueryString", () => {
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
    expect(querified).toEqual(decodeURIComponent(decoded));
  });
});
