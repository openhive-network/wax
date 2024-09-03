/* eslint-disable */
import { asset } from "./asset.js";
export const protobufPackage = "hive.protocol.buffers";
function createBasecuration_reward() {
    return { curator: "", reward: undefined, author: "", permlink: "", payout_must_be_claimed: false };
}
export const curation_reward = {
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
