/* eslint-disable */
export const protobufPackage = "hive.protocol.buffers";
function createBasecancel_transfer_from_savings() {
    return { from: "", request_id: 0 };
}
export const cancel_transfer_from_savings = {
    fromJSON(object) {
        return {
            from: isSet(object.from) ? globalThis.String(object.from) : "",
            request_id: isSet(object.request_id) ? globalThis.Number(object.request_id) : 0,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.from !== undefined) {
            obj.from = message.from;
        }
        if (message.request_id !== undefined) {
            obj.request_id = Math.round(message.request_id);
        }
        return obj;
    },
    create(base) {
        return cancel_transfer_from_savings.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBasecancel_transfer_from_savings();
        message.from = object.from ?? "";
        message.request_id = object.request_id ?? 0;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
