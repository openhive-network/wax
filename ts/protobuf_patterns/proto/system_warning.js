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
        return system_warning.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBasesystem_warning();
        message.message = (_a = object.message) !== null && _a !== void 0 ? _a : "";
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
