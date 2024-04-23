/* eslint-disable */
import _m0 from "protobufjs/minimal.js";
import { asset } from "./asset.js";
export const protobufPackage = "hive.protocol.buffers";
function createBasevesting_shares_split() {
    return { owner: "", vesting_shares_before_split: undefined, vesting_shares_after_split: undefined };
}
export const vesting_shares_split = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.owner !== "") {
            writer.uint32(10).string(message.owner);
        }
        if (message.vesting_shares_before_split !== undefined) {
            asset.encode(message.vesting_shares_before_split, writer.uint32(18).fork()).ldelim();
        }
        if (message.vesting_shares_after_split !== undefined) {
            asset.encode(message.vesting_shares_after_split, writer.uint32(26).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasevesting_shares_split();
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
                    message.vesting_shares_before_split = asset.decode(reader, reader.uint32());
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.vesting_shares_after_split = asset.decode(reader, reader.uint32());
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
            vesting_shares_before_split: isSet(object.vesting_shares_before_split)
                ? asset.fromJSON(object.vesting_shares_before_split)
                : undefined,
            vesting_shares_after_split: isSet(object.vesting_shares_after_split)
                ? asset.fromJSON(object.vesting_shares_after_split)
                : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.owner !== undefined) {
            obj.owner = message.owner;
        }
        if (message.vesting_shares_before_split !== undefined) {
            obj.vesting_shares_before_split = asset.toJSON(message.vesting_shares_before_split);
        }
        if (message.vesting_shares_after_split !== undefined) {
            obj.vesting_shares_after_split = asset.toJSON(message.vesting_shares_after_split);
        }
        return obj;
    },
    create(base) {
        return vesting_shares_split.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBasevesting_shares_split();
        message.owner = (_a = object.owner) !== null && _a !== void 0 ? _a : "";
        message.vesting_shares_before_split =
            (object.vesting_shares_before_split !== undefined && object.vesting_shares_before_split !== null)
                ? asset.fromPartial(object.vesting_shares_before_split)
                : undefined;
        message.vesting_shares_after_split =
            (object.vesting_shares_after_split !== undefined && object.vesting_shares_after_split !== null)
                ? asset.fromPartial(object.vesting_shares_after_split)
                : undefined;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
