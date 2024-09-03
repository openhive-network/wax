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
        return hardfork.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBasehardfork();
        message.hardfork_id = (_a = object.hardfork_id) !== null && _a !== void 0 ? _a : 0;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
