/* eslint-disable */
import { legacy_chain_properties } from "./legacy_chain_properties.js";
export const protobufPackage = "hive.protocol.buffers";
function createBasepow2_input() {
    return { worker_account: "", prev_block: "", nonce: "0" };
}
export const pow2_input = {
    fromJSON(object) {
        return {
            worker_account: isSet(object.worker_account) ? globalThis.String(object.worker_account) : "",
            prev_block: isSet(object.prev_block) ? globalThis.String(object.prev_block) : "",
            nonce: isSet(object.nonce) ? globalThis.String(object.nonce) : "0",
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.worker_account !== undefined) {
            obj.worker_account = message.worker_account;
        }
        if (message.prev_block !== undefined) {
            obj.prev_block = message.prev_block;
        }
        if (message.nonce !== undefined) {
            obj.nonce = message.nonce;
        }
        return obj;
    },
    create(base) {
        return pow2_input.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBasepow2_input();
        message.worker_account = (_a = object.worker_account) !== null && _a !== void 0 ? _a : "";
        message.prev_block = (_b = object.prev_block) !== null && _b !== void 0 ? _b : "";
        message.nonce = (_c = object.nonce) !== null && _c !== void 0 ? _c : "0";
        return message;
    },
};
function createBasepow2_pow() {
    return { input: undefined, pow_summary: 0 };
}
export const pow2_pow = {
    fromJSON(object) {
        return {
            input: isSet(object.input) ? pow2_input.fromJSON(object.input) : undefined,
            pow_summary: isSet(object.pow_summary) ? globalThis.Number(object.pow_summary) : 0,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.input !== undefined) {
            obj.input = pow2_input.toJSON(message.input);
        }
        if (message.pow_summary !== undefined) {
            obj.pow_summary = Math.round(message.pow_summary);
        }
        return obj;
    },
    create(base) {
        return pow2_pow.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBasepow2_pow();
        message.input = (object.input !== undefined && object.input !== null)
            ? pow2_input.fromPartial(object.input)
            : undefined;
        message.pow_summary = (_a = object.pow_summary) !== null && _a !== void 0 ? _a : 0;
        return message;
    },
};
function createBaseequihash_proof() {
    return { n: 0, k: 0, seed: "", inputs: [] };
}
export const equihash_proof = {
    fromJSON(object) {
        return {
            n: isSet(object.n) ? globalThis.Number(object.n) : 0,
            k: isSet(object.k) ? globalThis.Number(object.k) : 0,
            seed: isSet(object.seed) ? globalThis.String(object.seed) : "",
            inputs: globalThis.Array.isArray(object === null || object === void 0 ? void 0 : object.inputs)
                ? object.inputs.map((e) => globalThis.Number(e))
                : [],
        };
    },
    toJSON(message) {
        var _a;
        const obj = {};
        if (message.n !== undefined) {
            obj.n = Math.round(message.n);
        }
        if (message.k !== undefined) {
            obj.k = Math.round(message.k);
        }
        if (message.seed !== undefined) {
            obj.seed = message.seed;
        }
        if ((_a = message.inputs) === null || _a === void 0 ? void 0 : _a.length) {
            obj.inputs = message.inputs.map((e) => Math.round(e));
        }
        return obj;
    },
    create(base) {
        return equihash_proof.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d;
        const message = createBaseequihash_proof();
        message.n = (_a = object.n) !== null && _a !== void 0 ? _a : 0;
        message.k = (_b = object.k) !== null && _b !== void 0 ? _b : 0;
        message.seed = (_c = object.seed) !== null && _c !== void 0 ? _c : "";
        message.inputs = ((_d = object.inputs) === null || _d === void 0 ? void 0 : _d.map((e) => e)) || [];
        return message;
    },
};
function createBaseequihash_pow() {
    return { input: undefined, proof: undefined, prev_block: "", pow_summary: 0 };
}
export const equihash_pow = {
    fromJSON(object) {
        return {
            input: isSet(object.input) ? pow2_input.fromJSON(object.input) : undefined,
            proof: isSet(object.proof) ? equihash_proof.fromJSON(object.proof) : undefined,
            prev_block: isSet(object.prev_block) ? globalThis.String(object.prev_block) : "",
            pow_summary: isSet(object.pow_summary) ? globalThis.Number(object.pow_summary) : 0,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.input !== undefined) {
            obj.input = pow2_input.toJSON(message.input);
        }
        if (message.proof !== undefined) {
            obj.proof = equihash_proof.toJSON(message.proof);
        }
        if (message.prev_block !== undefined) {
            obj.prev_block = message.prev_block;
        }
        if (message.pow_summary !== undefined) {
            obj.pow_summary = Math.round(message.pow_summary);
        }
        return obj;
    },
    create(base) {
        return equihash_pow.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseequihash_pow();
        message.input = (object.input !== undefined && object.input !== null)
            ? pow2_input.fromPartial(object.input)
            : undefined;
        message.proof = (object.proof !== undefined && object.proof !== null)
            ? equihash_proof.fromPartial(object.proof)
            : undefined;
        message.prev_block = (_a = object.prev_block) !== null && _a !== void 0 ? _a : "";
        message.pow_summary = (_b = object.pow_summary) !== null && _b !== void 0 ? _b : 0;
        return message;
    },
};
function createBasepow2_work() {
    return {};
}
export const pow2_work = {
    fromJSON(object) {
        return {
            pow2: isSet(object.pow2) ? pow2_pow.fromJSON(object.pow2) : undefined,
            equihash_pow: isSet(object.equihash_pow) ? equihash_pow.fromJSON(object.equihash_pow) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.pow2 !== undefined) {
            obj.pow2 = pow2_pow.toJSON(message.pow2);
        }
        if (message.equihash_pow !== undefined) {
            obj.equihash_pow = equihash_pow.toJSON(message.equihash_pow);
        }
        return obj;
    },
    create(base) {
        return pow2_work.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        const message = createBasepow2_work();
        message.pow2 = (object.pow2 !== undefined && object.pow2 !== null) ? pow2_pow.fromPartial(object.pow2) : undefined;
        message.equihash_pow = (object.equihash_pow !== undefined && object.equihash_pow !== null)
            ? equihash_pow.fromPartial(object.equihash_pow)
            : undefined;
        return message;
    },
};
function createBasepow2() {
    return { work: undefined, props: undefined };
}
export const pow2 = {
    fromJSON(object) {
        return {
            work: isSet(object.work) ? pow2_work.fromJSON(object.work) : undefined,
            new_owner_key: isSet(object.new_owner_key) ? globalThis.String(object.new_owner_key) : undefined,
            props: isSet(object.props) ? legacy_chain_properties.fromJSON(object.props) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.work !== undefined) {
            obj.work = pow2_work.toJSON(message.work);
        }
        if (message.new_owner_key !== undefined) {
            obj.new_owner_key = message.new_owner_key;
        }
        if (message.props !== undefined) {
            obj.props = legacy_chain_properties.toJSON(message.props);
        }
        return obj;
    },
    create(base) {
        return pow2.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBasepow2();
        message.work = (object.work !== undefined && object.work !== null) ? pow2_work.fromPartial(object.work) : undefined;
        message.new_owner_key = (_a = object.new_owner_key) !== null && _a !== void 0 ? _a : "STM1111111111111111111111111111111114T1Anm";
        message.props = (object.props !== undefined && object.props !== null)
            ? legacy_chain_properties.fromPartial(object.props)
            : undefined;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
