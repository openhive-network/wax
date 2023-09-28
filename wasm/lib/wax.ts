// Wax wasm definitions
import type { MainModule } from '../../build_wasm/wax';
export type {
  MainModule,
  error_code,
  json_asset,
  proto_protocol,
  proto_protocol_base,
  protocol,
  protocol_base,
  result
} from '../../build_wasm/wax';

// Protobuf definitions
export * from './protocol.js';

// Helper definitions
export * from './visitor.js';

// Parse the main module
import MainModuleFunction from '../../build_wasm/wax_wasm.js';

declare function waxmodule(): Promise<MainModule>;

export default MainModuleFunction as unknown as typeof waxmodule;
