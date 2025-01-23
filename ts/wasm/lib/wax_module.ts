import type { MainModule } from 'wasm/build_wasm/wax.node.js';

// Parse the main module
import MainModuleFunction from 'wasm/build_wasm/wax.node.js';

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
} from 'wasm/build_wasm/wax.node.js';

export type {
  IChainConfig
} from "./build_wasm/config.js";

declare function waxmodule(): Promise<MainModule>;

export default MainModuleFunction as unknown as typeof waxmodule;
