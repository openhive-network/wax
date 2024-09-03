/* eslint-disable */
import { asset } from "./asset.js";
export const protobufPackage = "hive.protocol.buffers";
function createBaseinterest() {
    return { owner: "", interest: undefined, is_saved_into_hbd_balance: false };
}
export const interest = {
    fromJSON(object) {
        return {
            owner: isSet(object.owner) ? globalThis.String(object.owner) : "",
            interest: isSet(object.interest) ? asset.fromJSON(object.interest) : undefined,
            is_saved_into_hbd_balance: isSet(object.is_saved_into_hbd_balance)
                ? globalThis.Boolean(object.is_saved_into_hbd_balance)
                : false,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.owner !== undefined) {
            obj.owner = message.owner;
        }
        if (message.interest !== undefined) {
            obj.interest = asset.toJSON(message.interest);
        }
        if (message.is_saved_into_hbd_balance !== undefined) {
            obj.is_saved_into_hbd_balance = message.is_saved_into_hbd_balance;
        }
        return obj;
    },
    create(base) {
        return interest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseinterest();
        message.owner = (_a = object.owner) !== null && _a !== void 0 ? _a : "";
        message.interest = (object.interest !== undefined && object.interest !== null)
            ? asset.fromPartial(object.interest)
            : undefined;
        message.is_saved_into_hbd_balance = (_b = object.is_saved_into_hbd_balance) !== null && _b !== void 0 ? _b : false;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
