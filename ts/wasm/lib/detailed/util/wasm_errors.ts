import { WaxError, WaxAssertionError, WaxChainAssertionError, WaxProtocolAssertionError } from "../errors.js";

export type TWaxStdExceptionData = {
  msg: string;
  data: object;
  sourceException: Error|WebAssembly.RuntimeError
};

export type TCustomExceptionHandlerFunction = (error: TWaxStdExceptionData) => void;

const handleWaxStdException = (e: any, customExceptionHandler?: TCustomExceptionHandlerFunction): void => {
  /// unfortunately we can't use instanceof FinalExceptionClass here (probably because of Playwright's context isolation)
  // TODO replace the code below with getExceptionMessage call when available here.
  if(typeof e === "object" && e && "message" in e) {
    if (Array.isArray(e.message) && e.message[0].search("cpp::wax_[^_]+_assertion") >= 0) {
      //e.message.forEach(function(item){
      //  console.log(`Received array item: ${JSON.stringify(item)} of type ${typeof item}`);
      //});
      const jsonMsg = JSON.parse(e.message[1]);
      const assertionCode = jsonMsg.assert_hash || "Unknown assertion code";
      switch (e.message[0]) {
        case "cpp::wax_chain_assertion":
          throw new WaxChainAssertionError(assertionCode, JSON.stringify(jsonMsg));
        case "cpp::wax_protocol_assertion":
          throw new WaxProtocolAssertionError(assertionCode, JSON.stringify(jsonMsg));
        default:
          throw new WaxAssertionError(assertionCode, JSON.stringify(jsonMsg));
      }
    }

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

    const errorMsg = e && typeof e === "object" && "message" in e ? e.message : String(e);

    const error = new WaxError(`Non-typed Error during Wasm call: ${errorMsg}`);

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

    const errorMsg = e && typeof e === "object" && "message" in e ? e.message : String(e);

    const error = new WaxError(`Non-typed Error during Wasm call: ${errorMsg}`);

    if (typeof e === "object" && e && "stack" in e)
      throw Object.assign(error, { stack: e.stack });

    throw error; // it should be inside handleWaxStdException but compiler complains about missing retval
  }
};
