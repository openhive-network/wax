export const iterate = (thisObj: Record<string, any>, obj: Record<string, any>): void => {
  if (typeof obj !== "object")
    return;

  for(const itKey in obj) {
    if(typeof obj[itKey] !== "object") {
      thisObj[itKey] = obj[itKey];

      continue;
    }

    if ("params" in obj[itKey])
      thisObj[itKey] = obj[itKey];
    else {
      if (thisObj[itKey] === undefined)
        thisObj[itKey] = {};

      iterate(thisObj[itKey], obj[itKey]);
    }
  }
};
