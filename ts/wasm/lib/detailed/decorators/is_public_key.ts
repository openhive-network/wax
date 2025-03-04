export const isPublicKey = (value: string) => {
  if (typeof value !== "string")
    return false;

  if (!value.startsWith("STM") && !value.startsWith("TST"))
    return false;

  const base58Regex = /^[1-9A-HJ-NP-Za-km-z]+$/;

  return base58Regex.test(value.slice(3));
};

