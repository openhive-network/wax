import { WaxError, WaxAssertionError, WaxChainAssertionError, WaxProtocolAssertionError, WaxPrivateKeyLeakDetectedException } from "../errors.js";
import type { MainModule } from "../../build_wasm/wax.common"
import type { IOptionalModuleArgs } from "../../detailed/module_types.js"

interface MainModuleEmscriptenExtended extends MainModule {
  getExceptionMessage: (e: any) => [string, string];
}

export type TWaxStdExceptionData = {
  msg: string;
  data: object;
  sourceException: Error|WebAssembly.RuntimeError
};

export type TCustomExceptionHandlerFunction = (error: TWaxStdExceptionData) => void;

const getSafeProxyFor = (module: Record<string, any> | Function, manager: WasmManager) => {
  return new Proxy(module, {
    apply(target, thisArg, argArray: any[]): any {
      try {
        // console.log("Applying", target.name, "with args", argArray);

        return Reflect.apply(target as Function, thisArg, argArray);
      } catch (error) {
        manager.handleWasmStdException(error);
      }
    },
    construct(target, argArray: any[], _newTarget: Function): any {
      try {
        // console.log("Constructing", target.name, "with args", argArray);

        const instance = new (target as { new(...args: any[]): any })(...argArray);

        return getSafeProxyFor(instance, manager);
      } catch (error) {
        manager.handleWasmStdException(error);
      }
    },
    get(target, p: string, receiver: any) {
      const value = Reflect.get(target, p, receiver);

      // console.log("Reading", p, 'on', typeof target === "object" ? '{ "' + Object.getOwnPropertyNames(target).join('", "') + '" } -' : target, "-", typeof value, "$$" in target ? "(Emscripten internal)" : "");
      // console.log("Reading", p);

      // For internal JS handling of Promises (`then` checking on objects for awaits)
      if (!value)
        return value;

      // Emscripten internal data
      if (p === "$$")
        return value;

      // Create proxy for non-function values
      return getSafeProxyFor(value, manager);
    }
  });
};

export class WasmManager {
  private mainModule?: MainModuleEmscriptenExtended;
  private moduleWrapper?: MainModuleEmscriptenExtended;

  private throwGivenWaxAssertionError(assertionBody: string, ExceptionClass: new (...args: any[]) => Error) {
    const assertionObject = JSON.parse(assertionBody);
    const assertionCode = assertionObject.assert_hash || "Unknown assertion code";
    const errorInstance = new ExceptionClass(assertionCode, JSON.stringify(assertionObject));
    throw errorInstance;
  }

  public handleWasmStdException(error: any): never {
    // console.log(error, typeof error === "object" ? error instanceof (WebAssembly as any).Exception ? "WASM error" : error instanceof WaxError ? "Wax error" : "Unknown error" : "Non-object error");

    // If it is an error caused by the JS implementation called from the inside of WASM, just rethrow our high-level, already wrapped error
    if (typeof error === "object" && error instanceof WaxError)
      throw error;

    if (!this.mainModule)
      throw new Error("Internal error: Main module not initialized, but exception handling method called");

    const errorMessageList = this.mainModule.getExceptionMessage(error)
    //errorMessageList.forEach(function(item){
    //  console.log(`Received array item: ${JSON.stringify(item)} of type ${typeof item}`);
    //});
    switch (errorMessageList[0]) {
      case "cpp::wax_chain_assertion":
        this.throwGivenWaxAssertionError(errorMessageList[1], WaxChainAssertionError);
      case "cpp::wax_protocol_assertion":
        this.throwGivenWaxAssertionError(errorMessageList[1], WaxProtocolAssertionError);
      case "cpp::wax_api_assertion":
      case "cpp::wax_unknown_assertion":
      case "cpp::wax_assertion":
        this.throwGivenWaxAssertionError(errorMessageList[1], WaxAssertionError);
    }

    const eObject: {message: string} = error as {message: string};
    /// Warning: toString() is necessary here, because otherwise string methods do not work
    const msg = eObject.message.toString();

    // This is a legacy code, handling exception classes the old way and we should rewrite it to exception classes and eliminate or make more universal
    if(msg.indexOf("WAX_STD_EXCEPTION") > 0) {
      const jsonBody = msg.replace("std::runtime_error,", "");
      const contextMsg = JSON.parse(jsonBody);
      //console.log(`Received contextMsg: ${JSON.stringify(contextMsg)}`);

      const waxStdExceptionData: TWaxStdExceptionData = {
        msg: contextMsg.msg,
        data: contextMsg,
        sourceException: error as Error|WebAssembly.RuntimeError
      };

      switch(waxStdExceptionData.msg) {
        case "Detected private key leak.":
            const json = waxStdExceptionData.data as {public_key: string, account: string, authority_role: string};
          throw new WaxPrivateKeyLeakDetectedException(waxStdExceptionData.msg, json.public_key, json.account, json.authority_role);
        default:
      }

      const waxError = new WaxError(`Error during Wasm call: ${msg}`, error);

      if ("stack" in error)
        throw Object.assign(waxError, { stack: error.stack });

      throw waxError;
    }

    //console.log("Non-typed Error during Wasm call...", e);
    throw new WaxError(`Non-typed Error during Wasm call: ${error}`, error);
  }

  public constructor(private readonly wasmFn: (args?: IOptionalModuleArgs) => Promise<MainModule>, private readonly options?: IOptionalModuleArgs) { }

  public get module(): Promise<MainModule> {
    return new Promise((resolve, reject) => {
      if (this.moduleWrapper)
        resolve(this.moduleWrapper);

      this.wasmFn(this.options).then(module => {
        this.mainModule = module as MainModuleEmscriptenExtended;
        this.moduleWrapper = getSafeProxyFor(this.mainModule, this) as MainModuleEmscriptenExtended;

        resolve(this.moduleWrapper);
      }).catch(error => {
        const message = error instanceof Error ? error.message : String(error);
        reject(new Error(`Failed to initialize Wasm: ${message}`, {cause: error}))
      })
    });
  }
}
