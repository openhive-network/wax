// During bundle - this module will be replaced with the actual wasm module based on your environment. This file is kept mainly for the purpose of type checking and documentation.

import type { MainModule } from 'wasm/build_wasm/wax.node.js';

export type {
  authority_verification_trace,
  MainModule,
  error_code,
  IAccountAuthorityProvider,
  json_asset,
  path_entry,
  proto_protocol,
  protocol,
  protocol_foundation,
  required_authority_collection,
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
