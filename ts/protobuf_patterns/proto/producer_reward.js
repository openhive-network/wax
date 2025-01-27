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
        return producer_reward.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaseproducer_reward();
        message.producer = object.producer ?? "";
        message.vesting_shares = (object.vesting_shares !== undefined && object.vesting_shares !== null)
            ? asset.fromPartial(object.vesting_shares)
            : undefined;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
