import { WaxError } from "../errors.js";

export type TWaxStdExceptionData = {
  msg: string;
  data: object;
  sourceException: Error|WebAssembly.RuntimeError
};

export type TCustomExceptionHandlerFunction = (error: TWaxStdExceptionData) => void;

const handleWaxStdException = (e: any, customExceptionHandler?: TCustomExceptionHandlerFunction): void => {
  /// unfortunately we can't use instanceof FinalExceptionClass here (probably because of Playwright's context isolation)
  if(typeof e === "object" && e && "message" in e) {
    const eObject: {message: string} = e as {message: string};
    /// Warning: toString() is necessary here, because otherwise string methods do not work
    const msg = eObject.message.toString();

    if(customExceptionHandler !== undefined && msg.indexOf("WAX_STD_EXCEPTION") > 0) {
      const jsonBody = msg.replace("std::runtime_error,", "");
      const contextMsg = JSON.parse(jsonBody);
      //console.log(`Received contextMsg: ${JSON.stringify(contextMsg)}`);

      const waxStdExceptionData: TWaxStdExceptionData = {
        msg: contextMsg.msg,
        data: contextMsg,
        sourceException: e as Error|WebAssembly.RuntimeError
      };

      customExceptionHandler(waxStdExceptionData);

      const error = new WaxError(`Error during Wasm call: ${msg}`);

      if ("stack" in e)
        throw Object.assign(error, { stack: e.stack });

      throw error;
    }
  }

  //console.log("Non-typed Error during Wasm call...", e);
  //throw new WaxError(`Non-typed Error during Wasm call: ${e}`);
};

/**
 * Allows for safe call to wasm function that may throw an error.
 * @param fn WASM function to be called
 * @param customExceptionHandler optional custom exception handler which can try to recognize thrown Error and handle it in more specific way
 * If customExceptionHandler does not throw, standard WaxError will be thrown.
  */
export const safeWasmCall = <T extends () => any>(fn: T, customExceptionHandler?: TCustomExceptionHandlerFunction): ReturnType<T> => {
  try {
    return fn()
  } catch (e) {
    handleWaxStdException(e, customExceptionHandler);
    //console.log("Non-typed Error during Wasm call...", e);

    const error = new WaxError(`Non-typed Error during Wasm call: ${e}`);

    if (typeof e === "object" && e && "stack" in e)
      throw Object.assign(error, { stack: e.stack });

    throw error; // it should be inside handleWaxStdException but compiler complains about missing retval
  }
};

export const safeAsyncWasmCall = async <T extends () => any>(fn: T, customExceptionHandler?: TCustomExceptionHandlerFunction): Promise<ReturnType<T>> => {
  try {
    return await fn();
  } catch (e) {
    handleWaxStdException(e, customExceptionHandler);
    //console.log("Non-typed Error during Wasm call...", e); 

    const error = new WaxError(`Non-typed Error during Wasm call: ${e}`);

    if (typeof e === "object" && e && "stack" in e)
      throw Object.assign(error, { stack: e.stack });

    throw error; // it should be inside handleWaxStdException but compiler complains about missing retval
  }
};
