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
            operations: globalThis.Array.isArray(object?.operations)
                ? object.operations.map((e) => operation.fromJSON(e))
                : [],
            extensions: globalThis.Array.isArray(object?.extensions)
                ? object.extensions.map((e) => future_extensions.fromJSON(e))
                : [],
            signatures: globalThis.Array.isArray(object?.signatures)
                ? object.signatures.map((e) => globalThis.String(e))
                : [],
        };
    },
    toJSON(message) {
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
        if (message.operations?.length) {
            obj.operations = message.operations.map((e) => operation.toJSON(e));
        }
        if (message.extensions?.length) {
            obj.extensions = message.extensions.map((e) => future_extensions.toJSON(e));
        }
        if (message.signatures?.length) {
            obj.signatures = message.signatures;
        }
        return obj;
    },
    create(base) {
        return transaction.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBasetransaction();
        message.ref_block_num = object.ref_block_num ?? 0;
        message.ref_block_prefix = object.ref_block_prefix ?? 0;
        message.expiration = object.expiration ?? "";
        message.operations = object.operations?.map((e) => operation.fromPartial(e)) || [];
        message.extensions = object.extensions?.map((e) => future_extensions.fromPartial(e)) || [];
        message.signatures = object.signatures?.map((e) => e) || [];
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
