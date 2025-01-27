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
        return shutdown_witness.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaseshutdown_witness();
        message.owner = object.owner ?? "";
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
