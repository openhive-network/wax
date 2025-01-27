/* eslint-disable */
export const protobufPackage = "hive.protocol.buffers";
function createBasehardfork() {
    return { hardfork_id: 0 };
}
export const hardfork = {
    fromJSON(object) {
        return { hardfork_id: isSet(object.hardfork_id) ? globalThis.Number(object.hardfork_id) : 0 };
    },
    toJSON(message) {
        const obj = {};
        if (message.hardfork_id !== undefined) {
            obj.hardfork_id = Math.round(message.hardfork_id);
        }
        return obj;
    },
    create(base) {
        return hardfork.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBasehardfork();
        message.hardfork_id = object.hardfork_id ?? 0;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
