/* eslint-disable */
import { future_extensions } from "./future_extensions.js";
import { operation } from "./operation.js";
export const protobufPackage = "hive.protocol.buffers";
function createBasetransaction() {
    return { ref_block_num: 0, ref_block_prefix: 0, expiration: "", operations: [], extensions: [], signatures: [] };
}
export const transaction = {
    fromJSON(object) {
        return {
            ref_block_num: isSet(object.ref_block_num) ? globalThis.Number(object.ref_block_num) : 0,
            ref_block_prefix: isSet(object.ref_block_prefix) ? globalThis.Number(object.ref_block_prefix) : 0,
            expiration: isSet(object.expiration) ? globalThis.String(object.expiration) : "",
            operations: globalThis.Array.isArray(object === null || object === void 0 ? void 0 : object.operations)
                ? object.operations.map((e) => operation.fromJSON(e))
                : [],
            extensions: globalThis.Array.isArray(object === null || object === void 0 ? void 0 : object.extensions)
                ? object.extensions.map((e) => future_extensions.fromJSON(e))
                : [],
            signatures: globalThis.Array.isArray(object === null || object === void 0 ? void 0 : object.signatures)
                ? object.signatures.map((e) => globalThis.String(e))
                : [],
        };
    },
    toJSON(message) {
        var _a, _b, _c;
        const obj = {};
        if (message.ref_block_num !== undefined) {
            obj.ref_block_num = Math.round(message.ref_block_num);
        }
        if (message.ref_block_prefix !== undefined) {
            obj.ref_block_prefix = Math.round(message.ref_block_prefix);
        }
        if (message.expiration !== undefined) {
            obj.expiration = message.expiration;
        }
        if ((_a = message.operations) === null || _a === void 0 ? void 0 : _a.length) {
            obj.operations = message.operations.map((e) => operation.toJSON(e));
        }
        if ((_b = message.extensions) === null || _b === void 0 ? void 0 : _b.length) {
            obj.extensions = message.extensions.map((e) => future_extensions.toJSON(e));
        }
        if ((_c = message.signatures) === null || _c === void 0 ? void 0 : _c.length) {
            obj.signatures = message.signatures;
        }
        return obj;
    },
    create(base) {
        return transaction.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e, _f;
        const message = createBasetransaction();
        message.ref_block_num = (_a = object.ref_block_num) !== null && _a !== void 0 ? _a : 0;
        message.ref_block_prefix = (_b = object.ref_block_prefix) !== null && _b !== void 0 ? _b : 0;
        message.expiration = (_c = object.expiration) !== null && _c !== void 0 ? _c : "";
        message.operations = ((_d = object.operations) === null || _d === void 0 ? void 0 : _d.map((e) => operation.fromPartial(e))) || [];
        message.extensions = ((_e = object.extensions) === null || _e === void 0 ? void 0 : _e.map((e) => future_extensions.fromPartial(e))) || [];
        message.signatures = ((_f = object.signatures) === null || _f === void 0 ? void 0 : _f.map((e) => e)) || [];
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
