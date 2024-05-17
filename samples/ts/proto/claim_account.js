/* eslint-disable */
import { asset } from "./asset.js";
import { future_extensions } from "./future_extensions.js";
export const protobufPackage = "hive.protocol.buffers";
function createBaseclaim_account() {
    return { creator: "", fee: undefined, extensions: [] };
}
export const claim_account = {
    fromJSON(object) {
        return {
            creator: isSet(object.creator) ? globalThis.String(object.creator) : "",
            fee: isSet(object.fee) ? asset.fromJSON(object.fee) : undefined,
            extensions: globalThis.Array.isArray(object === null || object === void 0 ? void 0 : object.extensions)
                ? object.extensions.map((e) => future_extensions.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        var _a;
        const obj = {};
        if (message.creator !== undefined) {
            obj.creator = message.creator;
        }
        if (message.fee !== undefined) {
            obj.fee = asset.toJSON(message.fee);
        }
        if ((_a = message.extensions) === null || _a === void 0 ? void 0 : _a.length) {
            obj.extensions = message.extensions.map((e) => future_extensions.toJSON(e));
        }
        return obj;
    },
    create(base) {
        return claim_account.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseclaim_account();
        message.creator = (_a = object.creator) !== null && _a !== void 0 ? _a : "";
        message.fee = (object.fee !== undefined && object.fee !== null) ? asset.fromPartial(object.fee) : undefined;
        message.extensions = ((_b = object.extensions) === null || _b === void 0 ? void 0 : _b.map((e) => future_extensions.fromPartial(e))) || [];
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
