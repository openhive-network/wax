/* eslint-disable */
import { asset } from "./asset.js";
export const protobufPackage = "hive.protocol.buffers";
function createBaselimit_order_create() {
    return {
        owner: "",
        orderid: 0,
        amount_to_sell: undefined,
        min_to_receive: undefined,
        fill_or_kill: false,
        expiration: "",
    };
}
export const limit_order_create = {
    fromJSON(object) {
        return {
            owner: isSet(object.owner) ? globalThis.String(object.owner) : "",
            orderid: isSet(object.orderid) ? globalThis.Number(object.orderid) : 0,
            amount_to_sell: isSet(object.amount_to_sell) ? asset.fromJSON(object.amount_to_sell) : undefined,
            min_to_receive: isSet(object.min_to_receive) ? asset.fromJSON(object.min_to_receive) : undefined,
            fill_or_kill: isSet(object.fill_or_kill) ? globalThis.Boolean(object.fill_or_kill) : false,
            expiration: isSet(object.expiration) ? globalThis.String(object.expiration) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.owner !== undefined) {
            obj.owner = message.owner;
        }
        if (message.orderid !== undefined) {
            obj.orderid = Math.round(message.orderid);
        }
        if (message.amount_to_sell !== undefined) {
            obj.amount_to_sell = asset.toJSON(message.amount_to_sell);
        }
        if (message.min_to_receive !== undefined) {
            obj.min_to_receive = asset.toJSON(message.min_to_receive);
        }
        if (message.fill_or_kill !== undefined) {
            obj.fill_or_kill = message.fill_or_kill;
        }
        if (message.expiration !== undefined) {
            obj.expiration = message.expiration;
        }
        return obj;
    },
    create(base) {
        return limit_order_create.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d;
        const message = createBaselimit_order_create();
        message.owner = (_a = object.owner) !== null && _a !== void 0 ? _a : "";
        message.orderid = (_b = object.orderid) !== null && _b !== void 0 ? _b : 0;
        message.amount_to_sell = (object.amount_to_sell !== undefined && object.amount_to_sell !== null)
            ? asset.fromPartial(object.amount_to_sell)
            : undefined;
        message.min_to_receive = (object.min_to_receive !== undefined && object.min_to_receive !== null)
            ? asset.fromPartial(object.min_to_receive)
            : undefined;
        message.fill_or_kill = (_c = object.fill_or_kill) !== null && _c !== void 0 ? _c : false;
        message.expiration = (_d = object.expiration) !== null && _d !== void 0 ? _d : "";
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
