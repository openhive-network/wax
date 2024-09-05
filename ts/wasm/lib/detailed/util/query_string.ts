export function objectToQueryString(
  params: Record<
    string,
    undefined | null | string | number | boolean | Array<any> | object
  >
) {
  const queryParts: Array<string> = [];

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      let encodedValue: string;

      if (Array.isArray(value)) {
        encodedValue = value.map(encodeURIComponent).join(",");
      } else if (typeof value === "object") {
        encodedValue = encodeURIComponent(JSON.stringify(value));
      } else {
        encodedValue = encodeURIComponent(value.toString());
      }

      queryParts.push(`${key}=${encodedValue}`);
    }
  }

  return queryParts.join("&");
}
