/* eslint-disable */
import _m0 from "protobufjs/minimal.js";
import { void_t } from "./future_extensions.js";
import { transaction } from "./transaction.js";
export const protobufPackage = "hive.protocol.buffers";
function createBasehardfork_version_vote() {
    return { hf_version: "", hf_time: "" };
}
export const hardfork_version_vote = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.hf_version !== "") {
            writer.uint32(10).string(message.hf_version);
        }
        if (message.hf_time !== "") {
            writer.uint32(18).string(message.hf_time);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasehardfork_version_vote();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.hf_version = reader.string();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.hf_time = reader.string();
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
            hf_version: isSet(object.hf_version) ? String(object.hf_version) : "",
            hf_time: isSet(object.hf_time) ? String(object.hf_time) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.hf_version !== "") {
            obj.hf_version = message.hf_version;
        }
        if (message.hf_time !== "") {
            obj.hf_time = message.hf_time;
        }
        return obj;
    },
    create(base) {
        return hardfork_version_vote.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBasehardfork_version_vote();
        message.hf_version = (_a = object.hf_version) !== null && _a !== void 0 ? _a : "";
        message.hf_time = (_b = object.hf_time) !== null && _b !== void 0 ? _b : "";
        return message;
    },
};
function createBaseblock_header_extensions() {
    return {};
}
export const block_header_extensions = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.void_t !== undefined) {
            void_t.encode(message.void_t, writer.uint32(10).fork()).ldelim();
        }
        if (message.version !== undefined) {
            writer.uint32(18).string(message.version);
        }
        if (message.hardfork_version_vote !== undefined) {
            hardfork_version_vote.encode(message.hardfork_version_vote, writer.uint32(26).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseblock_header_extensions();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.void_t = void_t.decode(reader, reader.uint32());
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.version = reader.string();
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.hardfork_version_vote = hardfork_version_vote.decode(reader, reader.uint32());
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
            void_t: isSet(object.void_t) ? void_t.fromJSON(object.void_t) : undefined,
            version: isSet(object.version) ? String(object.version) : undefined,
            hardfork_version_vote: isSet(object.hardfork_version_vote)
                ? hardfork_version_vote.fromJSON(object.hardfork_version_vote)
                : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.void_t !== undefined) {
            obj.void_t = void_t.toJSON(message.void_t);
        }
        if (message.version !== undefined) {
            obj.version = message.version;
        }
        if (message.hardfork_version_vote !== undefined) {
            obj.hardfork_version_vote = hardfork_version_vote.toJSON(message.hardfork_version_vote);
        }
        return obj;
    },
    create(base) {
        return block_header_extensions.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseblock_header_extensions();
        message.void_t = (object.void_t !== undefined && object.void_t !== null)
            ? void_t.fromPartial(object.void_t)
            : undefined;
        message.version = (_a = object.version) !== null && _a !== void 0 ? _a : undefined;
        message.hardfork_version_vote =
            (object.hardfork_version_vote !== undefined && object.hardfork_version_vote !== null)
                ? hardfork_version_vote.fromPartial(object.hardfork_version_vote)
                : undefined;
        return message;
    },
};
function createBaseblock() {
    return {
        previous: "",
        timestamp: "",
        witness: "",
        transaction_merkle_root: "",
        extensions: [],
        witness_signature: "",
        transactions: [],
        block_id: "",
        signing_key: "",
        transaction_ids: [],
    };
}
export const block = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.previous !== "") {
            writer.uint32(10).string(message.previous);
        }
        if (message.timestamp !== "") {
            writer.uint32(18).string(message.timestamp);
        }
        if (message.witness !== "") {
            writer.uint32(26).string(message.witness);
        }
        if (message.transaction_merkle_root !== "") {
            writer.uint32(34).string(message.transaction_merkle_root);
        }
        for (const v of message.extensions) {
            block_header_extensions.encode(v, writer.uint32(42).fork()).ldelim();
        }
        if (message.witness_signature !== "") {
            writer.uint32(50).string(message.witness_signature);
        }
        for (const v of message.transactions) {
            transaction.encode(v, writer.uint32(58).fork()).ldelim();
        }
        if (message.block_id !== "") {
            writer.uint32(66).string(message.block_id);
        }
        if (message.signing_key !== "") {
            writer.uint32(74).string(message.signing_key);
        }
        for (const v of message.transaction_ids) {
            writer.uint32(82).string(v);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseblock();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.previous = reader.string();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.timestamp = reader.string();
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.witness = reader.string();
                    continue;
                case 4:
                    if (tag !== 34) {
                        break;
                    }
                    message.transaction_merkle_root = reader.string();
                    continue;
                case 5:
                    if (tag !== 42) {
                        break;
                    }
                    message.extensions.push(block_header_extensions.decode(reader, reader.uint32()));
                    continue;
                case 6:
                    if (tag !== 50) {
                        break;
                    }
                    message.witness_signature = reader.string();
                    continue;
                case 7:
                    if (tag !== 58) {
                        break;
                    }
                    message.transactions.push(transaction.decode(reader, reader.uint32()));
                    continue;
                case 8:
                    if (tag !== 66) {
                        break;
                    }
                    message.block_id = reader.string();
                    continue;
                case 9:
                    if (tag !== 74) {
                        break;
                    }
                    message.signing_key = reader.string();
                    continue;
                case 10:
                    if (tag !== 82) {
                        break;
                    }
                    message.transaction_ids.push(reader.string());
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
            previous: isSet(object.previous) ? String(object.previous) : "",
            timestamp: isSet(object.timestamp) ? String(object.timestamp) : "",
            witness: isSet(object.witness) ? String(object.witness) : "",
            transaction_merkle_root: isSet(object.transaction_merkle_root) ? String(object.transaction_merkle_root) : "",
            extensions: Array.isArray(object === null || object === void 0 ? void 0 : object.extensions)
                ? object.extensions.map((e) => block_header_extensions.fromJSON(e))
                : [],
            witness_signature: isSet(object.witness_signature) ? String(object.witness_signature) : "",
            transactions: Array.isArray(object === null || object === void 0 ? void 0 : object.transactions)
                ? object.transactions.map((e) => transaction.fromJSON(e))
                : [],
            block_id: isSet(object.block_id) ? String(object.block_id) : "",
            signing_key: isSet(object.signing_key) ? String(object.signing_key) : "",
            transaction_ids: Array.isArray(object === null || object === void 0 ? void 0 : object.transaction_ids) ? object.transaction_ids.map((e) => String(e)) : [],
        };
    },
    toJSON(message) {
        var _a, _b, _c;
        const obj = {};
        if (message.previous !== "") {
            obj.previous = message.previous;
        }
        if (message.timestamp !== "") {
            obj.timestamp = message.timestamp;
        }
        if (message.witness !== "") {
            obj.witness = message.witness;
        }
        if (message.transaction_merkle_root !== "") {
            obj.transaction_merkle_root = message.transaction_merkle_root;
        }
        if ((_a = message.extensions) === null || _a === void 0 ? void 0 : _a.length) {
            obj.extensions = message.extensions.map((e) => block_header_extensions.toJSON(e));
        }
        if (message.witness_signature !== "") {
            obj.witness_signature = message.witness_signature;
        }
        if ((_b = message.transactions) === null || _b === void 0 ? void 0 : _b.length) {
            obj.transactions = message.transactions.map((e) => transaction.toJSON(e));
        }
        if (message.block_id !== "") {
            obj.block_id = message.block_id;
        }
        if (message.signing_key !== "") {
            obj.signing_key = message.signing_key;
        }
        if ((_c = message.transaction_ids) === null || _c === void 0 ? void 0 : _c.length) {
            obj.transaction_ids = message.transaction_ids;
        }
        return obj;
    },
    create(base) {
        return block.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        const message = createBaseblock();
        message.previous = (_a = object.previous) !== null && _a !== void 0 ? _a : "";
        message.timestamp = (_b = object.timestamp) !== null && _b !== void 0 ? _b : "";
        message.witness = (_c = object.witness) !== null && _c !== void 0 ? _c : "";
        message.transaction_merkle_root = (_d = object.transaction_merkle_root) !== null && _d !== void 0 ? _d : "";
        message.extensions = ((_e = object.extensions) === null || _e === void 0 ? void 0 : _e.map((e) => block_header_extensions.fromPartial(e))) || [];
        message.witness_signature = (_f = object.witness_signature) !== null && _f !== void 0 ? _f : "";
        message.transactions = ((_g = object.transactions) === null || _g === void 0 ? void 0 : _g.map((e) => transaction.fromPartial(e))) || [];
        message.block_id = (_h = object.block_id) !== null && _h !== void 0 ? _h : "";
        message.signing_key = (_j = object.signing_key) !== null && _j !== void 0 ? _j : "";
        message.transaction_ids = ((_k = object.transaction_ids) === null || _k === void 0 ? void 0 : _k.map((e) => e)) || [];
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
