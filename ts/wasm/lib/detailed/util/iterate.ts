import { type DeepPartial } from '../formatters/types.js';

export const assignDefault = <T extends Record<string, any>>(defaultsObject: T, target: DeepPartial<T>): T => {
  if (typeof target !== "object")
    return defaultsObject;

  for(const itKey in defaultsObject) {
    if (typeof defaultsObject[itKey] === "object") {
      target[itKey] = assignDefault(defaultsObject[itKey], target[itKey] as any);
    }
    else {
      if (target[itKey] === undefined)
        (target as T)[itKey] = defaultsObject[itKey];
    }
  }

  return target as T;
};

export const iterate = <T extends Record<string, any>>(source: DeepPartial<T>, target: T): DeepPartial<T> => {
  if (typeof target !== "object")
    return source;

  for(const itKey in (target as DeepPartial<T>)) {
    // Prevent prototype pollution
    if (itKey === "__proto__" || itKey === "constructor") continue;

    if(typeof target[itKey] !== "object") {
      source[itKey] = target[itKey] as any;

      continue;
    }

    if ("params" in target[itKey])
      source[itKey] = target[itKey] as any;
    else {
      if (source[itKey] === undefined)
        source[itKey] = {} as any;

      iterate(source[itKey] as any, target[itKey]);
    }
  }

  return source;
};
