/* eslint-disable */
import _m0 from "protobufjs/minimal.js";
import { asset } from "./asset.js";
export const protobufPackage = "hive.protocol.buffers";
function createBasedhf_conversion() {
    return { treasury: "", hive_amount_in: undefined, hbd_amount_out: undefined };
}
export const dhf_conversion = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.treasury !== "") {
            writer.uint32(10).string(message.treasury);
        }
        if (message.hive_amount_in !== undefined) {
            asset.encode(message.hive_amount_in, writer.uint32(18).fork()).ldelim();
        }
        if (message.hbd_amount_out !== undefined) {
            asset.encode(message.hbd_amount_out, writer.uint32(26).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasedhf_conversion();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.treasury = reader.string();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.hive_amount_in = asset.decode(reader, reader.uint32());
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.hbd_amount_out = asset.decode(reader, reader.uint32());
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
            treasury: isSet(object.treasury) ? String(object.treasury) : "",
            hive_amount_in: isSet(object.hive_amount_in) ? asset.fromJSON(object.hive_amount_in) : undefined,
            hbd_amount_out: isSet(object.hbd_amount_out) ? asset.fromJSON(object.hbd_amount_out) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.treasury !== "") {
            obj.treasury = message.treasury;
        }
        if (message.hive_amount_in !== undefined) {
            obj.hive_amount_in = asset.toJSON(message.hive_amount_in);
        }
        if (message.hbd_amount_out !== undefined) {
            obj.hbd_amount_out = asset.toJSON(message.hbd_amount_out);
        }
        return obj;
    },
    create(base) {
        return dhf_conversion.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBasedhf_conversion();
        message.treasury = (_a = object.treasury) !== null && _a !== void 0 ? _a : "";
        message.hive_amount_in = (object.hive_amount_in !== undefined && object.hive_amount_in !== null)
            ? asset.fromPartial(object.hive_amount_in)
            : undefined;
        message.hbd_amount_out = (object.hbd_amount_out !== undefined && object.hbd_amount_out !== null)
            ? asset.fromPartial(object.hbd_amount_out)
            : undefined;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
