/* eslint-disable */
import { asset } from "./asset.js";
export const protobufPackage = "hive.protocol.buffers";
function createBaseliquidity_reward() {
    return { owner: "", payout: undefined };
}
export const liquidity_reward = {
    fromJSON(object) {
        return {
            owner: isSet(object.owner) ? globalThis.String(object.owner) : "",
            payout: isSet(object.payout) ? asset.fromJSON(object.payout) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.owner !== undefined) {
            obj.owner = message.owner;
        }
        if (message.payout !== undefined) {
            obj.payout = asset.toJSON(message.payout);
        }
        return obj;
    },
    create(base) {
        return liquidity_reward.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaseliquidity_reward();
        message.owner = object.owner ?? "";
        message.payout = (object.payout !== undefined && object.payout !== null)
            ? asset.fromPartial(object.payout)
            : undefined;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
