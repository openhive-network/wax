/* eslint-disable */
export const protobufPackage = "hive.protocol.buffers";
function createBaseproducer_missed() {
    return { producer: "" };
}
export const producer_missed = {
    fromJSON(object) {
        return { producer: isSet(object.producer) ? globalThis.String(object.producer) : "" };
    },
    toJSON(message) {
        const obj = {};
        if (message.producer !== undefined) {
            obj.producer = message.producer;
        }
        return obj;
    },
    create(base) {
        return producer_missed.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseproducer_missed();
        message.producer = (_a = object.producer) !== null && _a !== void 0 ? _a : "";
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
