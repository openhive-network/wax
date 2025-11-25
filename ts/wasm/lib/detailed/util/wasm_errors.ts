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

export class WasmManager {
  private mainModule?: MainModuleEmscriptenExtended;

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
      throw new WaxError("Internal error: Main module not initialized, but exception handling method called", error);

    let errorMessageList: [string, string] | undefined = undefined;
    try {
      errorMessageList = this.mainModule.getExceptionMessage(error)
    } catch {}

    //errorMessageList.forEach(function(item){
    //  console.log(`Received array item: ${JSON.stringify(item)} of type ${typeof item}`);
    //});
    if (errorMessageList !== undefined)
      switch (errorMessageList[0]) {
        case "cpp::wax_chain_assertion":
          this.throwGivenWaxAssertionError(errorMessageList[1], WaxChainAssertionError);
        case "cpp::wax_protocol_assertion":
          this.throwGivenWaxAssertionError(errorMessageList[1], WaxProtocolAssertionError);
        case "cpp::wax_api_assertion":
        case "cpp::wax_unknown_assertion":
        case "cpp::wax_assertion":
          this.throwGivenWaxAssertionError(errorMessageList[1], WaxAssertionError);
        case "cpp::wax_private_key_leak":
        {
          const contextMsg = JSON.parse(errorMessageList[1]);
          throw new WaxPrivateKeyLeakDetectedException(contextMsg.msg, contextMsg.public_key, contextMsg.account, contextMsg.authority_role);
        }
      }

    //console.log("Non-typed Error during Wasm call...", e);
    let generalMessage = '';
    if (typeof error === "object" && error && "message" in error) {
      if (typeof error.message === "string")
        generalMessage = error.message;
      else if (typeof error.message === "object" && error.message && error.message[0]) {
        generalMessage = `${error.message[0]}: ${error.message[1]}`;
      }
    }

    throw new WaxError(`Non-typed Error during Wasm call: ${generalMessage}`, error);
  }

  public safeWasmCall<T>(wasmFunction: () => T): T {
    try {
      return wasmFunction();
    } catch (error) {
      this.handleWasmStdException(error);
    }
  }

  public constructor(private readonly wasmFn: (args?: IOptionalModuleArgs) => Promise<MainModule>, private readonly options?: IOptionalModuleArgs) { }

  public get module(): Promise<MainModule> {
    return new Promise((resolve, reject) => {
      if (this.mainModule)
        resolve(this.mainModule);

      this.wasmFn(this.options).then(module => {
        this.mainModule = module as MainModuleEmscriptenExtended;

        resolve(this.mainModule);
      }).catch(error => {
        const message = error instanceof Error ? error.message : String(error);
        reject(new Error(`Failed to initialize Wasm: ${message}`, {cause: error}))
      })
    });
  }
}
