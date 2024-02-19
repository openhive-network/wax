import WaxModule, {
  type MainModule, type proto_protocol as proto_protocolT, type protocol as protocolT
} from '../../dist/lib/build_wasm/wax.web.js';

declare global {
  var protocol: protocolT;
  var proto_protocol: proto_protocolT;
  var waxScriptLoaded: boolean;
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

globalThis.waxScriptLoaded = false;
globalThis.protocol = new (await getProvider()).protocol();
globalThis.proto_protocol = new (await getProvider()).proto_protocol();
globalThis.waxScriptLoaded = true; // Setting this to true indicates that the website is ready to be tested
