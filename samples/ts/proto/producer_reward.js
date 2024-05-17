/* eslint-disable */
import { asset } from "./asset.js";
export const protobufPackage = "hive.protocol.buffers";
function createBaseproducer_reward() {
    return { producer: "", vesting_shares: undefined };
}
export const producer_reward = {
    fromJSON(object) {
        return {
            producer: isSet(object.producer) ? globalThis.String(object.producer) : "",
            vesting_shares: isSet(object.vesting_shares) ? asset.fromJSON(object.vesting_shares) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.producer !== undefined) {
            obj.producer = message.producer;
        }
        if (message.vesting_shares !== undefined) {
            obj.vesting_shares = asset.toJSON(message.vesting_shares);
        }
        return obj;
    },
    create(base) {
        return producer_reward.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseproducer_reward();
        message.producer = (_a = object.producer) !== null && _a !== void 0 ? _a : "";
        message.vesting_shares = (object.vesting_shares !== undefined && object.vesting_shares !== null)
            ? asset.fromPartial(object.vesting_shares)
            : undefined;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
