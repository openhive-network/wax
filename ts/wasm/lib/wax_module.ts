import type { MainModule } from './build_wasm/wax.common.js';

// Parse the main module
import MainModuleFunction from './build_wasm/wax.common.js';

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
  VectorBinaryDataNode
} from './build_wasm/wax.common.js';

declare function waxmodule(): Promise<MainModule>;

export default MainModuleFunction as unknown as typeof waxmodule;
