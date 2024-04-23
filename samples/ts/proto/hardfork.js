/* eslint-disable */
import _m0 from "protobufjs/minimal.js";
export const protobufPackage = "hive.protocol.buffers";
function createBasehardfork() {
    return { hardfork_id: 0 };
}
export const hardfork = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.hardfork_id !== 0) {
            writer.uint32(8).uint32(message.hardfork_id);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasehardfork();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 8) {
                        break;
                    }
                    message.hardfork_id = reader.uint32();
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
        return { hardfork_id: isSet(object.hardfork_id) ? Number(object.hardfork_id) : 0 };
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
