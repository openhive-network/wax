import type { MainModule } from './build_wasm/wax.web.js';

// Parse the main module
import MainModuleFunction from './build_wasm/wax.web.js';

export type {
  MainModule,
  error_code,
  json_asset,
  proto_protocol,
  protocol,
  protocol_foundation,
  result
} from './build_wasm/wax.web.js';

declare function waxmodule(): Promise<MainModule>;

export default MainModuleFunction as unknown as typeof waxmodule;
