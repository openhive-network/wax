export const iterate = (source: Record<string, any>, target: Record<string, any>): void => {
  if (typeof target !== "object")
    return;

  for(const itKey in target) {
    if(typeof target[itKey] !== "object") {
      source[itKey] = target[itKey];

      continue;
    }

    if ("params" in target[itKey])
      source[itKey] = target[itKey];
    else {
      if (source[itKey] === undefined)
        source[itKey] = {};

      iterate(source[itKey], target[itKey]);
    }
  }
};
