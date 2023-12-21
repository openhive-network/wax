import "reflect-metadata";

// Wax wasm definitions
import MainModuleFunction from './wax_module.node.js';
export * from './wax_module.node.js';

// Protobuf definitions
export * from './protocol.js';

// Helper definitions
export * from './visitor.js';

export * from "./detailed/node.js";

export * from "./interfaces.js";
export * from "./errors.js";

export default MainModuleFunction;
