/* eslint-disable */
import _m0 from "protobufjs/minimal.js";
export const protobufPackage = "hive.protocol.buffers";
function createBaseproducer_missed() {
    return { producer: "" };
}
export const producer_missed = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.producer !== "") {
            writer.uint32(10).string(message.producer);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseproducer_missed();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.producer = reader.string();
                    continue;
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
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
