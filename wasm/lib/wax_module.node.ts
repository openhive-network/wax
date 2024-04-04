import type { MainModule } from './build_wasm/wax.node.js';

// Parse the main module
import MainModuleFunction from './build_wasm/wax.node.js';

export type {
  MainModule,
  error_code,
  json_asset,
  proto_protocol,
  protocol,
  protocol_foundation,
  required_authority_collection,
  string_set_iterator_result,
  result
} from './build_wasm/wax.node.js';

declare function waxmodule(): Promise<MainModule>;

export default MainModuleFunction as unknown as typeof waxmodule;
