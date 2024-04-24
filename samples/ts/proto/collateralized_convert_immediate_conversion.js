/* eslint-disable */
import _m0 from "protobufjs/minimal.js";
import { asset } from "./asset.js";
export const protobufPackage = "hive.protocol.buffers";
function createBasecollateralized_convert_immediate_conversion() {
    return { owner: "", requestid: 0, hbd_out: undefined };
}
export const collateralized_convert_immediate_conversion = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.owner !== "") {
            writer.uint32(10).string(message.owner);
        }
        if (message.requestid !== 0) {
            writer.uint32(16).uint32(message.requestid);
        }
        if (message.hbd_out !== undefined) {
            asset.encode(message.hbd_out, writer.uint32(26).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasecollateralized_convert_immediate_conversion();
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
                    message.requestid = reader.uint32();
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.hbd_out = asset.decode(reader, reader.uint32());
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
            owner: isSet(object.owner) ? globalThis.String(object.owner) : "",
            requestid: isSet(object.requestid) ? globalThis.Number(object.requestid) : 0,
            hbd_out: isSet(object.hbd_out) ? asset.fromJSON(object.hbd_out) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.owner !== undefined) {
            obj.owner = message.owner;
        }
        if (message.requestid !== undefined) {
            obj.requestid = Math.round(message.requestid);
        }
        if (message.hbd_out !== undefined) {
            obj.hbd_out = asset.toJSON(message.hbd_out);
        }
        return obj;
    },
    create(base) {
        return collateralized_convert_immediate_conversion.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBasecollateralized_convert_immediate_conversion();
        message.owner = (_a = object.owner) !== null && _a !== void 0 ? _a : "";
        message.requestid = (_b = object.requestid) !== null && _b !== void 0 ? _b : 0;
        message.hbd_out = (object.hbd_out !== undefined && object.hbd_out !== null)
            ? asset.fromPartial(object.hbd_out)
            : undefined;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
