/* eslint-disable */
import _m0 from "protobufjs/minimal.js";
import { asset } from "./asset.js";
export const protobufPackage = "hive.protocol.buffers";
function createBaselimit_order_create() {
    return {
        owner: "",
        orderid: 0,
        amount_to_sell: undefined,
        min_to_receive: undefined,
        fill_or_kill: false,
        expiration: "",
    };
}
export const limit_order_create = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.owner !== "") {
            writer.uint32(10).string(message.owner);
        }
        if (message.orderid !== 0) {
            writer.uint32(16).uint32(message.orderid);
        }
        if (message.amount_to_sell !== undefined) {
            asset.encode(message.amount_to_sell, writer.uint32(26).fork()).ldelim();
        }
        if (message.min_to_receive !== undefined) {
            asset.encode(message.min_to_receive, writer.uint32(34).fork()).ldelim();
        }
        if (message.fill_or_kill === true) {
            writer.uint32(40).bool(message.fill_or_kill);
        }
        if (message.expiration !== "") {
            writer.uint32(50).string(message.expiration);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaselimit_order_create();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.owner = reader.string();
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
                    message.amount_to_sell = asset.decode(reader, reader.uint32());
                    continue;
                case 4:
                    if (tag !== 34) {
                        break;
                    }
                    message.min_to_receive = asset.decode(reader, reader.uint32());
                    continue;
                case 5:
                    if (tag !== 40) {
                        break;
                    }
                    message.fill_or_kill = reader.bool();
                    continue;
                case 6:
                    if (tag !== 50) {
                        break;
                    }
                    message.expiration = reader.string();
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
            owner: isSet(object.owner) ? String(object.owner) : "",
            orderid: isSet(object.orderid) ? Number(object.orderid) : 0,
            amount_to_sell: isSet(object.amount_to_sell) ? asset.fromJSON(object.amount_to_sell) : undefined,
            min_to_receive: isSet(object.min_to_receive) ? asset.fromJSON(object.min_to_receive) : undefined,
            fill_or_kill: isSet(object.fill_or_kill) ? Boolean(object.fill_or_kill) : false,
            expiration: isSet(object.expiration) ? String(object.expiration) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.owner !== undefined) {
            obj.owner = message.owner;
        }
        if (message.orderid !== undefined) {
            obj.orderid = Math.round(message.orderid);
        }
        if (message.amount_to_sell !== undefined) {
            obj.amount_to_sell = asset.toJSON(message.amount_to_sell);
        }
        if (message.min_to_receive !== undefined) {
            obj.min_to_receive = asset.toJSON(message.min_to_receive);
        }
        if (message.fill_or_kill !== undefined) {
            obj.fill_or_kill = message.fill_or_kill;
        }
        if (message.expiration !== undefined) {
            obj.expiration = message.expiration;
        }
        return obj;
    },
    create(base) {
        return limit_order_create.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d;
        const message = createBaselimit_order_create();
        message.owner = (_a = object.owner) !== null && _a !== void 0 ? _a : "";
        message.orderid = (_b = object.orderid) !== null && _b !== void 0 ? _b : 0;
        message.amount_to_sell = (object.amount_to_sell !== undefined && object.amount_to_sell !== null)
            ? asset.fromPartial(object.amount_to_sell)
            : undefined;
        message.min_to_receive = (object.min_to_receive !== undefined && object.min_to_receive !== null)
            ? asset.fromPartial(object.min_to_receive)
            : undefined;
        message.fill_or_kill = (_c = object.fill_or_kill) !== null && _c !== void 0 ? _c : false;
        message.expiration = (_d = object.expiration) !== null && _d !== void 0 ? _d : "";
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
