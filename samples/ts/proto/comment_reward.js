/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal.js";
import { asset } from "./asset.js";
export const protobufPackage = "hive.protocol.buffers";
function createBasecomment_reward() {
    return {
        author: "",
        permlink: "",
        payout: undefined,
        author_rewards: 0,
        total_payout_value: undefined,
        curator_payout_value: undefined,
        beneficiary_payout_value: undefined,
    };
}
export const comment_reward = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.author !== "") {
            writer.uint32(10).string(message.author);
        }
        if (message.permlink !== "") {
            writer.uint32(18).string(message.permlink);
        }
        if (message.payout !== undefined) {
            asset.encode(message.payout, writer.uint32(26).fork()).ldelim();
        }
        if (message.author_rewards !== 0) {
            writer.uint32(32).int64(message.author_rewards);
        }
        if (message.total_payout_value !== undefined) {
            asset.encode(message.total_payout_value, writer.uint32(42).fork()).ldelim();
        }
        if (message.curator_payout_value !== undefined) {
            asset.encode(message.curator_payout_value, writer.uint32(50).fork()).ldelim();
        }
        if (message.beneficiary_payout_value !== undefined) {
            asset.encode(message.beneficiary_payout_value, writer.uint32(58).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasecomment_reward();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.author = reader.string();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.permlink = reader.string();
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.payout = asset.decode(reader, reader.uint32());
                    continue;
                case 4:
                    if (tag !== 32) {
                        break;
                    }
                    message.author_rewards = longToNumber(reader.int64());
                    continue;
                case 5:
                    if (tag !== 42) {
                        break;
                    }
                    message.total_payout_value = asset.decode(reader, reader.uint32());
                    continue;
                case 6:
                    if (tag !== 50) {
                        break;
                    }
                    message.curator_payout_value = asset.decode(reader, reader.uint32());
                    continue;
                case 7:
                    if (tag !== 58) {
                        break;
                    }
                    message.beneficiary_payout_value = asset.decode(reader, reader.uint32());
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
            author: isSet(object.author) ? String(object.author) : "",
            permlink: isSet(object.permlink) ? String(object.permlink) : "",
            payout: isSet(object.payout) ? asset.fromJSON(object.payout) : undefined,
            author_rewards: isSet(object.author_rewards) ? Number(object.author_rewards) : 0,
            total_payout_value: isSet(object.total_payout_value) ? asset.fromJSON(object.total_payout_value) : undefined,
            curator_payout_value: isSet(object.curator_payout_value)
                ? asset.fromJSON(object.curator_payout_value)
                : undefined,
            beneficiary_payout_value: isSet(object.beneficiary_payout_value)
                ? asset.fromJSON(object.beneficiary_payout_value)
                : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.author !== "") {
            obj.author = message.author;
        }
        if (message.permlink !== "") {
            obj.permlink = message.permlink;
        }
        if (message.payout !== undefined) {
            obj.payout = asset.toJSON(message.payout);
        }
        if (message.author_rewards !== 0) {
            obj.author_rewards = Math.round(message.author_rewards);
        }
        if (message.total_payout_value !== undefined) {
            obj.total_payout_value = asset.toJSON(message.total_payout_value);
        }
        if (message.curator_payout_value !== undefined) {
            obj.curator_payout_value = asset.toJSON(message.curator_payout_value);
        }
        if (message.beneficiary_payout_value !== undefined) {
            obj.beneficiary_payout_value = asset.toJSON(message.beneficiary_payout_value);
        }
        return obj;
    },
    create(base) {
        return comment_reward.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBasecomment_reward();
        message.author = (_a = object.author) !== null && _a !== void 0 ? _a : "";
        message.permlink = (_b = object.permlink) !== null && _b !== void 0 ? _b : "";
        message.payout = (object.payout !== undefined && object.payout !== null)
            ? asset.fromPartial(object.payout)
            : undefined;
        message.author_rewards = (_c = object.author_rewards) !== null && _c !== void 0 ? _c : 0;
        message.total_payout_value = (object.total_payout_value !== undefined && object.total_payout_value !== null)
            ? asset.fromPartial(object.total_payout_value)
            : undefined;
        message.curator_payout_value = (object.curator_payout_value !== undefined && object.curator_payout_value !== null)
            ? asset.fromPartial(object.curator_payout_value)
            : undefined;
        message.beneficiary_payout_value =
            (object.beneficiary_payout_value !== undefined && object.beneficiary_payout_value !== null)
                ? asset.fromPartial(object.beneficiary_payout_value)
                : undefined;
        return message;
    },
};
const tsProtoGlobalThis = (() => {
    if (typeof globalThis !== "undefined") {
        return globalThis;
    }
    if (typeof self !== "undefined") {
        return self;
    }
    if (typeof window !== "undefined") {
        return window;
    }
    if (typeof global !== "undefined") {
        return global;
    }
    throw "Unable to locate global object";
})();
function longToNumber(long) {
    if (long.gt(Number.MAX_SAFE_INTEGER)) {
        throw new tsProtoGlobalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
    }
    return long.toNumber();
}
if (_m0.util.Long !== Long) {
    _m0.util.Long = Long;
    _m0.configure();
}
function isSet(value) {
    return value !== null && value !== undefined;
}
