/* eslint-disable */
import { asset } from "./asset.js";
export const protobufPackage = "hive.protocol.buffers";
function createBasecomment_reward() {
    return {
        author: "",
        permlink: "",
        payout: undefined,
        author_rewards: "0",
        total_payout_value: undefined,
        curator_payout_value: undefined,
        beneficiary_payout_value: undefined,
    };
}
export const comment_reward = {
    fromJSON(object) {
        return {
            author: isSet(object.author) ? globalThis.String(object.author) : "",
            permlink: isSet(object.permlink) ? globalThis.String(object.permlink) : "",
            payout: isSet(object.payout) ? asset.fromJSON(object.payout) : undefined,
            author_rewards: isSet(object.author_rewards) ? globalThis.String(object.author_rewards) : "0",
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
        if (message.author !== undefined) {
            obj.author = message.author;
        }
        if (message.permlink !== undefined) {
            obj.permlink = message.permlink;
        }
        if (message.payout !== undefined) {
            obj.payout = asset.toJSON(message.payout);
        }
        if (message.author_rewards !== undefined) {
            obj.author_rewards = message.author_rewards;
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
        message.author_rewards = (_c = object.author_rewards) !== null && _c !== void 0 ? _c : "0";
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
function isSet(value) {
    return value !== null && value !== undefined;
}
