import WaxModule, {
  type MainModule, type proto_protocol, type protocol as protocolT
} from '../../dist/lib/build_wasm/wax.web.js';

declare global {
  var WaxWasmTests: {
    provider: () => Promise<MainModule>;
    protocol: () => Promise<protocolT>;
    proto_protocol: () => Promise<proto_protocol>;
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
  proto_protocol: async() => new (await getProvider()).proto_protocol()
};
