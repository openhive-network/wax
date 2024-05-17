/* eslint-disable */
import { void_t } from "./future_extensions.js";
import { transaction } from "./transaction.js";
export const protobufPackage = "hive.protocol.buffers";
function createBasehardfork_version_vote() {
    return { hf_version: "", hf_time: "" };
}
export const hardfork_version_vote = {
    fromJSON(object) {
        return {
            hf_version: isSet(object.hf_version) ? globalThis.String(object.hf_version) : "",
            hf_time: isSet(object.hf_time) ? globalThis.String(object.hf_time) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.hf_version !== undefined) {
            obj.hf_version = message.hf_version;
        }
        if (message.hf_time !== undefined) {
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
    fromJSON(object) {
        return {
            void_t: isSet(object.void_t) ? void_t.fromJSON(object.void_t) : undefined,
            version: isSet(object.version) ? globalThis.String(object.version) : undefined,
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
    fromJSON(object) {
        return {
            previous: isSet(object.previous) ? globalThis.String(object.previous) : "",
            timestamp: isSet(object.timestamp) ? globalThis.String(object.timestamp) : "",
            witness: isSet(object.witness) ? globalThis.String(object.witness) : "",
            transaction_merkle_root: isSet(object.transaction_merkle_root)
                ? globalThis.String(object.transaction_merkle_root)
                : "",
            extensions: globalThis.Array.isArray(object === null || object === void 0 ? void 0 : object.extensions)
                ? object.extensions.map((e) => block_header_extensions.fromJSON(e))
                : [],
            witness_signature: isSet(object.witness_signature) ? globalThis.String(object.witness_signature) : "",
            transactions: globalThis.Array.isArray(object === null || object === void 0 ? void 0 : object.transactions)
                ? object.transactions.map((e) => transaction.fromJSON(e))
                : [],
            block_id: isSet(object.block_id) ? globalThis.String(object.block_id) : "",
            signing_key: isSet(object.signing_key) ? globalThis.String(object.signing_key) : "",
            transaction_ids: globalThis.Array.isArray(object === null || object === void 0 ? void 0 : object.transaction_ids)
                ? object.transaction_ids.map((e) => globalThis.String(e))
                : [],
        };
    },
    toJSON(message) {
        var _a, _b, _c;
        const obj = {};
        if (message.previous !== undefined) {
            obj.previous = message.previous;
        }
        if (message.timestamp !== undefined) {
            obj.timestamp = message.timestamp;
        }
        if (message.witness !== undefined) {
            obj.witness = message.witness;
        }
        if (message.transaction_merkle_root !== undefined) {
            obj.transaction_merkle_root = message.transaction_merkle_root;
        }
        if ((_a = message.extensions) === null || _a === void 0 ? void 0 : _a.length) {
            obj.extensions = message.extensions.map((e) => block_header_extensions.toJSON(e));
        }
        if (message.witness_signature !== undefined) {
            obj.witness_signature = message.witness_signature;
        }
        if ((_b = message.transactions) === null || _b === void 0 ? void 0 : _b.length) {
            obj.transactions = message.transactions.map((e) => transaction.toJSON(e));
        }
        if (message.block_id !== undefined) {
            obj.block_id = message.block_id;
        }
        if (message.signing_key !== undefined) {
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
