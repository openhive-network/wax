import { type DeepPartial } from '../formatters/types.js';

export const iterate = <T extends Record<string, any>>(source: DeepPartial<T>, target: T): DeepPartial<T> => {
  if (typeof target !== "object")
    return source;

  for(const itKey in (target as DeepPartial<T>)) {
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
