/* eslint-disable */
export const protobufPackage = "hive.protocol.buffers";
function createBaselimit_order_cancel() {
    return { owner: "", orderid: 0 };
}
export const limit_order_cancel = {
    fromJSON(object) {
        return {
            owner: isSet(object.owner) ? globalThis.String(object.owner) : "",
            orderid: isSet(object.orderid) ? globalThis.Number(object.orderid) : 0,
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
        return obj;
    },
    create(base) {
        return limit_order_cancel.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaselimit_order_cancel();
        message.owner = object.owner ?? "";
        message.orderid = object.orderid ?? 0;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
