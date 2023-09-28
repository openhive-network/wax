/* eslint-disable */
import _m0 from "protobufjs/minimal.js";
import { asset } from "./asset.js";
export const protobufPackage = "hive.protocol.buffers";
function createBaseauthor_reward() {
    return {
        author: "",
        permlink: "",
        hbd_payout: undefined,
        hive_payout: undefined,
        vesting_payout: undefined,
        curators_vesting_payout: undefined,
        payout_must_be_claimed: false,
    };
}
export const author_reward = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.author !== "") {
            writer.uint32(10).string(message.author);
        }
        if (message.permlink !== "") {
            writer.uint32(18).string(message.permlink);
        }
        if (message.hbd_payout !== undefined) {
            asset.encode(message.hbd_payout, writer.uint32(26).fork()).ldelim();
        }
        if (message.hive_payout !== undefined) {
            asset.encode(message.hive_payout, writer.uint32(34).fork()).ldelim();
        }
        if (message.vesting_payout !== undefined) {
            asset.encode(message.vesting_payout, writer.uint32(42).fork()).ldelim();
        }
        if (message.curators_vesting_payout !== undefined) {
            asset.encode(message.curators_vesting_payout, writer.uint32(50).fork()).ldelim();
        }
        if (message.payout_must_be_claimed === true) {
            writer.uint32(56).bool(message.payout_must_be_claimed);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseauthor_reward();
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
                    message.hbd_payout = asset.decode(reader, reader.uint32());
                    continue;
                case 4:
                    if (tag !== 34) {
                        break;
                    }
                    message.hive_payout = asset.decode(reader, reader.uint32());
                    continue;
                case 5:
                    if (tag !== 42) {
                        break;
                    }
                    message.vesting_payout = asset.decode(reader, reader.uint32());
                    continue;
                case 6:
                    if (tag !== 50) {
                        break;
                    }
                    message.curators_vesting_payout = asset.decode(reader, reader.uint32());
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
            author: isSet(object.author) ? String(object.author) : "",
            permlink: isSet(object.permlink) ? String(object.permlink) : "",
            hbd_payout: isSet(object.hbd_payout) ? asset.fromJSON(object.hbd_payout) : undefined,
            hive_payout: isSet(object.hive_payout) ? asset.fromJSON(object.hive_payout) : undefined,
            vesting_payout: isSet(object.vesting_payout) ? asset.fromJSON(object.vesting_payout) : undefined,
            curators_vesting_payout: isSet(object.curators_vesting_payout)
                ? asset.fromJSON(object.curators_vesting_payout)
                : undefined,
            payout_must_be_claimed: isSet(object.payout_must_be_claimed) ? Boolean(object.payout_must_be_claimed) : false,
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
        if (message.hbd_payout !== undefined) {
            obj.hbd_payout = asset.toJSON(message.hbd_payout);
        }
        if (message.hive_payout !== undefined) {
            obj.hive_payout = asset.toJSON(message.hive_payout);
        }
        if (message.vesting_payout !== undefined) {
            obj.vesting_payout = asset.toJSON(message.vesting_payout);
        }
        if (message.curators_vesting_payout !== undefined) {
            obj.curators_vesting_payout = asset.toJSON(message.curators_vesting_payout);
        }
        if (message.payout_must_be_claimed === true) {
            obj.payout_must_be_claimed = message.payout_must_be_claimed;
        }
        return obj;
    },
    create(base) {
        return author_reward.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseauthor_reward();
        message.author = (_a = object.author) !== null && _a !== void 0 ? _a : "";
        message.permlink = (_b = object.permlink) !== null && _b !== void 0 ? _b : "";
        message.hbd_payout = (object.hbd_payout !== undefined && object.hbd_payout !== null)
            ? asset.fromPartial(object.hbd_payout)
            : undefined;
        message.hive_payout = (object.hive_payout !== undefined && object.hive_payout !== null)
            ? asset.fromPartial(object.hive_payout)
            : undefined;
        message.vesting_payout = (object.vesting_payout !== undefined && object.vesting_payout !== null)
            ? asset.fromPartial(object.vesting_payout)
            : undefined;
        message.curators_vesting_payout =
            (object.curators_vesting_payout !== undefined && object.curators_vesting_payout !== null)
                ? asset.fromPartial(object.curators_vesting_payout)
                : undefined;
        message.payout_must_be_claimed = (_c = object.payout_must_be_claimed) !== null && _c !== void 0 ? _c : false;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
