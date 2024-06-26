/* eslint-disable */
import { asset } from "./asset.js";
export const protobufPackage = "hive.protocol.buffers";
function createBasefill_order() {
    return {
        current_owner: "",
        current_orderid: 0,
        current_pays: undefined,
        open_owner: "",
        open_orderid: 0,
        open_pays: undefined,
    };
}
export const fill_order = {
    fromJSON(object) {
        return {
            current_owner: isSet(object.current_owner) ? globalThis.String(object.current_owner) : "",
            current_orderid: isSet(object.current_orderid) ? globalThis.Number(object.current_orderid) : 0,
            current_pays: isSet(object.current_pays) ? asset.fromJSON(object.current_pays) : undefined,
            open_owner: isSet(object.open_owner) ? globalThis.String(object.open_owner) : "",
            open_orderid: isSet(object.open_orderid) ? globalThis.Number(object.open_orderid) : 0,
            open_pays: isSet(object.open_pays) ? asset.fromJSON(object.open_pays) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.current_owner !== undefined) {
            obj.current_owner = message.current_owner;
        }
        if (message.current_orderid !== undefined) {
            obj.current_orderid = Math.round(message.current_orderid);
        }
        if (message.current_pays !== undefined) {
            obj.current_pays = asset.toJSON(message.current_pays);
        }
        if (message.open_owner !== undefined) {
            obj.open_owner = message.open_owner;
        }
        if (message.open_orderid !== undefined) {
            obj.open_orderid = Math.round(message.open_orderid);
        }
        if (message.open_pays !== undefined) {
            obj.open_pays = asset.toJSON(message.open_pays);
        }
        return obj;
    },
    create(base) {
        return fill_order.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d;
        const message = createBasefill_order();
        message.current_owner = (_a = object.current_owner) !== null && _a !== void 0 ? _a : "";
        message.current_orderid = (_b = object.current_orderid) !== null && _b !== void 0 ? _b : 0;
        message.current_pays = (object.current_pays !== undefined && object.current_pays !== null)
            ? asset.fromPartial(object.current_pays)
            : undefined;
        message.open_owner = (_c = object.open_owner) !== null && _c !== void 0 ? _c : "";
        message.open_orderid = (_d = object.open_orderid) !== null && _d !== void 0 ? _d : 0;
        message.open_pays = (object.open_pays !== undefined && object.open_pays !== null)
            ? asset.fromPartial(object.open_pays)
            : undefined;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
