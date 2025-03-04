export const structuredClone = (value: any) => {
  if (typeof globalThis.structuredClone === "undefined")
    return JSON.parse(JSON.stringify(value));

  return globalThis.structuredClone(value);
};
