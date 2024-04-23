/* eslint-disable */
import _m0 from "protobufjs/minimal.js";
import { price } from "./price.js";
export const protobufPackage = "hive.protocol.buffers";
function createBasefeed_publish() {
    return { publisher: "", exchange_rate: undefined };
}
export const feed_publish = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.publisher !== "") {
            writer.uint32(10).string(message.publisher);
        }
        if (message.exchange_rate !== undefined) {
            price.encode(message.exchange_rate, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasefeed_publish();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.publisher = reader.string();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.exchange_rate = price.decode(reader, reader.uint32());
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
        return {
            publisher: isSet(object.publisher) ? String(object.publisher) : "",
            exchange_rate: isSet(object.exchange_rate) ? price.fromJSON(object.exchange_rate) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.publisher !== undefined) {
            obj.publisher = message.publisher;
        }
        if (message.exchange_rate !== undefined) {
            obj.exchange_rate = price.toJSON(message.exchange_rate);
        }
        return obj;
    },
    create(base) {
        return feed_publish.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBasefeed_publish();
        message.publisher = (_a = object.publisher) !== null && _a !== void 0 ? _a : "";
        message.exchange_rate = (object.exchange_rate !== undefined && object.exchange_rate !== null)
            ? price.fromPartial(object.exchange_rate)
            : undefined;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
