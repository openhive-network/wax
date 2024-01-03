import "core-js"; // structuredClone polyfill for Node.js environment

// Run tests in a specific order:

import "./detailed/base";
import "./detailed/base.node";
import "./detailed/protocol";
// import "./detailed/protocol.node";
import "./detailed/proto-protocol";
// import "./detailed/proto-protocol.node";
import "./detailed/hive_base";
import "./detailed/hive_base.node";
import "./detailed/hive_chain";
// import "./detailed/hive_chain.node";
