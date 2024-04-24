/* eslint-disable */
import _m0 from "protobufjs/minimal.js";
import { asset } from "./asset.js";
export const protobufPackage = "hive.protocol.buffers";
function createBaselimit_order_cancelled() {
    return { seller: "", orderid: 0, amount_back: undefined };
}
export const limit_order_cancelled = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.seller !== "") {
            writer.uint32(10).string(message.seller);
        }
        if (message.orderid !== 0) {
            writer.uint32(16).uint32(message.orderid);
        }
        if (message.amount_back !== undefined) {
            asset.encode(message.amount_back, writer.uint32(26).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaselimit_order_cancelled();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.seller = reader.string();
                    continue;
                case 2:
                    if (tag !== 16) {
                        break;
                    }
                    message.orderid = reader.uint32();
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.amount_back = asset.decode(reader, reader.uint32());
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
            seller: isSet(object.seller) ? globalThis.String(object.seller) : "",
            orderid: isSet(object.orderid) ? globalThis.Number(object.orderid) : 0,
            amount_back: isSet(object.amount_back) ? asset.fromJSON(object.amount_back) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.seller !== undefined) {
            obj.seller = message.seller;
        }
        if (message.orderid !== undefined) {
            obj.orderid = Math.round(message.orderid);
        }
        if (message.amount_back !== undefined) {
            obj.amount_back = asset.toJSON(message.amount_back);
        }
        return obj;
    },
    create(base) {
        return limit_order_cancelled.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaselimit_order_cancelled();
        message.seller = (_a = object.seller) !== null && _a !== void 0 ? _a : "";
        message.orderid = (_b = object.orderid) !== null && _b !== void 0 ? _b : 0;
        message.amount_back = (object.amount_back !== undefined && object.amount_back !== null)
            ? asset.fromPartial(object.amount_back)
            : undefined;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
