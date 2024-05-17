/* eslint-disable */
import { asset } from "./asset.js";
export const protobufPackage = "hive.protocol.buffers";
function createBaseclaim_reward_balance() {
    return { account: "", reward_hive: undefined, reward_hbd: undefined, reward_vests: undefined };
}
export const claim_reward_balance = {
    fromJSON(object) {
        return {
            account: isSet(object.account) ? globalThis.String(object.account) : "",
            reward_hive: isSet(object.reward_hive) ? asset.fromJSON(object.reward_hive) : undefined,
            reward_hbd: isSet(object.reward_hbd) ? asset.fromJSON(object.reward_hbd) : undefined,
            reward_vests: isSet(object.reward_vests) ? asset.fromJSON(object.reward_vests) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.account !== undefined) {
            obj.account = message.account;
        }
        if (message.reward_hive !== undefined) {
            obj.reward_hive = asset.toJSON(message.reward_hive);
        }
        if (message.reward_hbd !== undefined) {
            obj.reward_hbd = asset.toJSON(message.reward_hbd);
        }
        if (message.reward_vests !== undefined) {
            obj.reward_vests = asset.toJSON(message.reward_vests);
        }
        return obj;
    },
    create(base) {
        return claim_reward_balance.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseclaim_reward_balance();
        message.account = (_a = object.account) !== null && _a !== void 0 ? _a : "";
        message.reward_hive = (object.reward_hive !== undefined && object.reward_hive !== null)
            ? asset.fromPartial(object.reward_hive)
            : undefined;
        message.reward_hbd = (object.reward_hbd !== undefined && object.reward_hbd !== null)
            ? asset.fromPartial(object.reward_hbd)
            : undefined;
        message.reward_vests = (object.reward_vests !== undefined && object.reward_vests !== null)
            ? asset.fromPartial(object.reward_vests)
            : undefined;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
