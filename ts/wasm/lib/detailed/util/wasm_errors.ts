import { WaxError, WaxPrivateKeyLeakDetectedException } from "../errors.js";
import { resolveException } from "../error_resolver.js";
import type { MainModule } from "../../build_wasm/wax.common"
import type { IOptionalModuleArgs } from "../../detailed/module_types.js"

export type TWaxStdExceptionData = {
  msg: string;
  data: object;
  sourceException: Error|WebAssembly.RuntimeError
};

export type TCustomExceptionHandlerFunction = (error: TWaxStdExceptionData) => void;

export class WasmManager {
  private mainModule?: MainModule;

  public handleWasmStdException(error: any): never {
    // If it is an error caused by the JS implementation called from the inside of WASM, just rethrow our high-level, already wrapped error
    if (typeof error === "object" && error instanceof WaxError)
      throw error;

    if (!this.mainModule)
      throw new WaxError("Internal error: Main module not initialized, but exception handling method called", error);

    // A C++ exception reaches JS as an Error with the C++ type name in `cppExceptionName` (core/utils.hpp)
    const exceptionName: unknown = typeof error === "object" && error !== null ? error.cppExceptionName : undefined;

    if (typeof exceptionName === "string") {
      const payload: string = error.message;
      switch (exceptionName) {
        case "cpp::wax_chain_assertion":
        case "cpp::wax_protocol_assertion":
        case "cpp::wax_api_assertion":
        case "cpp::wax_unknown_assertion":
        case "cpp::wax_assertion":
          throw resolveException(payload, exceptionName);
        case "cpp::wax_private_key_leak":
        {
          const contextMsg = JSON.parse(payload);
          throw new WaxPrivateKeyLeakDetectedException(contextMsg.msg, contextMsg.public_key, contextMsg.account, contextMsg.authority_role);
        }
      }
    }

    //console.log("Non-typed Error during Wasm call...", e);
    let generalMessage = '';
    if (typeof exceptionName === "string")
      generalMessage = `${exceptionName}: ${error.message}`;
    else if (typeof error === "object" && error && "message" in error && typeof error.message === "string")
      generalMessage = error.message;

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
        this.mainModule = module;

        resolve(this.mainModule);
      }).catch(error => {
        const message = error instanceof Error ? error.message : String(error);
        reject(new Error(`Failed to initialize Wasm: ${message}`, {cause: error}))
      })
    });
  }
}
