/* eslint-disable */
import _m0 from "protobufjs/minimal.js";
import { asset } from "./asset.js";
export const protobufPackage = "hive.protocol.buffers";
function createBasecuration_reward() {
    return { curator: "", reward: undefined, author: "", permlink: "", payout_must_be_claimed: false };
}
export const curation_reward = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.curator !== "") {
            writer.uint32(10).string(message.curator);
        }
        if (message.reward !== undefined) {
            asset.encode(message.reward, writer.uint32(18).fork()).ldelim();
        }
        if (message.author !== "") {
            writer.uint32(26).string(message.author);
        }
        if (message.permlink !== "") {
            writer.uint32(34).string(message.permlink);
        }
        if (message.payout_must_be_claimed !== false) {
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
                    message.author = reader.string();
                    continue;
                case 4:
                    if (tag !== 34) {
                        break;
                    }
                    message.permlink = reader.string();
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
            curator: isSet(object.curator) ? globalThis.String(object.curator) : "",
            reward: isSet(object.reward) ? asset.fromJSON(object.reward) : undefined,
            author: isSet(object.author) ? globalThis.String(object.author) : "",
            permlink: isSet(object.permlink) ? globalThis.String(object.permlink) : "",
            payout_must_be_claimed: isSet(object.payout_must_be_claimed)
                ? globalThis.Boolean(object.payout_must_be_claimed)
                : false,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.curator !== undefined) {
            obj.curator = message.curator;
        }
        if (message.reward !== undefined) {
            obj.reward = asset.toJSON(message.reward);
        }
        if (message.author !== undefined) {
            obj.author = message.author;
        }
        if (message.permlink !== undefined) {
            obj.permlink = message.permlink;
        }
        if (message.payout_must_be_claimed !== undefined) {
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
        message.author = (_b = object.author) !== null && _b !== void 0 ? _b : "";
        message.permlink = (_c = object.permlink) !== null && _c !== void 0 ? _c : "";
        message.payout_must_be_claimed = (_d = object.payout_must_be_claimed) !== null && _d !== void 0 ? _d : false;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
