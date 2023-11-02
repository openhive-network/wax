// Wax wasm definitions
import MainModuleFunction from './wax_module.js';
export * from './wax_module.js';

// Protobuf definitions
export * from './protocol.js';

// Helper definitions
export * from './visitor.js';

export { createWaxFoundation } from "./detailed/index.js";

export * from "./interfaces.js";
export * from "./errors.js";

export default MainModuleFunction;
