/* eslint-disable */
import { asset } from "./asset.js";
export const protobufPackage = "hive.protocol.buffers";
function createBaselimit_order_cancelled() {
    return { seller: "", orderid: 0, amount_back: undefined };
}
export const limit_order_cancelled = {
    fromJSON(object) {
        return {
            seller: isSet(object.seller) ? globalThis.String(object.seller) : "",
            orderid: isSet(object.orderid) ? globalThis.Number(object.orderid) : 0,
            amount_back: isSet(object.amount_back) ? asset.fromJSON(object.amount_back) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.seller !== undefined) {
            obj.seller = message.seller;
        }
        if (message.orderid !== undefined) {
            obj.orderid = Math.round(message.orderid);
        }
        if (message.amount_back !== undefined) {
            obj.amount_back = asset.toJSON(message.amount_back);
        }
        return obj;
    },
    create(base) {
        return limit_order_cancelled.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaselimit_order_cancelled();
        message.seller = object.seller ?? "";
        message.orderid = object.orderid ?? 0;
        message.amount_back = (object.amount_back !== undefined && object.amount_back !== null)
            ? asset.fromPartial(object.amount_back)
            : undefined;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
