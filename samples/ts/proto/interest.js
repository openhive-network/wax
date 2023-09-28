/* eslint-disable */
import _m0 from "protobufjs/minimal.js";
import { asset } from "./asset.js";
export const protobufPackage = "hive.protocol.buffers";
function createBaseinterest() {
    return { owner: "", interest: undefined, is_saved_into_hbd_balance: false };
}
export const interest = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.owner !== "") {
            writer.uint32(10).string(message.owner);
        }
        if (message.interest !== undefined) {
            asset.encode(message.interest, writer.uint32(18).fork()).ldelim();
        }
        if (message.is_saved_into_hbd_balance === true) {
            writer.uint32(24).bool(message.is_saved_into_hbd_balance);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseinterest();
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
                    if (tag !== 18) {
                        break;
                    }
                    message.interest = asset.decode(reader, reader.uint32());
                    continue;
                case 3:
                    if (tag !== 24) {
                        break;
                    }
                    message.is_saved_into_hbd_balance = reader.bool();
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
            interest: isSet(object.interest) ? asset.fromJSON(object.interest) : undefined,
            is_saved_into_hbd_balance: isSet(object.is_saved_into_hbd_balance)
                ? Boolean(object.is_saved_into_hbd_balance)
                : false,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.owner !== "") {
            obj.owner = message.owner;
        }
        if (message.interest !== undefined) {
            obj.interest = asset.toJSON(message.interest);
        }
        if (message.is_saved_into_hbd_balance === true) {
            obj.is_saved_into_hbd_balance = message.is_saved_into_hbd_balance;
        }
        return obj;
    },
    create(base) {
        return interest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseinterest();
        message.owner = (_a = object.owner) !== null && _a !== void 0 ? _a : "";
        message.interest = (object.interest !== undefined && object.interest !== null)
            ? asset.fromPartial(object.interest)
            : undefined;
        message.is_saved_into_hbd_balance = (_b = object.is_saved_into_hbd_balance) !== null && _b !== void 0 ? _b : false;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
