/* eslint-disable */
import _m0 from "protobufjs/minimal.js";
import { asset } from "./asset.js";
export const protobufPackage = "hive.protocol.buffers";
function createBasehardfork_hive_restore() {
    return { account: "", treasury: "", hbd_transferred: undefined, hive_transferred: undefined };
}
export const hardfork_hive_restore = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.account !== "") {
            writer.uint32(10).string(message.account);
        }
        if (message.treasury !== "") {
            writer.uint32(18).string(message.treasury);
        }
        if (message.hbd_transferred !== undefined) {
            asset.encode(message.hbd_transferred, writer.uint32(26).fork()).ldelim();
        }
        if (message.hive_transferred !== undefined) {
            asset.encode(message.hive_transferred, writer.uint32(34).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasehardfork_hive_restore();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.account = reader.string();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.treasury = reader.string();
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.hbd_transferred = asset.decode(reader, reader.uint32());
                    continue;
                case 4:
                    if (tag !== 34) {
                        break;
                    }
                    message.hive_transferred = asset.decode(reader, reader.uint32());
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
            account: isSet(object.account) ? globalThis.String(object.account) : "",
            treasury: isSet(object.treasury) ? globalThis.String(object.treasury) : "",
            hbd_transferred: isSet(object.hbd_transferred) ? asset.fromJSON(object.hbd_transferred) : undefined,
            hive_transferred: isSet(object.hive_transferred) ? asset.fromJSON(object.hive_transferred) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.account !== undefined) {
            obj.account = message.account;
        }
        if (message.treasury !== undefined) {
            obj.treasury = message.treasury;
        }
        if (message.hbd_transferred !== undefined) {
            obj.hbd_transferred = asset.toJSON(message.hbd_transferred);
        }
        if (message.hive_transferred !== undefined) {
            obj.hive_transferred = asset.toJSON(message.hive_transferred);
        }
        return obj;
    },
    create(base) {
        return hardfork_hive_restore.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBasehardfork_hive_restore();
        message.account = (_a = object.account) !== null && _a !== void 0 ? _a : "";
        message.treasury = (_b = object.treasury) !== null && _b !== void 0 ? _b : "";
        message.hbd_transferred = (object.hbd_transferred !== undefined && object.hbd_transferred !== null)
            ? asset.fromPartial(object.hbd_transferred)
            : undefined;
        message.hive_transferred = (object.hive_transferred !== undefined && object.hive_transferred !== null)
            ? asset.fromPartial(object.hive_transferred)
            : undefined;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
