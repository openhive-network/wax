/* eslint-disable */
import _m0 from "protobufjs/minimal.js";
import { future_extensions } from "./future_extensions.js";
import { operation } from "./operation.js";
export const protobufPackage = "hive.protocol.buffers";
function createBasetransaction() {
    return { ref_block_num: 0, ref_block_prefix: 0, expiration: "", operations: [], extensions: [], signatures: [] };
}
export const transaction = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.ref_block_num !== 0) {
            writer.uint32(8).uint32(message.ref_block_num);
        }
        if (message.ref_block_prefix !== 0) {
            writer.uint32(16).uint32(message.ref_block_prefix);
        }
        if (message.expiration !== "") {
            writer.uint32(26).string(message.expiration);
        }
        for (const v of message.operations) {
            operation.encode(v, writer.uint32(34).fork()).ldelim();
        }
        for (const v of message.extensions) {
            future_extensions.encode(v, writer.uint32(42).fork()).ldelim();
        }
        for (const v of message.signatures) {
            writer.uint32(50).string(v);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasetransaction();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 8) {
                        break;
                    }
                    message.ref_block_num = reader.uint32();
                    continue;
                case 2:
                    if (tag !== 16) {
                        break;
                    }
                    message.ref_block_prefix = reader.uint32();
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.expiration = reader.string();
                    continue;
                case 4:
                    if (tag !== 34) {
                        break;
                    }
                    message.operations.push(operation.decode(reader, reader.uint32()));
                    continue;
                case 5:
                    if (tag !== 42) {
                        break;
                    }
                    message.extensions.push(future_extensions.decode(reader, reader.uint32()));
                    continue;
                case 6:
                    if (tag !== 50) {
                        break;
                    }
                    message.signatures.push(reader.string());
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
            ref_block_num: isSet(object.ref_block_num) ? Number(object.ref_block_num) : 0,
            ref_block_prefix: isSet(object.ref_block_prefix) ? Number(object.ref_block_prefix) : 0,
            expiration: isSet(object.expiration) ? String(object.expiration) : "",
            operations: Array.isArray(object === null || object === void 0 ? void 0 : object.operations) ? object.operations.map((e) => operation.fromJSON(e)) : [],
            extensions: Array.isArray(object === null || object === void 0 ? void 0 : object.extensions)
                ? object.extensions.map((e) => future_extensions.fromJSON(e))
                : [],
            signatures: Array.isArray(object === null || object === void 0 ? void 0 : object.signatures) ? object.signatures.map((e) => String(e)) : [],
        };
    },
    toJSON(message) {
        var _a, _b, _c;
        const obj = {};
        if (message.ref_block_num !== 0) {
            obj.ref_block_num = Math.round(message.ref_block_num);
        }
        if (message.ref_block_prefix !== 0) {
            obj.ref_block_prefix = Math.round(message.ref_block_prefix);
        }
        if (message.expiration !== "") {
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
