import type { MainModule } from './build_wasm/wax.common.js';

// Parse the main module
import MainModuleFunction from './build_wasm/wax.common.js';

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
} from './build_wasm/wax.common.js';

export type {
  IChainConfig
} from "./build_wasm/config.js";

declare function waxmodule(): Promise<MainModule>;

export default MainModuleFunction as unknown as typeof waxmodule;
