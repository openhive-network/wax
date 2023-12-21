import "reflect-metadata";

// Wax wasm definitions
import MainModuleFunction from './wax_module.web.js';
export * from './wax_module.web.js';

// Protobuf definitions
export * from './protocol.js';

// Helper definitions
export * from './visitor.js';

export * from "./detailed/web.js";

export * from "./interfaces.js";
export * from "./errors.js";

export default MainModuleFunction;
