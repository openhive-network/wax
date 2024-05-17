/* eslint-disable */
export const protobufPackage = "hive.protocol.buffers";
function createBaseshutdown_witness() {
    return { owner: "" };
}
export const shutdown_witness = {
    fromJSON(object) {
        return { owner: isSet(object.owner) ? globalThis.String(object.owner) : "" };
    },
    toJSON(message) {
        const obj = {};
        if (message.owner !== undefined) {
            obj.owner = message.owner;
        }
        return obj;
    },
    create(base) {
        return shutdown_witness.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseshutdown_witness();
        message.owner = (_a = object.owner) !== null && _a !== void 0 ? _a : "";
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
