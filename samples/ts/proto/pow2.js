/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal.js";
import { legacy_chain_properties } from "./legacy_chain_properties.js";
export const protobufPackage = "hive.protocol.buffers";
function createBasepow2_input() {
    return { worker_account: "", prev_block: "", nonce: "0" };
}
export const pow2_input = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.worker_account !== "") {
            writer.uint32(10).string(message.worker_account);
        }
        if (message.prev_block !== "") {
            writer.uint32(18).string(message.prev_block);
        }
        if (message.nonce !== "0") {
            writer.uint32(24).uint64(message.nonce);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasepow2_input();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.worker_account = reader.string();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.prev_block = reader.string();
                    continue;
                case 3:
                    if (tag !== 24) {
                        break;
                    }
                    message.nonce = longToString(reader.uint64());
                    continue;
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            worker_account: isSet(object.worker_account) ? String(object.worker_account) : "",
            prev_block: isSet(object.prev_block) ? String(object.prev_block) : "",
            nonce: isSet(object.nonce) ? String(object.nonce) : "0",
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
    encode(message, writer = _m0.Writer.create()) {
        if (message.input !== undefined) {
            pow2_input.encode(message.input, writer.uint32(10).fork()).ldelim();
        }
        if (message.pow_summary !== 0) {
            writer.uint32(16).uint32(message.pow_summary);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasepow2_pow();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.input = pow2_input.decode(reader, reader.uint32());
                    continue;
                case 2:
                    if (tag !== 16) {
                        break;
                    }
                    message.pow_summary = reader.uint32();
                    continue;
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            input: isSet(object.input) ? pow2_input.fromJSON(object.input) : undefined,
            pow_summary: isSet(object.pow_summary) ? Number(object.pow_summary) : 0,
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
    encode(message, writer = _m0.Writer.create()) {
        if (message.n !== 0) {
            writer.uint32(8).uint32(message.n);
        }
        if (message.k !== 0) {
            writer.uint32(16).uint32(message.k);
        }
        if (message.seed !== "") {
            writer.uint32(26).string(message.seed);
        }
        writer.uint32(34).fork();
        for (const v of message.inputs) {
            writer.uint32(v);
        }
        writer.ldelim();
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseequihash_proof();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 8) {
                        break;
                    }
                    message.n = reader.uint32();
                    continue;
                case 2:
                    if (tag !== 16) {
                        break;
                    }
                    message.k = reader.uint32();
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.seed = reader.string();
                    continue;
                case 4:
                    if (tag === 32) {
                        message.inputs.push(reader.uint32());
                        continue;
                    }
                    if (tag === 34) {
                        const end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2) {
                            message.inputs.push(reader.uint32());
                        }
                        continue;
                    }
                    break;
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            n: isSet(object.n) ? Number(object.n) : 0,
            k: isSet(object.k) ? Number(object.k) : 0,
            seed: isSet(object.seed) ? String(object.seed) : "",
            inputs: Array.isArray(object === null || object === void 0 ? void 0 : object.inputs) ? object.inputs.map((e) => Number(e)) : [],
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
    encode(message, writer = _m0.Writer.create()) {
        if (message.input !== undefined) {
            pow2_input.encode(message.input, writer.uint32(10).fork()).ldelim();
        }
        if (message.proof !== undefined) {
            equihash_proof.encode(message.proof, writer.uint32(18).fork()).ldelim();
        }
        if (message.prev_block !== "") {
            writer.uint32(26).string(message.prev_block);
        }
        if (message.pow_summary !== 0) {
            writer.uint32(32).uint32(message.pow_summary);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseequihash_pow();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.input = pow2_input.decode(reader, reader.uint32());
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.proof = equihash_proof.decode(reader, reader.uint32());
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.prev_block = reader.string();
                    continue;
                case 4:
                    if (tag !== 32) {
                        break;
                    }
                    message.pow_summary = reader.uint32();
                    continue;
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            input: isSet(object.input) ? pow2_input.fromJSON(object.input) : undefined,
            proof: isSet(object.proof) ? equihash_proof.fromJSON(object.proof) : undefined,
            prev_block: isSet(object.prev_block) ? String(object.prev_block) : "",
            pow_summary: isSet(object.pow_summary) ? Number(object.pow_summary) : 0,
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
    encode(message, writer = _m0.Writer.create()) {
        if (message.pow2 !== undefined) {
            pow2_pow.encode(message.pow2, writer.uint32(10).fork()).ldelim();
        }
        if (message.equihash_pow !== undefined) {
            equihash_pow.encode(message.equihash_pow, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasepow2_work();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.pow2 = pow2_pow.decode(reader, reader.uint32());
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.equihash_pow = equihash_pow.decode(reader, reader.uint32());
                    continue;
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
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
    return { work: undefined, new_owner_key: "", props: undefined };
}
export const pow2 = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.work !== undefined) {
            pow2_work.encode(message.work, writer.uint32(10).fork()).ldelim();
        }
        if (message.new_owner_key !== "") {
            writer.uint32(18).string(message.new_owner_key);
        }
        if (message.props !== undefined) {
            legacy_chain_properties.encode(message.props, writer.uint32(26).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasepow2();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.work = pow2_work.decode(reader, reader.uint32());
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.new_owner_key = reader.string();
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.props = legacy_chain_properties.decode(reader, reader.uint32());
                    continue;
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            work: isSet(object.work) ? pow2_work.fromJSON(object.work) : undefined,
            new_owner_key: isSet(object.new_owner_key) ? String(object.new_owner_key) : "",
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
        message.new_owner_key = (_a = object.new_owner_key) !== null && _a !== void 0 ? _a : "";
        message.props = (object.props !== undefined && object.props !== null)
            ? legacy_chain_properties.fromPartial(object.props)
            : undefined;
        return message;
    },
};
function longToString(long) {
    return long.toString();
}
if (_m0.util.Long !== Long) {
    _m0.util.Long = Long;
    _m0.configure();
}
function isSet(value) {
    return value !== null && value !== undefined;
}
