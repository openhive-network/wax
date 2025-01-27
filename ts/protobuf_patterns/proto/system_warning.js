/* eslint-disable */
export const protobufPackage = "hive.protocol.buffers";
function createBasesystem_warning() {
    return { message: "" };
}
export const system_warning = {
    fromJSON(object) {
        return { message: isSet(object.message) ? globalThis.String(object.message) : "" };
    },
    toJSON(message) {
        const obj = {};
        if (message.message !== undefined) {
            obj.message = message.message;
        }
        return obj;
    },
    create(base) {
        return system_warning.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBasesystem_warning();
        message.message = object.message ?? "";
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
