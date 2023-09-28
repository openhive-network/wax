/* eslint-disable */
import _m0 from "protobufjs/minimal.js";
import { asset } from "./asset.js";
export const protobufPackage = "hive.protocol.buffers";
function createBasecuration_reward() {
    return { curator: "", reward: undefined, comment_author: "", comment_permlink: "", payout_must_be_claimed: false };
}
export const curation_reward = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.curator !== "") {
            writer.uint32(10).string(message.curator);
        }
        if (message.reward !== undefined) {
            asset.encode(message.reward, writer.uint32(18).fork()).ldelim();
        }
        if (message.comment_author !== "") {
            writer.uint32(26).string(message.comment_author);
        }
        if (message.comment_permlink !== "") {
            writer.uint32(34).string(message.comment_permlink);
        }
        if (message.payout_must_be_claimed === true) {
            writer.uint32(40).bool(message.payout_must_be_claimed);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasecuration_reward();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.curator = reader.string();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.reward = asset.decode(reader, reader.uint32());
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.comment_author = reader.string();
                    continue;
                case 4:
                    if (tag !== 34) {
                        break;
                    }
                    message.comment_permlink = reader.string();
                    continue;
                case 5:
                    if (tag !== 40) {
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
            curator: isSet(object.curator) ? String(object.curator) : "",
            reward: isSet(object.reward) ? asset.fromJSON(object.reward) : undefined,
            comment_author: isSet(object.comment_author) ? String(object.comment_author) : "",
            comment_permlink: isSet(object.comment_permlink) ? String(object.comment_permlink) : "",
            payout_must_be_claimed: isSet(object.payout_must_be_claimed) ? Boolean(object.payout_must_be_claimed) : false,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.curator !== "") {
            obj.curator = message.curator;
        }
        if (message.reward !== undefined) {
            obj.reward = asset.toJSON(message.reward);
        }
        if (message.comment_author !== "") {
            obj.comment_author = message.comment_author;
        }
        if (message.comment_permlink !== "") {
            obj.comment_permlink = message.comment_permlink;
        }
        if (message.payout_must_be_claimed === true) {
            obj.payout_must_be_claimed = message.payout_must_be_claimed;
        }
        return obj;
    },
    create(base) {
        return curation_reward.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d;
        const message = createBasecuration_reward();
        message.curator = (_a = object.curator) !== null && _a !== void 0 ? _a : "";
        message.reward = (object.reward !== undefined && object.reward !== null)
            ? asset.fromPartial(object.reward)
            : undefined;
        message.comment_author = (_b = object.comment_author) !== null && _b !== void 0 ? _b : "";
        message.comment_permlink = (_c = object.comment_permlink) !== null && _c !== void 0 ? _c : "";
        message.payout_must_be_claimed = (_d = object.payout_must_be_claimed) !== null && _d !== void 0 ? _d : false;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
