import * as _m0 from "protobufjs/minimal.js";
export const protobufPackage = "hive.protocol.buffers";
function createBaselimit_order_cancel() {
    return { order: "", orderid: 0 };
}
export const limit_order_cancel = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.order !== "") {
            writer.uint32(66).string(message.order);
        }
        if (message.orderid !== 0) {
            writer.uint32(72).uint32(message.orderid);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaselimit_order_cancel();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 8:
                    if (tag !== 66) {
                        break;
                    }
                    message.order = reader.string();
                    continue;
                case 9:
                    if (tag !== 72) {
                        break;
                    }
                    message.orderid = reader.uint32();
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
            order: isSet(object.order) ? String(object.order) : "",
            orderid: isSet(object.orderid) ? Number(object.orderid) : 0,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.order !== "") {
            obj.order = message.order;
        }
        if (message.orderid !== 0) {
            obj.orderid = Math.round(message.orderid);
        }
        return obj;
    },
    create(base) {
        return limit_order_cancel.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaselimit_order_cancel();
        message.order = (_a = object.order) !== null && _a !== void 0 ? _a : "";
        message.orderid = (_b = object.orderid) !== null && _b !== void 0 ? _b : 0;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
