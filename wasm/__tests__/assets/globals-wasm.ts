export enum ErrorCodes {
  FAIL = 0,
  OK = 1
}

import WaxModule, {
  type MainModule, type proto_protocol, type protocol as protocolT, type result as resultT
} from '../../dist/lib/build_wasm/wax.web.js';

declare global {
  var WaxWasmTests: {
    provider: () => Promise<MainModule>;
    protocol: () => Promise<protocolT>;
    proto_protocol: () => Promise<proto_protocol>;
    transform: (provider: MainModule, result: resultT) => resultT & { value: 0 | 1 };
  };
}

type TMainModuleFn = () => Promise<MainModule>;

// Prevent bundling and rewriting
const isWeb = new Function("try{return this===window}catch{return false}");
const getProvider = async () => {
  if(isWeb())
    return await (WaxModule as TMainModuleFn)()

  const node = await import("../../dist/lib/build_wasm/wax.node.js");
  return await (node.default as TMainModuleFn)();
};

globalThis.WaxWasmTests = {
  provider: () => getProvider(),
  protocol: async() => new (await getProvider()).protocol(),
  proto_protocol: async() => new (await getProvider()).proto_protocol(),
  transform: (provider: MainModule, result: resultT) => {
  const value = result.value === provider?.error_code.ok ? ErrorCodes.OK : ErrorCodes.FAIL;

  return {
    ...result,
    value
  } as resultT & { value: 0 | 1 };
  }
};
