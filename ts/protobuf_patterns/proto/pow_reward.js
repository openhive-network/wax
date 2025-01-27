/* eslint-disable */
import { asset } from "./asset.js";
export const protobufPackage = "hive.protocol.buffers";
function createBasepow_reward() {
    return { worker: "", reward: undefined };
}
export const pow_reward = {
    fromJSON(object) {
        return {
            worker: isSet(object.worker) ? globalThis.String(object.worker) : "",
            reward: isSet(object.reward) ? asset.fromJSON(object.reward) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.worker !== undefined) {
            obj.worker = message.worker;
        }
        if (message.reward !== undefined) {
            obj.reward = asset.toJSON(message.reward);
        }
        return obj;
    },
    create(base) {
        return pow_reward.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBasepow_reward();
        message.worker = object.worker ?? "";
        message.reward = (object.reward !== undefined && object.reward !== null)
            ? asset.fromPartial(object.reward)
            : undefined;
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
