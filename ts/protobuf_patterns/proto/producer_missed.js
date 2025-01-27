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
        return producer_missed.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaseproducer_missed();
        message.producer = object.producer ?? "";
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
