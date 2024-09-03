/* eslint-disable */
import { asset } from "./asset.js";
export const protobufPackage = "hive.protocol.buffers";
function createBasecollateralized_convert_immediate_conversion() {
    return { owner: "", requestid: 0, hbd_out: undefined };
}
export const collateralized_convert_immediate_conversion = {
    fromJSON(object) {
        return {
            owner: isSet(object.owner) ? globalThis.String(object.owner) : "",
            requestid: isSet(object.requestid) ? globalThis.Number(object.requestid) : 0,
            hbd_out: isSet(object.hbd_out) ? asset.fromJSON(object.hbd_out) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.owner !== undefined) {
            obj.owner = message.owner;
        }
        if (message.requestid !== undefined) {
            obj.requestid = Math.round(message.requestid);
        }
        if (message.hbd_out !== undefined) {
            obj.hbd_out = asset.toJSON(message.hbd_out);
        }
        return obj;
    },
    create(base) {
        return collateralized_convert_immediate_conversion.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBasecollateralized_convert_immediate_conversion();
        message.owner = (_a = object.owner) !== null && _a !== void 0 ? _a : "";
        message.requestid = (_b = object.requestid) !== null && _b !== void 0 ? _b : 0;
        message.hbd_out = (object.hbd_out !== undefined && object.hbd_out !== null)
            ? asset.fromPartial(object.hbd_out)
            : undefined;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
