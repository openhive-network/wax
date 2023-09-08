// Wax definitions
export * from '../../build_wasm/wax';

// Protobuf definitions
export * from './protocol';

// Helper definitions
export * from './visitor';

// Parse the main module
import { MainModule } from '../../build_wasm/wax';

declare function waxmodule(): Promise<MainModule>;

export default waxmodule;
