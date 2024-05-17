/* eslint-disable */
import { asset } from "./asset.js";
export const protobufPackage = "hive.protocol.buffers";
function createBasedhf_conversion() {
    return { treasury: "", hive_amount_in: undefined, hbd_amount_out: undefined };
}
export const dhf_conversion = {
    fromJSON(object) {
        return {
            treasury: isSet(object.treasury) ? globalThis.String(object.treasury) : "",
            hive_amount_in: isSet(object.hive_amount_in) ? asset.fromJSON(object.hive_amount_in) : undefined,
            hbd_amount_out: isSet(object.hbd_amount_out) ? asset.fromJSON(object.hbd_amount_out) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.treasury !== undefined) {
            obj.treasury = message.treasury;
        }
        if (message.hive_amount_in !== undefined) {
            obj.hive_amount_in = asset.toJSON(message.hive_amount_in);
        }
        if (message.hbd_amount_out !== undefined) {
            obj.hbd_amount_out = asset.toJSON(message.hbd_amount_out);
        }
        return obj;
    },
    create(base) {
        return dhf_conversion.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBasedhf_conversion();
        message.treasury = (_a = object.treasury) !== null && _a !== void 0 ? _a : "";
        message.hive_amount_in = (object.hive_amount_in !== undefined && object.hive_amount_in !== null)
            ? asset.fromPartial(object.hive_amount_in)
            : undefined;
        message.hbd_amount_out = (object.hbd_amount_out !== undefined && object.hbd_amount_out !== null)
            ? asset.fromPartial(object.hbd_amount_out)
            : undefined;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
