// During bundle - this module will be replaced with the actual wasm module based on your environment. This file is kept mainly for the purpose of type checking and documentation.

import type { MainModule } from 'wasm/build_wasm/wax.node.js';

export type {
  MainModule,
  error_code,
  json_asset,
  proto_protocol,
  protocol,
  protocol_foundation,
  result,
  json_price,
  witness_set_properties_data,
  MapStringString,
  VectorString,
  private_key_data,
  brain_key_data,
  binary_data_node,
  binary_data,
  VectorBinaryDataNode,
  wax_authority,
  wax_authorities,
  MapStringUInt16
  ,ClassHandle
  ,VectorPathEntry
} from 'wasm/build_wasm/wax.node.js';

export type {
  IChainConfig
} from "./build_wasm/config.js";

export interface IOptionalModuleArgs {
  wasmBinary?: Buffer;
  locateFile?: (path: string, scriptDirectory: string) => string;
}

declare function waxmodule(ModuleArg?: IOptionalModuleArgs): Promise<MainModule>;

export default waxmodule;
