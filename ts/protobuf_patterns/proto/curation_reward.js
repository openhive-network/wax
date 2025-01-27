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
        return curation_reward.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBasecuration_reward();
        message.curator = object.curator ?? "";
        message.reward = (object.reward !== undefined && object.reward !== null)
            ? asset.fromPartial(object.reward)
            : undefined;
        message.author = object.author ?? "";
        message.permlink = object.permlink ?? "";
        message.payout_must_be_claimed = object.payout_must_be_claimed ?? false;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
