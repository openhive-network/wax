/* eslint-disable */
import _m0 from "protobufjs/minimal.js";
import { asset } from "./asset.js";
export const protobufPackage = "hive.protocol.buffers";
function createBasecomment_benefactor_reward() {
    return {
        benefactor: "",
        author: "",
        permlink: "",
        hbd_payout: undefined,
        hive_payout: undefined,
        vesting_payout: undefined,
        payout_must_be_claimed: false,
    };
}
export const comment_benefactor_reward = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.benefactor !== "") {
            writer.uint32(10).string(message.benefactor);
        }
        if (message.author !== "") {
            writer.uint32(18).string(message.author);
        }
        if (message.permlink !== "") {
            writer.uint32(26).string(message.permlink);
        }
        if (message.hbd_payout !== undefined) {
            asset.encode(message.hbd_payout, writer.uint32(34).fork()).ldelim();
        }
        if (message.hive_payout !== undefined) {
            asset.encode(message.hive_payout, writer.uint32(42).fork()).ldelim();
        }
        if (message.vesting_payout !== undefined) {
            asset.encode(message.vesting_payout, writer.uint32(50).fork()).ldelim();
        }
        if (message.payout_must_be_claimed === true) {
            writer.uint32(56).bool(message.payout_must_be_claimed);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasecomment_benefactor_reward();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.benefactor = reader.string();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.author = reader.string();
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.permlink = reader.string();
                    continue;
                case 4:
                    if (tag !== 34) {
                        break;
                    }
                    message.hbd_payout = asset.decode(reader, reader.uint32());
                    continue;
                case 5:
                    if (tag !== 42) {
                        break;
                    }
                    message.hive_payout = asset.decode(reader, reader.uint32());
                    continue;
                case 6:
                    if (tag !== 50) {
                        break;
                    }
                    message.vesting_payout = asset.decode(reader, reader.uint32());
                    continue;
                case 7:
                    if (tag !== 56) {
                        break;
                    }
                    message.payout_must_be_claimed = reader.bool();
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
            benefactor: isSet(object.benefactor) ? String(object.benefactor) : "",
            author: isSet(object.author) ? String(object.author) : "",
            permlink: isSet(object.permlink) ? String(object.permlink) : "",
            hbd_payout: isSet(object.hbd_payout) ? asset.fromJSON(object.hbd_payout) : undefined,
            hive_payout: isSet(object.hive_payout) ? asset.fromJSON(object.hive_payout) : undefined,
            vesting_payout: isSet(object.vesting_payout) ? asset.fromJSON(object.vesting_payout) : undefined,
            payout_must_be_claimed: isSet(object.payout_must_be_claimed) ? Boolean(object.payout_must_be_claimed) : false,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.benefactor !== undefined) {
            obj.benefactor = message.benefactor;
        }
        if (message.author !== undefined) {
            obj.author = message.author;
        }
        if (message.permlink !== undefined) {
            obj.permlink = message.permlink;
        }
        if (message.hbd_payout !== undefined) {
            obj.hbd_payout = asset.toJSON(message.hbd_payout);
        }
        if (message.hive_payout !== undefined) {
            obj.hive_payout = asset.toJSON(message.hive_payout);
        }
        if (message.vesting_payout !== undefined) {
            obj.vesting_payout = asset.toJSON(message.vesting_payout);
        }
        if (message.payout_must_be_claimed !== undefined) {
            obj.payout_must_be_claimed = message.payout_must_be_claimed;
        }
        return obj;
    },
    create(base) {
        return comment_benefactor_reward.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d;
        const message = createBasecomment_benefactor_reward();
        message.benefactor = (_a = object.benefactor) !== null && _a !== void 0 ? _a : "";
        message.author = (_b = object.author) !== null && _b !== void 0 ? _b : "";
        message.permlink = (_c = object.permlink) !== null && _c !== void 0 ? _c : "";
        message.hbd_payout = (object.hbd_payout !== undefined && object.hbd_payout !== null)
            ? asset.fromPartial(object.hbd_payout)
            : undefined;
        message.hive_payout = (object.hive_payout !== undefined && object.hive_payout !== null)
            ? asset.fromPartial(object.hive_payout)
            : undefined;
        message.vesting_payout = (object.vesting_payout !== undefined && object.vesting_payout !== null)
            ? asset.fromPartial(object.vesting_payout)
            : undefined;
        message.payout_must_be_claimed = (_d = object.payout_must_be_claimed) !== null && _d !== void 0 ? _d : false;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
