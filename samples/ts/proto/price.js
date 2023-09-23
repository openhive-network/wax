/* eslint-disable */
import _m0 from "protobufjs/minimal.js";
import { asset } from "./asset.js";
export const protobufPackage = "hive.protocol.buffers";
function createBaseprice() {
    return { base: undefined, quote: undefined };
}
export const price = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.base !== undefined) {
            asset.encode(message.base, writer.uint32(10).fork()).ldelim();
        }
        if (message.quote !== undefined) {
            asset.encode(message.quote, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseprice();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.base = asset.decode(reader, reader.uint32());
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.quote = asset.decode(reader, reader.uint32());
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
            base: isSet(object.base) ? asset.fromJSON(object.base) : undefined,
            quote: isSet(object.quote) ? asset.fromJSON(object.quote) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.base !== undefined) {
            obj.base = asset.toJSON(message.base);
        }
        if (message.quote !== undefined) {
            obj.quote = asset.toJSON(message.quote);
        }
        return obj;
    },
    create(base) {
        return price.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        const message = createBaseprice();
        message.base = (object.base !== undefined && object.base !== null) ? asset.fromPartial(object.base) : undefined;
        message.quote = (object.quote !== undefined && object.quote !== null) ? asset.fromPartial(object.quote) : undefined;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
